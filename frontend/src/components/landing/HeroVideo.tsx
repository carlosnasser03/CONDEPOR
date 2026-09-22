'use client';

export function HeroVideo() {
  return (
    <>
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/Football_pitch_with_sideline_202607271020.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/50 -z-10" />
    </>
  );
}
