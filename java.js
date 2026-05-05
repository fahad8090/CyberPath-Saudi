/* --- وظائف الموقع العامة --- */
const text = "root@cyberpath:~# Saudi_Market_Analysis... Success!_";
let i = 0;

function typeWriter() { 
    if (i < text.length) { 
        const el = document.getElementById("typewriter");
        if(el) { el.innerHTML += text.charAt(i); i++; setTimeout(typeWriter, 80); }
    } 
}

function scrollToFaq() { 
    const el = document.getElementById('faq-section');
    if(el) el.scrollIntoView({ behavior: 'smooth' }); 
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

function toggleFaq(el) {
    const p = el.querySelector('p');
    const allP = document.querySelectorAll('.faq-item p');
    const allItems = document.querySelectorAll('.faq-item');
    allP.forEach(item => { if(item !== p) item.style.display = 'none'; });
    allItems.forEach(item => { if(item !== el) item.classList.remove('active'); });
    const isVisible = p.style.display === 'block';
    p.style.display = isVisible ? 'none' : 'block';
    el.classList.toggle('active', !isVisible);
}

function handleScroll() {
    const fades = document.querySelectorAll(".fade");
    fades.forEach(el => { if(el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add("show"); });
    const backBtn = document.getElementById("backToTop");
    if(backBtn) {
        if (window.pageYOffset > 300) backBtn.classList.add("show"); 
        else backBtn.classList.remove("show");
    }
}

/* --- وظائف التحكم في AI Chat (محدثة برابط n8n Cloud) --- */
const aiBtn = document.getElementById('ai-chat-btn');
const aiWindow = document.getElementById('ai-window');
const closeAi = document.getElementById('close-ai');

if(aiBtn) aiBtn.onclick = () => { aiWindow.style.display = aiWindow.style.display === 'flex' ? 'none' : 'flex'; };
if(closeAi) closeAi.onclick = () => { aiWindow.style.display = 'none'; };

async function sendToAI() {
    const aiInput = document.getElementById('ai-input'); 
    const aiMessages = document.getElementById('ai-messages');
    if(!aiInput || !aiMessages) return;
    
    const msg = aiInput.value.trim();
    if(!msg) return;

    // إضافة رسالة المستخدم للواجهة
    const userDiv = document.createElement('div');
    userDiv.className = 'ai-msg msg-user';
    userDiv.textContent = msg;
    aiMessages.appendChild(userDiv);
    aiInput.value = '';
    aiMessages.scrollTop = aiMessages.scrollHeight;

    try {
        // الربط مع الرابط الرسمي الجديد
        const response = await fetch('https://azizhiqk.app.n8n.cloud/webhook-test/cyber-advisor', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message: msg, user: "Fahad" })
        });
        
        const data = await response.json();
        let botMsg = "عذراً، لم أستطع فهم الرد.";
        
        if (typeof data === 'string') {
            botMsg = data;
        } else if (data.output) {
            botMsg = data.output;
        } else if (data.text) {
            botMsg = data.text;
        } else if (data.message) {
            botMsg = data.message;
        } else if (Array.isArray(data) && data.length > 0) {
            botMsg = data[0].output || data[0].text || JSON.stringify(data[0]);
        }

        const botDiv = document.createElement('div');
        botDiv.className = 'ai-msg msg-bot';
        botDiv.textContent = botMsg;
        aiMessages.appendChild(botDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
    } catch(e) {
        const errDiv = document.createElement('div');
        errDiv.className = 'ai-msg msg-bot';
        errDiv.textContent = "خطأ: تأكد من تفعيل الـ Webhook في n8n cloud والضغط على 'Listen for Test Event'.";
        aiMessages.appendChild(errDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
}

// تفعيل المستمعات العامة
window.addEventListener("scroll", handleScroll);
window.addEventListener("load", () => {
    typeWriter();
    handleScroll();
    
    const aiInput = document.getElementById('ai-input');
    if(aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendToAI();
        });
    }
});

// الجافا سكربت المخصص لـ البيج 2 

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

