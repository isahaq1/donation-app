import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:3000", // Allow only this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
    credentials: true, // Allow credentials if needed
  });
  console.log("Server running on http://localhost:3001");
  await app.listen(3001);
}
bootstrap();
