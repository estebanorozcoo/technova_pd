import mongoose from "mongoose";

declare global {
  // Evita que TypeScript se queje por variables globales
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Inicializa la variable global si no existe
global.mongooseConnection = global.mongooseConnection || {
  conn: null,
  promise: null,
};

export async function connectDB() {
  if (global.mongooseConnection.conn) {
    console.log(" MongoDB ya está conectado");
    return global.mongooseConnection.conn;
  }

  if (!global.mongooseConnection.promise) {
    const uri = process.env.MONGODB_URI as string;
    if (!uri) {
      throw new Error(" MONGODB_URI no está definida en el archivo .env");
    }

    global.mongooseConnection.promise = mongoose
      .connect(uri)
      .then((mongoose) => {
        console.log(" Conexión exitosa a MongoDB");
        return mongoose;
      })
      .catch((error) => {
        console.error(" Error al conectar a MongoDB:", error);
        throw error;
      });
  }

  global.mongooseConnection.conn = await global.mongooseConnection.promise;
  return global.mongooseConnection.conn;
}
