import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/role-select");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-primary px-4">
      <div className="animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 text-center">
          Synapsa.ai
        </h1>
        <p className="text-xl md:text-2xl text-white/90 text-center max-w-2xl mx-auto font-light">
          Technology that listens, understands, and cares for the human mind
        </p>
      </div>
      <div className="mt-12 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "0s" }}></div>
        <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
        <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  );
};

export default Splash;
