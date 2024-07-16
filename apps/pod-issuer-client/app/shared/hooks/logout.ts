const logout = () => {
  if (window.confirm("Are you sure?")) {
    localStorage.clear();
    window.location.reload();
  }
};

export default logout;
