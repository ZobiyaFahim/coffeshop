
import { useEffect, useState } from 'react';

const App = () => {
  const [coffees, setCoffees] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/coffees')
      .then((res) => res.json())
      .then((data) => setCoffees(data))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <div className="bg-[#1c140e] text-[#e6c594] min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-6 border-b border-[#2d1f16]">
        <div className="text-2xl font-bold tracking-widest text-[#bc966c]">CAFE AURA</div>
        <div className="space-x-8 text-sm uppercase tracking-wider hidden md:flex">
          <a href="#" className="hover:text-white transition">Home</a>
          <a href="#" className="hover:text-white transition">Coffee</a>
          <a href="#" className="hover:text-white transition">Our Story</a>
          <a href="#" className="hover:text-white transition">Menu</a>
        </div>
        <button className="border border-[#bc966c] px-4 py-2 text-sm uppercase tracking-wider hover:bg-[#bc966c] hover:text-[#1c140e] transition">
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between px-12 py-16 max-w-7xl mx-auto gap-12">
        <div className="max-w-xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight">
            Awaken Your <span className="text-[#bc966c]">Senses</span> With Every Sip
          </h1>
          <p className="text-[#bc966c]/80 text-lg leading-relaxed">
            Discover carefully selected premium blends crafted by expert baristas. Immerse yourself in our cozy atmosphere.
          </p>
          <button className="bg-[#bc966c] text-[#1c140e] px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#e6c594] transition shadow-lg">
            Book A Table
          </button>
        </div>
        <div className="relative">
          <img 
            src="https://unsplash.com" 
            alt="Premium Espresso Splash" 
            className="rounded-b-full border-4 border-[#2d1f16] shadow-2xl object-cover w-[400px] h-[500px]"
          />
        </div>
      </header>

      {/* Products Section */}
      <section className="bg-[#2d1f16] py-20 px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-4xl font-serif text-white">Our Signature Coffees</h2>
            <div className="h-0.5 w-24 bg-[#bc966c] mx-auto"></div>
            <p className="text-[#e6c594]/70 max-w-md mx-auto text-sm">Explore our classic range, from quick rich shots to satisfying long brews.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coffees.map((coffee) => (
              <div key={coffee._id} className="bg-[#1c140e] p-6 border border-amber-900/20 hover:border-[#bc966c]/40 transition group duration-300">
                <div className="overflow-hidden mb-4 h-64">
                  <img 
                    src={coffee.image} 
                    alt={coffee.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 grayscale-[20%] group-hover:grayscale-0"
                  />
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-serif text-white group-hover:text-[#e6c594] transition">{coffee.name}</h3>
                  <span className="text-lg font-bold text-[#bc966c]">{coffee.price}</span>
                </div>
                <p className="text-sm text-[#e6c594]/60 min-h-[40px]">{coffee.description}</p>
                <button className="mt-4 w-full py-2 bg-[#2d1f16] hover:bg-[#bc966c] hover:text-[#1c140e] text-xs font-bold uppercase tracking-widest transition">
                  Order Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;