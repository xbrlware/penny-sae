// Detail
// Company Data Model
// Checked 2014-10-28 to make sure everything computed here is used
// May want to move the computation of these things to the models where
// they are used (lazy computation)

App.DetailModel = Ember.Object.extend({
    cik         : '',
    source      : null,
    fields      : null,
    sarreport   : null,
        
    currentName: function(){
        return this.get('fields.currentName');
    }.property('fields'),
    
    cse_url : function() {
        return 'cse.html?q="' + this.get('currentName') + '"';
    }.property('currentName'),
    
    // Trading halt information for table
    tradingHalt: function() {
        var th = this.get('source.th');
        if(Object.keys(th).length > 1){
            var out = [];
            for(i=0; i<th.date.length; i++){
                var url = th.url[i];
                out.push({"date" : th.date[i], "url" : "http://www.sec.gov" + url})
            }
            return out;
        } else {
            console.log('no trading halts!')
            return null;
        }
    }.property('source'),
    
    // PVA information for table
    spikesTable: function() {
        var s = this.get('fields.pv_scriptfield');
        if(s != undefined){
            s   = s[0];
            tab = [];
            for(i=0; i < s.spike_size.length; i++){
                var obj = {
                    spike_date: s.spike_dates[i],
                    spike_size: s.spike_size[i],
                    spike_from: s.spike_from[i],
                    spike_to:   s.spike_to[i],
                    spike_vol:  s.spike_vol[i]
                }
                tab.push(obj);
            }
            return(tab);
        } else {
            console.log('no spikes!')
            return null;
        }
    }.property('fields'),
    
    // Financials table
    financialsTable: function(){
        var d = this.get('source.fin')
        if(d != undefined && Object.keys(d).length > 1){
            tab = [];
            for(i=0; i < d.balance_sheet_date.length; i++){
                var obj        = new Object;
                obj.bsd        = d.balance_sheet_date == undefined ? undefined : d.balance_sheet_date[i],
                obj.type       = d.type == undefined ? undefined : d.type[i],
                obj.fy         = d.fiscal_year == undefined ? undefined : d.fiscal_year[i],
                
                obj.revenues   = d.revenues == undefined ? undefined : d.revenues[i]
                obj.netincome  = d.netincomeloss == undefined ? undefined : d.netincomeloss[i]
                obj.assets     = d.assets == undefined ? undefined : d.assets[i]
                
                obj.revenues_pretty   = d.revenues == undefined ? undefined : numeral(d.revenues[i]).format('0,0');
                obj.netincome_pretty  = d.netincomeloss == undefined ? undefined : numeral(d.netincomeloss[i]).format('0,0');
                obj.assets_pretty     = d.assets == undefined ? undefined : numeral(d.assets[i]).format('0,0');
                
                tab.push(obj)
            }
            return(tab)
        } else {
            console.log('no financials!')
            return null;
        }
    }.property('source'),

    // Delinquency table
    delinquencyTable: function(){
        var d = this.get('source.del_proc')
        if(d != undefined && Object.keys(d).length > 1){
            tab = [];
            
            // Should be fixed on next data load
            d.date_of_filing = [].concat(d.date_of_filing);
            d.due_date       = [].concat(d.due_date);
            d.form           = [].concat(d.form);
            d.standard_late  = [].concat(d.standard_late);

            for(i=0; i < d.date_of_filing.length; i++){
                var obj        = new Object;
                obj.dof        = d.date_of_filing == undefined ? undefined : d.date_of_filing[i],
                obj.dd         = d.due_date == undefined ? undefined : d.due_date[i],
                obj.form       = d.form == undefined ? undefined : d.form[i],
                obj.std_late   = d.standard_late == undefined ? undefined : d.standard_late[i]
                tab.push(obj)
            }
            return(tab)
        } else {
            console.log('no del_proc!')
            return null;
        }
    }.property('source')
});

App.DetailRoute = Ember.Route.extend({
    // Not working if this is the first think that's loaded
    model: function(params) {
        try {
            console.log('loading detail model')
            var app = this.controllerFor('application')
            return get_detail(params.cik, rf_clean_func(app.get('rf'), app.get('toggles')));
        } catch (err) {
            // Likely addresses reloading problem... Not fully tested...
            return get_detail(params.cik, rf_clean_func(undefined, undefined));
        }
    },
    setupController : function(controller, model, queryParams){
        controller.set('model', model);
//        generate_sar({
//            "currentName"  : model.get('currentName'),
//            "companyTable" : model.get('companyTable'),
//            "source"       : model.get('source'),
//            "tradingHalt"  : model.get('tradingHalt'),
//            callback       : function(x) { controller.set('sarreport', x.sar) }
//        });
    }
});

App.DetailController = Ember.ObjectController.extend({
    needs         : ['application'],
    rf            : Ember.computed.alias('controllers.application.rf'),
    toggles       : Ember.computed.alias('controllers.application.toggles'),
       
// I don't know what this was actually doing...
// Maybe nothing, because rgraph_json may never have been undefined
//    rgraph_json_did_change : function() {
//        var rgraph_json = this.get('rgraph_json');
//        
//        console.log('rgraph_json did change', rgraph_json);
//        
//        if(rgraph_json != undefined){              // This is copying data...
//            rgraph_json.forEach(function(x){
//                var d          = x.data;
//                x.isOwner      = d.type == 'owner';
//                x.type         = d.type;
//                x.depth        = d.depth;
//                x.terminal     = d.terminal;
//                x.otc          = d.otc;
//                x.relationship = d.relationship;
//            });
//            this.set('rgraph_json', rgraph_json);
//        }
//    }.observes('rgraph_json')
});

App.DetailView = Ember.View.extend({
    controllerChanged: function() {
        $('html, body').animate({ scrollTop: 0 }, '500', 'swing');
    }.observes('controller.model'),
    didInsertElement: function(){
        this.$().hide().fadeIn('slow')
    }
});