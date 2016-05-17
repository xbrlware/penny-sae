// web/js/app/ner.js

// Named Entity Recognition View

function fetch_ner(args){
    Ember.$.ajax({
        type        : 'POST',
        contentType : 'application/json',
        dataType    : "json",
        url     : 'fetch_ner',
        data    : JSON.stringify({"cik" : args.cik, "show_hidden" : args.show_hidden}),
        success : args.callback,
        error   : function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                  }
    });
};

function set_ner(args){
    Ember.$.ajax({
        type        : 'POST',
        contentType : 'application/json',
        dataType    : "json",
        url     : 'set_ner',
        data    : JSON.stringify({"cik" : args.cik, "data" : args.data}),
        success : args.callback,
        error   : function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                  }
    });
};

App.Ner = Ember.Object.extend({
    cik  : undefined,
    data : []
});

App.NerRoute = Ember.Route.extend({
    setupController : function(controller, model) {
        var cik  = this.modelFor('detail').get('cik');
        controller.set('cik', cik);
    }
});

App.NerController = Ember.Controller.extend({
    show_hidden : false,
    toggled_hidden : function() {
        console.log('model', this.get('model'));
        var self  = this;
        var model = this.get('model');
    }.observes('show_hidden'),
    get_ner : function(cik, show_hidden) {
        console.log('getting ner...')
        return new Ember.RSVP.Promise(function(resolve, reject) {
            fetch_ner({
                "cik"         : cik,
                "show_hidden" : show_hidden,
                "callback"    : function(ner_data) {
                    console.log(ner_data);
                    if(ner_data[0] != undefined) {
                        var ner = App.Ner.create();

                        var objs = [];
                        _.map(ner_data, function(x) {
                            objs.push(Ember.Object.create(x));
                        });
                        console.log(objs)

                        ner.set('cik', cik);
                        ner.set('data', objs);
                      
                        console.log('resolving ner...', ner);
                        resolve(ner);
                    } else {
                        resolve(undefined);
                    }
                }
            })
        });
    },
    update_model : function(model) {
        console.log('updating', model);
        return new Ember.RSVP.Promise(function(resolve, reject) {
            set_ner({
                "cik"  : model.get('cik'),
                "data" : model.get('data'),
                "callback" : function(response) {
                    console.log('response', response)
                    resolve();
                }
            })
        });
    },
});

App.NerView = Ember.View.extend({
    templateName : "ner",
    didInsertElement : function() {
        console.log('inserting ner...')
    }
});
