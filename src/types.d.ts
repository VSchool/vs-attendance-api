declare global {
  namespace Express {
    export interface Request {
      auth?: { timestamp: string };
    }
  }
}

export {};
