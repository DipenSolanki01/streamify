// VideoStream.js

import { useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function VideoStream({stream}) {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.srcObject = stream;
  }, [stream])

  return <video ref={videoRef} autoPlay />
}

export default VideoStream;