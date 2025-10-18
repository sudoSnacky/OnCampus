export const DinoLoader = () => {
    return (
      <div className="relative w-20 h-20">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-400"></div>
        <div className="absolute bottom-1 left-4 w-8 h-8 bg-primary animate-jump rounded-t-md"></div>
        <style jsx>{`
          @keyframes jump {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-25px);
            }
          }
          .animate-jump {
            animation: jump 0.6s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  };
  