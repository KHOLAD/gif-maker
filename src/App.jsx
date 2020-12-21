import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';

const ffmpeg = createFFmpeg({ log: true })

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();


  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url)
  }

  useEffect(() => {
    load();
  }, [])

  return (
    ready ?
      <div className="App p-20">
        {video && <video
          controls
          width="250"
          src={URL.createObjectURL(video)}>

        </video>}

        <input
          className="p-20"
          accept="video/mp4,video/x-m4v,video/*"
          type="file"
          onChange={(e) => setVideo(e.target.files.item(0))} />

        {video && <div className="p-20 result">
          <h3>Result</h3>

          <button onClick={convertToGif}>Convert</button>

          {gif && <img className="p-20" src={gif} width="250" />}
        </div>}
      </div>
      : <p>Loading...</p>
  );
}

export default App;
