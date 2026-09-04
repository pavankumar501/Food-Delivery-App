# 🍕 Food Delivery App (FoodieHub)

A Zomato-style food ordering platform.

## ✨ Features

- **Restaurant Discovery** - 8 restaurants, cuisine filters
- **Menu Browsing** - 55+ Indian dishes with veg/non-veg badges
- **Cart Management** - Add items, quantity, total
- **Order Placing** - Address & payment method
- **Order Tracking** - Status steps (Placed → Delivered)
- **Ratings** - Rate delivered orders
- **Admin Dashboard** - Restaurants, orders, stats
- **Bestsellers** - Highlighted popular items

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

## 🚀 Quick Start

```bash
cd backend && npm install && node seed.js && npm start    # Port 5004
cd frontend && npm install && npm run dev                 # Port 5173
```

## 🔑 Demo Accounts

- Admin: `admin@foodie.com` / `admin123`
- Customer: `john@example.com` / `customer123`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/restaurants` | List restaurants |
| GET | `/api/restaurants/:id` | Restaurant detail |
| GET | `/api/menu/:restaurantId` | Menu items |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my` | My orders |

## 👨‍💻 Author

[Pavan Kumar](https://github.com/pavankumar501)