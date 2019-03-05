class Login extends REST {

    // Please note: 
    // Login is not our traditional kind
    // of class extending REST
    // (since it's not "connected" to a
    // a Mongoose model on the backend)
   
    // But we can still use the REST class
    // to minimize the amount of code we have to write...
    // See test.js
   
    static get baseRoute() {
      return 'login/';
    }
   
    async delete() {
      this._id = 1;
      // we set an id here, because the REST class
      // will complain if we try to call delete on an object without _id
      // - and we use delete to logout (see test.js)
   
      return super.delete();
    }
   
  }  