export const globalVariable = (request) => {
  switch (request) {
    case "frontendAddress":
      return "http://localhost:3000";
    //return "http://34.101.65.216:3000"
    //return "http://34.101.93.85:3000"
    //return "https://sibandar-react.et.r.appspot.com"
    //return "http://192.168.100.78:3000"
    case "backendAddress":
      //return "http://35.186.157.80:8080"
      //return "http://192.168.100.78:8080"
      //return "http://localhost:8080";
      return "http://18.141.192.214:8080";
  }
};
