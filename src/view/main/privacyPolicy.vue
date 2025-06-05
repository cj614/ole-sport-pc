<template>
  <module-self>
    <div class="m_privacy_policy_wrap">
      <div class="privacy_policy_content">
        <div v-for="(item,index) in policyList" :key="index" :class="item.class">{{item.value}}</div>
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
    policyList() {
      let { prefix } = this
      return this[`${prefix}PolicyList`]
    },
    VNPolicyList() {
      return [
        {
          value:
            'Để đảm bảo trải nghiệm trực tuyến an toàn và bảo mật tại OLE, chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Cam kết này là ưu tiên hàng đầu của chúng tôi. Bằng cách sử dụng Phần mềm/Trang web của chúng tôi, bạn thừa nhận và chấp nhận các điều khoản và điều kiện của Chính sách Quyền riêng tư OLE và hiểu các mục đích thu thập dữ liệu cũng như cách xử lý dữ liệu.',
          class: 'text'
        },
        {
          value: 'Chia sẻ thông tin cá nhân của bạn giữa OLE và các bên thứ ba',
          class: 'title'
        },
        {
          value:
            'Ủy quyền: Bạn ủy quyền cho các công ty thuộc nhóm OLE, những người kế nhiệm và các đơn vị được OLE chấp thuận sử dụng Thông tin Cá nhân của bạn (ví dụ: tên, số điện thoại, địa chỉ email) đã được cung cấp hoặc công khai trong quá trình đăng ký và/hoặc sử dụng dịch vụ OLE. Điều này giúp duy trì chất lượng, độ phong phú và bảo mật của OLE. Để làm rõ, các hoạt động như đăng, chỉnh sửa hoặc xóa nội dung trên OLE có thể được đồng bộ hóa với các phần mềm và trang web do các công ty này vận hành (nếu có). OLE chịu trách nhiệm quản lý Thông tin Cá nhân của bạn.',
          class: 'span'
        },
        {
          value:
            'Đối tác hợp tác: Để cung cấp dịch vụ hiệu quả, mở rộng sự kiện và quản lý dữ liệu an toàn, OLE có thể hợp tác với các bên thứ ba (ví dụ: nhà cung cấp dịch vụ mạng, ngân hàng, công ty PR, và/hoặc công ty bảo mật thông tin, gọi chung là “Đối tác hợp tác”). Các đối tác này có thể cần truy cập, xử lý hoặc sử dụng Thông tin Cá nhân của bạn và có thể nằm ngoài quốc gia nơi bạn cư trú.',
          class: 'span'
        },
        {
          value: 'Khác',
          class: 'title'
        },
        {
          value:
            'Thông tin ẩn danh: Khi bạn duyệt nội dung trên OLE, chúng tôi có thể thu thập:',
          class: 'span'
        },
        {
          value:
            'Bản ghi sử dụng: Thông tin về các tin nhắn đã gửi hoặc nhận, bao gồm thời gian, ngày, chi tiết người gửi và người nhận. Chúng tôi cũng thu thập dữ liệu về cách bạn sử dụng dịch vụ, bao gồm loại trình duyệt, ngôn ngữ, thời gian sử dụng và địa chỉ IP.',
          class: 'span span1'
        },
        {
          value:
            'Thông tin thiết bị: Chi tiết về thiết bị của bạn, bao gồm loại thiết bị, hệ điều hành, số sê-ri, số điện thoại và dữ liệu di động. Với sự đồng ý rõ ràng của bạn, chúng tôi có thể truy cập danh bạ và kho lưu trữ hình ảnh trên thiết bị để hỗ trợ các tính năng.',
          class: 'span span1'
        },
        {
          value:
            'Thông tin vị trí: Với sự đồng ý rõ ràng của bạn, chúng tôi thu thập dữ liệu vị trí từ thiết bị của bạn để hỗ trợ các tính năng dịch vụ.',
          class: 'span span1'
        },
        {
          value:
            'Theo dõi dữ liệu: Chúng tôi sử dụng công nghệ theo dõi dữ liệu (ví dụ: cookie) để cải thiện dịch vụ và trải nghiệm người dùng.',
          class: 'span span1'
        },
        {
          value:
            'Chính sách cookie: OLE sử dụng cookie để nhận dạng hồ sơ trên máy tính của bạn và ghi nhớ tùy chọn đăng nhập và cài đặt của bạn. Hầu hết các trình duyệt chấp nhận cookie theo mặc định, nhưng bạn có thể từ chối chúng hoặc điều chỉnh cài đặt cookie trong trình duyệt của mình.',
          class: 'span'
        },
        {
          value:
            'Liên kết bên thứ ba: Các trang web liên kết với OLE có thể thu thập Thông tin Cá nhân của bạn. Chính sách quyền riêng tư của các trang web này sẽ điều chỉnh dữ liệu cung cấp trực tiếp cho họ. OLE không chịu trách nhiệm về các thực tiễn bảo mật của bên thứ ba.',
          class: 'span'
        },
        {
          value:
            'Biện pháp bảo mật: Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn của ngành để bảo vệ Thông tin Cá nhân của bạn. Tuy nhiên, không thể đảm bảo an ninh 100%. Bạn cũng nên thực hiện các bước để bảo vệ dữ liệu của mình, chẳng hạn như sử dụng mật khẩu phức tạp. Các biện pháp của chúng tôi chỉ áp dụng cho OLE và Phần mềm/Trang web của nó.',
          class: 'span'
        },
        {
          value:
            'Thông tin tài khoản: Cập nhật Thông tin Cá nhân của bạn bằng cách chỉnh sửa cài đặt tài khoản trong Ứng dụng.',
          class: 'span'
        },
        {
          value:
            'Thông tin thanh toán: Để quyên góp, chúng tôi cần các chi tiết như tên đầy đủ, địa chỉ thanh toán, mã bưu chính, quốc gia thanh toán, ngày sinh, số tiền thanh toán, phương thức thanh toán và chi tiết thẻ.',
          class: 'span'
        },
        {
          value:
            'Thông báo đẩy: OLE có thể gửi thông báo đẩy hoặc nhắc nhở. Bạn có thể điều chỉnh cài đặt thông báo trong cài đặt thiết bị (iOS) hoặc qua Ứng dụng (Android).',
          class: 'span'
        },
        {
          value:
            'Lưu giữ và xóa dữ liệu: Chúng tôi lưu giữ dữ liệu cá nhân miễn là cần thiết cho dịch vụ hoặc theo yêu cầu của pháp luật. Bạn có thể yêu cầu xóa dữ liệu bằng cách liên hệ với chúng tôi và chúng tôi sẽ xử lý các yêu cầu đó theo luật hiện hành.',
          class: 'span'
        },
        {
          value:
            'OLE bảo lưu quyền thay đổi Chính sách Quyền riêng tư này bất cứ lúc nào. Các thay đổi sẽ được cập nhật trên Phần mềm/Trang web.',
          class: 'text'
        },
        {
          value:
            'Nếu chúng tôi vô tình thu thập dữ liệu từ một đứa trẻ dưới 12 tuổi, chúng tôi sẽ nhanh chóng xóa thông tin đó.',
          class: 'text'
        },
        {
          value:
            'Đối với các câu hỏi hoặc yêu cầu về quyền riêng tư, vui lòng liên hệ với chúng tôi tại ole77tv@gmail.com',
          class: 'text'
        }
      ]
    },
    IDPolicyList() {
      return [
        {
          value:
            'Untuk memastikan pengalaman online yang aman dan terjamin di OLE, kami berkomitmen melindungi privasi Anda. Komitmen ini adalah prioritas utama kami. Dengan menggunakan perangkat lunak/website kami, Anda mengakui dan menyetujui syarat dan ketentuan yang tercantum dalam Kebijakan Privasi OLE serta memahami tujuan pengumpulan data dan bagaimana data tersebut diproses.',
          class: 'text'
        },
        {
          value: 'Penggunaan Bersama Data Pribadi oleh OLE dan Pihak Ketiga',
          class: 'title'
        },
        {
          value:
            'Otorisasi:Anda memberi otorisasi kepada perusahaan dalam grup OLE, penerus mereka, serta entitas lain yang disetujui oleh OLE untuk menggunakan Data Pribadi Anda (misalnya, nama, nomor telepon, alamat email) yang diberikan atau dipublikasikan selama proses pendaftaran dan/atau penggunaan layanan OLE. Hal ini bertujuan untuk menjaga kualitas, keamanan, dan layanan OLE. Aktivitas seperti mempublikasikan, mengubah, atau menghapus konten di OLE dapat disinkronkan dengan perangkat lunak dan situs web yang dioperasikan oleh perusahaan terkait (jika berlaku). OLE bertanggung jawab untuk mengelola Data Pribadi Anda.',
          class: 'span'
        },
        {
          value:
            'Mitra Kolaboratif:Untuk memberikan layanan yang efisien, memperluas acara, dan mengelola data dengan aman, OLE dapat bekerja sama dengan pihak ketiga (misalnya, pengangkut, bank, perusahaan pemasaran PR, dan/atau perusahaan keamanan informasi, yang secara kolektif disebut Mitra Kolaboratif). Mitra ini mungkin perlu mengakses, memproses, atau menggunakan Data Pribadi Anda, dan dapat berada di luar negara tempat tinggal Anda.',
          class: 'span'
        },
        {
          value: 'Lainnya',
          class: 'title'
        },
        {
          value:
            'Informasi Anonim:Saat Anda mengakses konten OLE, kami dapat mengumpulkan informasi berikut:',
          class: 'span'
        },
        {
          value:
            'Catatan Penggunaan:Informasi mengenai pesan yang dikirim atau diterima, termasuk waktu, tanggal, pengirim, dan penerima. Kami juga mengumpulkan data mengenai penggunaan layanan, seperti jenis browser, bahasa, waktu penggunaan, dan alamat IP.',
          class: 'span span1'
        },
        {
          value:
            'Informasi Perangkat:Detail tentang perangkat Anda, termasuk jenis perangkat, sistem operasi, nomor identifikasi perangkat, nomor telepon, dan data seluler. Dengan persetujuan Anda, kami dapat mengakses kontak perangkat dan penyimpanan gambar untuk mendukung fitur tertentu.',
          class: 'span span1'
        },
        {
          value:
            'Informasi Lokasi:Dengan persetujuan Anda, kami dapat mengumpulkan data lokasi dari perangkat Anda untuk mendukung fitur layanan.',
          class: 'span span1'
        },
        {
          value:
            'Pelacakan Data:Kami menggunakan teknologi pelacakan data (seperti cookie) untuk meningkatkan layanan dan pengalaman pengguna.',
          class: 'span span1'
        },
        {
          value:
            'Kebijakan Cookie:OLE menggunakan cookie untuk mengenali catatan di perangkat Anda serta mengingat preferensi dan pengaturan login. Sebagian besar browser menerima cookie secara otomatis, tetapi Anda dapat menolak atau menyesuaikan pengaturan cookie di browser Anda.',
          class: 'span'
        },
        {
          value:
            'Tautan Pihak Ketiga:Situs web yang terhubung dengan OLE mungkin mengumpulkan Data Pribadi Anda. Kebijakan privasi situs web tersebut akan mengatur data yang diberikan langsung kepada mereka. OLE tidak bertanggung jawab atas praktik privasi pihak ketiga ini.',
          class: 'span'
        },
        {
          value:
            'Langkah-Langkah Keamanan:Kami menerapkan langkah-langkah keamanan sesuai dengan standar industri untuk melindungi Data Pribadi Anda. Namun, keamanan 100% tidak dapat dijamin. Anda juga harus mengambil langkah-langkah untuk melindungi data Anda, seperti menggunakan kata sandi yang kompleks. Langkah-langkah keamanan ini hanya berlaku untuk OLE dan perangkat lunak/website kami.',
          class: 'span'
        },
        {
          value: 'Informasi Akun dan Pembayaran',
          class: 'span'
        },
        {
          value:
            'Informasi Akun:Anda dapat memperbarui Data Pribadi Anda dengan mengedit pengaturan akun di aplikasi.',
          class: 'span'
        },
        {
          value:
            'Informasi Pembayaran:Untuk donasi, kami memerlukan informasi seperti nama lengkap, alamat penagihan, kode pos, negara penagihan, tanggal lahir, jumlah donasi, metode pembayaran, dan detail kartu pembayaran.',
          class: 'span'
        },
        {
          value: 'Notifikasi Push',
          class: 'span'
        },
        {
          value:
            'OLE dapat mengirimkan notifikasi push atau pengingat. Anda dapat mengubah pengaturan notifikasi di perangkat Anda (iOS) atau melalui aplikasi (Android).',
          class: 'span'
        },
        {
          value: 'Penyimpanan dan Penghapusan Data',
          class: 'span'
        },
        {
          value:
            'Kami menyimpan Data Pribadi sesuai dengan kebutuhan layanan atau sebagaimana diharuskan oleh hukum yang berlaku. Anda dapat meminta penghapusan data dengan menghubungi kami, dan kami akan memproses permintaan sesuai dengan ketentuan hukum.',
          class: 'span'
        },
        {
          value: 'Perubahan Kebijakan Privasi',
          class: 'span'
        },
        {
          value:
            'OLE berhak mengubah Kebijakan Privasi ini kapan saja. Setiap perubahan akan diperbarui pada perangkat lunak/website kami.',
          class: 'text'
        },
        {
          value:
            'Jika kami secara tidak sengaja mengumpulkan data dari anak di bawah usia 12 tahun, kami akan segera menghapus informasi tersebut.',
          class: 'text'
        },
        {
          value:
            'Untuk pertanyaan atau permintaan terkait hak privasi, Anda juga dapat menghubungi kami ole77tv@gmail.com.',
          class: 'text'
        }
      ]
    },
    THPolicyList() {
      return [
        {
          value:
            'เพื่อให้คุณได้สัมผัสประสบการณ์ออนไลน์ที่ปลอดภัยและมั่นคงที่ OLE เรามุ่งมั่นที่จะปกป้องความเป็นส่วนตัวของคุณ ความมุ่งมั่นนี้เป็นสิ่งส าคัญที่สุดของเราโดยการใช ้ซอฟต ์แวร ์ /เว็บไซต ์ของเราจึงเรียนมาเพื่อให้คุณรับทราบและยอมรับข้อก าหนดและเงื่อนไขของนโยบายความเป็นส่วนตัวขอ ง OLE และเข ้าใจวัตถุประสงค ์ในการรวบรวมข ้อมูลต่างๆ และวิ ธีการที่ข้อมูลถูกประมวลผล',
          class: 'text'
        },
        {
          value: 'ึการใช ้ข้อมูลส่วนบุคคลของคุณโดย OLE และบุคคลที่สาม',
          class: 'title'
        },
        {
          value:
            'การอนุญาต:คุณอนุญาตให ้บริษัทในกลุ่ม OLE ผู ้สืบทอดต าแหน่ง และหน่วยงานที่ OLE อนุมัติใช ้ข ้อมูลส่วนบุคคลของคุณ (เช ่น ชื่อ หมายเลขโทรศัพท ์ ที่อยู่อีเมล) ที่ให้หรือเผยแพร่ระหว่างการลงทะเบียนและ/หรือการใช ้บริการของ OLE ซึ่งช่วยรักษาคุณภาพความหลากหลาย และความปลอดภัยของ OLE เพื่อความชัดเจน กิจกรรมต่างๆ เช ่นการเผยแพร ่ การแก ้ไข หรือการลบเนื้อหาบน OLE อาจซิงโครไนซ์กับซอฟต์แวร์และเว็บไซต์ที่ด าเนินการโดยบริษัทเหล่านี้ (ถ ้ามี ) OLE ร ับผิดชอบในการจัดการข ้อมูลส่วนบุคคลของคุณ',
          class: 'span'
        },
        {
          value:
            'พันธมิตรที่ร่วมมือ: เพื่อให้บริการที่มีประสิทธิภาพ ขยายกิจกรรม และการจัดการข้อมูลที่ปลอดภัย OLE อาจร่วมมือกับบุคคลที่สาม (เช ่น ผู ้ให ้บริการเครือข่าย ธนาคาร บริษัทการตลาด PR และ/หรือบริษัทความปลอดภัยข ้อมูล ซึ่งรวมเรียกว่า พันธมิตรที่ร่วมมือ) พันธมิตรเหล่านี้อาจต้องการเข้าถึง ประมวลผล หรือใช ้ข ้อมูลส่วนบุคคลของคุณและอาจตั้งอยู่นอกประเทศที่คุณอาศัยอยู่',
          class: 'span'
        },
        {
          value: 'ข้อมูลที่ไม่ระบุชื่อ',
          class: 'title'
        },
        {
          value: 'เมื่อคุณเรียกดูเนื้อหาของ OLE เราอาจรวบรวม:',
          class: 'span'
        },
        {
          value:
            'บ ันทึกการใช ้งาน: ข้อมูลเกี่ยวกับข้อความที่ส่งหรือรับ รวมถึงเวลา วันที่รายละเอียดของผู ้ส่งและผู ้ร ับ เรายังรวบรวมข้อมูลเกี่ยวกับการใช้งานบริการของคุณเช ่น ประเภทของเบราว ์เซอร ์ ภาษา เวลาในการใช ้งาน และที่อยู่ IP',
          class: 'span span1'
        },
        {
          value:
            'ข้อมูลอุปกรณ์ : รายละเอียดเกี่ยวกับอุปกรณ์ของคุณ เช ่น ประเภท ระบบปฏิบัติการหมายเลขฉลากอุปกรณ์ หมายเลขโทรศัพท ์ และข ้อมูลเซลลูลาร ์ด ้วยความยินยอมอย่างช ัดเจนของคุณเราอาจเข้าถึงรายชื่อและการเก็บรูปภาพในอุปกรณ์เพื่อสนับสนุนคุณสมบัติต่างๆ',
          class: 'span span1'
        },
        {
          value:
            'ข้อมูลต าแหน่งที่ตั้ง: ด ้วยความยินยอมอย่างช ัดเจนของคุณเรารวบรวมข้อมูลต าแหน่งที่ตั้งจากอุปกรณ์ของคุณเพื่อสนับสนุนคุณสมบัติของบริการ',
          class: 'span span1'
        },
        {
          value:
            'การติดตามข้อมูล: เราใช ้เทคโนโลยีการติดตามข ้อมูล (เช ่น คุกกี้) เพื่อปรับปรุงบริการและประสบการณ์ผู้ใช้',
          class: 'span span1'
        },
        {
          value:
            'นโยบายคุกกี้ OLE ใช้คุกกี้เพื่อจดจ าบันทึกในคอมพิวเตอร์ของคุณและจดจ าการตั้งค่าและการตั้งค่าการเข้าสู่ระบบของคุณ เบราว ์เซอร ์ส่วนใหญ่ยอมร ับคุกกี้ตามค่าเริ่มต้น แต่คุณสามารถปฏิเสธหรือตั้งค่าการตั้งค่าคุกกี้ในเบราว์เซอร์ของคุณ',
          class: 'span'
        },
        {
          value:
            'ิงก์บุคคลที่สาม เว็บไซต์ที่ลิงก์กับ OLE อาจรวบรวมข ้อมูลส่วนบุคคลของคุณนโยบายความเป็นส่วนตัวของเว็บไซต์เหล่านี้จะควบคุมข้อมูลที่ให้โดยตรงกับพวกเขา OLE ไม่ร ับผิดชอบต่อนโยบายความเป็นส่วนตัวของบุคคลที่สามเหล่านี้',
          class: 'span'
        },
        {
          value:
            'มาตรการความปลอดภ ัยเราด าเนินการมาตรการความปลอดภัยตามมาตรฐานอุตสาหกรรมเพื่อปกป้องข้อมูลส่วนบุคคลของคุณ อย่างไรก็ตาม ไม่สามารถร ับประกันความปลอดภัยได ้ 100% คุณควรด าเนินการเพื่อปกป้องข้อมูลของคุณเช่นกัน เช ่น การใช ้รหัสผ่ านที่ซับซ้อน มาตรการของเรานี้ใช้กับ OLE และซอฟต ์แวร ์ /เว็บไซต์ของเราเท่านั้น',
          class: 'span'
        },
        {
          value:
            'ข้อมูลบ ัญชีอัปเดตข้อมูลส่วนบุคคลของคุณโดยการแก้ไขการตั้งค่าบัญชีในแอป',
          class: 'span'
        },
        {
          value:
            'ข้อมูลการช าระเงินส าหร ับการบริจาค เราจ าเป็ นต ้องมีรายละเอียด เช ่น ชื่อเต็ม ที่อยู่ส าหรับเรียกเก็บเงินรหัสไปรษณีย ์ส าหร ับเรียกเก็บเงิน ประเทศส าหร ับเรียกเก็บเงิน วันเดือนปีเกิด จ านวนเงินที่ซื้อวิธีการช าระเงิน และรายละเอียดบัตร',
          class: 'span'
        },
        {
          value:
            'การแจ้งเตือนพุช OLE อาจส่งการแจ ้งเตือนพุชหรือการแจ ้งเตือนเตือนความจ าคุณสามารถปรับการตั้งค่าการแจ้งเตือนในอุปกรณ์ของคุณ (iOS) หรือผ่ านแอป (Android)',
          class: 'span'
        },
        {
          value:
            'การเก็บร ักษาและการลบข้อมูลเราจะเก็บรักษาข้อมูลส่วนบุคคลตราบเท่าที่จ าเป็นส าหรับบริการหรือที่กฎหมายก าหนดคุณสามารถร ้องขอการลบข ้อมูลได ้โดยการติดต่อเราและเราจะด าเนินการตามค าขอเหล่านั้นตามกฎหมายที่เกี่ยวข้อง',
          class: 'span'
        },
        {
          value:
            'การปรับเปลี่ยนนโยบายความเป็นส่วนตัว OLE ขอสงวนสิทธิ์ในการเปลี่ยนนโยบายความเป็นส่วนตัวนี้ได้ตลอดเวลา การเปลี่ยนแปลงจะอัปเดตบนซอฟต์แวร์/เว็บไซต ์ หากเรารวบรวมข้อมูลจากเด็กที่มีอายุต ่ากว่า 12 ปีโดยไม่ได้ตั้งใจ เราจะลบข ้อมูลดังกล่าวทันที',
          class: 'text'
        },
        {
          value:
            'ส าหรับค าถามหรือค าขอเกี่ยวกับสิทธิ์ความเป็นส่วนตัวของคุณ โปรดติดต่อเราที่ole77tv@gmail.com.',
          class: 'text'
        }
      ]
    },
    ENPolicyList() {
      return [
        {
          value:
            'To ensure a safe and secure online experience at OLE, we are committed to protecting your privacy. This commitment is our top priority. By using our Software/Website, you acknowledge and accept the terms and conditions of the OLE Privacy Policy and understand the purposes for collecting various data and how it is processed.',
          class: 'text'
        },
        {
          value: 'Shared Use of Your Personal Data by OLE and Third Parties',
          class: 'title'
        },
        {
          value:
            'Authorization: You authorize OLE Group companies, their successors, and entities approved by OLE to use your Personal Data (e.g., name, phone number, email address) provided or published during registration and/or use of OLE services. This helps maintain the quality, richness, and security of OLE. For clarity, activities such as publishing, revising, or deleting content on OLE may be synchronized with software and websites operated by these companies (if applicable). OLE is responsible for managing your Personal Data.',
          class: 'span'
        },
        {
          value:
            'Collaborative Partners: To offer efficient services, expanded events, and secure data management, OLE may engage third parties (e.g., carriers, banks, PR marketing firms, and/or information security companies, collectively Collaborative Partners). These partners may need to access, process, or use your Personal Data, and may be located outside your country of residence.',
          class: 'span'
        },
        {
          value: 'Others',
          class: 'title'
        },
        {
          value:
            'Anonymous Information: When you browse OLE content, we may collect:',
          class: 'span'
        },
        {
          value:
            'Records of Use: Information on messages sent or received, including time, date, sender, and recipient details. We also gather data about your service usage, including browser type, language, time of use, and IP address.',
          class: 'span span1'
        },
        {
          value:
            'Device Information: Details about your device, including type, operating system, equipment label number, phone number, and cellular data. With your explicit consent, we may access device contacts and image storage to support features.',
          class: 'span span1'
        },
        {
          value:
            'Location Information: With your explicit consent, we collect location data from your device to support service features.',
          class: 'span span1'
        },
        {
          value:
            'Data Tracking: We use data tracking technologies (e.g., cookies) to improve our services and user experience.',
          class: 'span span1'
        },
        {
          value:
            'Cookie Policy: OLE uses cookies to recognize records on your computer and to remember login preferences and settings. Most browsers accept cookies by default, but you can reject them or adjust cookie settings in your browser.',
          class: 'span span1'
        },
        {
          value:
            'Third-Party Links: Websites linked to OLE may collect your Personal Data. The privacy policy of these websites governs data provided directly to them. OLE is not responsible for these third-party privacy practices.',
          class: 'span'
        },
        {
          value:
            'Security Measures: We implement industry-standard security measures to protect your Personal Data. However, 100% security cannot be guaranteed. You should also take steps to protect your data, such as using complex passwords. Our measures apply only to OLE and its Software/Website.',
          class: 'span'
        },
        {
          value:
            'Account Information: Update your Personal Data by editing your account settings in the App.',
          class: 'span'
        },
        {
          value:
            'Payment Information: For donations, we need details such as full name, billing address, billing zip code, billing country, date of birth, purchase amount, payment method, and card details.',
          class: 'span'
        },
        {
          value:
            'Push Notifications: OLE may send push notifications or reminders. You can adjust notification settings in your device settings (iOS) or through the App (Android).',
          class: 'span'
        },
        {
          value:
            'Data Retention and Deletion: We retain personal data as long as necessary for services or as required by law. You can request data deletion by contacting us, and we will process such requests according to applicable laws.',
          class: 'span'
        },
        {
          value:
            'OLE reserves the right to change this Privacy Policy at any time. Changes will be updated on the Software/Website.',
          class: 'text'
        },
        {
          value:
            'If we inadvertently collect data from a child under 12, we will promptly delete such information.',
          class: 'text'
        },
        {
          value:
            'For privacy rights questions or requests, please contact us at ole77tv@gmail.com.',
          class: 'text'
        }
      ]
    },
    CNPolicyList() {
      return [
        {
          value:
            '为了确保在OLE的在线体验安全可靠，我们致力于保护您的隐私。这一承诺是我们的首要任务。通过使用我们的软件/网站，您确认并接受OLE隐私政策的条款和条件，并了解收集各种数据的目的及其处理方式。',
          class: 'text'
        },
        {
          value: 'OLE与第三方共享您的个人数据',
          class: 'title'
        },
        {
          value:
            '授权：您授权OLE集团公司、其继任者及OLE批准的实体使用您在注册和/或使用OLE服务时提供或发布的个人数据（如姓名、电话号码、电子邮件地址）。这有助于维护OLE的质量、丰富性和安全性。为明确起见，在OLE上发布、修订或删除内容等活动可能与这些公司运营的软件和网站同步（如适用）。OLE负责管理您的个人数据。',
          class: 'span'
        },
        {
          value:
            '合作伙伴：为了提供高效的服务、扩展的活动和安全的数据管理，OLE可能会与第三方合作（如承运人、银行、公关营销公司和/或信息安全公司，统称为“合作伙伴”）。这些合作伙伴可能需要访问、处理或使用您的个人数据，并且可能位于您所在国家/地区以外。',
          class: 'span'
        },
        {
          value: '其他',
          class: 'title'
        },
        {
          value: '匿名信息：当您浏览OLE内容时，我们可能会收集：',
          class: 'span'
        },
        {
          value:
            '使用记录：有关发送或接收的消息的信息，包括时间、日期、发件人和收件人详情。我们还收集关于您服务使用的数据，包括浏览器类型、语言、使用时间和IP地址。',
          class: 'span span1'
        },
        {
          value:
            '设备信息：有关您设备的详细信息，包括类型、操作系统、设备标签号码、电话号码和移动数据。在您的明确同意下，我们可能会访问设备联系人和图像存储以支持功能。',
          class: 'span span1'
        },
        {
          value:
            '位置信息：在您的明确同意下，我们收集来自您设备的位置信息以支持服务功能。',
          class: 'span span1'
        },
        {
          value:
            '数据跟踪：我们使用数据跟踪技术（如Cookies）来改进我们的服务和用户体验。',
          class: 'span span1'
        },
        {
          value:
            'Cookie政策：OLE使用Cookies来识别您计算机上的记录，并记住登录偏好和设置。大多数浏览器默认接受Cookies，但您可以在浏览器中拒绝或调整Cookie设置。',
          class: 'span'
        },
        {
          value:
            '第三方链接：链接到OLE的网站可能会收集您的个人数据。这些网站的隐私政策管辖直接提供给他们的数据。OLE对这些第三方隐私实践不负责任。',
          class: 'span'
        },
        {
          value:
            '安全措施：我们实施行业标准的安全措施来保护您的个人数据。然而，无法保证100%的安全。您还应采取措施保护您的数据，如使用复杂的密码。我们的措施仅适用于OLE及其软件/网站。',
          class: 'span'
        },
        {
          value: '账户信息：通过编辑应用程序中的账户设置来更新您的个人数据。',
          class: 'span'
        },
        {
          value:
            '支付信息：对于捐款，我们需要详细信息，如全名、账单地址、账单邮政编码、账单国家、出生日期、购买金额、支付方式和卡片详情。',
          class: 'span'
        },
        {
          value:
            '推送通知：OLE可能会发送推送通知或提醒。您可以在设备设置（iOS）或通过应用程序（Android）调整通知设置。',
          class: 'span'
        },
        {
          value:
            '数据保留和删除：我们保留个人数据，直到服务所需或法律要求的时间。您可以通过联系我们请求数据删除，我们将根据适用法律处理此类请求。',
          class: 'span'
        },
        {
          value: 'OLE保留随时更改本隐私政策的权利。更改将会在软件/网站上更新。',
          class: 'text'
        },
        {
          value:
            '如果我们无意中收集到12岁以下儿童的数据，我们会立即删除这些信息。',
          class: 'text'
        },
        {
          value: '有关隐私权问题或请求，请通过ole77tv@gmail.com与我们联系。',
          class: 'text'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.m_privacy_policy_wrap {
  @apply pt-20px pb-40px;
  .privacy_policy_content {
    @apply py-20px px-40px bg-lightFirst rounded-10px;
    .h1 {
    }
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
    .span1 {
      @apply ml-40px;
    }
  }
}
</style>