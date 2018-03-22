<<<<<<< Updated upstream
import { db, firestore } from '../config'
=======
import { db, firestore } from "../config";
>>>>>>> Stashed changes

export const findDistance = (cord1, cord2) => {
  return Math.sqrt(
    (cord1._lat - cord2._lat) ** 2 + (cord1._long - cord2._long) ** 2
  );
};

<<<<<<< Updated upstream
export const findOrCreateUserOpenTabs = async (userId, merchant) => {
  //find
  const ref = db.collection('Tabs')
    .where("uid", "==", userId)
    .where("merchantId", "==", merchant.id)
    .where("open", "==", true)

  const tab = await ref.get()
  if (tab.docs.length) return tab.docs[0];

  //create
  const data = {
    items: [],
    merchantId: merchant.id,
    merchantName: merchant.name,
    open: true,
    uid: userId,
    accepted: false,
    timestamp: firestore.FieldValue.serverTimestamp(),
  }

  return db.collection("Tabs").add(data)
}
=======
export const getCurrentPosition = options => {
  return new Promise( resolve => {
    navigator.geolocation.getCurrentPosition(
      location => {
        resolve({
        //   _lat: location.coords.latitude,
        //   _long: location.coords.longitude
    
        //dont use location when you are home
          _lat: 40.7050604,
          _long: -74.00865979999999
        })
      }, 
      err => {
        alert("Could not find location");
        console.log(err);
      }, options);
  })
}

export const findNearbyMerchants = async (
  userCoords,
  merchants,
  distance
) => {
  try {
    return merchants.filter(venue => {
      return findDistance(userCoords, venue.location) < distance;
    });
  } catch (err) {
    console.log(err);
  }
};

export const fetchAllMerchants = async _ => {
  try {
    const merchants = [];
    const snapshot = await db.collection("Merchants").get();
    snapshot.forEach(doc => {
      let merchant = doc.data();
      merchant.id = doc.id;
      merchants.push(merchant);
    });
    return merchants;
  } catch (err) {
    console.log(err);
  }
};

export const findOrCreateUserOpenTabs = async (userId, merchant) => {
  try {
    //find
    const ref = db
      .collection("Tabs")
      .where("uid", "==", userId)
      .where("merchantId", "==", merchant.id)
      .where("open", "==", true);

    const tab = await ref.get();
    if (tab.docs.length) return tab.docs[0];

    //create
    const data = {
      items: [],
      merchantId: merchant.id,
      merchantName: merchant.name,
      open: true,
      uid: userId,
      accepted: false,
      timestamp: firestore.FieldValue.serverTimestamp()
    };

    return db.collection("Tabs").add(data);
  } catch (err) {
    console.log(err);
  }
};

export const checkInWithMerchant = async (userId, merchant) => {
  try {
    const tab = await findOrCreateUserOpenTabs(userId, merchant);
    console.log("tab", tab);
    this.props.history.push(`/open-tabs/${merchant.id}`);
  } catch (err) {
    console.log(err);
  }
};
>>>>>>> Stashed changes
