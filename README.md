# 🎮 Xây Dựng Trò Chơi Trên Điện Thoại

Dự án xây dựng một trò chơi di động (mobile game) hoàn chỉnh chạy trên nền tảng **Android**, từ khâu lên ý tưởng, thiết kế, lập trình, kiểm thử cho đến đóng gói sản phẩm (APK).

## 📖 Giới thiệu

Trong bối cảnh thị trường ứng dụng di động ngày càng phát triển, game di động là một trong những lĩnh vực thu hút đông đảo người dùng và có tốc độ tăng trưởng nhanh. Dự án là cơ hội để nhóm sinh viên vận dụng kiến thức đã học về lập trình, thiết kế giao diện, làm việc nhóm và quản lý dự án vào một sản phẩm thực tế.

Nhóm áp dụng quy trình làm việc tương tự các dự án phần mềm thực tế: **lập kế hoạch → phân công → phát triển → kiểm thử → nghiệm thu**.

## 🎯 Mục tiêu

**Mục tiêu chung:** Xây dựng thành công một trò chơi di động hoàn chỉnh, có thể cài đặt và chơi được trên thiết bị Android, đảm bảo tính giải trí, giao diện thân thiện và hoạt động ổn định.

**Mục tiêu cụ thể:**
- Thiết kế luật chơi (gameplay) rõ ràng, dễ tiếp cận nhưng vẫn có tính thử thách
- Xây dựng giao diện người dùng (UI/UX) trực quan, phù hợp thiết bị di động
- Lập trình đầy đủ các chức năng cốt lõi: điều khiển, tính điểm, độ khó tăng dần, lưu điểm cao (high score)
- Tích hợp đồ họa và âm thanh tạo trải nghiệm sinh động
- Kiểm thử phần mềm trước khi phát hành
- Rèn luyện kỹ năng làm việc nhóm, quản lý tiến độ và sử dụng công cụ quản lý dự án chuyên nghiệp

## 🕹️ Gameplay (Game Design Document tóm tắt)

Nhân vật tự động di chuyển; người chơi **chạm màn hình để nhảy/né tránh chướng ngại vật**. Điểm số tăng theo thời gian sống sót hoặc số chướng ngại vật vượt qua. **Độ khó tăng dần** theo thời gian chơi.

Các màn hình chính:
- **Menu** – màn hình chính
- **Gameplay** – màn hình chơi
- **Pause** – tạm dừng
- **Game Over** – hiển thị điểm số và điểm cao nhất
- **Settings** – âm lượng, hướng dẫn chơi

## 🛠️ Công nghệ và công cụ sử dụng

| Nhóm | Công cụ |
|---|---|
| Phát triển | Unity Engine (2D), C#, Visual Studio Code / Visual Studio |
| Thiết kế & đồ họa | Figma, Adobe Photoshop / Illustrator, Aseprite |
| Quản lý dự án & cộng tác | Trello / Jira, Git & GitHub, Google Drive / Docs, Discord / Messenger |
| Kiểm thử & triển khai | Unity Test Framework, thiết bị/Emulator Android, Android Studio, Google Play Console (tham khảo) |

## 📁 Cấu trúc dự án

```
├── Scripts/
│   ├── GameManager.cs        # Quản lý trạng thái game (menu, playing, pause, game over)
│   ├── PlayerController.cs   # Điều khiển nhân vật bằng touch input, nhảy/né chướng ngại vật
│   ├── ObstacleSpawner.cs    # Sinh chướng ngại vật ngẫu nhiên, tăng độ khó theo thời gian
│   ├── ScoreManager.cs       # Tính điểm và lưu điểm cao nhất (PlayerPrefs)
│   └── UIManager.cs          # Quản lý UI: Menu, Pause, Game Over, Settings
├── .gitignore
└── README.md
```

> Các script trong repo là khung sườn (scaffold) cho một game Unity 2D dạng "endless runner". Import thư mục `Scripts/` vào project Unity, gắn các component tương ứng vào GameObject trong Scene, và kết nối tham chiếu qua Inspector.

## 👥 Nhóm thực hiện & Phân chia công việc

