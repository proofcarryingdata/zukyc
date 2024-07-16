const logout = (force: boolean) => {
  if (
    force ||
    confirm("are you sure you want to log out and create a new user?")
  ) {
    window.localStorage.clear();
    window.location.reload();
  }
};

export default logout;
