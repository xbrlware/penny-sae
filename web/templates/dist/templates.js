Ember.TEMPLATES["_dropdown-left"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push("\n\n<table class=\"table hoverTable sidebar-index-table\">\n    <tr class=\"no-hover\">\n        <th></th>\n        <th>\n            <h3 class=\"h3-small\" id=\"add-red-flags\">\n                Red Flags\n            </h3>\n        </th>\n    </tr>\n\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has no business, no revenues and no product."),
    'valueBinding': ("toggles.financials"),
    'showParameters': ("financials")
  },hashTypes:{'text': "STRING",'valueBinding': "ID",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company undergoes frequent material changes in business strategy or its line of business."),
    'valueBinding': ("toggles.delta"),
    'showParameters': ("delta")
  },hashTypes:{'text': "STRING",'valueBinding': "ID",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Officers or insiders of the issuer are associated with multiple penny stock issuers."),
    'valueBinding': ("toggles.network"),
    'showParameters': ("network")
  },hashTypes:{'text': "STRING",'valueBinding': "ID",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has been the subject of a prior trading suspension."),
    'valueBinding': ("toggles.trading_halts"),
    'showParameters': ("trading_halts")
  },hashTypes:{'text': "STRING",'valueBinding': "ID",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has not made disclosures in SEC or other regulatory filings."),
    'valueBinding': ("toggles.delinquency"),
    'showParameters': ("delinquency")
  },hashTypes:{'text': "STRING",'valueBinding': "ID",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n    \n\n    <tr class=\"no-hover\" id=\"hovertable-bottom-border\"><td colspan=\"3\"></tr>\n    <tr class=\"no-hover\">\n        <td></td>\n        <td><h3 class=\"h3-small\" id=\"add-red-flags\">Additional Red Flags</h3></td>\n    </tr>\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company stock has experienced recent price and/or volume anomalies."),
    'valueBinding': ("toggles.pv"),
    'showParameters': ("pv")
  },hashTypes:{'text': "STRING",'valueBinding': "ID",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Investors have made allegations about malfeasance of the company on social media."),
    'valueBinding': ("toggles.crowdsar"),
    'showParameters': ("crowdsar")
  },hashTypes:{'text': "STRING",'valueBinding': "ID",'showParameters': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0,'showParameters': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n    <tr class=\"no-hover\">\n        <td colspan=\"3\">\n            <button class=\"btn btn-success\" id=\"find-button\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "search_filters", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n                Find\n            </button>\n        </td>\n    </tr>\n</table>\n");
  return buffer;
  
});

