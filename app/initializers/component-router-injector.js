// app/initializers/component-router-injector.js

export function initialize (application) {
  application.inject('component', 'router', 'router:main');
}

export default {
  name: 'component-router-injector',
  initialize
};
