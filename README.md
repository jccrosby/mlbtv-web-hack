## mlbtv-web-hack

## Getting started

1. `yarn install`
2. `yarn start`

## Apps

### media-bookmarks

Application to test bookmark CRUD actions

Runs on http://localhost:3000

### second-screen

Application to test out pub/sub updates

Runs on http://localhost:3001

## Libs

### core

#### `useBookmarks(db, userId)` -> Bookmarks API

exposes API for game, vod, and svod "bookmarks"

- db: firebase database
- userId: the user's oktaId

##### Example Usage

```tsx
const firebaseConfig = {...}; // firebase config
const userId = 'abcdefgh'; // User's oktaId
const db = useFirestore(firebaseConfig);
const { sendEvent, deleteEvent } = useEventsApi(db, userId);
const {
    getBookmarks,
    getGameBookmark,
    getVodBookmark
    getSvodBookmark
    updateBookmarks,
    addGameBookmark,
    deleteGameBookmark,
    deleteSvodBookmark,
    deleteVodBookmark,
} = useBookmarks(db, userId);
```

##### Object shapes

```typescript
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
```

**Sample Data**

```json
{
    games: {
        '662996': {
            'd15618cb-fcb9-4ece-8339-5370d66296ac': 1234,
        },
        '662998': {
            'XXXX18cb-fcb9-4ece-8339-5370d66296ac': 5678,
        },
    },
    vod: { 'aaron-nola-in-play-no-out-to-albert-pujols': 7 },
    svod: { 'all-rise-for-baseball-zen': 73 },
}
```

**Data Descriptions**

```
{
    games: {
        {gamePk}: {
            {contentId}: {currentTimeInSeconds},
        },
        {gamePk}: {
            {contentId}: {currentTimeInSeconds},
        },
    },
    vod: {
        {svod-slug}': {currentTimeInSeconds},
        {svod-slug}': {currentTimeInSeconds}
    },
    svod: {
        {vod-slug}: {currentTimeInSeconds},
        {svod-slug}': {currentTimeInSeconds}
    },
}
```

##### getBookmarks()

Returns the collection of bookmarks.

```json
{
    games: {
        '662996': {
            'd15618cb-fcb9-4ece-8339-5370d66296ac': 1234,
        },
        '662998': {
            'XXXX18cb-fcb9-4ece-8339-5370d66296ac': 5678,
        },
    },
    vod: { 'aaron-nola-in-play-no-out-to-albert-pujols': 7 },
    svod: { 'all-rise-for-baseball-zen': 73 },
}
```

##### updateBookmarks(bookmarks: Bookmarks)

Updated the bookmarks object.

```tsx
const bookmarks = {
    games: {
        '662996': {
            'd15618cb-fcb9-4ece-8339-5370d66296ac': 1234,
        },
        '662998': {
            'XXXX18cb-fcb9-4ece-8339-5370d66296ac': 5678,
        },
    },
    vod: { 'aaron-nola-in-play-no-out-to-albert-pujols': 7 },
    svod: { 'all-rise-for-baseball-zen': 73 },
}
await updateBookmarks(bookmarks);
```

##### getGameBookmark(gamePk: string)

Retrieve a bookmark for a specific gamePk

```tsx
const gameBookmark = await getGameBookmark('662998');
/* gameBookmark = {
    'd15618cb-fcb9-4ece-8339-5370d66296ac': 1234,
} */
```

##### addGameBookmark(gamePk: string, contentBookmark: GameContentBookmark)

Adds a bookmark for the specified gamePk

```tsx
addGameBookmark('662996', {
    'd15618cb-fcb9-4ece-8339-5370d66296ac': 1234,
});
```

##### deleteGameBookmark(gamePk: string)

Removed the bookmark for the specified gamePk

```tsx
deleteGameBookmark('662998');
```

##### getVodBookmark(slug: string)

Retrieves a vod bookmark for the user

```tsx
const vodBookmark = getVodBookmark('aaron-nola-in-play-no-out-to-albert-pujols');
/* vodBookmark = {
    'aaron-nola-in-play-no-out-to-albert-pujols': 7
} */
```

##### deleteVodBookmark(slug: string)

Deletes the bookmark for the user

```tsx
deleteVodBookmark('aaron-nola-in-play-no-out-to-albert-pujols');
```

##### getSvodBookmark(slug: string)


Retrieves an svod bookmark for the user

```tsx
const svodBookmark = getVodBookmark('all-rise-for-baseball-zen');
/* svodBookmark = {
    'all-rise-for-baseball-zen': 7
} */
```

##### deleteSvodBookmark(slug: string)

Deletes the bookmark for the user

```tsx
deleteVodBookmark('all-rise-for-baseball-zen');
```

#### `useEvents(db, userId)` -> Events API

Exposes an event API

- db: firebase database
- userId: the user's oktaId


##### sendEvent(eventType: string, eventData: any)

Send an arbitrary event

```tsx
sendEvent('commercialBreak', { value: 'start' });
sendEvent('commercialBreak', { value: 'stop' });
```

##### deleteEvent(eventType: string)

Delete a specific event type

```tsx
deleteEvent('commercialBreak');
```

##### onSnapshotUpdate(db, userId)

Listen for and handle event updates

```tsx
const firebaseConfig = {...}; // firebase config
const userId = 'abcdefgh'; // User's oktaId
const db = useFirestore(firebaseConfig);

useEffect(() => {
    const subscriptions: Unsubscribe[] = [];
    // Handle subscription updates
    subscriptions.push(
        onSnapshotUpdate(db, `${userId}/events/commercialBreak`, (doc: any) => {
            const data = doc.data();
            console.log(`data`, data);
        }),
    );
    // Clean up subscriptions
    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
}, []);

```

----


This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

### Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

### Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

### Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@mlbtv-web-hack/mylib`.

### Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

### Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

### Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.



### ☁ Nx Cloud

#### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
