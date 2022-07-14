import {
    collection,
    deleteDoc,
    deleteField,
    doc,
    DocumentData,
    DocumentSnapshot,
    Firestore,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';

// type SnapshotHandler = (doc: any) => void;

const useEventsCollection = (db: Firestore, userId: string, collectionPath = 'events') => {
    return collection(db, `events/${userId}/${collectionPath}`);
};

const useEventDocRef = (db: Firestore, userId: string, collectionPath = 'events') => {
    return doc(db, `${collectionPath}/${userId}`);
};

const sendEvent = async (db: Firestore, userId: string, eventType: string, eventData: any) => {
    eventData.type = eventType;
    eventData.dateTime = new Date().toISOString();
    return await setDoc(useEventDocRef(db, `${userId}/events/${eventType}`), eventData, {
        merge: true,
    });
};

const deleteEvent = async (db: Firestore, userId: string, eventType: string) => {
    const docRef = doc(db, `events/${userId}/events/${eventType}`);
    deleteDoc(docRef);
    /* const eventCollection = useEventsCollection(db, userId);
    const qry = query(eventCollection, where('type', '==', eventType));
    const snapshot = await getDocs(qry);
    snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data);
        if (data['type'] === eventType) {
            deleteDoc(doc);
        }
    } */
};

export const onSnapshotUpdate = (
    db: Firestore,
    docPath: string,
    snapshotUpdateHandler: Function,
) => {
    const eventsDocRef = useEventDocRef(db, docPath);
    const unsubscribe = onSnapshot(eventsDocRef, (doc) => {
        snapshotUpdateHandler(doc);
    });
    return unsubscribe;
};

export const useEventsApi = (db: Firestore, userId: string) => {
    return {
        sendEvent: (eventType: string, eventData: any) =>
            sendEvent(db, userId, eventType, eventData),
        deleteEvent: (eventType: string) => deleteEvent(db, userId, eventType),
    };
};
