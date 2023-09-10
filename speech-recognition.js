if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  // Browser supports the Web Speech API

  // Create a speech recognition object
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  // Configure recognition options if needed
  // recognition.continuous = true; // Enable continuous recognition
  // recognition.interimResults = true; // Enable interim results

  // Event handler for when speech recognition results are available
  recognition.onresult = function (event) {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript;

    // Handle the recognized transcript (you can send it to your server, display it, etc.)
    console.log("Recognized transcript:", transcript);
  };

  // Event handler for errors
  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
  };

  // Start speech recognition when needed (e.g., when the user clicks a button)
  function startRecognition() {
    recognition.start();
    console.log("Speech recognition started.");
  }

  // Stop speech recognition when needed (e.g., when the user clicks a button)
  function stopRecognition() {
    recognition.stop();
    console.log("Speech recognition stopped.");
  }
} else {
  // Web Speech API not supported in this browser
  console.error("Web Speech API is not supported in this browser.");
}
