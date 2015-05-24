define(
  [
    'jquery', 'underscore', 'backbone', 'moment',
    'models',
    'text!templates/main.utpl',
    'text!templates/list.utpl',
    'text!templates/entry.utpl',

    'underscore.crunch'
  ], function($, _, B, moment, M, t_main, t_list, t_entry) {
    var V = {};

    V.Base = Backbone.View.extend({
      t_main: _.template(t_main),

      initialize: function() {
        var v = this;
        v.fetch({
          success: function() { v.render(); }
        });
      },

      fetch: function(cbs) { _.finish(cbs); },

      render: function() {
        this.$el.html(this.t_main());
        this.$('.container').append(this.t(this.getTemplateArgs()));
        return this;
      },

      getTemplateArgs: function() { return {model: this.model}; }
    });

    V.List = V.Base.extend({
      t: _.template(t_list),
      t_entry: _.template(t_entry),
      model: new M.Entries(),

      fetch: function(cbs) {
        var v = this;

        _.crunch({
          pre: $.proxy(v.model.fetch, v.model),
          post: function(cbs1) {
            _.crunch(v.model.map(function(entry) {
              return $.proxy(entry.fetchSrc, entry);
            }))(cbs1);
          }
        })(cbs);
      },

      getTemplateArgs: function() {
        return {model: this.model, t_entry: this.t_entry, moment: moment};
      }
    });

    return V;
  }
);
