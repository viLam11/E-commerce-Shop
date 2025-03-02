# 🛒 Hệ Thống Thương Mại Điện Tử - Mua Sắm Thiết Bị Điện Tử Trực Tuyến  

![E-Commerce Banner](https://source.unsplash.com/1200x400/?shopping,technology)  

## 📌 Giới Thiệu  
Đây là một nền tảng thương mại điện tử cho phép người dùng mua sắm các thiết bị điện tử trực tuyến một cách tiện lợi và nhanh chóng. Hệ thống cung cấp đầy đủ tính năng cho cả người mua và người bán, giúp quản lý sản phẩm, đơn hàng, thanh toán, và vận chuyển một cách hiệu quả.  

---

## 🎯 Tính Năng Chính  

### 🛍️ Đối với Người Mua  
- Xem danh mục sản phẩm theo thương hiệu, danh mục, giá, đánh giá, v.v.  
- Tìm kiếm sản phẩm nhanh chóng với bộ lọc nâng cao.  
- Đặt hàng.  
- Theo dõi trạng thái đơn hàng theo thời gian thực.  
- Đánh giá và bình luận về sản phẩm đã mua.  

### 🏪 Đối với Người Bán  
- Thêm, chỉnh sửa, xóa sản phẩm trên cửa hàng cá nhân.  
- Quản lý đơn hàng, theo dõi trạng thái vận chuyển.  

---

## 🛠️ Công Nghệ Sử Dụng  
- **Backend:** Node.js, Express.js  
- **Frontend:** React.js, Tailwind CSS  
- **Database:** PostgreSQL

---

## 📷 Giao Diện Demo  
![Product Page](https://source.unsplash.com/800x400/?laptop,ecommerce)  
![Checkout Page](https://source.unsplash.com/800x400/?payment,shopping)  

---

## 🚀 Cài Đặt & Chạy Dự Án  

### 1️⃣ Clone dự án  
```bash
git clone https://github.com/viLam11/E-commerce-Shop.git
cd E-commerce-Shop
### 2️⃣ Cài đặt cơ sơ dữ liệu
Tạo các table trong ./backend/migrations/init-users.sql
### 3️⃣ Tải packages 
-- bash
cd backend
npm install
cd frontend
npm install
### 4️⃣ Chạy chương trình
Backend: npm start
Frontend: npm run dev