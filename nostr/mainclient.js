var {finalizeEvent, generateSecretKey, getPublicKey } = require('nostr-tools/pure');
var { Relay } = require('nostr-tools/relay');
var { SimplePool } = require('nostr-tools/pool');
var { URL } = require('url');
const BootStrapRelays = ['wss://relay.damus.io/', 'wss://relay.primal.net/', 'wss://nos.lol/', 'wss://bitcoiner.social/'];

class NostrConnectionClient {
    constructor(relayList){
        this.localRelays = BootStrapRelays;
        this.relayPool = new SimplePool();
        this.relayQueries = {};
        this.queryListeners = {};
    }

    addRelayQuery(queryName, query = {}, reconnect,relayList = this.localRelays){
        if (queryName && typeof queryName === 'string') {
            this.relayQueries[queryName] = this.relayPool.subscribeMany(
                relayList,query,
                {
                    onevent(newEvent) {
                        void(0); // _handleEvent(newEvent, queryName);
                    },
                    oneose() {

                    },
                    onclose(){
                        if (reconnect){
                            var that = this;
                            setTimeout(that.addRelayQuery(queryName, query, reconnect, relayList), 10000);
                        }
                    }
                }
            )
        }
    }

    removeRelayQuery(queryName){
        if (queryName && typeof queryName === 'string'){
            var subscriberQuery = this.relayQueries[queryName];

            if (subscriberQuery){
                subscriberQuery.close();
                delete this.relayQueries[queryName];
            }
        }
    }

    addListenerToQuery(queryName, listenerFunction){
        if (queryName && typeof queryName === 'string' && listenerFunction && typeof listenerFunction === 'function'){
            if (this.queryListeners[queryName] && Array.isArray(this.queryListeners[queryName])) {
                this.queryListeners[queryName].push(listenerFunction);
            } else {
                this.queryListeners[queryName] = [listenerFunction];
            }
        }
    }

    removeListenerFromQuery(queryName, listenerFunction){
        if (queryName && typeof queryName === 'string' && listenerFunction && typeof listenerFunction === 'function'){
            if (this.queryListeners[queryName] && Array.isArray(this.queryListeners[queryName])) {
                this.queryListeners[queryName].splice(this.queryListeners[queryName].indexOf(listenerFunction), 1);
            }
        }
    }

    clearListenersFromQuery(queryName) {
        if (queryName && typeof queryName === 'string'){
            delete this.queryListeners[queryName];
        }
    }

    addRelaysToList(relayList, clearBootStrap = true){
        clearBootStrap ? this.localRelays = [] : void(0);
        var addedRelays = [];
        if (relayList && Array.isArray(relayList)){
            for (var i = 0; i < relayList.length; i++){
                thisRelayURL = relayList[i];

                if (this._validateWSURL(thisRelayURL)){
                    addedRelays.push(thisRelayURL);
                }
            }
        }

        this.localRelays = this.localRelays.concat(addedRelays);
        return addedRelays;
    }

    removeRelay(thisRelay) {
        if (thisRelay && this._validateWSURL(thisRelay)){
            this.localRelays.splice(this.localRelays.indexOf(thisRelay), 1);
        }
    }

    _validateWSURL(thisRelayURL){
        var isWSURL = false;

        if (thisRelayURL && typeof(thisRelayURL) === 'string' && (thisRelayURL.toLowerCase.startsWith('wss://') || 
        thisRelayURL.toLowerCase.startsWith('ws://'))){
            try {
                isWSURL = new URL(isWSURL) != undefined;
            } catch (e) {}
        }
        return isWSURL;
    }
}



async function testStart() {
    try {
        // const relay = await Relay.connect('ws://localhost/');
        const relayList = ['ws://localhost:8080/'];

        const relayPool = new SimplePool();

        relayPool.subscribeMany(
            BootStrapRelays,
            [
                {kinds:[1], limit:10}
            ],
            {
                onevent(newEvent) {
                    console.log(JSON.stringify(newEvent, undefined, 4));
                },
                oneose() {
                    // relayPool.close();
                },
                onclose () {
                    console.log("Closed");
                }
            }
        );

        // var thisEvents = await relayPool.querySync(BootStrapRelays, {kinds:[1], limit:10});

        // console.log(thisEvents);

        relayPool.subscribeMany(
            BootStrapRelays,
            [
                {kinds:[0], limit:10}
            ],
            {
                onevent(newEvent) {
                    console.log(JSON.stringify(newEvent, undefined, 4));
                },
                oneose() {
                    // relayPool.close();
                }
            }
        );

/*

let h = pool.subscribeMany(
  [...relays, 'wss://relay.example3.com'],
  [
    {
      authors: ['32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245'],
    },
  ],
  {
    onevent(event) {
      // this will only be called once the first time the event is received
      // ...
    },
    oneose() {
      h.close()
    }
  }
)

*/

    } catch (e) {
        console.log("Error on connect?");
        console.log(e);
    }
}


// module.exports = NostrConnectionClient;
module.exports.testStart = testStart;