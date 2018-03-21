import { db, firestore } from '../config'
 
export const findDistance = (cord1, cord2) => {
  return Math.sqrt(
    (cord1._lat - cord2._lat) ** 2 + (cord1._long - cord2._long) ** 2
  );
};

export const findOrCreateUserOpenTabs = async (userId, merchant) => {
  //find
  const ref = db.collection('Tabs')
    .where("uid", "==", user.uid)
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