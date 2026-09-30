// ========== 1. 实时时钟 ==========
function updateClock(){
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    h = String(h).padStart(2, '0');
    m = String(m).padStart(2, '0');
    s = String(s).padStart(2, '0');
    document.getElementById('clock').innerText = `${h}:${m}:${s}`;

    const weekArr = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    const year = now.getFullYear();
    const month = now.getMonth()+1;
    const day = now.getDate();
    const week = weekArr[now.getDay()];
    document.getElementById('date').innerText = `${year}年${month}月${day}日 ${week}`;
}
updateClock();
setInterval(updateClock, 1000);


// ========== 2. 背景切换 + 图库 + 本地上传图片 ==========
// 预设在线背景图片链接
const bgPool = [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    "https://images.unsplash.com/photo-1507400492003-1427a5b74686",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1520052203542-d35f938adf44"
];

// 读取本地保存的背景列表（base64图片/在线链接都存在这里）
let bgGallery = JSON.parse(localStorage.getItem("bgGallery")) || [];
let currentBg = localStorage.getItem("currentBg") || "";
if(currentBg) document.body.style.backgroundImage = `url(${currentBg})`;

const changeBgBtn = document.getElementById("changeBgBtn");
const galleryModal = document.getElementById("galleryModal");
const closeGallery = document.getElementById("closeGallery");
const galleryList = document.getElementById("galleryList");
const bgUploadInput = document.getElementById("bgUploadInput");

// 渲染图库缩略图
function renderGallery(){
    galleryList.innerHTML = "";
    bgGallery.forEach(url=>{
        const div = document.createElement("div");
        div.className = "gallery-item";
        div.style.backgroundImage = `url(${url})`;
        div.onclick = ()=>{
            document.body.style.backgroundImage = `url(${url})`;
            localStorage.setItem("currentBg", url);
        }
        galleryList.appendChild(div);
    })
}
renderGallery();

// 随机在线背景
changeBgBtn.onclick = ()=>{
    const randomUrl = bgPool[Math.floor(Math.random()*bgPool.length)];
    document.body.style.backgroundImage = `url(${randomUrl})`;
    localStorage.setItem("currentBg", randomUrl);
    if(!bgGallery.includes(randomUrl)){
        bgGallery.push(randomUrl);
        localStorage.setItem("bgGallery", JSON.stringify(bgGallery));
        renderGallery();
    }
    galleryModal.style.display = "block";
}
closeGallery.onclick = ()=> galleryModal.style.display = "none";

// 本地上传图片逻辑
bgUploadInput.onchange = function(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(event){
        const imgBase64 = event.target.result;
        // 设置为当前背景
        document.body.style.backgroundImage = `url(${imgBase64})`;
        localStorage.setItem("currentBg", imgBase64);
        // 存入图库
        if(!bgGallery.includes(imgBase64)){
            bgGallery.push(imgBase64);
            localStorage.setItem("bgGallery", JSON.stringify(bgGallery));
            renderGallery();
        }
    }
    reader.readAsDataURL(file);
}


// ==========3. 日记功能（自动记录时间，本地存储） ==========
let diaryList = JSON.parse(localStorage.getItem("diaryList")) || [];

const openDiaryBtn = document.getElementById("openDiaryBtn");
const diaryModal = document.getElementById("diaryModal");
const closeDiary = document.getElementById("closeDiary");
const diaryInput = document.getElementById("diaryInput");
const saveDiary = document.getElementById("saveDiary");
const diaryListDom = document.getElementById("diaryList");

// 渲染所有日记
function renderDiary(){
    diaryListDom.innerHTML = "";
    diaryList.forEach(item=>{
        const div = document.createElement("div");
        div.className = "diary-item";
        div.innerHTML = `
            <div class="diary-time">${item.time}</div>
            <div>${item.content}</div>
        `
        diaryListDom.appendChild(div);
    })
}
renderDiary();

openDiaryBtn.onclick = ()=> diaryModal.style.display = "block";
closeDiary.onclick = ()=> diaryModal.style.display = "none";

// 保存日记，自动生成当前时间
saveDiary.onclick = ()=>{
    const text = diaryInput.value.trim();
    if(!text) return alert("日记内容不能为空");
    const now = new Date();
    const timeStr = now.toLocaleString("zh-CN");
    diaryList.unshift({
        time: timeStr,
        content: text
    })
    localStorage.setItem("diaryList", JSON.stringify(diaryList));
    diaryInput.value = "";
    renderDiary();
    alert("日记保存成功！");
}
