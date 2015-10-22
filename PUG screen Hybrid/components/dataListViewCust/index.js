'use strict';

app.dataListViewCust = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_dataListViewCust
// END_CUSTOM_CODE_dataListViewCust
(function(parent) {
    var dataProvider = app.data.progressDataProvider1,
        jsdoOptions = {
            name: 'Customer',
            autoFill: false
        },
        dataSourceOptions = {
            type: 'jsdo',
            transport: {},

            schema: {
                model: {
                    fields: {
                        'Name': {
                            field: 'Name',
                            defaultValue: ''
                        },
                        'SalesRep': {
                            field: 'SalesRep',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource({
            pageSize: 50
        }),
        dataListViewCustModel = kendo.observable({
            dataSource: dataSource,
            dataSourceOptions: dataSourceOptions,
            jsdoOptions: jsdoOptions,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/dataListViewCust/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = dataListViewCustModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.Name) {
                    itemModel.Name = String.fromCharCode(160);
                }
                dataListViewCustModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('dataListViewCustModel', dataListViewCustModel);
    parent.set('onShow', function() {
        dataProvider.loadCatalogs().then(function _catalogsLoaded() {
            var jsdoOptions = dataListViewCustModel.get('jsdoOptions').toJSON(),
                jsdo = new progress.data.JSDO(jsdoOptions),
                dataSourceOptions = dataListViewCustModel.get('dataSourceOptions').toJSON(),
                dataSource;

            dataSourceOptions.transport.jsdo = jsdo;
            dataSource = new kendo.data.DataSource(dataSourceOptions);
            dataListViewCustModel.set('dataSource', dataSource);
        });
    });

})(app.dataListViewCust);

// START_CUSTOM_CODE_dataListViewCustModel
// you can handle the beforeFill / afterFill events here. For example:
/*
app.dataListViewCust.dataListViewCustModel.jsdoOptions.events = {
    'beforeFill' : [ {
        scope : app.dataListViewCust.dataListViewCustModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_dataListViewCustModel