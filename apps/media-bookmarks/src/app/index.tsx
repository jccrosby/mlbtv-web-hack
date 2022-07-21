import {
    FirebaseConfig,
    onSnapshotUpdate,
    useBookmarks,
    useEventsApi,
    useFirestore,
} from '@mlbtv-web-hack/firebase-bookmarks';
import { MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledApp = styled.div`
    // Your style here
`;

const firebaseConfig: FirebaseConfig = {
    apiKey: 'AIzaSyA8BTdOnkDerFvgHt-2bRQrODChvqetSL4',
    authDomain: 'mlb-commons-sbx-950d.firebaseapp.com',
    databaseURL: 'https://mlb-commons-sbx-950d-default-rtdb.firebaseio.com',
    projectId: 'mlb-commons-sbx-950d',
    storageBucket: 'mlb-commons-sbx-950d.appspot.com',
    messagingSenderId: '987042097957',
    appId: '1:987042097957:web:86cd5848cb407e1f0208cc',
};

export function App() {
    const userId = '0oap7wa857jcvPlZ5355';
    //const userId = 'AAAA7wa857jcvPlZ5355';
    const db = useFirestore(firebaseConfig);
    const { sendEvent, deleteEvent } = useEventsApi(db, userId);
    const {
        getGameBookmark,
        getBookmarks,
        updateBookmarks,
        addGameBookmark,
        deleteGameBookmark,
        deleteSvodBookmark,
        deleteVodBookmark,
    } = useBookmarks(db, userId);
    const [genericTitle, setGenericTitle] = useState<string>('');
    const [genericBlurb, setGenericBlurb] = useState<string>('');

    const setTestData = () => {
        updateBookmarks({
            games: {
                '662996': {
                    'd15618cb-fcb9-4ece-8339-5370d66296ac': 1234,
                },
                '662998': {
                    'XXXX18cb-fcb9-4ece-8339-5370d66296ac': 1234,
                },
            },
            vod: { 'aaron-nola-in-play-no-out-to-albert-pujols': 7 },
            svod: { 'mlbtv-featured-svod-video-list': 73 },
        });
    };

    useEffect(() => {
        const unsubscribe = onSnapshotUpdate(db, `${userId}/events/commercialBreak`, (doc: any) => {
            console.log(`event bus message - current data`, doc.data());
        });

        const loadBookmarks = async () => {
            /* setupInitialData(); */
            /* const bookmarks = await getBookmarks();
            console.log('bookmarks', bookmarks); */
            /* const gameBookmark = await getGameBookmark('662998');
            console.log('gameBookmark', gameBookmark); */
            /* bookmarks.games['662998']['XXXX18cb-fcb9-4ece-8339-5370d66296ac'] = 2222;
            await updateBookmarks(bookmarks); */
            //deleteGameBookmark('662998');
            //deleteVodBookmark('aaron-nola-in-play-no-out-to-albert-pujols');
            //deleteSvodBookmark('mlbtv-featured-svod-video-list');
            //addGameBookmark('999999', { I_AM_A_CONTENT_ID: 999 });
            //sendEvent('commercialBreak', { type: 'start' });
        };
        loadBookmarks();

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        //addBookmarksForUser();
        //updateGameBookmarkForUser();
        //deleteGameBookmarkForUser(662998);
    }, []);

    const handlClickSetTestData = (event: MouseEvent<HTMLButtonElement>) => {
        setTestData();
    };

    const handleStartCommercial = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        sendEvent('commercialBreak', { value: 'start' });
    };

    const handleStopCommercial = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        sendEvent('commercialBreak', { value: 'stop' });
    };

    const handleGenericAlert = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        sendEvent('genericAlert', {
            title: genericTitle,
            blurb: genericBlurb,
        });
    };

    const handleRemoveCommercialBreak = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        deleteEvent('commercialBreak');
    };

    const handleRemoveGenericAlert = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        deleteEvent('genericAlert');
    };

    return (
        <StyledApp>
            <div>
                <h2>Test Data</h2>
                <button onClick={handlClickSetTestData}>SET/RESET TEST DATA</button>
            </div>
            <hr />
            <div>
                <h2>Commercial Break Events</h2>
                <button onClick={handleStartCommercial}>START COMMERCIAL</button>
                <button onClick={handleStopCommercial}>STOP COMMERCIAL</button>
                <button onClick={handleRemoveCommercialBreak}>REMOVE COMMERCIAL BREAK</button>
            </div>
            <hr />
            <div>
                <h2>Generic Alert Event</h2>
                <div>
                    <label htmlFor="generic-alert-title">Title: </label>
                    <br />
                    <input
                        type="text"
                        name="generic-alert-title"
                        id="generic-alert-title"
                        value={genericTitle}
                        onChange={(event) => setGenericTitle(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="generic-alert-blurb">Blurb: </label>
                    <br />
                    <textarea
                        name="generic-alert-blurb"
                        id="generic-alert-blurb"
                        value={genericBlurb}
                        onChange={(event) => setGenericBlurb(event.target.value)}></textarea>
                </div>

                <div>
                    <button onClick={handleGenericAlert}>GENERIC ALERT</button>
                    <button onClick={handleRemoveGenericAlert}>REMOVE GENERIC ALERT</button>
                </div>
            </div>
        </StyledApp>
    );
}

export default App;
