// File: c:/Users/User/Desktop/مشروع/project/footer-injector.js

document.addEventListener('DOMContentLoaded', function() {
    // تحديد المسارات النسبية الصحيحة بشكل ديناميكي بناءً على موقع الصفحة الحالية
    // هذا الكود يفترض أن هذا الملف (footer-injector.js) موجود دائماً داخل مجلد /project
    const isSubdirectory = window.location.pathname.includes('/project/');
    
    // إذا كنا داخل مجلد فرعي (مثل /project/page2.html)، المسار للملفات الجذرية (مثل index.html) هو '../'
    // إذا كنا في الصفحة الجذرية (index.html)، المسار للملفات الجذرية هو ''
    const rootPath = isSubdirectory ? '../' : '';

    // إذا كنا داخل مجلد فرعي، المسار لملفات المشروع الأخرى (مثل page3.html) هو ''
    // إذا كنا في الصفحة الجذرية، المسار لملفات المشروع هو 'project/'
    const projectPath = isSubdirectory ? '' : 'project/';

    // بناء كود HTML للفوتر الموحد
    const footerHTML = `
    <footer>
        <div class="footer-container">
            <div class="footer-about fade">
                <h3 style="color: var(--accent);">عن المستشار السيبراني السعودي</h3>
                <p>منصة وطنية متخصصة تهدف إلى توجيه الكفاءات الوطنية في المملكة العربية السعودية نحو المسارات المهنية الصحيحة في مجال الأمن السيبراني بناءً على رؤية 2030</p>
            </div>
            <div class="footer-links">
                <a href="${rootPath}index.html">الرئيسية</a>
                <a href="${projectPath}page2.html">الاختبار التحليلي</a>
                <a href="${projectPath}page3.html">دليل الشهادات</a>
                <a href="${projectPath}page4.html">انضم كمدرب</a>
                <a href="${projectPath}about.html">من نحن</a>
                <a href="${projectPath}page5.html">تواصل معنا</a>
            </div>
            <div class="footer-social">
                <a href="https://x.com/fahad" target="_blank" class="social-icon" title="تابعنا على X"><i class="fab fa-twitter"></i></a>
                <a href="https://linkedin.com/in/fahad" target="_blank" class="social-icon" title="تواصل معنا على LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            </div>
            <div class="footer-copyright">
                جميع الحقوق محفوظة &copy; 2026 - MAF | Advisor
            </div>
        </div>
    </footer>
    `;

    // حقن الفوتر في نهاية الـ body إذا لم يكن موجوداً بالفعل
    if (!document.querySelector('footer')) {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    // حقن واجهة المستشار الذكي في جميع الصفحات لضمان التواجد الموحد
    const aiWidgetHTML = `
    <div id="ai-chat-widget">
        <button id="ai-chat-btn" onclick="toggleChat()"><i class="fas fa-robot"></i></button>
        <div id="ai-window">
            <div id="ai-header"><span>المستشار الذكي</span><i class="fas fa-times" style="cursor:pointer" onclick="toggleChat()"></i></div>
            <div id="ai-messages"><div class="ai-msg msg-bot">أهلاً! أنا مستشارك السيبراني، كيف أقدر أخدمك اليوم؟</div></div>
            <div id="ai-input-area">
                <input type="text" id="ai-input" placeholder="اكتب سؤالك هنا..." onkeypress="if(event.key === 'Enter') sendToAI()">
                <button id="ai-send" onclick="sendToAI()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    </div>
    `;
    if (!document.getElementById('ai-chat-widget')) {
        document.body.insertAdjacentHTML('beforeend', aiWidgetHTML);
    }
});