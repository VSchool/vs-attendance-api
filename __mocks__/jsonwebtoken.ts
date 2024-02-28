const jsonwebtoken = jest.createMockFromModule<{ sign: () => string }>(
  "jsonwebtoken",
);

export const sign = jest.fn(() => "ACCESS_TOKEN");

export default jsonwebtoken;
