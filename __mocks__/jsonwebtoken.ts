const jsonwebtoken = jest.createMockFromModule<{ sign: () => string }>(
  "jsonwebtoken",
);

export const sign = () => "ACCESS_TOKEN";

export default jsonwebtoken;
