import type React from "react";
import { useEffect } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

interface RecordingTimerProps {
  exposeRecorderControls: (controls: ReturnType<typeof useAudioRecorder>) => void;
}
export const RecordingTimer: React.FC<RecordingTimerProps> = ({ exposeRecorderControls }) => {
  const recorderControls = useAudioRecorder()


  useEffect(() => {
    exposeRecorderControls(recorderControls);

  }, [recorderControls, exposeRecorderControls]);

  return (
    <div style={{ display: 'flex' }}>
      <AudioRecorder

        recorderControls={recorderControls}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
          // autoGainControl,
          // channelCount,
          // deviceId,
          // groupId,
          // sampleRate,
          // sampleSize,
        }}
        onNotAllowedOrFound={(err) => console.table(err)}
        // downloadOnSavePress={true}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}

        showVisualizer={true}
      />
      <br />
    </div>
  );
}
