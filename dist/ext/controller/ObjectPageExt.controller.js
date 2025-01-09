const __attachmentTable="idItemsUploadSet";sap.ui.define(["sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","sap/ui/core/Core","sap/m/BusyDialog","sap/ui/core/library","sap/m/library","sap/m/UploadCollectionParameter","sap/ui/core/Item","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator"],(function(e,t,a,i,s,n,l,d,o,r,u,c){"use strict";var p=n.MessageType;l.ListMode;return{onInit:function(){this._oBusyDialog=new s,this._MessageManager=i.getMessageManager();const e=new t({items:[],attachments:[]});this.getView().setModel(e,"localModel")},onSelectedChangeType:function(e){let t=e.getParameter("value"),a=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idChangePanel::Section"),i=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDChangePanel::Section");"Finance Related"==t?(a.setVisible(!0),i.setVisible(!1)):(a.setVisible(!1),i.setVisible(!0)),this._changeType=t},validateFields:function(e){let t=!0,a=[];let i=sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Businessunit::Field"),s=sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field"),n=sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Source::Field");if(sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::ChangeType::Field")||(t=!1,a.push("Change Type")),s||(s=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field"),s||(t=!1,a.push("Country"))),i||(i=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::BusinessUnit::Field"),i||(t=!1,a.push("Business Unit"))),n||(n=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Source::Field"),n||(t=!1,a.push("Source"))),"Finance Related"===e){let e=sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::TaxClassification::Field-comboBoxEdit"),i=sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::ProductSalesOrg::Field-comboBoxEdit"),s=sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::ProductDistributionChnl::Field-comboBoxEdit");i||(i=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::ProductSalesOrg::Field-comboBoxEdit"),i||""!=i.getValue()||(t=!1,a.push("Sales Organization"))),s||(s=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::ProductDistributionChnl::Field"),s||""!=s.getValue()||(t=!1,a.push("Distribution Channel"))),e||(e=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::TaxClassification::Field"),e||""!=e.getValue()||(t=!1,a.push("Tax Classification")))}if("CCD Related"===e){let e=sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDRelatedChange::HSCode::Field-input").getValue(),i=sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDRelatedChange::ImportDuty::Field-input").getValue();e||(e=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDRelatedChange::HSCode::Field-input"),e||""!==e||(t=!1,a.push("HS Code"))),i||(this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDRelatedChange::ImportDuty::Field-input"),i||""!=i.getValue()||(t=!1,a.push("Import Duty")))}return!!t||(sap.m.MessageBox.error(`The following fields are required: ${a.join(", ")}`),!1)},_onFieldChange:function(e){this.onApplyFilters()},beforeSaveExtension:function(){var e,t,a=new Promise((function(a,i){e=a,t=i}));if(!this._changeType)return r.error("No Change Type was selected. Please select if Finance Related or CCD Related Change"),t(),a;return this.validateFields(this._changeType)?e():t(),a},onExit:function(){},onAfterRendering:function(){var e=this;let t=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field"),a=sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::ChangeType::Field");var i=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::BusinessUnit::Field");a.attachChange(e.onSelectedChangeType,e),t.attachChange(e._onFieldChange,e),this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idChangePanel::Section").setVisible(!1),this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDChangePanel::Section").setVisible(!1),this.getView().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--save").setText("Submit"),this.extensionAPI.getTransactionController().attachAfterSave(e.onAfterSave.bind(this)),this.extensionAPI.attachPageDataLoaded(e.onRebind.bind(this)),i&&i.attachChange(this._onFieldChange.bind(this))},onAfterSave:function(){var e=this;e.getView().getModel().attachEventOnce("batchRequestCompleted",(function(t){e._checkBatchRequestSuccess(t)?e.onStartUpload():console.error("Save failed, skipping attachment upload")}))},_checkBatchRequestSuccess:function(e){var t=e.getParameter("requests"),a=!0;return t.forEach((function(e){e.success||(a=!1)})),a},onStartUpload:function(){this.getView().getModel("localModel").getProperty("/attachments").forEach((e=>{this._uploadFileToOData(e)})),e.show("Files are being uploaded.")},onUploadCompleted:function(){this.getView().getModel().refresh()},_uploadFileToOData:function(e){const t=this.getView().getModel(),a=this.getView().getModel("localModel"),i=a.getProperty("/attachments")||[],s=t.getSecurityToken(),n=this.getView().getBindingContext().getObject().Product;0!==i.length?(i.forEach((e=>{const t=e.Content,a=new Headers;a.append("X-CSRF-Token",s),a.append("Slug",encodeURIComponent(e.Filename)),a.append("Content-Type",e.Mimetype),a.append("Material",n),fetch("/sap/opu/odata/sap/YGW_MM_MCF_UPDATE_SRV/UploadFileSet",{method:"POST",headers:a,body:t}).then((t=>{t.ok?console.log(`File uploaded successfully: ${e.Filename}`,{title:"Files Uploaded"}):t.text().then((t=>{console.error("Error uploading file:",t),r.error(`File uploaded error: ${t} ${e.Filename}`,{title:"Error Uploading"})}))})).catch((t=>{console.error("Fetch error:",t),sap.m.MessageToast.show("Failed to upload file: "+e.Filename)}))})),a.setProperty("/attachments",[]),a.updateBindings()):sap.m.MessageToast.show("No attachments to upload.")},onAfterItemAdded:function(e){this.getView().getModel();const t=e.getParameter("item"),a=this.getView().getModel("localModel");a||(a=new sap.ui.model.json.JSONModel({items:[]}),this.getView().setModel(a,"localModel"));a.getProperty("/items");const i=this.byId("idItemsUploadSet");i.setUploadUrl("/sap/opu/odata/sap/YGW_MM_MCF_UPDATE_SRV/UploadFileSet");var s=this.getView().getModel().getSecurityToken();i.addHeaderField(new o({key:"X-CSRF-Token",text:s})),i.addHeaderField(new o({key:"Slug",text:encodeURIComponent(t.getFileName())})),i.addHeaderField(new o({key:"Content-Type",text:t.getMediaType()})),i.uploadItem(t)},onApplyFilters:function(){var e=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRefDoc--RefDocTable");if(!e)return void console.warn("Smart Table not found!");let t=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field"),a=this.byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::BusinessUnit::Field");var i=e.getTable().getBinding("items");if(i){var s=[];t&&s.push(new u("Country",c.EQ,t.getValue())),a&&s.push(new u("Busunit",c.EQ,a.getValue())),i.filter(s),e.rebindTable()}else console.warn("No binding found for Smart Table!")},onRebind:function(e){this.onApplyFilters()},onBeforeUploadStarts:function(){},onUploadSelectedButton:function(){this.onStartUpload()},onDownloadSelectedButton:function(){this.byId("UploadSet").getItems().forEach((function(e){e.getListItem().getSelected()&&e.download(!0)}))},onChange:function(t){var a=t.getSource(),i=that.getView().getBindingContext().getObject().Product;this.csrfToken=this.getView().getModel().getSecurityToken();let s=new d({name:"x-csrf-token",value:this.csrfToken}),n=new d({name:"Material",value:i});a.addHeaderParameter(s),a.addHeaderParameter(n),e.show("Event change triggered")},fileSizeExceed:function(){sap.m.MessageToast.show("Maximum permitted file size exceeded. Maximum limit : 20MB")},onFileChange:function(t){let a=t.getSource().oFileUpload.files,i=this;a.length>0?(i.selectedFiles=Array.from(a),e.show(i.selectedFiles.length+" files selected.")):e.show("No files selected.")},handleUploadPress:function(){var e,t=(e=this.byId("fileUploader").getDomRef().querySelector('input[type="file"]'))?e.files[0]:null;if(this.byId("AttachmentsList").getItems().length>0){if(this.byId("AttachmentsList").getItems().map((e=>e.getTitle())).indexOf(t.name)>-1)return void r.error(`A file with the name ${t.name} already exists.`)}if(t=(e=this.byId("fileUploader").getDomRef().querySelector('input[type="file"]'))?e.files[0]:null){var a=new FileReader;a.onload=function(e){var t=e.target.result.split(",")[1];let a=this.byId("fileUploader").getDomRef().querySelector('input[type="file"]').files[0],i={Filename:a.name,Mimetype:a.type,Content:t},s=this.getView().getModel("localModel");s.getProperty("/attachments").push(i),s.updateBindings(),this.byId("fileUploader").clear()}.bind(this),a.readAsDataURL(t)}},deleteAttachments:function(e){let t=e.getParameter("listItem").getBindingContext("localModel").getPath().split("/")[2],a=this.getView().getModel("localModel");a.getProperty("/attachments").splice(t,1),a.updateBindings()},extractErrorMessage:function(e){return(new DOMParser).parseFromString(e,"text/xml").getElementsByTagName("errordetail")},handleUploadComplete:function(e){let t=e.mParameters.responseRaw,a=this.extractErrorMessage(t);if(this.getView().getModel().refresh(),a.length>0)for(var i=0;i<a.length;i++){let e,t=a[i].getElementsByTagName("message"),s=a[i].getElementsByTagName("severity");if("Exception raised without specific error"!==t[0].textContent)switch(s[0].textContent){case"error":e=p.Error;break;case"success":e=p.Warning;break;case"info":e=p.Information;break;default:e=p.None}}else r.success("Successfully Uploaded");this.getOwnerComponent().getModel().refresh(!0),this._oBusyDialog.close()},handleCancelPress:function(e){},onSaveDraft:function(){console.log("Save as draft!")}}}));