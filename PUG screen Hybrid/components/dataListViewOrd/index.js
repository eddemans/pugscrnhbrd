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
            jsdoOptions: jsdoOptions,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/dataListViewOrd/details.html?uid=' + e.dataItem.uid);
			},
			
			detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = dataListViewOrdModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.OrdNum) {
                    itemModel.OrdNum = String.fromCharCode(160);
                }
                dataListViewOrdModel.set('currentItem', itemModel);
            },
                        /* MAS */
        submit :  function(e) {
            console.log("submit");
            var jsdo = dataListViewOrdModel.dataSource.transport.jsdo;
            var jsrow = jsdo.findById(dataListViewOrdModel.currentItem._id);
             var afterUpdateFn;
                jsrow.assign(dataListViewOrdModel.currentItem);
           
            afterUpdateFn = function(jsdo, record, success, request) {
                /* unsubscribe so this fn doesn't execute for some other event */              
                jsdo.unsubscribe('afterUpdate', afterUpdateFn);
               
                if (success === true) {
                app.mobileApp.navigate('#:back');
                  
                }
                else {
                    cError = "Update Error: " + dataListViewOrdModel.normalizeError(request, record);
                    app.showError(cError);
                    console.log(cError);
                }
           };
                       jsdo.subscribe('afterUpdate', afterUpdateFn);
 
            jsdo.saveChanges();          
        },
        cancel : function(e) {console.log("cancel")},
        /* end MAS */
 
            currentItem: null
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