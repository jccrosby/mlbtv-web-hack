// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
    FirebaseConfig,
    onSnapshotUpdate,
    useEventsApi,
    useFirestore,
} from '@mlbtv-web-hack/firebase-bookmarks';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Unsubscribe } from 'firebase/firestore';

const firebaseConfig: FirebaseConfig = {
    apiKey: 'AIzaSyA8BTdOnkDerFvgHt-2bRQrODChvqetSL4',
    authDomain: 'mlb-commons-sbx-950d.firebaseapp.com',
    databaseURL: 'https://mlb-commons-sbx-950d-default-rtdb.firebaseio.com',
    projectId: 'mlb-commons-sbx-950d',
    storageBucket: 'mlb-commons-sbx-950d.appspot.com',
    messagingSenderId: '987042097957',
    appId: '1:987042097957:web:86cd5848cb407e1f0208cc',
};

const StyledApp = styled.div``;

export function App() {
    const userId = '0oap7wa857jcvPlZ5355';
    //const userId = 'AAAA7wa857jcvPlZ5355';
    const db = useFirestore(firebaseConfig);
    const { sendEvent } = useEventsApi(db, userId);
    const [commercialBreak, setCommercialBreak] = useState<any>();
    const [genericAlert, setGenericAlert] = useState<any>();

    const isOlderThan = (dateTime: DateTime, limit: number) => {
        const now = DateTime.now();
        const diff = dateTime.diff(now, 'seconds').seconds;
        if (diff > limit) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        const subscriptions: Unsubscribe[] = [];
        subscriptions.push(
            onSnapshotUpdate(db, `${userId}/events/commercialBreak`, (doc: any) => {
                const data = doc.data();
                console.log(`data`, data);
                if (!isOlderThan(DateTime.fromISO(data?.dateTime), 120)) {
                    setCommercialBreak(data as any);
                }
            }),
        );
        subscriptions.push(
            onSnapshotUpdate(db, `${userId}/events/genericAlert`, (doc: any) => {
                const data = doc.data();
                console.log(`data`, data);
                setGenericAlert(data as any);
            }),
        );
        return () => subscriptions.forEach((unsubscribe) => unsubscribe());
    }, []);

    return (
        <StyledApp>
            <h1>Second Screen App</h1>
            {commercialBreak ? (
                <>
                    <h2>Commercial Break</h2>
                    <p>
                        Commercial break: {commercialBreak.value} (
                        <em>
                            {DateTime.fromISO(commercialBreak.dateTime).toFormat(
                                'MM/dd/yyyy hh:mm:ss:SSS',
                            )}
                        </em>
                        )
                    </p>
                    <hr />
                </>
            ) : null}
            {genericAlert ? (
                <div>
                    <h2>Alert</h2>
                    <h3>{genericAlert.title}</h3>
                    <p>{genericAlert.blurb}</p>
                    <em>
                        Timestamp:{' '}
                        {DateTime.fromISO(genericAlert.dateTime).toFormat(
                            'MM/dd/yyyy hh:mm:ss:SSS',
                        )}
                    </em>
                    <hr />
                </div>
            ) : null}
        </StyledApp>
    );
}

export default App;
