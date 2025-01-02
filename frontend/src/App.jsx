import { Button, Typography, Input } from "antd";
const { Title } = Typography;
const { TextArea } = Input;
import "./App.css";
import VideoCall from "./components/video-call";

function App() {
  const renderHelper = () => {
    return (
      <div className="wrapper">
        <Input placeholder="User ID" style={{ width: 240, marginTop: 16 }} />
        <Input
          placeholder="Channel Name"
          style={{ width: 240, marginTop: 16 }}
        />
        <Button style={{ width: 240, marginTop: 16 }} type="primary">
          Call
        </Button>
        <Button danger style={{ width: 240, marginTop: 16 }} type="primary">
          Hangup
        </Button>
      </div>
    );
  };

  const renderTextarea = () => {
    return (
      <div className="wrapper">
        <TextArea
          style={{ width: 240, marginTop: 16 }}
          placeholder="Send message"
        />
        <TextArea
          style={{ width: 240, marginTop: 16 }}
          placeholder="Receive message"
          disabled
        />
        <Button style={{ width: 240, marginTop: 16 }} type="primary">
          Send Message
        </Button>
      </div>
    );
  };

  return <VideoCall />;

  return (
    <div className="App">
      <div className="App-header">
        <Title>WebRTC</Title>

        <div
          className="wrapper-row"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          {renderHelper()}
          {renderTextarea()}
        </div>
        <div className="playerContainer" id="playerContainer">
          <video id="peerPlayer" autoPlay style={{ width: 640, height: 480 }} />
          <video
            id="localPlayer"
            autoPlay
            style={{ width: 640, height: 480 }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
