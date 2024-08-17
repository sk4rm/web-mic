// 1. Create server peer which connects to PeerServer broker
// 2. Accept connections from client peers
// 3. Accept calls from those peers
// 4. Done

"use strict";

function createServerPeer() {
    console.log("Creating server peer...");

    const serverName = document.querySelector("#server-name").value;
    const serverPort = document.querySelector("#server-port").value;

    const options = {
        key: "web-mic",
        host: "localhost",
        port: Number(serverPort) || 443,
        debug: 2,
    };

    // I use server name as peer ID
    return new peerjs.Peer(serverName, options);
}

function acceptCall(call) {
    console.log("Received a call from a client. Answering...");

    call.answer(undefined);

    call.on("stream", (stream) => {
        console.log("Audio stream received from client.");

        const audio = document.querySelector("#remoteAudio");
        audio.srcObject = stream;
        audio.autoplay = true;
        audio.muted = false;
    });
}

function setupServerPeer() {
    // Disable start server button
    document.querySelector("#start-btn").disabled = true;

    const peer = createServerPeer();

    peer.on("error", (err) => {
        window.alert(err.message);

        console.log("Cleaning up peer...");
        peer.destroy();
        console.log("Server peer destroyed.");

        document.querySelector("#start-btn").disabled = false;
    })

    peer.on("open", () => {
        console.log("Peer connection ready to use!");
    });

    peer.on("connection", (conn) => {
        console.log("server received a connection:", conn);
    });

    peer.on("call", acceptCall);

    window.peer = peer;
}

window.onload = () => {
    document.querySelector("#form").addEventListener("submit", setupServerPeer);
}