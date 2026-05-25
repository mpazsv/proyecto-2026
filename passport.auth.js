"use strict"
import passport from "passport";
import{ Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import {AppDataSource} from "../config/configDb.js";
import User from "../entity/user.entity.js";
import { JWT_SECRET } from "../config/configEnv.js";

//revisa las cookies para ver si el usuario tiene un token correcto
//y comprueba su existencia en la base de datos 
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies){
        token = req.cookies.jwt;
    }
    return token;
};

const option = {
    jwtFromRequest: ExtractJwt.fromExtractors ([cookieExtractor]),
    secretOrKey: JWT_SECRET,
};

export const passportJwtSetup = () => {
    passport.use(
        new JwtStrategy(option, async (payload, done) => {
            try {
                const userRepository = AppDataSource.getRepository(Usser);
                const user = await userRepository.findOneBy({
                    where : { id: payload.id },
                });

                if (user && user.estado_activo){
                    return done(null, {
                        id: user.id,
                        email: user.email,
                        rol: user.rol,
                        nombre: user.nombre,
                        apellido: user.apellido
                    });
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error, false);
            }
        })
    );
};
