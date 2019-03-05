class Router {

  constructor(mainInstance){
    // The mainInstance is the object that should
    // be rerendered on route changes
    this.mainInstance = mainInstance;
    this.listenToATagClicks();
    this.listenToBackForward();
    this.setPath(location.pathname);
  }

  listenToATagClicks(){
    let that = this;
    $(document).on('click', 'a', function(e){
      // assume all links starting with '/' are internal
      let link = $(this).attr('href');
      if (link.indexOf('/') === 0){
        e.preventDefault(); // no hard reload of page
        history.pushState(null, null, link); // change url (no reload)
        that.setPath(link);
        that.mainInstance.render();
      }
    });
  }

  listenToBackForward() {
    window.addEventListener("popstate", () => {
      this.setPath(location.pathname);
      this.mainInstance.render();
    });
  }

  setPath(path) {
    const matchingRoute = Router.findRoute(path);
    Router.path = matchingRoute ? matchingRoute : '404';
    setTimeout(() => this.setActiveLink(), 0);
  }

  setActiveLink() {
    $('a').removeClass('active');
    $(`a[href="${Router.path}"]`).addClass('active');
  }


//search route in Router.routes array, if found route which is exactly the same, returns this route
  static findRoute(path) {
    const matchingRoute = Router.routes.find(route => route === path);
    if (matchingRoute) {
      return matchingRoute;
    }

  //Searching route, if found route which includes RegExp, 
  //search first matching with route in Router.routes and returns this route
    const regexpRoutes = Router.routes.filter(route => route instanceof RegExp);
    return regexpRoutes.find(route => path.match(route));
  }

  static registerRoute(route) {
    Router.routes.push(route);
  }

  static goto(path){
    history.pushState(null, null, path);
    this.instance.setPath(path);
    this.instance.mainInstance.render();
  }
  
}

// static property
Router.routes = [];