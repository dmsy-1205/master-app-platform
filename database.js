import { db } from './firebase.js';
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export function listenSubApps(callback) {
    onValue(ref(db, 'apps'), (snapshot) => {
        callback(snapshot.exists() ? snapshot.val() : {});
    });
}

export function updateAppStatus(appId, isActive) {
    update(ref(db, `apps/${appId}`), { isActive: isActive });
}