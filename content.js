let isRecording = false;
let mediaRecorder = null;
let chunks = [];
let meetMediaRecorders = [];

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "startRecording") {
    if (!isRecording) {
      // Start recording logic (you can implement this)
      console.log("Recording started");
      startRecording();
      startMeetRecording();
      isRecording = true;
    }
  } else if (message.action === "stopRecording") {
    if (isRecording) {
      // Stop recording logic (you can implement this)
      console.log("Recording stopped");
      stopRecording();
      stopMeetRecording();
      isRecording = false;
    }
  }
});

async function startMeetRecording() {
  let audioElements = document.querySelectorAll("audio");

  for (let i = 0; i < audioElements.length; i++) {
    let chunks = [];

    let audioElement = audioElements[i];
    let audioStream = audioElement.srcObject;
    meetMediaRecorders.push(new MediaRecorder(audioStream));
    meetMediaRecorders[i].start(1000);
    meetMediaRecorders[i].ondataavailable = e => {
      // console.log("data colelccy", e);
      chunks.push(e.data);
    };
    meetMediaRecorders[i].onstop = async e => {
      console.log("recorder stopped", chunks);
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      console.log("blob", blob);
      chunks = [];
      getTranscript(blob, "Participant");
    };
  }
}

async function stopMeetRecording() {
  let audioElements = document.querySelectorAll("audio");

  for (let i = 0; i < audioElements.length; i++) {
    if (meetMediaRecorders[i]) {
      meetMediaRecorders[i].stop();
    }
  }
}

async function startRecording() {
  const micStream = await window?.navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(micStream);
  mediaRecorder.start(1000);
  mediaRecorder.ondataavailable = e => {
    // console.log("data colelccy");
    chunks.push(e.data);
  };
  mediaRecorder.onstop = async e => {
    console.log("recorder stopped", chunks);
    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    console.log("blob", blob);
    chunks = [];
    getTranscript(blob, "Host");
  };
}

async function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
}

async function getTranscript(audioData, speakerName) {
  const baseUrl = "https://api.assemblyai.com/v2";

  const headers = {
    authorization: "131c76e292b84e80858cf7ed4f89a4a1",
  };
  const uploadResponse = await axios.post(`${baseUrl}/upload`, audioData, {
    headers,
  });
  const uploadUrl = uploadResponse.data.upload_url;
  const data = {
    audio_url: uploadUrl, // You can also use a URL to an audio or video file on the web
    speaker_labels: true,
  };
  const url = `${baseUrl}/transcript`;
  const response = await axios.post(url, data, { headers: headers });
  const transcriptId = response.data.id;
  const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`;

  while (true) {
    const pollingResponse = await axios.get(pollingEndpoint, {
      headers: headers,
    });
    const transcriptionResult = pollingResponse.data;

    if (transcriptionResult.status === "completed") {
      console.log(`${speakerName}: `, transcriptionResult.text);
      break;
    } else if (transcriptionResult.status === "error") {
      throw new Error(`Transcription failed: ${transcriptionResult.error}`);
    } else {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}
