'use strict';

(function() {
    var jsdoSession,
        jsdoSettings = {
            serviceURI: 'http://telerik-pug.cloudapp.net:8810/Sports',
            catalogURIs: 'http://telerik-pug.cloudapp.net:8810/Sports/static/mobile/SportsService.json',
            authenticationModel: 'anonymous'
        },
        userFunctions = {
            currentUser: function _currentUser() {
                if ($) {
                    var promise = $.Deferred();
                    window.setTimeout(function() {
                        promise.reject();
                    }, 0);
                    return promise;
                }
                return null;
            },
            login: function _login(email, password, done, fail) {
                var promise = jsdoSession.login(email, password);
                promise.done(done);
                promise.fail(fail);
            },
            register: function _register(email, password, attrs, done, fail) {
                return done();
            }
        },
        loadCatalogs = function _loadCatalogs() {
            var promise = $.Deferred(),
                addCatalogFunc = function() {
                    var addCatalog = jsdoSession.addCatalog(jsdoSettings.catalogURIs);
                    addCatalog.done(function _addCatalogDone() {
                        promise.resolve(arguments);
                    });
                    addCatalog.fail(function _addCatalogDone() {
                        promise.reject(arguments);
                    });
                };
            if (jsdoSession && jsdoSession.catalogURIs && jsdoSession.catalogURIs.length) {
                promise.resolve();
            } else {
                if (jsdoSettings.authenticationModel === 'anonymous' && jsdoSession.loginResult !== progress.data.Session.LOGIN_SUCCESS) {
                    var login = jsdoSession.login('', '');
                    login.done(function() {
                        addCatalogFunc();
                    });
                    login.fail(function() {
                        promise.reject(arguments);
                    });
                } else {
                    addCatalogFunc();
                }
            }
            return promise;
        };
    progress.util.jsdoSettingsProcessor(jsdoSettings);
    jsdoSession = new progress.data.JSDOSession(jsdoSettings);
    app.data.progressDataProvider1 = {
        settings: jsdoSettings,
        session: jsdoSession,
        Users: userFunctions,
        loadCatalogs: loadCatalogs
    };

}());

// START_CUSTOM_CODE_progressDataProvider1
// END_CUSTOM_CODE_progressDataProvider1