export const DinoLoader = () => {
    return (
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Ground */}
        <div className="absolute bottom-4 left-0 w-full h-0.5 bg-foreground/50"></div>

        {/* Dino */}
        <div className="absolute bottom-4 left-4 w-10 h-12 animate-jump">
          {/* Body */}
          <div className="absolute bottom-0 left-0 w-10 h-10 bg-primary rounded-t-md"></div>
           {/* Head */}
          <div className="absolute -top-3 right-0 w-6 h-4 bg-primary rounded-sm"></div>
           {/* Eye */}
           <div className="absolute -top-2 right-4 w-1 h-1 bg-background rounded-full"></div>
           {/* Arm */}
           <div className="absolute top-4 -right-2 w-2 h-3 bg-primary rounded-sm"></div>
        </div>

        {/* Cacti */}
        <div className="absolute bottom-4 right-0 flex animate-move-left">
          <div className="w-4 h-8 bg-primary rounded-t-md mx-8"></div>
          <div className="w-5 h-10 bg-primary rounded-t-md mx-8"></div>
          <div className="w-3 h-6 bg-primary rounded-t-md mx-8"></div>
        </div>

        <style jsx>{`
          @keyframes jump {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-24px);
            }
          }
          .animate-jump {
            animation: jump 0.6s ease-in-out infinite;
          }
          
          @keyframes move-left {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-150%);
            }
          }
          .animate-move-left {
            animation: move-left 1.5s linear infinite;
          }
        `}</style>
      </div>
    );
  };