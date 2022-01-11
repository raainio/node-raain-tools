const {FidjService} = require('fidj');

const fidjAppId = process.env.FIDJ_APP_ID;
const fidjDomainId = process.env.FIDJ_DOMAIN_ID;
const fidjLogin = process.env.RAAIN_USER_EMAIL;
const fidjPassword = process.env.RAAIN_USER_PASSWORD;

class RaainImport {

    static _fidj = null;

    static async _init() {

        if (this._fidj) {
            return;
        }

        this._fidj = new FidjService();

        try {
            await this._fidj.init(fidjAppId,
                {
                    logLevel: 2,
                    crypto: false,
                    prod: false,
                    useDB: false
                });
            // login (auto register) your user
            await this._fidj.login(fidjLogin, fidjPassword, fidjDomainId);
            // synchronise your session data (Not in node)
            await this._fidj.sync();
            // put your data into session (not in Node)
            // it will be available everywhere but also offline
            await this._fidj.put({data: 'my session'});
            //... sync, get data and so on
            const roles = await this._fidj.getRoles();
            const endpoints = await this._fidj.getEndpoints();
            const idToken = await this._fidj.getIdToken();
            // console.log('need my token :', roles, endpoints, idToken);

            const response = await this._fidj.sendOnEndpoint('status', 'GET');
            console.log('api status: ', response);

        } catch (err) {
            await this._fidj.logout();
            throw new Error('this.$init error:' + err);
        }

        return Promise.resolve();
    };

    static async createTestTeam() {
        console.log('### TODO');
        await this.$init();

        let response,
            teamHasBeenCreated = true;
        try {
            response = await this._fidj.sendOnEndpoint(
                'teams',
                'GET',
                '?name=raain.admin.test',
                //{name: 'raain.admin.test'}
            );
        } catch (e) {
            if (e.code === 404) {
                teamHasBeenCreated = false;
            }
        }

        if (!teamHasBeenCreated) {
            try {
                response = await this._fidj.sendOnEndpoint(
                    'teams',
                    'POST',
                    '',
                    {name: 'raain.admin.test', email: 'test@test.com'}
                );
            } catch (e) {
                throw new Error('team creation failed:' + e);
            }
        }
        console.log('teams POST response: ', teamHasBeenCreated, response);
    };

    static async createRadars() {
        console.log('### $createRadars');
        await this.$init();

        let response;
        try {
            response = await this._fidj.sendOnEndpoint(
                'radars',
                'POST',
                '',
                {
                    name: 'raain.admin.test',
                    latitude: 5.6,
                    longitude: -4.2
                }
            );
        } catch (e) {
            if (e.code === 409) {
                response = {_id: e.message.data._id}
            }
        }

        let beginDate = new Date('2013-01-01');

        try {
            for (let days = 0; days < 360; days++) {
                for (let minutes = 0; minutes < 1440; minutes += 5) {
                    const values = [];
                    for (let angle = 0.4; angle < 3; angle++) {
                        let value = {angle: angle};
                        const polars = [];
                        for (let azimuth = 0; azimuth < 360; azimuth += 0.5) {
                            let data = [];
                            for (let distance = 0; distance < 200; distance++) {
                                const num = Math.floor(Math.random() * Math.floor(56));
                                data.push(num);
                            }
                            const polar = {
                                azimuth: azimuth,
                                distance: 1,
                                values: data
                            };
                            polars.push(polar);
                        }
                        value.polar = polars;
                        values.push(value);
                    }

                    let measureDate = new Date(beginDate);
                    measureDate.setDate(measureDate.getDate() + days);
                    measureDate.setMinutes(measureDate.getMinutes() + minutes);

                    try {
                        let data = {
                            date: measureDate,
                            values: values
                        };
                        console.log('send data:', data);
                        await this._fidj.sendOnEndpoint(
                            'radars',
                            'POST',
                            '/' + response.id + '/measures',
                            data
                        );
                    } catch (e) {
                        if (e.code !== 409) {
                            throw e;
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }

        console.log('Radars POST response: ', response);
    }

    static async createGauges() {
        console.log('### $createGauges');
        await this.$init();

        let response;
        try {
            response = await this._fidj.sendOnEndpoint(
                'gauges',
                'POST',
                '',
                {
                    name: 'raain.admin.test',
                    latitude: 5.3,
                    longitude: -4.3
                }
            );
        } catch (e) {
            if (e.code === 409) {
                response = {_id: e.message.data._id}
            }
        }

        let beginDate = new Date('2013-01-01');

        try {
            for (let days = 0; days < 360; days++) {
                for (let minutes = 0; minutes < 1440; minutes += 5) {
                    const value = Math.random() * Math.floor(56);
                    let measureDate = new Date(beginDate);
                    measureDate.setDate(measureDate.getDate() + days);
                    measureDate.setMinutes(measureDate.getMinutes() + minutes);

                    try {
                        await this._fidj.sendOnEndpoint(
                            'gauges',
                            'POST',
                            '/' + response._id + '/measures',
                            {
                                date: measureDate,
                                value: value
                            }
                        );
                    } catch (e) {
                        if (e.code !== 409) {
                            throw e;
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }

        console.log('gauges POST response: ', response);
    }
}

module.exports = RaainImport;
