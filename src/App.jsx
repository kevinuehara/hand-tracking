import { useEffect, useRef } from "react";
import * as handTrack from "handtrackjs";

const modelParams = {
  flipHorizontal: false,
  maxNumBoxes: 20,
  iouThreshold: 0.5,
  scoreThreshold: 0.6,
};

function App() {
  const canvasRef = useRef();
  const videoRef = useRef();
  const context = useRef();
  const modelRef = useRef();

  const runDetection = () => {
    modelRef.current.detect(videoRef.current).then((predictions) => {
      console.log("Predictions: ", predictions);
      modelRef.current.renderPredictions(
        predictions,
        canvasRef.current,
        context.current,
        videoRef.current
      );
      requestAnimationFrame(runDetection);
    });
  };

  useEffect(() => {
    if (!canvasRef) return;

    context.current = canvasRef.current?.getContext("2d");
  }, [canvasRef]);

  const startVideo = () => {
    handTrack.startVideo(videoRef.current).then(async (status) => {
      console.log("video started", status);
      if (status) {
        modelRef.current = await handTrack.load(modelParams);
        runDetection();
      }
    });
  };

  return (
    <>
      <button
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: 20,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 200,
          height: 100,
        }}
        onClick={startVideo}
      >
        Iniciar Tracking
      </button>
      <video
        ref={videoRef}
        className="videobox canvasbox"
        autoPlay
        id="myvideo"
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      ></video>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      />
    </>
  );
}

export default App;
