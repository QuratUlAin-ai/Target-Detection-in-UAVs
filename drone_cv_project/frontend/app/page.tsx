'use client';

import { useState, useEffect, useCallback } from 'react';
import TopBar from '@/components/hud/TopBar';
import LeftPanel from '@/components/hud/LeftPanel';
import CenterPanel from '@/components/hud/CenterPanel';
import RightPanel from '@/components/hud/RightPanel';
import BottomBar from '@/components/hud/BottomBar';
import { checkHealth, runPrediction, Detection } from '@/lib/api';

export default function DroneDashboard() {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [selectedModel, setSelectedModel] = useState('drones');
  const [confidence, setConfidence] = useState(50);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check API health on mount and periodically
  useEffect(() => {
    const checkApiHealth = async () => {
      const ok = await checkHealth();
      setApiStatus(ok ? 'online' : 'offline');
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const runDetection = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setErrorMessage(null);
      setAnnotatedImage(null);
      setDetections([]);
      setProcessingTime(null);

      try {
        const result = await runPrediction(
          selectedModel,
          file,
          confidence / 100,
          0.45
        );

        setAnnotatedImage(`data:image/png;base64,${result.image_base64}`);
        setDetections(result.detections ?? []);
        setProcessingTime(result.processing_time);
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : 'Detection failed';
        setErrorMessage(msg);
        setDetections([]);
        console.error('Detection failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedModel, confidence]
  );

  const handleImageUpload = useCallback(
    (file: File) => {
      setImageFile(file);
      setErrorMessage(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      void runDetection(file);
    },
    [runDetection]
  );

  const handleRunDetection = useCallback(() => {
    if (!imageFile || isLoading) return;
    void runDetection(imageFile);
  }, [imageFile, isLoading, runDetection]);

  return (
    <div className="h-screen w-screen bg-[#0a1628] overflow-hidden relative">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 scanline-overlay z-50" />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,22,40,0.4)_70%,rgba(10,22,40,0.8)_100%)] z-40 pointer-events-none" />

      {/* Main grid layout */}
      <div className="h-full w-full grid grid-rows-[auto_1fr_auto] relative z-10">
        {/* Top Bar */}
        <TopBar
          apiStatus={apiStatus}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />

        {/* Main content area */}
        <div className="grid grid-cols-[22%_1fr_22%] min-h-0 overflow-hidden">
          {/* Left Panel */}
          <div className="border-r border-cyan-500/30 overflow-hidden">
            <LeftPanel />
          </div>

          {/* Center Panel */}
          <div className="overflow-hidden">
            <CenterPanel
              imagePreview={imagePreview}
              annotatedImage={annotatedImage}
              isLoading={isLoading}
              onImageUpload={handleImageUpload}
              onRunDetection={handleRunDetection}
            />
          </div>

          {/* Right Panel */}
          <div className="border-l border-cyan-500/30 overflow-hidden">
            <RightPanel
              detections={detections}
              confidence={confidence}
              onConfidenceChange={setConfidence}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <BottomBar
          processingTime={processingTime}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </div>

      {/* Glowing corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-500/30 pointer-events-none z-20" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyan-500/30 pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-cyan-500/30 pointer-events-none z-20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-500/30 pointer-events-none z-20" />
    </div>
  );
}
