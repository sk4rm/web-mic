// 1. Create client peer which connects to PeerServer broker
// 2. Connect to the server peer which should have also connected to PeerServer
// 3. Call the server peer
// 4. Done

"use strict";

const Client = {};

function getMicrophone() {
    console.log("Requesting microphone access...");

    navigator.mediaDevices
        .getUserMedia({video: false, audio: true})
        .then(stream => {
            console.log("Microphone access granted.");
            Client.stream = stream;
        })
        .catch(err => {
            console.error("Failed to access microphone:", err);
        });
}

function createClientPeer() {
    console.log("Creating client peer...");

    const clientName = document.querySelector("#client-name").value;
    const serverIP = document.querySelector("#server-ip").value;
    const serverPort = document.querySelector("#server-port").value;

    const options = {
        key: "web-mic",
        host: serverIP,
        port: Number(serverPort) || 443,
        debug: 1,
    };

    // I use client name as peer ID
    return new peerjs.Peer(clientName, options);
}

function callServer(peer, serverName) {
    console.log("Calling server...");

    const call = peer.call(serverName, Client.stream);

    call.on("error", (err) => {
        console.error("Failed to call server:", err);
    })

    Client.call = call;
}

function connectToServer(peer, serverName) {
    console.log("Connecting to", serverName, "...");

    const conn = peer.connect(serverName);

    conn.on("open", () => {
        console.log("Peer connection ready to use!");
        callServer(peer, serverName);
    });

    conn.on("close", () => {
        console.log("Connection forcibly closed by server.");
        destroyClientPeer(peer);
        window.alert("Connection forcibly closed by server.");
    });

    Client.conn = conn;
}

function destroyClientPeer(peer) {
    console.log("Cleaning up peer...");
    peer.destroy();
    console.log("Client peer destroyed.");

    // Re-enable button
    document.querySelector("#connect-btn").disabled = false;
}

function setupClientPeer() {
    console.log("Setting up client peer...");

    // Disable connect button
    document.querySelector("#connect-btn").disabled = true;

    getMicrophone();
    const peer = createClientPeer();

    peer.on("error", (err) => {
        window.alert(err.message);
        destroyClientPeer(peer);
    });

    peer.on("open", () => {
        connectToServer(peer, serverName);
    });

    const serverName = document.querySelector("#server-name").value;

    Client.peer = peer;
}

window.onload = () => {
    document.querySelector("#form").addEventListener("submit", setupClientPeer);
}