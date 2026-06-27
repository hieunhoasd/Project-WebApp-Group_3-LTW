<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Tránh lỗi khóa ngoại khi chạy lại seeder nhiều lần bằng cách xóa sạch bảng cũ
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('comments')->truncate();
        DB::table('products')->truncate();
        DB::table('categories')->truncate();
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // ==============================================================
        // 1. TẠO TÀI KHOẢN (2 ADMIN + 10 USERS) - ROLE DẠNG CHỮ
        // ==============================================================
        $passwordHash = Hash::make('123456');

        // Tạo 2 Admin
        DB::table('users')->insert([
            [
                'firstname' => 'Quản trị',
                'lastname' => 'Hệ thống 1',
                'email' => 'admin1@gmail.com',
                'password' => $passwordHash,
                'role' => 'admin', // 🌟 Đã sửa thành chữ 'admin'
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'firstname' => 'Quản trị',
                'lastname' => 'Hệ thống 2',
                'email' => 'admin2@gmail.com',
                'password' => $passwordHash,
                'role' => 'admin', // 🌟 Đã sửa thành chữ 'admin'
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // Tạo 10 Khách hàng (User) mẫu
        $firstnames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
        $lastnames = ['Văn An', 'Thị Bình', 'Minh Chiến', 'Hồng Danh', 'Thành Đạt', 'Khánh Huyền', 'Tuấn Kiệt', 'Bảo Ngọc', 'Hoàng Nam', 'Thúy Vy'];

        $userIds = [];
        for ($i = 0; $i < 10; $i++) {
            $userIds[] = DB::table('users')->insertGetId([
                'firstname' => $firstnames[$i],
                'lastname' => $lastnames[$i],
                'email' => 'user' . ($i + 1) . '@gmail.com',
                'password' => $passwordHash,
                'role' => 'user', // 🌟 Đã sửa thành chữ 'user'
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now(),
            ]);
        }

        // ==============================================================
        // 2. TẠO DANH MỤC THỜI TRANG (Nếu bạn chọn Cách 2 - bỏ slug)
        // ==============================================================
        $categories = [
            ['name' => 'Quần nam'],
            ['name' => 'Áo nam'],
            ['name' => 'Quần nữ'],
            ['name' => 'Áo nữ'],
            ['name' => 'Phụ kiện'],
        ];

        $categoryIds = [];
        foreach ($categories as $cat) {
            $categoryIds[$cat['name']] = DB::table('categories')->insertGetId([
                'name' => $cat['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ==============================================================
        // 3. TẠO 100 SẢN PHẨM KHỚP ẢNH VỚI TÊN GỌI
        // ==============================================================
        $images = [
            'Quần nam' => [
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1602243532650-ef9a6a49f52a?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1517423738875-5ce310acd3da?w=600&auto=format&fit=crop&q=80',
            ],
            'Áo nam' => [
                'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
            ],
            'Quần nữ' => [
                'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&auto=format&fit=crop&q=80',
            ],
            'Áo nữ' => [
                'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
            ],
            'Phụ kiện' => [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
            ]
        ];

        $adjectives = ['Cao Cấp', 'Hàn Quốc', 'Thời Trang', 'Cá Tính', 'Thanh Lịch', 'Năng Động', 'Sành Điệu', 'Basic', 'Dạo Phố', 'Công Sở'];
        $productTypes = [
            'Quần nam' => ['Quần Jean Slimfit', 'Quần Tây Âu Luxury', 'Quần Kaki Ống Đứng', 'Quần Short Thể Thao'],
            'Áo nam' => ['Áo Sơ Mi Dài Tay', 'Áo Polo Oxford', 'Áo Thun Cotton', 'Áo Hoodie Streetwear'],
            'Quần nữ' => ['Quần Baggy Tôn Dáng', 'Quần Culottes Ống Rộng', 'Quần Skinny Jeans', 'Quần Short Cạp Cao'],
            'Áo nữ' => ['Áo Kiểu Croptop', 'Áo Sơ Mi Voan Silk', 'Áo Blazer Trendy', 'Áo Thun Oversize'],
            'Phụ kiện' => ['Đồng Hồ Quartz Chrono', 'Túi Xách Toát Lên Khí Chất', 'Ví Da Bò Nguyên Tấm', 'Kính Mát Chống UV']
        ];

        $productIds = [];

        foreach ($productTypes as $catName => $types) {
            for ($i = 1; $i <= 20; $i++) {
                $type = $types[array_rand($types)];
                $adj = $adjectives[array_rand($adjectives)];
                $productName = $type . ' ' . $adj . ' Mã M' . rand(100, 999);

                $imgKey = array_search($type, $types);
                $productImg = $images[$catName][$imgKey] ?? $images[$catName][0];

                $productIds[] = DB::table('products')->insertGetId([
                    'category_id' => $categoryIds[$catName],
                    'name' => $productName,
                    'image' => $productImg,
                    'price' => rand(15, 85) * 10000,
                    'quantity' => rand(5, 120),
                    'description' => "Sản phẩm $productName được sản xuất từ chất liệu vải thượng hạng, thoáng mát, thấm hút mồ hôi tốt.",
                    'created_at' => now()->subDays(rand(1, 15)),
                    'updated_at' => now(),
                ]);
            }
        }

        // ==============================================================
        // 4. TỰ ĐỘNG BƠM BÌNH LUẬN & ĐÁNH GIÁ (COMMENTS)
        // ==============================================================
        $sampleComments = [
            5 => ['Sản phẩm rất đẹp, đóng gói cẩn thận, sẽ ủng hộ shop tiếp', 'Vải mặc mát lắm nha mọi người, form chuẩn hình 5 sao', 'Giao hàng siêu nhanh, chất lượng tuyệt vời vượt mong đợi'],
            4 => ['Hàng oke lắm nha, mặc vừa vặn thoải mái, mỗi tội giao hàng hơi lâu', 'Chất lượng sản phẩm tốt, đúng mô tả, đáng tiền mua'],
            3 => ['Sản phẩm ở mức tạm ổn, vải hơi mỏng một chút so với kỳ vọng', 'Giao đúng mẫu mã nhưng form hơi rộng chút xíu đối với mình'],
        ];

        for ($i = 0; $i < 150; $i++) {
            $randomRating = rand(3, 5);
            $contentArray = $sampleComments[$randomRating];
            $randomContent = $contentArray[array_rand($contentArray)];

            DB::table('comments')->insert([
                'user_id' => $userIds[array_rand($userIds)],
                'product_id' => $productIds[array_rand($productIds)],
                'content' => $randomContent,
                'rating' => $randomRating,
                'created_at' => now()->subDays(rand(0, 10))->subHours(rand(1, 23)),
                'updated_at' => now(),
            ]);
        }
    }
}
