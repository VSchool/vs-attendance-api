import st from "supertest";
import { server } from "../server";

export const mockServer = () => st(server);
