import { useEffect, useState } from 'react';

const App = () => {
  const [coffees, setCoffees] = useState([]);
  const [cart, setCart] = useState([]); 
  const [currentView, setCurrentView] = useState('home'); // 'home', 'booked', 'checkout', 'paid', 'admin'
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ date: '', time: '' });
  const [finalBill, setFinalBill] = useState('0.00');

  // Admin States
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImg, setNewImg] = useState('');

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/coffees')
      .then((res) => res.json())
      .then((data) => setCoffees(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (item) => setCart([...cart, item]);
  const removeFromCart = (idx) => setCart(cart.filter((_, i) => i !== idx));
  const calculateTotal = () => cart.reduce((t, item) => t + item.price, 0).toFixed(2);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productData = { name: newName, description: newDesc, price: newPrice, image: `/${newImg}` };

    fetch('http://localhost:5000/api/coffees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
    .then(res => res.json())
    .then(() => {
      fetchProducts();
      setNewName(''); setNewDesc(''); setNewPrice(''); setNewImg('');
      alert('✨ Premium Coffee added to list safely!');
    });
  };

  const handleDeleteProduct = (id) => {
    fetch(`http://localhost:5000/api/coffees/${id}`, { method: 'DELETE' })
    .then(() => {
      fetchProducts();
      alert('🗑️ Item removed from shop list.');
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setBookingDetails({ date: formData.get('date'), time: formData.get('time') });
    setCurrentView('booked');
    setShowBooking(false);
  };

  // ==========================================
  // VIEW 1: PREMIUM ADMIN DASHBOARD (Responsive)
  // ==========================================
  if (currentView === 'admin') {
    return (
      <div style={{ backgroundColor: '#1c140e', color: '#e6c594', minHeight: '100vh', padding: '20px 5%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #bc966c', paddingBottom: '15px', marginBottom: '30px', gap: '15px' }}>
          <h1 style={{ fontFamily: 'serif', color: 'white', margin: '0', fontSize: '1.8rem' }}>Cafe Aura - Admin Panel</h1>
          <button className="btn-premium" onClick={() => setCurrentView('home')}>← Back To Customer Lounge</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Form Side */}
          <form onSubmit={handleAddProduct} style={{ background: '#2d1f16', padding: '25px', border: '1px solid #bc966c', minWidth: '280px', boxSizing: 'border-box' }}>
            <h3 style={{ color: 'white', marginTop: '0', marginBottom: '20px' }}>Add New Coffee Blend</h3>
            <input type="text" placeholder="Coffee Name (e.g. Mocha)" required value={newName} onChange={e => setNewName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#1c140e', border: '1px solid rgba(188,150,108,0.4)', color: 'white', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Description" required value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#1c140e', border: '1px solid rgba(188,150,108,0.4)', color: 'white', boxSizing: 'border-box' }} />
            <input type="number" step="0.01" placeholder="Price in $" required value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#1c140e', border: '1px solid rgba(188,150,108,0.4)', color: 'white', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Image file (e.g. doppio.jpg)" required value={newImg} onChange={e => setNewImg(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '25px', background: '#1c140e', border: '1px solid rgba(188,150,108,0.4)', color: 'white', boxSizing: 'border-box' }} />
            <button type="submit" className="btn-premium" style={{ width: '100%', padding: '12px' }}>Publish To Menu</button>
          </form>

          {/* List side */}
          <div style={{ minWidth: '280px' }}>
            <h3 style={{ color: 'white', marginTop: '0' }}>Active Stock Management</h3>
            <div style={{ background: '#2d1f16', padding: '15px', border: '1px solid rgba(188,150,108,0.2)' }}>
              {coffees.map((item, index) => (
                <div key={item._id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px dashed rgba(188,150,108,0.1)', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={item.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover' }} onError={e => e.target.src='/espresso.webp'} />
                    <div>
                      <span style={{ color: 'white', fontWeight: 'bold', display: 'block', fontSize: '14px' }}>{item.name}</span>
                      <span style={{ fontSize: '12px', color: '#bc966c' }}>${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</span>
                    </div>
                  </div>
                  <button style={{ background: '#ff6b6b', color: 'white', border: 'none', padding: '5px 12px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }} onClick={() => handleDeleteProduct(item._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PAID INVOICE SUCCESS SCREEN
  // ==========================================
  if (currentView === 'paid') {
    return (
      <div style={{ backgroundColor: '#1c140e', color: '#e6c594', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ background: '#2d1f16', padding: '40px 25px', border: '2px solid #bc966c', maxWidth: '500px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', color: 'white', margin: '0 0 10px 0' }}>Order Placed</h1>
          <p style={{ fontStyle: 'italic', color: '#bc966c', marginBottom: '25px' }}>"Your luxury brew is now processing."</p>
          <div style={{ background: '#1c140e', padding: '20px', border: '1px solid rgba(188, 150, 108, 0.2)', marginBottom: '25px', textAlign: 'left' }}>
            <p style={{ margin: '0 0 8px 0' }}><strong>Status:</strong> Dispatch Terminal Active</p>
            <p style={{ margin: '0' }}><strong>Total Paid:</strong> ${finalBill}</p>
          </div>
          <button className="btn-premium" style={{ width: '100%' }} onClick={() => { setCart([]); setCurrentView('home'); }}>Return to Lounge</button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: CHECKOUT / BILL SUMMARY PAGE
  // ==========================================
  if (currentView === 'checkout') {
    return (
      <div style={{ backgroundColor: '#1c140e', color: '#e6c594', minHeight: '100vh', padding: '30px 4%', boxSizing: 'border-box' }}>
        <h1 style={{ fontFamily: 'serif', color: 'white', textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Your Coffee Bill</h1>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#2d1f16', padding: '25px', border: '2px solid #bc966c', boxSizing: 'border-box' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p>Your shopping tray is empty.</p>
              <button className="btn-premium" onClick={() => setCurrentView('home')}>Go Add Coffee</button>
            </div>
          ) : (
            <>
              <h3 style={{ color: 'white', borderBottom: '1px solid #bc966c', paddingBottom: '10px', marginTop: '0' }}>Selected Brews</h3>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed rgba(188,150,108,0.2)', fontSize: '14px' }}>
                  <span>{item.name}</span>
                  <div>
                    <span style={{ marginRight: '10px', fontWeight: 'bold' }}>${item.price.toFixed(2)}</span>
                    <button style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '12px' }} onClick={() => removeFromCart(idx)}>Delete</button>
                  </div>
                </div>
              ))}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', padding: '12px', background: '#1c140e', boxSizing: 'border-box' }}>
                <span style={{ fontWeight: 'bold', color: 'white' }}>Grand Total:</span>
                <span style={{ fontWeight: 'bold', color: '#bc966c' }}>${calculateTotal()}</span>
              </div>

              <button className="btn-premium" style={{ width: '100%', marginTop: '25px', padding: '14px' }} onClick={() => { setFinalBill(calculateTotal()); setCurrentView('paid'); }}>
                Place Order & Pay
              </button>
              <button style={{ background: 'none', border: '1px solid #bc966c', color: '#bc966c', width: '100%', marginTop: '10px', padding: '10px', cursor: 'pointer', fontSize: '13px' }} onClick={() => setCurrentView('home')}>← Add More Items
              </button>
            </>
                )}
        </div>
      </div>
    );
  }
// ==========================================// VIEW 4: RESERVATION BOOKED VIEW// ======================================
if (currentView === 'booked') {
  return (
    <>
      <div style={{ backgroundColor: '#1c140e', color: '#e6c594', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px', boxSizing: 'border-box' }}>  
        {/* Agar is div ke andar kuch rakhna hai to yahan aayega */}
      </div>

      <div style={{ background: '#2d1f16', padding: '40px 25px', border: '2px solid #bc966c', maxWidth: '500px', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'serif', fontSize: '2rem', color: 'white' }}>
  Reservation Confirmed
</h1>

        <p style={{ fontStyle: 'italic', color: '#bc966c', margin: '10px 0 25px 0' }}>
          "Your sanctuary of calm roasts awaits."
        </p>
        <div style={{ background: '#1c140e', padding: '20px', textAlign: 'left', margin: '20px 0', fontSize: '14px' }}>
          <p style={{ margin: '0 0 8px 0' }}>Venue: Cafe Aura Lounge</p>
          <p style={{ margin: '0 0 8px 0' }}>Date: {bookingDetails?.date}</p>
          <p style={{ margin: '0' }}>Time: {bookingDetails?.time}</p>
        </div>
        <button className="btn-premium" style={{ width: '100%' }} onClick={() => setCurrentView('home')}>
          Back To Lounge
        </button>
      </div>
    </>        
   );
}

// ==========================================// VIEW 5: STANDARD MAIN LANDING VIEW (Responsive)// ==========================================
 return (
    <div style={{ backgroundColor: '#1c140e', color: '#e6c594', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar with Responsive Flex Wrapping */}
      <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '15px 4%', background: '#1c140e', borderBottom: '1px solid #2d1f16', gap: '10px' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#bc966c', letterSpacing: '1px' }}>CAFE AURA</div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button style={{ background: 'none', border: 'none', color: '#bc966c', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', padding: '5px' }} onClick={() => setCurrentView('admin')}>⚙️ Admin</button>
          
          <button style={{ background: '#2d1f16', border: '1px solid #bc966c', color: '#e6c594', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }} onClick={() => setCurrentView('checkout')}>
            🛒 Tray <span style={{ background: '#bc966c', color: '#1c140e', padding: '1px 6px', borderRadius: '50%', marginLeft: '3px', fontWeight: 'bold', fontSize: '11px' }}>{cart.length}</span>
          </button>
          
          <button className="btn-premium" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => setShowBooking(true)}>Book Table</button>
        </div>
      </nav>

      {/* Hero Header Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '40px 6%', gap: '30px', alignItems: 'center', justifyContent: 'center', flex: '1', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ flex: '1', minWidth: '280px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'white', margin: '0 0 15px 0', lineHeight: '1.2' }}>
            Awaken Your <span style={{ color: '#bc966c' }}>Senses With Every Sip</span>
          </h1>
          <p style={{ color: 'rgba(230, 197, 148, 0.8)', fontSize: '16px', lineHeight: '1.5', margin: '0' }}>
            Discover carefully selected premium blends crafted by expert baristas. Immerse yourself in our cozy atmosphere.
          </p>
        </div>
        
        <div style={{ flex: '0.8', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img src="/espresso.webp" alt="Hero Coffee" style={{ width: '100%', maxWidth: '280px', height: 'auto', borderRadius: '0 0 120px 120px', border: '4px solid #2d1f16', boxSizing: 'border-box' }} />
        </div>
      </div>

      {/* Dynamic Products Grid Section */}
      <div style={{ background: '#2d1f16', padding: '50px 4%', textAlign: 'center', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '28px', color: 'white', fontFamily: 'serif', marginBottom: '30px' }}>Our Signature Coffees</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {coffees.map((coffee, idx) => (
            <div key={idx} className="coffee-card" style={{ boxSizing: 'border-box', background: '#1c140e', padding: '15px', borderRadius: '8px', maxWidth: '300px', width: '100%' }}>
              <img src={coffee.image} alt={coffee.name} className="coffee-img" onError={(e) => { e.currentTarget.src = '/espresso.webp' }} style={{ width: '100%', height: 'auto' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <h3 style={{ color: 'white', margin: '0', fontSize: '18px' }}>{coffee.name}</h3>
                <span style={{ color: '#bc966c', fontWeight: 'bold' }}>
                  ${typeof coffee.price === 'number' ? coffee.price.toFixed(2) : coffee.price}
                </span>
              </div>
              
              <p style={{ color: 'rgba(230, 197, 148, 0.6)', fontSize: '13px', marginTop: '8px', lineHeight: '1.4', textAlign: 'left' }}>
                {coffee.description}
              </p>
              <button className="btn-premium" style={{ width: '100%', marginTop: '12px', fontSize: '12px', padding: '10px' }} onClick={() => addToCart(coffee)}>
                Add to Tray
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form Overlay Pop-up Modal */}
      {showBooking && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '999', padding: '15px', boxSizing: 'border-box' }}>
          <form onSubmit={handleBookingSubmit} style={{ background: '#1c140e', padding: '30px 25px', border: '2px solid #bc966c', width: '100%', maxWidth: '380px', position: 'relative', boxSizing: 'border-box' }}>
            <h2 style={{ color: 'white', marginTop: '0', fontSize: '1.5rem' }}>Reserve Your Table</h2>
            
            <label style={{ display: 'block', color: '#e6c594', marginBottom: '5px', fontSize: '14px' }}>Select Date:</label>
            <input type="date" name="date" required style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#2d1f16', border: '1px solid #bc966c', color: 'white', boxSizing: 'border-box' }} />
            
            <label style={{ display: 'block', color: '#e6c594', marginBottom: '5px', fontSize: '14px' }}>Select Time:</label>
            <input type="time" name="time" required style={{ width: '100%', padding: '10px', marginBottom: '20px', background: '#2d1f16', border: '1px solid #bc966c', color: 'white', boxSizing: 'border-box' }} />
            
            <button type="submit" className="btn-premium" style={{ width: '100%', padding: '12px' }}>Confirm Booking</button>
            
            <button type="button" style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', color: '#bc966c', fontSize: '22px', cursor: 'pointer' }} onClick={() => setShowBooking(false)}>×</button>
          </form>
        </div>
      )}

    </div>        
  );
};

export default App;