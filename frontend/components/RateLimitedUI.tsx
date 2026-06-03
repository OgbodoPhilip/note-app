import { AiFillThunderbolt } from "react-icons/ai";

export default function RateLimitedUI() {
  // A mock function to simulate a retry action
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] p-[clamp(1rem,3vw,3rem)] text-white font-sans antialiased overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-[clamp(280px,85vw,640px)] bg-[#131A2C]/60 backdrop-blur-xl border border-white/10 rounded-[clamp(1rem,2vw,1.5rem)] p-[clamp(1.5rem,5vw,3.5rem)] shadow-2xl flex flex-col items-center text-center group">
        {/* Animated Icon Container */}
        <div className="relative flex items-center justify-center w-[clamp(4.5rem,12vw,6rem)] h-[clamp(4.5rem,12vw,6rem)] rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-[3px] animate-pulse mb-[clamp(1.5rem,4vw,2.5rem)]">
          <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center">
            <AiFillThunderbolt className="text-[clamp(2rem,5vw,3rem)] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400" />
          </div>
        </div>

        {/* Dynamic Typography using clamp() */}
        <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-tight">
          Too Many Requests
        </h1>

        <p className="text-[clamp(0.875rem,2.5vw,1.125rem)] text-slate-400 font-medium mt-[clamp(0.75rem,2vw,1.25rem)] max-w-md balance">
          Whoa there, speed racer! You have made too many requests in a short
          period of time. Our servers are catching their breath.
        </p>

        {/* Status/Cooldown Indicator */}
        <div className="w-full bg-white/5 border border-white/5 rounded-xl p-[clamp(0.75rem,2vw,1rem)] mt-[clamp(1.5rem,3vw,2rem)] flex items-center justify-between gap-4 text-left">
          <span className="text-[clamp(0.75rem,2vw,0.875rem)] uppercase tracking-wider text-pink-400 font-bold">
            Status Code
          </span>
          <span className="text-[clamp(0.75rem,2vw,0.875rem)] font-mono bg-white/10 px-2 py-1 rounded text-cyan-400 font-bold">
            429: Too Many Requests
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleRetry}
          className="w-full mt-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,2vw,1rem)] px-6 rounded-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-purple-500/25 active:scale-[0.98]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
