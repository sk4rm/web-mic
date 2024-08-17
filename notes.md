# web mic

Use any device as a microphone for your Windows PC.

## Architecture

### Client

The client is the device to be used as microphone.
You will access a locally-hosted webpage which connects to your receiving device.

### Server

The server will be the one receiving the microphone audio.
The user can use [VB-Cable Virtual Audio Device](https://vb-audio.com/Cable/) for use in Discord, OBS, Zoom, etc.

## Development stack

The client will use WebRTC for streaming microphone input over to the server.

The server will be a GUI into the Windows PC.

