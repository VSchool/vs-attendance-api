import { config } from "dotenv";
import { server } from "./server";
import { hostname } from "os";

config();

server.listen(process.env.PORT, () => {
  console.log(`Server listening on ${hostname}:${process.env.PORT}`);
  console.log(`Node environment: ${process.env.NODE_ENV}`);
});
