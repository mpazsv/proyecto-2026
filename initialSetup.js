"use strict";
import bcrypt from "bcryptjs";
import{AppDataSource} from "./configDb.js";
import User from "../entity/user.entity.js";

async function encryptPassword(password){
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}
//al iniciar el sistema se crearan los siguientes usuarios
export async function createUser(){
    try {
        const userRepository = AppDataSource.getRepository(User);
        const count = await userRepository.count();
        if (count > 0) return;

        const now = new Date(); 
        //usuario admin 
    await Promise.all([
        userRepository.save(userRepository.create({
            nombre: "admin",
            apellido: "sistema",
            email: "admin@escueladeconducir.com",
            password : await encryptPassword("admin123"),
            rol: "admin",
            estado_activo: true,
            fecha_registro: now,
        })),
        userRepository.save(userRepository.create({
            nombre: "secretaria",
            apellido: "administrativa",
            email: "secretaria@escueladeconducir.com",
            password : await encryptPassword("secretaria123"),
            rol: "secretaria",
            estado_activo: true,
            fecha_registro: now,
        })),
        //usuario profesor 
        userRepository.save(userRepository.create({
            nombre: "profesor",
            apellido: "designado",
            email: "profesor@escueladeconducir.com",
            password : await encryptPassword("profesor123"),
            rol: "profesor",
            estado_activo: true,
            fecha_registro: now,
        })),
        userRepository.save(userRepository.create({
            nombre: "alumno",
            apellido: "registrado",
            email: "alumno@escueladeconducir.com",
            password : await encryptPassword("alumno123"),
            rol: "alumno",
            estado_activo: true,
            fecha_registro: now,
        })),
        userRepository.save(userRepository.create({
            nombre: "alumno2",
            apellido: "registrado2",
            email: "alumno2@escueladeconducir.com",
            password : await encryptPassword("alumno2123"),
            rol: "alumno2",
            estado_activo: true,
            fecha_registro: now,
        }))
        ]);

        console.log("* => Usuario creado exitosamente");
        } catch (error) {
        console.error("Error al crear el usuario:", error);
        }
} 