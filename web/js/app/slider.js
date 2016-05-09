// web/js/app/slider.js

JQ = Ember.Namespace.create();
JQ.Widget = Em.Mixin.create({

    didInsertElement: function() {
        var options = this._gatherOptions();
        this._gatherEvents(options);
        var ui = jQuery.ui[this.get('uiType')](options, this.get('element'));
        this.set('ui', ui);
    },

    willDestroyElement: function() {
        var ui = this.get('ui');
        if (ui) {
            var observers = this._observers;
            for (var prop in observers) {
                if (observers.hasOwnProperty(prop)) {
                    this.removeObserver(prop, observers[prop]);
                }
            }
            ui._destroy();
        }
    },

    _gatherOptions: function() {
        var uiOptions = this.get('uiOptions'), options = {};

        uiOptions.forEach(function(key) {
            options[key] = this.get(key);
            var observer = function() {
                var value = this.get(key);
                this.get('ui').option(key, value);
            };
            this.addObserver(key, observer);
            this._observers = this._observers || {};
            this._observers[key] = observer;
        }, this);

        return options;
    },

    _gatherEvents: function(options) {
        var uiEvents = this.get('uiEvents') || [], self = this;

        uiEvents.forEach(function(event) {
            var callback = self[event];

            if (callback) {
                options[event] = function(event, ui) { callback.call(self, event, ui); };
            }
        });
    }

});

JQ.SliderView = Em.View.extend(JQ.Widget, {
    uiType: 'slider',
    uiOptions: ['value', 'min', 'max', 'step'],
    uiEvents : ['slide']
});

App.SliderView = JQ.SliderView.extend({
    attributeBindings: ['style', 'type', 'value', 'size'],
    slide: function(e, ui) {
        this.set('value', ui.value)
    }
});
