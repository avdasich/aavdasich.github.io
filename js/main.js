document.addEventListener('DOMContentLoaded', function() {
  
  initRippleEffects();
  
  loadResumeData();
  
  setupAutoSave();

  setupDownloadButton();
  
  setupMobileContacts();
});

function initRippleEffects() {
  document.querySelectorAll('.download-btn').forEach(el => {
    el.addEventListener('click', function(e) {
      // Добавляем контейнер для ripple
      const rippleContainer = document.createElement('div');
      rippleContainer.style.position = 'absolute';
      rippleContainer.style.overflow = 'hidden';
      rippleContainer.style.top = '0';
      rippleContainer.style.left = '0';
      rippleContainer.style.right = '0';
      rippleContainer.style.bottom = '0';
      rippleContainer.style.borderRadius = 'inherit';
      rippleContainer.style.pointerEvents = 'none';
      
      const ripple = document.createElement('span');
      ripple.classList.add('wave');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      rippleContainer.appendChild(ripple);
      this.appendChild(rippleContainer);
      
      ripple.addEventListener('animationend', () => {
        rippleContainer.remove();
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
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      
 
      if (window.innerWidth < 768) {
        if (!confirm('Для лучшего результата рекомендуется использовать альбомную ориентацию. Продолжить?')) {
          btn.disabled = false;
          btn.innerHTML = originalText;
          return;
        }
      }
      
     
      const downloadBtn = document.querySelector('.download-btn');
      downloadBtn.style.display = 'none';
      
      const canvas = await html2canvas(document.getElementById('resumeContent'), {
        scale: 2,
        logging: false,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        backgroundColor: '#FFFFFF'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Резюме_Flutter_разработчика.pdf');
      
      
      downloadBtn.style.display = 'flex';
      btn.disabled = false;
      btn.innerHTML = originalText;
    } catch (error) {
      console.error('Ошибка генерации PDF:', error);
      alert('Произошла ошибка при генерации PDF');
      document.getElementById('downloadBtn').disabled = false;
      document.getElementById('downloadBtn').innerHTML = '<i class="fas fa-download"></i>';
    }
  });
}

function setupMobileContacts() {
  const showMoreBtn = document.querySelector('.show-more-contacts');
  if (showMoreBtn && window.innerWidth <= 576) {
    showMoreBtn.addEventListener('click', () => {
      document.querySelectorAll('.contact-item.mobile-hidden').forEach(item => {
        item.style.display = 'flex';
      });
      showMoreBtn.style.display = 'none';
    });
  }
}
