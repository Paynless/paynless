// const googleMapsClient = require("@google/maps").createClient({
//   key: process.env.REACT_APP_GOOGLE_MAPS_KEY
// });

// export const getCoordsFromAdd = address => {
//   console.log(address)
//   return new Promise((resolve, reject) => {
//     googleMapsClient.placesAutoComplete({
//       input: address,
//       language: 'en',
//       components: {country: 'us'}
//     }, (results, status) => {
//       if (status === "OK") {
//         console.log(results);
//         resolve([
//           results[0].geometry.location.lat,
//           results[0].geometry.location.lng
//         ]);
//       } else {
//         reject(new Error("Couldnt't find the location " + address));
//       }
//     });
//   });
// };

export const getCurrentPosition = options => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      location => {
        resolve({
            _lat: location.coords.latitude,
            _long: location.coords.longitude

          //dont use location when you are home
          // _lat: 40.7050604,
          // _long: -74.00865979999999
        });
      },
      err => {
        reject(new Error("Could not find location", err));
      },
      options
    );
  });
};