let currentQuestionIndex = 0;
let quizScore = { red: 0, blue: 0, white: 0 };

function startQuiz() { showQuestion(); }

function showQuestion() {
    const content = document.getElementById("quiz-content");
    const bar = document.getElementById("bar");
    const title = document.getElementById("quiz-title");

    if (currentQuestionIndex >= questions.length) { displayResult(); return; }
    
    let q = questions[currentQuestionIndex];
    let html = `<div><div style="font-size:18px; margin-bottom:20px; font-weight:bold;">س${currentQuestionIndex + 1}: ${q.q}</div>`;
    q.a.forEach(ans => {
        html += `<button class="quiz-option-btn" onclick="submitAnswer('${ans[1]}')">${ans[0]}</button>`;
    });
    html += `</div>`;
    
    if(content) content.innerHTML = html;
    if(bar) bar.style.width = (currentQuestionIndex / questions.length * 100) + "%";
}

function submitAnswer(type) {
    quizScore[type]++;
    currentQuestionIndex++;
    showQuestion();
}

function displayResult() {
    let total = questions.length;
    let r = Math.round(quizScore.red / total * 100);
    let b = Math.round(quizScore.blue / total * 100);
    let w = Math.round(quizScore.white / total * 100);
    
    let pathTitle = "";
    let roadmapHtml = "";
    let pathKey = "";

    if(r>=b && r>=w) {
        pathTitle = "خبير الاستجابة الهجومية واختبار الاختراق";
        pathKey = "offensive";
        roadmapHtml = `
            <div class="step"><span class="step-label">المستوى المبتدئ:</span><span class="cert-name">Network+ / Security+</span></div>
            <div class="step"><span class="step-label">مرحلة التأسيس:</span><span class="cert-name">eJPT Certificate</span></div>
            <div class="step"><span class="step-label">مستوى متوسط:</span><span class="cert-name">PNPT / CEH Practical</span></div>
            <div class="step"><span class="step-label">مرحلة الاحتراف:</span><span class="cert-name">OSCP Gold Standard</span></div>`;
    } else if(b>=r && b>=w) {
        pathTitle = "أخصائي حماية البنية التحتية والعمليات الأمنية";
        pathKey = "defensive";
        roadmapHtml = `
            <div class="step"><span class="step-label">المستوى المبتدئ:</span><span class="cert-name">Security+ / CyberOps</span></div>
            <div class="step"><span class="step-label">مرحلة التأسيس:</span><span class="cert-name">BTL1 Certification</span></div>
            <div class="step"><span class="step-label">مستوى متوسط:</span><span class="cert-name">CySA+ Analysis</span></div>
            <div class="step"><span class="step-label">مرحلة الاحتراف:</span><span class="cert-name">GCIH Incident Handler</span></div>`;
    } else {
        pathTitle = "مستشار استراتيجيات الحوكمة وإدارة المخاطر الرقمية";
        pathKey = "grc";
        roadmapHtml = `
            <div class="step"><span class="step-label">المستوى المبتدئ:</span><span class="cert-name">Security+ / ITCA</span></div>
            <div class="step"><span class="step-label">مرحلة التأسيس:</span><span class="cert-name">CISA Auditor</span></div>
            <div class="step"><span class="step-label">مستوى متوسط:</span><span class="cert-name">CRISC Risk Management</span></div>
            <div class="step"><span class="step-label">مرحلة الاحتراف:</span><span class="cert-name">CISM / CISSP</span></div>`;
    }

    document.getElementById("quiz-title").innerText = "نتائج التحليل المهني";
    document.getElementById("quiz-content").innerHTML = `
        <div id="result-to-pdf">
            <div class="pdf-header">
                <h2 style="color:var(--accent); margin:0;">تقرير الكفاءة السيبرانية</h2>
                <p style="font-size:12px; color:var(--muted); margin-top:5px;">تحليل المسار المهني المتوافق مع رؤية 2030</p>
            </div>
            <h4 style="text-align:center; color:var(--blue); margin-bottom:25px; line-height:1.4;">المسار المقترح: <br>${pathTitle}</h4>
            <div class="result-stat">
                <div style="display:flex; justify-content:space-between; font-size:13px;"><span>مؤشر المهارات الهجومية</span><span>${r}%</span></div>
                <div class="bar-result"><div class="fill" style="width:${r}%; background:var(--red)"></div></div>
            </div>
            <div class="result-stat">
                <div style="display:flex; justify-content:space-between; font-size:13px;"><span>مؤشر العمليات الدفاعية</span><span>${b}%</span></div>
                <div class="bar-result"><div class="fill" style="width:${b}%; background:var(--blue)"></div></div>
            </div>
            <div class="result-stat">
                <div style="display:flex; justify-content:space-between; font-size:13px;"><span>مؤشر الحوكمة والامتثال</span><span>${w}%</span></div>
                <div class="bar-result"><div class="fill" style="width:${w}%; background:var(--green)"></div></div>
            </div>
            <div class="roadmap-card">
                <p style="margin:0 0 15px 0; font-weight:bold; color:var(--accent); border-bottom:1px solid rgba(0,255,195,0.2); padding-bottom:10px;">خطة التطوير المهني المقترحة:</p>
                ${roadmapHtml}
            </div>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="pdf-btn" style="flex: 1;" onclick="downloadQuizPDF()"> تحميل التقرير PDF</button>
            <button class="pdf-btn" style="flex: 1; background: var(--blue);" onclick="window.location.href='page3.html?path=${pathKey}'"> الشهادات التفصيلية </button>
        </div>
        <div style="text-align:center; margin-top:20px;">
            <a href="index.html" class="ui-btn"><i class="fas fa-home"></i> <span>الرئيسية</span></a>
        </div>
    `;
    document.getElementById("bar").style.width = "100%";
}

