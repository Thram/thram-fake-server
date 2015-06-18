/**
 * Created by thram on 14/06/15.
 */
var Chance = require('chance'), _ = require('lodash');
var fakeData = (function () {
    var chance = new Chance();

    // Look for options in http://chancejs.com/. Thanks!
    var dataTypes = {
        basics: {
            boolean: {chance: 'bool', label: 'Boolean'},
            character: {chance: 'character', label: 'Character'},
            floating: {chance: 'floating', label: 'Floating'},
            integer: {chance: 'integer', label: 'Integer'},
            natural: {chance: 'natural', label: 'Natural'},
            string: {chance: 'string', label: 'String'}
        },
        text: {
            paragraph: {chance: 'paragraph', label: 'Paragraph'},
            sentence: {chance: 'sentence', label: 'Sentence'},
            syllable: {chance: 'syllable', label: 'Syllable'},
            word: {chance: 'word', label: 'Word'}
        },
        person: {
            age: {chance: 'age', label: 'Age'},
            birthday: {chance: 'birthday', label: 'Birthday'},
            first: {chance: 'first', label: 'First name'},
            gender: {chance: 'gender', label: 'Gender'},
            last: {chance: 'last', label: 'Last name'},
            full_name: {chance: 'name', label: 'Full name'},
            prefix: {chance: 'prefix', label: 'Name prefix'},
            ssn: {chance: 'ssn', label: 'Social security number'},
            suffix: {chance: 'suffix', label: 'Name suffix'}
        },
        mobile: {
            android_id: {chance: 'android_id', label: 'GCM registration ID'},
            apple_token: {chance: 'apple_token', label: 'Apple Push Token'},
            bb_pin: {chance: 'bb_pin', label: 'BlackBerry Device PIN'},
            wp7_anid: {chance: 'wp7_anid', label: 'Windows Phone 7 ANID'},
            wp8_anid2: {chance: 'wp8_anid2', label: 'Windows Phone 8 ANID2'}
        },
        web: {
            color: {chance: 'color', label: 'Color'},
            domain: {chance: 'domain', label: 'Domain'},
            email: {chance: 'email', label: 'Email'},
            fbid: {chance: 'fbid', label: 'Facebook ID'},
            google_analytics: {chance: 'google_analytics', label: 'Google Analytics tracking code'},
            hashtag: {chance: 'hashtag', label: 'Hashtag'},
            ip: {chance: 'ip', label: 'IPv4'},
            ipv6: {chance: 'ipv6', label: 'IPv6'},
            tld: {chance: 'tld', label: 'Top Level Domain'},
            twitter: {chance: 'twitter', label: 'Twitter'},
            url: {chance: 'url', label: 'URL'}
        },
        location: {
            address: {chance: 'address', label: 'Address'},
            altitude: {chance: 'altitude', label: 'Altitude'},
            areacode: {chance: 'areacode', label: 'Area code'},
            city: {chance: 'city', label: 'City name'},
            coordinates: {chance: 'coordinates', label: 'Coordinates'},
            country: {chance: 'country', label: 'Country'},
            depth: {chance: 'depth', label: 'Depth'},
            geohash: {chance: 'geohash', label: 'Geohash'},
            latitude: {chance: 'latitude', label: 'Latitude'},
            longitude: {chance: 'longitude', label: 'Longitude'},
            phone: {chance: 'phone', label: 'Phone'},
            province: {chance: 'province', label: 'Province'},
            state: {chance: 'state', label: 'State'},
            street: {chance: 'street', label: 'Street'},
            zip: {chance: 'zip', label: '(U.S.) zip code'}
        },
        time: {
            ampm: {chance: 'ampm', label: 'AM/PM'},
            date: {chance: 'date', label: 'Date'},
            hammertime: {chance: 'hammertime', label: 'Hammertime'},
            hour: {chance: 'hour', label: 'Hour'},
            millisecond: {chance: 'millisecond', label: 'Millisecond'},
            minute: {chance: 'minute', label: 'Minute'},
            month: {chance: 'month', label: 'Month'},
            second: {chance: 'second', label: 'Second'},
            timestamp: {chance: 'timestamp', label: 'Timestamp'},
            year: {chance: 'year', label: 'Year'}
        },
        finance: {
            cc: {chance: 'cc', label: 'Credit card number'},
            cc_type: {chance: 'cc_type', label: 'Credit card type'},
            currency: {chance: 'currency', label: 'Currency'},
            currency_pair: {chance: 'currency_pair', label: 'Currency pair'},
            dollar: {chance: 'dollar', label: 'Dollar amount'},
            exp: {chance: 'exp', label: 'Credit card expiration'},
            exp_month: {chance: 'exp_month', label: 'Credit card expiration month'},
            exp_year: {chance: 'exp_year', label: 'Credit card expiration year'}
        }

    };

    function _processObjectSchema(obj) {
        var data = {};

        _.forEach(obj, function (value, key) {
            if (_.isObject(value)) {
                _processObjectSchema(value);
            } else {
                data[key] = chance[value]();
            }
        });
        return data;
    }

    function generateFromSchema(schema, quantity) {
        quantity = quantity || 1;
        var data = [];
        for (var i = 0; i < quantity; i++) {
            var item = _processObjectSchema(schema);
            data.push(item);
        }
        return data.length == 1 ? data[0] : data;
    }

    function listDataTypes() {
        return dataTypes;
    }

    return {
        listDataTypes: listDataTypes,
        generateFromSchema: generateFromSchema
    }
})();

module.exports = fakeData;