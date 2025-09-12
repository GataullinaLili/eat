```jsx
import React, { useState, useEffect } from "react";

const App = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("menu");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [role, setRole] = useState(null);
  const [notifications, setNotifications] = useState([]);

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

  // Add notification
  const addNotification = (message) => {
    const notification = {
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString(),
    };
    setNotifications(prev => [notification, ...prev]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

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
    if (!user || !user.name) {
      alert("Пожалуйста, укажите ваше имя");
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
        status: "Готовится",
        studentId: role === "student" ? user.id : null
      };
      
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setActiveTab("orders");
      addNotification("Ваш заказ успешно оформлен! Ожидайте уведомления о готовности.");
    }
  };

  const markOrderAsReady = (orderId) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: "Готово" } 
          : order
      )
    );
    
    // Find the student who made this order and send notification
    const order = orders.find(o => o.id === orderId);
    if (order && order.studentId) {
      addNotification(`Ваш заказ #${orderId} готов к выдаче!`);
    }
    
    alert("Заказ отмечен как готовый");
  };

  const categories = ["Все", ...new Set(menu.map(item => item.category))];

  // Filter menu based on selected category
  const filteredMenu = selectedCategory === "Все" 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  // Login component
  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Столовая Института</h1>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={() => setRole("student")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Войти как студент
            </button>
            <button
              onClick={() => setRole("cook")}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Войти как повар
            </button>
          </div>
          
          {role === null && (
            <div className="text-center text-gray-600 text-sm">
              <p>Выберите роль для входа в систему</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Student registration form
  if (role === "student" && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Регистрация студента</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ваше имя"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value, id: Date.now() }))}
            />
            <input
              type="text"
              placeholder="Ваша группа/факультет"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setUser(prev => ({ ...prev, group: e.target.value }))}
            />
            <button
              onClick={() => user?.name && setActiveTab("menu")}
              disabled={!user?.name}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
            >
              Начать заказ
            </button>
            <button
              onClick={() => {
                setRole(null);
                setUser(null);
              }}
              className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-400 transition mt-2"
            >
              Назад к выбору роли
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cook login (no additional info needed)
  if (role === "cook" && !user) {
    setUser({ name: "Повар", role: "cook" });
    setActiveTab("kitchen");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Столовая Института</h1>
          <div className="text-right">
            <div className="text-sm text-blue-200">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-xs text-blue-100">
              {role === "student" ? `Студент: ${user?.name}` : "Режим повара"}
            </div>
          </div>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          {role === "student" 
            ? "Заказывайте заранее - экономьте время!" 
            : "Управляйте заказами студентов"}
        </p>
      </header>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className="bg-green-500 text-white p-3 rounded-lg shadow-lg animate-fade-in"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm">{notification.message}</p>
                <button 
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="text-white ml-2 text-xs font-bold"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-green-100 mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex bg-white border-b border-gray-200">
        {role === "student" ? (
          <>
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex-1 p-3 text-center font-medium ${
                activeTab === "menu"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              🍽️ Меню
            </button>
            <button
              onClick={() => setActiveTab("cart")}
              className={`flex-1 p-3 text-center font-medium ${
                activeTab === "cart"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              🛒 Корзина
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 p-3 text-center font-medium ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📋 Мои заказы
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab("kitchen")}
            className={`flex-1 p-3 text-center font-medium ${
              activeTab === "kitchen"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            👨‍🍳 Кухня
          </button>
        )}
        <button
          onClick={() => {
            setRole(null);
            setUser(null);
            setCart([]);
            setActiveTab("menu");
          }}
          className="p-3 text-center font-medium text-red-600 hover:bg-red-50"
        >
          🚪 Выход
        </button>
      </div>

      {/* Menu Tab (Student) */}
      {role === "student" && activeTab === "menu" && (
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

      {/* Cart Tab (Student) */}
      {role === "student" && activeTab === "cart" && (
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

      {/* Orders Tab (Student) */}
      {role === "student" && activeTab === "orders" && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Мои заказы</h2>
          
          {orders.filter(order => order.studentId === user?.id).length === 0 ? (
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
              {orders
                .filter(order => order.studentId === user?.id)
                .map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">Заказ #{order.id}</h3>
                      <span className={`text-sm px-2 py-1 rounded ${
                        order.status === "Готово" 
                          ? "bg-green-100 text-green-800" 
                          : order.status === "Готовится"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {order.user.name} ({order.user.group})
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Оформлен: {order.time}<br />
                      {order.status === "Готово" 
                        ? "Готов к выдаче!" 
                        : `Забрать после: ${order.pickupTime}`}
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

      {/* Kitchen Tab (Cook) */}
      {role === "cook" && activeTab === "kitchen" && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Заказы на кухне</h2>
          
          {orders.filter(order => order.status !== "Выдан").length === 0 ? (
            <div className="bg-white p-8 rounded-lg text-center">
              <p className="text-gray-500">Нет активных заказов</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders
                .filter(order => order.status !== "Выдан")
                .map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">Заказ #{order.id}</h3>
                      <span className={`text-sm px-2 py-1 rounded ${
                        order.status === "Готово" 
                          ? "bg-green-100 text-green-800" 
                          : order.status === "Готовится"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {order.user.name} ({order.user.group})
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Оформлен: {order.time}
                    </p>
                    <div className="space-y-2 mb-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{item.price * item.quantity} ₽</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold mb-3">
                      <span>Итого:</span>
                      <span>{order.total} ₽</span>
                    </div>
                    
                    {order.status !== "Готово" && (
                      <button
                        onClick={() => markOrderAsReady(order.id)}
                        className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
                      >
                        Отметить как готовый
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-4 text-center text-sm mt-8">
        <p>Столовая Института © {currentTime.getFullYear()}</p>
        {role === "student" && (
          <p className="mt-1">Забирайте заказы в течение 30 минут после готовности</p>
        )}
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
```
