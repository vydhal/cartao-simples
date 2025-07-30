// public/js/app.js
// Sortable.js é carregado globalmente via CDN no index.html, não é importado aqui.

// Data Storage
export let businessCardData = {
    personal: {
        name: 'Seu Nome',
        title: 'Sua Profissão',
        bio: 'Sua descrição profissional',
        phone: '5511999999999',
        email: 'seu@email.com',
        photo: null,
        primaryColor: '#1f2937', // Cor principal padrão (quase preto/azul escuro)
        backgroundColor: '#f9fafb' // Cor de fundo padrão (quase branco)
    },
    social: {
        instagram: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        tiktok: '',
        website: ''
    },
    additional: {
        googleReview: '',
        location: '',
        contactForm: '' 
    },
    customLinks: [], // Nova propriedade para links adicionais personalizados
    services: [
        {
            id: 1,
            name: 'Consultoria',
            description: 'Consultoria especializada na sua área',
            price: 'R$ 150,00',
            duration: '1 hora',
            emoji: '💼'
        }
    ],
    credentials: {
        username: 'admin',
        password: 'admin123'
    }
};

export let currentView = 'card';
export let isLoggedIn = false; 

// Data Management
export function loadData() {
    const saved = localStorage.getItem('businessCardData');
    if (saved) {
        businessCardData = JSON.parse(saved);
        if (!businessCardData.additional) {
            businessCardData.additional = { googleReview: '', location: '', contactForm: '' };
        } else {
            if (!businessCardData.additional.googleReview) businessCardData.additional.googleReview = '';
            if (!businessCardData.additional.location) businessCardData.additional.location = '';
            if (!businessCardData.additional.contactForm) businessCardData.additional.contactForm = '';
        }
        // Garantir que customLinks existe
        if (!businessCardData.customLinks) {
            businessCardData.customLinks = [];
        }
        applyColors();
    }
}

export function saveData() {
    localStorage.setItem('businessCardData', JSON.stringify(businessCardData));
}

export function updateDisplay() {
    const displayNameElem = document.getElementById('displayName');
    if (displayNameElem) displayNameElem.textContent = businessCardData.personal.name;

    const displayTitleElem = document.getElementById('displayTitle');
    if (displayTitleElem) displayTitleElem.textContent = businessCardData.personal.title;

    const displayBioElem = document.getElementById('displayBio');
    if (displayBioElem) displayBioElem.textContent = businessCardData.personal.bio;

    const displayPhoneElem = document.getElementById('displayPhone');
    if (displayPhoneElem) displayPhoneElem.textContent = formatPhone(businessCardData.personal.phone);

    const displayEmailElem = document.getElementById('displayEmail');
    if (displayEmailElem) displayEmailElem.textContent = businessCardData.personal.email;
    
    updatePhoto();
}

export function updatePhoto() {
    const profilePhotoContainer = document.getElementById('profilePhotoContainer'); 
    const adminPhotoPreview = document.getElementById('adminPhotoPreview');

    if (profilePhotoContainer) {
        if (businessCardData.personal.photo) {
            profilePhotoContainer.innerHTML = `<img src="${businessCardData.personal.photo}" alt="Foto" class="w-full h-full object-cover">`;
        } else {
            profilePhotoContainer.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-user text-2xl"></i></div>`;
            // A cor do ícone na cardView será definida por applyColors
            // Não precisamos definir diretamente aqui para não sobrescrever applyColors
        }
    }

    if (adminPhotoPreview) {
        if (businessCardData.personal.photo) {
            adminPhotoPreview.innerHTML = `<img src="${businessCardData.personal.photo}" alt="Foto" class="w-full h-full object-cover">`;
        } else {
            // Ícone da foto de perfil no admin - DEVE PERMANECER CINZA padrão
            adminPhotoPreview.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-user text-xl"></i></div>`;
        }
    }
}

