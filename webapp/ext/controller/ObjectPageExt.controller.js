sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], function(MessageToast, JSONModel) {
    'use strict';

    return {
        onSelectedChangeType: function(oEvent) {
            let that = this;
            let selectedValue = oEvent.getParameter("value")
            let extChangeTitle = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--AfterFacet::YMM_C_MCF_UPDATE::idStandardMaterial::Section");
            let oFiPanel = that.byId("idFiChangePanel");
            let oCCDPanel = that.byId("idCCDChangePanel");

            if(selectedValue == 'Finance Related'){
                extChangeTitle.setTitle("Finance Related Change");
                oFiPanel.setVisible(true);
                oCCDPanel.setVisible(false);
            }else{
                extChangeTitle.setTitle("CCD Related Change");
                oFiPanel.setVisible(false);
                oCCDPanel.setVisible(true);
            }
            
        },

        onInit: function(){
           
        },

        beforeSaveExtension: function(){
            let oFiPanel = this.byId("idFiChangePanel");
            let oCCDPanel = this.byId("idCCDChangePanel");
            oFiPanel.setVisible(false);
            oCCDPanel.setVisible(false);
        },

        onExit: function(){
            
        },

        onAfterRendering: function(){
            var that = this;
            let btn = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::ChangeType::Field");
            btn.attachChange(that.onSelectedChangeType, that);

            //Get The Audit Trail
            
        },

        /*
            Upload Button for Attachment
        */
       handleUploadPress : function(){
        var oFileUploader = this.byId("idFileUploader");
        oFileUploader.checkFileReadable().then(function() {
            oFileUploader.upload();
        }, function(error) {
            MessageToast.show("The file cannot be read. It may have changed.");
        }).then(function() {
            oFileUploader.clear();
        });
       },

       /*
            Attachment Upload Complete
       */
       handleUploadComplete: function(oEvent) {
        var sResponse = oEvent.getParameter("response"),
            aRegexResult = /\d{4}/.exec(sResponse),
            iHttpStatusCode = aRegexResult && parseInt(aRegexResult[0]),
            sMessage;

        if (sResponse) {
            sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
            MessageToast.show(sMessage);
        }
       },

       /*
            Save as Draft
       */
       onSaveDraft : function(){
            console.log("Save as draft!");
       }
    };
});