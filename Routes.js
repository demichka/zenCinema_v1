module.exports = class Routes {
  constructor(app, db, model) {
    this.app = app;
    this.db = db;
    this.model = model;
    this.getRoutes(model);
  }

    getRoutes(model) {
    baseRoute = '/json/' + baseRoute + '/';

    this.app.get(baseRoute + '/')
  }


}