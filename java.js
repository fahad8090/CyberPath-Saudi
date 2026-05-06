/* 
   ==================================================
   SYSTEM: Cyber Advisor Platform - FINAL INTEGRATION
   USER: Fahad | FOCUS: PDF Alignment & Cert Guide Fix
   ==================================================
*/

const text = "root@cyberpath:~# Saudi_Market_Analysis... Success!_";
let i = 0;

// 1. نظام الكتابة الآلي
function typeWriter() { 
    const el = document.getElementById("typewriter");
    if(el && i < text.length) { 
        el.innerHTML += text.charAt(i); 
        i++; 
        setTimeout(typeWriter, 80); 
    } 
}

// 2. معالجة التأثيرات البصرية
function handleScroll() {
    const fades = document.querySelectorAll(".fade");
    fades.forEach(el => { if(el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add("show"); });
}

function initNavMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if(!toggle || !menu) return;
    toggle.addEventListener('click', () => menu.classList.toggle('active'));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.classList.remove('active')));
    window.addEventListener('resize', () => { if(window.innerWidth > 900) menu.classList.remove('active'); });
}

// 3. نظام n8n للدردشة الذكية
async function sendToAI() {
    const aiInput = document.getElementById('ai-input'); 
    const aiMessages = document.getElementById('ai-messages');
    if(!aiInput || !aiMessages) return;
    const msg = aiInput.value.trim();
    if(!msg) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'ai-msg msg-user';
    userDiv.textContent = msg;
    aiMessages.appendChild(userDiv);
    aiInput.value = '';
    aiMessages.scrollTop = aiMessages.scrollHeight;

    try {
        const response = await fetch('https://azizhiqk.app.n8n.cloud/webhook-test/cyber-advisor', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message: msg, user: "Fahad" })
        });
        const data = await response.json();
        let botMsg = data.output || data.text || data.message || "عذراً، لم أستطع فهم الرد.";
        const botDiv = document.createElement('div');
        botDiv.className = 'ai-msg msg-bot';
        botDiv.textContent = botMsg;
        aiMessages.appendChild(botDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    } catch(e) { console.error(e); }
}

// 4. بيانات الشهادات الشاملة (لصفحة دليل الشهادات)
const certData = {
    // هجومي
    net: { cat: 'offensive', level: 'المستوى المبتدئ', title: "CompTIA Network+", price: "1,342 ر.س", mode: "عن بعد", org: "CompTIA", desc: "تأسيس صلب في الشبكات والبروتوكولات." },
    ejpt: { cat: 'offensive', level: 'مرحلة التأسيس', title: "eJPTv2", price: "934 ر.س", mode: "عملي", org: "INE Security", desc: "أول خطوة عملية في اختبار الاختراق." },
    pnpt: { cat: 'offensive', level: 'مستوى متوسط', title: "PNPT", price: "1,875 ر.س", mode: "عملي", org: "TCM Security", desc: "محاكاة واقعية لاختراق الشركات." },
    oscp: { cat: 'offensive', level: 'مرحلة الاحتراف', title: "OffSec OSCP", price: "6,184 ر.س", mode: "عملي", org: "OffSec", desc: "المعيار الذهبي للهكر الأخلاقي." },
    
    // دفاعي
    sec: { cat: 'defensive', level: 'المستوى المبتدئ', title: "CompTIA Security+", price: "1,470 ر.س", mode: "نظري", org: "CompTIA", desc: "المبادئ الأساسية لأمن المعلومات." },
    btl1: { cat: 'defensive', level: 'مرحلة التأسيس', title: "BTL1", price: "1,875 ر.س", mode: "عملي", org: "Security Blue Team", desc: "تدريب مكثف لمحللي الـ SOC." },
    cysa: { cat: 'defensive', level: 'مستوى متوسط', title: "CompTIA CySA+", price: "1,470 ر.س", mode: "عملي", org: "CompTIA", desc: "تحليل البيانات الأمنية والتهديدات." },
    gcih: { cat: 'defensive', level: 'مرحلة الاحتراف', title: "GIAC GCIH", price: "3,500 ر.س", mode: "عملي", org: "SANS", desc: "إدارة الحوادث والتعامل مع الهجمات." },

    // حوكمة
    itca: { cat: 'grc', level: 'المستوى المبتدئ', title: "ISACA ITCA", price: "1,125 ر.س", mode: "نظري", org: "ISACA", desc: "تأسيس الحوكمة وإدارة المخاطر." },
    cisa: { cat: 'grc', level: 'مرحلة التأسيس', title: "CISA Auditor", price: "2,850 ر.س", mode: "نظري", org: "ISACA", desc: "المعيار العالمي لمدققي النظم." },
    crisc: { cat: 'grc', level: 'مستوى متوسط', title: "CRISC", price: "2,850 ر.س", mode: "إداري", org: "ISACA", desc: "إدارة مخاطر نظم المعلومات." },
    cissp: { cat: 'grc', level: 'مرحلة الاحتراف', title: "CISSP", price: "2,808 ر.س", mode: "إداري", org: "ISC2", desc: "الشهادة القيادية الأعلى للإدارة." }
};

