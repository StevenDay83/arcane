// Nostr identity

const NostrTools = require('nostr-tools');
const { getPublicKey, finalizeEvent, verifyEvent } = require('nostr-tools/pure');

class NostrIdentity {
    constructor(kind0Event){
        this.profileContent = {};
        this.created_at = Math.ceil(Date.now() / 1000);
        this.pubkey;

        if (kind0Event){
            this.importProfile(kind0Event);
        }
    }

    setPubKey(newPubKey){
        if (newPubKey){
            this.pubkey = newPubKey;
        }
    }

    importProfile(newEvent){
        if (this._isProfileEvent(newEvent)){
            this.pubkey = newEvent.pubkey;
            this.created_at = newEvent.created_at
            this.profileContent = newEvent.content;
        }
    }

    updateProfileField(field, value) {
        if (field){
            this.profileContent[field] = value != undefined ? value : '';
        }
    }

    deleteProfileField(field) {
        if (field){
            delete this.profileContent[field];
        }
    }

    generateEvent(sk, updatetime = false){
        var kind0Event;

        if (updatetime){
            this.created_at = Math.ceil(Date.now() / 1000);
        }

        if (sk && getPublicKey(sk) == this.pubkey){
            kind0Event = finalizeEvent({
                kind: 0,
                created_at:this.created_at,
                tags: [],
                content:JSON.stringify(this.profileContent)
            }, sk);
        }

        return kind0Event;
    }

        //0b963191ab21680a63307aedb50fd7b01392c9c6bef79cd0ceb6748afc5e7ffd

        /*
        ["EVENT","nostr-util",
        {"content":"{\"lud16\":\"wolfbearclaw@fountain.fm\",\"banner\":\"https://i.nostr.build/nb1836.jpeg\",\"website\":\"https://github.com/StevenDay83\",\"nip05\":\"wolfbearclaw@nostr.messagepush.io\",\"damus_donation_v2\":100,\"name\":\"wolfbearclaw\",\"about\":\"#Bitcoin ⚡️⚡️⚡️ \",\"picture\":\"https://i.nostr.build/nb1260.jpg\",\"display_name\":\"Counter Narrative\"}","created_at":1736832583,"id":"545337875f3500b319abdad352bfc81e99d6ddb763bd22c3db57a752d0002570","kind":0,"pubkey":"0b963191ab21680a63307aedb50fd7b01392c9c6bef79cd0ceb6748afc5e7ffd","sig":"7fcdf289bfdc0656c1c93ed799c72e12287e9033d2bc1959f682ed1cb543a9aace7d8e533adcf050158f1acb9d15f5c2f294176a40d0f9d08054391c6614ce17","tags":[]}]
        ["EOSE","nostr-util"]

        */

    _isProfileEvent(checkedEvent){
        return checkedEvent && verifyEvent(checkedEvent) && checkedEvent.kind == 0;
    }

    
}

module.exports = NostrIdentity;