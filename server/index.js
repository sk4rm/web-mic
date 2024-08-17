// 1. Create server peer which connects to PeerServer broker
// 2. Accept connections from client peers
// 3. Accept calls from those peers
// 4. Done

function createServerPeer() {
    const serverName = document.querySelector("#server-name").value;
    const serverPort = document.querySelector("#server-port").value;

    const options = {
        key: "web-mic",
        host: "localhost",
        port: Number(serverPort) || 443,
        debug: 2,
    };

    // I use server name as peer ID
    return new Peer(serverName, options);
}

function connect() {
    const peer = createServerPeer();

    peer.on("error", (err) => {
        console.error("server connection error:", err);
    })

    peer.on("open", (id) => {
        console.log("server peer is open:", id);
    });

    peer.on("connection", (conn) => {
        console.log("server received a connection:", conn);
    });

    peer.on("call", (call) => {
        console.log("server received a call:", call);

        call.answer();

        call.on("stream", (stream) => {
            console.log("stream:", stream);
            const audio = document.querySelector("#remoteAudio");
            audio.srcObject = stream;
            audio.autoplay = true;
            audio.muted = false;
        });
    });

    window.peer = peer;
}

window.onload = () => {
    document.querySelector("#form").addEventListener("submit", connect);
}