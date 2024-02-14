import { server } from "./server";
import { hostname } from "os";

server.listen(process.env.PORT, () => {
  console.log(`Server listening on ${hostname}:${process.env.PORT}`);
});
