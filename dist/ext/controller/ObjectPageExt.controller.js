sap.ui.define(["sap/m/MessageToast","sap/ui/model/json/JSONModel"],(function(e,t){"use strict";return{onSelectedChangeType:function(e){let t=e.getParameter("value"),a=sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--AfterFacet::YMM_C_MCF_UPDATE::idStandardMaterial::Section"),i=this.byId("idFiChangePanel"),n=this.byId("idCCDChangePanel");"Finance Related"==t?(a.setTitle("Finance Related Change"),i.setVisible(!0),n.setVisible(!1)):(a.setTitle("CCD Related Change"),i.setVisible(!1),n.setVisible(!0))},onInit:function(){},beforeSaveExtension:function(){let e=this.byId("idFiChangePanel"),t=this.byId("idCCDChangePanel");e.setVisible(!1),t.setVisible(!1)},onExit:function(){},onAfterRendering:function(){sap.ui.getCore().byId("dksh.ymm.mcfupdate.mcfupdate::sap.suite.ui.generic.template.ObjectPage.view.Details::YMM_C_MCF_UPDATE--idMaterialInput::ChangeType::Field").attachChange(this.onSelectedChangeType,this)},handleUploadPress:function(){var t=this.byId("idFileUploader");t.checkFileReadable().then((function(){t.upload()}),(function(t){e.show("The file cannot be read. It may have changed.")})).then((function(){t.clear()}))},handleUploadComplete:function(t){var a,i=t.getParameter("response"),n=/\d{4}/.exec(i),s=n&&parseInt(n[0]);i&&(a=200===s?i+" (Upload Success)":i+" (Upload Error)",e.show(a))},onSaveDraft:function(){console.log("Save as draft!")}}}));