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
                        '《 Câu lạc bộ  trực tuyến Bí kíp Baccarat》 – Nền tảng chuyên nghiệp thực sự dành cho người chơi!',
                    class: 'title'
                },
                {
                    value: 'Được xây dựng bởi sự hợp tác mạnh mẽ giữa nhiều cao thủ baccarat chuyên nghiệp và các ông lớn trong ngành, 《CLB Trực tuyến Bí kíp Baccarat》 không chỉ là một buổi phát sóng trực tiếp, mà còn là một lớp học công khai về trí tuệ và chiến lược.',
                    class: 'text'
                },

                {
                    value: '1. Chúng tôi là ai?',
                    class: 'text'
                },
                {
                    value: 'Chúng tôi là những chiến binh thực chiến hiểu rõ luật chơi, là những người tính toán xác suất một cách chuẩn xác, và hơn hết là một cộng đồng người chơi cùng bạn sát cánh trên bàn cược.',
                    class: 'span'
                },
                {
                    value: '2. Chúng tôi phát sóng những gì?',
                    class: 'text'
                },
                {
                    value: 'Ván đấu thực tế: Bàn chơi thật, bình luận trực tiếp, vừa đánh vừa giảng, nắm bắt tinh hoa của từng ván bài.',
                    class: 'span'
                },
                {
                    value: 'Phân tích chiến lược: Giải mã logic toán học phía sau cửa Banker và Player, truyền dạy phương pháp đặt cược có hệ thống và kỹ thuật quản lý vốn.',
                    class: 'span'
                },
                {
                    value: 'Giảng dạy tương tác: Phòng chat quy tụ cao thủ, streamer giải đáp trực tiếp, không để câu hỏi qua đêm, kinh nghiệm được chia sẻ tức thì.',
                    class: 'span'
                },
                {
                    value: '3. Vì sao chọn chúng tôi?',
                    class: 'text'
                },

                {
                    value: 'Dàn streamer uy tín: Tất cả đều là người chơi dày dạn kinh nghiệm thực chiến, nói không với tán gẫu vô nghĩa.',
                    class: 'span'
                },
                {
                    value: 'Cộng đồng tương tác cao: Hàng ngày thảo luận các tình huống thực tế, streamer giải đáp sâu từng câu hỏi của người xem, nội dung chất lượng liên tục.',
                    class: 'span'
                },

                {
                    value: '4. Tại đây, bạn nhận được:',
                    class: 'text'
                },
                {
                    value: 'Chiến lược thay vì cờ bạc mù quáng',
                    class: 'span'
                },

                {
                    value: 'Sự tiến bộ liên tục thay vì trúng thưởng ngẫu nhiên',
                    class: 'span'
                },
                {
                    value: 'Tham gia《CLB Trực tuyến Bí kíp  Baccarat》',
                    class: 'text'
                },
                {
                    value: 'Đừng chỉ dựa vào may mắn – hãy chơi một cách chuyên nghiệp,',
                    class: 'text'
                },
                {
                    value: 'Từ người xem bị động đến người làm chủ bàn chơi,',
                    class: 'text'
                },
                {
                    value: 'Hiểu đúng – mới thắng vững!',
                    class: 'text'
                },

            ]
        },
        IDClauseList() {
            return [
                {
                    value:
                        '《Klub Online Rahasia Baccarat》 – Platform profesional sejati untuk para pemain!',
                    class: 'title'
                },
                {
                    value: 'Dibangun melalui kolaborasi kuat antara para master baccarat profesional dan tokoh besar di industri ini, 《Klub Online Rahasia Baccarat》 bukan hanya siaran langsung, tapi juga kelas terbuka tentang kecerdasan dan strategi.',
                    class: 'text'
                },
                {
                    value: '1. Siapa kami?',
                    class: 'text'
                },
                {
                    value: 'Kami adalah para petarung berpengalaman yang memahami aturan permainan dengan baik, menghitung probabilitas secara akurat, dan yang terpenting, adalah komunitas pemain yang berdiri bersama Anda di meja taruhan.',
                    class: 'span'
                },
                {
                    value: '2. Apa yang kami siarkan?',
                    class: 'text'
                },
                {
                    value: 'Pertandingan nyata: Meja asli, komentar langsung, bermain sambil mengajar, menangkap esensi setiap putaran permainan.',
                    class: 'span'
                },
                {
                    value: 'Analisis strategi: Menguraikan logika matematika di balik pilihan Banker dan Player, mengajarkan metode taruhan sistematis dan teknik manajemen modal.',
                    class: 'span'
                },
                {
                    value: 'Pembelajaran interaktif: Ruang obrolan tempat para master berkumpul, streamer menjawab secara langsung, tidak ada pertanyaan yang dibiarkan menggantung, pengalaman dibagikan secara instan.',
                    class: 'span'
                },
                {
                    value: '3. Mengapa memilih kami?',
                    class: 'text'
                },
                {
                    value: 'Tim streamer terpercaya: Semua adalah pemain berpengalaman dengan jam terbang tinggi, tidak ada obrolan kosong yang tidak berguna.',
                    class: 'span'
                },
                {
                    value: 'Komunitas dengan interaksi tinggi: Diskusi harian tentang situasi nyata, streamer menjawab secara mendalam setiap pertanyaan penonton, konten berkualitas tanpa henti.',
                    class: 'span'
                },
                {
                    value: '4. Di sini Anda akan mendapatkan:',
                    class: 'text'
                },
                {
                    value: 'Strategi, bukan perjudian buta',
                    class: 'span'
                },
                {
                    value: 'Kemajuan berkelanjutan, bukan kemenangan acak',
                    class: 'span'
                },
                {
                    value: 'Bergabunglah dengan 《Klub Online Rahasia Baccarat》',
                    class: 'text'
                },
                {
                    value: 'Jangan hanya mengandalkan keberuntungan – bermainlah secara profesional,',
                    class: 'text'
                },
                {
                    value: 'Dari penonton pasif menjadi penguasa meja permainan,',
                    class: 'text'
                },
                {
                    value: 'Pahami dengan benar – baru bisa menang dengan mantap!',
                    class: 'text'
                }

            ]

        },
        THClauseList() {
            return [
                {
                    value: '《คลับออนไลน์สูตรลับบาคาร่า》 – แพลตฟอร์มมืออาชีพสำหรับผู้เล่นอย่างแท้จริง!',
                    class: 'title'
                },
                {
                    value: 'สร้างขึ้นจากความร่วมมือระหว่างเซียนบาคาร่าระดับมืออาชีพและผู้นำในวงการ 《คลับออนไลน์สูตรลับบาคาร่า》 ไม่ใช่แค่การถ่ายทอดสด แต่คือชั้นเรียนสาธารณะเกี่ยวกับกลยุทธ์และความคิด',
                    class: 'text'
                },
                {
                    value: '1. พวกเราคือใคร?',
                    class: 'text'
                },
                {
                    value: 'เราคือนักรบสนามจริงที่เข้าใจกติกาอย่างลึกซึ้ง คำนวณความน่าจะเป็นอย่างแม่นยำ และเหนือสิ่งอื่นใด เราคือชุมชนผู้เล่นที่เคียงข้างคุณบนโต๊ะเดิมพัน',
                    class: 'span'
                },
                {
                    value: '2. เราถ่ายทอดอะไร?',
                    class: 'text'
                },
                {
                    value: 'เกมจริง: โต๊ะจริง คอมเมนต์สด เล่นไปสอนไป เข้าใจแก่นแท้ของแต่ละตา',
                    class: 'span'
                },
                {
                    value: 'วิเคราะห์กลยุทธ์: ถอดรหัสตรรกะเบื้องหลังฝั่ง Banker และ Player ถ่ายทอดวิธีเดิมพันอย่างเป็นระบบและเทคนิคบริหารเงินทุน',
                    class: 'span'
                },
                {
                    value: 'การสอนแบบโต้ตอบ: ห้องแชทรวมเซียน สตรีมเมอร์ตอบคำถามสด ไม่มีคำถามไหนค้างคืน ประสบการณ์แบ่งปันทันที',
                    class: 'span'
                },
                {
                    value: '3. ทำไมต้องเลือกเรา?',
                    class: 'text'
                },
                {
                    value: 'สตรีมเมอร์น่าเชื่อถือ: ทุกคนเป็นผู้เล่นมากประสบการณ์ ไม่พูดเล่นไร้สาระ',
                    class: 'span'
                },
                {
                    value: 'ชุมชนโต้ตอบสูง: ถกเถียงสถานการณ์จริงทุกวัน สตรีมเมอร์ตอบลึกทุกคำถาม คอนเทนต์คุณภาพไม่หยุด',
                    class: 'span'
                },
                {
                    value: '4. ที่นี่คุณจะได้รับ:',
                    class: 'text'
                },
                {
                    value: 'กลยุทธ์แทนการพนันแบบไร้เหตุผล',
                    class: 'span'
                },
                {
                    value: 'ความก้าวหน้าอย่างต่อเนื่อง แทนการหวังโชค',
                    class: 'span'
                },
                {
                    value: 'เข้าร่วม《คลับออนไลน์สูตรลับบาคาร่า》',
                    class: 'text'
                },
                {
                    value: 'อย่าพึ่งแค่โชค – จงเล่นอย่างมืออาชีพ',
                    class: 'text'
                },
                {
                    value: 'จากผู้ชมที่เฉยชา สู่เจ้าของโต๊ะพนัน',
                    class: 'text'
                },
                {
                    value: 'เข้าใจให้ถูก – ถึงจะชนะได้อย่างมั่นคง!',
                    class: 'text'
                }

            ]
        },
        ENClauseList() {
            return [
                {
                    value: '《Baccarat Strategy Online Club》 – A truly professional platform for players!',
                    class: 'title'
                },
                {
                    value: 'Built through strong collaboration between professional baccarat masters and industry leaders, 《Baccarat Strategy Online Club》 is not just a livestream, but an open class of intelligence and strategy.',
                    class: 'text'
                },
                {
                    value: '1. Who are we?',
                    class: 'text'
                },
                {
                    value: 'We are real-world warriors who know the game rules, calculate probabilities precisely, and most importantly, a community of players standing with you at the table.',
                    class: 'span'
                },
                {
                    value: '2. What do we broadcast?',
                    class: 'text'
                },
                {
                    value: 'Live gameplay: Real tables, live commentary, playing and teaching at the same time, capturing the essence of each hand.',
                    class: 'span'
                },
                {
                    value: 'Strategy analysis: Decode the math behind Banker and Player bets, teach systematic betting methods and bankroll management techniques.',
                    class: 'span'
                },
                {
                    value: 'Interactive teaching: Chatroom with top players, streamers answer questions live, no unanswered questions overnight, instant experience sharing.',
                    class: 'span'
                },
                {
                    value: '3. Why choose us?',
                    class: 'text'
                },
                {
                    value: 'Trusted streamers: All are experienced players with real-world knowledge – no meaningless chatter.',
                    class: 'span'
                },
                {
                    value: 'Highly interactive community: Daily real-case discussions, streamers dive deep into questions, constant high-quality content.',
                    class: 'span'
                },
                {
                    value: '4. Here you get:',
                    class: 'text'
                },
                {
                    value: 'Strategy over blind gambling',
                    class: 'span'
                },
                {
                    value: 'Consistent improvement over random winnings',
                    class: 'span'
                },
                {
                    value: 'Join 《Baccarat Strategy Online Club》',
                    class: 'text'
                },
                {
                    value: 'Don’t rely on luck – play like a pro,',
                    class: 'text'
                },
                {
                    value: 'From passive viewer to table master,',
                    class: 'text'
                },
                {
                    value: 'Understand clearly – then win steadily!',
                    class: 'text'
                }


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