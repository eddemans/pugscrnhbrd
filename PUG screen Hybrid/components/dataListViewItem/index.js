'use strict';

app.dataListViewItem = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_dataListViewItem
// END_CUSTOM_CODE_dataListViewItem
(function(parent) {
    var dataProvider = app.data.progressDataProvider1,
        jsdoOptions = {
            name: 'Item',
            autoFill: false
        },
        dataSourceOptions = {
            type: 'jsdo',
            transport: {},

            schema: {
                model: {
                    fields: {
                        'ItemName': {
                            field: 'ItemName',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource({
            pageSize: 50
        }),
        dataListViewItemModel = kendo.observable({
            dataSource: dataSource,
            dataSourceOptions: dataSourceOptions,
            jsdoOptions: jsdoOptions,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/dataListViewItem/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = dataListViewItemModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.ItemName) {
                    itemModel.ItemName = String.fromCharCode(160);
                }
                dataListViewItemModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('dataListViewItemModel', dataListViewItemModel);
    parent.set('onShow', function() {
        dataProvider.loadCatalogs().then(function _catalogsLoaded() {
            var jsdoOptions = dataListViewItemModel.get('jsdoOptions').toJSON(),
                jsdo = new progress.data.JSDO(jsdoOptions),
                dataSourceOptions = dataListViewItemModel.get('dataSourceOptions').toJSON(),
                dataSource;

            dataSourceOptions.transport.jsdo = jsdo;
            dataSource = new kendo.data.DataSource(dataSourceOptions);
            dataListViewItemModel.set('dataSource', dataSource);
        });
    });

})(app.dataListViewItem);

// START_CUSTOM_CODE_dataListViewItemModel
// you can handle the beforeFill / afterFill events here. For example:
/*
app.dataListViewItem.dataListViewItemModel.jsdoOptions.events = {
    'beforeFill' : [ {
        scope : app.dataListViewItem.dataListViewItemModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_dataListViewItemModel