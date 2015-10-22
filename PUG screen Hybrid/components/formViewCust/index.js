'use strict';

app.formViewCust = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_formViewCust
// END_CUSTOM_CODE_formViewCust
(function(parent) {
    var formViewCustModel = kendo.observable({
        fields: {
            customerName: '',
        },
        submit: function() {},
        cancel: function() {}
    });

    parent.set('formViewCustModel', formViewCustModel);
})(app.formViewCust);

// START_CUSTOM_CODE_formViewCustModel
// END_CUSTOM_CODE_formViewCustModel