import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const VideoCall = () => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [stream, setStream] = useState(null);
  const [userId, setUserId] = useState("");
  const [targetId, setTargetId] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    if (userId) {
      socket.emit("join-call", userId);
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setStream(stream);
        audioRef.current.srcObject = stream;

        const pc = new RTCPeerConnection();
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate && targetId) {
            socket.emit("ice-candidate", {
              candidate: event.candidate,
              target: targetId,
            });
          }
        };

        pc.ontrack = (event) => {
          audioRef.current.srcObject = event.streams[0];
        };

        setPeerConnection(pc);

        // Handle incoming offers
        socket.on("offer", async (data) => {
          console.log("Offer received:", data);
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", {
            answer,
            target: data.from,
          });
        });

        // Handle incoming answers
        socket.on("answer", (answer) => {
          pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // Handle ICE candidates
        socket.on("ice-candidate", (candidate) => {
          pc.addIceCandidate(new RTCIceCandidate(candidate));
        });
      })
      .catch((error) => console.log("Error accessing audio:", error));
  }, [userId, targetId]);

  // Start the call
  const startCall = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", {
      offer,
      target: targetId,
      from: userId,
    });
  };

  return (
    <div className="video-call-container">
      <h1>Audio Call</h1>
      <input
        type="text"
        placeholder="Your User ID"
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Target User ID"
        onChange={(e) => setTargetId(e.target.value)}
      />
      <audio ref={audioRef} autoPlay controls />
      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default VideoCall;
