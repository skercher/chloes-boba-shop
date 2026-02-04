'use client';

import { useState, useEffect } from 'react';

// Game data
const CUPS = [
  { id: 'classic', name: 'Classic', emoji: '🥤', color: 'bg-transparent border-2 border-gray-300' },
  { id: 'pink', name: 'Pink Cup', emoji: '🩷', color: 'bg-pink-200' },
  { id: 'blue', name: 'Blue Cup', emoji: '💙', color: 'bg-blue-200' },
  { id: 'purple', name: 'Purple Cup', emoji: '💜', color: 'bg-purple-200' },
];

const PEARLS = [
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', color: 'bg-red-400' },
  { id: 'orange', name: 'Orange', emoji: '🍊', color: 'bg-orange-400' },
  { id: 'mango', name: 'Mango', emoji: '🥭', color: 'bg-yellow-400' },
  { id: 'banana', name: 'Banana', emoji: '🍌', color: 'bg-yellow-200' },
];

const DRINKS = [
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', color: 'bg-pink-300', unlocked: true },
  { id: 'mango', name: 'Mango', emoji: '🥭', color: 'bg-yellow-300', unlocked: true },
  { id: 'banana', name: 'Banana', emoji: '🍌', color: 'bg-yellow-100', unlocked: true },
  { id: 'chocolate', name: 'Chocolate', emoji: '🍫', color: 'bg-amber-700', unlocked: true },
  { id: 'coconut', name: 'Coconut', emoji: '🥥', color: 'bg-gray-100', unlocked: true },
  { id: 'matcha', name: 'Matcha', emoji: '🍵', color: 'bg-green-300', unlocked: true },
  // Unlockable
  { id: 'cherry', name: 'Cherry', emoji: '🍒', color: 'bg-red-500', unlocked: false, price: 50 },
  { id: 'apple', name: 'Apple', emoji: '🍎', color: 'bg-red-400', unlocked: false, price: 75 },
  { id: 'peach', name: 'Peach', emoji: '🍑', color: 'bg-orange-200', unlocked: false, price: 100 },
  { id: 'dragonfruit', name: 'Dragon Fruit', emoji: '🐉', color: 'bg-pink-500', unlocked: false, price: 200 },
];

