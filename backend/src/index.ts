import express from 'express';
import { AppDataSource } from './ormconfig';
import uploadRoutes from './routes/uploadRoutes';
import confirmRoutes from './routes/confirmRoutes';
import listRoutes from './routes/listRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    app.use('/upload', uploadRoutes);   // Rotas de upload
    app.use('/confirm', confirmRoutes); // Rotas de confirmação
    app.use('/list', listRoutes);       // Rotas de listagem

    // Porta configurada via variável de ambiente ou padrão 3000
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// Middleware global para tratamento de erros
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send({
    error_code: "INTERNAL_SERVER_ERROR",
    error_description: "An unexpected error occurred.",
  });
});
