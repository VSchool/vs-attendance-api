import https from "https";

export const getLocationCoordinates = (
  ip: string,
): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    let response = "";
    https.get(
      `https://api.ip2location.io?key=${process.env.GEOLOCATION_API_KEY}&ip=${ip}`,
      (res) => {
        res.on("data", (chunk) => (response = response + chunk));
        res.on("end", function () {
          resolve(JSON.parse(response));
        });
        res.on("error", (err) => {
          reject(err);
        });
      },
    );
  });
};
