(function(){
  // Simple chatbot using sales script from data/sales_script.md (summarized)
  const TELEPHONE = '+84384824390';
  const ZALO = '0384824390';

  const RESPONSES = {
    greeting: 'Chào bạn! Mình là đội tư vấn NOXH Hưng Phú 2 — có thể giúp gì cho bạn hôm nay? 😊\n\nMuốn kiểm tra nhanh điều kiện thì cho mình biết tên + nơi ở + thu nhập, mình kiểm tra miễn phí trong 5 phút.',
    check_condition: 'Bạn cho mình biết: (1) đang có nhà không, (2) thu nhập trung bình/tháng, (3) nơi thường trú. Mình kiểm tra ngay — miễn phí, không ràng buộc.',
    docs: 'Danh sách cơ bản: CCCD/CMND, hộ khẩu, giấy xác nhận thu nhập (hoặc giấy xác nhận hoạt động cho lao động tự do), đơn đăng ký. Mình gửi checklist chi tiết theo trường hợp của bạn.',
    price: 'Giá do dự án công bố và đã được hỗ trợ. Thường hỗ trợ vay NH 70-80% với lãi suất ưu đãi. Gửi mình loại căn bạn quan tâm (1PN/2PN) để mình báo ước tính.',
    freelance: 'Lao động tự do vẫn được xét. Mình sẽ hướng dẫn cách chứng minh thu nhập: giấy xác nhận hoạt động/ bảng kê doanh thu/ tờ khai thuế. Nhiều khách tự do đã được chấp nhận.',
    rejected: 'Nếu hồ sơ bị từ chối, chúng tôi phân tích lý do, hướng dẫn sửa hồ sơ và nộp lại — tỉ lệ thành công sau chỉnh sửa rất cao.',
    timing: 'Thời gian trung bình: 25–35 ngày từ khi nộp hồ sơ. Nếu chuẩn hồ sơ thì có thể rút ngắn rủi ro và thời gian.',
    meet: 'Bạn có thể gặp trực tiếp tại văn phòng hoặc dự án. Gọi/Zalo để đặt lịch: ' + ZALO,
    default: 'Mình chưa rõ lắm — bạn nói ngắn gọn giúp mình: bạn quan tâm vấn đề gì nhất? (ví dụ: điều kiện, giấy tờ, giá, vay NH, cách chứng minh thu nhập)',
    cta_form: 'Nếu bạn muốn đăng ký, bấm nút "Đăng ký nhận tư vấn" dưới đây để điền form danh sách chờ. Mình sẽ gọi lại để hỗ trợ hoàn thiện hồ sơ.'
  };

  function createNode(html){
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
  }

  function addMessage(container, text, who){
    const m = document.createElement('div');
    m.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
    m.textContent = text;
    container.appendChild(m);
    container.scrollTop = container.scrollHeight;
  }

  function renderQuickReplies(container, replies){
    const wrap = document.createElement('div');
    wrap.className = 'quick-replies';
    replies.forEach(r=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = r;
      btn.addEventListener('click', ()=>{
        onUserSend(r);
      });
      wrap.appendChild(btn);
    });
    container.appendChild(wrap);
    container.scrollTop = container.scrollHeight;
  }

  function onUserSend(text){
    if(!text) return;
    const body = document.querySelector('.chat-body');
    addMessage(body, text, 'user');
    // simple keyword matching
    const t = text.toLowerCase();
    setTimeout(()=>{
      if(/(điều kiện|đủ điều kiện|kiểm tra)/.test(t)) return botReply('check_condition');
      if(/(giấy|hồ sơ|chứng minh|cccd|hộ khẩu|giấy tờ)/.test(t)) return botReply('docs');
      if(/(giá|tiền|trả góp|vay)/.test(t)) return botReply('price');
      if(/(tự do|lao động tự do|kinh doanh)/.test(t)) return botReply('freelance');
      if(/(từ chối|không được|bị từ chối)/.test(t)) return botReply('rejected');
      if(/(bao lâu|thời gian|kết quả)/.test(t)) return botReply('timing');
      if(/(gặp|gặp trực tiếp|hẹn)/.test(t)) return botReply('meet');
      if(/(mua|đặt|đăng ký|muốn mua)/.test(t)) return showPurchaseCta();
      if(/(zalo|0384|0384824390)/.test(t)) return botReplyWithZalo();
      if(/(form|để lại|đăng ký nhận|danh sách)/.test(t)) return showFormCta();
      // fallback
      botReply('default');
    }, 600);
  }

  function botReply(key){
    const body = document.querySelector('.chat-body');
    addMessage(body, RESPONSES[key] || RESPONSES.default, 'bot');
    // after common replies show quick replies
    setTimeout(()=>{
      renderQuickReplies(body, ['Kiểm tra điều kiện','Gửi checklist giấy tờ','Báo giá nhanh','Thêm Zalo','Để lại info']);
    }, 200);
  }

  function botReplyWithZalo(){
    const body = document.querySelector('.chat-body');
    addMessage(body, 'Bạn có thể thêm Zalo: ' + ZALO + ' hoặc gọi ' + TELEPHONE, 'bot');
  }

  function showPurchaseCta(){
    const body = document.querySelector('.chat-body');
    addMessage(body, RESPONSES.cta_form, 'bot');
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'chat-cta';
    const formBtn = document.createElement('a');
    formBtn.href = '#dang-ky-form';
    formBtn.className = 'btn';
    formBtn.textContent = 'Điền form danh sách chờ';
    formBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      const el = document.querySelector('#dang-ky-form');
      if(el){ el.scrollIntoView({behavior:'smooth', block:'center'}); el.querySelector('input, textarea')?.focus(); }
    });
    const callBtn = document.createElement('a');
    callBtn.href = 'tel:' + TELEPHONE;
    callBtn.className = 'btn';
    callBtn.textContent = 'Gọi tư vấn';
    ctaWrap.appendChild(formBtn);
    ctaWrap.appendChild(callBtn);
    body.appendChild(ctaWrap);
    body.scrollTop = body.scrollHeight;
  }

  // build DOM
  function init(){
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-widget';

    const windowDiv = document.createElement('div');
    windowDiv.className = 'chat-window';
    windowDiv.style.display = 'none';

    windowDiv.innerHTML = `
      <div class="chat-header">
        <div class="title">NOXH Hưng Phú 2 — Tư vấn</div>
        <button aria-label="Đóng" class="chat-close" style="background:transparent;border:none;color:#fff;cursor:pointer">✕</button>
      </div>
      <div class="chat-body"></div>
      <div class="chat-input-area">
        <input class="chat-input" placeholder="Nhập câu hỏi hoặc chọn gợi ý..." />
        <button class="chat-send" style="background:#0ea5e9;color:#fff;border:none;padding:8px 10px;border-radius:8px;cursor:pointer">Gửi</button>
      </div>
    `;

    const btn = document.createElement('button');
    btn.className = 'chat-button';
    btn.setAttribute('aria-label','Mở chat');
    btn.innerHTML = '💬';

    wrapper.appendChild(windowDiv);
    wrapper.appendChild(btn);
    document.body.appendChild(wrapper);

    const body = windowDiv.querySelector('.chat-body');
    const input = windowDiv.querySelector('.chat-input');
    const send = windowDiv.querySelector('.chat-send');
    const close = windowDiv.querySelector('.chat-close');

    function openWindow(){
      windowDiv.style.display = 'flex';
      btn.style.display = 'none';
      // auto-greet
      setTimeout(()=>{
        addMessage(body, RESPONSES.greeting, 'bot');
        setTimeout(()=> renderQuickReplies(body, ['Kiểm tra điều kiện','Gửi checklist giấy tờ','Báo giá nhanh','Thêm Zalo','Để lại info']), 300);
      }, 300);
    }
    function closeWindow(){
      windowDiv.style.display = 'none';
      btn.style.display = 'flex';
    }

    btn.addEventListener('click', openWindow);
    close.addEventListener('click', closeWindow);
    send.addEventListener('click', ()=>{ const v = input.value.trim(); if(!v) return; onUserSend(v); input.value=''; });
    input.addEventListener('keypress', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); send.click(); }});
  }

  // wait for DOM
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
