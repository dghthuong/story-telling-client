import React, { useState, useRef, useContext, useEffect } from "react";
import { Button, Input, Space, Progress, message } from "antd";
import { RightOutlined, LeftOutlined, AudioOutlined } from "@ant-design/icons";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import styled from "styled-components";


const API_URL = process.env.REACT_APP_API_URL;

const RecorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const Waveform = styled.canvas`
  width: 100%;
  height: 100px;
  background-color: #ddd;
  margin-bottom: 20px;
  border: 1px solid #ccc;
`;

const RecordButton = styled(Button)`
  background-color: #007bff;
  color: white;
  margin: 0 20px;
  padding: 0 20px;
`;

const sentences = [
  "Xuân sang cành lá đâm chồi, bao buồn vui qua rồi đưa con về với yên bình.Đưa con về với gia đình nặng nghĩa ân tình. Cây mai đào khoe sắc tô thêm màu nhẹ nhàng trong nắng xuân tươi hồng cùng nhịp...",
];

const AudioRecorder = () => {
  const { user } = useContext(UserContext);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [permission, setPermission] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceId, setVoiceId] = useState(null);
  const [recordings, setRecordings] = useState(
    Array(sentences.length).fill(null)
  );
  const mediaRecorderRef = useRef(null);
  const user_id = localStorage.getItem("id");
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtxRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getMicrophonePermission();
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
  }, []);

  useEffect(() => {
    // Tự động tạo voiceId khi component được khởi tạo
    const fetchVoiceId = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/api/voice/generate-id`
        );
        const fetchedVoiceId = response.data.voiceId;
        setVoiceId(fetchedVoiceId);
      } catch (error) {
        console.error("Error fetching voiceId: ", error);
        setVoiceId(null);
      }
    };

    fetchVoiceId();
  }, []);

  const getMicrophonePermission = async () => {
    if (!("MediaRecorder" in window)) {
      alert("API MediaRecorder không được hỗ trợ trong trình duyệt của bạn.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;
      audioContextRef.current = audioContext;

      mediaRecorderRef.current = new MediaRecorder(stream);
      setPermission(true);
      visualize();
    } catch (err) {
      alert(err.message);
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current && !recording) {
      mediaRecorderRef.current.start();
      setRecording(true);
      visualize();
    }
  };

  const validateVoice = async (voiceFile, sessionId) => {
    const formData = new FormData();
    formData.append("selectedFile", voiceFile);
    formData.append(
      "data",
      JSON.stringify({
        session: sessionId,
        youtubeURL: "",
        checkedOverwrite: "true",
      })
    );

    try {
      const response = await axios.post(
        "https://research.vinbase.ai/voiceclone/validate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Basic c3BlZWNoX29vdjo0RDYkJiU5cWVFaHZSVGVS",
          },
        }
      );
      if (response.data.validate_status) {
        return response.data.session;
      } else {
        throw new Error("Voice validation failed");
      }
    } catch (error) {
      console.error("Error during voice validation:", error);
      throw error;
    }
  };

  const trainVoiceModel = async (sessionId) => {
    const response = await axios.post(
      "https://research.vinbase.ai/voiceclone/train",
      {
        session: sessionId,
        trainingTime: 0,
        aligner: "",
        denoiser: "",
        asr: "",
        speakerrate: "",
        balance: "",
        duration: "",
        checkedRetrain: "False",
      },
      {
        headers: {
          Authorization: "Basic c3BlZWNoX29vdjo0RDYkJiU5cWVFaHZSVGVS",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.train_status) {
      return true;
    } else {
      throw new Error("Voice training failed");
    }
  };

  const validateAndTrainVoice = async (voiceFile) => {
    try {
      setStatusMessage('Validating voice...');
      setProgress(25); // Assuming validation is about 25% of the process
      await validateVoice(voiceFile, voiceId);

      setStatusMessage('Training voice model...');
      setProgress(50); // Assuming training starts at 50%
      await trainVoiceModel(voiceId);

      setProgress(100);
      setStatusMessage('Voice model trained successfully!');
      
    } catch (error) {
      setStatusMessage('Error in voice processing: ' + error.message);
      setProgress(0);
      throw error;
    }
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasCtxRef.current) return;

    const canvas = canvasCtxRef.current;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const WIDTH = canvasRef.current.width;
    const HEIGHT = canvasRef.current.height;
    canvas.clearRect(0, 0, WIDTH, HEIGHT);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvas.fillStyle = "rgb(200, 200, 200)";
      canvas.fillRect(0, 0, WIDTH, HEIGHT);
      canvas.lineWidth = 2;
      canvas.strokeStyle = "rgb(0, 0, 0)";
      canvas.beginPath();

      let sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvas.moveTo(x, y);
        } else {
          canvas.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvas.lineTo(canvas.width, canvas.height / 2);
      canvas.stroke();
    };

    draw();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      setRecording(false);
      mediaRecorderRef.current.ondataavailable = (event) => {
        const updatedRecordings = [...recordings];
        updatedRecordings[currentSentenceIndex] = URL.createObjectURL(
          event.data
        );
        setRecordings(updatedRecordings);
      };
    }
  };

  const nextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    }
  };

  const previousSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
    }
  };

  const uploadRecordings = async () => {
    const formData = new FormData();
    if (!voiceId) {
      console.error("VoiceId is not available for upload.");
      return;
    }
    formData.append("voiceId", voiceId);
    formData.append("title", recordingTitle);
    formData.append("userId", user_id);
    const allRecorded = recordings.every((recording) => recording !== null);

    if (!allRecorded) {
      Swal.fire({
        title: "Incomplete Recordings",
        text: "Please record all sentences before saving.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return; // Exit the function if not all sentences are recorded
    }
    // Use Promise.all to fetch and convert all recordings to blobs
    const blobPromises = recordings.map(async (recordingUrl, i) => {
      if (recordingUrl) {
        const response = await fetch(recordingUrl);
        const blob = await response.blob();
        formData.append("recording", blob, `${recordingTitle}-${i}.wav`);
      }

      Swal.fire({
        title: "Your Record have been save!",
        text: "Continute!",
        icon: "success",
        confirmButtonText: "Done",
      });
    });


    const blobPromises2 = recordings.map(async (recordingUrl, i) => {
      if (recordingUrl) {
        const response = await fetch(recordingUrl);
        return await response.blob();
      }
    });

    try {
      // Wait for all blobs to be appended to formData
      await Promise.all(blobPromises);
      const blobs = await Promise.all(blobPromises2);
      // Now send the formData with axios
      const response = await axios.post(
        `${API_URL}/api/audio/new-audio`,
        formData
      );
      console.log("Upload successful", response.data);
      // Handle successful upload here
      const voiceFile = new File(blobs, `${voiceId}.wav`, {
        type: "audio/wav",
      });
      const voiceProcessingResult = await validateAndTrainVoice(voiceFile);
      if (voiceProcessingResult) {
        console.log("Voice processing successful");
      } else {
        console.error("Voice processing failed");
      }
      message.success('Recordings saved successfully!');
    } catch (error) {
      console.error("Error uploading recordings: ", error);
    } 
  };

  const allRecorded = recordings.every((recording) => recording !== null);

  return (
    <>
      <RecorderContainer>
        <div style={{ padding: "20px" }}>
          <h2>Audio Recorder</h2>
          <Input
            type="text"
            placeholder="Enter recording title..."
            value={recordingTitle}
            onChange={(e) => setRecordingTitle(e.target.value)}
          />
        </div>
        <h3>
          Recording progress: {currentSentenceIndex + 1}/{sentences.length}
        </h3>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Progress percent={progress} status="active" />
          <p>{statusMessage}</p>
        </Space>
        <p>{sentences[currentSentenceIndex]}</p>
        <Waveform ref={canvasRef} />
        <Controls>
          <Button
            icon={<LeftOutlined />}
            onClick={previousSentence}
            disabled={currentSentenceIndex === 0}
          />
          {recordings[currentSentenceIndex] && (
            <audio src={recordings[currentSentenceIndex]} controls />
          )}
          <RecordButton onClick={recording ? stopRecording : startRecording}>
            {recording ? "Stop" : "Record"}
          </RecordButton>
          <Button
            icon={<RightOutlined />}
            onClick={nextSentence}
            disabled={currentSentenceIndex === sentences.length - 1}
          />
        </Controls>
        <h1> </h1>
        <Button
          onClick={uploadRecordings}
          disabled={!recordingTitle || !allRecorded}
        >
          Save Recordings
        </Button>
      </RecorderContainer>
    </>
  );
};

export default AudioRecorder;
