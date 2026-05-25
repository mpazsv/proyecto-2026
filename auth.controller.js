import { loginUser,registerService } from "../services/auth.service.js";
import { changePasswordService } from "../services/user.service.js";
import { registerValidation, changePasswordValidation } from "../validations/auth.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

//CREAR USUARIO  (mejorar validaciones)
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return handleErrorClient(res, 400, "Email y contraseña son requeridos");
    }
    
    const data = await loginUser(email, password);
    handleSuccess(res, 200, "Login exitoso", data);
  } catch (error) {
    handleErrorClient(res, 401, error.message);
  }
}

// REGISTRAR USUARIO

export async function register(req, res) {
  try {
    const { data } = req.body;
    if (!data.email || !data.password) {
      return handleErrorClient(res, 400, "Email y contraseña son requeridos");
    }
    const {error} = registerValidation.validate(data);
    if (error) {
      return handleErrorClient(res, 400, "datos de entrada invalidos", error.message);
    }
    const [newUser, errorRegister]  = await registerService(data);
    if (errorRegister) {
      return handleErrorClient(res, 400, "Error al registrar usuario", errorRegister.message);
    }
    delete newUser.password; // Nunca devolver la contraseña
    handleSuccess(res, 201, "Usuario registrado exitosamente", newUser);
  } catch (error) {
    if (error.code === '23505') { 
      return handleErrorClient(res, 409, "El email ya está registrado");
    } else {
      return handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}
//CERRAR SESION 
export async function logout(req, res){
   try {
    res.clearCookie("jwt",{
     httpOnly: true, 
     secure: process.env.NODE_ENV === "production",
     sameSite: "strict",
   }); 
     handleSuccess(res, 200, "Sesión cerrada exitosamente"); 
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message); 
  }
}
//MANTENER LA SESION ABIERTA 
export async function getCurrentUser(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return handleErrorClient(res, 401, "No existe un usuario activo");
    } 
    handleSuccess(res, 200, "usuario activo", user);
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}
//cambiar contraseña

export async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const {error} = changePasswordValidation.validate({ currentPassword, newPassword });
    if (error) {
      return handleErrorClient(res, 400, "Datos de entrada invalidos", error.message);
    }
    const data = await changePasswordService(userId, currentPassword, newPassword);
    handleSuccess(res, 200, "Contraseña cambiada exitosamente", data);
  } catch (error) {
    handleErrorClient(res, 500,"error interno del servidor", error.message);
  }
}

