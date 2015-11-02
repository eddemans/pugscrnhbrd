'use strict';

app.dataListViewCust = kendo.observable({
    onShow: function() {},
    afterShow: function() {},
    isUpdated:false,
    showEditDelete:true
    
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
                        'City': {
                            field: 'City',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource({
            pageSize: 50
        }),
addCustModel = kendo.observable({
            dataSource:dataSource,
            dataSourceOptions:dataSourceOptions,
            jsdoOptions:jsdoOptions,
            addItem:null,
            addShow:function(e){
                 var jsdo = dataListViewCustModel.dataSource.transport.jsdo;
                 var jsrow = jsdo.add();
               
                  addCustModel.set('addItem', jsrow.data);
            },
             add :function(e){
              console.log("add"); 
                var jsdo = dataListViewCustModel.dataSource.transport.jsdo;
               
                 var jsrow = jsdo.assign(addCustModel.addItem);
                 jsdo.subscribe('AfterSaveChanges', function callback(jsdo,success,request) {
                       jsdo.unsubscribe('AfterSaveChanges', callback, jsdo);
                                                                                                var data;
                        if (success) {
                                                                  if (request.batch
                                     && request.batch.operations instanceof Array
                                     && request.batch.operations.length == 1) {
                                     data = request.batch.operations[0].jsrecord.data;
                                }
                             app.mobileApp.navigate('#:back');
                        }
                        else {
                            var cError = "Created Error: " + dataListViewCustModel.normalizeError(request);
                          
                            
                            alert(cError);
                            jsdo.add(addCustModel.addItem);
                            console.log(cError);
                        }                                       
                                                                       
                   },jsdo);
                  jsdo.saveChanges();   
                
          
            
        }
        }),
        dataListViewCustModel = kendo.observable({
            addRecord: null,
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
            currentItem: null,
            edit: function() {
                app.dataListViewCust.set('isUpdated',true);
                app.dataListViewCust.set('showEditDelete',false); 	
            },
            cancel: function() {
                app.dataListViewCust.set('isUpdated',false);
                app.dataListViewCust.set('showEditDelete',true); 	
            },
            cancelDelete :function(){
                 $("#modalview-confirm").kendoMobileModalView("close");
            },

            normalizeError: function(request){
               var cerror ="";
                
               if( request.batch
                  && request.batch.operations instanceof Array 
                  && request.batch.operations.length > 0) {
                       cerror = request.batch.operations[0].xhr.response;
                   
               }
                return cerror;
            },
            delete: function(e){
                this.cancelDelete();
                    var jsdo = dataListViewCustModel.dataSource.transport.jsdo;
                 var jsrow = jsdo.findById(dataListViewCustModel.currentItem._id);
                var afterDeleteFn;
                if(jsrow) {
                    jsrow.remove();

                    afterDeleteFn = function(jsdo, record, success, request) {
                        /* unsubscribe so this fn doesn't execute for some other event */               
                        jsdo.unsubscribe('afterDelete', afterDeleteFn);

                        if (success === true) {
                                       app.mobileApp.navigate('#:back');
                        }
                        else {
                           var cError = "Delete Error: " + dataListViewCustModel.normalizeError(request); 
                            alert(cError);
                            console.log(cError);
                        }
           			};
                
                   jsdo.subscribe('afterDelete', afterDeleteFn);
               	   jsdo.saveChanges();  	
                }
            },
            submit :  function(e) {
                console.log("submit");
                var jsdo = dataListViewCustModel.dataSource.transport.jsdo;
                var jsrow = jsdo.findById(dataListViewCustModel.currentItem._id);
                var afterUpdateFn;

          
                jsrow.assign(dataListViewCustModel.currentItem);
                afterUpdateFn = function(jsdo, record, success, request) {
                    /* unsubscribe so this fn doesn't execute for some other event */              
                    jsdo.unsubscribe('afterUpdate', afterUpdateFn);

                    if (success === true) {
                    app.mobileApp.navigate('#:back');

                    }
                    else {
                       var cError = "Update Error: " + dataListViewCustModel.normalizeError(request);
                        alert(cError);
                        console.log(cError);
                    }
          		 };
               jsdo.subscribe('afterUpdate', afterUpdateFn);

               jsdo.saveChanges();          
       		 }
        });

    parent.set('dataListViewCustModel', dataListViewCustModel);
    parent.set('addCustModel',addCustModel);
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