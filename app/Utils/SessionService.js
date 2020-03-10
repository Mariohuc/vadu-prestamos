class SessionService {
  async login({ auth, request, response, session }) {
    const { dni_id, password } = request.all();

    try {
      await auth.attempt(dni_id, password);
    } catch (error) {
      /**
       * Add a custom object to the session store.
       */
      session.flash({
        error: "No se encontro una cuenta con estas credenciales."
      });
      return response.redirect("login");
    }

    return response.redirect("welcome");
  }
  async logout({ auth, response }) {
    await auth.logout();

    return response.redirect("login");
  }
}

module.exports = new SessionService;