export function updateAdditionalButtons() {
    const contactFormBtn = document.getElementById('contactFormBtn');
    if (contactFormBtn) {
        if (businessCardData.additional.contactForm && businessCardData.additional.contactForm.trim() !== '') {
            contactFormBtn.classList.remove('hidden');
        } else {
            contactFormBtn.classList.add('hidden');
        }
    }

    const googleReviewBtn = document.getElementById('googleReviewBtn');
    if (googleReviewBtn) { 
        if (businessCardData.additional.googleReview && businessCardData.additional.googleReview.trim() !== '') {
            googleReviewBtn.classList.remove('hidden');
        } else {
            googleReviewBtn.classList.add('hidden');
        }
    }

    const locationBtn = document.getElementById('locationBtn');
    if (locationBtn) { 
        if (businessCardData.additional.location && businessCardData.additional.location.trim() !== '') {
            locationBtn.classList.remove('hidden');
        } else {
            locationBtn.classList.add('hidden');
        }
    }
}

export function openGoogleReview() {
    if (businessCardData.additional.googleReview) {
        window.open(businessCardData.additional.googleReview, '_blank');
    }
}

export function openLocation() {
    if (businessCardData.additional.location) {
        window.open(businessCardData.additional.location, '_blank');
    }
}

export function setPrimaryColor(color) {
    businessCardData.personal.primaryColor = color;
    applyColors();
    const primaryColorPicker = document.getElementById('primaryColorPicker');
    const primaryColorHex = document.getElementById('primaryColorHex');
    if (primaryColorPicker) primaryColorPicker.value = color;
    if (primaryColorHex) primaryColorHex.value = color;
}

export function setBackgroundColor(color) {
    businessCardData.personal.backgroundColor = color;
    applyColors();
    const backgroundColorPicker = document.getElementById('backgroundColorPicker');
    const backgroundColorHex = document.getElementById('backgroundColorHex');
    if (backgroundColorPicker) backgroundColorPicker.value = color;
    if (backgroundColorHex) backgroundColorHex.value = color;
}

// Helper para determinar se uma cor é clara ou escura (para contraste de texto)
function isColorLight(hexColor) {
    // Retorna true se a cor for clara (luminosidade > 0.5)
    if (!hexColor || hexColor.length !== 7) return true; // Default para claro se inválido
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}

// Helper para obter um tom mais claro/escuro de uma cor (para monocromia)
function getMonochromaticColor(hex, percent) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;  
    G = (G < 255) ? G : 255;  
    B = (B < 255) ? B : 255;  

    R = (R > 0) ? R : 0;  
    G = (G > 0) ? G : 0;  
    B = (B > 0) ? B : 0;  

    let c = "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    return c;
}

