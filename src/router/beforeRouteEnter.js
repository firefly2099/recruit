function beforeRouteEnter(to, from, next, store) {
  let path = to.path;
  console.log("beforeRouteEnter path:", path, to);

  if (path === "/" || path === "/index" || path === "/contact") {
    if (store.state.loginStatus === 0) {
      store.dispatch("checkLogin");
    }
    next();
    return;
  }

  if (store.state.loginStatus !== 0) { // 登录状态已知
    if (store.state.loginStatus === 1) { // 未登录
      console.info("beforeRouteEnter 未登录:", path, to.query);
      if (path.match(/^\/(signIn|signUp|forgotPassword)/)) {
        next(true);
      } else {
        next({ path: "/signIn", query: { url: path } });
      }
    } else { // 已登录
      if (!path.match(/^\/(signIn|signUp|forgotPassword)/)) {
        next();
      } else {
        next({ path: to.query.url || "/" });
      }
    }
  } else { // 登录状态未知
    if (path.match(/^\/(signIn|signUp|forgotPassword)/)) {
      next();
    } else {
      store.dispatch("checkLogin")
        .then(res => {
          if (+res.code === 1) {
            next();
          } else {
            next({ path: "/signIn", query: { url: path } });
          }
        })
        .catch(() => {
          next({ path: "/signIn", query: { url: path } });
        });
    }
  }
}

export default (router, store) => {
  console.log('router.beforeEach line 44...');
  router.beforeEach((to, from, next) => { console.log('router.beforeEach line 45...');
    beforeRouteEnter(to, from, next, store);
  });
}
