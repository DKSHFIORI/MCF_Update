sap.ui.require.preload({
	"dksh/ymm/mcfupdate/mcfupdate/Component.js": "sap.ui.define([\"sap/suite/ui/generic/template/lib/AppComponent\"],(function(e){\"use strict\";return e.extend(\"dksh.ymm.mcfupdate.mcfupdate.Component\",{metadata:{manifest:\"json\"}})}));",
	"dksh/ymm/mcfupdate/mcfupdate/test/changes_loader.js": "const parsedUI5Version=sap.ui.version.split(\".\"),connectorPath=parseInt(parsedUI5Version[0],10)>=1&&parseInt(parsedUI5Version[1],10)>=80?\"sap/ui/fl/write/api/connectors/FileListBaseConnector\":\"sap/ui/fl/initial/api/connectors/FileListBaseConnector\";sap.ui.define([\"sap/base/util/merge\",connectorPath],(function(e,n){return e({},n,{getFileList:function(){return new Promise((function(e,n){$.ajax({url:\"/changes/\",type:\"GET\",cache:!1}).then((function(n){for(var i=/(\\/changes\\/[^\"]*\\.[a-zA-Z]*)/g,s=i.exec(n),t=[];null!==s;)t.push(s[1]),s=i.exec(n);e(t)})).fail((function(n){e()}))}))}})}));",
	"dksh/ymm/mcfupdate/mcfupdate/test/changes_preview.js": "var version=sap.ui.version.split(\".\");parseInt(version[0],10)<=1&&parseInt(version[1],10)<78&&(sap.ui.getCore().loadLibraries([\"sap/ui/fl\"]),sap.ui.require([\"sap/ui/fl/FakeLrepConnector\"],(function(e){jQuery.extend(e.prototype,{create:function(e){return Promise.resolve()},stringToAscii:function(e){if(!e||0===e.length)return\"\";for(var n=\"\",t=0;t<e.length;t++)n+=e.charCodeAt(t)+\",\";return null!==n&&n.length>0&&\",\"===n.charAt(n.length-1)&&(n=n.substring(0,n.length-1)),n},loadChanges:function(){var n={changes:[],settings:{isKeyUser:!0,isAtoAvailable:!1,isProductiveSystem:!1}},t=[];return new Promise((function(r,a){$.ajax({url:\"/sap-ui-cachebuster-info.json\",type:\"GET\",cache:!1}).then((function(e){var n=Object.keys(e).filter((function(e){return e.endsWith(\".change\")}));$.each(n,(function(e,n){0===n.indexOf(\"changes\")&&t.push($.ajax({url:\"/\"+n,type:\"GET\",cache:!1}).then((function(e){return JSON.parse(e)})))}))})).always((function(){return Promise.all(t).then((function(a){return new Promise((function(e,n){0===a.length?$.ajax({url:\"/changes/\",type:\"GET\",cache:!1}).then((function(n){for(var r=/(\\/changes\\/[^\"]*\\.[a-zA-Z]*)/g,a=r.exec(n);null!==a;)t.push($.ajax({url:a[1],type:\"GET\",cache:!1}).then((function(e){return JSON.parse(e)}))),a=r.exec(n);e(Promise.all(t))})).fail((function(n){e(a)})):e(a)})).then((function(t){var a=[],o=[];if(t.forEach((function(n){var t=n.changeType;if(\"addXML\"===t||\"codeExt\"===t){var r=\"/\"+(\"addXML\"===t?n.content.fragmentPath:\"codeExt\"===t?n.content.codeRef:\"\").match(/webapp(.*)/)[0];a.push($.ajax({url:r,type:\"GET\",cache:!1}).then((function(r){return\"addXML\"===t?(n.content.fragment=e.prototype.stringToAscii(r.documentElement.outerHTML),n.content.selectedFragmentContent=r.documentElement.outerHTML):\"codeExt\"===t&&(n.content.code=e.prototype.stringToAscii(r),n.content.extensionControllerContent=r),n})))}else o.push(n)})),a.length>0)return Promise.all(a).then((function(e){e.forEach((function(e){o.push(e)})),o.sort((function(e,n){return new Date(e.creation)-new Date(n.creation)})),n.changes=o,r({changes:n,componentClassName:\"dksh.ymm.mcfupdate.mcfupdate\"})}));o.sort((function(e,n){return new Date(e.creation)-new Date(n.creation)})),n.changes=o,r({changes:n,componentClassName:\"dksh.ymm.mcfupdate.mcfupdate\"})}))}))}))}))}}),e.enableFakeConnector()})));",
	"dksh/ymm/mcfupdate/mcfupdate/test/locate-reuse-libs.js": "function registerSAPFonts(){sap.ui.require([\"sap/ui/core/IconPool\"],(function(e){var t={fontFamily:\"SAP-icons-TNT\",fontURI:sap.ui.require.toUrl(\"sap/tnt/themes/base/fonts/\")};e.registerFont(t);var n={fontFamily:\"BusinessSuiteInAppSymbols\",fontURI:sap.ui.require.toUrl(\"sap/ushell/themes/base/fonts/\")};e.registerFont(n)}))}!function(e){e.registerComponentDependencyPaths=function(t){return function(e){var t=e,n=\"\",a=[\"sap.apf\",\"sap.base\",\"sap.chart\",\"sap.collaboration\",\"sap.f\",\"sap.fe\",\"sap.fileviewer\",\"sap.gantt\",\"sap.landvisz\",\"sap.m\",\"sap.ndc\",\"sap.ovp\",\"sap.rules\",\"sap.suite\",\"sap.tnt\",\"sap.ui\",\"sap.uiext\",\"sap.ushell\",\"sap.uxap\",\"sap.viz\",\"sap.webanalytics\",\"sap.zen\"];function r(e,t){var n=t;return Object.keys(e).forEach((function(e){a.some((function(t){return e===t||e.startsWith(t+\".\")}))||(n=n.length>0?n+\",\"+e:e)})),n}return new Promise((function(a,i){$.ajax(t).done((function(e){e&&(e[\"sap.ui5\"]&&e[\"sap.ui5\"].dependencies&&(e[\"sap.ui5\"].dependencies.libs&&(n=r(e[\"sap.ui5\"].dependencies.libs,n)),e[\"sap.ui5\"].dependencies.components&&(n=r(e[\"sap.ui5\"].dependencies.components,n))),e[\"sap.ui5\"]&&e[\"sap.ui5\"].componentUsages&&(n=r(e[\"sap.ui5\"].componentUsages,n))),a(n)})).fail((function(){i(new Error(\"Could not fetch manifest at '\"+e))}))}))}(t).then((function(t){if(t&&t.length>0){var n=\"/sap/bc/ui2/app_index/ui5_app_info?id=\"+t,a=\"\";return new Promise((function(t){e.ui.require([\"sap/base/util/UriParameters\"],(function(e){(a=e.fromQuery(window.location.search).get(\"sap-client\"))&&3===a.length&&(n=n+\"&sap-client=\"+a),t(n)}))})).then((function(t){return $.ajax(t).done((function(t){var n;t&&(n=t,Object.keys(n).forEach((function(t){var a=n[t];a&&a.dependencies&&a.dependencies.forEach((function(t){if(t.url&&t.url.length>0&&\"UI5LIB\"===t.type){e.ui.require([\"sap/base/Log\"],(function(e){e.info(\"Registering Library \"+t.componentId+\" from server \"+t.url)}));var n=t.componentId.replace(/\\./g,\"/\"),a={paths:{}};a.paths[n]=t.url,e.ui.loader.config(a)}}))})))}))}))}}))}}(sap);var currentScript=document.getElementById(\"locate-reuse-libs\");currentScript||(currentScript=document.currentScript);var manifestUri=currentScript.getAttribute(\"data-sap-ui-manifest-uri\"),componentName=currentScript.getAttribute(\"data-sap-ui-componentName\"),useMockserver=currentScript.getAttribute(\"data-sap-ui-use-mockserver\");sap.registerComponentDependencyPaths(manifestUri).catch((function(e){sap.ui.require([\"sap/base/Log\"],(function(t){t.error(e)}))})).finally((function(){sap.ui.getCore().attachInit((function(){var e=sap.ui.getCore().getConfiguration().getLanguage();sap.ui.require([\"sap/base/i18n/ResourceBundle\"],(function(t){var n=t.create({url:\"i18n/i18n.properties\",locale:e});document.title=n.getText(\"appTitle\")}))})),componentName&&componentName.length>0?useMockserver&&\"true\"===useMockserver?sap.ui.getCore().attachInit((function(){registerSAPFonts(),sap.ui.require([componentName.replace(/\\./g,\"/\")+\"/localService/mockserver\"],(function(e){e.init(),sap.ushell.Container.createRenderer().placeAt(\"content\")}))})):(sap.ui.require([\"sap/ui/core/ComponentSupport\"]),sap.ui.getCore().attachInit((function(){registerSAPFonts();var e=sap.ui.getCore().getConfiguration().getLanguage();sap.ui.require([\"sap/base/i18n/ResourceBundle\"],(function(t){var n=t.create({url:\"i18n/i18n.properties\",locale:e});document.title=n.getText(\"appTitle\")}))}))):sap.ui.getCore().attachInit((function(){registerSAPFonts(),sap.ushell.Container.createRenderer().placeAt(\"content\")}))}));",
	"dksh/ymm/mcfupdate/mcfupdate/ext/controller/ListReportExt.controller.js": "sap.ui.define([\"sap/m/MessageToast\"],(function(n){\"use strict\";return{onEnterKeys:function(e){n.show(\"Custom handler invoked.\")},onAfterRendering:function(){}}}));",
	"dksh/ymm/mcfupdate/mcfupdate/ext/controller/ObjectPageExt.controller.js": "const __attachmentTable=\"idItemsUploadSet\";sap.ui.define([\"sap/m/MessageToast\",\"sap/ui/model/json/JSONModel\",\"sap/ui/core/Fragment\",\"sap/ui/core/Core\",\"sap/m/BusyDialog\",\"sap/ui/core/library\",\"sap/m/library\",\"sap/m/UploadCollectionParameter\",\"sap/ui/core/Item\",\"sap/m/MessageBox\",\"sap/ui/model/Filter\",\"sap/ui/model/FilterOperator\"],(function(e,t,a,i,s,n,o,l,d,r,c,u){\"use strict\";var p=n.MessageType;o.ListMode;return{onInit:function(){this._oBusyDialog=new s,this._MessageManager=i.getMessageManager();const e=new t({items:[],attachments:[]});this.getView().setModel(e,\"localModel\")},onSelectedChangeType:function(e){let t=e.getParameter(\"value\"),a=this.byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idChangePanel::Section\"),i=this.byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDChangePanel::Section\");\"Finance Related\"==t?(a.setVisible(!0),i.setVisible(!1)):(a.setVisible(!1),i.setVisible(!0)),this._changeType=t},validateFields:function(e){let t=!0,a=[],i=sap.ui.getCore().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Businessunit::Field\"),s=sap.ui.getCore().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field\"),n=sap.ui.getCore().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Source::Field\");if(sap.ui.getCore().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::ChangeType::Field\")||(t=!1,a.push(\"Change Type\")),s||(t=!1,a.push(\"Country\")),i||(t=!1,a.push(\"Business Unit\")),n||(t=!1,a.push(\"Source\")),\"Finance Related\"===e){let e=sap.ui.getCore().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::TaxClassification::Field-comboBoxEdit\"),i=sap.ui.getCore().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::ProductSalesOrg::Field-comboBoxEdit\"),s=sap.ui.getCore().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRelatedChange::ProductDistributionChnl::Field-comboBoxEdit\");i||(t=!1,a.push(\"Sales Organization\")),s||(t=!1,a.push(\"Distribution Channel\")),e||(t=!1,a.push(\"Tax Classification\"))}if(\"CCD Related\"===e){let e=sap.ui.getCore().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDRelatedChange::HSCode::Field-input\").getValue(),i=sap.ui.getCore().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDRelatedChange::ImportDuty::Field-input\").getValue();e||(t=!1,a.push(\"HS Code\")),i||(t=!1,a.push(\"Import Duty\"))}return!!t||(sap.m.MessageBox.error(`The following fields are required: ${a.join(\", \")}`),!1)},_onFieldChange:function(e){this.onApplyFilters()},beforeSaveExtension:function(){var e,t,a=new Promise((function(a,i){e=a,t=i}));if(!this._changeType)return r.error(\"No Change Type was selected. Please select if Finance Related or CCD Related Change\"),t(),a;return this.validateFields(this._changeType)?e():t(),a},onExit:function(){},onAfterRendering:function(){var e=this;let t=this.byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field\"),a=sap.ui.getCore().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::ChangeType::Field\");var i=this.byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::BusinessUnit::Field\");a.attachChange(e.onSelectedChangeType,e),t.attachChange(e._onFieldChange,e),this.byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idChangePanel::Section\").setVisible(!1),this.byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idCCDChangePanel::Section\").setVisible(!1),this.getView().byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--save\").setText(\"Submit\"),this.extensionAPI.getTransactionController().attachAfterSave(e.onAfterSave.bind(this)),this.extensionAPI.attachPageDataLoaded(e.onRebind.bind(this)),i&&i.attachChange(this._onFieldChange.bind(this))},onAfterSave:function(){var e=this;e.getView().getModel().attachEventOnce(\"batchRequestCompleted\",(function(t){e._checkBatchRequestSuccess(t)?e.onStartUpload():console.error(\"Save failed, skipping attachment upload\")}))},_checkBatchRequestSuccess:function(e){var t=e.getParameter(\"requests\"),a=!0;return t.forEach((function(e){e.success||(a=!1)})),a},onStartUpload:function(){this.getView().getModel(\"localModel\").getProperty(\"/attachments\").forEach((e=>{this._uploadFileToOData(e)})),e.show(\"Files are being uploaded.\")},onUploadCompleted:function(){this.getView().getModel().refresh()},_uploadFileToOData:function(e){const t=this.getView().getModel(),a=this.getView().getModel(\"localModel\"),i=a.getProperty(\"/attachments\")||[],s=t.getSecurityToken(),n=this.getView().getBindingContext().getObject().Product;0!==i.length?(i.forEach((e=>{const t=e.Content,a=new Headers;a.append(\"X-CSRF-Token\",s),a.append(\"Slug\",encodeURIComponent(e.Filename)),a.append(\"Content-Type\",e.Mimetype),a.append(\"Material\",n),fetch(\"/sap/opu/odata/sap/YGW_MM_MCF_UPDATE_SRV/UploadFileSet\",{method:\"POST\",headers:a,body:t}).then((t=>{t.ok?console.log(`File uploaded successfully: ${e.Filename}`,{title:\"Files Uploaded\"}):t.text().then((t=>{console.error(\"Error uploading file:\",t),r.error(`File uploaded error: ${t} ${e.Filename}`,{title:\"Error Uploading\"})}))})).catch((t=>{console.error(\"Fetch error:\",t),sap.m.MessageToast.show(\"Failed to upload file: \"+e.Filename)}))})),a.setProperty(\"/attachments\",[]),a.updateBindings()):sap.m.MessageToast.show(\"No attachments to upload.\")},onAfterItemAdded:function(e){this.getView().getModel();const t=e.getParameter(\"item\"),a=this.getView().getModel(\"localModel\");a||(a=new sap.ui.model.json.JSONModel({items:[]}),this.getView().setModel(a,\"localModel\"));a.getProperty(\"/items\");const i=this.byId(\"idItemsUploadSet\");i.setUploadUrl(\"/sap/opu/odata/sap/YGW_MM_MCF_UPDATE_SRV/UploadFileSet\");var s=this.getView().getModel().getSecurityToken();i.addHeaderField(new d({key:\"X-CSRF-Token\",text:s})),i.addHeaderField(new d({key:\"Slug\",text:encodeURIComponent(t.getFileName())})),i.addHeaderField(new d({key:\"Content-Type\",text:t.getMediaType()})),i.uploadItem(t)},onApplyFilters:function(){var e=this.byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idRefDoc--RefDocTable\");if(!e)return void console.warn(\"Smart Table not found!\");let t=this.byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::Country::Field\"),a=this.byId(\"dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::BusinessUnit::Field\");var i=e.getTable().getBinding(\"items\");if(i){var s=[];t&&s.push(new c(\"Country\",u.EQ,t.getValue())),a&&s.push(new c(\"Busunit\",u.EQ,a.getValue())),i.filter(s),e.rebindTable(),console.log(\"Filters applied on Smart Table binding:\",s)}else console.warn(\"No binding found for Smart Table!\")},onRebind:function(e){this.onApplyFilters()},onBeforeUploadStarts:function(){},onUploadSelectedButton:function(){this.onStartUpload()},onDownloadSelectedButton:function(){this.byId(\"UploadSet\").getItems().forEach((function(e){e.getListItem().getSelected()&&e.download(!0)}))},onChange:function(t){var a=t.getSource(),i=that.getView().getBindingContext().getObject().Product;this.csrfToken=this.getView().getModel().getSecurityToken();let s=new l({name:\"x-csrf-token\",value:this.csrfToken}),n=new l({name:\"Material\",value:i});a.addHeaderParameter(s),a.addHeaderParameter(n),e.show(\"Event change triggered\")},fileSizeExceed:function(){sap.m.MessageToast.show(\"Maximum permitted file size exceeded. Maximum limit : 20MB\")},onFileChange:function(t){let a=t.getSource().oFileUpload.files,i=this;a.length>0?(i.selectedFiles=Array.from(a),e.show(i.selectedFiles.length+\" files selected.\")):e.show(\"No files selected.\")},handleUploadPress:function(){var e,t=(e=this.byId(\"fileUploader\").getDomRef().querySelector('input[type=\"file\"]'))?e.files[0]:null;if(this.byId(\"AttachmentsList\").getItems().length>0){if(this.byId(\"AttachmentsList\").getItems().map((e=>e.getTitle())).indexOf(t.name)>-1)return void r.error(`A file with the name ${t.name} already exists.`)}if(t=(e=this.byId(\"fileUploader\").getDomRef().querySelector('input[type=\"file\"]'))?e.files[0]:null){var a=new FileReader;a.onload=function(e){var t=e.target.result.split(\",\")[1];let a=this.byId(\"fileUploader\").getDomRef().querySelector('input[type=\"file\"]').files[0],i={Filename:a.name,Mimetype:a.type,Content:t},s=this.getView().getModel(\"localModel\");s.getProperty(\"/attachments\").push(i),s.updateBindings(),this.byId(\"fileUploader\").clear()}.bind(this),a.readAsDataURL(t)}},deleteAttachments:function(e){let t=e.getParameter(\"listItem\").getBindingContext(\"localModel\").getPath().split(\"/\")[2],a=this.getView().getModel(\"localModel\");a.getProperty(\"/attachments\").splice(t,1),a.updateBindings()},extractErrorMessage:function(e){return(new DOMParser).parseFromString(e,\"text/xml\").getElementsByTagName(\"errordetail\")},handleUploadComplete:function(e){let t=e.mParameters.responseRaw,a=this.extractErrorMessage(t);if(this.getView().getModel().refresh(),a.length>0)for(var i=0;i<a.length;i++){let e,t=a[i].getElementsByTagName(\"message\"),s=a[i].getElementsByTagName(\"severity\");if(\"Exception raised without specific error\"!==t[0].textContent)switch(s[0].textContent){case\"error\":e=p.Error;break;case\"success\":e=p.Warning;break;case\"info\":e=p.Information;break;default:e=p.None}}else r.success(\"Successfully Uploaded\");this.getOwnerComponent().getModel().refresh(!0),this._oBusyDialog.close()},handleCancelPress:function(e){},onSaveDraft:function(){console.log(\"Save as draft!\")}}}));",
	"dksh/ymm/mcfupdate/mcfupdate/ext/fragment/FragmentAttachment.fragment.xml": "<core:FragmentDefinition \r\n    xmlns:core=\"sap.ui.core\" \r\n    xmlns=\"sap.m\" \r\n    xmlns:u=\"sap.ui.unified\"\r\n    xmlns:upload=\"sap.m.upload\"\r\n    xmlns:smartTable=\"sap.ui.comp.smarttable\"\r\n    ><VBox id=\"idAttVBox\"><Panel id=\"idAttPanel\" expanded=\"true\" ><List id= \"AttachmentsList\"\r\n                class=\"sapUiSizeCompact\"\r\n                items=\"{'path':'localModel>/attachments'}\"\r\n                growing=\"true\"\r\n                mode=\"Delete\"\r\n                delete=\"deleteAttachments\"\r\n                growingThreshold=\"5\"\r\n            ><headerToolbar><Toolbar><ToolbarSpacer /><u:FileUploader visible=\"{HasActiveEntity}\"\r\n                            id=\"fileUploader\"\r\n                            maximumFileSize=\"20\"\r\n                            fileSizeExceed=\"fileSizeExceed\"\r\n                            name=\"myFileUpload\"\r\n                            uploadUrl=\"/sap/opu/odata/sap/YGW_MM_MCF_UPDATE_SRV/UploadFileSet\"\r\n                            tooltip=\"Upload your file to the local server\"\r\n                            uploadComplete=\"handleUploadComplete\"/><Button id=\"_IDGenButton2\" \r\n                            text=\"Upload File\"\r\n                            press=\"handleUploadPress\"/></Toolbar></headerToolbar><StandardListItem type=\"Active\" title=\"{localModel>Filename}\" info=\"{localModel>Mimetype} {localModel>Guid}\"  press=\"downloadAttachment\"\r\n            /></List></Panel></VBox></core:FragmentDefinition>",
	"dksh/ymm/mcfupdate/mcfupdate/ext/fragment/FragmentRefDoc.fragment.xml": "<core:FragmentDefinition\r\n\txmlns:mvc=\"sap.ui.core.mvc\"\r\n    xmlns=\"sap.m\"\r\n    xmlns:f=\"sap.f\"\r\n    xmlns:smartTable=\"sap.ui.comp.smarttable\"\r\n    xmlns:form=\"sap.ui.layout.form\"\r\n    xmlns:core=\"sap.ui.core\" ><smartTable:SmartTable id=\"RefDocTable\" entitySet=\"RefDocSet\"  tableType=\"Table\"\r\n        useExportToExcel=\"true\" beforeExport=\"onBeforeExport\" useVariantManagement=\"true\"\r\n        useTablePersonalisation=\"true\" header=\"Line Items\" showRowCount=\"true\" persistencyKey=\"SmartTableAnalytical_Explored\"\r\n        enableAutoBinding=\"true\" class=\"sapUiResponsiveContentPadding\" enableAutoColumnWidth=\"true\" editTogglable=\"false\"  \r\n        initiallyVisibleFields=\"Country,Busunit,Type,ItemNo,Description\" beforeRebindTable=\"onSmartTableBeforeRebindTable\"><Table selectionChange=\"onSelect\"  growing=\"true\"/><smartTable:layoutData><FlexItemData growFactor=\"1\"\r\n                 baseSize=\"0%\"/></smartTable:layoutData></smartTable:SmartTable></core:FragmentDefinition>",
	"dksh/ymm/mcfupdate/mcfupdate/ext/fragment/FragmentUpload.fragment.xml": "<core:FragmentDefinition \r\n    xmlns:core=\"sap.ui.core\" \r\n    xmlns=\"sap.m\" \r\n    xmlns:u=\"sap.ui.unified\"><VBox id=\"idVBox\"><Panel id=\"idFiChangePanel\" expanded=\"true\" visible=\"false\"><Label id=\"idTaxTypeLabel\" labelFor=\"idTaxTypeInput\" text=\"{i18n>TaxType}\"/><Input id=\"idTaxTypeInput\" value=\"{TaxType}\" ></Input><Label id=\"idTaxClassificationLabel\" labelFor=\"idTaxClassificationInput\" text=\"{i18n>TaxClassification}\"/><Input id=\"idTaxClassificationInput\" value=\"{TaxClassification}\" ></Input><Label id=\"idAccountAssignmentGroup.Label\" labelFor=\"idAcctAssmtGrgInput\" text=\"{i18n>AcctAssmtGrg}\"/><Input id=\"idAcctAssmtGrgInput\" value=\"{AcctAssmtGrg}\" ></Input></Panel><Panel id=\"idCCDChangePanel\" expanded=\"true\" visible=\"false\"><Label id=\"idHSCodeLabel\" labelFor=\"idTaxTypeInput\" text=\"{i18n>HSCode}\"/><Input id=\"idHSCodeInput\" value=\"{HSCode}\" ></Input><Label id=\"idImportDutyLabel\" labelFor=\"idImportDutyInput\" text=\"{i18n>ImportDuty}\"/><Input id=\"idImportDutyInput\" value=\"{ImportDuty}\" ></Input></Panel></VBox></core:FragmentDefinition>",
	"dksh/ymm/mcfupdate/mcfupdate/i18n/enhi18n.properties": "T_OP_OBJECT_PAGE_SAVE=\"Submit\"",
	"dksh/ymm/mcfupdate/mcfupdate/i18n/i18n.properties": "# This is the resource bundle for dksh.ymm.mcfupdate.mcfupdate\r\n\r\n#Texts for manifest.json\r\n\r\n#XTIT: Application name\r\nappTitle=Material Master Update\r\n\r\n#YDES: Application description\r\nappDescription=Material Master Update\r\n\r\nExtViewName=Related Change\r\n\r\nAcctAssmtGrg=Account Assignment Group\r\nTaxClassification=Tax Classification\r\nTaxType=Tax Type\r\nAttachments=Attachments\r\n\r\nHSCode=HS Code\r\nImportDuty=Import Duty %\r\nActivityLogs=Activity Logs\r\nT_OP_OBJECT_PAGE_SAVE=\"Submit\"\r\nSubmit=Submit\r\nRefDoc=Reference Documents\r\n"
}, "dksh/ymm/mcfupdate/mcfupdate/Component-preload");