// Helper para ajustar brilho (mais seguro)
function adjustBrightness(hex, percent) {
    const num = parseInt(hex.substring(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    const clampedR = Math.min(255, Math.max(0, R));
    const clampedG = Math.min(255, Math.max(0, G));
    const clampedB = Math.min(255, Math.max(0, B));

    return "#" + (0x1000000 + (clampedR << 16) + (clampedG << 8) + clampedB).toString(16).slice(1);
}

// Helper para obter a melhor cor de texto (preto ou branco) para um determinado fundo
function getContrastTextColor(bgColor) {
    return isColorLight(bgColor) ? '#1f2937' : '#ffffff'; // Dark gray or white
}


export function applyColors() {
    const primaryColor = businessCardData.personal.primaryColor || '#1f2937';
    const backgroundColor = businessCardData.personal.backgroundColor || '#f9fafb';
    
    const isMainBackgroundLight = isColorLight(backgroundColor);
    
    // Cores para os "cartões internos" (Contato, Redes Sociais, Serviços)
    // Se o fundo principal é claro, os cartões internos serão brancos (claro).
    // Se o fundo principal é escuro, os cartões internos DEVERIAM ser brancos para contraste.
    const cardBgColor = isMainBackgroundLight ? '#ffffff' : '#ffffff'; // FORÇADO BRANCO SE FUNDO ESCURO
    const cardBorderColor = isMainBackgroundLight ? '#e5e7eb' : getMonochromaticColor(primaryColor, -10); // Borda mais escura que primary se fundo escuro
    const cardHoverBgColor = isMainBackgroundLight ? '#f3f4f6' : getMonochromaticColor(primaryColor, -20); // Hover mais escuro que primary se fundo escuro

    // Cores do texto principal e secundário dentro dos cartões internos
    // Se o CARD é branco (no tema escuro), o texto deve ser PRIMARY COLOR.
    const textColorInsideCards = isColorLight(cardBgColor) ? primaryColor : '#ffffff'; 
    const secondaryTextColorInsideCards = isColorLight(cardBgColor) ? '#6b7280' : '#d1d5db'; 

    // Cor do texto do rodapé "Feito por Simplisoft"
    const footerTextColor = isMainBackgroundLight ? '#6b7280' : '#d1d5db'; 
    const footerLinkHoverColor = primaryColor; 

    // 1. Aplica a cor de fundo principal (body)
    document.body.style.background = `linear-gradient(135deg, ${backgroundColor} 0%, ${adjustBrightness(backgroundColor, -5)} 100%)`;
    
    // 2. Aplica cores dinamicamente via tag <style> para elementos do CARTÃO PRINCIPAL (#cardView)
    let styleTag = document.getElementById('colorStyle');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'colorStyle';
        document.head.appendChild(styleTag);
    }
    
    const hoverColor = adjustBrightness(primaryColor, -10);

    // Regras CSS para o CARDVIEW (seletividade para não afetar o adminPanel)
    styleTag.innerHTML = `
        /* Cores dos botões primários no cardView */
        #cardView .bg-gray-900 { background-color: ${primaryColor} !important; }
        #cardView .hover\\:bg-gray-800:hover { background-color: ${hoverColor} !important; }
        #cardView .text-white { color: ${getContrastTextColor(primaryColor)} !important; } /* Texto nos botões bg-primary */
        #cardView button.bg-gray-900 span { color: ${getContrastTextColor(primaryColor)} !important; }
        #cardView button.bg-gray-900 i { color: ${getContrastTextColor(primaryColor)} !important; }
        
        /* Botão Área Administrativa - garantir contraste adequado */
        #adminBtn { background-color: ${primaryColor} !important; }
        #adminBtn:hover { background-color: ${hoverColor} !important; }
        #adminBtn span { color: ${getContrastTextColor(primaryColor)} !important; }
        #adminBtn i { color: ${getContrastTextColor(primaryColor)} !important; }

        /* Cores dos cartões internos (Contato, Redes Sociais, Serviços) e seus textos no cardView */
        #cardView .bg-white { background-color: ${cardBgColor} !important; }
        #cardView .border-gray-100 { border-color: ${cardBorderColor} !important; }
        
        /* Textos dentro da cardView (Nome, Título, Bio, Títulos de seção, Telefone/Email, Serviços) */
        #cardView h1,
        #cardView .font-medium, /* Para telefone/email */
        #cardView h3 { /* Títulos das seções Contato, Redes Sociais */
            color: ${textColorInsideCards} !important; 
        }
        #cardView p.text-sm, /* Bio, labels de telefone/email */
        #cardView p.text-xs, /* Textos menores */
        #cardView span.text-sm, /* Preço/Duração do serviço */
        #cardView span.text-xs /* Nomes das redes sociais */
        {
            color: ${secondaryTextColorInsideCards} !important; 
        }
        
        /* Fundo dos ícones de contato e dos botões sociais */
        #cardView .w-10.h-10.rounded-full, /* Círculos dos ícones de telefone/email */
        #cardView .grid > a.rounded-xl /* Botões de redes sociais */
        {
            background-color: ${cardHoverBgColor} !important; /* Usar o hover color para um tom levemente diferente */
        }
        #cardView .w-10.h-10.rounded-full i, /* Ícones de telefone/email dentro dos círculos */
        #cardView .grid > a.rounded-xl i, /* Ícones de redes sociais */
        #cardView .grid > a.rounded-xl span /* Texto dos nomes das redes sociais */
        {
            color: ${textColorInsideCards} !important; 
        }
        #cardView .grid > a.rounded-xl:hover { /* Hover nos botões de redes sociais */
            background-color: ${cardBorderColor} !important; /* Um tom ligeiramente mais escuro para o hover */
        }

        /* Hover dos botões brancos principais (Ver serviços, Preencher Formulário, etc.) */
        #cardView button.bg-white.hover\\:bg-gray-50:hover {
            background-color: ${cardHoverBgColor} !important;
        }
        #cardView button.bg-white i, /* Ícones dentro dos botões brancos */
        #cardView button.bg-white span /* Texto dentro dos botões brancos */
        {
            color: ${textColorInsideCards} !important;
        }
        #cardView button.bg-white.border-2.border-gray-200 { /* Bordas dos botões brancos */
             border-color: ${cardBorderColor} !important;
        }

        /* Cores para o rodapé (footer) - GLOBALMENTE aplicadas, mas baseadas no background principal */
        .text-xs.text-gray-500 { color: ${footerTextColor} !important; }
        .text-xs.text-gray-500 a { color: ${footerTextColor} !important; }
        .text-xs.text-gray-500 a:hover { color: ${footerLinkHoverColor} !important; }

        /* Ajuste para input focus em ambos os painéis (admin e card) */
        .focus\\:border-gray-900:focus { border-color: ${primaryColor} !important; }
    `;

    // A cor do ícone padrão na foto de perfil da cardView é atualizada em updatePhoto.
    // O ícone do adminPhotoPreview não é afetado por esses seletores específicos para #cardView.
}

// Funções auxiliares (adjustBrightness, formatPhone, etc.) permanecem as mesmas.

export function handlePhotoUpload() {
    const fileInput = document.getElementById('photoUpload');
    const file = fileInput.files[0];
    
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert('Arquivo muito grande! Máximo 2MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            businessCardData.personal.photo = e.target.result;
            updatePhoto();
        };
        reader.readAsDataURL(file);
    }
}

