import React, { useState, useEffect } from 'react';
import { GameStore } from '@penguin-surf/game-engine/store/GameStore';
import { MainMenu } from './components/MainMenu';

// Game states
type GameState = 'intro' | 'beach' | 'contest' | 'results';

// Intro Screen Component
const IntroScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Welcome to Penguin Surf Championship",
      subtitle: "The Ultimate Antarctic Surfing Experience",
      content: "Join the most epic surfing competition in the frozen seas!",
      emoji: "🐧🏄‍♂️"
    },
    {
      title: "Master the Waves",
      subtitle: "Ride the Perfect Wave",
      content: "Use your skills to navigate massive waves and perform incredible tricks!",
      emoji: "🌊⚡"
    },
    {
      title: "Compete for Glory",
      subtitle: "Surf Contest Championship",
      content: "Battle against other penguins in the ultimate surfing showdown!",
      emoji: "🏆🥇"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        onComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentSlide, onComplete, slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>❄️</div>
        <div className="absolute top-20 right-20 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>🌊</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce" style={{ animationDelay: '2s' }}>🏔️</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 max-w-4xl px-8">
        <div className="text-8xl mb-8 animate-pulse">{slide.emoji}</div>
        <h1 className="text-6xl font-black text-white mb-4 drop-shadow-2xl">
          {slide.title}
        </h1>
        <h2 className="text-3xl font-bold text-cyan-300 mb-8 drop-shadow-xl">
          {slide.subtitle}
        </h2>
        <p className="text-xl text-white/90 font-light leading-relaxed drop-shadow-lg">
          {slide.content}
        </p>
        
        {/* Progress indicators */}
        <div className="flex justify-center space-x-3 mt-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-cyan-400 scale-125' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="absolute bottom-8 right-8 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
};

