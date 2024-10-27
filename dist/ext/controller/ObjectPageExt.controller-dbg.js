sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/Core",
    "sap/m/BusyDialog"
], function(MessageToast, JSONModel, Fragment, Core, BusyDialog) {
    'use strict';

    return {

        onInit: function(){
            this._oBusyDialog = new BusyDialog();
            this._MessageManager = Core.getMessageManager();
        },

        onSelectedChangeType: function(oEvent) {
            let that = this;
            let selectedValue = oEvent.getParameter("value")
            //let extChangeTitle = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--AfterFacet::YMM_C_MCF_UPDATE::idStandardMaterial::Section");
            let pFiRelatedChange = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idChangePanel::Section");
            let pCCDRelatedChange = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDChangePanel::Section");
            

            if(selectedValue == 'Finance Related'){
                //extChangeTitle.setTitle("Finance Related Change");
                //oFiPanel.setVisible(true);
                //oCCDPanel.setVisible(false);
                pFiRelatedChange.setVisible(true);
                pCCDRelatedChange.setVisible(false);
            }else{
                //extChangeTitle.setTitle("CCD Related Change");
                //oFiPanel.setVisible(false);
                //oCCDPanel.setVisible(true);
                pFiRelatedChange.setVisible(false);
                pCCDRelatedChange.setVisible(true);
            }
            
        },

        onSelectedCountryType: function(oEvent) {
            // let that = this;
            // let selectedValue = oEvent.getParameter("value")
            // let taxType = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::TaxType::Field");
            
        },

        beforeSaveExtension: function(){
            // let oFiPanel = this.byId("idFiChangePanel");
            // let oCCDPanel = this.byId("idCCDChangePanel");
            // oFiPanel.setVisible(false);
            // oCCDPanel.setVisible(false);
        },

        onExit: function(){
            
        },

        onAfterRendering: function(){
            var that = this;
            let sCountry = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field");
            let btn = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::ChangeType::Field");
            
            btn.attachChange(that.onSelectedChangeType, that);
            sCountry.attachChange(that.onSelectedCountryType, that);

            let pFiRelatedChange = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idChangePanel::Section");
            pFiRelatedChange.setVisible(false);

            let pCCDRelatedChange = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDChangePanel::Section");
            pCCDRelatedChange.setVisible(false);
            
        },

       /*
          Function to handle uploading of file when Upload Button is pressed
        */
          handleUploadPress: function(oEvent) {
            var that = this;
            let oFileUploader = this.byId("idFileUploader");

            if (!oFileUploader.getValue()) {
                sap.m.MessageBox.error("Please select a file to upload.");
                return; // Exit the function if no file is selected
            }
            
            this.csrfToken = this.getView().getModel().getSecurityToken();
            oFileUploader.setSendXHR(true);
  
            //Provide CSRF Token
            let oHeaderParamCSRF = new sap.ui.unified.FileUploaderParameter();
            oHeaderParamCSRF.setName('x-csrf-token');
            oHeaderParamCSRF.setValue(this.csrfToken);
            
            //Provide Slug
            let oHeaderParamSlug = new sap.ui.unified.FileUploaderParameter();
            oHeaderParamSlug.setName("slug");
            oHeaderParamSlug.setValue(oFileUploader.getValue());
  
            //Add Content Type
            // let oHeaderParamContent = new sap.ui.unified.FileUploaderParameter();
            // oHeaderParamContent.setName("Content-Type");
            // oHeaderParamContent.setValue(__CONTENT_TYPE_XLS);
            
            this._oBusyDialog.setText("Uploading...");
            this._oBusyDialog.open();

            oFileUploader.checkFileReadable().then(function() {
                oFileUploader.addHeaderParameter(oHeaderParamCSRF);
                oFileUploader.addHeaderParameter(oHeaderParamSlug);
                oFileUploader.addHeaderParameter(oHeaderParamContent);
                oFileUploader.upload();
                oFileUploader.destroyHeaderParameters();
            }, function(error) {
                MessageBox.error("The file cannot be read. It may have changed.");
                this._oBusyDialog.close();
            }).then(function(oData) {
                oFileUploader.clear();
            });
          },

          /* 
            Function to extract response error
        */
        extractErrorMessage: function(xmlString){

            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlString, "text/xml");
            var errorDetails = xmlDoc.getElementsByTagName("errordetail");
        
            return errorDetails;
        },

          /*
            Function to handle upload
          */
          handleUploadComplete: function(oEvent) {
            let that = this;
            let xmlResponse = oEvent.mParameters.responseRaw;
            let errorMessage = this.extractErrorMessage(xmlResponse);
            
            if(errorMessage.length > 0){
                for (var i = 0; i < errorMessage.length; i++) {
                    //Extract Messages
                    let messageNodes = errorMessage[i].getElementsByTagName("message");
                    let severityNodes = errorMessage[i].getElementsByTagName("severity");
                    let msgType;

                    if(messageNodes[0].textContent === 'Exception raised without specific error'){
                        continue;
                    }   

                    //Translate Severity to Proper Type
                    switch(severityNodes[0].textContent){
                        case 'error':
                            msgType = MessageType.Error;
                            break;
                        case 'success':
                            msgType = MessageType.Warning;
                            break;
                        case 'info':
                            msgType = MessageType.Information;  
                            break;  
                        default:
                            msgType = MessageType.None; 
                    }

                    // that._MessageManager.addMessages(
                    //     new Message({
                    //         message: messageNodes[0].textContent,
                    //         type: msgType,//MessageType.Error,
                    //         persistent: true,
                    //         //additionalText: oInput.getLabels()[0].getText(),
                    //         //target: sTarget,
                    //         processor: that.getView().getModel("ErrorMessage")
                    //     })
                    // );
                }
                

                // let errorMessageModel = this.getView().getModel("ErrorMessage");
                // let hasErrors = errorMessageModel && errorMessageModel.getData().length > 0;

                // errButton.setVisible(hasErrors);
                // errButton.setIcon(that.buttonIconFormatter());
                // errButton.setType(that.buttonTypeFormatter());
                // errButton.setText(that.highestSeverityMessages());
                // errButton.setAriaHasPopup("Dialog");

                //Set Visibility of clear button
                // clearButton.setVisible(true);
            }else{
                MessageBox.success("Successfully Uploaded");
            }
            
            this.getOwnerComponent().getModel().refresh(true);
            this._oBusyDialog.close();   

            //Close the Dialog
            // this.oFileUploaderDialog.close();
            // this.oFileUploaderDialog.destroy();
  
          },

          handleCancelPress: function(oEvent){
            // let oFileUploader = this.byId("idFileUploadDialog");
            // oFileUploader.close();
            // oFileUploader.destroy();
          },

       /*
            Save as Draft
       */
       onSaveDraft : function(){
            console.log("Save as draft!");
       }
    };
});