// 5. دالة عرض الشهادات (إصلاح صفحة الدليل)
function renderCerts() {
    const urlParams = new URLSearchParams(window.location.search);
    const userPath = urlParams.get('path'); 
    
    const recGrid = document.getElementById('recommendedGrid');
    const offGrid = document.getElementById('grid-offensive');
    const defGrid = document.getElementById('grid-defensive');
    const grcGrid = document.getElementById('grid-grc');

    // مسح المحتوى الحالي لتجنب التكرار
    if(recGrid) recGrid.innerHTML = "";
    if(offGrid) offGrid.innerHTML = "";
    if(defGrid) defGrid.innerHTML = "";
    if(grcGrid) grcGrid.innerHTML = "";

    Object.keys(certData).forEach(key => {
        const item = certData[key];
        const cardHtml = `
            <div class="course-card" onclick="showCertModal('${key}')">
                <span class="badge ${item.cat === 'offensive' ? 'badge-red' : (item.cat === 'defensive' ? 'badge-blue' : 'badge-green')}">${item.level}</span>
                <div class="course-title">${item.title}</div>
                <div class="course-desc">${item.desc}</div>
                <div class="meta-info">
                    <span><i class="fas fa-money-bill-wave"></i> ${item.price}</span>
                    <span><i class="fas fa-university"></i> ${item.org}</span>
                </div>
            </div>`;
        
        // عرض في قسم الموصى به بناءً على نتيجة الاختبار
        if (userPath && item.cat === userPath && recGrid) {
            document.getElementById('recommendedSection').style.display = 'block';
            recGrid.innerHTML += cardHtml;
        }

        // توزيع الشهادات على الشبكات حسب التخصص
        if(offGrid && item.cat === 'offensive') offGrid.innerHTML += cardHtml;
        if(defGrid && item.cat === 'defensive') defGrid.innerHTML += cardHtml;
        if(grcGrid && item.cat === 'grc') grcGrid.innerHTML += cardHtml;
    });
}

// 6. نظام الاختبار (Quiz)
let currentQuestionIndex = 0;
let quizScore = { red: 0, blue: 0, white: 0 };

const questions = [
    {q:"في وقت فراغك، ماذا تفضل أن تفعل؟", a:[["تأمين الشبكات وصد محاولات الدخول","blue"],["تفكيك البرامج واكتشاف ثغراتها","red"],["ترتيب ملفاتك وكتابة ملاحظات حول الخصوصية","white"]]},
    {q:"إذا واجهت نظاماً مقفلاً، ما هو أول دافع لديك؟", a:[["وضع قوانين تحدد من يحق له حمل المفتاح","white"],["البحث عن وسيلة ذكية لفك القفل","red"],["تقوية القفل والتأكد من عدم وجود نسخ مفاتيح","blue"]]},
    {q:"ما هو نوع المهام الذي يجذبك أكثر؟", a:[["اختبار الاختراق (Pentest)","red"],["الامتثال والإدارة (GRC)","white"],["الدفاع والمراقبة (SOC)","blue"]]},
    {q:"أي من هذه الأدوات تثير اهتمامك أكثر؟", a:[["أنظمة كشف التسلل وتحليل السجلات","blue"],["أطر العمل والمعايير العالمية","white"],["أدوات فحص المنافذ والثغرات","red"]]},
    {q:"كيف تتعامل مع المشاكل التقنية المعقدة؟", a:[["أفكر خارج الصندوق لإيجاد حل غير تقليدي","red"],["أوثق المشكلة وأضع خطة لمنع تكرارها","white"],["أحلل البيانات بدقة لمعرفة مصدر الخطأ","blue"]]},
    {q:"ما هي بيئة العمل التي تفضلها؟", a:[["عضو في غرفة عمليات أمنية","blue"],["مستشار مستقل أو صائد ثغرات","red"],["مدير أمن معلومات أو مدقق أنظمة","white"]]},
    {q:"ماذا تحب أن تقرأ في الأخبار التقنية؟", a:[["تحديثات القوانين والتشريعات الأمنية","white"],["تسريبات عن ثغرات يوم الصفر","red"],["طرق صد الهجمات الحديثة","blue"]]},
    {q:"ما هو هدفك النهائي في هذا المجال؟", a:[["أن أكون مدافعاً سيبرانياً للبنية التحتية","blue"],["أن أكون قائداً أمنياً يخطط للاستراتيجيات","white"],["أن أكون هكر أخلاقي محترف","red"]]}
];

