/* 
   ==================================================
   SYSTEM: Cyber Advisor Platform - FINAL INTEGRATION
   USER:  | FOCUS: PDF Alignment & Cert Guide Fix
   ==================================================
*/

// 1. نظام الكتابة الآلي
const typeWriter = (() => {
    const text = "root@cyberpath:~# Saudi_Market_Analysis... Success!_";
    let i = 0;
    let el;

    return function type() {
        if (!el) el = document.getElementById("typewriter");
        if (el && i < text.length) {
            // استخدام textContent أفضل للأداء من innerHTML عند إضافة نص فقط
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 80);
        }
    };
})();

// 2. معالجة التأثيرات البصرية
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
    oscp: {
        title: "Offensive Security Certified Professional (OSCP)",
        desc: "الشهادة الأكثر شهرة في مجال اختبار الاختراق العملي.",
        price: "1599$",
        org: "Offensive Security",
        level: "محترف",
        cat: "offensive",
        req: "معرفة قوية بالشبكات ولينكس",
        duration: "90 يوم",
        lang: "English",
        cert: "نعم",
        link: "https://www.offsec.com/courses/pen-200/",
        image: "assets/Courses/image1.png"
    },
    btl1: {
        title: "Blue Team Level 1 (BTL1)",
        desc: "دورة عملية تركز على الدفاع السيبراني والعمليات الأمنية (SOC).",
        price: "499$",
        org: "Security Blue Team",
        level: "متوسط",
        cat: "defensive",
        req: "أساسيات الأمن السيبراني",
        duration: "4 أشهر",
        lang: "English",
        cert: "نعم",
        link: "https://securityblueteam.com/btl1/",
        image: "assets/Courses/image2.png"
    },
    security_plus: {
        title: "CompTIA Security+",
        desc: "شهادة أساسية في الأمن السيبراني تغطي مفاهيم التهديدات والهجمات والثغرات.",
        price: "392$",
        org: "CompTIA",
        level: "مبتدئ",
        cat: "defensive",
        req: "Network+ أو خبرة سنتين",
        duration: "3 أشهر",
        lang: "English",
        cert: "نعم",
        link: "https://www.comptia.org/certifications/security",
        image: "assets/Courses/image3.png"
    },
    cissp: {
        title: "Certified Information Systems Security Professional (CISSP)",
        desc: "شهادة متقدمة في إدارة أمن المعلومات وتصميم الأنظمة الآمنة.",
        price: "749$",
        org: "ISC2",
        level: "محترف",
        cat: "grc",
        req: "خبرة 5 سنوات في مجالين أمنيين",
        duration: "6 أشهر",
        lang: "English",
        cert: "نعم",
        link: "https://www.isc2.org/Certifications/CISSP",
        image: "assets/Courses/cissp.png"
    },
    cisa: {
        title: "Certified Information Systems Auditor (CISA)",
        desc: "شهادة متخصصة في تدقيق أنظمة المعلومات ومراجعة الضوابط الأمنية.",
        price: "575$",
        org: "ISACA",
        level: "محترف",
        cat: "grc",
        req: "خبرة 5 سنوات في التدقيق",
        duration: "4 أشهر",
        lang: "English",
        cert: "نعم",
        link: "https://www.isaca.org/credentialing/cisa",
        image: "assets/Courses/image4.png"
    },
    cism: {
        title: "Certified Information Security Manager (CISM)",
        desc: "شهادة متقدمة في إدارة الأمن السيبراني وحوكمة المؤسسات.",
        price: "575$",
        org: "ISACA",
        level: "محترف",
        cat: "grc",
        req: "خبرة 5 سنوات في إدارة الأمن",
        duration: "4 أشهر",
        lang: "English",
        cert: "نعم",
        link: "https://www.isaca.org/credentialing/cism",
        image: "assets/Courses/image5.png"
    },
    ceh: {
        title: "Certified Ethical Hacker (CEH)",
        desc: "شهادة في اختبار الاختراق الأخلاقي وأساليب الهجوم السيبراني.",
        price: "1199$",
        org: "EC-Council",
        level: "متوسط",
        cat: "offensive",
        req: "خبرة سنتين في الأمن",
        duration: "5 أيام تدريب",
        lang: "English",
        cert: "نعم",
        link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
        image: "assets/Courses/image6.png"
    },
    cisa_risk: {
        title: "Certified in Risk and Information Systems Control (CRISC)",
        desc: "شهادة في إدارة المخاطر التقنية والرقابية للمؤسسات.",
        price: "575$",
        org: "ISACA",
        level: "محترف",
        cat: "grc",
        req: "خبرة 3 سنوات في إدارة المخاطر",
        duration: "4 أشهر",
        lang: "English",
        cert: "نعم",
        link: "https://www.isaca.org/credentialing/crisc",
        image: "assets/Courses/image7.png"
    },
    cysa: {
        title: "CompTIA CySA+",
        desc: "شهادة في تحليل الأمن السيبراني والاستجابة للحوادث.",
        price: "392$",
        org: "CompTIA",
        level: "متوسط",
        cat: "defensive",
        req: "Security+ أو خبرة 4 سنوات",
        duration: "3 أشهر",
        lang: "English",
        cert: "نعم",
        link: "https://www.comptia.org/certifications/cybersecurity-analyst",
        image: "assets/Courses/image8.png"
    },
    ccsp: {
        title: "Certified Cloud Security Professional (CCSP)",
        desc: "شهادة متخصصة في أمن الحوسبة السحابية وحماية البيانات.",
        price: "599$",
        org: "ISC2",
        level: "محترف",
        cat: "defensive",
        req: "خبرة 5 سنوات في تكنولوجيا المعلومات",
        duration: "4 أشهر",
        lang: "English",
        cert: "نعم",
        link: "https://www.isc2.org/Certifications/CCSP",
        image: "assets/Courses/image9.png"
    },
    gcih: {
        title: "GIAC Certified Incident Handler (GCIH)",
        desc: "شهادة في التعامل مع الحوادث الأمنية والاستجابة للاختراقات.",
        price: "2499$",
        org: "SANS",
        level: "متوسط",
        cat: "defensive",
        req: "معرفة أساسية بالشبكات",
        duration: "5 أيام تدريب",
        lang: "English",
        cert: "نعم",
        link: "https://www.giac.org/certifications/certified-incident-handler-gcih/",
        image: "assets/Courses/image10.png"
    }
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


