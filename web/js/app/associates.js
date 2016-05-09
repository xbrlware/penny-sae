// web/js/app/associates.js

App.AssociatesRoute = Ember.Route.extend({
    model : function() {
        return this.modelFor('detail');
    }
});

App.AssociatesController = Ember.ObjectController.extend({
    needs   : ['application'],
    rf      : Ember.computed.alias('controllers.application.rf'),
    toggles : Ember.computed.alias('controllers.application.toggles'),

    hide_terminal      : gconfig.DEFAULT_HIDE_TERMINAL,
    hide_ner           : gconfig.DEFAULT_HIDE_NER,

    rgraph_json             : null,
    rgraph_object           : null,
    network_associates      : null,
    orig_network_associates : null,

    rgraph_origin  : null,
    orig_adj       : [],
    links          : [],

    dummy_variable : 'test',
    refresh        : 0,

    searchTerm_er  : '',

    set_ner : function(args){
        Ember.$.ajax({
            type        : 'POST',
            contentType : 'application/json',
            dataType    : "json",
            url     : 'set_ner',
            data    : JSON.stringify({"cik" : args.cik, "updates" : args.updates}),
            success : args.callback,
            error   : function (xhr, status, error) {
                console.log('Error: ' + error.message);
            }
        });
    },

    update_network_associates : function(updates) {
        var self = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            self.set_ner({
                "cik"      : self.get('model.cik'),
                "updates"  : updates,
                "callback" : function(response) {
                    console.log('response', response);
                    self.transitionToRoute('previousReg');
                    setTimeout(function() {
                        self.transitionToRoute('associates');
                    }, 50);
                    alert('Changes saved successfully!');
                    resolve();
                }
            });
        });
    },
    actions : {
        toggle_ner : function(ner) {
            var network_associates = this.get('network_associates');
            var ind       = _.indexOf(network_associates, ner);
            var associate = network_associates[ind];

            associate.toggleProperty('hidden');
        },
        save_toggles : function() {
            var network_associates = this.get('network_associates');
            var updates = _.map(network_associates, function(associate) {
                console.log('associate', associate);
                return {"nodeTo" : associate.id, "hidden" : associate.hidden}
            });
            console.log('updates', updates);
            this.update_network_associates(updates)
        },
        filter_er : function() {
            var searchTerm_er      = this.get('searchTerm_er');
            console.log('did search', searchTerm_er);
            var orig_network_associates = this.get('orig_network_associates');
            if(searchTerm_er === '') {
                this.set('network_associates', orig_network_associates);
            } else {
                this.set('network_associates', _.filter(orig_network_associates, function(associate) {
                    var name = associate.name;
                    return name.match(new RegExp(searchTerm_er, "i")) != null;
                }));
            }
        },

        show_links_ner : function(ner) {
            var orig_adj = this.get('orig_adj');
            var cik      = this.get('model.cik');
            var edge     = _.where(orig_adj, {"nodeTo" : ner.id})[0];
            this.set('links', _.map(edge.data.an, function(x) {
                var link = 'http://www.sec.gov/Archives/edgar/data/' + cik + '/' + x + '-index.htm'
                return {link : link}
            }));
        }
    }
});
