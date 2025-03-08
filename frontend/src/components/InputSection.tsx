import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";

interface InputSectionProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  onSubmit,
  isProcessing,
}) => {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const recognitionRef = useRef<any>(null);

  const placeholder =
    "Tomorrow, I need to wake up at 7 AM, hit the gym for 1 hour, then grab coffee with Sarah at 10 AM. After that, I'll work on my project until 1 PM and have lunch. Maybe a short walk in the evening around 6 PM.";

  const startSpeechRecognition = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");

        setInputText(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        stopSpeechRecognition();
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.start();
    } else {
      console.error("Speech recognition not supported");
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const handleSubmit = () => {
    if (inputText.trim() && !isProcessing) {
      onSubmit(inputText);
      setIsButtonClicked(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit();
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
      e.preventDefault(); // Prevent default browser behavior
      toggleRecording();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, inputText, isProcessing]);

  return (
    <div className="w-full max-w-3xl mx-auto px-3 md:px-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 relative overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 pointer-events-none" />

        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={placeholder}
          className="min-h-32 md:min-h-40 resize-none text-sm md:text-base px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-primary/20 shadow-none bg-white/80 dark:bg-black/30 input-focus transition-all duration-300 focus:border-primary/40 backdrop-blur-sm"
        />

        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-4">
          <div className="relative flex items-center gap-3">
            <Button
              type="button"
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              className={`rounded-full h-10 w-10 md:h-12 md:w-12 shadow-md ${
                isRecording
                  ? "animate-pulse-soft shadow-destructive/20"
                  : "shadow-primary/10"
              }`}
            >
              <Mic
                className={`h-4 w-4 md:h-5 md:w-5 ${
                  isRecording ? "text-white" : ""
                }`}
              />
            </Button>
            {!isButtonClicked && (
              <span className="text-xs border border-primary/20 rounded px-1.5 py-0.5 hidden sm:inline-flex items-center text-muted-foreground">
                {navigator.platform.toLowerCase().includes("mac") ? "⌘" : "Ctrl"}{" "}
                + M
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {!isButtonClicked && (
                <span className="text-xs border border-primary/20 rounded px-1.5 py-0.5 hidden sm:inline-flex items-center text-muted-foreground">
                  {navigator.platform.toLowerCase().includes("mac") ? "⌘" : "Ctrl"}{" "}
                  + Enter
                </span>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
                className={`w-full sm:w-auto px-2 md:px-4 py-2 rounded-lg md:rounded-xl transition-all duration-300 ${
                  !inputText.trim() || isProcessing
                    ? "bg-primary/80"
                    : "bg-primary hover:bg-primary/90"
                } shadow-md shadow-primary/20 flex items-center gap-2 relative overflow-hidden`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="relative">
                      Processing
                      <span className="absolute -right-4 animate-bounce-ellipsis">.</span>
                      <span className="absolute -right-7 animate-bounce-ellipsis" style={{ animationDelay: "0.2s" }}>.</span>
                      <span className="absolute -right-10 animate-bounce-ellipsis" style={{ animationDelay: "0.4s" }}>.</span>
                    </span>
                  </div>
                ) : (
                  <span>Generate Schedule</span>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
