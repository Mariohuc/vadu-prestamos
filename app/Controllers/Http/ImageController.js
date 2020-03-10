"use strict";
const Helpers = use("Helpers");

class ImageController {
  async index({ auth, view }) {}
  async create({ view }) {}

  async store({ auth, request, response, session }) {}

  async delete({ auth, response }) {}
  async getUserProfilePicture({ auth, request, params, response }) {
		const user = await auth.getUser();
		const {id} = params;

		if( Number(id) !== user.dni_id ){
			throw new Error("Acceso denegado");
		}
		const profile_photo_path = Helpers.tmpPath(`profile_pictures/${user.profile_picture}`);	
    if(!profile_photo_path){
			throw new Error("No se encontro la foto del usuario");
		}
    return response.download(profile_photo_path);
  }
}

module.exports = ImageController;
