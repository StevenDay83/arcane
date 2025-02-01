var {testStart} = require('./nostr/mainclient');
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


console.log(JSON.stringify(myProfile.generateEvent(mySK),undefined,4));

testStart();
