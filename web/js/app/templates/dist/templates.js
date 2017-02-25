Ember.TEMPLATES["_dropdown-left"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push("\n\n<table class=\"table hoverTable sidebar-index-table\">\n    <tr class=\"no-hover\">\n        <th></th>\n        <th>\n            <h3 class=\"h3-small\" id=\"add-red-flags\">\n                Red Flags\n            </h3>\n        </th>\n    </tr>\n\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has no business, no revenues and no product."),
    'valueBinding': ("redFlagParams._toggles.financials"),
    'showParameters': ("financials")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company undergoes frequent material changes in business strategy or its line of business."),
    'valueBinding': ("redFlagParams._toggles.symbology"),
    'showParameters': ("symbology")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Officers or insiders of the issuer are associated with multiple penny stock issuers."),
    'valueBinding': ("redFlagParams._toggles.otc_neighbors"),
    'showParameters': ("otc_neighbors")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has been the subject of a prior trading suspension."),
    'valueBinding': ("redFlagParams._toggles.suspensions"),
    'showParameters': ("suspensions")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has not made disclosures in SEC or other regulatory filings."),
    'valueBinding': ("redFlagParams._toggles.delinquency"),
    'showParameters': ("delinquency")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n    \n\n    <tr class=\"no-hover\" id=\"hovertable-bottom-border\"><td colspan=\"3\"></tr>\n    <tr class=\"no-hover\">\n        <td></td>\n        <td><h3 class=\"h3-small\" id=\"add-red-flags\">Additional Red Flags</h3></td>\n    </tr>\n\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Investors have made allegations about malfeasance of the company on social media."),
    'valueBinding': ("redFlagParams._toggles.crowdsar"),
    'showParameters': ("crowdsar")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n    <tr class=\"no-hover\">\n        <td colspan=\"3\">\n            <button class=\"btn btn-success\" id=\"find-button\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sort_companies", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n                Find\n            </button>\n        </td>\n    </tr>\n    <tr class=\"no-hover\">\n        <td colspan=\"3\">\n            <button class=\"btn btn-success\" id=\"find-button\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "refresh_companies", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n                Refresh\n            </button>\n        </td>\n    </tr>\n</table>\n");
  return buffer;
  
});