function downloadQuizPDF() {
    const element = document.getElementById('result-to-pdf');
    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'Cyber_Report_Fahad.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, backgroundColor: '#070a0f' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

/* --- بيانات ومنطق دليل الشهادات (Page 3) --- */

const certData = {
    net: { cat: 'offensive', level: 'مبتدئ', icon: 'fa-network-wired', title: "CompTIA Network+", price: "1,342 ر.س", mode: "عن بعد", org: "CompTIA", desc: "تأسيس صلب في الشبكات والبروتوكولات ونظام OSI Model.", longDesc: "تعتبر هذه الشهادة حجر الأساس لأي متخصص أمن سيبراني هجومي، حيث توفر فهماً عميقاً لكيفية انتقال البيانات واكتشاف ثغرات الشبكة الأساسية.", link: "#" },
    ejpt: { cat: 'offensive', level: 'تأسيس', icon: 'fa-laptop-code', title: "eJPTv2", price: "934 ر.س", mode: "عملي", org: "INE Security", desc: "أول خطوة عملية حقيقية في عالم اختبار الاختراق.", longDesc: "شهادة عملية 100% تدربك على استخدام أدوات Kali Linux، المسح، واستغلال الثغرات البسيطة في بيئة مختبرية حقيقية.", link: "#" },
    pnpt: { cat: 'offensive', level: 'متوسط', icon: 'fa-user-ninja', title: "PNPT", price: "1,875 ر.س", mode: "عملي", org: "TCM Security", desc: "محاكاة واقعية لاختراق شركة من الصفر حتى التقرير.", longDesc: "تركز الشهادة على اختبار الاختراق الخارجي والداخلي واختراق Active Directory، مع تقديم عرض مرئي للنتائج أمام لجنة مختصة.", link: "#" },
    oscp: { cat: 'offensive', level: 'محترف', icon: 'fa-skull-crossbones', title: "OffSec OSCP", price: "6,184 ر.س", mode: "عملي مراقب", org: "OffSec", desc: "المعيار الذهبي والشهادة الأكثر شهرة للهجوميين.", longDesc: "اختبار مدته 24 ساعة يتطلب اختراق مجموعة من السيرفرات يدوياً بدون أدوات آلية، مما يثبت جدارتك الاحترافية العالية.", link: "#" },
    sec: { cat: 'defensive', level: 'مبتدئ', icon: 'fa-shield-alt', title: "CompTIA Security+", price: "1,470 ر.س", mode: "نظري/عملي", org: "CompTIA", desc: "الشهادة الأكثر طلباً لمدخلي البيانات والمبتدئين في الأمن.", longDesc: "تغطي المبادئ الأساسية لأمن الشبكات، إدارة المخاطر، والامتثال، وهي تذكرة دخولك الأولى لسوق العمل السيبراني.", link: "#" },
    btl1: { cat: 'defensive', level: 'تأسيس', icon: 'fa-user-shield', title: "BTL1", price: "1,875 ر.س", mode: "عملي", org: "Security Blue Team", desc: "تدريب مكثف على أدوات محللي الـ SOC.", longDesc: "ستتعلم كيفية تحليل السجلات (Logs)، التحقيق الجنائي الرقمي البسيط، والاستجابة للحوادث باستخدام أدوات احترافية مثل Splunk.", link: "#" },
    cysa: { cat: 'defensive', level: 'متوسط', icon: 'fa-search-plus', title: "CompTIA CySA+", price: "1,470 ر.س", mode: "نظري/عملي", org: "CompTIA", desc: "تحليل البيانات الأمنية واكتشاف التهديدات المتقدمة.", longDesc: "تركز على الدفاع النشط وتحليل السلوكيات المشبوهة داخل الشبكة باستخدام تقنيات مراقبة متطورة.", link: "#" },
    gcih: { cat: 'defensive', level: 'محترف', icon: 'fa-briefcase-medical', title: "GIAC GCIH", price: "3,500 ر.س", mode: "عملي", org: "GIAC", desc: "إدارة الحوادث واكتشاف الاختراقات والتعامل مع الهجمات.", longDesc: "شهادة رفيعة المستوى تركز على كيفية التعامل مع الهجمات الحية وإغلاق الثغرات أثناء وقوع الاختراق لتقليل الخسائر.", link: "#" },
    itca: { cat: 'grc', level: 'مبتدئ', icon: 'fa-file-invoice', title: "ISACA ITCA", price: "1,125 ر.س", mode: "نظري", org: "ISACA", desc: "تأسيس الحوكمة والتدقيق وإدارة المخاطر التقنية.", longDesc: "مثالية للمهتمين بالجانب الإداري والرقابي، حيث تشرح كيفية مواءمة أمن المعلومات مع أهدف المنظمة القانونية والتجارية.", link: "#" },
    cisa: { cat: 'grc', level: 'تأسيس', icon: 'fa-clipboard-check', title: "CISA Auditor", price: "2,850 ر.س", mode: "نظري", org: "ISACA", desc: "المعيار العالمي الأول لمدققي نظم المعلومات.", longDesc: "تؤهلك لتكون مدققاً معتمداً قادراً على تقييم فعالية الضوابط الأمنية داخل الشركات الكبرى وضمان الامتثال للمعايير الدولية.", link: "#" },
    cissp: { cat: 'grc', level: 'محترف', icon: 'fa-crown', title: "CISSP", price: "2,808 ر.س", mode: "إداري", org: "ISC2", desc: "الشهادة القيادية الأعلى لإدارة الأمن السيبراني.", longDesc: "تتطلب خبرة 5 سنوات وتغطي 8 مجالات أمنية واسعة، وهي الشهادة التي يحملها عادةً مدراء أمن المعلومات (CISO).", link: "#" }
};

function renderCerts() {
    const urlParams = new URLSearchParams(window.location.search);
    const userPath = urlParams.get('path'); 
    
    const recGrid = document.getElementById('recommendedGrid');
    const offGrid = document.getElementById('grid-offensive');
    const defGrid = document.getElementById('grid-defensive');
    const grcGrid = document.getElementById('grid-grc');

    if(!recGrid) return; // لضمان عدم التنفيذ إلا في صفحة الدليل

    Object.keys(certData).forEach(key => {
        const item = certData[key];
        const cardHtml = createCertCard(item, key);
        
        if (userPath && item.cat === userPath) {
            document.getElementById('recommendedSection').style.display = 'block';
            recGrid.innerHTML += cardHtml;
        }
        
        if(item.cat === 'offensive') offGrid.innerHTML += cardHtml;
        else if(item.cat === 'defensive') defGrid.innerHTML += cardHtml;
        else if(item.cat === 'grc') grcGrid.innerHTML += cardHtml;
    });
}

function createCertCard(item, key) {
    const badgeClass = item.cat === 'offensive' ? 'badge-red' : (item.cat === 'defensive' ? 'badge-blue' : 'badge-green');
    return `<div class="course-card" data-level="${item.level}" data-title="${item.title}" onclick="showCertModal('${key}')">
        <span class="badge ${badgeClass}">${item.level}</span>
        <div class="course-title">${item.title}</div>
        <div class="course-desc">${item.desc}</div>
        <div class="meta-info"><span><i class="fas fa-microchip"></i> ${item.mode}</span><span>${item.price}</span></div>
    </div>`;
}

function applyFilters() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const selectedLevels = Array.from(document.querySelectorAll('#filterDropdown input:checked')).map(i => i.value);
    document.querySelectorAll('.course-card').forEach(card => {
        const matchesSearch = card.getAttribute('data-title').toLowerCase().includes(term);
        const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(card.getAttribute('data-level'));
        card.classList.toggle('hidden', !(matchesSearch && matchesLevel));
    });
}

