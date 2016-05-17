// web/js/app/login.js

App.LoginRoute = Ember.Route.extend({
    setupController: function(controller, model) {
        if (this.get('session.isAuthenticated')) {
            console.log('$$$ auth: already authenticated...');
            this.transitionTo('wrapper');
        } else {
            controller.set('errorMessage', null);
        }
    }
});

App.LoginController = Ember.Controller.extend(SimpleAuth.LoginControllerMixin, {
    authenticator: 'authenticator:custom',
    show_login : true,
    actions: {
        authenticate: function() {
            console.log('$$$ auth: start');
            var _this = this;
            this._super().then(null, function(message) {
                console.log('$$$ auth: finish w/ message:', message);
                _this.set('errorMessage', message);
            });
        }
    }
});

App.LoginView = Ember.View.extend({
    willInsertElement : function() {
        if (config.AUTHENTICATION.STRATEGY === 'gated') {
            console.log('$$$ auth: -- gated authentication enabled --- ');
            this.set('controller.show_login', false);
            this.get('controller').send('authenticate');
        }
    },
    didInsertElement: function() {
        Ember.$('#input-username').focus();
    }
});
