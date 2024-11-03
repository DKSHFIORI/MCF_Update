const __attachmentTable = "idItemsUploadSet";

sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/Core",
    "sap/m/BusyDialog",
    "sap/ui/core/library",
    "sap/m/library",
    "sap/m/UploadCollectionParameter",
    "sap/ui/core/Item",
    "sap/m/MessageBox"
], function(MessageToast, JSONModel, Fragment, Core, BusyDialog, coreLibrary, MobileLibrary, UploadCollectionParameter, Item, MessageBox) {
    'use strict';

    var MessageType = coreLibrary.MessageType;
    var ListMode = MobileLibrary.ListMode;
    return {

        onInit: function(){
            this._oBusyDialog = new BusyDialog();
            this._MessageManager = Core.getMessageManager();

            // Create a JSON model to hold file data locally
            const oLocalModel = new JSONModel({
                items: [],
                attachments: []
            });
            this.getView().setModel(oLocalModel, "localModel");
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

            //Attach a function after saving
            this.extensionAPI.getTransactionController().attachAfterSave(that.onAfterSave.bind(this));

            // //Initiate File Upload
            // var oUploadSet = this.byId(__attachmentTable);

			// oUploadSet.getList().setMode(ListMode.MultiSelect);

			// // Modify "add file" button
			// oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			// oUploadSet.getDefaultFileUploader().setTooltip("");
			// oUploadSet.getDefaultFileUploader().setIconOnly(true);
			// oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
            
        },

        onAfterSave: function(){
            var that = this;
            // Use the OData model's 'batchRequestCompleted' event to determine if save was successful
            var oModel = that.getView().getModel();
            oModel.attachEventOnce("batchRequestCompleted", function(oEvent) {
                var bSuccess = that._checkBatchRequestSuccess(oEvent);

                if (bSuccess) {
                    // If successful, proceed with the file attachment
                    //that.handleUploadPress();
                    that.onStartUpload();
                } else {
                    // Log or handle errors accordingly
                    console.error("Save failed, skipping attachment upload");
                }
            });
        },

        // Function to check if the batch request was successful
        _checkBatchRequestSuccess: function(oEvent) {
            var aRequests = oEvent.getParameter("requests");
            var bSuccess = true;

            // Check if any request within the batch has failed
            aRequests.forEach(function(oRequest) {
                if (!oRequest.success) {
                    bSuccess = false;  // If any request failed, mark the batch as failed
                }
            });

            return bSuccess;
        },

        onStartUpload: function(){
            // Get the data from the local model and send it to the OData service
            const oLocalModel = this.getView().getModel("localModel");
            const aItems = oLocalModel.getProperty("/attachments");

            // Process each file in aItems to send to the backend
            aItems.forEach(file => {
                this._uploadFileToOData(file);
            });

            MessageToast.show("Files are being uploaded.");


            // var oHeaderParameter;
            // let that = this;
            // var vProduct = that.getView().getBindingContext().getObject().Product;

            // var oAttachmentUpl = this.byId(__attachmentTable);
            // var aIncompleteItems = oAttachmentUpl.getIncompleteItems();
            // that.iIncompleteItems = aIncompleteItems.length; //used to turn off busy indicator upon completion of all pending uploads
            // if (this.iIncompleteItems !== 0) {
            //     oAttachmentUpl.setBusy(true);
            //     this.i = 0; //used to turn off busy indicator when all uploads complete
            //     for (var i = 0; i < this.iIncompleteItems; i++) {
            //         var sFileName = aIncompleteItems[i].getProperty("fileName");
            //         //Provide CSRF Token
            //         let oXCSRFToken = new sap.ui.unified.FileUploaderParameter();
            //         oXCSRFToken.setName('x-csrf-token');
            //         oXCSRFToken.setValue(this.csrfToken);

            //         let oSlug = new sap.ui.unified.FileUploaderParameter();
            //         oXCSRFToken.setName('slug');
            //         oXCSRFToken.setValue(sFileName);

            //         let oHeaderMaterial = new sap.ui.unified.FileUploaderParameter();
            //         oXCSRFToken.setName('Material');
            //         oXCSRFToken.setValue(vProduct);

            //         // var oXCSRFToken = new sap.ui.core.Item({
            //         //     key: "x-csrf-Token",
            //         //     text: that.getOwnerComponent().getModel().getSecurityToken()
            //         // });
            //         // var oSlug = new sap.ui.core.Item({
            //         //     key: "slug",
            //         //     text: sFileName
            //         // });
            //         // var oHeaderMaterial = new sap.ui.core.Item({
            //         //     key: "Material",   // Replace with your header key
            //         //     text: vProduct // Replace with your header value
            //         // });
            //         oAttachmentUpl.addHeaderField(oXCSRFToken).addHeaderField(oSlug).addHeaderField(oHeaderMaterial);
            //         oAttachmentUpl.uploadItem(aIncompleteItems[i]);
            //         oAttachmentUpl.removeAllHeaderFields(); //at least slug header field must be reset after each upload
            //     }
            // }
        },

        onUploadCompleted: function() {
            const model = this.getView().getModel();
            model.refresh(); // Refresh the model to get updated data after upload
            
         },

         tryUpload: function(){
            this.onStartUpload();
         },

         _uploadFileToOData: function (file) {
            var that = this;
            let oFileUploader = this.byId("fileUploader");
            const oModel = this.getView().getModel(); // ODataModel instance
            const oLocalModel = this.getView().getModel("localModel");
            const aAttachments = oLocalModel.getProperty("/attachments") || [];
            var vProduct = this.getView().getBindingContext().getObject().Product;

            if (aAttachments.length === 0) {
                sap.m.MessageToast.show("No attachments to upload.");
                return;
            }

            // Get CSRF token
            var csrfToken = this.getView().getModel().getSecurityToken();

            aAttachments.forEach((fileData) => {
                csrfToken = that.getView().getModel().getSecurityToken();

                let oHeaderParamCSRF = new sap.ui.unified.FileUploaderParameter();
                oHeaderParamCSRF.setName('x-csrf-token');
                oHeaderParamCSRF.setValue(csrfToken);

                //Provide Slug
                let oHeaderParamSlug = new sap.ui.unified.FileUploaderParameter();
                oHeaderParamSlug.setName("slug");
                oHeaderParamSlug.setValue(encodeURIComponent(fileData.Filename));

                //Add Content Type MAterial
                let oHeaderParamMaterial = new sap.ui.unified.FileUploaderParameter();
                oHeaderParamMaterial.setName("Material");
                oHeaderParamMaterial.setValue(vProduct);

                // Set the upload URL dynamically if needed
                oFileUploader.setUploadUrl("/sap/opu/odata/sap/YGW_MM_MCF_UPDATE_SRV/UploadFileSet");

                // Add headers
                oFileUploader.checkFileReadable().then(function() {
                    oFileUploader.addHeaderParameter(oHeaderParamCSRF);
                    oFileUploader.addHeaderParameter(oHeaderParamSlug);
                    oFileUploader.addHeaderParameter(oHeaderParamMaterial);
                    oFileUploader.upload();
                    oFileUploader.destroyHeaderParameters();
                }, function(error) {
                    MessageBox.error("The file cannot be read. It may have changed.");
                    this._oBusyDialog.close();
                }).then(function(oData) {
                    oFileUploader.clear();
                });

            });

            // Clear the local attachments model after upload
            oLocalModel.setProperty("/attachments", []);
            oLocalModel.updateBindings();
        },

        _base64ToBlob: function (base64, mimeType) {
            const byteCharacters = atob(base64);
            const byteArrays = [];
        
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
        
            return new Blob(byteArrays, { type: mimeType });
        },

         onAfterItemAdded: function (oEvent) {

            const model = this.getView().getModel(); // ODataModel instance
            const item = oEvent.getParameter("item"); // UploadSetItem instance
             // Get the local model and existing items
            const oLocalModel = this.getView().getModel("localModel");
            if (!oLocalModel) {
                oLocalModel = new sap.ui.model.json.JSONModel({ items: [] });
                this.getView().setModel(oLocalModel, "localModel");
            };
            const aItems = oLocalModel.getProperty("/items") || [];
            const uploadSet = this.byId("idItemsUploadSet"); // Assuming "UploadSet" is the ID of your UploadSet control
            const staticUploadUrl = "/sap/opu/odata/sap/YGW_MM_MCF_UPDATE_SRV/UploadFileSet";

            // Set the static upload URL for the item
            uploadSet.setUploadUrl(staticUploadUrl);

            // Add CSRF token header
            var vCsrfToken = this.getView().getModel().getSecurityToken();
            uploadSet.addHeaderField(new Item({ 
                                        key: "X-CSRF-Token", 
                                        text: vCsrfToken 
                                    })
                                );

            // Add the Slug header with the file name
            uploadSet.addHeaderField(new Item({ 
                                        key: "Slug", 
                                        text: encodeURIComponent(item.getFileName()) 
                                    })
                                );

            // Add the Content-Type header with the MIME type of the file
            uploadSet.addHeaderField(new Item({ 
                                        key: "Content-Type", 
                                        text: item.getMediaType() 
                                    })
                                );
                 

            // Start uploading the item
            uploadSet.uploadItem(item);


            // Add file metadata to the local model
            // const oNewItem = {
            //     fileName: item.getFileName(),
            //     mediaType: item.getMediaType(),
            //     uploadUrl: staticUploadUrl,
            //     csrfToken: vCsrfToken,
            //     slug: encodeURIComponent(item.getFileName()),
            //     content: item // Store the item object for later use in uploading
            // };

            // aItems.push(oNewItem);
            // oLocalModel.setProperty("/items", aItems);

            // // Add the uploaded item to the local model instead of sending it directly to the backend
            // const oItem = oEvent.getParameter("item");
            // const oLocalModel = this.getView().getModel("localModel");
            // const aItems = oLocalModel.getProperty("/items");

            // // Fallback values to prevent null or undefined values
            // const sFileName = oItem.getFileName() || "Unnamed File";
            // const sMediaType = oItem.getMediaType() || "application/octet-stream";

            // // Retrieve the actual file object
            // const oFile = oItem.getFileObject();

            // // Use FileReader to read the file content
            // const oReader = new FileReader();
            // oReader.onload = function (e) {
            //     // File content in base64 format
            //     const sFileContent = e.target.result;

            //     // Create an object representing the file data
            //     const oNewItem = {
            //         fileName: sFileName,
            //         mediaType: sMediaType,
            //         content: sFileContent // This is now in base64 format
            //     };

            //     // Push the new item into the local array
            //     aItems.push(oNewItem);
            //     oLocalModel.setProperty("/items", aItems);
            // };

            // // Read the file as a base64 encoded string
            // oReader.readAsDataURL(oFile);

            // // Extract data from the item
            // const oNewItem = {
            //     fileName: oItem.getFileName(),
            //     mediaType: oItem.getMediaType(),
            //     content: oItem.getFileContent() // Ensure the content is appropriately extracted
            // };

            // Push the new item into the local array
            // aItems.push(oNewItem);
            // oLocalModel.setProperty("/items", aItems);
        },

        onBeforeUploadStarts: function(){
            // var oHeaderParameter;
            // var vProduct = that.getView().getBindingContext().getObject().Product;
            // // Create a new header parameter with the required key-value pair
            // oHeaderParameter = new UploadCollectionParameter({
            //     name: "Material",   // Replace with your header key
            //     value: vProduct // Replace with your header value
            // });

            // //Provide CSRF Token
            // let oHeaderParamCSRF = new UploadCollectionParameter
            // ({
            //     name: "x-csrf-token",   // Replace with your header key
            //     value: this.csrfToken // Replace with your header value
            // });

            // // Header Slug
			// var oCustomerHeaderSlug = new UploadCollectionParameter({
			// 	name: "slug",
			// 	value: oEvent.getParameter("fileName")
			// });

            // // Add the header parameter to the request
            // oEvent.getParameters().addHeaderParameter(oHeaderParamCSRF);
            // oEvent.getParameters().addHeaderParameter(oHeaderParameter);
			// oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        },
        
        onUploadSelectedButton: function () {
			// var oUploadSet = this.byId(__attachmentTable);
            
			// oUploadSet.getItems().forEach(function (oItem) {
			// 	if (oItem.getListItem()) {
			// 		oUploadSet.uploadItem(oItem);
			// 	}
			// });

            this.onStartUpload( );

            // var oUploadCollection = this.byId(__attachmentTable);
			// var cFiles = oUploadCollection.getItems().length;
			// // var uploadInfo = cFiles + " file(s)";

			// if (cFiles > 0) {
			// 	oUploadCollection.upload();
			// }
		},
		onDownloadSelectedButton: function () {
			var oUploadSet = this.byId("UploadSet");

			oUploadSet.getItems().forEach(function (oItem) {
				if (oItem.getListItem().getSelected()) {
					oItem.download(true);
				}
			});
		},


        //Start of Upload Collection
        onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
            var vProduct = that.getView().getBindingContext().getObject().Product;
			// Header Token
            this.csrfToken = this.getView().getModel().getSecurityToken();
			let oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: this.csrfToken
			});

            let oHeaderParameter = new UploadCollectionParameter({
                name: "Material",   // Replace with your header key
                value: vProduct // Replace with your header value
            });

			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            oUploadCollection.addHeaderParameter(oHeaderParameter);
			MessageToast.show("Event change triggered");
		},

        fileSizeExceed: function () {
            sap.m.MessageToast.show(`Maximum permitted file size exceeded. Maximum limit : 20MB`);
        },

        // Event handler for file selection
        onFileChange: function (oEvent) {
            let oFileUploader = oEvent.getSource();
            let aFiles = oFileUploader.oFileUpload.files; // Access the selected files
            let that = this;

            // Check if files are selected
            if (aFiles.length > 0) {
                that.selectedFiles = Array.from(aFiles);
                MessageToast.show(that.selectedFiles.length + " files selected.");
            } else {
                MessageToast.show("No files selected.");
            }
        },
        
       /*
          Function to handle uploading of file when Upload Button is pressed
        */
        handleUploadPress: function () {
            var oFileUploader = this.byId("fileUploader");
                var oDomRef = oFileUploader.getDomRef();
                var oFileInput = oDomRef.querySelector('input[type="file"]');
                var oFile = oFileInput ? oFileInput.files[0] : null;
                if (oFile) {
                    var reader = new FileReader();
                    let file = oFile;
                    reader.onload = function (e) {
                        var base64String = e.target.result.split(',')[1];

                        let fileDetails = this.byId("fileUploader").getDomRef().querySelector('input[type="file"]').files[0];
                        let fileWithData = {
                            Filename: fileDetails.name,
                            Mimetype: fileDetails.type,
                            Content: base64String
                        };
                        let localModel = this.getView().getModel('localModel');
                        localModel.getProperty('/attachments').push(fileWithData);
                        localModel.updateBindings();
                        this.byId("fileUploader").clear();
                    }.bind(this);

                    reader.readAsDataURL(oFile);
                }
        },

        deleteAttachments: function (oEvent) {
            let oSource = oEvent.getParameter("listItem")
            let index = oSource.getBindingContext("localModel").getPath().split("/")[2];
            let localModel = this.getView().getModel('localModel');
            localModel.getProperty('/attachments').splice(index, 1);
            localModel.updateBindings();
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

            const model = this.getView().getModel();
            model.refresh(); // Refresh the model to get updated data after upload
            
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

       

    };
});