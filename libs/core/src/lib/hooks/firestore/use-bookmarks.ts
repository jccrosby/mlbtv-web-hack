import {
    collection,
    deleteField,
    doc,
    DocumentData,
    Firestore,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
} from 'firebase/firestore';

export interface GameContentBookmark {
    [key: string]: number;
}

export interface GameBookmarks {
    [key: string]: GameContentBookmark;
}

export interface VodBookmarks {
    [key: string]: number;
}

export interface SvodBookmarks {
    [key: string]: number;
}

export interface Bookmarks extends DocumentData {
    games: GameBookmarks;
    vod: VodBookmarks;
    svod: SvodBookmarks;
}

const useBookmarkCollection = (db: Firestore, collectionPath = 'bookmarks') => {
    return collection(db, collectionPath);
};

const useBookmarkDocRef = (db: Firestore, userId: string, collectionPath = 'bookmarks') => {
    return doc(db, `${collectionPath}/${userId}`);
};

const getGameBookmark = async (db: Firestore, userId: string, gamePk: string) => {
    const bookmarks = await getUserBookmarks(db, userId);
    return bookmarks.games[gamePk];
};

const getVodBookmark = async (db: Firestore, userId: string, slug: string) => {
    const bookmarks = await getUserBookmarks(db, userId);
    return bookmarks.vod[slug];
};

const getSvodBookmark = async (db: Firestore, userId: string, slug: string) => {
    const bookmarks = await getUserBookmarks(db, userId);
    return bookmarks.svod[slug];
};

const getUserBookmarks = async (db: Firestore, userId: string) => {
    const docRef = useBookmarkDocRef(db, userId);
    try {
        const bookmarksSnapshot = await getDoc(docRef);
        const bookmarks = bookmarksSnapshot.data() as Bookmarks;
        return bookmarks;
    } catch (error: any) {
        console.error('bookmark load error', error.code);
        console.error('bookmark load error', error.message);
        console.error('bookmark load error', error.stack);
        return { games: {}, vod: {}, svod: {} };
    }
};

const updateBookmarksForUser = async (db: Firestore, userId: string, bookmarks: Bookmarks) => {
    return await setDoc(doc(db, 'bookmarks/' + userId), bookmarks, { merge: true });
};

const addGameBookmarkForUser = async (
    db: Firestore,
    userId: string,
    gamePk: string,
    contentBookmark: GameContentBookmark,
) => {
    return await setDoc(doc(db, `bookmarks/${userId}/games/${gamePk}`), contentBookmark, {
        merge: true,
    });
};

const deleteGameBookmarkForUser = async (db: Firestore, userId: string, gamePk: string) => {
    const docRef = doc(db, `bookmarks/${userId}`);
    return await updateDoc(docRef, { [`games.${gamePk}`]: deleteField() });
};

const deleteVodBookmarkForUser = async (db: Firestore, userId: string, slug: string) => {
    const docRef = doc(db, `bookmarks/${userId}`);
    return await updateDoc(docRef, { [`vod.${slug}`]: deleteField() });
};

const deleteSvodBookmarkForUser = async (db: Firestore, userId: string, slug: string) => {
    const docRef = doc(db, `bookmarks/${userId}`);
    return await updateDoc(docRef, { [`svod.${slug}`]: deleteField() });
};

export const useBookmarks = (db: Firestore, userId: string) => {
    return {
        useBookmarkCollection,
        getBookmarks: () => getUserBookmarks(db, userId),
        updateBookmarks: (bookmarks: Bookmarks) => updateBookmarksForUser(db, userId, bookmarks),
        getGameBookmark: (gamePk: string) => getGameBookmark(db, userId, gamePk),
        addGameBookmark: (gamePk: string, contentBookmark: GameContentBookmark) =>
            addGameBookmarkForUser(db, userId, gamePk, contentBookmark),
        deleteGameBookmark: (gamePk: string) => deleteGameBookmarkForUser(db, userId, gamePk),
        getVodBookmark: (slug: string) => getVodBookmark(db, userId, slug),
        deleteVodBookmark: (slug: string) => deleteVodBookmarkForUser(db, userId, slug),
        getSvodBookmark: (slug: string) => getSvodBookmark(db, userId, slug),
        deleteSvodBookmark: (slug: string) => deleteSvodBookmarkForUser(db, userId, slug),
    };
};