export function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 13) {
        return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    } else if (cleaned.length === 12) {
        return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
    }
    return phone;
}

export function renderSocialMedia() {
    const container = document.getElementById('socialMediaContainer');
    const social = businessCardData.social;
    
    if (!container) return; 

    const socialPlatforms = [
        { key: 'instagram', icon: 'fab fa-instagram', name: 'Instagram' },
        { key: 'linkedin', icon: 'fab fa-linkedin', name: 'LinkedIn' },
        { key: 'website', icon: 'fas fa-globe', name: 'Website' },
        { key: 'youtube', 'icon': 'fab fa-youtube', name: 'YouTube' },
        { key: 'tiktok', icon: 'fab fa-tiktok', name: 'TikTok' },
        { key: 'facebook', icon: 'fab fa-facebook', name: 'Facebook' }
    ];

    const activeSocials = socialPlatforms.filter(platform => social[platform.key] && social[platform.key].trim() !== '');

    if (activeSocials.length === 0) {
        // A cor será definida pelo CSS injetado de applyColors
        container.innerHTML = `<div class="col-span-3 text-center"><p class="text-sm">Nenhuma rede social</p></div>`;
        return;
    }

    // A cor dos ícones de social media nos cartões internos agora é ajustada por applyColors
    container.innerHTML = activeSocials.map(platform => `
        <a href="${formatSocialLink(platform.key, social[platform.key])}" target="_blank" class="bg-gray-100 hover:bg-gray-200 p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all hover-lift">
            <i class="${platform.icon} text-xl"></i>
            <span class="text-xs font-medium">${platform.name}</span>
        </a>
    `).join('');
}

export function formatSocialLink(platform, value) {
    if (!value) return '#';
    
    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
    }
    
    switch (platform) {
        case 'instagram':
            return value.startsWith('@') ? `https://instagram.com/${value.slice(1)}` : `https://instagram.com/${value}`;
        case 'facebook':
            if (value.includes('facebook.com')) {
                return `https://${value.replace(/^(https?:\/\/)?(www\.)?/, '')}`;
            }
            return `https://facebook.com/${value}`;
        case 'linkedin':
            if (value.includes('linkedin.com/in/') || value.includes('linkedin.com/company/')) {
                return `https://${value.replace(/^(https?:\/\/)?(www\.)?/, '')}`;
            }
            return `https://linkedin.com/in/${value}`;
        case 'youtube':
            if (value.match(/^(UC[\w-]{21}|user\/[\w-]+)$/)) {
                return `https://www.youtube.com/channel/${value.replace('UC', '')}`; 
            }
            return value.startsWith('http') ? value : `https://www.youtube.com/results?search_query=${encodeURIComponent(value)}`; 
        case 'tiktok':
            return value.startsWith('@') ? `https://tiktok.com/${value}` : `https://tiktok.com/@${value}`;
        case 'website':
            return value.startsWith('http') ? value : `https://${value}`;
        default:
            return value;
    }
}