// Club Penguin Style Beach Scene Component
const BeachScene: React.FC<{ player: any; onStartContest: () => void }> = ({ player, onStartContest }) => {
  const [selectedPenguin, setSelectedPenguin] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [penguinPosition, setPenguinPosition] = useState({ x: 50, y: 50 });
  const [isWaddling, setIsWaddling] = useState(false);
  
  const penguinCharacters = [
    { name: "Blue Penguin", color: "text-blue-400", bgColor: "bg-blue-500", trait: "Fast swimmer", emoji: "🐧", clubColor: "#4A90E2" },
    { name: "Red Penguin", color: "text-red-400", bgColor: "bg-red-500", trait: "Great balance", emoji: "🐧", clubColor: "#E74C3C" },
    { name: "Green Penguin", color: "text-green-400", bgColor: "bg-green-500", trait: "Trick master", emoji: "🐧", clubColor: "#2ECC71" },
    { name: "Yellow Penguin", color: "text-yellow-400", bgColor: "bg-yellow-500", trait: "Wave rider", emoji: "🐧", clubColor: "#F1C40F" }
  ];

  const otherPenguins = [
    { name: "Rookie", x: 20, y: 70, color: "#E74C3C", message: "Welcome to Club Penguin!" },
    { name: "Gary", x: 80, y: 30, color: "#2ECC71", message: "Ready to surf?" },
    { name: "Aunt Arctic", x: 30, y: 20, color: "#9B59B6", message: "Have fun!" }
  ];

  const handlePenguinMove = (direction: string) => {
    setIsWaddling(true);
    setPenguinPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch(direction) {
        case 'up': newY = Math.max(10, prev.y - 10); break;
        case 'down': newY = Math.min(80, prev.y + 10); break;
        case 'left': newX = Math.max(10, prev.x - 10); break;
        case 'right': newX = Math.min(80, prev.x + 10); break;
      }
      
      return { x: newX, y: newY };
    });
    
    setTimeout(() => setIsWaddling(false), 500);
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      setShowChat(true);
      setTimeout(() => setShowChat(false), 3000);
      setChatMessage("");
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-cyan-200 via-white to-blue-300 relative overflow-hidden">
      {/* Beach sand */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-yellow-300 to-yellow-200"></div>
      
      {/* Ocean */}
      <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-blue-600 to-blue-400 opacity-80">
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white/60 to-transparent animate-pulse"></div>
        <div className="absolute bottom-2 left-0 w-full h-6 bg-gradient-to-t from-white/40 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Club Penguin Style Igloos */}
      <div className="absolute top-16 left-16 cursor-pointer hover:scale-110 transition-transform">
        <div className="text-6xl">🏠</div>
        <div className="text-xs text-center text-blue-800 font-bold">Surf Shop</div>
      </div>
      
      <div className="absolute top-20 right-20 cursor-pointer hover:scale-110 transition-transform">
        <div className="text-5xl">⛪</div>
        <div className="text-xs text-center text-blue-800 font-bold">Lighthouse</div>
      </div>

      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform">
        <div className="text-4xl">🏖️</div>
        <div className="text-xs text-center text-blue-800 font-bold">Beach Hut</div>
      </div>

      {/* Other NPCs (Club Penguin style) */}
      {otherPenguins.map((npc, index) => (
        <div 
          key={index}
          className="absolute cursor-pointer"
          style={{ 
            left: `${npc.x}%`, 
            top: `${npc.y}%`,
            color: npc.color 
          }}
        >
          <div className="text-4xl animate-bounce hover:scale-110 transition-transform">
            🐧
          </div>
          <div className="text-xs text-center font-bold text-white bg-black/70 px-2 py-1 rounded-full mt-1">
            {npc.name}
          </div>
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-1 text-xs text-black shadow-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
            {npc.message}
          </div>
        </div>
      ))}

      {/* Beach Activities (Club Penguin style) */}
      <div className="absolute bottom-40 left-20 cursor-pointer hover:scale-110 transition-transform">
        <div className="text-3xl">🏐</div>
        <div className="text-xs text-center text-blue-800 font-bold">Volleyball</div>
      </div>

      <div className="absolute bottom-36 right-24 cursor-pointer hover:scale-110 transition-transform">
        <div className="text-3xl">🏄‍♂️</div>
        <div className="text-xs text-center text-blue-800 font-bold">Surf Lesson</div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="bg-black/20 backdrop-blur-lg rounded-3xl p-8 max-w-4xl mx-4">
          <h1 className="text-5xl font-black text-white mb-4 text-center drop-shadow-2xl">
            🏖️ Welcome to Penguin Beach!
          </h1>
          <h2 className="text-2xl font-bold text-cyan-200 mb-8 text-center">
            Choose your surfing penguin, {player.username}!
          </h2>

          {/* Club Penguin Style Character Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {penguinCharacters.map((penguin, index) => (
              <div
                key={index}
                onClick={() => setSelectedPenguin(index)}
                className={`cursor-pointer p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  selectedPenguin === index 
                    ? `${penguin.bgColor}/30 border-2 border-white scale-105 shadow-lg` 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                style={{ 
                  backgroundColor: selectedPenguin === index ? penguin.clubColor + '40' : undefined,
                  borderColor: selectedPenguin === index ? penguin.clubColor : undefined
                }}
              >
                <div className="text-center">
                  <div className={`text-6xl mb-2 ${selectedPenguin === index ? 'animate-bounce' : ''}`}>
                    🐧
                  </div>
                  <div className={`text-lg font-bold text-white drop-shadow-lg`}>
                    {penguin.name}
                  </div>
                  <div className="text-sm text-white/90 font-medium">
                    {penguin.trait}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected penguin info */}
          <div className="bg-black/30 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-4xl animate-bounce">
                {penguinCharacters[selectedPenguin].emoji}
              </div>
              <div>
                <div className={`text-2xl font-bold ${penguinCharacters[selectedPenguin].color}`}>
                  {penguinCharacters[selectedPenguin].name}
                </div>
                <div className="text-white/80">
                  Special Ability: {penguinCharacters[selectedPenguin].trait}
                </div>
              </div>
            </div>
          </div>

          {/* Club Penguin Style Beach Activities */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg border-2 border-blue-300">
              🏐 Play Volleyball
            </button>
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg border-2 border-green-300">
              🐚 Shell Hunt
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg border-2 border-purple-300">
              🏖️ Beach Party
            </button>
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg border-2 border-orange-300">
              🏄‍♀️ Surf Lessons
            </button>
          </div>

          {/* Start contest button */}
          <div className="text-center">
            <button
              onClick={onStartContest}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🌊 Start Surf Contest!
            </button>
          </div>
        </div>
      </div>

      {/* Your Penguin (Controllable) */}
      <div 
        className="absolute transition-all duration-500 cursor-pointer"
        style={{ 
          left: `${penguinPosition.x}%`, 
          top: `${penguinPosition.y}%`,
          transform: isWaddling ? 'scale(1.1) rotate(-5deg)' : 'scale(1)'
        }}
      >
        <div className="text-5xl animate-bounce">
          🐧
        </div>
        <div className="text-xs text-center font-bold text-white bg-blue-600 px-2 py-1 rounded-full mt-1">
          {player.username}
        </div>
        {showChat && chatMessage && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 text-sm text-black shadow-lg max-w-32 text-center">
            {chatMessage}
          </div>
        )}
      </div>

      {/* Movement Controls */}
      <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-lg rounded-2xl p-4">
        <div className="text-white text-sm font-bold mb-2 text-center">Move Around</div>
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <button 
            onClick={() => handlePenguinMove('up')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg text-sm font-bold transition-colors"
          >
            ↑
          </button>
          <div></div>
          <button 
            onClick={() => handlePenguinMove('left')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg text-sm font-bold transition-colors"
          >
            ←
          </button>
          <div></div>
          <button 
            onClick={() => handlePenguinMove('right')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg text-sm font-bold transition-colors"
          >
            →
          </button>
          <div></div>
          <button 
            onClick={() => handlePenguinMove('down')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg text-sm font-bold transition-colors"
          >
            ↓
          </button>
          <div></div>
        </div>
      </div>

      {/* Chat System */}
      <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-lg rounded-2xl p-4 w-64">
        <div className="text-white text-sm font-bold mb-2">Chat</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            placeholder="Say something..."
            className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white/60"
            maxLength={50}
          />
          <button
            onClick={sendChatMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            Send
          </button>
        </div>
      </div>

      {/* Animated beach elements */}
      <div className="absolute bottom-10 left-1/4 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🦀</div>
      <div className="absolute bottom-8 right-1/3 text-xl animate-bounce" style={{ animationDelay: '2s' }}>🐚</div>
      <div className="absolute bottom-12 left-1/2 text-lg animate-bounce" style={{ animationDelay: '1.5s' }}>⭐</div>
    </div>
  );
};

// Surf Contest Component
const SurfContest: React.FC<{ player: any }> = ({ player }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [waveHeight, setWaveHeight] = useState(3);
  const [isRiding, setIsRiding] = useState(false);
  const [tricks, setTricks] = useState<string[]>([]);

  const trickNames = ['Barrel Roll', '360 Spin', 'Aerial Flip', 'Nose Ride', 'Cutback', 'Floater'];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const waveTimer = setInterval(() => {
      setWaveHeight(Math.random() * 6 + 2); // 2-8 meter waves
    }, 2000);

    return () => clearInterval(waveTimer);
  }, []);

  const performTrick = () => {
    if (isRiding) return;
    
    setIsRiding(true);
    const trickScore = Math.floor(Math.random() * 100) + 50;
    const randomTrick = trickNames[Math.floor(Math.random() * trickNames.length)];
    
    setScore(prev => prev + trickScore);
    setTricks(prev => [...prev.slice(-4), randomTrick]); // Keep last 5 tricks
    
    setTimeout(() => setIsRiding(false), 1500);
  };

  const catchWave = () => {
    if (isRiding) return;
    
    setIsRiding(true);
    const waveScore = Math.floor(waveHeight * 10);
    setScore(prev => prev + waveScore);
    
    setTimeout(() => setIsRiding(false), 2000);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900 relative overflow-hidden">
      {/* Ocean waves animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/40 to-transparent animate-pulse"></div>
        <div className="absolute bottom-8 left-0 w-full h-24 bg-gradient-to-t from-white/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-16 left-0 w-full h-16 bg-gradient-to-t from-white/10 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Game UI */}
      <div className="relative z-10 p-6">
        {/* Top HUD */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-black/30 backdrop-blur-lg text-white p-4 rounded-2xl">
            <div className="text-2xl font-bold">🐧 {player.username}</div>
            <div className="text-lg">Score: {score.toLocaleString()}</div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-lg text-white p-4 rounded-2xl text-center">
            <div className="text-3xl font-bold text-red-400">{timeLeft}s</div>
            <div className="text-sm">Time Left</div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-lg text-white p-4 rounded-2xl text-center">
            <div className="text-2xl font-bold">🌊 {waveHeight.toFixed(1)}m</div>
            <div className="text-sm">Wave Height</div>
          </div>
        </div>

        {/* Penguin Surfer */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`text-8xl transition-all duration-500 ${isRiding ? 'animate-spin' : 'animate-bounce'}`}>
            🐧🏄‍♂️
          </div>
          {isRiding && (
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-xl animate-bounce">
              +{Math.floor(waveHeight * 10)}
            </div>
          )}
        </div>

        {/* Recent Tricks */}
        {tricks.length > 0 && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/30 backdrop-blur-lg text-white p-3 rounded-xl">
              <div className="text-sm font-semibold mb-2">Recent Tricks:</div>
              {tricks.slice(-3).map((trick, index) => (
                <div key={index} className="text-xs text-cyan-300">{trick}</div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-4">
            <button
              onClick={catchWave}
              disabled={isRiding || timeLeft === 0}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🌊 Catch Wave
            </button>
            <button
              onClick={performTrick}
              disabled={isRiding || timeLeft === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🤸 Perform Trick
            </button>
          </div>
        </div>

        {/* Game Over */}
        {timeLeft === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 text-center max-w-md">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Contest Complete!</h2>
              <div className="text-xl text-gray-600 mb-6">
                Final Score: <span className="font-bold text-blue-600">{score.toLocaleString()}</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function App() {
  const { player } = GameStore.useStore();
  const [gameState, setGameState] = useState<GameState>('intro');
  
  return (
    <div className="w-full h-screen overflow-hidden">
      {!player ? (
        <MainMenu />
      ) : gameState === 'intro' ? (
        <IntroScreen onComplete={() => setGameState('beach')} />
      ) : gameState === 'beach' ? (
        <BeachScene player={player} onStartContest={() => setGameState('contest')} />
      ) : (
        <SurfContest player={player} />
      )}
    </div>
  );
}

export default App;
