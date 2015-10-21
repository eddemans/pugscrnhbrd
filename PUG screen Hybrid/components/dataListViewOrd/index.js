'use strict';

app.dataListViewOrd = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_dataListViewOrd
// END_CUSTOM_CODE_dataListViewOrd
(function(parent) {
    var dataProvider = app.data.progressDataProvider1,
        jsdoOptions = {
            name: 'Order',
            autoFill: false
        },
        dataSourceOptions = {
            type: 'jsdo',
            transport: {},

            schema: {
                model: {
                    fields: {
                        'Ordernum': {
                            field: 'Ordernum',
                            defaultValue: ''
                        },
                        'CustNum': {
                            field: 'CustNum',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource({
            pageSize: 50
        }),
        dataListViewOrdModel = kendo.observable({
            dataSource: dataSource,
            dataSourceOptions: dataSourceOptions,
            jsdoOptions: jsdoOptions
        });

    parent.set('dataListViewOrdModel', dataListViewOrdModel);
    parent.set('onShow', function() {
        dataProvider.loadCatalogs().then(function _catalogsLoaded() {
            var jsdoOptions = dataListViewOrdModel.get('jsdoOptions').toJSON(),
                jsdo = new progress.data.JSDO(jsdoOptions),
                dataSourceOptions = dataListViewOrdModel.get('dataSourceOptions').toJSON(),
                dataSource;

            dataSourceOptions.transport.jsdo = jsdo;
            dataSource = new kendo.data.DataSource(dataSourceOptions);
            dataListViewOrdModel.set('dataSource', dataSource);
        });
    });

})(app.dataListViewOrd);

// START_CUSTOM_CODE_dataListViewOrdModel
// you can handle the beforeFill / afterFill events here. For example:
/*
app.dataListViewOrd.dataListViewOrdModel.jsdoOptions.events = {
    'beforeFill' : [ {
        scope : app.dataListViewOrd.dataListViewOrdModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_dataListViewOrdModel