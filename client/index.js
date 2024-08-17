// 1. Create client peer which connects to PeerServer broker
// 2. Connect to the server peer which should have also connected to PeerServer
// 3. Call the server peer
// 4. Done

let Client = {};

function createClientPeer() {
    const clientName = document.querySelector("#client-name").value;
    const serverIP = document.querySelector("#server-ip").value;
    const serverPort = document.querySelector("#server-port").value;

    const options = {
        key: "web-mic",
        host: serverIP,
        port: Number(serverPort) || 443,
        debug: 2,
    };

    // I use client name as peer ID
    return new Peer(clientName, options);
}

function getMicrophone() {
    navigator.mediaDevices
        .getUserMedia({video: false, audio: true})
        .then(stream => {
            Client.micStream = stream;
        })
        .catch(err => {
            console.error("an error occurred:", err);
        });
}

function connect() {
    const peer = createClientPeer();
    getMicrophone();

    const serverName = document.querySelector("#server-name").value;

    peer.on("error", (err) => {
        console.log("client connection error:", err);
    });

    peer.on("open", (id) => {
        console.log("client peer is open:", id);

        const conn = peer.connect(serverName);

        conn.on("open", () => {
            console.log("client connection is ready to use!");

            console.log("calling server");
            peer.call(serverName, Client.micStream);
        });
    });

    Client.peer = peer;
}

window.onload = () => {
    document.querySelector("#form").addEventListener("submit", connect);
}