// 5. دالة عرض الشهادات - بطاقات جديدة (صورة + عنوان + وصف + وقت + زر)
function renderCerts() {
    const urlParams = new URLSearchParams(window.location.search);
    const userPath = urlParams.get('path'); 
    
    const hasRecommended = document.getElementById('recommendedGrid');
    const isCertPage = document.getElementById('grid-all-certs') || document.getElementById('grid-offensive') || (document.querySelector('.main-content') && window.location.pathname.toLowerCase().includes('page3'));

    if (!hasRecommended && !isCertPage) {
        return; // توقف فوراً لمنع التخريب وحقن البطاقات في الصفحات الأخرى
    }

    // 1. استعادة البطاقات: إنشاء حاوية الشبكة الموحدة تلقائياً وزرعها مكان القديمة فقط في صفحة الشهادات
    let allGrid = document.getElementById('grid-all-certs');
    if (isCertPage && !allGrid) {
        allGrid = document.createElement('div');
        allGrid.id = 'grid-all-certs';
        allGrid.className = 'courses-grid';
        const referenceNode = document.getElementById('grid-offensive') || document.querySelector('.section-title');
        if (referenceNode && referenceNode.parentElement) {
            referenceNode.parentElement.insertBefore(allGrid, referenceNode);
        } else {
            const container = document.querySelector('.main-content');
            if (container) container.appendChild(allGrid);
        }
    }

    // 2. تنظيف العناوين فقط في المكان المخصص لمنع تخريب الصفحة الرئيسية والصفحات الأخرى
    const contentArea = document.querySelector('.main-content');
    if (isCertPage && contentArea) {
        contentArea.querySelectorAll('.section-title, h2, h3').forEach(el => {
            const text = el.textContent || '';
            if(text.includes('هجومي') || text.includes('دفاعي') || text.includes('حوكمة') || text.includes('العمليات')) el.remove();
        });
    }

    // 3. إزالة الحاويات القديمة لضمان عدم وجود تداخل
    ['grid-offensive', 'grid-defensive', 'grid-grc'].forEach(id => {
        const oldGrid = document.getElementById(id);
        if(oldGrid) oldGrid.remove();
    });

    const recGrid = document.getElementById('recommendedGrid');
    if(recGrid) recGrid.innerHTML = "";
    if(allGrid) allGrid.innerHTML = "";

    Object.keys(certData).forEach(key => {
        const item = certData[key];
        const catColors = {offensive: '#ff4d6d', defensive: '#4da3ff', grc: '#2dd4bf'};
        const catIcons = {offensive: '<i class="fas fa-user-secret"></i>', defensive: '<i class="fas fa-shield-alt"></i>', grc: '<i class="fas fa-file-contract"></i>'};
        
        const color = catColors[item.cat] || '#00ffc3';
        const trackIcon = catIcons[item.cat] || '<i class="fas fa-certificate"></i>';
        const badgeClass = item.cat === 'offensive' ? 'badge-red' : (item.cat === 'defensive' ? 'badge-blue' : 'badge-green');
        const levelBadge = 'badge-' + item.level;
        
        const cardHtml = `
            <div class="course-card track-${item.cat}">
                <span class="badge ${badgeClass} ${levelBadge}">${item.level}</span>
                <div class="card-img" style="background-image: url('${item.image}');"></div>
                <div class="card-body">
                    <div class="track-badge ${item.cat}">
                        ${trackIcon}
                    </div>
                    <div class="card-org">${item.org}</div>
                    <h3 class="course-title">${item.title}</h3>
                    <p class="course-desc">${item.desc}</p>
                    <div class="card-footer">
                        <span class="card-duration"><i class="far fa-clock"></i> ${item.duration}</span>
                        <a href="${item.link}" target="_blank" class="card-btn" style="text-decoration:none; color:inherit; cursor:pointer;">اطلب الدورة <i class="fas fa-arrow-left" style="margin-right:4px;"></i></a>
                    </div>
                </div>
            </div>`;
        
        if (userPath && item.cat === userPath && recGrid) {
            document.getElementById('recommendedSection').style.display = 'block';
            recGrid.innerHTML += cardHtml;
        }

        if(allGrid) allGrid.innerHTML += cardHtml;
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
                <button class="pdf-btn download" onclick="downloadQuizPDF()">تحميل PDF</button>
                <button class="pdf-btn guide" onclick="window.location.href='page3.html?path=${pathKey}'">تصفح دليل الشهادات</button>
            </div>
        `;
        if (document.getElementById("bar")) document.getElementById("bar").style.width = "100%";
    }
}

async function downloadQuizPDF() {
    const element = document.getElementById('result-to-pdf');
    if (!element) return;

    // قراءة لون الخلفية الحالي من الصفحة لضمان تطابق الـ PDF مع الثيم
    const bodyStyles = window.getComputedStyle(document.body);
    const bgColor = bodyStyles.backgroundColor;

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
            letterRendering: true,
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
    fadeElements = document.querySelectorAll(".fade"); // تخزين العناصر عند التحميل
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
