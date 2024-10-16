sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onEnterKeys: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },

        onAfterRendering: function(){
            console.log("TEST");
        }

    };
});