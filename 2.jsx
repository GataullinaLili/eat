```jsx
import React, { useState, useEffect } from "react";

const App = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("menu");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState({ name: "", group: "" });
  const [selectedCategory, setSelectedCategory] = useState("Все");

  // Mock data for menu
  const mockMenu = [
    {
      id: 1,
      name: "Куриный суп",
      category: "Супы",
      price: 120,
      image: "https://placehold.co/300x200/orange/white?text=Soup",
      available: true,
      description: "Традиционный куриный суп с лапшой и овощами",
    },
    {
      id: 2,
      name: "Паста Болоньезе",
      category: "Основные блюда",
      price: 180,
      image: "https://placehold.co/300x200/red/white?text=Pasta",
      available: true,
      description: "Спагетти с мясным соусом и пармезаном",
    },
    {
      id: 3,
      name: "Салат Цезарь",
      category: "Салаты",
      price: 150,
      image: "https://placehold.co/300x200/green/white?text=Salad",
      available: true,
      description: "Свежие листья салата, курица, сухарики, соус цезарь",
    },
    {
      id: 4,
      name: "Компот из яблок",
      category: "Напитки",
      price: 60,
      image: "https://placehold.co/300x200/brown/white?text=Compote",
      available: true,
      description: "Домашний компот из свежих яблок",
    },
    {
      id: 5,
      name: "Пирожное Эклер",
      category: "Десерты",
      price: 90,
      image: "https://placehold.co/300x200/pink/white?text=Eclair",
      available: true,
      description: "Воздушное пирожное с заварным кремом",
    },
    {
      id: 6,
      name: "Гречневая каша с мясом",
      category: "Основные блюда",
      price: 160,
      image: "https://placehold.co/300x200/darkbrown/white?text=Buckwheat",
      available: true,
      description: "Гречка с тушеным мясом и овощами",
    },
  ];

  useEffect(() => {
    setMenu(mockMenu);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = () => {
    if (!user.name || !user.group) {
      alert("Пожалуйста, укажите ваше имя и группу");
      return;
    }
    
    if (cart.length === 0) {
      alert("Ваша корзина пуста");
      return;
    }
    
    // Show confirmation dialog
    if (window.confirm("Вы точно хотите сделать заказ?")) {
      const newOrder = {
        id: Date.now(),
        user: { ...user },
        items: [...cart],
        total: getTotalPrice(),
        time: currentTime.toLocaleString(),
        pickupTime: new Date(currentTime.getTime() + 30 * 60000).toLocaleString(), // 30 minutes later
        status: "Заказ принят"
      };
      
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setActiveTab("orders");
      alert("Ваш заказ успешно оформлен! Подойдите к стойке в указанное время.");
    }
  };

  const categories = ["Все", ...new Set(menu.map(item => item.category))];

  // Filter menu based on selected category
  const filteredMenu = selectedCategory === "Все" 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Столовая Института</h1>
          <div className="text-sm text-blue-200">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
        <p className="text-blue-100 text-sm mt-1">Заказывайте заранее - экономьте время!</p>
      </header>

      {/* User Info Form */}
      {!user.name && (
        <div className="bg-white m-4 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Добро пожаловать!</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Ваше имя"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Ваша группа/факультет"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setUser(prev => ({ ...prev, group: e.target.value }))}
            />
            <button
              onClick={() => user.name && user.group && setActiveTab("menu")}
              disabled={!user.name || !user.group}
              className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-gray-300"
            >
              Начать заказ
            </button>
          </div>
        </div>
      )}

      {user.name && (
        <>
          {/* Navigation Tabs */}
          <div className="flex bg-white border-b border-gray-200">
            {[
              { id: "menu", label: "Меню", icon: "🍽️" },
              { id: "cart", label: "Корзина", icon: "🛒" },
              { id: "orders", label: "Мои заказы", icon: "📋" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-3 text-center font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Menu Tab */}
          {activeTab === "menu" && (
            <div className="p-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-3">Категории</h2>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-300 hover:bg-blue-50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <h2 className="text-xl font-bold mb-3">Доступные блюда</h2>
              {filteredMenu.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-gray-500">Нет блюд в выбранной категории</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredMenu.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <span className="text-blue-600 font-bold">{item.price} ₽</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Категория: {item.category}</p>
                        <button
                          onClick={() => addToCart(item)}
                          disabled={!item.available}
                          className="w-full mt-3 bg-blue-600 text-white py-2 rounded disabled:bg-gray-300"
                        >
                          {item.available ? "Добавить в заказ" : "Недоступно"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cart Tab */}
          {activeTab === "cart" && (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Ваш заказ</h2>
              
              {cart.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-gray-500">Ваша корзина пуста</p>
                  <button
                    onClick={() => setActiveTab("menu")}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Выбрать блюда
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600">{item.price} ₽</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-white p-4 rounded-lg shadow mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Итого:</span>
                      <span>{getTotalPrice()} ₽</span>
                    </div>
                    <button
                      onClick={placeOrder}
                      className="w-full mt-4 bg-green-600 text-white py-3 rounded font-bold"
                    >
                      Оформить заказ
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">История заказов</h2>
              
              {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-gray-500">У вас пока нет заказов</p>
                  <button
                    onClick={() => setActiveTab("menu")}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Сделать первый заказ
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">Заказ #{order.id}</h3>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {order.user.name} ({order.user.group})
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        Оформлен: {order.time}<br />
                        Забрать после: {order.pickupTime}
                      </p>
                      <div className="space-y-2 mb-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span>{item.price * item.quantity} ₽</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Итого:</span>
                        <span>{order.total} ₽</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-4 text-center text-sm mt-8">
        <p>Столовая Института © {currentTime.getFullYear()}</p>
        <p className="mt-1">Забирайте заказы в течение 30 минут после указанного времени</p>
      </footer>
    </div>
  );
};

export default App;
```
