'use strict';

/**
 * Pterodactyl - Daemon
 * Copyright (c) 2015 - 2016 Dane Everitt <dane@daneeveritt.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const Fs = require('fs-extra');

class Config {

    constructor() {
        this.configJson = this._raw();
    }

    _raw() {
        return Fs.readJsonSync('./config/core.json');
    }

    get(key, defaultResponse) {
        let getObject;
        try {
            this.configJson = this._raw(); // Without this things don't ever end up updated...
            getObject = key.split('.').reduce((o, i) => o[i], this.configJson);
        } catch (ex) {
            //
        }

        if (typeof getObject !== 'undefined') {
            return getObject;
        }

        return (typeof defaultResponse !== 'undefined') ? defaultResponse : undefined;
    }

    save(json, next) {
        const self = this;
        if (!json || typeof json !== 'object' || json === null || !Object.keys(json).length) {
            throw new Error('Invalid JSON was passed to Builder.');
        }

        Fs.writeJson('./config/core.json', json, function (err) {
            if (!err) self.configJson = json;
            return next(err);
        });
    }

}

module.exports = Config;
