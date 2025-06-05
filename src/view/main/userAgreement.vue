<template>
  <module-self>
    <div class="m_user_agreement_wrap">
      <div class="user_agreement_content">
        <div v-for="(item, index) in clauseList" :key="index" :class="item.class">{{ item.value }}</div>
      </div>
    </div>
  </module-self>
</template>

<script>
export default {
  data() {
    return {}
  },

  computed: {
    prefix() {
      return JSON.parse(this.$store.state.app.localConfig).prefix || ''
    },
    clauseList() {
      let { prefix } = this
      return this[`${prefix}ClauseList`]
    },
    VNClauseList() {
      return [
        {
          value:
            'Giới Thiệu Về Nền Tảng',
          class: 'title'
        },
        {
          value: '“Trang Phát Sóng Học Viện Baccarat” là nền tảng giảng dạy phát sóng trực tiếp về Baccarat do các cao thủ và chuyên gia trong ngành phối hợp xây dựng. Nền tảng không cung cấp dịch vụ cờ bạc, chỉ chia sẻ chiến lược, phân tích thực chiến và giao lưu cộng đồng. Tất cả nội dung chỉ dùng cho mục đích giải trí hợp pháp và trao đổi kiến thức.',
          class: 'text'
        },
        {
          value:
            'Tư Cách Người Dùng và Quy Tắc Hành Vi',
          class: 'title'
        },
        {
          value: '1. Yêu Cầu Về Độ Tuổi',
          class: 'text'
        },
        {
          value: 'Nền tảng chỉ dành cho người trưởng thành từ 18 tuổi trở lên. Trẻ vị thành niên không được phép đăng ký, xem hoặc tham gia bất kỳ hình thức tương tác nào.',
          class: 'span'
        },
        {
          value: '2. Cấm Sử Dụng Cho Mục Đích Bất Hợp Pháp',
          class: 'text'
        },
        {
          value: 'Không sử dụng nền tảng để rửa tiền, giao dịch phi pháp, hoặc hành vi vi phạm pháp luật.',
          class: 'span'
        },
        {
          value: 'Không được dụ dỗ người khác cá cược bất hợp pháp hay giả danh hoạt động cờ bạc.',
          class: 'span'
        },
        {
          value: '3. Quy Định Về Tài Khoản',
          class: 'text'
        },

        {
          value: 'Người dùng phải chịu trách nhiệm về hành vi và phát ngôn của mình.',
          class: 'span'
        },
        {
          value: 'Cấm đăng tin giả, mạo danh người khác, quấy rối hay lừa đảo.',
          class: 'span'
        },
        {
          value: 'Vi phạm sẽ bị khóa tạm thời hoặc vĩnh viễn mà không cần thông báo trước.',
          class: 'span'
        },
        {
          value: 'Quyền Sở Hữu Nội Dung và Phạm Vi Sử Dụng',
          class: 'title'
        },
        {
          value: '1. Quyền Sở Hữu Nội Dung',
          class: 'text'
        },
        {
          value: 'Toàn bộ nội dung như video phát sóng, tài liệu giảng dạy, phân tích chiến lược và hình ảnh đều thuộc sở hữu của nền tảng hoặc bên được ủy quyền, được bảo vệ bởi luật bản quyền.',
          class: 'span'
        },
        {
          value: '2. Cấm Tự Ý Sao Chép Hoặc Kinh Doanh',
          class: 'text'
        },
        {
          value: 'Không được phép sao chép, phân phối, phát lại, cắt ghép hay sử dụng nội dung cho mục đích thương mại khi chưa có sự cho phép bằng văn bản.',
          class: 'span'
        },
        {
          value: '3. Nội Dung Do Người Dùng Tạo Ra (UGC)',
          class: 'text'
        },
        {
          value: 'Nội dung người dùng đăng trong phòng chat hoặc bình luận sẽ được cấp quyền sử dụng, hiển thị hoặc thu thập trong phạm vi hợp lý bởi nền tảng.',
          class: 'span'
        },
        {
          value: 'Tuyên Bố Miễn Trách Nhiệm',
          class: 'title'
        },
        {
          value: '1. Không Phải Nền Tảng Cá Cược',
          class: 'text'
        },
        {
          value: 'Nền tảng không tổ chức hay giới thiệu bất kỳ hình thức cá cược nào. Mọi nội dung chỉ mang tính học thuật và tham khảo.',
          class: 'span'
        },
        {
          value: '2. Tự Chịu Trách Nhiệm Về Lãi/Lỗ',
          class: 'text'
        },
        {
          value: 'Nếu người dùng cá cược dựa trên nội dung của nền tảng và bị lỗ hay vướng rắc rối pháp lý, nền tảng sẽ không chịu trách nhiệm.',
          class: 'span'
        },

        {
          value: '3. Dữ Liệu và Tình Huống Minh Họa',
          class: 'text'
        },

        {
          value: 'Một số số liệu và tình huống chỉ mang tính minh họa, không đảm bảo hiệu quả hay lợi nhuận trong tương lai.',
          class: 'span'
        },
        {
          value: 'Quy Tắc Giao Lưu Cộng Đồng',
          class: 'title'
        },
        {
          value: '1. Phát Ngôn Văn Minh',
          class: 'text'
        },
        {
          value: 'Yêu cầu người dùng cư xử tôn trọng, không công kích, gây hấn, quảng cáo hoặc tung tin sai lệch.',
          class: 'span'
        },
        {
          value: '2. Lấy Việc Học Làm Trọng, Lý Trí Làm Gốc',
          class: 'text'
        },
        {
          value: 'Nền tảng đề cao “chiến lược thay vì mù quáng, tư duy hơn là cảm tính”. Các phát ngôn khuyến khích làm giàu nhanh hay đánh lớn sẽ bị xóa và cấm phát ngôn.',
          class: 'span'
        },

        {
          value: 'Sửa Đổi Điều Khoản và Quyền Giải Thích',
          class: 'title'
        },
        {
          value: '1. Nền tảng có quyền cập nhật điều khoản bất cứ lúc nào mà không cần thông báo.',
          class: 'text'
        },

        {
          value: '2. Phiên bản mới nhất sẽ được công bố trên trang này và có hiệu lực ngay khi đăng.',
          class: 'text'
        },
        {
          value: '3. Nền tảng giữ quyền giải thích cuối cùng về các điều khoản và quy tắc hoạt động.',
          class: 'text'
        },

        {
          value: 'Bổ Sung',
          class: 'title'
        },
        {
          value: '“Trang Phát Sóng Học Viện Baccarat” cam kết xây dựng một nền tảng chuyên nghiệp dành cho người chơi. Chúng tôi nói không với đánh bạc mù quáng và lối chơi liều lĩnh, đề cao logic xác suất, vận hành lý trí và phát triển kiến thức.',
          class: 'text'
        },
        {
          value: 'Nếu bạn đồng ý với tinh thần này, hãy gia nhập cộng đồng và cùng nhau tiến bộ.',
          class: 'text'
        },
      ]
    },
    IDClauseList() {
      return [
        {
          value: 'Tentang Platform',
          class: 'title'
        },
        {
          value: '“Platform Siaran Akademi Baccarat” adalah platform pengajaran siaran langsung tentang Baccarat yang dibangun bersama oleh para ahli dan profesional industri. Platform ini tidak menyediakan layanan perjudian, hanya berbagi strategi, analisis praktis, dan interaksi komunitas. Semua konten hanya untuk tujuan hiburan yang sah dan pertukaran pengetahuan.',
          class: 'text'
        },
        {
          value: 'Kualifikasi Pengguna dan Aturan Perilaku',
          class: 'title'
        },
        {
          value: '1. Persyaratan Usia',
          class: 'text'
        },
        {
          value: 'Platform ini hanya untuk orang dewasa berusia 18 tahun ke atas. Anak di bawah umur tidak diizinkan untuk mendaftar, menonton, atau berpartisipasi dalam bentuk interaksi apa pun.',
          class: 'span'
        },
        {
          value: '2. Dilarang Digunakan untuk Tujuan Ilegal',
          class: 'text'
        },
        {
          value: 'Jangan gunakan platform ini untuk pencucian uang, transaksi ilegal, atau perilaku yang melanggar hukum.',
          class: 'span'
        },
        {
          value: 'Jangan menipu orang lain untuk berjudi ilegal atau menyamar sebagai aktivitas perjudian.',
          class: 'span'
        },
        {
          value: '3. Aturan Akun',
          class: 'text'
        },
        {
          value: 'Pengguna bertanggung jawab atas perilaku dan ucapan mereka.',
          class: 'span'
        },
        {
          value: 'Dilarang memposting informasi palsu, menyamar sebagai orang lain, mengganggu, atau menipu.',
          class: 'span'
        },
        {
          value: 'Pelanggaran akan diblokir sementara atau permanen tanpa pemberitahuan sebelumnya.',
          class: 'span'
        },
        {
          value: 'Hak Kepemilikan Konten dan Lingkup Penggunaan',
          class: 'title'
        },
        {
          value: '1. Hak Kepemilikan Konten',
          class: 'text'
        },
        {
          value: 'Semua konten seperti siaran video, materi pengajaran, analisis strategi, dan gambar dimiliki oleh platform atau pihak yang diberi kuasa, dilindungi oleh undang-undang hak cipta.',
          class: 'span'
        },
        {
          value: '2. Dilarang Menyalin atau Menggunakan untuk Tujuan Komersial Tanpa Izin',
          class: 'text'
        },
        {
          value: 'Dilarang menyalin, mendistribusikan, menyiarkan ulang, mengedit, atau menggunakan konten untuk tujuan komersial tanpa izin tertulis.',
          class: 'span'
        },
        {
          value: '3. Konten yang Dibuat Pengguna (UGC)',
          class: 'text'
        },
        {
          value: 'Konten yang diposting pengguna di ruang obrolan atau komentar akan diberikan hak untuk digunakan, ditampilkan, atau dikumpulkan dalam batas wajar oleh platform.',
          class: 'span'
        },
        {
          value: 'Pernyataan Penafian',
          class: 'title'
        },
        {
          value: '1. Bukan Platform Perjudian',
          class: 'text'
        },
        {
          value: 'Platform ini tidak menyelenggarakan atau memperkenalkan bentuk perjudian apa pun. Semua konten hanya bersifat akademik dan referensi.',
          class: 'span'
        },
        {
          value: '2. Bertanggung Jawab atas Keuntungan',
          class: 'text'
        },
        {
          value: 'Jika pengguna berjudi berdasarkan konten platform dan mengalami kerugian atau masalah hukum, platform tidak bertanggung jawab.',
          class: 'span'
        },
        {
          value: '3. Data dan Situasi Ilustrasi',
          class: 'text'
        },
        {
          value: 'Beberapa data dan situasi hanya bersifat ilustratif, tidak menjamin efektivitas atau keuntungan di masa depan.',
          class: 'span'
        },
        {
          value: 'Aturan Interaksi Komunitas',
          class: 'title'
        },
        {
          value: '1. Ucapan yang Sopan',
          class: 'text'
        },
        {
          value: 'Pengguna diminta untuk bersikap hormat, tidak menyerang, menghasut, beriklan, atau menyebarkan informasi palsu.',
          class: 'span'
        },
        {
          value: '2. Utamakan Pembelajaran, Rasionalitas sebagai Dasar',
          class: 'text'
        },
        {
          value: 'Platform menekankan “strategi daripada kebutaan, pemikiran lebih dari perasaan”. Pernyataan yang mendorong cepat kaya atau taruhan besar akan dihapus dan dilarang.',
          class: 'span'
        },
        {
          value: 'Perubahan Ketentuan dan Hak Penafsiran',
          class: 'title'
        },
        {
          value: '1. Platform berhak memperbarui ketentuan kapan saja tanpa pemberitahuan.',
          class: 'text'
        },
        {
          value: '2. Versi terbaru akan dipublikasikan di halaman ini dan berlaku segera setelah diposting.',
          class: 'text'
        },
        {
          value: '3. Platform memiliki hak penafsiran akhir atas ketentuan dan aturan operasional.',
          class: 'text'
        },
        {
          value: 'Tambahan',
          class: 'title'
        },
        {
          value: '“Platform Siaran Akademi Baccarat” berkomitmen untuk membangun platform profesional bagi pemain. Kami menolak perjudian buta dan gaya bermain sembrono, menekankan logika probabilitas, operasi rasional, dan pengembangan pengetahuan.',
          class: 'text'
        },
        {
          value: 'Jika Anda setuju dengan semangat ini, bergabunglah dengan komunitas dan berkembang bersama.',
          class: 'text'
        }
      ]

    },
    THClauseList() {
      return [
        {
          value: "แนะนำเกี่ยวกับแพลตฟอร์ม",
          class: "title"
        },
        {
          value: "“แพลตฟอร์มถ่ายทอดสดสถาบันบาคาร่า” เป็นแพลตฟอร์มการสอนสดเกี่ยวกับบาคาร่า ซึ่งสร้างขึ้นร่วมกันโดยผู้เชี่ยวชาญและมืออาชีพในอุตสาหกรรม แพลตฟอร์มนี้ไม่ให้บริการการพนัน แต่จะแบ่งปันกลยุทธ์ การวิเคราะห์เชิงปฏิบัติ และการแลกเปลี่ยนในชุมชน เนื้อหาทั้งหมดมีไว้เพื่อความบันเทิงที่ถูกกฎหมายและการแลกเปลี่ยนความรู้เท่านั้น",
          class: "text"
        },
        {
          value: "สถานะผู้ใช้และกฎระเบียบการกระทำ",
          class: "title"
        },
        {
          value: "1. ข้อกำหนดเกี่ยวกับอายุ",
          class: "text"
        },
        {
          value: "แพลตฟอร์มนี้สงวนไว้สำหรับผู้ใหญ่ที่มีอายุ 18 ปีขึ้นไป ผู้เยาว์ไม่สามารถลงทะเบียน ดู หรือเข้าร่วมการโต้ตอบใด ๆ ได้",
          class: "span"
        },
        {
          value: "2. ห้ามใช้เพื่อวัตถุประสงค์ที่ผิดกฎหมาย",
          class: "text"
        },
        {
          value: "ห้ามใช้แพลตฟอร์มในการฟอกเงิน ทำธุรกรรมผิดกฎหมาย หรือกระทำการละเมิดกฎหมายใด ๆ",
          class: "span"
        },
        {
          value: "ห้ามชักชวนผู้อื่นให้พนันอย่างผิดกฎหมาย หรือแอบอ้างเป็นกิจกรรมการพนัน",
          class: "span"
        },
        {
          value: "3. กฎระเบียบเกี่ยวกับบัญชีผู้ใช้",
          class: "text"
        },
        {
          value: "ผู้ใช้ต้องรับผิดชอบต่อพฤติกรรมและคำพูดของตนเอง",
          class: "span"
        },
        {
          value: "ห้ามโพสต์ข้อมูลเท็จ แอบอ้างผู้อื่น รบกวน หรือฉ้อโกง",
          class: "span"
        },
        {
          value: "ผู้ฝ่าฝืนจะถูกระงับบัญชีชั่วคราวหรือถาวรโดยไม่ต้องแจ้งล่วงหน้า",
          class: "span"
        },
        {
          value: "สิทธิ์ในเนื้อหาและขอบเขตการใช้งาน",
          class: "title"
        },
        {
          value: "1. สิทธิ์ในเนื้อหา",
          class: "text"
        },
        {
          value: "เนื้อหาทั้งหมด เช่น วิดีโอสตรีม เอกสารการสอน การวิเคราะห์กลยุทธ์ และภาพ เป็นทรัพย์สินของแพลตฟอร์มหรือผู้ได้รับอนุญาต และได้รับการคุ้มครองตามกฎหมายลิขสิทธิ์",
          class: "span"
        },
        {
          value: "2. ห้ามคัดลอกหรือทำธุรกิจโดยไม่ได้รับอนุญาต",
          class: "text"
        },
        {
          value: "ห้ามคัดลอก แจกจ่าย รีแพลย์ ตัดต่อ หรือใช้เนื้อหาเพื่อการพาณิชย์โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร",
          class: "span"
        },
        {
          value: "3. เนื้อหาที่ผู้ใช้สร้างขึ้น (UGC)",
          class: "text"
        },
        {
          value: "เนื้อหาที่ผู้ใช้โพสต์ในห้องแชทหรือคอมเมนต์ จะได้รับสิทธิ์ในการใช้ แสดง หรือเก็บรวบรวมในขอบเขตที่เหมาะสมโดยแพลตฟอร์ม",
          class: "span"
        },
        {
          value: "คำประกาศปฏิเสธความรับผิดชอบ",
          class: "title"
        },
        {
          value: "1. ไม่ใช่แพลตฟอร์มการพนัน",
          class: "text"
        },
        {
          value: "แพลตฟอร์มไม่จัดหรือแนะนำการพนันทุกรูปแบบ เนื้อหาทั้งหมดมีไว้เพื่อการศึกษาและอ้างอิงเท่านั้น",
          class: "span"
        },
        {
          value: "2. รับผิดชอบต่อกำไร/ขาดทุนด้วยตนเอง",
          class: "text"
        },
        {
          value: "หากผู้ใช้พนันตามเนื้อหาของแพลตฟอร์มแล้วขาดทุนหรือติดปัญหาทางกฎหมาย แพลตฟอร์มจะไม่รับผิดชอบ",
          class: "span"
        },
        {
          value: "3. ข้อมูลและสถานการณ์จำลอง",
          class: "text"
        },
        {
          value: "ข้อมูลและสถานการณ์บางอย่างเป็นเพียงการจำลอง ไม่รับประกันผลลัพธ์หรือกำไรในอนาคต",
          class: "span"
        },
        {
          value: "กฎเกณฑ์ในการแลกเปลี่ยนในชุมชน",
          class: "title"
        },
        {
          value: "1. การพูดจาอย่างมีมารยาท",
          class: "text"
        },
        {
          value: "ผู้ใช้ต้องปฏิบัติตนด้วยความเคารพ หลีกเลี่ยงการโจมตี ก้าวร้าว โฆษณา หรือเผยแพร่ข้อมูลเท็จ",
          class: "span"
        },
        {
          value: "2. เน้นการเรียนรู้และใช้เหตุผล",
          class: "text"
        },
        {
          value: "แพลตฟอร์มเน้น “กลยุทธ์มากกว่าการทำตามโดยไม่คิด, ใช้เหตุผลมากกว่าความรู้สึก” คำพูดสนับสนุนการรวยเร็วหรือพนันหนักจะถูกลบและห้ามพูด",
          class: "span"
        },
        {
          value: "การแก้ไขข้อกำหนดและสิทธิ์ในการตีความ",
          class: "title"
        },
        {
          value: "1. แพลตฟอร์มมีสิทธิ์ปรับปรุงข้อกำหนดได้ทุกเมื่อโดยไม่ต้องแจ้งล่วงหน้า",
          class: "text"
        },
        {
          value: "2. เวอร์ชันล่าสุดจะเผยแพร่บนหน้านี้และมีผลบังคับใช้ทันทีที่ประกาศ",
          class: "text"
        },

        {
          value: '3. แพลตฟอร์มขอสงวนสิทธิ์ในการตีความข้อกำหนดและกฎเกณฑ์การดำเนินงานขั้นสุดท้าย',
          class: 'text'
        },
        {
          value: 'เพิ่มเติม',
          class: 'title'
        },
        {
          value: '“แพลตฟอร์มถ่ายทอดสดสถาบันบาคาร่า” มุ่งมั่นสร้างแพลตฟอร์มระดับมืออาชีพสำหรับผู้เล่น เราไม่สนับสนุนการพนันแบบไร้เหตุผลและการเล่นที่เสี่ยง เน้นตรรกะของความน่าจะเป็น การคิดอย่างมีเหตุผล และการพัฒนาความรู้',
          class: 'text'
        },
        {
          value: 'หากคุณเห็นด้วยกับแนวคิดนี้ ขอเชิญเข้าร่วมชุมชนและพัฒนาร่วมกัน',
          class: 'text'
        }
      ]
    },
    ENClauseList() {
      return [
        {
          value: 'Introduction to the Platform',
          class: 'title'
        },
        {
          value: '“Baccarat Academy Live Broadcast Page” is a live teaching platform for Baccarat developed collaboratively by experts and masters in the industry. The platform does not provide gambling services, only shares strategies, practical analysis, and community interaction. All content is for legal entertainment purposes and knowledge exchange only.',
          class: 'text'
        },
        {
          value: 'User Qualifications and Code of Conduct',
          class: 'title'
        },
        {
          value: '1. Age Requirement',
          class: 'text'
        },
        {
          value: 'The platform is only for adults aged 18 and above. Minors are not allowed to register, view, or participate in any form of interaction.',
          class: 'span'
        },
        {
          value: '2. Prohibition of Illegal Use',
          class: 'text'
        },
        {
          value: 'Do not use the platform for money laundering, illegal transactions, or any unlawful activities.',
          class: 'span'
        },
        {
          value: 'Do not induce others to bet illegally or impersonate gambling activities.',
          class: 'span'
        },
        {
          value: '3. Account Regulations',
          class: 'text'
        },
        {
          value: 'Users are responsible for their own behavior and statements.',
          class: 'span'
        },
        {
          value: 'Posting fake news, impersonating others, harassment, or fraud is prohibited.',
          class: 'span'
        },
        {
          value: 'Violations may result in temporary or permanent account suspension without prior notice.',
          class: 'span'
        },
        {
          value: 'Content Ownership and Scope of Use',
          class: 'title'
        },
        {
          value: '1. Content Ownership',
          class: 'text'
        },
        {
          value: 'All content such as live videos, teaching materials, strategy analyses, and images are owned by the platform or authorized parties and protected by copyright laws.',
          class: 'span'
        },
        {
          value: '2. Prohibition of Unauthorized Copying or Commercial Use',
          class: 'text'
        },
        {
          value: 'Copying, distributing, replaying, editing, or using content for commercial purposes without written permission is not allowed.',
          class: 'span'
        },
        {
          value: '3. User-Generated Content (UGC)',
          class: 'text'
        },
        {
          value: 'Content posted by users in chat rooms or comments is granted usage rights, display, or collection within reasonable scope by the platform.',
          class: 'span'
        },
        {
          value: 'Disclaimer',
          class: 'title'
        },
        {
          value: '1. Not a Gambling Platform',
          class: 'text'
        },
        {
          value: 'The platform does not organize or promote any form of betting. All content is academic and for reference only.',
          class: 'span'
        },
        {
          value: '2. Responsibility for Gains/Losses',
          class: 'text'
        },
        {
          value: 'If users gamble based on platform content and incur losses or legal troubles, the platform is not responsible.',
          class: 'span'
        },
        {
          value: '3. Data and Illustrative Scenarios',
          class: 'text'
        },
        {
          value: 'Some data and scenarios are for illustration only and do not guarantee future effectiveness or profits.',
          class: 'span'
        },
        {
          value: 'Community Interaction Rules',
          class: 'title'
        },
        {
          value: '1. Civilized Speech',
          class: 'text'
        },
        {
          value: 'Users are required to behave respectfully, without attacks, hostility, advertising, or spreading false information.',
          class: 'span'
        },
        {
          value: '2. Prioritize Learning, Grounded in Reason',
          class: 'text'
        },
        {
          value: 'The platform values “strategy over blind following, rational thinking over emotions.” Statements encouraging quick wealth or large bets will be deleted and banned.',
          class: 'span'
        },
        {
          value: 'Terms Modification and Interpretation Rights',
          class: 'title'
        },
        {
          value: '1. The platform reserves the right to update terms at any time without notice.',
          class: 'text'
        },
        {
          value: '2. The latest version will be published on this page and take effect immediately upon posting.',
          class: 'text'
        },
        {
          value: '3. The platform holds the final right to interpret the terms and operating rules.',
          class: 'text'
        },
        {
          value: 'Supplement',
          class: 'title'
        },
        {
          value: '“Baccarat Academy Live Broadcast Page” is committed to building a professional platform for players. We reject blind gambling and reckless play, emphasizing probability logic, rational operation, and knowledge development.',
          class: 'text'
        },
        {
          value: 'If you agree with this spirit, please join the community and progress together.',
          class: 'text'
        },

      ]
    },

  }
}
</script>

<style scoped lang="scss">
.m_user_agreement_wrap {
  @apply pt-20px pb-40px;

  .user_agreement_content {
    @apply py-20px px-40px bg-lightFirst rounded-10px;

    .title {
      @apply text-14px text-dark leading-21px pb-7px font-bold font-serif;
    }

    .text {
      @apply text-14px text-dark leading-21px pb-14px;
    }

    .span {
      list-style: outside;
      display: list-item;
      @apply text-14px text-dark leading-21px pb-7px mx-20px;
    }
  }
}
</style>