Ember.TEMPLATES["_dropdown-right"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>Social Media Malfeasance Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"control-label\">From Date:</label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatepickerView", {hash:{
    'defaultDate': ("redFlagParams._params.crowdsar.min_date"),
    'valueBinding': ("redFlagParams._params.crowdsar.min_date"),
    'class': ("form-control")
  },hashTypes:{'defaultDate': "ID",'valueBinding': "ID",'class': "STRING"},hashContexts:{'defaultDate': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            <label class=\"control-label\">To Date:</label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatepickerView", {hash:{
    'defaultDate': ("redFlagParams._params.crowdsar.max_date"),
    'valueBinding': ("redFlagParams._params.crowdsar.max_date"),
    'class': ("form-control")
  },hashTypes:{'defaultDate': "ID",'valueBinding': "ID",'class': "STRING"},hashContexts:{'defaultDate': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Field </label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("crowdsar_select_content.field"),
    'valueBinding': ("redFlagParams._params.crowdsar.field"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.name"),
    'class': ("form-control")
  },hashTypes:{'content': "ID",'valueBinding': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'class': "STRING"},hashContexts:{'content': depth0,'valueBinding': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Metric </label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("crowdsar_select_content.metric"),
    'valueBinding': ("redFlagParams._params.crowdsar.metric"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.name"),
    'class': ("form-control")
  },hashTypes:{'content': "ID",'valueBinding': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'class': "STRING"},hashContexts:{'content': depth0,'valueBinding': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Threshold </label>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("number"),
    'valueBinding': ("redFlagParams._params.crowdsar.threshold"),
    'class': ("form-control")
  },hashTypes:{'type': "STRING",'valueBinding': "ID",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        </div>\n\n    </form>\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>Change in Business Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"control-label\">From Date:</label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatepickerView", {hash:{
    'defaultDate': ("redFlagParams._params.symbology.min_date"),
    'valueBinding': ("redFlagParams._params.symbology.min_date"),
    'class': ("form-control")
  },hashTypes:{'defaultDate': "ID",'valueBinding': "ID",'class': "STRING"},hashContexts:{'defaultDate': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            <label class=\"control-label\">To Date:</label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatepickerView", {hash:{
    'defaultDate': ("redFlagParams._params.symbology.max_date"),
    'valueBinding': ("redFlagParams._params.symbology.max_date"),
    'class': ("form-control")
  },hashTypes:{'defaultDate': "ID",'valueBinding': "ID",'class': "STRING"},hashContexts:{'defaultDate': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Name Field </label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("symbology_select_content"),
    'valueBinding': ("redFlagParams._params.symbology.field"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.name"),
    'class': ("form-control")
  },hashTypes:{'content': "ID",'valueBinding': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'class': "STRING"},hashContexts:{'content': depth0,'valueBinding': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Threshold </label>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("number"),
    'valueBinding': ("redFlagParams._params.symbology.threshold"),
    'class': ("form-control")
  },hashTypes:{'type': "STRING",'valueBinding': "ID",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        </div>\n    </form>\n");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>No Business, No Revenues, No Product Definitions</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"control-label\">From Date:</label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatepickerView", {hash:{
    'defaultDate': ("redFlagParams._params.financials.min_date"),
    'valueBinding': ("redFlagParams._params.financials.min_date"),
    'class': ("form-control")
  },hashTypes:{'defaultDate': "ID",'valueBinding': "ID",'class': "STRING"},hashContexts:{'defaultDate': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    \n            <label class=\"control-label\">To Date:</label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatepickerView", {hash:{
    'defaultDate': ("redFlagParams._params.financials.max_date"),
    'valueBinding': ("redFlagParams._params.financials.max_date"),
    'class': ("form-control")
  },hashTypes:{'defaultDate': "ID",'valueBinding': "ID",'class': "STRING"},hashContexts:{'defaultDate': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Financial Measure </label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("financials_select_content"),
    'valueBinding': ("redFlagParams._params.financials.field"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.name"),
    'class': ("form-control")
  },hashTypes:{'content': "ID",'valueBinding': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'class': "STRING"},hashContexts:{'content': depth0,'valueBinding': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Value </label>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("redFlagParams._params.financials.value"),
    'class': ("form-control input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "ID",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (1000000),
    'step': (100),
    'valueBinding': ("redFlagParams._params.financials.value"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "ID",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Number of Filings Below Value </label>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("number"),
    'valueBinding': ("redFlagParams._params.financials.threshold"),
    'class': ("form-control")
  },hashTypes:{'type': "STRING",'valueBinding': "ID",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        </div>\n    </form>\n");
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>Lack of Disclosures (Late Filings) Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"control-label\">From Date:</label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatepickerView", {hash:{
    'defaultDate': ("redFlagParams._params.delinquency.min_date"),
    'valueBinding': ("redFlagParams._params.delinquency.min_date"),
    'class': ("form-control")
  },hashTypes:{'defaultDate': "ID",'valueBinding': "ID",'class': "STRING"},hashContexts:{'defaultDate': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            <label class=\"control-label\">To Date:</label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatepickerView", {hash:{
    'defaultDate': ("redFlagParams._params.delinquency.max_date"),
    'valueBinding': ("redFlagParams._params.delinquency.max_date"),
    'class': ("form-control")
  },hashTypes:{'defaultDate': "ID",'valueBinding': "ID",'class': "STRING"},hashContexts:{'defaultDate': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Form </label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("late_filings_content"),
    'valueBinding': ("redFlagParams._params.delinquency.form"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.name"),
    'class': ("form-control")
  },hashTypes:{'content': "ID",'valueBinding': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'class': "STRING"},hashContexts:{'content': depth0,'valueBinding': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\" control-label\"> Threshold </label>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("number"),
    'size': (6),
    'valueBinding': ("redFlagParams._params.delinquency.threshold"),
    'class': ("form-control")
  },hashTypes:{'type': "STRING",'size': "INTEGER",'valueBinding': "ID",'class': "STRING"},hashContexts:{'type': depth0,'size': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        </div>\n    </form>\n");
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>Trading Suspensions Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"control-label\">From Date:</label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatepickerView", {hash:{
    'defaultDate': ("redFlagParams._params.suspensions.min_date"),
    'valueBinding': ("redFlagParams._params.suspensions.min_date"),
    'class': ("form-control")
  },hashTypes:{'defaultDate': "ID",'valueBinding': "ID",'class': "STRING"},hashContexts:{'defaultDate': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            <label class=\"control-label\">To Date:</label>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatepickerView", {hash:{
    'defaultDate': ("redFlagParams._params.suspensions.max_date"),
    'valueBinding': ("redFlagParams._params.suspensions.max_date"),
    'class': ("form-control")
  },hashTypes:{'defaultDate': "ID",'valueBinding': "ID",'class': "STRING"},hashContexts:{'defaultDate': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n\n        <div class=\"form-group\">\n            <label class=\" control-label\"> Threshold </label>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("number"),
    'valueBinding': ("redFlagParams._params.suspensions.threshold"),
    'class': ("form-control")
  },hashTypes:{'type': "STRING",'valueBinding': "ID",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        </div>\n    </form>\n");
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>OTC Affiliates Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Number of Neighbors </label>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("redFlagParams._params.otc_neighbors.number_of_neighbors"),
    'class': ("form-control input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "ID",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.RangeSliderView", {hash:{
    'min': (0),
    'max': (100),
    'valuesBinding': ("redFlagParams._params.otc_neighbors.number_of_neighbors"),
    'class': ("range-slider")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'valuesBinding': "ID",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'valuesBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n        <div class=\"form-group\">\n            <label class=\"control-label\"> Minimum Percent OTC </label>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("redFlagParams._params.otc_neighbors.threshold"),
    'class': ("form-control input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "ID",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (100),
    'step': (1),
    'valueBinding': ("redFlagParams._params.otc_neighbors.threshold"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "ID",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n    </form>\n");
  return buffer;
  }

  data.buffer.push("\n\n\n\n");
  stack1 = helpers['if'].call(depth0, "crowdsar", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n\n        \n");
  stack1 = helpers['if'].call(depth0, "symbology", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        \n");
  stack1 = helpers['if'].call(depth0, "financials", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  stack1 = helpers['if'].call(depth0, "delinquency", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  stack1 = helpers['if'].call(depth0, "suspensions", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  stack1 = helpers['if'].call(depth0, "otc_neighbors", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
  
});

Ember.TEMPLATES["_linkModal"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                    <a ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'href': ("x.link")
  },hashTypes:{'href': "ID"},hashContexts:{'href': depth0},contexts:[],types:[],data:data})));
  data.buffer.push("> ");
  stack1 = helpers._triageMustache.call(depth0, "x.link", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </a>\n                ");
  return buffer;
  }

  data.buffer.push("\n\n<div class=\"modal fade\" id=\"linkModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n                <h4 class=\"modal-title\">Links to Appearances</h4>\n            </div>\n            <div class=\"modal-body\">\n                ");
  stack1 = helpers.each.call(depth0, "x", "in", "links", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n            </div>\n        </div>\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["_mainnavbar"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n    <nav class=\"navbar yamm navbar-fixed-top\" id=\"navbar-bgcolor\" role=\"navigation\">\n            ");
  stack1 = helpers['if'].call(depth0, "session.isAuthenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n        <div class=\"container-fluid\">\n            <div class=\"navbar-header\">\n                <a class=\"navbar-brand red-text\">Penny SAE</a>\n            </div>\n\n            <div class=\"collapse navbar-collapse\">\n                <div class=\"navbar-form navbar-left\" id=\"search-padding\">\n                    <div class=\"form-group\">\n                       ");
  data.buffer.push(escapeExpression((helper = helpers['focus-input'] || (depth0 && depth0['focus-input']),options={hash:{
    'class': ("form-control"),
    'placeholder': ("- Search-"),
    'id': ("search-text"),
    'insert-newline': ("companySearch")
  },hashTypes:{'class': "STRING",'placeholder': "STRING",'id': "STRING",'insert-newline': "STRING"},hashContexts:{'class': depth0,'placeholder': depth0,'id': depth0,'insert-newline': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "focus-input", options))));
  data.buffer.push("\n                    </div>\n                    <div class=\"form-group\">\n                        \n                        ");
  stack1 = helpers['if'].call(depth0, "searchTopic", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleSwitch", {hash:{
    'checkedBinding': ("searchTopic")
  },hashTypes:{'checkedBinding': "STRING"},hashContexts:{'checkedBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    </div>\n   \n                    ");
  stack1 = helpers['if'].call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n                </div>\n\n\n\n                <ul class=\"nav navbar-nav navbar-right\">\n                    <li class=\"dropdown yamm\" id=\"big-dropdown\">\n                        <a class=\"btn btn-default navbar-btn dropdown-toggle\" id=\"big-dropdown-button\"> Red Flag Filters </a>\n                        <ul class=\"dropdown-menu\" id=\"filter-list\">\n                            <li>\n                                <div class=\"yamm-content\">\n                                    ");
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "dropdown", options) : helperMissing.call(depth0, "render", "dropdown", options))));
  data.buffer.push("\n                                </div>\n                            </li>\n                        </ul>\n                    </li>\n\n                </ul>\n            </div>\n        </div>\n    </nav>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                <a ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "invalidateSession", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(" id=\"btn-logout\" class=\"btn btn-link glyphicon glyphicon-off navbar-btn navbar-right\"></a>\n            ");
  return buffer;
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n                            Searching topics\n                        ");
  }

function program6(depth0,data) {
  
  
  data.buffer.push("\n                            Searching companies\n                        ");
  }

function program8(depth0,data) {
  
  
  data.buffer.push("\n                        <i class=\"fa fa-spinner fa-spin\" id=\"spinner\"></i>\n                        <span class=\"loader-text\" >Loading results...</span>\n                    ");
  }

  data.buffer.push("\n\n");
  stack1 = helpers['if'].call(depth0, "showNav", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["_ner"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            <tr ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': ("s.hidden:ner-hidden")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                <td>");
  stack1 = helpers._triageMustache.call(depth0, "s.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                <td>");
  stack1 = helpers._triageMustache.call(depth0, "s.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                <td>");
  stack1 = helpers._triageMustache.call(depth0, "s.data.source", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                <td>");
  stack1 = helpers._triageMustache.call(depth0, "s.data.relationship", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                <td>\n                    <button ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': ("s.hidden:btn-show-ner:btn-hide-ner")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggle_ner", "s", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(">\n                        ");
  stack1 = helpers['if'].call(depth0, "s.hidden", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </button>\n                    <button class=\"btn-link-ner\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "show_links_ner", "s", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(" data-toggle=\"modal\" data-target=\"#linkModal\">\n                        Links\n                    </button>\n                </td>\n            </tr>\n        ");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("\n                            Show\n                        ");
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n                            Hide\n                        ");
  }

  data.buffer.push("\n\n<span class=\"centered\">\n    <table class=\"table table-hover\" id=\"ner-table\">\n        <tr><th>CIK</th><th>Name</th><th>Source</th><th>Relationship</th><th></th></tr>\n        ");
  stack1 = helpers.each.call(depth0, "s", "in", "network_associates", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </table>\n</span>\n        \n");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "linkModal", options) : helperMissing.call(depth0, "partial", "linkModal", options))));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["_sarModal"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n\n<div class=\"modal fade\" id=\"sarModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"sarModelLabel\" aria-hidden=\"true\" id=\"sarModal-zindex\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n            <h4 class=\"modal-title\" id=\"sarModalLabel\">Generate Suspicious Activity report for: <br> ");
  stack1 = helpers._triageMustache.call(depth0, "currentName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</h4>\n            </div>\n            <div class=\"modal-body\" onmouseover=\"document.body.style.overflow='hidden';\"\n                onmouseout=\"document.body.style.overflow='auto';\">\n                <div id=\"sar-bg\">\n                    ");
  data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
    'id': ("sar-input"),
    'value': ("sarreport")
  },hashTypes:{'id': "STRING",'value': "ID"},hashContexts:{'id': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
  data.buffer.push("\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n                <button type=\"button\" class=\"btn btn-success\">Copy To Clipboard</button>\n            </div>\n        </div>\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["all_promotions"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  data.buffer.push("\n\n<h1>  Promotion placeholder </h1>\n");
  return buffer;
  
});

Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n\n<div class=\"container-fluid\">\n    ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "mainnavbar", options) : helperMissing.call(depth0, "partial", "mainnavbar", options))));
  data.buffer.push("\n    <div class=\"application-style\">\n        ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["associates"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n            <span class=\"centered\"> - Loading - </span>\n        ");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n            Known Associates\n        ");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n            <span class=\"centered\"> - No network data available - </span>\n        ");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("\n");
  }

function program9(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            \n    <table>\n        <tr>\n            <td>\n                <div id='toggle-button'>\n                    <button type='button' ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleTerminal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n                        ");
  stack1 = helpers['if'].call(depth0, "terminalToggle", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </button>\n                </div>\n            </td>\n            <td>&nbsp&nbsp</td>\n            <td><b>Red Flags:</b></td>\n            <td><img src='img/green_person.png' height='20px'> = less than 1</td>\n            <td><img src='img/yellow_person.png' height='20px'> = 1 - 1.99</td>\n            <td><img src='img/orange_person.png' height='20px'> = 2 - 3.99</td>\n            <td><img src='img/red_person.png' height='20px'> = more than 4</td>\n        </tr>\n    </table>\n");
  return buffer;
  }
function program10(depth0,data) {
  
  
  data.buffer.push(" \n                            Show Terminal Nodes\n                        ");
  }

function program12(depth0,data) {
  
  
  data.buffer.push("\n                            Hide Terminal Nodes\n                        ");
  }

  data.buffer.push("\n\n<span class=\"centered\">\n    <h3>\n        ");
  stack1 = helpers['if'].call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        \n        ");
  stack1 = helpers['if'].call(depth0, "noData", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </h3>\n</span>\n\n<div class=\"network-graph\"></div>\n    \n");
  stack1 = helpers['if'].call(depth0, "noData", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n<table id=\"associates-table\" class=\"display\"></table>\n");
  return buffer;
  
});

Ember.TEMPLATES["board"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n    <div class=\"data-progress centered\">\n        <i class=\"fa fa-spinner fa-spin\" id=\"spinner\"></i>\n        <span class=\"loader-text\" >Loading Data...</span>\n    </div>\n");
  }

function program3(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <div class=\"col-xs-12\" id=\"techan-wrapper\">\n        <div class=\"row\">\n            <div class=\"col-xs-6 col-xs-offset-1 btn-group\" id=\"bg\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("toggleVolume"),
    'param': ("na"),
    'colXs2': (true),
    'btnRoundXs': (true),
    'toggle': (true),
    'toggleAll': (true),
    'title': ("All")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs2': "BOOLEAN",'btnRoundXs': "BOOLEAN",'toggle': "BOOLEAN",'toggleAll': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs2': depth0,'btnRoundXs': depth0,'toggle': depth0,'toggleAll': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("toggleVolume"),
    'param': ("pos"),
    'colXs2': (true),
    'btnXs': (true),
    'toggle': (true),
    'togglePos': (true),
    'title': ("pos")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs2': "BOOLEAN",'btnXs': "BOOLEAN",'toggle': "BOOLEAN",'togglePos': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs2': depth0,'btnXs': depth0,'toggle': depth0,'togglePos': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("toggleVolume"),
    'param': ("neut"),
    'colXs2': (true),
    'btnXs': (true),
    'toggle': (true),
    'toggleNeut': (true),
    'title': ("neut")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs2': "BOOLEAN",'btnXs': "BOOLEAN",'toggle': "BOOLEAN",'toggleNeut': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs2': depth0,'btnXs': depth0,'toggle': depth0,'toggleNeut': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("toggleVolume"),
    'param': ("neg"),
    'colXs2': (true),
    'btnRoundXs': (true),
    'toggle': (true),
    'toggleNeg': (true),
    'title': ("neg")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs2': "BOOLEAN",'btnRoundXs': "BOOLEAN",'toggle': "BOOLEAN",'toggleNeg': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs2': depth0,'btnRoundXs': depth0,'toggle': depth0,'toggleNeg': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-xs-5\" id=\"tl-posts-volume\"></div>\n            <div class=\"col-xs-1\"></div>\n            <div class=\"col-xs-5\" id=\"pv-price-chart\"></div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-xs-5\" id=\"tl-brush-chart\"></div>\n            <div class=\"col-xs-1\"></div>\n            <div class=\"col-xs-5\" id=\"pv-volume-chart\"></div>\n        </div>\n");
  return buffer;
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n    <span class=\"centered\">\n    <h4> There is no data available. </h4>\n    </span>\n");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("\n            <div class=\"data-progress centered\">\n                <i class=\"fa fa-spinner fa-spin\" id=\"spinner\"></i>\n                <span class=\"loader-text\" >Loading Timeline Data...</span>\n            </div>\n        ");
  }

function program9(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n            <div class=\"col-xs-12 timeline-head\">\n                <div class=\"col-xs-3 number-posters\">\n                    ");
  data.buffer.push(escapeExpression((helper = helpers['focus-input'] || (depth0 && depth0['focus-input']),options={hash:{
    'class': ("form-control"),
    'placeholder': ("topX.length"),
    'id': ("number-posters-input"),
    'insert-newline': ("numPosters")
  },hashTypes:{'class': "STRING",'placeholder': "ID",'id': "STRING",'insert-newline': "STRING"},hashContexts:{'class': depth0,'placeholder': depth0,'id': depth0,'insert-newline': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "focus-input", options))));
  data.buffer.push("\n                </div>\n                <div class=\"col-xs-9 filter-button\">\n                    <div class=\"col-xs-12 btn-group top-buttons\">\n                        ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("ascdesc"),
    'param': ("sentiment"),
    'colXs6': (true),
    'btnRoundXs': (true),
    'faChevronDown': (true),
    'sentiment': (true),
    'title': (" Sentiment")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs6': "BOOLEAN",'btnRoundXs': "BOOLEAN",'faChevronDown': "BOOLEAN",'sentiment': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs6': depth0,'btnRoundXs': depth0,'faChevronDown': depth0,'sentiment': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("sortUsers"),
    'param': ("pos"),
    'colXs2': (true),
    'btnXs': (true),
    'filter': (true),
    'filterPos': (true),
    'title': ("pos")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs2': "BOOLEAN",'btnXs': "BOOLEAN",'filter': "BOOLEAN",'filterPos': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs2': depth0,'btnXs': depth0,'filter': depth0,'filterPos': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("sortUsers"),
    'param': ("neut"),
    'colXs2': (true),
    'btnXs': (true),
    'filter': (true),
    'filterNeut': (true),
    'title': ("neut")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs2': "BOOLEAN",'btnXs': "BOOLEAN",'filter': "BOOLEAN",'filterNeut': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs2': depth0,'btnXs': depth0,'filter': depth0,'filterNeut': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("sortUsers"),
    'param': ("neg"),
    'colXs2': (true),
    'btnRoundXs': (true),
    'filter': (true),
    'filterNeg': (true),
    'title': ("neg")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs2': "BOOLEAN",'btnRoundXs': "BOOLEAN",'filter': "BOOLEAN",'filterNeg': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs2': depth0,'btnRoundXs': depth0,'filter': depth0,'filterNeg': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                    </div>\n                    <div class=\"col-xs-12 btn-group bottom-buttons\">\n                        ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("ascdesc"),
    'param': ("numposts"),
    'colXs6': (true),
    'btnRoundXs': (true),
    'faChevronDown': (true),
    'numposts': (true),
    'title': (" Posts")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs6': "BOOLEAN",'btnRoundXs': "BOOLEAN",'faChevronDown': "BOOLEAN",'numposts': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs6': depth0,'btnRoundXs': depth0,'faChevronDown': depth0,'numposts': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("sortUsers"),
    'param': ("doc"),
    'colXs2': (true),
    'btnXs': (true),
    'filter': (true),
    'filterDoc': (true),
    'title': ("num")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs2': "BOOLEAN",'btnXs': "BOOLEAN",'filter': "BOOLEAN",'filterDoc': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs2': depth0,'btnXs': depth0,'filter': depth0,'filterDoc': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("sortUsers"),
    'param': ("max"),
    'colXs2': (true),
    'btnXs': (true),
    'filter': (true),
    'filterMax': (true),
    'title': ("max")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs2': "BOOLEAN",'btnXs': "BOOLEAN",'filter': "BOOLEAN",'filterMax': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs2': depth0,'btnXs': depth0,'filter': depth0,'filterMax': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression((helper = helpers['filter-button'] || (depth0 && depth0['filter-button']),options={hash:{
    'action': ("sortUsers"),
    'param': ("mean"),
    'colXs2': (true),
    'btnRoundXs': (true),
    'filter': (true),
    'filterMean': (true),
    'title': ("mean")
  },hashTypes:{'action': "STRING",'param': "STRING",'colXs2': "BOOLEAN",'btnRoundXs': "BOOLEAN",'filter': "BOOLEAN",'filterMean': "BOOLEAN",'title': "STRING"},hashContexts:{'action': depth0,'param': depth0,'colXs2': depth0,'btnRoundXs': depth0,'filter': depth0,'filterMean': depth0,'title': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "filter-button", options))));
  data.buffer.push("\n                    </div>\n                </div>\n            </div>\n            <div class=\"col-xs-12 timeline-container\">\n                <ul class=\"col-xs-12 timeline-panel\" id=\"timeline\">\n                    ");
  stack1 = helpers.each.call(depth0, "topX", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                </ul>\n            </div>\n        ");
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                        <li>    \n                            <div class=\"col-xs-4\">\n                                <div id='gauge-");
  stack1 = helpers._triageMustache.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("' class=\"gauge chart\"></div>\n                            </div>\n                            <div class=\"col-xs-8 ts chart\" id=\"ts-");
  stack1 = helpers._triageMustache.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\">\n                                <div class=\"timeline-info\">                        \n                                    <span class=\"title\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "topXClicked", "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push("></span>\n                                    <div class=\"count-wrapper pull-right during\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortUsers", "doc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
  data.buffer.push("></div>\n                                </div>\n                            </div>\n                        </li>\n                    ");
  return buffer;
  }

function program12(depth0,data) {
  
  
  data.buffer.push("\n        ");
  }

function program14(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n            <div class=\"search-input\">\n                <div class=\"input-group\" style=\"width: 100%;\">\n                    <div>\n                        ");
  data.buffer.push(escapeExpression((helper = helpers['focus-input'] || (depth0 && depth0['focus-input']),options={hash:{
    'class': ("form-control"),
    'placeholder': ("- Search Posts -"),
    'id': ("search-posts"),
    'insert-newline': ("messageSearch")
  },hashTypes:{'class': "STRING",'placeholder': "STRING",'id': "STRING",'insert-newline': "STRING"},hashContexts:{'class': depth0,'placeholder': depth0,'id': depth0,'insert-newline': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "focus-input", options))));
  data.buffer.push("\n                    </div>\n                </div>\n            </div>\n            <div class=\"forum-div\">\n                <ul class=\"list-group\" id=\"collection\">'\n                    ");
  stack1 = helpers.each.call(depth0, "postFilteredData", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                </ul>\n            </div>\n        ");
  return buffer;
  }
function program15(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n                        <li class=\"list-group-item comments-group-item\" id=\"forum-item\">\n                            <div class=\"list-group-item-heading message-header\">\n                                <div>");
  stack1 = helpers._triageMustache.call(depth0, "user", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n                                <div>");
  stack1 = helpers._triageMustache.call(depth0, "board", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n                                <div>");
  stack1 = helpers._triageMustache.call(depth0, "time", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n                                <div>\n                                    <a target=\"_blank\" ");
  data.buffer.push(escapeExpression((helper = helpers.bindAttr || (depth0 && depth0.bindAttr),options={hash:{
    'href': ("url")
  },hashTypes:{'href': "ID"},hashContexts:{'href': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bindAttr", options))));
  data.buffer.push(">\n                                        ");
  stack1 = helpers._triageMustache.call(depth0, "msg_id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                                    </a>\n                                </div>\n                            </div>\n                            <p class=\"list-group-item-text\" id=\"app-msg\">\n                            ");
  stack1 = helpers._triageMustache.call(depth0, "msg", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                            </p>\n                        </li>\n                    ");
  return buffer;
  }

  data.buffer.push("\n");
  stack1 = helpers['if'].call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  stack1 = helpers['if'].call(depth0, "isData", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n<div class=\"col-xs-12 charts-wrapper\">\n    <div class=\"col-xs-6\" id=\"gauge-timeline-cell\">\n        ");
  stack1 = helpers['if'].call(depth0, "timelineLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    <div class=\"col-xs-6\" id=\"forum-posts-cell\">\n        ");
  stack1 = helpers['if'].call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(14, program14, data),fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["delinquency"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n        <h3>Late Filings</h3>\n        <table id=\"delinquency-table\" class=\"display\"></table>\n        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DelinquencyView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  return buffer;
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n        <h4> This company has not provided it's financials the the SEC's XBRL format. </h4>\n    ");
  }

  data.buffer.push("\n\n\n<span class=\"centered\">\n    ");
  stack1 = helpers['if'].call(depth0, "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["detail"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push(" Price/Volume + Message Board ");
  }

function program3(depth0,data) {
  
  
  data.buffer.push(" NewsWire ");
  }

function program5(depth0,data) {
  
  
  data.buffer.push(" Financials ");
  }

function program7(depth0,data) {
  
  
  data.buffer.push(" Late <br /> Filings ");
  }

function program9(depth0,data) {
  
  
  data.buffer.push(" Regulatory <br /> Actions ");
  }

function program11(depth0,data) {
  
  
  data.buffer.push(" Network <br /> Analysis ");
  }

  data.buffer.push("\n\n<div class=\"container hundred-width\">\n    <div class=\"row-fluid\">\n        <nav class=\"navbar navbar-border\">\n            <div class=\"col-sm-6\">\n                <h1 class=\"zero-top-margin\"> ");
  stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </h1>\n            </div>\n            <div class=\"col-sm-2\">\n                <span class=\"centered\">\n                    <h4> ");
  stack1 = helpers._triageMustache.call(depth0, "ticker", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </h4>\n                </span>\n            </div>\n            <div class=\"col-sm-2\">\n                <span class=\"centered\">\n                    <h4 class=\"greyed\">  CIK: ");
  stack1 = helpers._triageMustache.call(depth0, "cik", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </h4>\n                </span>\n            </div>\n            <br />\n            <ul class=\"nav navbar-nav\" id=\"view-selector\">\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "board", options) : helperMissing.call(depth0, "link-to", "board", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "topNews", options) : helperMissing.call(depth0, "link-to", "topNews", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "financials", options) : helperMissing.call(depth0, "link-to", "financials", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "delinquency", options) : helperMissing.call(depth0, "link-to", "delinquency", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "previousReg", options) : helperMissing.call(depth0, "link-to", "previousReg", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "associates", options) : helperMissing.call(depth0, "link-to", "associates", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n\n            </ul>\n        </nav>\n    </div>\n</div>\n<div class=\"col-sm-12 col-sm-12-no-padding\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["disabledtogglerow"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n    <td class=\"dropdown-button-grey\">\n        Customize\n    </td>\n");
  }

  data.buffer.push("\n\n\n<td class=\"greyed\">\n    <i class=\"fa fa-square-o fa-1x\" class=\"greyed\"></i>\n</td>\n\n<td class=\"greyed\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "view.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</td>\n\n");
  stack1 = helpers['if'].call(depth0, "view.showParameters", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["dropdown"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n\n<div class=\"row-fluid\" id=\"div-dropdown\">\n    <div class=\"col-md-7\">\n        <form>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "dropdown-left", options) : helperMissing.call(depth0, "partial", "dropdown-left", options))));
  data.buffer.push("\n        </form>\n    </div>\n    <div class=\"col-md-5\">\n        ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "dropdown-right", options) : helperMissing.call(depth0, "partial", "dropdown-right", options))));
  data.buffer.push("\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["financials"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n        <h3>Financials</h3>\n        <table id=\"financials-table\" class=\"display\"></table>\n        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.FinancialsView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  return buffer;
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n        <span class=\"centered\">\n            <h4> This company has not provided it's financials in the SEC's XBRL format. </h4>\n        </span>\n    ");
  }

  data.buffer.push("\n\n\n<span class=\"centered\">\n    ");
  stack1 = helpers['if'].call(depth0, "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["frontpage"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n            <a ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "invalidateSession", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(" id=\"btn-logout\" class=\"btn glyphicon glyphicon-off btn-link pull-right\"></a>\n        ");
  return buffer;
  }

  data.buffer.push("\n\n<div class=\"frontpage-align\">\n    <h2 class=\"sae-head\"> Penny: Suspicious Activity Explorer </h2>\n\n    <nav class=\"navbar yamm navbar-fixed-top\" role=\"navigation\">\n        ");
  stack1 = helpers['if'].call(depth0, "session.isAuthenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </nav>\n\n    <div>\n        <h3 class=\"h3-small header-top-padding\"> - Search By Company Name or Ticker - </h3>\n        ");
  data.buffer.push(escapeExpression((helper = helpers['focus-input'] || (depth0 && depth0['focus-input']),options={hash:{
    'class': ("input-fat centered"),
    'insert-newline': ("companySearch")
  },hashTypes:{'class': "STRING",'insert-newline': "STRING"},hashContexts:{'class': depth0,'insert-newline': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "focus-input", options))));
  data.buffer.push("\n    </div>\n            \n    <div class=\"frontpage-table\">\n        <h3 class=\"h3-small\"> - Search By Red Flags - </h3>\n        <table class=\"table hoverTable front-page\">\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has no business, no revenues and no product."),
    'valueBinding': ("redFlagParams._toggles.financials")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company undergoes frequent material changes in business strategy or its line of business."),
    'valueBinding': ("redFlagParams._toggles.symbology")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Officers or insiders of the issuer are associated with multiple penny stock issuers."),
    'valueBinding': ("redFlagParams._toggles.otc_neighbors")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has been the subject of a prior trading suspension."),
    'valueBinding': ("redFlagParams._toggles.suspensions")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has not made disclosures in SEC or other regulatory filings."),
    'valueBinding': ("redFlagParams._toggles.delinquency")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            \n\n            <tr class=\"no-hover\" id=\"hovertable-bottom-border\"><td></td><td></td></tr>\n            <tr class=\"no-hover\">\n                <td></td>\n                <td><h3><font color=\"red\"> Additional Red Flags </font></h3></td>\n            </tr>\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Investors have made allegations about malfeasance of the company on social media."),
    'valueBinding': ("redFlagParams._toggles.crowdsar")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                <tr class=\"no-hover\">\n                    <td colspan=\"2\">\n                        <button class=\"btn btn-success btn-submit-frontpage\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "filterSearch", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n                            Find\n                        </button>\n                    </td>\n                </tr>\n            </table>\n        </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["hit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            <div class=\"list-group-item seventy square\">\n                <div class=\"hit-text-wrapper\">\n                    <h5 class=\"list-group-item-heading\">\n                        ");
  stack1 = helpers._triageMustache.call(depth0, "h.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </h5>\n                </div>\n\n                <div class=\"row-fluid hit-badge-wrapper\">\n                    <div id=\"badge-header\">\n                        ");
  stack1 = helpers.unless.call(depth0, "h.redFlags.possible", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                            Red Flags : ");
  stack1 = helpers._triageMustache.call(depth0, "h.redFlags.total", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("/");
  stack1 = helpers._triageMustache.call(depth0, "h.redFlags.possible", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                        ");
  stack1 = helpers.unless.call(depth0, "h.redFlags.possible", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                        \n                        ");
  stack1 = helpers['if'].call(depth0, "h.__topic__.doc_count", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </div>\n                    \n                    <br />\n\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'redFlags': ("h.redFlags.financials"),
    'type': ("financials"),
    'first_column': (true)
  },hashTypes:{'redFlags': "ID",'type': "STRING",'first_column': "BOOLEAN"},hashContexts:{'redFlags': depth0,'type': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'redFlags': ("h.redFlags.symbology"),
    'type': ("symbology"),
    'first_column': (true)
  },hashTypes:{'redFlags': "ID",'type': "STRING",'first_column': "BOOLEAN"},hashContexts:{'redFlags': depth0,'type': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'redFlags': ("h.redFlags.suspensions"),
    'type': ("suspensions"),
    'first_column': (true)
  },hashTypes:{'redFlags': "ID",'type': "STRING",'first_column': "BOOLEAN"},hashContexts:{'redFlags': depth0,'type': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'redFlags': ("h.redFlags.delinquency"),
    'type': ("delinquency"),
    'first_column': (true)
  },hashTypes:{'redFlags': "ID",'type': "STRING",'first_column': "BOOLEAN"},hashContexts:{'redFlags': depth0,'type': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'redFlags': ("h.redFlags.otc_neighbors"),
    'type': ("otc_neighbors"),
    'first_column': (true)
  },hashTypes:{'redFlags': "ID",'type': "STRING",'first_column': "BOOLEAN"},hashContexts:{'redFlags': depth0,'type': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'redFlags': ("h.redFlags.pv"),
    'type': ("pv"),
    'first_column': (false)
  },hashTypes:{'redFlags': "ID",'type': "STRING",'first_column': "BOOLEAN"},hashContexts:{'redFlags': depth0,'type': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'redFlags': ("h.redFlags.crowdsar"),
    'type': ("crowdsar"),
    'first_column': (false)
  },hashTypes:{'redFlags': "ID",'type': "STRING",'first_column': "BOOLEAN"},hashContexts:{'redFlags': depth0,'type': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                </div>\n            </div>\n        ");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("\n                            <p class=\"lg-text\">\n                        ");
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n                            </p>\n                        ");
  }

function program6(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                            -- Mentions : ");
  stack1 = helpers._triageMustache.call(depth0, "h.__topic__.doc_count", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                        ");
  return buffer;
  }

  data.buffer.push("\n\n<div class=\"accordion-group\">\n    <div class=\"accordion-heading\">\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
    'classNames': ("accordion-toggle"),
    'data-toggle': ("collapse-next")
  },hashTypes:{'classNames': "STRING",'data-toggle': "STRING"},hashContexts:{'classNames': depth0,'data-toggle': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "detail", "h.cik", options) : helperMissing.call(depth0, "link-to", "detail", "h.cik", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    <div class=\"accordion-body collapse out ab-sidebar\">\n        <div class=\"accordion-inner\">\n            <table id=\"search_result_");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "h.cik", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" class=\"display\"></table>\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SearchResultsView", {hash:{
    'cik': ("h.cik")
  },hashTypes:{'cik': "ID"},hashContexts:{'cik': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["hittextview"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n    <div ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'id': ("view.mid"),
    'class': ("view.flagged:flagged:not-flagged view.first_column:first_column:second_column")
  },hashTypes:{'id': "ID",'class': "STRING"},hashContexts:{'id': depth0,'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n        <div class=\"float-left\">  ");
  stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </div>\n        <div class=\"float-right\"> ");
  stack1 = helpers._triageMustache.call(depth0, "view.value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </div>\n    </div>\n");
  return buffer;
  }

  data.buffer.push("\n\n");
  stack1 = helpers['if'].call(depth0, "view.have", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
  
});

Ember.TEMPLATES["leadership"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n        ");
  stack1 = helpers['if'].call(depth0, "view.e", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        <div id=\"chart\">\n            <label><input id=\"d3inp\" type=\"checkbox\"> Sort values</label>\n            <br />\n            This can be swapped for sorting by name, date, length of tenure, etc...\n        </div>\n        ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            ");
  stack1 = helpers._triageMustache.call(depth0, "view.e.pos", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" \n            <br />\n            (");
  stack1 = helpers._triageMustache.call(depth0, "view.e.value.start", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" to ");
  stack1 = helpers._triageMustache.call(depth0, "view.e.value.stop", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(")\n        ");
  return buffer;
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n            Form 4 filing data for this company is unavailable.\n    ");
  }

  data.buffer.push("\n\n<span class=\"centered\">\n    ");
  stack1 = helpers.unless.call(depth0, "no_data", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["login"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n        <div class=\"input-group margin-bottom-sm\">\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'value': ("identification"),
    'placeholder': ("Enter Username"),
    'class': ("form-control"),
    'id': ("input-username")
  },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING",'id': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0,'id': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        </div>\n        <div class=\"input-group\">\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'value': ("password"),
    'placeholder': ("Enter Password"),
    'class': ("form-control"),
    'id': ("input-password"),
    'type': ("password")
  },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING",'id': "STRING",'type': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0,'id': depth0,'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        </div>\n        <br />\n        ");
  stack1 = helpers.unless.call(depth0, "session.isAuthenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("\n            <button id=\"auth-submit\" type=\"submit\" class=\"btn btn-default\">Login</button>\n        ");
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n            <h3 class=\"splash-header\"> Redirecting... </h3>\n        ");
  }

function program6(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n        ");
  stack1 = helpers.unless.call(depth0, "session.isAuthenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    ");
  return buffer;
  }
function program7(depth0,data) {
  
  
  data.buffer.push("\n            <h3 class=\"splash-header\"> Verifying Credentials... </h3>\n        ");
  }

function program9(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n        <div class=\"alert alert-danger alert-danger-login\">\n            <strong> Login failed: </strong> ");
  stack1 = helpers._triageMustache.call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </div>\n    ");
  return buffer;
  }

  data.buffer.push("\n\n    <form id=\"login-form\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "authenticate", {hash:{
    'on': ("submit")
  },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n\n    <h1 class=\"splash-header\"> Penny: Suspicious Activity Explorer </h1>\n\n    ");
  stack1 = helpers['if'].call(depth0, "show_login", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n    ");
  stack1 = helpers['if'].call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n</form>\n");
  return buffer;
  
});

Ember.TEMPLATES["omxNews"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("\n\n<div class=\"omx-wrapper\">\n    Something\n    <div class=\"omx-head\">\n        ");
  stack1 = helpers._triageMustache.call(depth0, "headline", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    <div class=\"omx-time\">\n        ");
  stack1 = helpers._triageMustache.call(depth0, "date", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    <div class=\"omx-body\">\n        ");
  stack1 = helpers._triageMustache.call(depth0, "article", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["previousReg"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n        <table id=\"previous-reg-table\" class=\"display\"></table>\n        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.PreviousRegView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  return buffer;
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n        <h4> This company has never been the subject of an SEC trading suspension. </h4>\n    ");
  }

  data.buffer.push("\n\n<span class=\"centered\">\n    <h3>Regulatory Actions</h3>\n    ");
  stack1 = helpers['if'].call(depth0, "have_records", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["promotions"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n        <p>\n            The following chart shows the number of times that this company\n            has meen featured in our collection of stock promotion emails.\n        </p>\n        <div class=\"col-sm-12 class=\"auto-overflow\">\n            <div id=\"cal-heatmap\"></div>\n        </div>\n                \n        <div class=\"accordion\" id=\"promotion_accordion\">\n            <div class=\"accordion-group\">\n                <div class=\"accordion-heading\">\n                    <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#promotion_accordion\" href=\"#promo_acc\">\n                        <h3 class=\"centered\"> Show List of Promotions </h3>\n                    </a>\n                </div>\n                <div id=\"promo_acc\" class=\"accordion-body collapse in\">\n                    <div class=\"accordion-inner\">\n                        <span class=\"centered\">\n                            <table id=\"table-promotions\">\n                                <tr>\n                                    <th>Date</th>\n                                    <th>Count</th>\n                                </tr>\n                                ");
  stack1 = helpers.each.call(depth0, "d", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                            </table>\n                        </span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                                    <tr>\n                                        <td>");
  stack1 = helpers._triageMustache.call(depth0, "d.date", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                                        <td>");
  stack1 = helpers._triageMustache.call(depth0, "d.cnt", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                                    </tr>\n                                ");
  return buffer;
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n        <h4> No record of stock promotions for this company. </h4>\n    ");
  }

  data.buffer.push("\n<span class=\"centered\">\n    <h3> History of Stock Promotions </h3>\n    ");
  stack1 = helpers['if'].call(depth0, "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["sidebar"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n        ");
  stack1 = helpers['if'].call(depth0, "from", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                \n        ");
  stack1 = helpers.unless.call(depth0, "total_hits", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            Results: Page ");
  stack1 = helpers._triageMustache.call(depth0, "page", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" \n            <br />\n        ");
  return buffer;
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n            No companies in our database match your search criteria.\n        ");
  }

function program6(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            ");
  stack1 = helpers._triageMustache.call(depth0, "total_hits", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" companies in our database match your search criteria. (Query took ");
  stack1 = helpers._triageMustache.call(depth0, "query_time", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("s)\n            \n            ");
  stack1 = helpers['if'].call(depth0, "searchTopic", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            \n            <div class=\"list-group square\">\n                ");
  stack1 = helpers.each.call(depth0, "h", "in", "hits", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </div>\n        ");
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n                ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "summary", options) : helperMissing.call(depth0, "link-to", "summary", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            ");
  return buffer;
  }
function program8(depth0,data) {
  
  
  data.buffer.push("\n                    <div class=\"list-group-item thirty square\" style='border-color:red; margin-bottom:5px; text-align:center;'>\n                        Results Summary\n                    </div>\n                ");
  }

function program10(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                    ");
  stack1 = helpers['if'].call(depth0, "h.name", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                ");
  return buffer;
  }
function program11(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitView", {hash:{
    'h': ("h")
  },hashTypes:{'h': "ID"},hashContexts:{'h': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  return buffer;
  }

  data.buffer.push("\n\n<div class=\"col-sm-4 no-padding-leftright\">\n    ");
  stack1 = helpers.unless.call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n\n<div class=\"col-sm-8 outlet-min-width\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["subNews"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push("\n\n");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.NewsView", {hash:{
    'valueBinding': ("model")
  },hashTypes:{'valueBinding': "STRING"},hashContexts:{'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["summary"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  data.buffer.push("\n<div class=\"col-xs-12\">\n    <div class=\"col-xs-4\"></div>\n    <div class=\"col-xs-4 navbar-brand red-text histogram-title\"> Date Histogram </div>\n    <div class=\"col-xs-4\"></div>\n    <div class=\"col-xs-12 date-histogram\"></div>\n\n    <div class=\"col-xs-4\"></div>\n    <div class=\"col-xs-4 col-offset-xs-4 navbar-brand red-text histogram-title\"> SIC Histogram </div>\n    <div class=\"col-xs-4\"></div>\n    <div class=\"col-xs-12 sic-histogram\"></div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["toggle-switch"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("\n\n<label for=\"");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "view.checkBoxId", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    <input id=\"");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "view.checkBoxId", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" type=\"checkbox\" ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'checked': ("view.checked")
  },hashTypes:{'checked': "STRING"},hashContexts:{'checked': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n    <div class=\"switch\"></div>\n</label>\n");
  return buffer;
  
});

Ember.TEMPLATES["togglerow"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n        <i class=\"fa fa-check-square-o fa-1x red-text\"></i>\n    ");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n        <i class=\"fa fa-square-o fa-1x greyed\"></i>\n    ");
  }

function program5(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n    <td class=\"dropdown-button\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "showParameters", "view.showParameters", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(">\n        Customize\n    </td>\n");
  return buffer;
  }

  data.buffer.push("\n\n<td>\n    ");
  stack1 = helpers['if'].call(depth0, "view.value", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</td>\n\n<td>\n    ");
  stack1 = helpers._triageMustache.call(depth0, "view.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</td>\n    \n");
  stack1 = helpers['if'].call(depth0, "view.showParameters", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["topNews"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                        ");
  stack1 = helpers.each.call(depth0, "release", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n                            <li class=\"li-omx\">\n                                ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "omxNews", "release.id", options) : helperMissing.call(depth0, "link-to", "omxNews", "release.id", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                            </li>\n                        ");
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                                    ");
  stack1 = helpers._triageMustache.call(depth0, "release.date", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" - ");
  stack1 = helpers._triageMustache.call(depth0, "release.headline", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                                ");
  return buffer;
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n                        <li class=\"li-omx\">\n                            No Results Returned\n                        </li>\n                    ");
  }

  data.buffer.push("\n<div class=\"col-sm-12\">\n	<div class=\"col-sm-12 search-input\">\n		<div class=\"input-group\" style=\"width: 100%;\">\n			<div>\n				");
  data.buffer.push(escapeExpression((helper = helpers['focus-input'] || (depth0 && depth0['focus-input']),options={hash:{
    'class': ("form-control"),
    'placeholder': ("- Search articles -"),
    'id': ("search-posts"),
    'insert-newline': ("newsSearch")
  },hashTypes:{'class': "STRING",'placeholder': "STRING",'id': "STRING",'insert-newline': "STRING"},hashContexts:{'class': depth0,'placeholder': depth0,'id': depth0,'insert-newline': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "focus-input", options))));
  data.buffer.push("\n			</div>\n		</div>\n	</div>\n</div>\n\n<div class=\"col-sm-12\">\n        <div class=\"col-sm-4\" id=\"news-posts-cell\">\n            <div class=\"headline-div\">\n                <ul class=\"dropdown-menu-right dropdown-menu-omx\" role=\"menu\">\n                    ");
  stack1 = helpers['if'].call(depth0, "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                </ul>\n            </div>\n        </div>\n        <div class=\"col-sm-8 article-omx\">\n            ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["topic-time-series"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  data.buffer.push("\n\n<div>\n    <div id=\"container-ttschart ttschart-hw\"></div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["topic"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                <tr>\n                    ");
  stack1 = helpers.each.call(depth0, "a", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                </tr>\n            ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                        <td>");
  stack1 = helpers._triageMustache.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                    ");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                                <tr>\n                                    ");
  stack1 = helpers.each.call(depth0, "c", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                                </tr>\n                            ");
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                                        <td>");
  stack1 = helpers._triageMustache.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                                    ");
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                    <tr class=\"cursor-initial\">\n                        <td>");
  stack1 = helpers._triageMustache.call(depth0, "un.key", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                    </tr>\n                ");
  return buffer;
  }

  data.buffer.push("\n\n<span class=\"centered\">\n    <h2> Summary Statistics: <i>");
  stack1 = helpers._triageMustache.call(depth0, "searchTerm_topic", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</i> </h2>\n            \n    <div>\n        <h3 class=\"red-text\"> Topic Trends Over Time </h3>\n        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.TopicTimeSeriesView", {hash:{
    'searchTerm_topic': ("searchTerm_topic")
  },hashTypes:{'searchTerm_topic': "ID"},hashContexts:{'searchTerm_topic': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    </div>\n    <hr />\n\n    <div>\n        <h3 class=\"red-text\"> Red Flag Summary </h3>\n        <h4> ");
  stack1 = helpers._triageMustache.call(depth0, "rf_any", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" of the ");
  stack1 = helpers._triageMustache.call(depth0, "count", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" companies (");
  stack1 = helpers._triageMustache.call(depth0, "pct_any", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(")% had one or more FINRA red flags. </h4>\n\n        <table class=\"table table-hover topic-table centered\">\n            <tr class=\"bold-font\"><td>Type of Red Flag</td><td>Number of Offending Companies</td></tr>\n            ");
  stack1 = helpers.each.call(depth0, "a", "in", "agg_redflag", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </table>\n    </div>\n    <hr />\n    <div>\n        <h3 class=\"text-red\"> Industry Classification Summary </h3>\n        <div class=\"auto-overflow\" id=\"placeholder\"></div>\n        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.TopicPieChartView", {hash:{
    'data': ("")
  },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        <div class=\"accordion\" id=\"topic_sic_accordion\">\n            <div class=\"accordion-group\">\n                <div class=\"accordion-heading\">\n                    <a class=\"accordion-toggle\" id=\"link-padding\" data-toggle=\"collapse\" data-parent=\"#topic_sic_accordion\" href=\"#a1\">\n                        <span class=\"centered\"><h3>Show Counts of SICs</h3></span>\n                    </a>\n                </div>\n                <div id=\"a1\" class=\"accordion-body collapse out\">\n                    <div class=\"accordion-inner\">\n                        <table class=\"table table-hover topic-table\">\n                            <tr>\n                                <td>Securities Industry Classification</td>\n                                <td>Count</td>\n                            </tr>\n                            ");
  stack1 = helpers.each.call(depth0, "c", "in", "cd_last", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                        </table>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <hr />\n        <div>\n            <h3 class=\"red-text\"> Topic Of Interest Companies with No SEC Filings </h3>\n            <table class=\"table table-hover topic-table centered\">\n                ");
  stack1 = helpers.each.call(depth0, "un", "in", "unknown_names", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </table>\n        </div>\n    </div>\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["wrapper"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("\n\n<div class=\"container-fluid\">");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["detail/index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  data.buffer.push("        \n");
  return buffer;
  
});

Ember.TEMPLATES["components/filter-button"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("\n");
  stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});