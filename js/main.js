document.addEventListener('DOMContentLoaded', function() {
  // Инициализация ripple-эффекта
  initRippleEffects();
  
  // Загрузка сохраненных данных
  loadResumeData();
  
  // Настройка автосохранения
  setupAutoSave();
  
  // Настройка кнопки скачивания
  setupDownloadButton();
});

function initRippleEffects() {
  document.querySelectorAll('[contenteditable="true"], .download-btn').forEach(el => {
    el.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('wave');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  });
}

function loadResumeData() {
  const savedData = localStorage.getItem('resumeData');
  if (savedData) {
    const resumeData = JSON.parse(savedData);
    document.querySelectorAll('[contenteditable="true"]').forEach((el, index) => {
      if (resumeData[`resumeItem_${index}`]) {
        el.innerHTML = resumeData[`resumeItem_${index}`];
      }
    });
  }
}

function setupAutoSave() {
  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    el.addEventListener('blur', function() {
      const resumeData = {};
      document.querySelectorAll('[contenteditable="true"]').forEach((el, index) => {
        resumeData[`resumeItem_${index}`] = el.innerHTML;
      });
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    });
  });
}

function setupDownloadButton() {
  document.getElementById('downloadBtn').addEventListener('click', async function() {
    try {
      const btn = this;
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Генерация...';
      
      // Генерация PDF
      const { jsPDF } = window.jspdf;
      const element = document.getElementById('resumeContent');
      
      // Скрываем кнопку перед генерацией
      const downloadBtn = document.querySelector('.download-btn');
      downloadBtn.style.display = 'none';
      
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: '#FFFFFF'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Резюме_Flutter_разработчика.pdf');
      
      // Восстанавливаем кнопку
      downloadBtn.style.display = 'flex';
      btn.disabled = false;
      btn.innerHTML = originalText;
    } catch (error) {
      console.error('Ошибка генерации PDF:', error);
      alert('Произошла ошибка при генерации PDF');
      document.getElementById('downloadBtn').disabled = false;
      document.getElementById('downloadBtn').innerHTML = '<i class="fas fa-download"></i> Скачать PDF';
    }
  });
}
