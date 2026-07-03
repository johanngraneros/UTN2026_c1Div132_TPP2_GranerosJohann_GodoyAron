import { Sequelize } from "sequelize";
// Importamos la informacion de la conexion a la BBDD
import environments from "../config/environments.js";

const { database } = environments;

const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: false,
      underscored: false,
    },
  },
);

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`conectados a la base de datos : ${database.name}`);

    await sequelize.sync(); //sincronizamos modelos con tablas existentes.  asi que no toca nada sin que me de cuenta :D
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default sequelize;