| Thành viên | Vai trò | Công việc phụ trách |
|---|---|---|
| Nguyễn Thị Phương Diễm | Trưởng nhóm / Quản lý dự án | Lập kế hoạch, phân công, theo dõi tiến độ (Trello/Jira), tổng hợp báo cáo, Game Design Document |
| Đinh Xuân Quang | Lập trình Gameplay (Lead Developer) | Điều khiển nhân vật, va chạm, tính điểm, độ khó tăng dần, lưu trạng thái game |
| Trần Đức Giang | Lập trình UI/UX & Âm thanh | Màn hình menu, bảng xếp hạng, cài đặt; hiệu ứng âm thanh, nhạc nền, rung |
| Hà Duy Quang | Đồ họa & Thiết kế màn chơi | Nhân vật, nền, vật cản; thiết kế level, cân bằng độ khó |
| Đỗ Việt Anh | Kiểm thử phần mềm (Tester/QA) & Tài liệu | Test case, kiểm thử đa thiết bị, bug report, tài liệu hướng dẫn |

## 📅 Kế hoạch thực hiện (Timeline)

| Thời gian | Giai đoạn | Nội dung chính |
|---|---|---|
| Tuần 1 – 2 | Khởi động dự án | Họp nhóm, chọn ý tưởng game, xây dựng GDD, phân công vai trò |
| Tuần 3 – 5 | Xây dựng nền tảng | Thiết lập dự án Unity, khung gameplay cơ bản, UI sơ bộ |
| Tuần 6 – 8 | Phát triển tính năng | Hoàn thiện cơ chế chơi, hệ thống điểm/độ khó, âm thanh, đồ họa |
| Tuần 9 – 10 | Kiểm thử & sửa lỗi | Viết/chạy test case, kiểm thử đa thiết bị, sửa lỗi |
| Tuần 11 | Hoàn thiện & đóng gói | Tối ưu hiệu năng, đóng gói APK, chuẩn bị demo |
| Tuần 12 | Báo cáo & nghiệm thu | Tổng hợp tài liệu, thuyết trình, báo cáo tổng kết |

## ✅ Đầu ra mỗi thành viên cần đạt

- **Quản lý dự án:** GDD hoàn chỉnh, kế hoạch dự án, báo cáo tổng kết, biên bản họp nhóm hằng tuần
- **Lập trình Gameplay:** Module gameplay ổn định, source code có chú thích rõ ràng, không lỗi crash
- **UI/UX & Âm thanh:** Bộ giao diện hoàn chỉnh (menu, pause, game over, settings), âm thanh tích hợp mượt
- **Đồ họa & Level Design:** Bộ tài nguyên đồ họa đúng phong cách, tối thiểu 5 màn chơi độ khó tăng dần
- **Kiểm thử & Tài liệu:** Bảng test case đầy đủ, bug list kèm mức độ ưu tiên, README hướng dẫn cài đặt & sử dụng

## 🚀 Kết quả mong đợi

Một bản build **APK hoàn chỉnh**, chạy ổn định trên thiết bị Android, cùng bộ tài liệu đầy đủ (Game Design Document, kế hoạch dự án, báo cáo kiểm thử, hướng dẫn sử dụng) làm nền tảng để nhóm tiếp tục phát triển, mở rộng game trong tương lai.

## 📝 Quy trình quản lý mã nguồn

- Quản lý mã nguồn bằng **Git/GitHub** theo mô hình nhánh (feature branch)
- Review code trước khi gộp (merge) vào nhánh `main`
- Theo dõi công việc bằng bảng Kanban trên Trello: **Cần làm – Đang làm – Đã xong**

## ▶️ Hướng dẫn chạy dự án (Unity)

1. Cài đặt **Unity Hub** và **Unity Editor** (khuyến nghị phiên bản LTS mới nhất hỗ trợ Android build)
2. Tạo mới một Unity project 2D, sau đó copy thư mục `Scripts/` vào `Assets/Scripts/` của project
3. Tạo các GameObject cần thiết (Player, Obstacle Spawner, Game Manager, Canvas UI) và gắn script tương ứng
4. Kéo tham chiếu các UI Text/Button vào Inspector cho `UIManager` và `ScoreManager`
5. Chuyển Platform sang **Android** (`File > Build Settings > Android`) và Build để tạo file APK

## 📄 License

Dự án phục vụ mục đích học tập.
