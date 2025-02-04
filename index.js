var NostrClientConn = require('./nostr/mainclient');
var NostrIdentity = require('./nostr/identity.js');
const { generateSecretKey, getPublicKey } = require('nostr-tools/pure');
const { test } = require('nostr-tools/nip21');

// mainclient.testStart();

// mySK = generateSecretKey();
mySK = '8ec9c26bbfed305e58151b912f5f4bebbe7c394a4030063ad8e40b7f311dd3ff';
myPK = getPublicKey(mySK);
var myProfile = new NostrIdentity();


myProfile.setPubKey(myPK);
myProfile.updateProfileField('name', "ArcanePlayer");
myProfile.updateProfileField('about', "Arcane Test Profile");


var nClient = new NostrClientConn();

var listenerMap = {
    "kind1": (newEvent, queryName) => {
        console.log(JSON.stringify(newEvent));
    },
    "kind42": (newEvent) => {
        // console.log("Chat:", JSON.stringify(newEvent, undefined, 4));
        console.log(newEvent.pubkey + ':' + newEvent.content);
    }
};

nClient.addListenerToQuery("kind1", listenerMap["kind1"]);
nClient.addListenerToQuery("kind42", listenerMap['kind42']);

// nClient.addRelayQuery("kind1", [{kinds:[1], limit:1}], false);
nClient.addRelayQuery("kind42", [{kinds:[42], limit:100}], false);