'use client';

export function VideoBackground() {
  return (
    <>
      {/* Background Image */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: 'url(/images/field-background.png)',
        }}
      />

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/50 -z-10" />
    </>
  );
}
