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
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(MessageToast, JSONModel, Fragment, Core, BusyDialog, coreLibrary, MobileLibrary, UploadCollectionParameter, Item, MessageBox, Filter, FilterOperator) {
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

            // Save For Later
            this._changeType = selectedValue;
            
        },

        validateFields: function(selectedValue){
            // Validation Logic
            let valid = true;
            let missingFields = [];

            let businessUnit = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Businessunit::Field");
            let country = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field");
            let source = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Source::Field");
            let changeType = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::ChangeType::Field");

            if(!changeType){
                valid = false;
                missingFields.push("Change Type");
            }

            if(!country){
                valid = false;
                missingFields.push("Country");
            }

            if(!businessUnit){
                valid = false;
                missingFields.push("Business Unit");
            }

            if(!source){
                valid = false;
                missingFields.push("Source");
            }

            if (selectedValue === "Finance Related") {
                let taxClassification = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::TaxClassification::Field-comboBoxEdit");
                let salesOrgField = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::ProductSalesOrg::Field-comboBoxEdit");
                let distChannelField = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::ProductDistributionChnl::Field-comboBoxEdit");
                

                if(!salesOrgField){
                    valid = false;
                    missingFields.push("Sales Organization");
                }

                if(!distChannelField){
                    valid = false;
                    missingFields.push("Distribution Channel");
                }

                if (!taxClassification) {
                    valid = false;
                    missingFields.push("Tax Classification");
                }
            }

            if (selectedValue === "CCD Related") {
                let hsCode = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDRelatedChange::HSCode::Field-input").getValue();  
                let importDuty = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDRelatedChange::ImportDuty::Field-input").getValue();  

                if (!hsCode) {
                    valid = false;
                    missingFields.push("HS Code");
                }
                if (!importDuty) {
                    valid = false;
                    missingFields.push("Import Duty");
                }
            }

            // Show validation messages if fields are missing
            if (!valid) {
                sap.m.MessageBox.error(`The following fields are required: ${missingFields.join(", ")}`);
                return false;
            }

            return true;
        },

        _onFieldChange: function(oEvent) {
            this.onApplyFilters();
        },

        beforeSaveExtension: function () {
			var fnResolve, fnReject;
			var oPromise = new Promise(function (resolve, reject){
				fnResolve = resolve;
				fnReject = reject;
			});

            if(!this._changeType){
                MessageBox.error("No Change Type was selected. Please select if Finance Related or CCD Related Change");
                fnReject();
                return oPromise;
            }

            let valid = this.validateFields(this._changeType);

            if(valid){
                fnResolve();
            }else{
                fnReject();
            }
			return oPromise;
		},


        onExit: function(){
            
        },

        onAfterRendering: function(){
            var that = this;
            let sCountry = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field");
            let btn = sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::ChangeType::Field");
            var oBusinessUnitField = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::BusinessUnit::Field");
            // var oSmartTableId = "dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRefDoc--RefDocTable";

            btn.attachChange(that.onSelectedChangeType, that);
            sCountry.attachChange(that._onFieldChange, that);

            let pFiRelatedChange = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idChangePanel::Section");
            pFiRelatedChange.setVisible(false);

            let pCCDRelatedChange = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDChangePanel::Section");
            pCCDRelatedChange.setVisible(false);

            //Submit Button Text -- altohugh localization of UI Text can be considered - for now change here
            this.getView().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--save").setText("Submit");

            //Attach a function after saving
            this.extensionAPI.getTransactionController().attachAfterSave(that.onAfterSave.bind(this));

            // Attach the PageDataLoaded event
            this.extensionAPI.attachPageDataLoaded(that.onRebind.bind(this));

            if (oBusinessUnitField) {
                oBusinessUnitField.attachChange(this._onFieldChange.bind(this));
            }

            
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
        },

        onUploadCompleted: function() {
            const model = this.getView().getModel();
            model.refresh(); // Refresh the model to get updated data after upload
            
         },

         _uploadFileToOData: function (file) {
            const oModel = this.getView().getModel(); // ODataModel instance
            const oLocalModel = this.getView().getModel("localModel");
            const aAttachments = oLocalModel.getProperty("/attachments") || [];
            const csrfToken = oModel.getSecurityToken();
            const vProduct = this.getView().getBindingContext().getObject().Product;

            if (aAttachments.length === 0) {
                sap.m.MessageToast.show("No attachments to upload.");
                return;
            }

            aAttachments.forEach(fileData => {
                const uploadUrl = "/sap/opu/odata/sap/YGW_MM_MCF_UPDATE_SRV/UploadFileSet";
                const file = fileData.Content; // Actual File object

                // Prepare headers
                const headers = new Headers();
                headers.append("X-CSRF-Token", csrfToken);
                headers.append("Slug", encodeURIComponent(fileData.Filename));
                headers.append("Content-Type", fileData.Mimetype);
                headers.append("Material", vProduct);

                // Use fetch to upload the file as binary data
                fetch(uploadUrl, {
                    method: "POST",
                    headers: headers,
                    body: file // Send the actual File object as the body
                })
                .then(response => {
                    if (response.ok) {
                        // sap.m.MessageToast.show("File uploaded successfully: " + fileData.Filename);
                        console.log(`File uploaded successfully: ${fileData.Filename}`, { title: "Files Uploaded" });
                    } else {
                        response.text().then(errorText => {
                            console.error("Error uploading file:", errorText);
                            MessageBox.error(`File uploaded error: ${errorText} ${fileData.Filename}`, { title: "Error Uploading" });
                        });
                    }
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                    sap.m.MessageToast.show("Failed to upload file: " + fileData.Filename);
                });
            });

            // Clear the local attachments model after upload
            oLocalModel.setProperty("/attachments", []);
            oLocalModel.updateBindings();
        },

    //     _base64ToBlob: function (base64, mimeType) {
    //         const byteCharacters = atob(base64);
    //         const byteArrays = [];
        
    //         for (let offset = 0; offset < byteCharacters.length; offset += 512) {,
	// "sap/ui/commons/Message"                const slice = byteCharacters.slice(offset, offset + 512);
    //             const byteNumbers = new Array(slice.length);
    //             for (let i = 0; i < slice.length; i++) {
    //                 byteNumbers[i] = slice.charCodeAt(i);
    //             }
    //             const byteArray = new Uint8Array(byteNumbers);
    //             byteArrays.push(byteArray);
    //         }
        
    //         return new Blob(byteArrays, { type: mimeType });
    //     },

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

        },

        /**
         * Apply filters dynamically before rebinding
         */
        onApplyFilters: function () {
            var oSmartTableId = "dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRefDoc--RefDocTable";
            var oSmartTable = this.byId(oSmartTableId);

            if (!oSmartTable) {
                console.warn("Smart Table not found!");
                return;
            }

            //Country
            let vCountry = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field");
            //BusinessUnit
            let vBusinessUnit = this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::BusinessUnit::Field");

            // Get current binding and apply filters
            var oBinding = oSmartTable.getTable().getBinding("items");
            if (oBinding) {
                var aFilters = [];

                if (vCountry) {
                    aFilters.push(new Filter("Country", FilterOperator.EQ, vCountry.getValue()));
                }
                if (vBusinessUnit) {
                    aFilters.push(new Filter("Busunit", FilterOperator.EQ, vBusinessUnit.getValue()));
                }

                oBinding.filter(aFilters);
                oSmartTable.rebindTable();
                console.log("Filters applied on Smart Table binding:", aFilters);
            } else {
                console.warn("No binding found for Smart Table!");
            }
        },

        onRebind: function(oEvent){
            this.onApplyFilters();
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

            if(this.byId("AttachmentsList").getItems().length > 0){
                let existingFiles = this.byId("AttachmentsList").getItems().map(e => { return e.getTitle() })
                if (existingFiles.indexOf(oFile.name) > -1) {
                    MessageBox.error(`A file with the name ${oFile.name} already exists.`);
                    return;
                }
            }

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

                }
                
            }else{
                MessageBox.success("Successfully Uploaded");
            }
            
            this.getOwnerComponent().getModel().refresh(true);
            this._oBusyDialog.close();   
  
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