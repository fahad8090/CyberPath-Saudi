/* 
   ==================================================
   SYSTEM: Cyber Advisor Platform - FINAL INTEGRATION
   USER:  | FOCUS: PDF Alignment & Cert Guide Fix
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

function showAllFades() {
    const fades = document.querySelectorAll(".fade");
    fades.forEach(el => el.classList.add("show"));
}

function toggleFaq(element) {
    element.classList.toggle('active');
}

function toggleFilter() {
    const dropdown = document.getElementById('filterDropdown');
    if(dropdown) dropdown.classList.toggle('show');
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedLevels = Array.from(document.querySelectorAll('#filterDropdown input:checked')).map(cb => cb.value);
    
    // البحث في جميع أنواع البطاقات (prototype-card و course-card)
    const prototypeCards = document.querySelectorAll('.prototype-card');
    const courseCards = document.querySelectorAll('.course-card');
    const allCards = [...prototypeCards, ...courseCards];
    
    allCards.forEach(card => {
        const title = card.querySelector('.title, .course-title')?.textContent.toLowerCase() || '';
        const badge = card.querySelector('.badge');
        const level = badge?.textContent.trim() || '';
        
        const matchesSearch = title.includes(searchTerm);
        const matchesFilter = selectedLevels.length === 0 || selectedLevels.includes(level);
        
        card.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
    });
}

function initNavMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if(!toggle || !menu) return;
    toggle.addEventListener('click', () => menu.classList.toggle('active'));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.classList.remove('active')));
    window.addEventListener('resize', () => { if(window.innerWidth > 900) menu.classList.remove('active'); });
}

function applyTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const current = document.body.classList.contains('light') ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
}

function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if(!btn) return;
    btn.addEventListener('click', toggleTheme);
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
    applyTheme(initialTheme);
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
    // سيتم إضافة الدورات لاحقاً
};

const coursePrototypes = [
    {
        badge: 'مبتدئ',
        image: 'images/Courses/image1.png',
        provider: 'Cisco Networking Academy',
        courseType: 'دورة',
        deliveryMode: 'بإشراف مدرب',
        title: 'IT Essentials 8',
        description: 'ابنِ أساسك في تقنية المعلومات واكتسب مهارات عمليّة في الأجهزة، والبرمجيات، والشبكات، والأمن السيبراني.',
        trackType: 'defense',
        duration: '70 - 80 ساعة'
    },
    {
        badge: 'مبتدئ',
        image: 'images/Courses/image2.png',
        provider: 'Cisco Networking Academy',
        courseType: 'مسار',
        deliveryMode: ' عن بعد ',
        title: 'Computer Hardware Basics',
        description: ' تركز بشكل مكثف على المكونات المادية للحاسب، أنواع المعالجات، الذاكرة، ووسائط التخزين، وهي مثالية للفنيين الطموحين.',
        trackType: 'governance',
        duration: '15 - 20 ساعة'
    },
    {
        badge: 'مبتدئ',
        image: 'images/Courses/image3.png',
        provider: 'Cisco Networking Academy',
        courseType: 'شهادة',
        deliveryMode: 'بإشراف مدرب',
        title: 'CCNA: Introduction to Networks (ITN)',
        description: ' الجزء الأول من شهادة CCNA؛ تغطي بنية الشبكات، بروتوكولات الاتصال، وكيفية إعداد العناوين(IP).',
        trackType: 'defense',
        duration: '48 ساعة'
    },
    {
        badge: 'محترف',
        image: 'images/Courses/image4.png',
        provider: 'ISC2',
        courseType: 'شهادة',
        deliveryMode: 'عن بعد  ',
        title: 'CISSP Preparation',
        description: 'استعد لاختبار CISSP مع أفضل المحتويات في governance والتقنية.',
        trackType: 'governance',
        duration: '68 ساعة'
    },
    {
        badge: 'متوسط',
        image: 'images/Courses/image5.png',
        provider: 'EC-Council',
        courseType: 'دورة',
        deliveryMode: 'بإشراف مدرب',
        title: 'CEH Ethical Hacking',
        description: 'تعلم تقنيات اختبار الاختراق الأخلاقي وكيفية حماية الأنظمة من التهديدات.',
        trackType: 'attack',
        duration: '64 ساعة'
    },
    {
        badge: 'مبتدئ',
        image: 'images/Courses/image6.png',
        provider: 'AWS Training',
        courseType: 'مسار',
        deliveryMode: 'تعليم إلكتروني',
        title: 'AWS Cloud Practitioner',
        description: 'ابدأ مسارك السحابي مع أشهر مقدمي الخدمات السحابية في العالم.',
        trackType: 'governance',
        duration: '30 ساعة'
    },
    {
        badge: 'متوسط',
        image: 'images/Courses/image7.png',
        provider: 'Google Cloud',
        courseType: 'دورة',
        deliveryMode: 'بإشراف مدرب',
        title: 'Google Cloud Security',
        description: 'اكتسب المهارات لحماية بنية Google Cloud وتطبيقاتك السحابية.',
        trackType: 'defense',
        duration: '52 ساعة'
    },
    {
        badge: 'محترف',
        image: 'images/Courses/image8.png',
        provider: 'IBM Skills',
        courseType: 'شهادة',
        deliveryMode: 'تعليم إلكتروني',
        title: 'IBM Cyber Resilience',
        description: 'تعرف على استراتيجيات المرونة السيبرانية وإدارة الحوادث.',
        trackType: 'defense',
        duration: '38 ساعة'
    },
    {
        badge: 'متوسط',
        image: 'images/Courses/image9.png',
        provider: 'Oracle Academy',
        courseType: 'دورة',
        deliveryMode: 'بإشراف مدرب',
        title: 'Cloud Infrastructure',
        description: 'تعلم بنية الحوسبة السحابية وكيفية إدارة البنية التحتية بشكل فعال.',
        trackType: 'governance',
        duration: '44 ساعة'
    },
    {
        badge: 'مبتدئ',
        image: 'images/Courses/image10.png',
        provider: 'Cisco Networking Academy',
        courseType: 'دورة',
        deliveryMode: 'تعليم إلكتروني',
        title: 'Network Basics',
        description: 'ابدأ مع أساسيات شبكات الكمبيوتر وكيفية الاتصال بين الأجهزة.',
        trackType: 'defense',
        duration: '44 ساعة'
    },
    {
        badge: 'متوسط',
        image: 'images/Courses/image11.jpg',
        provider: '(ISC)²',
        courseType: 'شهادة',
        deliveryMode: 'عن بعد ',
        title: 'CCSP - Certified Cloud Security Professional',
        description: 'شهادة متخصصة في أمن السحابة تغطي  المختلفة.',
        trackType: 'defense',
        duration: '3 شهور'
    }
    
];

function renderCoursePrototype() {
    const container = document.getElementById('coursePrototypeContainer');
    if (!container) return;

    const cardsMarkup = coursePrototypes.map((course, index) => {
        // تحديد نص البادج حسب نوع المسار
        let trackBadgeText = '';
        switch(course.trackType) {
            case 'attack':
                trackBadgeText = 'هجومي';
                break;
            case 'defense':
                trackBadgeText = 'دفاعي';
                break;
            case 'governance':
                trackBadgeText = 'حوكمة';
                break;
            default:
                trackBadgeText = 'دفاعي';
        }

        return `
        <div class="prototype-card">
            <div class="card-image">
                <img src="${course.image}" alt="${course.title}">
                <div class="badge ${course.badge}">${course.badge}</div>
                <button class="share-btn" type="button" aria-label="مشاركة الدورة" onclick="shareCourse(${index})"><i class="fas fa-share-alt"></i></button>
            </div>
            <div class="card-body">
                <div class="track-badge ${course.trackType}">
                    ${course.trackType === 'attack' ? '<i class="fas fa-user-secret"></i>' : 
                      course.trackType === 'defense' ? '<i class="fas fa-shield-alt"></i>' : 
                      '<i class="fas fa-file-contract"></i>'}
                </div>
                <div class="provider" dir="ltr">${course.provider}</div>
                <div class="meta-row">
                    <span><i class="fas fa-book"></i>${course.courseType}</span>
                    <span><i class="fas fa-chalkboard-teacher"></i>${course.deliveryMode}</span>
                </div>
                <h2 class="title">${course.title}</h2>
                <p class="description">${course.description}</p>
                <div class="duration-section">
                    <i class="fas fa-clock"></i>
                    <span>${course.duration}</span>
                </div>
            </div>
        </div>
    `;
}).join('');

container.innerHTML = cardsMarkup;
}

function shareCourse(index) {
    const course = coursePrototypes[index] || coursePrototypes[0];
    const shareData = {
        title: course.title,
        text: `${course.title}\n${course.provider}\n${course.courseType} • ${course.deliveryMode}\n${course.duration}`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(() => {
            alert('تعذر مشاركة البطاقة عبر هذا المتصفح.');
        });
        return;
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
            .then(() => alert('تم نسخ معلومات الدورة إلى الحافظة.'))
            .catch(() => alert('تعذر نسخ المعلومات، يرجى المحاولة مرة أخرى.'));
        return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('تم نسخ معلومات الدورة إلى الحافظة.');
}


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
            <div class="course-card" data-level="${item.level}" onclick="showCertModal('${key}')">
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
    let html = `<div style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 12px; border: 1.2px solid rgba(0,255,195,0.2);"><div style="font-size:18px; margin-bottom:20px; font-weight:bold; text-align:center; color: var(--accent);">س${currentQuestionIndex + 1}: ${q.q}</div>`;
    q.a.forEach(ans => { html += `<button class="quiz-option-btn" onclick="submitAnswer('${ans[1]}')">${ans[0]}</button>`; });
    html += `</div></div>`;
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
            <div id="result-to-pdf" style="padding:10px; margin:0; background:#070a0f; color:#fff; direction:rtl; font-family:Arial, sans-serif; text-align:center;">
                <div style="text-align:center; border-bottom:2px solid #00ffc3; padding-bottom:20px; margin-bottom:40px;">
                    <h2 style="color:#00ffc3; margin:0; font-size:28px;">تقرير الكفاءة السيبرانية</h2>
                </div>
                
                <div style="text-align:center; margin-bottom:40px; padding:20px; border:1.5px solid rgba(2, 105, 211, 0.3); border-radius:12px;">
                    <div style="color:#00d4ff; font-size:20px; font-weight:bold; margin-bottom:10px;">المسار المقترح:</div>
                    <div style="color:#fff; font-size:24px; font-weight:bold;">${pathTitle}</div>
                </div>
                
                <div style="margin-bottom:15px; text-align:center; padding:15px; background:rgba(255,255,255,0.02); border-radius:12px;">
                    <div style="font-size:16px; color:#fff; margin-bottom:5px;">مؤشر المهارات الهجومية</div>
                    <div style="font-size:14px; color:#ff4b5c; margin-bottom:8px; font-weight:bold;">${r}%</div>
                    <div style="height:14px; background:#111; border-radius:7px; overflow:hidden; position:relative; width:100%;">
                        <div style="position:absolute; right:0; top:0; width:${r}%; height:100%; background:#ff4b5c;"></div>
                    </div>
                </div>

                <div style="margin-bottom:15px; text-align:center; padding:15px; background:rgba(255,255,255,0.02); border-radius:12px;">
                    <div style="font-size:16px; color:#fff; margin-bottom:5px;">مؤشر العمليات الدفاعية</div>
                    <div style="font-size:14px; color:#00d4ff; margin-bottom:8px; font-weight:bold;">${b}%</div>
                    <div style="height:14px; background:#111; border-radius:7px; overflow:hidden; position:relative; width:100%;">
                        <div style="position:absolute; right:0; top:0; width:${b}%; height:100%; background:#00d4ff;"></div>
                    </div>
                </div>

                <div style="margin-bottom:20px; text-align:center; padding:15px; background:rgba(255,255,255,0.02); border-radius:12px;">
                    <div style="font-size:16px; color:#fff; margin-bottom:5px;">مؤشر الحوكمة والامتثال</div>
                    <div style="font-size:14px; color:#00ffc3; margin-bottom:8px; font-weight:bold;">${w}%</div>
                    <div style="height:14px; background:#111; border-radius:7px; overflow:hidden; position:relative; width:100%;">
                        <div style="position:absolute; right:0; top:0; width:${w}%; height:100%; background:#00ffc3;"></div>
                    </div>
                </div>

                <div style="background:rgba(255,255,255,0.03); padding:25px; border-radius:15px; border:1.5px solid rgba(0,255,195,0.3); text-align:center;">
                    <div style="color:#00ffc3; font-weight:bold; margin-bottom:20px; font-size:18px;">خطة التطوير المهني المقترحة:</div>
                    <div>${roadmapHtml}</div>
                </div>
            </div>
            <div style="display: flex; gap: 15px; margin-top: 25px; direction:rtl; justify-content:center; flex-wrap:wrap;">
                <button class="pdf-btn" style="flex:1; min-width:150px; background:#00ffc3; color:#000;" onclick="downloadQuizPDF()">تحميل PDF</button>
                <button class="pdf-btn" style="flex:1; min-width:150px; background:#00d4ff; color:#000;" onclick="window.location.href='page3.html?path=${pathKey}'">دليل الشهادات</button>
            </div>
        `;
        if(document.getElementById("bar")) document.getElementById("bar").style.width = "100%";
    }
}

async function downloadQuizPDF() {
    const element = document.getElementById('result-to-pdf');
    if (!element) return;

    // تحديد الوضع (ليلي أو نهاري)
    const isDarkMode = !document.body.classList.contains('light');
    const bgColor = isDarkMode ? '#070a0f' : '#ffffff';

    // إنشاء حاوية مؤقتة للتحميل لضمان التنسيق في منتصف الورقة
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm'; // عرض ورقة A4
    tempContainer.style.backgroundColor = bgColor;
    tempContainer.style.display = 'flex';
    tempContainer.style.justifyContent = 'center';
    tempContainer.style.padding = '10mm 0';

    const clone = element.cloneNode(true);
    clone.style.width = '190mm'; // أقل قليلاً من عرض الورقة لترك هوامش
    clone.style.margin = '0 auto';
    clone.style.borderRadius = '0'; // ليكون المظهر رسمياً في التقرير
    
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    const opt = {
        margin: 0, // الهوامش تم ضبطها يدوياً في tempContainer
        filename: 'Cyber_Report_Fahad.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: {
            scale: 3, // دقة عالية جداً
            useCORS: true,
            letterRendering: true, // حل مشكلة الحروف العربية
            backgroundColor: bgColor,
            logging: false
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    try {
        // تشغيل عملية التحويل
        await html2pdf().set(opt).from(tempContainer).save();
    } catch (error) {
        console.error("PDF Error:", error);
    } finally {
        // حذف الحاوية المؤقتة من المتصفح بعد الانتهاء
        document.body.removeChild(tempContainer);
    }
}

// 8. تهيئة التطبيق عند التحميل
window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    typeWriter();
    renderCerts();
    renderCoursePrototype();
    initNavMenu();
    initThemeToggle();
    showAllFades(); // إظهار جميع العناصر المخفية فوراً
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

// دوال الشهادات
function showCertModal(key) {
    const item = certData[key];
    if (!item) return;
    
    const modal = document.getElementById('infoModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <h2>${item.title}</h2>
        <p><strong>الوصف:</strong> ${item.desc}</p>
        <p><strong>السعر:</strong> ${item.price}</p>
        <p><strong>المنظمة:</strong> ${item.org}</p>
        <p><strong>المستوى:</strong> ${item.level}</p>
        <p><strong>الفئة:</strong> ${item.cat}</p>
        <p><strong>المتطلبات:</strong> ${item.req}</p>
        <p><strong>المدة:</strong> ${item.duration}</p>
        <p><strong>اللغة:</strong> ${item.lang}</p>
        <p><strong>الشهادة:</strong> ${item.cert}</p>
        <p><strong>الروابط:</strong> <a href="${item.link}" target="_blank">المزيد من المعلومات</a></p>
    `;
    
    modal.style.display = 'block';
}

function closeCertModal() {
    document.getElementById('infoModal').style.display = 'none';
}

function toggleChat() {
    const win = document.getElementById('ai-window');
    if(win) win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
