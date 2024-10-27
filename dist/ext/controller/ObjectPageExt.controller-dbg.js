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
       },

       /**
        * Set up the file uploader component for the specified object.
        * 
        * @function
        * @private
        * @param {string} sObject - The main object identifier.
        */
        _setFileUploader: function (sObject) { // like ‘ZMY_OBJ’
            const that = this;
            const sId = "idattachmentComponentContainer";
            const sKey = "MCFU-TH100000852";
            let oModelSkey = new JSONModel(sKey);

            that.setModel("sKey", oModelSkey);

            // Check if FileUploader does not exist yet 
            const oCurrentFileUploader = this.byId(sId).getComponent();

            if (oCurrentFileUploader === null) {
                // Create Object Key
                const sObjKey = sKey; //this._generateUniqueObjectKey();
                //this._storeTempKeyInModel(sObjKey);
                
                // Create Upload Component
                const oPromise = this.getOwnerComponent().createComponent({
                    usage: "attachmentReuseComponent",
                    settings: {
                        mode: "I",
                        objectKey: sObjKey,
                        objectType: sObject,
                        onupload: [that.handleUpload, that],
                        ondelete: [that.handleDelete, that]
                        }
                    });

                // Set upload component
                oPromise.then(function (attachmentComponent) {
                    const oAttrList = attachmentComponent.getAttributes();
                    const oUpdatedAttrList = this._prepareAttrList(oAttrList);

                    attachmentComponent.setAttributes(oUpdatedAttrList);
                    that.byId(sId).setComponent(attachmentComponent);

                    // Update counter for uploading files
                    attachmentComponent
                        .page
                        .getController()
                        .getUploadCollectionControl()
                        .attachBeforeUploadStarts(
                            function (oEvent) {
                                that.fileUploadBusyCounter++;
                            }
                        );
                }.bind(this));
            }
        },

        /**
        * Makes a backend call to a given path to perform an action.
        * 
        * @function
        * @private
        * @param {string} sPath - Path for the OData service.
        * @param {Object} oContext - Context to be used for the action.
        * @param {string} sTempKeyPath - Path of temporary key for the object.
        * @param {string} sCurrentFileUploader - Current file uploader context.
        * 
        */
        _makeBackendCall: function (sPath, oContext) {
            const oViewModel = this.getView().getModel();

            // Set the payload
            const oData = {
                d: oContext.getObject()
            };

            // Clean up the oData from __metadata attribute
            delete oData.d.__metadata;

            // Add headers
            const sTempObjKey = this._getTempKeyFromModel();

            oViewModel.setHeaders({
                'temp-obj-key': sTempObjKey
            })

            // Call backend for simulation
            oViewModel.create(sPath, oData, {
                // Callback functions for success and error
            });
        },

        /**
        * Handles the upload event and processes the uploaded attachment.
        * Depending on the source container, it saves the attachment to the respective data model path.
        * 
        * @function
        * @public
        * @param {sap.ui.base.Event} oEvent - The event triggered by the attachment upload.
        * @returns {void}
        */
        handleUpload: function (oEvent) {
            const { status, fileName } = oEvent.getParameters();
            const sDataPath = '/attachmentString';

            if (status === 'UPLOADSUCCESS') {
                this._addAttachmentToString(fileName, sDataPath);

                // Update counter for uploading files
                this.fileUploadBusyCounter--;
                
                // Add more logic if needed
            }
        },

        /**
        * Handles the delete event and removes the deleted attachment.
        * Depending on the source container, it removes the attachment from the respective data model path.
        * 
        * @function
        * @public
        * @param {sap.ui.base.Event} oEvent - The event triggered by the attachment deletion.
        * @returns {void}
        */
        handleDelete: function (oEvent) {
            const { status, fileName } = oEvent.getParameters();
            const sDataPath = '/attachmentString';

            if (status === 'DELETED') {
                this._removeAttachmentFromString(fileName, sDataPath);
                // Add more logic if needed
            }
        },

        /**
        * Prepares the attributes list by setting visibility attributes and actions.
        * 
        * @function
        * @private
        * @param {object} oList - The list of attributes.
        * @returns {object} The updated list of attributes.
        */
        _prepareAttrList: function (oList) {
            // Determine visible attributes
            const aVisibleAttributes = [
                'UPLOADEDBY', 
                'UPLOADEDON', 
                'FILESIZE', 
                'ENABLELINK', 
                'ATTACHMENTSTATUS',
                'ATTACHMENTTITLE', 
                'DIRDETAILS', 
                'SOURCE'
            ];

            // Determine visible actions
            const aVisibleActions = ['DELETE', 'ADD'];

            // Set visible attributes
            Object.keys(oList._VisibleAttributes).forEach((sAttribute) => {
                oList._VisibleAttributes[sAttribute] = aVisibleAttributes.includes(sAttribute);
            });

            // Set visible actions
            Object.keys(oList._VisibleActions).forEach((sAction) => {
                oList._VisibleActions[sAction] = aVisibleActions.includes(sAction);
            });

            return oList;
        },

        /**
        * Deletes uploaded attachments.
        * 
        * @function
        * @private
        */
        _deleteUploadedAttachments: function () {
            const oUploadComponent = this
                                        .byId('attachmentComponentContainer')
                                        .getComponentInstance();

            if (oUploadComponent) {
                oUploadComponent.cancel(false);
            }
        }

    };
});