// Action Functions
export function openWhatsApp() {
    const message = `Olá! Vi seu cartão de visitas digital e gostaria de conversar.`;
    const whatsappUrl = `https://wa.me/${businessCardData.personal.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

export function showServicesModal() {
    renderServicesList();
    document.getElementById('servicesModal').classList.remove('hidden');
}

export function closeServicesModal() {
    document.getElementById('servicesModal').classList.add('hidden');
}

export function showContactFormModal() {
    const contactFormModal = document.getElementById('contactFormModal');
    const googleFormIframe = document.getElementById('googleFormIframe');

    if (contactFormModal && googleFormIframe) {
        const formLink = businessCardData.additional.contactForm;
        let embedLink = formLink;
        if (formLink.includes('forms.gle/') && !formLink.includes('/viewform?embedded=true')) {
            const formId = formLink.split('forms.gle/')[1];
            embedLink = `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`;
        } else if (formLink.includes('/viewform') && !formLink.includes('embedded=true')) {
            embedLink = `${formLink}?embedded=true`;
        }
        
        googleFormIframe.src = embedLink;
        contactFormModal.classList.remove('hidden');
    }
}

export function closeContactFormModal() {
    const contactFormModal = document.getElementById('contactFormModal');
    const googleFormIframe = document.getElementById('googleFormIframe');
    if (contactFormModal && googleFormIframe) {
        contactFormModal.classList.add('hidden');
        googleFormIframe.src = ''; 
    }
}


export function renderServicesList() {
    const container = document.getElementById('servicesList');
    
    if (!container) return; 

    if (businessCardData.services.length === 0) {
        // A cor será definida pelo CSS injetado de applyColors
        container.innerHTML = `<div class="text-center"><p class="text-sm">Nenhum serviço cadastrado</p></div>`;
        return;
    }

    container.innerHTML = businessCardData.services.map(service => `
        <div class="p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
            <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3 flex-1">
                    <div class="text-2xl">${service.emoji}</div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-lg">${service.name}</h4> <p class="text-sm mb-3">${service.description}</p> <div class="flex flex-wrap gap-2 text-sm">
                            <span class="bg-gray-100 px-3 py-1 rounded-full">${service.price}</span> <span class="bg-gray-100 px-3 py-1 rounded-full">${service.duration}</span> </div>
                    </div>
                </div>
                <button data-action="contact-service" data-service-name="${service.name}" class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors ml-4">
                    <i class="fab fa-whatsapp mr-1"></i>Contratar
                </button>
            </div>
        </div>
    `).join('');
}

export function contactForService(serviceName) {
    const message = `Olá! Tenho interesse no serviço: ${serviceName}. Poderia me dar mais informações?`;
    const whatsappUrl = `https://wa.me/${businessCardData.personal.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

export function downloadVCF() {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${businessCardData.personal.name}
TITLE:${businessCardData.personal.title}
TEL:+${businessCardData.personal.phone}
EMAIL:${businessCardData.personal.email}
NOTE:${businessCardData.personal.bio}
${businessCardData.social.website ? `URL:${formatSocialLink('website', businessCardData.social.website)}\n` : ''}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${businessCardData.personal.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Login Functions
export function showLogin() { 
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('loginUser').focus();
}

export function closeLogin() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('loginError').classList.add('hidden');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPassword').value = '';
}

export function attemptLogin() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    if (username === businessCardData.credentials.username && password === businessCardData.credentials.password) {
        isLoggedIn = true;
        closeLogin();
        showAdminPanel(); 
        document.getElementById('logoutBtn').classList.remove('hidden');
    } else {
        errorDiv.textContent = 'Usuário ou senha incorretos!';
        errorDiv.classList.remove('hidden');
        document.getElementById('loginPassword').value = '';
    }
}

export function logout() {
    isLoggedIn = false;
    showCardView();
    document.getElementById('logoutBtn').classList.add('hidden');
}

export function showAdminPanel() {
    currentView = 'admin';
    document.getElementById('cardView').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden'); 
    document.getElementById('viewToggle').textContent = 'Ver Cartão';
    loadAdminData();
}

export function showCardView() {
    currentView = 'card';
    document.getElementById('cardView').classList.remove('hidden'); 
    document.getElementById('adminPanel').classList.add('hidden'); 
    document.getElementById('viewToggle').textContent = 'Área Administrativa'; 
    updateDisplay();
    renderSocialMedia();
    updateAdditionalButtons();
    applyColors();
}

// Admin Functions
export function loadAdminData() {
    const adminNameInput = document.getElementById('adminName');
    const adminTitleInput = document.getElementById('adminTitle');
    const adminBioInput = document.getElementById('adminBio');
    const adminPhoneInput = document.getElementById('adminPhone');
    const adminEmailInput = document.getElementById('adminEmail');
    const primaryColorPicker = document.getElementById('primaryColorPicker');
    const primaryColorHex = document.getElementById('primaryColorHex');
    const backgroundColorPicker = document.getElementById('backgroundColorPicker');
    const backgroundColorHex = document.getElementById('backgroundColorHex');
    const adminInstagramInput = document.getElementById('adminInstagram');
    const adminFacebookInput = document.getElementById('adminFacebook');
    const adminLinkedinInput = document.getElementById('adminLinkedin');
    const adminYoutubeInput = document.getElementById('adminYoutube');
    const adminTiktokInput = document.getElementById('adminTiktok');
    const adminWebsiteInput = document.getElementById('adminWebsite');
    const adminGoogleReviewInput = document.getElementById('adminGoogleReview');
    const adminLocationInput = document.getElementById('adminLocation');
    const adminContactFormInput = document.getElementById('adminContactForm'); 

    if (adminNameInput) adminNameInput.value = businessCardData.personal.name;
    if (adminTitleInput) businessCardData.personal.title = adminTitleInput.value;
    if (adminBioInput) businessCardData.personal.bio = adminBioInput.value;
    if (adminPhoneInput) adminPhoneInput.value = businessCardData.personal.phone;
    if (adminEmailInput) adminEmailInput.value = businessCardData.personal.email;
    
    // Colors
    if (primaryColorPicker) primaryColorPicker.value = businessCardData.personal.primaryColor || '#1f2937';
    if (primaryColorHex) primaryColorHex.value = businessCardData.personal.primaryColor || '#1f2937';
    if (backgroundColorPicker) backgroundColorPicker.value = businessCardData.personal.backgroundColor || '#f9fafb';
    if (backgroundColorHex) backgroundColorHex.value = businessCardData.personal.backgroundColor || '#f9fafb';
    
    // Social media
    if (adminInstagramInput) adminInstagramInput.value = businessCardData.social.instagram;
    if (adminFacebookInput) adminFacebookInput.value = businessCardData.social.facebook;
    if (adminLinkedinInput) adminLinkedinInput.value = businessCardData.social.linkedin;
    if (adminYoutubeInput) adminYoutubeInput.value = businessCardData.social.youtube;
    if (adminTiktokInput) adminTiktokInput.value = businessCardData.social.tiktok;
    if (adminWebsiteInput) adminWebsiteInput.value = businessCardData.social.website;

    if (adminContactFormInput) adminContactFormInput.value = businessCardData.additional.contactForm || '';
    
    // Additional features
    if (adminGoogleReviewInput) adminGoogleReviewInput.value = businessCardData.additional.googleReview || '';
    if (adminLocationInput) adminLocationInput.value = businessCardData.additional.location || '';
    
    renderAdminServices(); 
}

export function savePersonalInfo() {
    const adminNameInput = document.getElementById('adminName');
    const adminTitleInput = document.getElementById('adminTitle');
    const adminBioInput = document.getElementById('adminBio');
    const adminPhoneInput = document.getElementById('adminPhone');
    const adminEmailInput = document.getElementById('adminEmail');
    const primaryColorHex = document.getElementById('primaryColorHex');
    const backgroundColorHex = document.getElementById('backgroundColorHex');

    if (adminNameInput) businessCardData.personal.name = adminNameInput.value;
    if (adminTitleInput) businessCardData.personal.title = adminTitleInput.value;
    if (adminBioInput) businessCardData.personal.bio = adminBioInput.value;
    if (adminPhoneInput) businessCardData.personal.phone = adminPhoneInput.value.replace(/\D/g, '');
    if (adminEmailInput) businessCardData.personal.email = adminEmailInput.value;
    
    // Save colors
    if (primaryColorHex) businessCardData.personal.primaryColor = primaryColorHex.value || '#1f2937';
    if (backgroundColorHex) businessCardData.personal.backgroundColor = backgroundColorHex.value || '#f9fafb';
    
    saveData();
    updateDisplay(); 
    applyColors(); 
    alert('Informações pessoais e cores salvas com sucesso!');
}

export function saveSocialMedia() {
    const adminInstagramInput = document.getElementById('adminInstagram');
    const adminFacebookInput = document.getElementById('adminFacebook');
    const adminLinkedinInput = document.getElementById('adminLinkedin');
    const adminYoutubeInput = document.getElementById('adminYoutube');
    const adminTiktokInput = document.getElementById('adminTiktok');
    const adminWebsiteInput = document.getElementById('adminWebsite');
    const adminGoogleReviewInput = document.getElementById('adminGoogleReview');
    const adminLocationInput = document.getElementById('adminLocation');
    const adminContactFormInput = document.getElementById('adminContactForm'); 

    if (adminInstagramInput) businessCardData.social.instagram = adminInstagramInput.value;
    if (adminFacebookInput) businessCardData.social.facebook = adminFacebookInput.value;
    if (adminLinkedinInput) businessCardData.social.linkedin = adminLinkedinInput.value;
    if (adminYoutubeInput) businessCardData.social.youtube = adminYoutubeInput.value;
    if (adminTiktokInput) businessCardData.social.tiktok = adminTiktokInput.value;
    if (adminWebsiteInput) businessCardData.social.website = adminWebsiteInput.value;

    if (adminContactFormInput) businessCardData.additional.contactForm = adminContactFormInput.value;
    
    if (adminGoogleReviewInput) businessCardData.additional.googleReview = adminGoogleReviewInput.value;
    if (adminLocationInput) businessCardData.additional.location = adminLocationInput.value;
    
    saveData();
    renderSocialMedia(); 
    updateAdditionalButtons(); 
    alert('Redes sociais e links adicionais salvos com sucesso!');
}

// Services Management
export function showAddService() {
    const addServiceForm = document.getElementById('addServiceForm');
    if (addServiceForm) {
        addServiceForm.classList.remove('hidden');
    }
}

export function hideAddService() {
    const addServiceForm = document.getElementById('addServiceForm');
    if (addServiceForm) {
        addServiceForm.classList.add('hidden');
    }
    clearServiceForm();
}

export function clearServiceForm() {
    const serviceNameInput = document.getElementById('serviceName');
    const servicePriceInput = document.getElementById('servicePrice');
    const serviceEmojiInput = document.getElementById('serviceEmoji');
    const serviceDurationInput = document.getElementById('serviceDuration');
    const serviceDescInput = document.getElementById('serviceDesc');

    if (serviceNameInput) serviceNameInput.value = '';
    if (servicePriceInput) servicePriceInput.value = '';
    if (serviceEmojiInput) serviceEmojiInput.value = '';
    if (serviceDurationInput) serviceDurationInput.value = '';
    if (serviceDescInput) serviceDescInput.value = '';
}

export function addService() {
    const name = document.getElementById('serviceName'); // Pega o elemento input
    const price = document.getElementById('servicePrice');
    const emoji = document.getElementById('serviceEmoji');
    const duration = document.getElementById('serviceDuration');
    const description = document.getElementById('serviceDesc');

    // Valida os valores, não os elementos
    if (!name.value.trim() || !price.value.trim() || !emoji.value.trim() || !duration.value.trim() || !description.value.trim()) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const newService = {
        id: Date.now(),
        name: name.value.trim(),
        price: price.value.trim(),
        emoji: emoji.value.trim(),
        duration: duration.value.trim(),
        description: description.value.trim()
    };

    businessCardData.services.push(newService);
    saveData();
    renderAdminServices();
    hideAddService();
    alert('Serviço adicionado com sucesso!');
}

export function deleteService(serviceId) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        businessCardData.services = businessCardData.services.filter(s => s.id !== serviceId);
        saveData();
        renderAdminServices();
        alert('Serviço excluído com sucesso!');
    }
}

