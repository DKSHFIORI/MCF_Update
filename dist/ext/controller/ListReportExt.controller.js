sap.ui.define(["sap/m/MessageToast"],(function(n){"use strict";return{onEnterKeys:function(e){n.show("Custom handler invoked.")},onAfterRendering:function(){console.log("TEST")}}}));