function toggleFilter() { document.getElementById('filterDropdown').classList.toggle('show'); }

function showCertModal(key) {
    const item = certData[key];
    document.getElementById('modalContent').innerHTML = `
        <div class="modal-header-info">
            <div class="modal-icon"><i class="fas ${item.icon}"></i></div>
            <div><h2 style="margin:0; color:var(--accent);">${item.title}</h2><span style="font-size:14px; color:var(--muted);">${item.org}</span></div>
        </div>
        <div class="modal-details">
            <div class="detail-item"><i class="fas fa-chart-line"></i> <span>المستوى: <b>${item.level}</b></span></div>
            <div class="detail-item"><i class="fas fa-tag"></i> <span>السعر: <b>${item.price}</b></span></div>
            <div class="detail-item"><i class="fas fa-desktop"></i> <span>النمط: <b>${item.mode}</b></span></div>
            <div class="detail-item"><i class="fas fa-certificate"></i> <span>الجهة: <b>${item.org}</b></span></div>
        </div>
        <div style="margin-bottom:30px;"><h4 style="color:var(--accent); margin-bottom:10px;">عن هذه الشهادة:</h4><p style="font-size:15px; color:var(--text); line-height:1.8;">${item.longDesc}</p></div>
        <a href="${item.link}" class="register-btn"><i class="fas fa-external-link-alt"></i> تسجيل في الدورة / الاختبار</a>`;
    document.getElementById('infoModal').style.display = 'block';
}

function closeCertModal() { document.getElementById('infoModal').style.display = 'none'; }

// استدعاء التحميل الابتدائي
window.addEventListener('DOMContentLoaded', renderCerts);


// كود جافا سكريبت لربط زر المدربين بالـ n8n cloud المحدث
async function sendData() {
    // 1. نجمع البيانات من الخانات
    const trainerData = {
        name: document.getElementById('trainer-name').value,
        email: document.getElementById('trainer-email').value,
        specialty: document.getElementById('trainer-specialty').value
    };

    // 2. نرسلها للـ n8n السحابي
    try {
        const response = await fetch('https://azizhiqk.app.n8n.cloud/webhook-test/cyber-advisor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trainerData),
        });

        if (response.ok) {
            alert('تم إرسال بياناتك بنجاح، سيتواصل معك المستشار قريباً!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ أثناء الإرسال، يرجى التأكد من تشغيل الـ Webhook.');
    }
}