Ember.TEMPLATES["_linkModal"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["_mainnavbar"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n    <nav class=\"navbar yamm navbar-fixed-top\" id=\"navbar-bgcolor\" role=\"navigation\">\n            ");
  stack1 = helpers['if'].call(depth0, "session.isAuthenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n        <div class=\"container-fluid\">\n            <div class=\"navbar-header\">\n                <a class=\"navbar-brand red-text\">SAE</a>\n            </div>\n\n            <div class=\"collapse navbar-collapse\">\n                <div class=\"navbar-form navbar-left\" id=\"search-padding\">\n                    <div class=\"form-group\">\n                       ");
  data.buffer.push(escapeExpression((helper = helpers['focus-input'] || (depth0 && depth0['focus-input']),options={hash:{
    'class': ("form-control"),
    'placeholder': ("- Search Company -"),
    'id': ("search-text"),
    'insert-newline': ("companySearch")
  },hashTypes:{'class': "STRING",'placeholder': "STRING",'id': "STRING",'insert-newline': "STRING"},hashContexts:{'class': depth0,'placeholder': depth0,'id': depth0,'insert-newline': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "focus-input", options))));
  data.buffer.push("\n                    </div>\n                </div>\n                <ul class=\"nav navbar-nav navbar-right\">\n                    <li class=\"dropdown yamm\" id=\"big-dropdown\">\n                        <a class=\"btn btn-default navbar-btn dropdown-toggle\" id=\"big-dropdown-button\" data-toggle=\"dropdown\"> Red Flag Filters </a>\n                        <ul class=\"dropdown-menu dropdown-menu-animated\" id=\"filter-list\">\n                            <li>\n                                <div class=\"yamm-content\">\n                                    ");
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "dropdown", options) : helperMissing.call(depth0, "render", "dropdown", options))));
  data.buffer.push("\n                                </div>\n                            </li>\n                        </ul>\n                    </li>\n\n                \n                \n                </ul>\n            </div>\n        </div>\n    </nav>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                <a ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "invalidateSession", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(" id=\"btn-logout\" class=\"btn btn-link navbar-btn navbar-right\">\n                    <i class=\"fa fa-sign-out\"></i>\n                </a>\n            ");
  return buffer;
  }

  data.buffer.push("\n\n");
  stack1 = helpers['if'].call(depth0, "showNav", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["_ner"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["_sarModal"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["_uniqueRecords"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n        <tr>\n            <td>");
  stack1 = helpers._triageMustache.call(depth0, "r.date", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n            <td>");
  stack1 = helpers._triageMustache.call(depth0, "r.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n            <td>");
  stack1 = helpers._triageMustache.call(depth0, "r.sic", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n            <td>");
  stack1 = helpers._triageMustache.call(depth0, "r.state", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n        </tr>\n    ");
  return buffer;
  }

  data.buffer.push("\n\n<table class=\"table\" id=\"uniqueRecordsTable\">\n    <tr><th> Date </th><th> Name </th><th> SIC </th><th> State </th></tr>\n    ");
  stack1 = helpers.each.call(depth0, "r", "in", "h.companyTable", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</table>\n");
  return buffer;
  
});

Ember.TEMPLATES["all_promotions"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  data.buffer.push("\n\n<h1>  Promotion placeholder </h1>\n");
  return buffer;
  
});

Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["associates"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n            <span class=\"centered\">\n                - Loading -\n            </span>\n        ");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n            Known Associates\n        ");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n                <span class=\"centered\">\n                    - No network data available -\n                </span>\n        ");
  }

function program7(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n    \n<div class=\"accordion\" id=\"associates_accordion\">\n    <div class=\"accordion-group\">\n        <div class=\"accordion-heading\">\n            <a class=\"accordion-toggle\" id=\"link-padding\" data-toggle=\"collapse\" data-parent=\"#associates_accordion\" href=\"#a1\">\n                <h3 class=\"assc-center\">List Associates of ");
  stack1 = helpers._triageMustache.call(depth0, "currentName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </h3>\n            </a>\n        </div>\n        <div id=\"a1\" class=\"accordion-body collapse out\">\n            <div class=\"accordion-inner\">\n                <div id=\"search-wrapper-network-er\">\n                    ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'class': ("input"),
    'value': ("searchTerm_er"),
    'class': ("assc-center"),
    'insert-newline': ("filter_er"),
    'placeholder': ("Filter")
  },hashTypes:{'class': "STRING",'value': "ID",'class': "STRING",'insert-newline': "STRING",'placeholder': "STRING"},hashContexts:{'class': depth0,'value': depth0,'class': depth0,'insert-newline': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                </div>\n                <div id=\"button-wrapper-network-er\">\n                    <button class=\"btn btn-danger\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save_toggles", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n                        Apply Changes\n                    </button>\n                </div>\n                <div class=\"ner-size\">\n                    ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "ner", options) : helperMissing.call(depth0, "partial", "ner", options))));
  data.buffer.push("\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");
  return buffer;
  }

  data.buffer.push("\n\n<span class=\"centered\">\n    <h3>\n        ");
  stack1 = helpers['if'].call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        \n        ");
  stack1 = helpers['if'].call(depth0, "noData", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </h3>\n</span>\n        \n");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.NetView", {hash:{
    'data': ("")
  },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n<span class=\"centered\">\n    <div onmouseover=\"document.body.style.overflow='hidden';\" onmouseout=\"document.body.style.overflow='auto';\" id=\"main-center-container\">\n        <input type=\"button\" class=\"btn btn-default\" value=\"Hide Terminal Nodes\" id=\"toggle-terminal\">\n        <input type=\"button\" class=\"btn btn-default\" value=\"Show Augmented Network\" id=\"toggle-ner\">\n        <div id=\"main-infovis\"></div>\n    </div>\n    <div id=\"right-container\">\n        <div id=\"inner-details\"></div>\n    </div>\n</span>\n\n<br />\n\n");
  stack1 = helpers['if'].call(depth0, "network_associates", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["delinquency"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n        <h3>Late Filings</h3>\n        <table class=\"table table-hover table-width\">\n            <tr>\n                <th>Date of Filing</th>\n                <th>Due Date</th>\n                <th>Form</th>\n                <th>Late</th>\n            </tr>\n            ");
  stack1 = helpers.each.call(depth0, "f", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </table>\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                <tr ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': ("f.std_late:late-row:timely-row")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                    <td>");
  stack1 = helpers._triageMustache.call(depth0, "f.dof", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                    <td>");
  stack1 = helpers._triageMustache.call(depth0, "f.dd", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                    <td>");
  stack1 = helpers._triageMustache.call(depth0, "f.form", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                    <td>\n                        ");
  stack1 = helpers['if'].call(depth0, "f.std_late", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </td>\n                </tr>\n            ");
  return buffer;
  }
function program3(depth0,data) {
  
  
  data.buffer.push("\n                            Late Filing\n                        ");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n                            On Time\n                        ");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("\n        <h4> This company has not provided it's financials the the SEC's XBRL format. </h4>\n    ");
  }

  data.buffer.push("\n\n\n<span class=\"centered\">\n    ");
  stack1 = helpers['if'].call(depth0, "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(7, program7, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["detail"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push(" ");
  stack1 = helpers._triageMustache.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" ");
  return buffer;
  }

function program3(depth0,data) {
  
  
  data.buffer.push(" Price / Volume Anomalies + <br> CROWDSAR ");
  }

function program5(depth0,data) {
  
  
  data.buffer.push(" News                                     ");
  }

function program7(depth0,data) {
  
  
  data.buffer.push(" Financials                               ");
  }

function program9(depth0,data) {
  
  
  data.buffer.push(" Late <br> Filings                        ");
  }

function program11(depth0,data) {
  
  
  data.buffer.push(" Regulatory <br> Actions                  ");
  }

function program13(depth0,data) {
  
  
  data.buffer.push(" Network <br> Analysis                    ");
  }

function program15(depth0,data) {
  
  
  data.buffer.push(" Stock Promotions                         ");
  }

function program17(depth0,data) {
  
  
  data.buffer.push(" Leadership                               ");
  }

  data.buffer.push("\n\n<div class=\"container hundred-width\">\n    <div class=\"row-fluid\">\n        <nav class=\"navbar navbar-border\">\n            <div class=\"col-sm-6\">\n                <h1 class=\"zero-top-margin\"> ");
  stack1 = helpers._triageMustache.call(depth0, "currentName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </h1>\n            </div>\n            <div class=\"col-sm-2\">\n                <span class=\"centered\">\n                    <h4> ");
  stack1 = helpers.each.call(depth0, "source.tickers.ticker", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </h4>\n                </span>\n            </div>\n            <div class=\"col-sm-2\">\n                <span class=\"centered\">\n                    <h4 class=\"greyed\">  CIK: ");
  stack1 = helpers._triageMustache.call(depth0, "cik", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" </h4>\n                </span>\n            </div>\n            \n            <br />\n            <ul class=\"nav navbar-nav\" id=\"view-selector\">\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "pvChart", options) : helperMissing.call(depth0, "link-to", "pvChart", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "googleNews", options) : helperMissing.call(depth0, "link-to", "googleNews", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "financials", options) : helperMissing.call(depth0, "link-to", "financials", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "delinquency", options) : helperMissing.call(depth0, "link-to", "delinquency", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "previousReg", options) : helperMissing.call(depth0, "link-to", "previousReg", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "associates", options) : helperMissing.call(depth0, "link-to", "associates", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "promotions", options) : helperMissing.call(depth0, "link-to", "promotions", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n                <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "leadership", options) : helperMissing.call(depth0, "link-to", "leadership", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n            </ul>\n        </nav>\n    </div>\n    <div class=\"col-sm-12\">\n        ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["disabledtogglerow"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["dropdown-right"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>Price/Volume Anomaly Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Price Spike (%) </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.pv.price_jump"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (10),
    'max': (1000),
    'step': (5),
    'valueBinding': ("rf.pv.price_jump"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Trailing Volume Window (days) </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.pv.volume_window"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (1000),
    'step': (10),
    'valueBinding': ("rf.pv.volume_window"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Trailing Volume Multiplier </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.pv.volume_multiplier"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (100),
    'step': (1),
    'valueBinding': ("rf.pv.volume_multiplier"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Fall To (%) </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.pv.fall_to"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("    \n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (100),
    'step': (1),
    'valueBinding': ("rf.pv.fall_to"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Fall Within (days) </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.pv.fall_within"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (1000),
    'step': (10),
    'valueBinding': ("rf.pv.fall_within"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n    </form>\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>CROWDSAR Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Suspicion Metric </label>\n            <div class=\"col-sm-8\">\n                <span class=\"centered\">\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("crowdsar_select_content"),
    'valueBinding': ("rf.crowdsar.type"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.name")
  },hashTypes:{'content': "ID",'valueBinding': "STRING",'optionValuePath': "STRING",'optionLabelPath': "STRING"},hashContexts:{'content': depth0,'valueBinding': depth0,'optionValuePath': depth0,'optionLabelPath': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                </span>\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Suspicious in Past Y Months </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.crowdsar.past_months"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (5),
    'step': (1),
    'valueBinding': ("rf.crowdsar.past_months"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n    </form>\n");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>Change in Business Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Type of Change </label>\n            <div class=\"col-sm-8\">\n                <span class=\"centered\">\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("delta_select_content"),
    'valueBinding': ("rf.delta.type"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.name")
  },hashTypes:{'content': "ID",'valueBinding': "STRING",'optionValuePath': "STRING",'optionLabelPath': "STRING"},hashContexts:{'content': depth0,'valueBinding': depth0,'optionValuePath': depth0,'optionLabelPath': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                </span>\n            </div>\n        </div>\n                \n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Number of Changes </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.delta.thresh"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("  \n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (10),
    'step': (1),
    'valueBinding': ("rf.delta.thresh"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n    </form>\n");
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>No Revenues Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Financial Measure </label>\n            <div class=\"col-sm-8\">\n                <span class=\"centered\">\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("financials_select_content"),
    'valueBinding': ("rf.financials.type"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.name")
  },hashTypes:{'content': "ID",'valueBinding': "STRING",'optionValuePath': "STRING",'optionLabelPath': "STRING"},hashContexts:{'content': depth0,'valueBinding': depth0,'optionValuePath': depth0,'optionLabelPath': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                </span>\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Below X Dollars </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.financials.below"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (1000000),
    'step': (100),
    'valueBinding': ("rf.financials.below"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> For past Y Years </label>\n            <div class=\"col-sm-8\">\n                        ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.financials.below_for"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (10),
    'step': (1),
    'valueBinding': ("rf.financials.below_for"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n    </form>\n");
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>Late Filings Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Number of Late Filings </label>\n            <div class=\"col-sm-8\">\n                        ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.delinquency.thresh"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (20),
    'step': (1),
    'valueBinding': ("rf.delinquency.thresh"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> In Past Y Years </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.delinquency.since"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (10),
    'step': (1),
    'valueBinding': ("rf.delinquency.since"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n    </form>\n");
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>Trading Halts Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Number of Trading Suspensions </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.trading_halts.thresh"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (5),
    'step': (1),
    'valueBinding': ("rf.trading_halts.thresh"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n    </form>\n");
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    <span class=\"centered\"><h4>OTC Affiliates Definition</h4></span>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Measure of Associates </label>\n            <div class=\"col-sm-8\">\n                <span class=\"centered\">\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("network_select_content"),
    'valueBinding': ("rf.network.type"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.name")
  },hashTypes:{'content': "ID",'valueBinding': "STRING",'optionValuePath': "STRING",'optionLabelPath': "STRING"},hashContexts:{'content': depth0,'valueBinding': depth0,'optionValuePath': depth0,'optionLabelPath': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                </span>\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-sm-4 control-label\"> Threshold </label>\n            <div class=\"col-sm-8\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'valueBinding': ("rf.network.thresh"),
    'class': ("input-text-hidden")
  },hashTypes:{'type': "STRING",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'valueBinding': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SliderView", {hash:{
    'min': (0),
    'max': (100),
    'step': (1),
    'valueBinding': ("rf.network.thresh"),
    'class': ("input-slider-dropdown")
  },hashTypes:{'min': "INTEGER",'max': "INTEGER",'step': "INTEGER",'valueBinding': "STRING",'class': "STRING"},hashContexts:{'min': depth0,'max': depth0,'step': depth0,'valueBinding': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            </div>\n        </div>\n    </form>\n");
  return buffer;
  }

  data.buffer.push("\n\n");
  stack1 = helpers['if'].call(depth0, "pv", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        \n");
  stack1 = helpers['if'].call(depth0, "crowdsar", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n\n        \n");
  stack1 = helpers['if'].call(depth0, "delta", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        \n");
  stack1 = helpers['if'].call(depth0, "financials", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  stack1 = helpers['if'].call(depth0, "delinquency", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  stack1 = helpers['if'].call(depth0, "trading_halts", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    \n");
  stack1 = helpers['if'].call(depth0, "network", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["dropdown"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n\n<div class=\"row-fluid\" id=\"div-dropdown\">\n    <div class=\"col-md-7\">\n        <form>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "dropdown-left", options) : helperMissing.call(depth0, "partial", "dropdown-left", options))));
  data.buffer.push("\n        </form>\n    </div>\n    <div class=\"col-md-5\" id=\"div-dropdown-right\">\n        ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "dropdown-right", options) : helperMissing.call(depth0, "partial", "dropdown-right", options))));
  data.buffer.push("\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["financials"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n        <h3>Financials</h3>\n        <table class=\"table table-hover table-width\">\n            <tr>\n                <th>Balance Sheet Date</th>\n                <th>Filing</th>\n                <th>Fiscal Year End</th>\n                <th>Revenues</th>\n                <th>Net Income</th>\n                <th>Assets</th>\n            </tr>\n            ");
  stack1 = helpers.each.call(depth0, "f", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </table>\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                <tr>\n                    <td>");
  stack1 = helpers._triageMustache.call(depth0, "f.bsd", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                    <td>");
  stack1 = helpers._triageMustache.call(depth0, "f.type", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                    <td>");
  stack1 = helpers._triageMustache.call(depth0, "f.fy", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                    <td>");
  stack1 = helpers._triageMustache.call(depth0, "f.revenues_pretty", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                    <td>");
  stack1 = helpers._triageMustache.call(depth0, "f.netincome_pretty", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                    <td>");
  stack1 = helpers._triageMustache.call(depth0, "f.assets_pretty", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                </tr>\n            ");
  return buffer;
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n        <span class=\"centered\">\n            <h4> This company has not provided it's financials the the SEC's XBRL format. </h4>\n        </span>\n    ");
  }

  data.buffer.push("\n\n\n<span class=\"centered\">\n    ");
  stack1 = helpers['if'].call(depth0, "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["frontpage"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n\n<div class=\"frontpage-align\">\n    <h1 class=\"phronesis-head\"> Phronesis </h1>\n    <h2 class=\"sae-head\"> Suspicious Activity Explorer </h2>\n    <h2 class=\"phronesis-head\"> Penny Stocks </h2>\n            \n    <div>\n        <h3 class=\"h3-small header-top-padding\"> - Search By Company Name or Ticker - </h3>\n        ");
  data.buffer.push(escapeExpression((helper = helpers['focus-input'] || (depth0 && depth0['focus-input']),options={hash:{
    'class': ("input-fat centered"),
    'insert-newline': ("companySearch")
  },hashTypes:{'class': "STRING",'insert-newline': "STRING"},hashContexts:{'class': depth0,'insert-newline': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "focus-input", options))));
  data.buffer.push("\n    </div>\n            \n    <div class=\"frontpage-table\">\n        <h3 class=\"h3-small\"> - Search By Red Flags - </h3>\n        <table class=\"table hoverTable front-page\">\n            <tr class=\"no-hover\">\n                <th> </th>\n                <th>\n                    <h3 class=\"red-text\"> Red Flags </h3>\n                </th>\n            </tr>\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has no business, no revenues and no product."),
    'valueBinding': ("toggles.financials")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company undergoes frequent material changes in business strategy or its line of business."),
    'valueBinding': ("toggles.delta")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Officers or insiders of the issuer are associated with multiple penny stock issuers."),
    'valueBinding': ("toggles.network")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has been the subject of a prior trading suspension."),
    'valueBinding': ("toggles.trading_halts")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company has not made disclosures in SEC or other regulatory filings."),
    'valueBinding': ("toggles.delinquency")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n            \n\n            <tr class=\"no-hover\" id=\"hovertable-bottom-border\"><td></td><td></td></tr>\n            <tr class=\"no-hover\">\n                <td></td>\n                <td><h3><font color=\"red\"> Additional Red Flags </font></h3></td>\n            </tr>\n                        \n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Company stock has experienced recent price and/or volume anomalies."),
    'valueBinding': ("toggles.pv")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                \n            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ToggleRowView", {hash:{
    'text': ("Investors have made allegations about malfeasance of the company on social media."),
    'valueBinding': ("toggles.crowdsar")
  },hashTypes:{'text': "STRING",'valueBinding': "STRING"},hashContexts:{'text': depth0,'valueBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                <tr class=\"no-hover\">\n                    <td colspan=\"2\">\n                        <button class=\"btn btn-success btn-submit-frontpage\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "filterSearch", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n                            Find\n                        </button>\n                    </td>\n                </tr>\n            </table>\n        </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["googleNews"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n            <div class=\"btn-group-vertical\">\n                \n                <button type=\"button\" class=\"btn btn-default\">\n                    ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "subNews", options) : helperMissing.call(depth0, "link-to", "subNews", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                </button>\n                \n                <div class=\"btn-group\">\n                    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\n                        Globe NewsWire\n                    </button>\n                    <ul class=\"dropdown-menu dropdown-menu-right dropdown-menu-omx\" role=\"menu\">\n                        ");
  stack1 = helpers.each.call(depth0, "release", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </ul>\n                </div>\n            </div>\n        ");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("Google Search");
  }

function program4(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n                            <li class=\"li-omx\">\n                                ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "omxNews", "release._id", options) : helperMissing.call(depth0, "link-to", "omxNews", "release._id", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                            </li>\n                        ");
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push(" ");
  stack1 = helpers._triageMustache.call(depth0, "release.head", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" ");
  return buffer;
  }

  data.buffer.push("\n\n\n\n<div id=\"google-news\"></div>\n<div class=\"row\">\n    <div class=\"col-sm-2\">\n        ");
  stack1 = helpers['if'].call(depth0, "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n\n    <div class=\"col-sm-10\">\n        ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["hit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            <div class=\"list-group-item seventy square\">\n                <div class=\"hit-text-wrapper\">\n                    <h5 class=\"list-group-item-heading\">\n                        ");
  stack1 = helpers._triageMustache.call(depth0, "h.currentName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </h5>\n                </div>\n                \n                <div class=\"row-fluid hit-badge-wrapper\">\n                    <div id=\"badge-header\">\n                        ");
  stack1 = helpers.unless.call(depth0, "h.redFlags.possible", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                            FINRA Red Flags : ");
  stack1 = helpers._triageMustache.call(depth0, "h.redFlags.total", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("/");
  stack1 = helpers._triageMustache.call(depth0, "h.redFlags.possible", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                        ");
  stack1 = helpers.unless.call(depth0, "h.redFlags.possible", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </div>\n                    <br />\n                                \n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'text': ("No Revenues"),
    'type': ("financials"),
    'redFlags': ("h.redFlags"),
    'first_column': (true)
  },hashTypes:{'text': "STRING",'type': "STRING",'redFlags': "ID",'first_column': "BOOLEAN"},hashContexts:{'text': depth0,'type': depth0,'redFlags': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'text': ("Change in Business"),
    'type': ("delta"),
    'redFlags': ("h.redFlags"),
    'first_column': (true)
  },hashTypes:{'text': "STRING",'type': "STRING",'redFlags': "ID",'first_column': "BOOLEAN"},hashContexts:{'text': depth0,'type': depth0,'redFlags': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'text': ("Trading Suspensions"),
    'type': ("trading_halts"),
    'redFlags': ("h.redFlags"),
    'first_column': (true)
  },hashTypes:{'text': "STRING",'type': "STRING",'redFlags': "ID",'first_column': "BOOLEAN"},hashContexts:{'text': depth0,'type': depth0,'redFlags': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'text': ("Late Filings"),
    'type': ("delinquency"),
    'redFlags': ("h.redFlags"),
    'first_column': (true)
  },hashTypes:{'text': "STRING",'type': "STRING",'redFlags': "ID",'first_column': "BOOLEAN"},hashContexts:{'text': depth0,'type': depth0,'redFlags': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'text': ("OTC Associates"),
    'type': ("network"),
    'redFlags': ("h.redFlags"),
    'first_column': (true)
  },hashTypes:{'text': "STRING",'type': "STRING",'redFlags': "ID",'first_column': "BOOLEAN"},hashContexts:{'text': depth0,'type': depth0,'redFlags': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'text': ("PV Anomalies"),
    'type': ("pv"),
    'redFlags': ("h.redFlags"),
    'first_column': (false)
  },hashTypes:{'text': "STRING",'type': "STRING",'redFlags': "ID",'first_column': "BOOLEAN"},hashContexts:{'text': depth0,'type': depth0,'redFlags': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitTextView", {hash:{
    'text': ("CROWDSAR"),
    'type': ("crowdsar"),
    'redFlags': ("h.redFlags"),
    'first_column': (false)
  },hashTypes:{'text': "STRING",'type': "STRING",'redFlags': "ID",'first_column': "BOOLEAN"},hashContexts:{'text': depth0,'type': depth0,'redFlags': depth0,'first_column': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                </div>\n            </div>\n        ");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("\n                            <p class=\"lg-text\">\n                        ");
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n                            </p>\n                        ");
  }

  data.buffer.push("\n\n<div class=\"accordion-group\">\n    <div class=\"accordion-heading\">\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
    'classNames': ("accordion-toggle"),
    'data-toggle': ("collapse-next")
  },hashTypes:{'classNames': "STRING",'data-toggle': "STRING"},hashContexts:{'classNames': depth0,'data-toggle': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "detail", "h.cik", options) : helperMissing.call(depth0, "link-to", "detail", "h.cik", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    \n    <div class=\"accordion-body collapse out ab-sidebar\">\n        <div class=\"accordion-inner\">\n            ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "uniqueRecords", options) : helperMissing.call(depth0, "partial", "uniqueRecords", options))));
  data.buffer.push("\n        </div>\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["hittextview"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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
  data.buffer.push(">\n        <div class=\"float-left\"> ");
  stack1 = helpers._triageMustache.call(depth0, "view.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
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
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["leadership"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["login"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n        <div class=\"input-group margin-bottom-sm\">\n            <span class=\"input-group-addon\"><i class=\"fa fa-user fa-fw\"></i></span>\n            ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'value': ("identification"),
    'placeholder': ("Enter Username"),
    'class': ("form-control"),
    'id': ("input-username")
  },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING",'id': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0,'id': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        </div>\n        <div class=\"input-group\">\n            <span class=\"input-group-addon\"><i class=\"fa fa-key fa-fw\"></i></span>\n            ");
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
  data.buffer.push("\n    <div class=\"alert alert-danger alert-danger-login\">\n        <strong> Login failed: </strong> ");
  stack1 = helpers._triageMustache.call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n");
  return buffer;
  }

  data.buffer.push("\n\n<form id=\"login-form\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "authenticate", {hash:{
    'on': ("submit")
  },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n\n    <h1 class=\"splash-header\"> Nodesec </h1>\n\n    ");
  stack1 = helpers['if'].call(depth0, "show_login", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n</form>\n\n");
  stack1 = helpers['if'].call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["omxNews"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("\n\n<div class=\"omx-wrapper\">\n    <div class=\"omx-head\">\n        ");
  stack1 = helpers._triageMustache.call(depth0, "model.head", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    <div class=\"omx-time\">\n        ");
  stack1 = helpers._triageMustache.call(depth0, "model.time", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    <div class=\"omx-body\">\n        \n        ");
  stack1 = helpers._triageMustache.call(depth0, "model.body", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["previousReg"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n        ");
  stack1 = helpers.each.call(depth0, "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            <h4> Trading in this security was suspended on <a ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'href': ("url")
  },hashTypes:{'href': "STRING"},hashContexts:{'href': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">");
  stack1 = helpers._triageMustache.call(depth0, "date", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</a></h4>\n        ");
  return buffer;
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n        <h4> This company has never been the subject of an SEC trading suspension. </h4>\n    ");
  }

  data.buffer.push("\n\n<span class=\"centered\">\n    <h3>Previous Regulatory Actions</h3>\n    ");
  stack1 = helpers['if'].call(depth0, "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["promotions"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["pvChart"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n    <br />\n    <div class=\"accordion\" id=\"pv_accordion\">\n        <div class=\"accordion-group\">\n            <div class=\"accordion-heading\">\n                <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#pv_accordion\" href=\"#pvt1\">\n                    <h3 class=\"centered\"> Show List of Price/Volume Anomalies </h3>\n                </a>\n            </div>\n            <div id=\"pvt1\" class=\"accordion-body collapse out\">\n                <div class=\"accordion-inner\">\n                    <table class=\"table table-hover\">\n                        <tr>\n                            <th>Date</th><th>Size</th><th>From</th><th>To</th><th>Volume</th>\n                        </tr>\n                        ");
  stack1 = helpers.each.call(depth0, "r", "in", "spikesTable", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </table>\n                </div>\n            </div>\n        </div>\n    </div>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                            <tr>\n                                <td>");
  stack1 = helpers._triageMustache.call(depth0, "r.spike_date", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                                <td>");
  stack1 = helpers._triageMustache.call(depth0, "r.spike_size", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                                <td>");
  stack1 = helpers._triageMustache.call(depth0, "r.spike_from", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                                <td>");
  stack1 = helpers._triageMustache.call(depth0, "r.spike_to", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                                <td>");
  stack1 = helpers._triageMustache.call(depth0, "r.spike_vol", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                            </tr>\n                        ");
  return buffer;
  }

  data.buffer.push("\n\n\n<span class=\"centered\">\n    <h3> Price / Volume / CROWDSAR Chart </h3>\n</span>\n\n<div>\n    <div id=\"container-pvchart\"></div>\n</div>\n\n<p>\n    CROWDSAR is a proprietary score that quantifies the prevalence of allegations of fiscal malfeasance for the company on investor message boards and social media.\n</p>\n\n");
  stack1 = helpers['if'].call(depth0, "spikesTable", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["sidebar"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n        ");
  stack1 = helpers['if'].call(depth0, "from", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        \n        ");
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
  data.buffer.push(" &nbsp; companies in our database\n			match your search criteria.\n            <div class=\"list-group square\">\n                ");
  stack1 = helpers.each.call(depth0, "h", "in", "hits", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                <span class=\"centered\">\n                    <ul class=\"pagination pagination-lg\">\n                        ");
  stack1 = helpers['if'].call(depth0, "canGoBack", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                        ");
  stack1 = helpers['if'].call(depth0, "canGoForward", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(16, program16, data),fn:self.program(14, program14, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </ul>\n                </span>\n            </div>\n        ");
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                    ");
  stack1 = helpers['if'].call(depth0, "h.currentName", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                ");
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HitView", {hash:{
    'h': ("h")
  },hashTypes:{'h': "ID"},hashContexts:{'h': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                            <li class=\"iterator\"><a class=\"left-round\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "iterateSidebar", -1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
  data.buffer.push(">&laquo;</a></li>\n                        ");
  return buffer;
  }

function program12(depth0,data) {
  
  
  data.buffer.push("\n                            <li class=\"iterator disabled\"><a class=\"left-round\">&laquo;</a></li>\n                        ");
  }

function program14(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                            <li class=\"iterator\"><a class=\"right-round\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "iterateSidebar", 1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
  data.buffer.push(">&raquo;</a></li>\n                        ");
  return buffer;
  }

function program16(depth0,data) {
  
  
  data.buffer.push("\n                            <li class=\"iterator disabled\"><a class=\"right-round\">&raquo;</a></li>\n                        ");
  }

function program18(depth0,data) {
  
  
  data.buffer.push("\n        <span class=\"centered\">\n            <img id=\"spinner\" src=\"css/ajax-loader.gif\">\n            <div class=\"calculating-top-padding\">\n                Calculating...\n            </div>\n        </span>\n    ");
  }

  data.buffer.push("\n\n<div class=\"col-sm-4 no-padding-leftright\">\n    ");
  stack1 = helpers.unless.call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(18, program18, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n\n<div class=\"col-md-8 outlet-min-width\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["subNews"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["toggle-switch"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["togglerow"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["topic-time-series"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  data.buffer.push("\n\n<div>\n    <div id=\"container-ttschart ttschart-hw\"></div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["topic"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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

Ember.TEMPLATES["wrapper"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("\n\n<div class=\"container-fluid\">");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["detail/index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  data.buffer.push("        \n");
  return buffer;
  
});