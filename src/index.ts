import { server } from "./server";
import { hostname } from "os";
import mg from "mongoose";

mg.connect(process.env.MONGODB_URI as string).then(() => {
  console.log(`Connected to DB ${mg.connection.host}`);
  server.listen(process.env.PORT, () => {
    console.log(`Server listening on ${hostname}:${process.env.PORT}`);
  });
});
