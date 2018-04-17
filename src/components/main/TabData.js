const TabData = userObj => {
  if (userObj) {
    return ({
      0: {
        path: "/",
        icon: "plus-circle",
        label: "New Tab"
      },
      1: {
        path: "/open-tabs",
        icon: "sticky-note",
        label: "Open Tabs"
      }
    })
  } else {
    return ({
      0: {
        path: "/login",
        icon: "sign-in",
        label: "Login"
      },
      1: {
        path: "/register",
        icon: "user-plus",
        label: "Register"
      }
    })
  }
}

export default TabData;

