import React, { useState } from "react";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import ScheduleDisplay from "@/components/ScheduleDisplay";
import ScheduleSkeleton from "@/components/ScheduleSkeleton";
import { generateSchedule } from "@/utils/api";
import type { ScheduleEvent } from "@/utils/api";
import { toast } from "sonner";
import { ThemeProvider } from "@/hooks/useTheme";

const Index = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleSubmit = async (text: string) => {
    try {
      setIsProcessing(true);
      setShowSchedule(true);

      const extractedEvents = await generateSchedule(text);
      setEvents(extractedEvents);
      toast.success("Schedule generated successfully!");
    } catch (error) {
      console.error("Error processing input:", error);
      if (error instanceof Error && (error.name === 'GEMINI_MODEL_OVERLOADED' || error.message === 'GEMINI_MODEL_OVERLOADED')) {
        toast.info("The AI model is currently overloaded. This is not your fault—please try again in a few moments.");
      } else {
        toast.error(error instanceof Error ? error.message : "Error generating schedule. Please try again.");
      }
      setShowSchedule(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setEvents([]);
    setShowSchedule(false);
  };

  return (
    <ThemeProvider>
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="min-h-screen flex flex-col items-center">
        <div className="w-full max-w-6xl mx-auto py-4 md:py-8 px-3 md:px-4">
          <Header />
          <div className="relative mt-8">
            {!showSchedule ? (
              <InputSection
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
              />
            ) : isProcessing ? (
              <ScheduleSkeleton />
            ) : (
              <ScheduleDisplay
                events={events}
                onEventsChange={setEvents}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