let sortableInstanceServices = null; 

export function renderAdminServices() {
    const container = document.getElementById('adminServicesList');
    
    if (!container) return; 

    if (businessCardData.services.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8"><p>Nenhum serviço cadastrado</p></div>';
        return;
    }

    container.innerHTML = businessCardData.services.map(service => `
        <div class="p-4 border-2 border-gray-100 rounded-xl service-item" data-id="${service.id}">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <i class="fas fa-grip-vertical drag-handle text-gray-400 cursor-grab"></i>
                    <div>
                        <h4 class="font-semibold text-gray-900">${service.name}</h4>
                        <p class="text-sm text-gray-600">${service.description}</p>
                        <div class="flex flex-wrap gap-2 text-sm">
                            <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded">${service.price}</span>
                            <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded">${service.duration}</span>
                        </div>
                    </div>
                </div>
                <button data-action="delete-service" data-service-id="${service.id}" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    initializeSortableServices();
}

function initializeSortableServices() {
    const adminServicesList = document.getElementById('adminServicesList');
    if (adminServicesList) {
        if (sortableInstanceServices) {
            sortableInstanceServices.destroy(); 
        }
        if (typeof Sortable !== 'undefined') { 
            sortableInstanceServices = new Sortable(adminServicesList, {
                animation: 150,
                handle: '.drag-handle', 
                onEnd: function (evt) {
                    const oldIndex = evt.oldIndex;
                    const newIndex = evt.newIndex;
                    
                    const movedItem = businessCardData.services.splice(oldIndex, 1)[0];
                    businessCardData.services.splice(newIndex, 0, movedItem);
                    
                    saveData();
                },
            });
        } else {
            console.error("Sortable.js not found for service reordering. Please ensure it's loaded via CDN.");
        }
    }
}

export function updateCardPreview() {
    // Esta função está vazia porque o preview em tempo real foi removido para retornar à versão funcional.
}

// Funções para gerenciar links personalizados
export function showAddCustomLinkForm() {
    const form = document.getElementById('addCustomLinkForm');
    if (form) {
        form.classList.remove('hidden');
        document.getElementById('customLinkName').focus();
    }
}

export function hideAddCustomLinkForm() {
    const form = document.getElementById('addCustomLinkForm');
    if (form) {
        form.classList.add('hidden');
        // Limpar campos
        document.getElementById('customLinkName').value = '';
        document.getElementById('customLinkUrl').value = '';
    }
}

export function addCustomLink() {
    const name = document.getElementById('customLinkName').value.trim();
    const url = document.getElementById('customLinkUrl').value.trim();
    
    if (!name || !url) {
        alert('Por favor, preencha o nome e a URL do link.');
        return;
    }
    
    // Validar URL
    try {
        new URL(url);
    } catch (e) {
        alert('Por favor, insira uma URL válida.');
        return;
    }
    
    // Gerar ID único
    const id = Date.now();
    
    // Adicionar link ao array
    businessCardData.customLinks.push({
        id: id,
        name: name,
        url: url
    });
    
    saveData();
    renderCustomLinks();
    renderCustomLinksDisplay();
    hideAddCustomLinkForm();
}

export function deleteCustomLink(id) {
    if (confirm('Tem certeza que deseja excluir este link?')) {
        businessCardData.customLinks = businessCardData.customLinks.filter(link => link.id !== id);
        saveData();
        renderCustomLinks();
        renderCustomLinksDisplay();
    }
}

export function renderCustomLinks() {
    const container = document.getElementById('customLinksList');
    if (!container) return;
    
    if (businessCardData.customLinks.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Nenhum link adicional configurado</p>';
        return;
    }
    
    container.innerHTML = businessCardData.customLinks.map(link => `
        <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div class="flex-1">
                <h4 class="font-medium text-gray-900">${link.name}</h4>
                <p class="text-sm text-gray-600 break-all">${link.url}</p>
            </div>
            <button onclick="deleteCustomLink(${link.id})" class="ml-4 text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors" data-action="delete-custom-link" data-link-id="${link.id}">
                <i class="fas fa-trash text-sm"></i>
            </button>
        </div>
    `).join('');
}

export function renderCustomLinksDisplay() {
    const container = document.getElementById('additionalLinksDisplayContainer');
    if (!container) return;
    
    if (businessCardData.customLinks.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = `
        <div class="bg-white rounded-2xl p-6 mt-6 shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold mb-4">Links Adicionais</h3>
            <div class="space-y-3">
                ${businessCardData.customLinks.map(link => `
                    <a href="${link.url}" target="_blank" class="w-full bg-white hover:bg-gray-50 py-4 rounded-2xl font-semibold transition-all hover-lift border-2 border-gray-200 flex items-center justify-center space-x-3">
                        <i class="fas fa-external-link-alt text-lg"></i>
                        <span>${link.name}</span>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

// Tornar funções globais para uso nos event handlers inline
window.deleteCustomLink = deleteCustomLink;