function startQuiz() { currentQuestionIndex = 0; quizScore = { red: 0, blue: 0, white: 0 }; showQuestion(); }

function showQuestion() {
    const content = document.getElementById("quiz-content");
    const bar = document.getElementById("bar");
    if (!content) return;
    if (currentQuestionIndex >= questions.length) { displayResult(); return; }
    let q = questions[currentQuestionIndex];
    let html = `<div><div style="font-size:18px; margin-bottom:20px; font-weight:bold; text-align:center;">س${currentQuestionIndex + 1}: ${q.q}</div>`;
    q.a.forEach(ans => { html += `<button class="quiz-option-btn" onclick="submitAnswer('${ans[1]}')">${ans[0]}</button>`; });
    html += `</div>`;
    content.innerHTML = html;
    if(bar) bar.style.width = (currentQuestionIndex / questions.length * 100) + "%";
}

function submitAnswer(type) { quizScore[type]++; currentQuestionIndex++; showQuestion(); }

// 7. عرض النتائج وتحميل الـ PDF (مع تعديلات التنسيق المطلوبة)
function displayResult() {
    let total = questions.length;
    let r = Math.round(quizScore.red / total * 100);
    let b = Math.round(quizScore.blue / total * 100);
    let w = Math.round(quizScore.white / total * 100);
    let pathTitle = ""; let roadmapArr = []; let pathKey = "";

    if(r>=b && r>=w) {
        pathTitle = "خبير الاستجابة الهجومية واختبار الاختراق"; pathKey = "offensive";
        roadmapArr = [["المستوى المبتدئ", "Network+ / Security+"], ["مرحلة التأسيس", "eJPT Certificate"], ["مستوى متوسط", "PNPT / CEH Practical"], ["مرحلة الاحتراف", "OSCP Gold Standard"]];
    } else if(b>=r && b>=w) {
        pathTitle = "أخصائي حماية البنية التحتية والعمليات الأمنية"; pathKey = "defensive";
        roadmapArr = [["المستوى المبتدئ", "Security+ / CyberOps"], ["مرحلة التأسيس", "BTL1 Certification"], ["مستوى متوسط", "CySA+ Analysis"], ["مرحلة الاحتراف", "GCIH Incident Handler"]];
    } else {
        pathTitle = "مستشار استراتيجيات الحوكمة وإدارة المخاطر"; pathKey = "grc";
        roadmapArr = [["المستوى المبتدئ", "Security+ / ITCA"], ["مرحلة التأسيس", "CISA Auditor"], ["مستوى متوسط", "CRISC Risk Management"], ["مرحلة الاحتراف", "CISM / CISSP"]];
    }

    let roadmapHtml = roadmapArr.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.1); direction:rtl;">
            <span style="color:#00ffc3; font-weight:bold; width:40%; text-align:right;">${item[0]}</span>
            <span style="color:#fff; font-weight:500; width:60%; text-align:left; direction:ltr;">${item[1]}</span>
        </div>
    `).join("");

    const quizContent = document.getElementById("quiz-content");
    if(quizContent) {
        document.getElementById("quiz-title").innerText = "نتائج التحليل المهني";
        quizContent.innerHTML = `
            <div id="result-to-pdf" style="padding:40px; background:#070a0f; color:#fff; direction:rtl; font-family:Arial, sans-serif;">
                <div style="text-align:center; border-bottom:2px solid #00ffc3; padding-bottom:20px; margin-bottom:40px;">
                    <h2 style="color:#00ffc3; margin:0; font-size:28px;">تقرير الكفاءة السيبرانية</h2>
                    <p style="color:#888; font-size:14px; margin-top:10px;">إعداد: فهد متعب السبيعي - مستشارك السيبراني</p>
                </div>
                
                <div style="text-align:center; margin-bottom:40px;">
                    <div style="color:#00d4ff; font-size:20px; font-weight:bold; margin-bottom:10px;">المسار المقترح:</div>
                    <div style="color:#fff; font-size:24px; font-weight:bold;">${pathTitle}</div>
                </div>
                
                <div style="margin-bottom:30px; text-align:center;">
                    <div style="font-size:16px; color:#fff; margin-bottom:5px;">مؤشر المهارات الهجومية</div>
                    <div style="font-size:14px; color:#ff4b5c; margin-bottom:8px; font-weight:bold;">${r}%</div>
                    <div style="height:14px; background:#111; border-radius:7px; overflow:hidden; position:relative; width:100%;">
                        <div style="position:absolute; right:0; top:0; width:${r}%; height:100%; background:#ff4b5c;"></div>
                    </div>
                </div>

                <div style="margin-bottom:30px; text-align:center;">
                    <div style="font-size:16px; color:#fff; margin-bottom:5px;">مؤشر العمليات الدفاعية</div>
                    <div style="font-size:14px; color:#00d4ff; margin-bottom:8px; font-weight:bold;">${b}%</div>
                    <div style="height:14px; background:#111; border-radius:7px; overflow:hidden; position:relative; width:100%;">
                        <div style="position:absolute; right:0; top:0; width:${b}%; height:100%; background:#00d4ff;"></div>
                    </div>
                </div>

                <div style="margin-bottom:40px; text-align:center;">
                    <div style="font-size:16px; color:#fff; margin-bottom:5px;">مؤشر الحوكمة والامتثال</div>
                    <div style="font-size:14px; color:#00ffc3; margin-bottom:8px; font-weight:bold;">${w}%</div>
                    <div style="height:14px; background:#111; border-radius:7px; overflow:hidden; position:relative; width:100%;">
                        <div style="position:absolute; right:0; top:0; width:${w}%; height:100%; background:#00ffc3;"></div>
                    </div>
                </div>

                <div style="background:rgba(255,255,255,0.03); padding:25px; border-radius:15px; border:1px solid rgba(0,255,195,0.3);">
                    <div style="color:#00ffc3; font-weight:bold; margin-bottom:20px; font-size:18px;">خطة التطوير المهني المقترحة:</div>
                    <div>${roadmapHtml}</div>
                </div>
            </div>
            <div style="display: flex; gap: 15px; margin-top: 25px; direction:rtl;">
                <button class="pdf-btn" style="flex:1; background:#00ffc3; color:#000;" onclick="downloadQuizPDF()">تحميل PDF</button>
                <button class="pdf-btn" style="flex:1; background:#00d4ff; color:#000;" onclick="window.location.href='page3.html?path=${pathKey}'">دليل الشهادات</button>
            </div>
        `;
        if(document.getElementById("bar")) document.getElementById("bar").style.width = "100%";
    }
}

function downloadQuizPDF() {
    const element = document.getElementById('result-to-pdf');
    if(!element) return;
    const opt = {
        margin: 10,
        filename: 'Cyber_Report_Fahad.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#070a0f' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

// 8. تهيئة التطبيق عند التحميل
window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    typeWriter();
    renderCerts();
    initNavMenu();
    window.addEventListener("scroll", handleScroll);

    // ربط نافذة الذكاء الاصطناعي
    const aiBtn = document.getElementById('ai-chat-btn');
    if(aiBtn) aiBtn.onclick = () => {
        const win = document.getElementById('ai-window');
        if(win) win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
    };

    const aiInput = document.getElementById('ai-input');
    if(aiInput) aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendToAI(); });
});