const STICKERS = [
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈' },
  { id: 'sparkles', name: 'Pink Sparkles', emoji: '✨' },
  { id: 'blue', name: 'Blue Star', emoji: '💙' },
  { id: 'green', name: 'Green Heart', emoji: '💚' },
  { id: 'red', name: 'Red Heart', emoji: '❤️' },
  { id: 'white', name: 'White Star', emoji: '⭐' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋' },
  { id: 'flower', name: 'Flower', emoji: '🌸' },
];

const STRAWS = [
  { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
  { id: 'red', name: 'Red', color: 'bg-red-500' },
  { id: 'white', name: 'White', color: 'bg-white border border-gray-300' },
  { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
  { id: 'yellow', name: 'Yellow', color: 'bg-yellow-400' },
  { id: 'green', name: 'Green', color: 'bg-green-500' },
  { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
  { id: 'pink', name: 'Pink', color: 'bg-pink-400' },
];

type Station = 'start' | 'cup' | 'pearls' | 'drink' | 'sticker' | 'straw' | 'serve' | 'shop';

interface Order {
  cup: string;
  pearl: string;
  drink: string;
  sticker: string;
  straw: string;
}

interface BobaCreation {
  cup: typeof CUPS[0] | null;
  pearl: typeof PEARLS[0] | null;
  drink: typeof DRINKS[0] | null;
  sticker: typeof STICKERS[0] | null;
  straw: typeof STRAWS[0] | null;
}

const generateOrder = (unlockedDrinks: string[]): Order => {
  const availableDrinks = DRINKS.filter(d => d.unlocked || unlockedDrinks.includes(d.id));
  return {
    cup: CUPS[Math.floor(Math.random() * CUPS.length)].id,
    pearl: PEARLS[Math.floor(Math.random() * PEARLS.length)].id,
    drink: availableDrinks[Math.floor(Math.random() * availableDrinks.length)].id,
    sticker: STICKERS[Math.floor(Math.random() * STICKERS.length)].id,
    straw: STRAWS[Math.floor(Math.random() * STRAWS.length)].id,
  };
};

const CUSTOMER_EMOJIS = ['👧', '👦', '👩', '👨', '👵', '👴', '🧑', '👱‍♀️', '👱', '🧒'];

export default function BobaGame() {
  const [station, setStation] = useState<Station>('start');
  const [money, setMoney] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [customersServed, setCustomersServed] = useState(0);
  const [unlockedDrinks, setUnlockedDrinks] = useState<string[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [customerEmoji, setCustomerEmoji] = useState('👧');
  const [creation, setCreation] = useState<BobaCreation>({
    cup: null,
    pearl: null,
    drink: null,
    sticker: null,
    straw: null,
  });
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('bobaGameSave');
    if (saved) {
      const data = JSON.parse(saved);
      setMoney(data.money || 0);
      setHighScore(data.highScore || 0);
      setCustomersServed(data.customersServed || 0);
      setUnlockedDrinks(data.unlockedDrinks || []);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('bobaGameSave', JSON.stringify({
      money,
      highScore,
      customersServed,
      unlockedDrinks,
    }));
  }, [money, highScore, customersServed, unlockedDrinks]);

  const startNewOrder = () => {
    const order = generateOrder(unlockedDrinks);
    setCurrentOrder(order);
    setCustomerEmoji(CUSTOMER_EMOJIS[Math.floor(Math.random() * CUSTOMER_EMOJIS.length)]);
    setCreation({ cup: null, pearl: null, drink: null, sticker: null, straw: null });
    setStation('cup');
    setMessage('');
  };

  const checkOrder = () => {
    if (!currentOrder) return;
    
    let correct = 0;
    if (creation.cup?.id === currentOrder.cup) correct++;
    if (creation.pearl?.id === currentOrder.pearl) correct++;
    if (creation.drink?.id === currentOrder.drink) correct++;
    if (creation.sticker?.id === currentOrder.sticker) correct++;
    if (creation.straw?.id === currentOrder.straw) correct++;
    
    const reward = correct * 10;
    const newMoney = money + reward;
    setMoney(newMoney);
    setCustomersServed(customersServed + 1);
    
    if (newMoney > highScore) {
      setHighScore(newMoney);
    }
    
    if (correct === 5) {
      setMessage('🎉 PERFECT! +$50 bonus!');
      setMoney(newMoney + 50);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else if (correct >= 3) {
      setMessage(`✨ Great job! ${correct}/5 correct! +$${reward}`);
    } else {
      setMessage(`Keep trying! ${correct}/5 correct. +$${reward}`);
    }
    
    setStation('serve');
  };

  const buyDrink = (drinkId: string, price: number) => {
    if (money >= price && !unlockedDrinks.includes(drinkId)) {
      setMoney(money - price);
      setUnlockedDrinks([...unlockedDrinks, drinkId]);
      setMessage(`🎉 You unlocked ${DRINKS.find(d => d.id === drinkId)?.name}!`);
    }
  };

  const renderBobaCup = () => (
    <div className="relative w-32 h-48 mx-auto">
      {/* Cup */}
      <div className={`absolute bottom-0 w-28 h-36 rounded-b-3xl ${creation.cup?.color || 'bg-white/50'} border-2 border-white/50 mx-2 overflow-hidden`}>
        {/* Drink */}
        {creation.drink && (
          <div className={`absolute bottom-0 left-0 right-0 h-28 ${creation.drink.color} opacity-80`} />
        )}
        {/* Pearls */}
        {creation.pearl && (
          <div className="absolute bottom-2 left-0 right-0 flex flex-wrap justify-center gap-1 px-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${creation.pearl?.color} pearl-bounce`} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>
      {/* Lid with sticker */}
      <div className="absolute top-8 left-0 right-0 h-4 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
        {creation.sticker && <span className="text-lg">{creation.sticker.emoji}</span>}
      </div>
      {/* Straw */}
      {creation.straw && (
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-20 ${creation.straw.color} rounded-full`} />
      )}
    </div>
  );

  const renderOrderBubble = () => {
    if (!currentOrder) return null;
    const cup = CUPS.find(c => c.id === currentOrder.cup);
    const pearl = PEARLS.find(p => p.id === currentOrder.pearl);
    const drink = DRINKS.find(d => d.id === currentOrder.drink);
    const sticker = STICKERS.find(s => s.id === currentOrder.sticker);
    const straw = STRAWS.find(s => s.id === currentOrder.straw);
    
    return (
      <div className="glass rounded-2xl p-4 mb-4 text-center">
        <p className="font-bold text-lg mb-2">Order:</p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="bg-white/80 px-2 py-1 rounded-full">{cup?.emoji} {cup?.name}</span>
          <span className="bg-white/80 px-2 py-1 rounded-full">{pearl?.emoji} {pearl?.name}</span>
          <span className="bg-white/80 px-2 py-1 rounded-full">{drink?.emoji} {drink?.name}</span>
          <span className="bg-white/80 px-2 py-1 rounded-full">{sticker?.emoji}</span>
          <span className={`px-2 py-1 rounded-full ${straw?.color}`}>{straw?.name} straw</span>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen p-4 pb-20">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {['🎉', '✨', '🧋', '⭐', '💖'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold rainbow-text mb-2">🧋 Chloe's Boba Shop 🧋</h1>
        <div className="flex justify-center gap-4 text-lg">
          <span className="bg-yellow-200 px-4 py-2 rounded-full">💰 ${money}</span>
          <span className="bg-purple-200 px-4 py-2 rounded-full">🏆 Best: ${highScore}</span>
          <span className="bg-pink-200 px-4 py-2 rounded-full">👥 {customersServed}</span>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className="text-center mb-4 text-xl font-bold text-purple-600 animate-bounce">
          {message}
        </div>
      )}

      {/* Game Area */}
      <div className="max-w-md mx-auto">
        {/* Start Screen */}
        {station === 'start' && (
          <div className="text-center glass rounded-3xl p-8">
            <div className="text-8xl mb-4 animate-float">🧋</div>
            <h2 className="text-2xl font-bold mb-4">Welcome to Boba Shop!</h2>
            <p className="mb-6 text-gray-600">Make delicious boba tea for your customers!</p>
            <button
              onClick={startNewOrder}
              className="cute-btn bg-gradient-to-r from-pink-400 to-purple-400 text-white"
            >
              Start Making Boba! 🎉
            </button>
            <button
              onClick={() => setStation('shop')}
              className="cute-btn bg-gradient-to-r from-yellow-400 to-orange-400 text-white mt-4 ml-2"
            >
              🛒 Shop
            </button>
          </div>
        )}

        {/* Cup Station */}
        {station === 'cup' && (
          <div className="glass rounded-3xl p-6">
            <div className="text-6xl text-center mb-2">{customerEmoji}</div>
            {renderOrderBubble()}
            <h2 className="text-xl font-bold text-center mb-4">Pick a Cup! 🥤</h2>
            <div className="grid grid-cols-2 gap-3">
              {CUPS.map(cup => (
                <button
                  key={cup.id}
                  onClick={() => {
                    setCreation({ ...creation, cup });
                    setStation('pearls');
                  }}
                  className={`p-4 rounded-2xl border-4 ${creation.cup?.id === cup.id ? 'border-purple-500' : 'border-transparent'} ${cup.color} hover:scale-105 transition-transform`}
                >
                  <div className="text-4xl">{cup.emoji}</div>
                  <div className="font-bold">{cup.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pearls Station */}
        {station === 'pearls' && (
          <div className="glass rounded-3xl p-6">
            <div className="text-6xl text-center mb-2">{customerEmoji}</div>
            {renderOrderBubble()}
            {renderBobaCup()}
            <h2 className="text-xl font-bold text-center mb-4 mt-4">Add Boba Pearls! 🫧</h2>
            <div className="grid grid-cols-2 gap-3">
              {PEARLS.map(pearl => (
                <button
                  key={pearl.id}
                  onClick={() => {
                    setCreation({ ...creation, pearl });
                    setStation('drink');
                  }}
                  className={`p-4 rounded-2xl border-4 ${creation.pearl?.id === pearl.id ? 'border-purple-500' : 'border-transparent'} bg-white hover:scale-105 transition-transform`}
                >
                  <div className="text-3xl">{pearl.emoji}</div>
                  <div className={`w-8 h-8 rounded-full ${pearl.color} mx-auto my-2`} />
                  <div className="font-bold">{pearl.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Drink Station */}
        {station === 'drink' && (
          <div className="glass rounded-3xl p-6">
            <div className="text-6xl text-center mb-2">{customerEmoji}</div>
            {renderOrderBubble()}
            {renderBobaCup()}
            <h2 className="text-xl font-bold text-center mb-4 mt-4">Pour the Drink! 🍹</h2>
            <div className="grid grid-cols-3 gap-2">
              {DRINKS.filter(d => d.unlocked || unlockedDrinks.includes(d.id)).map(drink => (
                <button
                  key={drink.id}
                  onClick={() => {
                    setCreation({ ...creation, drink });
                    setStation('sticker');
                  }}
                  className={`p-3 rounded-2xl border-4 ${creation.drink?.id === drink.id ? 'border-purple-500' : 'border-transparent'} ${drink.color} hover:scale-105 transition-transform`}
                >
                  <div className="text-2xl">{drink.emoji}</div>
                  <div className="font-bold text-sm">{drink.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sticker Station */}
        {station === 'sticker' && (
          <div className="glass rounded-3xl p-6">
            <div className="text-6xl text-center mb-2">{customerEmoji}</div>
            {renderOrderBubble()}
            {renderBobaCup()}
            <h2 className="text-xl font-bold text-center mb-4 mt-4">Add a Sticker! ✨</h2>
            <div className="grid grid-cols-4 gap-2">
              {STICKERS.map(sticker => (
                <button
                  key={sticker.id}
                  onClick={() => {
                    setCreation({ ...creation, sticker });
                    setStation('straw');
                  }}
                  className={`p-3 rounded-2xl border-4 ${creation.sticker?.id === sticker.id ? 'border-purple-500' : 'border-transparent'} bg-white hover:scale-110 transition-transform`}
                >
                  <div className="text-3xl">{sticker.emoji}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Straw Station */}
        {station === 'straw' && (
          <div className="glass rounded-3xl p-6">
            <div className="text-6xl text-center mb-2">{customerEmoji}</div>
            {renderOrderBubble()}
            {renderBobaCup()}
            <h2 className="text-xl font-bold text-center mb-4 mt-4">Pick a Straw! 🥤</h2>
            <div className="grid grid-cols-4 gap-2">
              {STRAWS.map(straw => (
                <button
                  key={straw.id}
                  onClick={() => {
                    setCreation({ ...creation, straw });
                    checkOrder();
                  }}
                  className={`p-3 rounded-2xl border-4 ${creation.straw?.id === straw.id ? 'border-purple-500' : 'border-transparent'} bg-white hover:scale-105 transition-transform`}
                >
                  <div className={`w-4 h-16 rounded-full ${straw.color} mx-auto`} />
                  <div className="font-bold text-xs mt-1">{straw.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Serve Station */}
        {station === 'serve' && (
          <div className="glass rounded-3xl p-6 text-center">
            <div className="text-6xl mb-4">{customerEmoji}</div>
            <div className="text-4xl mb-4">😋</div>
            {renderBobaCup()}
            <h2 className="text-xl font-bold mt-4 mb-4">Boba Served!</h2>
            <p className="text-gray-600 mb-4">Your customer is happy!</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={startNewOrder}
                className="cute-btn bg-gradient-to-r from-green-400 to-teal-400 text-white"
              >
                Next Customer! 👋
              </button>
              <button
                onClick={() => setStation('shop')}
                className="cute-btn bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
              >
                🛒 Shop
              </button>
            </div>
          </div>
        )}

        {/* Shop */}
        {station === 'shop' && (
          <div className="glass rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-center mb-4">🛒 Flavor Shop</h2>
            <p className="text-center mb-4">💰 You have: ${money}</p>
            <div className="grid grid-cols-2 gap-3">
              {DRINKS.filter(d => !d.unlocked).map(drink => {
                const isOwned = unlockedDrinks.includes(drink.id);
                const canAfford = money >= (drink.price || 0);
                return (
                  <button
                    key={drink.id}
                    onClick={() => !isOwned && canAfford && buyDrink(drink.id, drink.price || 0)}
                    disabled={isOwned || !canAfford}
                    className={`p-4 rounded-2xl ${drink.color} ${isOwned ? 'opacity-50' : canAfford ? 'hover:scale-105' : 'opacity-70'} transition-transform`}
                  >
                    <div className="text-3xl">{drink.emoji}</div>
                    <div className="font-bold">{drink.name}</div>
                    {isOwned ? (
                      <div className="text-green-600 font-bold">✓ Owned</div>
                    ) : (
                      <div className="font-bold">${drink.price}</div>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStation(currentOrder ? 'serve' : 'start')}
              className="cute-btn bg-gradient-to-r from-pink-400 to-purple-400 text-white w-full mt-4"
            >
              Back to Shop 🧋
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-2 text-center border-t">
        <p className="text-sm text-gray-500">Made with 💖 by Chloe</p>
      </footer>
    </main>
  );
}
