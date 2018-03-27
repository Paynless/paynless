import { db, firestore } from "../config";

export const findDistance = (cord1, cord2) => {
  return Math.sqrt(
    (cord1._lat - cord2._lat) ** 2 + (cord1._long - cord2._long) ** 2
  );
};

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

export const findOrCreateMerchant = async (id, data) => {
  try {
    const merchantRef = await db
      .collection("Merchants")
      .doc();
    
    data.id = merchantRef.id;
    return merchantRef.set(data);
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

export const updateUser = async (uid, data) => {
  try {
    await db
      .collection("Users")
      .doc(uid)
      .update(data);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const findOrCreateUserOpenTab = async (user, merchant) => {
  try {
    //find
    const tabQuery = db
      .collection("Tabs")
      .where("uid", "==", userId)
      .where("merchantId", "==", merchant.id)
      .where("open", "==", true);
    const tabDoc = await tabQuery.get();
    if (tabDoc.docs.length) return tabDoc.docs[0].data();

    //create
    const data = {
      items: [],
      merchantId: merchant.id,
      merchantName: merchant.name,
      open: true,
      userName: `${user.firstName} ${user.lastName}`,
      uid: user.id,
      accepted: false,
      timestamp: firestore.FieldValue.serverTimestamp()
    };
    const tabRef = await db.collection("Tabs").doc();
    data.id = tabRef.id;
    return tabRef.set(data);

  } catch (err) {
    console.log(err);
  }
};

export function setErrorMsg(error) {
  return {
    registerError: error.message
  };
}

export const isValidEmail = email => {
  return !!email.match(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
}

export const isValidDOB = dob => {
  return !!dob.match(
  /^(?:0[1-9]|1[12])[/](?:0[1-9]|[12]\d|3[01])([/])(?:19|20)\d\d$/
  )
}