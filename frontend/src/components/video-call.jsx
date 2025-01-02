import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const VideoCall = () => {
  const [peerConnection, setPeerConnection] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => console.log(stream))
      .catch((error) => console.log(error, "error"));

    // Get User Media (Access Camera/Mic)
    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     localVideoRef.current.srcObject = stream;
    //     const pc = new RTCPeerConnection();
    //     stream.getTracks().forEach((track) => {
    //       pc.addTrack(track, stream);
    //     });
    //     pc.onicecandidate = (event) => {
    //       if (event.candidate) {
    //         socket.emit("ice-candidate", event.candidate);
    //       }
    //     };
    //     pc.ontrack = (event) => {
    //       remoteVideoRef.current.srcObject = event.streams[0];
    //     };
    //     setPeerConnection(pc);
    //     socket.on("offer", async (offer) => {
    //       await pc.setRemoteDescription(new RTCSessionDescription(offer));
    //       const answer = await pc.createAnswer();
    //       await pc.setLocalDescription(answer);
    //       socket.emit("answer", answer);
    //     });
    //     socket.on("answer", (answer) => {
    //       pc.setRemoteDescription(new RTCSessionDescription(answer));
    //     });
    //     socket.on("ice-candidate", (candidate) => {
    //       pc.addIceCandidate(new RTCIceCandidate(candidate));
    //     });
    //   });
  }, []);

  const startCall = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  return (
    <div className="video-call-container">
      <video ref={localVideoRef} autoPlay playsInline muted />
      <video ref={remoteVideoRef} autoPlay playsInline />
      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default VideoCall;
