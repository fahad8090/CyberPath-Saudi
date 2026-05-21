/* 
   ==================================================
   SYSTEM: Cyber Advisor Platform - FINAL INTEGRATION
   USER:  | FOCUS: PDF Alignment & Cert Guide Fix
   ==================================================
*/

// 1. معالجة التأثيرات البصرية
let fadeElements = []; // تخزين العناصر لمرة واحدة لتحسين الأداء

function handleScroll() {
    // استخدام العناصر المخزنة بدلاً من البحث في كل مرة
    fadeElements.forEach(el => { if(el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add("show"); });
}

function showAllFades() {
    const fades = document.querySelectorAll(".fade");
    fades.forEach(el => el.classList.add("show"));
}

function toggleFaq(element) {
    element.classList.toggle('active');
}

// New filter toggle logic with outside click handling
function toggleFilter() {
    const dropdown = document.getElementById('filterDropdown');
    if (!dropdown) return;

    const isVisible = dropdown.classList.contains('show');
    
    if (isVisible) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeFilterOnClickOutside);
    } else {
        dropdown.classList.add('show');
        setTimeout(() => {
            document.addEventListener('click', closeFilterOnClickOutside);
        }, 0);
    }
}

function closeFilterOnClickOutside(event) {
    const dropdown = document.getElementById('filterDropdown');
    const filterBtn = document.querySelector('.filter-btn');
    if (dropdown && !dropdown.contains(event.target) && filterBtn && !filterBtn.contains(event.target)) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeFilterOnClickOutside);
    }
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
    
    // إنشاء overlay إذا لم يكن موجوداً
    let ov = document.querySelector('.nav-overlay');
    if (!ov) {
        ov = document.createElement('div');
        ov.className = 'nav-overlay';
        document.body.appendChild(ov);
    }
    
    const openMenu = () => {
        menu.classList.add('active');
        ov.classList.add('active');
        toggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeMenu = () => {
        menu.classList.remove('active');
        ov.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    toggle.addEventListener('click', () => {
        if (menu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    ov.addEventListener('click', closeMenu);
    
    // إغلاق القائمة عند النقر على أي رابط داخلها
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
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
    // ربط جميع أزرار الثيم (داخل القائمة وخارجها)
    const btns = document.querySelectorAll('#theme-toggle, .nav-theme-btn');
    if(!btns.length) return;
    btns.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
    applyTheme(initialTheme);
}

// 2. نظام n8n للدردشة الذكية
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


// 4. دالة عرض الشهادات - بطاقات جديدة (صورة + عنوان + وصف + وقت + زر)
// تم إعادة بناء هذه الدالة لتكون أكثر أماناً واستقراراً، وتتفادى تخريب الصفحات الأخرى.
function renderCerts() {
    // 1. التشغيل فقط في صفحة دليل الشهادات لضمان عدم التأثير على الصفحات الأخرى.
    if (!window.location.pathname.toLowerCase().includes('page3.html')) {
        return;
    }

    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error('Cert Guide page is missing a .main-content container for rendering certificates.');
        return;
    }

    const controlsContainer = document.querySelector('.controls-container');

    // **الإصلاح:** إزالة أي معالجات `onclick` قديمة من زر الفلتر لضمان عدم التعارض.
    // هذا يمنع استدعاء الدالة مرتين ويحل مشكلة عدم ظهور القائمة.
    const filterBtn = controlsContainer ? controlsContainer.querySelector('.filter-btn') : null;
    if (filterBtn) {
        filterBtn.removeAttribute('onclick');
    }

    // Dynamically inject filter dropdown HTML if it doesn't exist
    if (controlsContainer && !document.getElementById('filterDropdown')) {
        const filterDropdownHTML = `
            <div id="filterDropdown" class="filter-dropdown">
                <div class="filter-options">
                    <div>
                        <input type="checkbox" id="level-beginner" value="مبتدئ" onchange="applyFilters()">
                        <label for="level-beginner">مبتدئ</label>
                    </div>
                    <div>
                        <input type="checkbox" id="level-intermediate" value="متوسط" onchange="applyFilters()">
                        <label for="level-intermediate">متوسط</label>
                    </div>
                    <div>
                        <input type="checkbox" id="level-professional" value="محترف" onchange="applyFilters()">
                        <label for="level-professional">محترف</label>
                    </div>
                </div>
            </div>
        `;
        controlsContainer.insertAdjacentHTML('beforeend', filterDropdownHTML);
    }

    // **إصلاح نهائي وموثوق:** استخدام "تفويض الأحداث" (Event Delegation)
    // هذا الأسلوب يضمن عمل الفلتر حتى لو تم تعديل العناصر ديناميكياً ويتجنب التعارض.
    if (controlsContainer && !controlsContainer.dataset.filterListener) {
        controlsContainer.addEventListener('click', function(event) {
            // التحقق مما إذا كان العنصر المضغوط عليه هو زر الفلتر أو أيقونة بداخله
            if (event.target.closest('.filter-btn')) {
                toggleFilter(); // استدعاء دالة الفتح والإغلاق
            }
        });
        // إضافة علامة لمنع تكرار إضافة المستمع
        controlsContainer.dataset.filterListener = 'true';
    }
    const urlParams = new URLSearchParams(window.location.search);
    const userPath = urlParams.get('path');

    // 2. التأكد من وجود الأقسام المطلوبة، وإنشاؤها ديناميكياً إذا لم تكن موجودة.
    let recommendedSection = document.getElementById('recommendedSection');
    if (!recommendedSection) {
        recommendedSection = document.createElement('div');
        recommendedSection.id = 'recommendedSection';
        recommendedSection.innerHTML = `
            <div class="recommendation-header">
                <i class="fas fa-star"></i>
                <h2>مسارك الموصى به</h2>
            </div>
            <div id="recommendedGrid" class="courses-grid"></div>
        `;
        mainContent.prepend(recommendedSection); // إضافة القسم في الأعلى
    }
    const recGrid = document.getElementById('recommendedGrid');
    
    let allGrid = document.getElementById('grid-all-certs');
    if (!allGrid) {
        const allCertsSection = document.createElement('div');
        allCertsSection.innerHTML = `<h2 class="section-title">جميع الشهادات</h2>`;
        allGrid = document.createElement('div');
        allGrid.id = 'grid-all-certs';
        allGrid.className = 'courses-grid';
        allCertsSection.appendChild(allGrid);
        mainContent.appendChild(allCertsSection);
    }

    // 3. تنظيف المحتوى السابق والبدء في العرض.
    if(recGrid) recGrid.innerHTML = "";
    if(allGrid) allGrid.innerHTML = "";

    let hasRecommendations = false;

    Object.keys(certData).forEach(key => {
        const item = certData[key];
        const catColors = {offensive: '#ff4d6d', defensive: '#4da3ff', grc: '#2dd4bf'};
        const catIcons = {offensive: '<i class="fas fa-user-secret"></i>', defensive: '<i class="fas fa-shield-alt"></i>', grc: '<i class="fas fa-file-contract"></i>'};
        
        const trackIcon = catIcons[item.cat] || '<i class="fas fa-certificate"></i>';
        const badgeClass = item.cat === 'offensive' ? 'badge-red' : (item.cat === 'defensive' ? 'badge-blue' : 'badge-green');
        
        const cardHtml = `
            <div class="course-card track-${item.cat}" onclick="window.open('${item.link}', '_blank')" style="cursor: pointer;">
                <div class="card-img-container">
                    <img src="${item.image}" alt="${item.title}" class="card-img">
                </div>
                <div class="card-body">
                    <div class="card-meta-top">
                        <div class="track-badge ${item.cat}">${trackIcon}</div>
                        <span class="badge ${badgeClass}">${item.level}</span>
                    </div>
                    <div class="card-org">${item.org}</div>
                    <h3 class="course-title">${item.title}</h3>
                    <p class="course-desc">${item.desc}</p>
                    <div class="card-footer">
                        <span class="card-duration"><i class="far fa-clock"></i> ${item.duration}</span>
                        <a href="${item.link}" target="_blank" class="card-btn">اطلب الدورة <i class="fas fa-arrow-left"></i></a>
                    </div>
                </div>
            </div>`;
        
        if (userPath && item.cat === userPath && recGrid) {
            recGrid.innerHTML += cardHtml;
            hasRecommendations = true;
        }

        if(allGrid) allGrid.innerHTML += cardHtml;
    });

    // إخفاء قسم التوصيات إذا لم يكن هناك مسار محدد أو شهادات مطابقة
    if (recommendedSection) {
        recommendedSection.style.display = hasRecommendations ? 'block' : 'none';
    }
}

// 4. نظام الاختبار (Quiz)
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

function submitAnswer(type) {
    quizScore[type]++;
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
        showTerminalLoader();
    } else {
        showQuestion();
    }
}

function showTerminalLoader() {
    const quizContent = document.getElementById("quiz-content");
    if (!quizContent) return;

    if (document.getElementById("quiz-title")) document.getElementById("quiz-title").innerText = "جاري تحليل النتائج...";
    if (document.getElementById("bar")) document.getElementById("bar").style.width = "100%";
    quizContent.innerHTML = ''; // Clear content

    let overlay = document.createElement('div');
    overlay.id = 'terminal-overlay';
    overlay.className = 'terminal-overlay active';
    overlay.innerHTML = `
        <div class="terminal-content">
            <p class="terminal-line">&gt; جاري تحليل الإجابات...</p>
            <p class="terminal-line">&gt; مطابقة المهارات مع إطار (NCA)...</p>
            <p class="terminal-line">&gt; بناء خارطة الطريق المهنية المخصصة...</p>
        </div>`;
    document.body.appendChild(overlay);

    setTimeout(() => {
        if (document.getElementById('terminal-overlay')) {
            document.body.removeChild(overlay);
        }
        displayResult();
    }, 4000); // زيادة مدة التأخير إلى 4 ثوانٍ
}

// 5. ميزة مشاركة النتيجة
function shareQuizResult(pathTitle, pathKey) {
    const shareData = {
        title: 'نتيجتي في اختبار المستشار السيبراني',
        text: `لقد حصلت على تقييم "${pathTitle}" في منصة MAF | Advisor! اكتشف مسارك المهني الآن.`,
        url: window.location.origin + '/project/page3.html?path=' + pathKey
    };

    // استخدام Web Share API إذا كانت مدعومة (مثلما في الصفحة الرئيسية)
    if (navigator.share) {
        navigator.share(shareData).catch((error) => {
            // لا داعي لإظهار خطأ إذا ألغى المستخدم المشاركة
            console.log('Web Share API failed or was cancelled.', error);
        });
    } else {
        // حل بديل للمتصفحات التي لا تدعم المشاركة (مثل متصفحات سطح المكتب)
        const textToCopy = `${shareData.text}\n\nالرابط: ${shareData.url}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('ميزة المشاركة غير متاحة على هذا المتصفح. تم نسخ رابط النتيجة إلى الحافظة.'))
            .catch(() => alert('تعذرت المشاركة أو النسخ.'));
    }
}

// 6. عرض النتائج
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
        <div class="roadmap-item">
            <span class="roadmap-level">${item[0]}</span>
            <span class="roadmap-cert">${item[1]}</span>
        </div>
    `).join("");

    const quizContent = document.getElementById("quiz-content");
    if (quizContent) {
        document.getElementById("quiz-title").innerText = "نتائج التحليل المهني";
        // تم نقل جميع الأنماط المضمنة إلى ملف CSS لتوحيد التصميم ودعم الوضع الفاتح/الداكن
        quizContent.innerHTML = `
            <div id="result-to-pdf" class="quiz-result-container">
                <div class="result-header">
                    <h2 class="result-main-title">تقرير الكفاءة السيبرانية</h2>
                </div>
                
                <div class="result-path-box">
                    <div class="result-path-label">المسار المقترح:</div>
                    <div class="result-path-title">${pathTitle}</div>
                </div>
                
                <div class="skill-meter">
                    <div class="skill-meter-title">مؤشر المهارات الهجومية</div>
                    <div class="skill-meter-percent red">${r}%</div>
                    <div class="skill-meter-bar-bg">
                        <div class="skill-meter-bar red" style="width:${r}%"></div>
                    </div>
                </div>

                <div class="skill-meter">
                    <div class="skill-meter-title">مؤشر العمليات الدفاعية</div>
                    <div class="skill-meter-percent blue">${b}%</div>
                    <div class="skill-meter-bar-bg">
                        <div class="skill-meter-bar blue" style="width:${b}%"></div>
                    </div>
                </div>

                <div class="skill-meter">
                    <div class="skill-meter-title">مؤشر الحوكمة والامتثال</div>
                    <div class="skill-meter-percent green">${w}%</div>
                    <div class="skill-meter-bar-bg">
                        <div class="skill-meter-bar green" style="width:${w}%"></div>
                    </div>
                </div>

                <div class="roadmap-box">
                    <div class="roadmap-title">خطة التطوير المهني المقترحة:</div>
                    <div>${roadmapHtml}</div>
                </div>
            </div>
            <div class="quiz-actions">
                <button class="pdf-btn share" onclick="shareQuizResult('${pathTitle}', '${pathKey}')"><i class="fas fa-share-nodes"></i> مشاركة النتيجة</button>
                <button class="pdf-btn guide" onclick="window.location.href='page3.html?path=${pathKey}'">تصفح دليل الشهادات</button>
            </div>
        `;
        if (document.getElementById("bar")) document.getElementById("bar").style.width = "100%";
        incrementLiveCounter(); // زيادة العداد السحابي بمقدار +1 فور ظهور النتيجة
    }
}

// 7. معالج إرسال نموذج "انضم كمدرب"
// 7. معالج إرسال نموذج "انضم كمدرب"
async function handleInstructorFormSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('instructorForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successContainer = document.getElementById('form-success-message');
 
    if (!form || !submitBtn || !successContainer) {
        console.error('Form submission elements not found.');
        return;
    }
 
    // إظهار حالة التحميل
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'جاري الإرسال... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
 
    // 1. إنشاء كائن FormData لجمع بيانات النموذج
    const formData = new FormData(form);
    
    // 🌟 هنا نضع السطر الجديد تماماً ليميز نوع النموذج 🌟
    formData.append('form_type', 'join_instructor'); 
    
    // 2. تحديد رابط Webhook الصحيح الخاص بنموذج المدربين
    const webhookUrl = 'https://azizhiqk.app.n8n.cloud/webhook-test/cyber-advisor'; 
 
    try {
        // 3. إرسال البيانات باستخدام fetch
        const response = await fetch(webhookUrl, {
            method: 'POST',
            // لا يتم تحديد Content-Type هنا، المتصفح سيقوم بذلك تلقائياً
            body: formData,
        });
 
        if (response.ok) {
            // في حالة النجاح، إخفاء النموذج وإظهار رسالة النجاح
            form.style.display = 'none';
            successContainer.style.display = 'block';
        } else {
            // في حالة وجود خطأ من الخادم، إظهار رسالة خطأ
            const errorData = await response.text();
            alert(`حدث خطأ أثناء إرسال الطلب: ${errorData}`);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Submission failed:', error);
        alert('فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

// Animated Counter for Statistics
function animateCounter(counter) {
    const target = +counter.dataset.target;
    const decimals = +counter.dataset.decimals || 0;
    const duration = 2000; // Animation duration in ms
    let startTime = null;

    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = progress * target;
        
        counter.innerText = currentValue.toFixed(decimals);

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Ensure the final value is exactly the target
            counter.innerText = target.toFixed(decimals);
        }
    };

    window.requestAnimationFrame(step);
}

function initStatCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    counters.forEach(counter => {
        const decimals = +counter.dataset.decimals || 0;
        counter.innerText = (0).toFixed(decimals);
        observer.observe(counter);
    });
}


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

// معرف الـ API السحابي الخاص والآمن لمنصة MAF Tech (مجاني ومستمر)
const counterNamespace = "maftech_sa_2026";
const counterKey = "cyber_quiz_users";

// دالة لجلب وعرض الرقم الحالي في الصفحة الرئيسية
function getLiveCounterValue() {
    const counterElement = document.getElementById('live-counter');
    if (!counterElement) return;

    fetch(`https://api.countapi.xyz/get/${counterNamespace}/${counterKey}`)
        .then(res => res.json())
        .then(data => {
            let finalValue = data.value ? data.value + 1240 : 1240;
            counterElement.innerText = Number(finalValue).toLocaleString('ar-EG');
        })
        .catch(err => {
            counterElement.innerText = "١,٤٢٠";
        });
}

// دالة لزيادة العداد بمقدار (+1) يتم استدعاؤها فور ظهور النتيجة
function incrementLiveCounter() {
    fetch(`https://api.countapi.xyz/hit/${counterNamespace}/${counterKey}`)
        .then(res => res.json())
        .then(data => console.log("تم تحديث العداد السحابي بنجاح"))
        .catch(err => console.error("فشل تحديث العداد:", err));
}

document.addEventListener('DOMContentLoaded', function() {
    showAllFades(); // إظهار جميع العناصر المخفية فوراً
    window.addEventListener("scroll", handleScroll);
    getLiveCounterValue(); // جلب وعرض عداد الزوار السحابي المستمر

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    fadeElements = document.querySelectorAll(".fade"); // تخزين العناصر عند التحميل
    
    // إضافة معالجة الأخطاء لضمان عدم توقف تهيئة بقية المكونات (مثل القائمة)
    try { renderCerts(); } catch (e) { console.error("Failed to render certificates:", e); }
    try { renderCoursePrototype(); } catch (e) { console.error("Failed to render course prototypes:", e); }
    
    initNavMenu();
    initThemeToggle();
    initStatCounters();

    // ربط نموذج "انضم كمدرب"
    const instructorForm = document.getElementById('instructorForm');
    if (instructorForm) {
        instructorForm.addEventListener('submit', handleInstructorFormSubmit);

        // تحديث اسم الملف في الواجهة عند اختياره
        const fileInput = instructorForm.querySelector('.file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const fileName = e.target.files[0] ? e.target.files[0].name : 'اختر ملف...';
                const fileLabelText = e.target.nextElementSibling.querySelector('.file-label-text');
                if (fileLabelText) fileLabelText.textContent = fileName;
            });
        }
    }
    
    // ربط نافذة الذكاء الاصطناعي
    const aiBtn = document.getElementById('ai-chat-btn');
    if(aiBtn) aiBtn.onclick = () => {
        const win = document.getElementById('ai-window');
        if(win) win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
    };

    const aiInput = document.getElementById('ai-input');
    if(aiInput) aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendToAI(); });
});