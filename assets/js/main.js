// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    jquery: 'libs/jquery/jquery.min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    bootstrap: 'libs/bootstrap/bootstrap.min',
    stickit: 'libs/backbone/backbone.stickit.min',
    validation: 'libs/backbone/backbone-validation-amd-min'
  },
  shim: {
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    "bootstrap": {
      deps: ["jquery"],
      exports: "bootstrap"
    },
    "stickit": {
      deps: ["underscore", "backbone", "jquery"],
      exports: "stickit"
    },
    "validation": {
      deps: ["underscore", "backbone", "jquery"],
      exports: "validation"
    }
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});
