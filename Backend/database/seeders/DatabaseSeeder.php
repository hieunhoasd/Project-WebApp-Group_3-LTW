<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. SEED DATA CHO BẢNG USERS
        DB::table('users')->insert([
            [
                'firstname' => 'Hệ thống',
                'lastname' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('123456'),
                'phone' => '0362476791',
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'firstname' => 'Nguyễn Văn',
                'lastname' => 'User',
                'email' => 'user@gmail.com',
                'password' => Hash::make('123456'),
                'phone' => '0868150306',
                'role' => 'customer',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 2. SEED DATA CHO BẢNG CATEGORIES (5 danh mục theo yêu cầu mới)
        $categories = [
            ['id' => 1, 'name' => 'Áo Jean', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Đồ Thể Thao', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Áo Sơ Mi', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Quần Jean', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Áo Thun', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('categories')->insert($categories);

        // 3. SEED DATA CHO BẢNG PRODUCTS (10 sản phẩm/danh mục x 5 danh mục = 50 sản phẩm)
        $products = [
            // --- DANH MỤC 1: ÁO JEAN (10 sản phẩm) ---
            [
                'category_id' => 1,
                'name' => 'Áo Khoác Jean Nam Classic Blue',
                'price' => 450000,
                'image' => 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400',
                'description' => 'Chất liệu denim dày dặn, form dáng basic dễ phối đồ.',
                'quantity' => 30,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 1,
                'name' => 'Áo Khoác Jean Rách Phong Cách Khói',
                'price' => 490000,
                'image' => 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=400',
                'description' => 'Thiết kế cào rách cá tính, màu xám khói bụi bặm đường phố.',
                'quantity' => 25,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 1,
                'name' => 'Áo Sơ Mi Jean Nam Slimfit Denim',
                'price' => 350000,
                'image' => 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=400',
                'description' => 'Vải jean giấy mỏng nhẹ, thấm hút mồ hôi tốt, tôn dáng người mặc.',
                'quantity' => 40,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 1,
                'name' => 'Áo Khoác Jean Nữ Oversize Hàn Quốc',
                'price' => 420000,
                'image' => 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400',
                'description' => 'Form rộng thoải mái cho các bạn nữ năng động, mix cùng chân váy siêu xinh.',
                'quantity' => 50,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 1,
                'name' => 'Áo Khoác Jean Lót Lông Cừu Mùa Đông',
                'price' => 650000,
                'image' => 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=400',
                'description' => 'Lớp lót lông cừu nhân tạo siêu ấm áp bên trong, giữ nhiệt tốt.',
                'quantity' => 15,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 1,
                'name' => 'Áo Jean Gilet Sát Nách Unisex',
                'price' => 320000,
                'image' => 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=400',
                'description' => 'Áo ghi lê jean không tay phối ngoài áo thun cực kỳ năng động.',
                'quantity' => 35,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 1,
                'name' => 'Áo Khoác Jean Đen Tuyền Minimalist',
                'price' => 460000,
                'image' => 'https://images.unsplash.com/photo-1525450824231-13c29d77de45?q=80&w=400',
                'description' => 'Màu đen tuyền không phai vải, khuy bấm kim loại cao cấp.',
                'quantity' => 20,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 1,
                'name' => 'Áo Khoác Jean Nữ Croptop Cá Tính',
                'price' => 380000,
                'image' => 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=400',
                'description' => 'Dáng ngắn hack chiều cao hiệu quả cho phái nữ.',
                'quantity' => 45,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 1,
                'name' => 'Áo Khoác Jean Phối Sọc Tay Streetwear',
                'price' => 480000,
                'image' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400',
                'description' => 'Điểm nhấn sọc trắng chạy dọc hai bên tay áo cá tính độc lạ.',
                'quantity' => 18,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 1,
                'name' => 'Áo Sơ Mi Jean Nữ Thêu Hoa',
                'price' => 370000,
                'image' => 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?q=80&w=400',
                'description' => 'Họa tiết thêu hoa nhỏ tỉ mỉ trước ngực tạo nét nữ tính trên nền vải jean.',
                'quantity' => 30,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],

            // --- DANH MỤC 2: ĐỒ THỂ THAO (10 sản phẩm) ---
            [
                'category_id' => 2,
                'name' => 'Bộ Quần Áo Thể Thao Nam Velora Pro',
                'price' => 350000,
                'image' => 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=400',
                'description' => 'Set đồ thun lạnh co giãn 4 chiều, chuyên dụng tập gym và chạy bộ.',
                'quantity' => 50,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 2,
                'name' => 'Áo Tank Top Tập Gym Nam Thoáng Khí',
                'price' => 180000,
                'image' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400',
                'description' => 'Thiết kế khoét nách sâu thoải mái vận động cơ bắp nặng.',
                'quantity' => 60,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 2,
                'name' => 'Áo Khoác Gió Nữ Chống Nước Aero',
                'price' => 450000,
                'image' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400',
                'description' => 'Vải gió dù dù cao cấp cản gió tốt, trượt nước khi mưa nhỏ.',
                'quantity' => 40,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 2,
                'name' => 'Quần Short Gym Nam 2 Lớp Co Giãn',
                'price' => 230000,
                'image' => 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=400',
                'description' => 'Có lớp quần đùi bó cơ bên trong chống lộ hàng và có túi giấu điện thoại.',
                'quantity' => 55,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 2,
                'name' => 'Quần Legging Nữ Cạp Cao Nâng Mông',
                'price' => 290000,
                'image' => 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=400',
                'description' => 'Chất vải dệt dày dặn ôm fit cơ thể, tôn dáng mông trái đào.',
                'quantity' => 70,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 2,
                'name' => 'Áo Croptop Tập Yoga Nữ AirGym',
                'price' => 220000,
                'image' => 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400',
                'description' => 'Chất liệu co giãn ôm sát, thấm hút mồ hôi siêu tốc.',
                'quantity' => 45,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 2,
                'name' => 'Áo Bra Tập Gym Đan Dây Lưng',
                'price' => 240000,
                'image' => 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400',
                'description' => 'Thiết kế dây lưng đan chéo thời trang, nâng đỡ tốt vòng một.',
                'quantity' => 50,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 2,
                'name' => 'Quần Jogger Thể Thao Nam Nỉ Chun',
                'price' => 360000,
                'image' => 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400',
                'description' => 'Ống quần bo gọn gàng, phù hợp mặc giữ ấm mùa đông hoặc đi chạy.',
                'quantity' => 35,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 2,
                'name' => 'Áo Thun Phản Quang Chạy Bộ Đêm',
                'price' => 270000,
                'image' => 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=400',
                'description' => 'Tích hợp các dải phản quang phát sáng giúp bạn an toàn khi chạy đêm.',
                'quantity' => 40,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 2,
                'name' => 'Quần Shorts Nữ Tập Cầu Lông 2 Lớp',
                'price' => 195000,
                'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400',
                'description' => 'Mỏng nhẹ linh hoạt cho các bước di chuyển sải chân nhanh trên sân đấu.',
                'quantity' => 65,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],

            // --- DANH MỤC 3: ÁO SƠ MI (10 sản phẩm) ---
            [
                'category_id' => 3,
                'name' => 'Áo Sơ Mi Trắng Công Sở Oxford',
                'price' => 320000,
                'image' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400',
                'description' => 'Chất vải sợi tre Bamboo chống nhăn chống nhàu cao cấp.',
                'quantity' => 80,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 3,
                'name' => 'Áo Sơ Mi Kẻ Caro Flannel Unisex',
                'price' => 380000,
                'image' => 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=400',
                'description' => 'Họa tiết kẻ caro đỏ đen thời thượng, chất nỉ bông mỏng mềm mại.',
                'quantity' => 45,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 3,
                'name' => 'Áo Sơ Mi Nam Họa Tiết Cuban Shirt',
                'price' => 350000,
                'image' => 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400',
                'description' => 'Cổ bẻ lật lãng tử mang phong cách phóng khoáng đi biển dạo phố.',
                'quantity' => 30,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 3,
                'name' => 'Áo Sơ Mi Lụa Hàn Quốc Trơn Bóng',
                'price' => 290000,
                'image' => 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=400',
                'description' => 'Chất lụa mềm mát, rủ dáng nhẹ nhàng tôn lên nét lịch lãm.',
                'quantity' => 50,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 3,
                'name' => 'Áo Sơ Mi Nữ Cổ Đức Form Rộng',
                'price' => 280000,
                'image' => 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?q=80&w=400',
                'description' => 'Thiết kế thanh lịch, dễ phối cùng quần âu đi làm đi học.',
                'quantity' => 60,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 3,
                'name' => 'Áo Sơ Mi Đen Cổ Tàu Nam Kín Đáo',
                'price' => 310000,
                'image' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400',
                'description' => 'Cổ trụ sang trọng độc đáo lịch sự, hạn chế bám bụi bẩn.',
                'quantity' => 40,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 3,
                'name' => 'Áo Sơ Mi Kẻ Sọc Tăm Nhỏ Slimfit',
                'price' => 340000,
                'image' => 'https://images.unsplash.com/photo-1621072156002-e2fcc103e889?q=80&w=400',
                'description' => 'Họa tiết kẻ dọc giúp hack dáng thon gọn nam tính chuẩn soái ca.',
                'quantity' => 35,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 3,
                'name' => 'Áo Sơ Mi Vải Đũi Linen Mùa Hè',
                'price' => 330000,
                'image' => 'https://images.unsplash.com/photo-1563630423918-b58f07298ac9?q=80&w=400',
                'description' => 'Sợi đũi linen tự nhiên siêu thoáng mát nhẹ tênh khi mặc.',
                'quantity' => 55,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 3,
                'name' => 'Áo Sơ Mi Nữ Voan Tơ Thắt Nơ Cổ',
                'price' => 360000,
                'image' => 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400',
                'description' => 'Chất voan tơ cao cấp thắt nơ điệu đà, tiểu thư thanh lịch.',
                'quantity' => 25,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 3,
                'name' => 'Áo Sơ Mi Denim Nam Bụi Bặm Nhật Bản',
                'price' => 390000,
                'image' => 'https://images.unsplash.com/photo-1588359551462-a5241e5412d2?q=80&w=400',
                'description' => 'Phong cách vintage mộc mạc cổ điển đặc trưng của thời trang Nhật Bản.',
                'quantity' => 20,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],

            // --- DANH MỤC 4: QUẦN JEAN (10 sản phẩm) ---
            [
                'category_id' => 4,
                'name' => 'Quần Jean Nam Dáng Suông Straight Fit',
                'price' => 480000,
                'image' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400',
                'description' => 'Ống suông đứng chuẩn mực tạo cảm giác kéo dài chân tôn dáng.',
                'quantity' => 50,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 4,
                'name' => 'Quần Jean Skinner Co Giãn Cao Cấp',
                'price' => 450000,
                'image' => 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400',
                'description' => 'Form ôm slim skinny co giãn tốt thoải mái vận động cả ngày.',
                'quantity' => 45,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 4,
                'name' => 'Quần Jean Nữ Cạp Cao Ống Rộng Baggy',
                'price' => 390000,
                'image' => 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=400',
                'description' => 'Cạp siêu cao che khuyết điểm vòng 2, ống rộng chuẩn trend Hàn Quốc.',
                'quantity' => 60,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 4,
                'name' => 'Quần Jean Rách Gối Gối Phá Cách Biker',
                'price' => 520000,
                'image' => 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=400',
                'description' => 'Chi tiết rách gối táo bạo, chất denim thô nguyên bản cực ngầu.',
                'quantity' => 30,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 4,
                'name' => 'Quần Jean Đen Trơn Basic Công Sở',
                'price' => 430000,
                'image' => 'https://images.unsplash.com/photo-1525450824231-13c29d77de45?q=80&w=400',
                'description' => 'Màu đen nhuộm cao cấp khó phai, có thể mặc đi làm thay quần tây lịch sự.',
                'quantity' => 55,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 4,
                'name' => 'Quần Short Jean Nam Denim Shorts',
                'price' => 290000,
                'image' => 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=400',
                'description' => 'Quần đùi jean ngang gối tiện lợi, mát mẻ năng động ngày hè.',
                'quantity' => 70,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 4,
                'name' => 'Quần Jean Nữ Ống Loe Retro Vintage',
                'price' => 410000,
                'image' => 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?q=80&w=400',
                'description' => 'Ống loe nhẹ phần gấu quần giúp tạo hiệu ứng đôi chân dài quyến rũ.',
                'quantity' => 40,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 4,
                'name' => 'Quần Jean Jogger Cạp Chun Tiện Lợi',
                'price' => 380000,
                'image' => 'https://images.unsplash.com/photo-1517438476312-10d79c019349?q=80&w=400',
                'description' => 'Cạp thun co giãn có dây buộc kết hợp bo gấu chân thể thao.',
                'quantity' => 35,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 4,
                'name' => 'Quần Jean Xám Khói Wash Sáng',
                'price' => 470000,
                'image' => 'https://images.unsplash.com/photo-1584273143981-44c21049c611?q=80&w=400',
                'description' => 'Công nghệ wash màu xám axit độc lạ, không đụng hàng.',
                'quantity' => 25,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 4,
                'name' => 'Quần Short Jean Nữ Gấu Tua Rua',
                'price' => 260000,
                'image' => 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=400',
                'description' => 'Thiết kế gấu cắt tua rua trẻ trung phá cách cho các bạn nữ đi biển.',
                'quantity' => 80,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],

            // --- DANH MỤC 5: ÁO THUN (10 sản phẩm) ---
            [
                'category_id' => 5,
                'name' => 'Áo Thun Trơn Cổ Tròn Cotton 100%',
                'price' => 150000,
                'image' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400',
                'description' => 'Sợi cotton tự nhiên 100% mềm mịn, thấm mồ hôi cực đỉnh không xù lông.',
                'quantity' => 150,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 5,
                'name' => 'Áo Thun Oversize Local Brand Graphic',
                'price' => 250000,
                'image' => 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=400',
                'description' => 'Form rộng tay lỡ in hình graphic sắc nét công nghệ chuyển nhiệt cao cấp.',
                'quantity' => 90,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 5,
                'name' => 'Áo Polo Nam Cổ Bẻ Lịch Lãm',
                'price' => 290000,
                'image' => 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=400',
                'description' => 'Vải cá sấu pique dệt mắt chim sang trọng, lên form đứng dáng đứng ngực.',
                'quantity' => 60,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 5,
                'name' => 'Áo Thun Nữ Croptop ôm Body',
                'price' => 140000,
                'image' => 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400',
                'description' => 'Chất thun gân co giãn khoe trọn đường cong thắt eo thon gọn quyến rũ.',
                'quantity' => 100,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 5,
                'name' => 'Áo Thun Unisex Sọc Ngang Đen Trắng',
                'price' => 180000,
                'image' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400',
                'description' => 'Họa tiết sọc ngang cổ điển không lỗi mốt dễ mặc cả nam và nữ.',
                'quantity' => 85,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 5,
                'name' => 'Áo Thun Cổ V Nam Sợi Modal Gỗ Sồi',
                'price' => 220000,
                'image' => 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=400',
                'description' => 'Sợi vải sinh học làm từ gỗ sồi siêu mát lạnh sờ sướng tay.',
                'quantity' => 50,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 5,
                'name' => 'Áo Thun Dài Tay Raglan Phối Màu',
                'price' => 210000,
                'image' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400',
                'description' => 'Thiết kế tay áo khác màu thân áo phong cách bóng chày năng động.',
                'quantity' => 45,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 5,
                'name' => 'Áo Thun In Chữ Slogan Sáng Tạo',
                'price' => 170000,
                'image' => 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=400',
                'description' => 'Dòng chữ in nổi tinh tế mang thông điệp ý nghĩa truyền cảm hứng.',
                'quantity' => 70,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 5,
                'name' => 'Áo Thun Henly Cổ Khuy Bấm Vintage',
                'price' => 240000,
                'image' => 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=400',
                'description' => 'Thiết kế hàng khuy trước ngực nam tính cổ điển đậm chất phương Tây.',
                'quantity' => 40,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 5,
                'name' => 'Áo Thun Wash Loang Màu Tie Dye',
                'price' => 260000,
                'image' => 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=400',
                'description' => 'Màu sắc loang lổ nghệ thuật rực rỡ cá tính độc quyền cho mùa hè sôi động.',
                'quantity' => 30,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ];

        DB::table('products')->insert($products);
    }
}
