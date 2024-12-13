interface LoadingAnimationProps {
  className?: string;
}

export function LoadingAnimation({ className }: LoadingAnimationProps) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className={className}
    >
      <source src="/animations/loading-spinner.webm" type="video/webm" />
    </video>
  );
}
