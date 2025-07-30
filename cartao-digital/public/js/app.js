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
        primaryColor: '#1f2937',
        backgroundColor: '#f9fafb'
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
        contactForm: '' // NEW: Nova propriedade para o link do formulário de contato
    },
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
        // Garantir que businessCardData.additional exista e tenha as propriedades necessárias
        if (!businessCardData.additional) {
            businessCardData.additional = { googleReview: '', location: '', contactForm: '' };
        } else {
            if (!businessCardData.additional.googleReview) businessCardData.additional.googleReview = '';
            if (!businessCardData.additional.location) businessCardData.additional.location = '';
            if (!businessCardData.additional.contactForm) businessCardData.additional.contactForm = ''; // NEW: Garante que contactForm exista
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
    const photoContainers = [
        document.getElementById('profilePhotoContainer'), 
        document.getElementById('adminPhotoPreview')
    ];
    
    photoContainers.forEach(container => {
        if (container) {
            if (businessCardData.personal.photo) {
                container.innerHTML = `<img src="${businessCardData.personal.photo}" alt="Foto" class="w-full h-full object-cover">`;
            } else {
                const iconSize = container.id === 'profilePhotoContainer' ? 'text-2xl' : 'text-xl';
                container.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-user ${iconSize}"></i></div>`;
            }
        }
    });
}

export function updateAdditionalButtons() {
    // Show/hide Google Forms button
    const contactFormBtn = document.getElementById('contactFormBtn');
    if (contactFormBtn) {
        if (businessCardData.additional.contactForm && businessCardData.additional.contactForm.trim() !== '') {
            contactFormBtn.classList.remove('hidden');
        } else {
            contactFormBtn.classList.add('hidden');
        }
    }

    // Show/hide Google Review button
    const googleReviewBtn = document.getElementById('googleReviewBtn');
    if (googleReviewBtn) { 
        if (businessCardData.additional.googleReview && businessCardData.additional.googleReview.trim() !== '') {
            googleReviewBtn.classList.remove('hidden');
        } else {
            googleReviewBtn.classList.add('hidden');
        }
    }

    // Show/hide Location button
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

export function applyColors() {
    const primaryColor = businessCardData.personal.primaryColor || '#1f2937';
    const backgroundColor = businessCardData.personal.backgroundColor || '#f9fafb';
    
    document.body.style.background = `linear-gradient(135deg, ${backgroundColor} 0%, ${adjustBrightness(backgroundColor, -5)} 100%)`;
    
    let style = document.getElementById('colorStyle');
    if (!style) {
        style = document.createElement('style');
        style.id = 'colorStyle';
        document.head.appendChild(style);
    }
    const hoverColor = adjustBrightness(primaryColor, -10);
    style.innerHTML = `
        .bg-gray-900 { background-color: ${primaryColor} !important; }
        .hover\\:bg-gray-800:hover { background-color: ${hoverColor} !important; }
        .text-gray-900 { color: ${primaryColor} !important; }
        .border-gray-900 { border-color: ${primaryColor} !important; }
        .focus\\:border-gray-900:focus { border-color: ${primaryColor} !important; }
    `;
}

function adjustBrightness(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

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
            // updateCardPreview(); // Não usado nesta versão
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

// Social Media Functions
export function renderSocialMedia() {
    const container = document.getElementById('socialMediaContainer');
    const social = businessCardData.social;
    
    if (!container) return; 

    const socialPlatforms = [
        { key: 'instagram', icon: 'fab fa-instagram', name: 'Instagram' },
        { key: 'linkedin', icon: 'fab fa-linkedin', name: 'LinkedIn' },
        { key: 'website', icon: 'fas fa-globe', name: 'Website' },
        { key: 'youtube', icon: 'fab fa-youtube', name: 'YouTube' },
        { key: 'tiktok', icon: 'fab fa-tiktok', name: 'TikTok' },
        { key: 'facebook', icon: 'fab fa-facebook', name: 'Facebook' }
    ];

    const activeSocials = socialPlatforms.filter(platform => social[platform.key] && social[platform.key].trim() !== '');

    if (activeSocials.length === 0) {
        container.innerHTML = '<div class="col-span-3 text-center text-gray-400 py-4"><p class="text-sm">Nenhuma rede social</p></div>';
        return;
    }

    container.innerHTML = activeSocials.map(platform => `
        <a href="${formatSocialLink(platform.key, social[platform.key])}" target="_blank" class="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all hover-lift">
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

// NEW: Contact Form Modal Functions
export function showContactFormModal() {
    const contactFormModal = document.getElementById('contactFormModal');
    const googleFormIframe = document.getElementById('googleFormIframe');

    if (contactFormModal && googleFormIframe) {
        const formLink = businessCardData.additional.contactForm;
        // Importante: Google Forms requer o link "incorporar" (embed)
        // Se o usuário fornecer um link de compartilhamento normal (forms.gle/...),
        // precisamos tentar convertê-lo para o formato de incorporação.
        // Ex: forms.gle/XYZ -> forms.gle/d/e/XYZ/viewform?embedded=true
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
        googleFormIframe.src = ''; // Limpa o src do iframe ao fechar para parar qualquer carregamento
    }
}


export function renderServicesList() {
    const container = document.getElementById('servicesList');
    
    if (!container) return; 

    if (businessCardData.services.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8"><p>Nenhum serviço cadastrado</p></div>';
        return;
    }

    container.innerHTML = businessCardData.services.map(service => `
        <div class="p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
            <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3 flex-1">
                    <div class="text-2xl">${service.emoji}</div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 text-lg">${service.name}</h4>
                        <p class="text-gray-600 text-sm mb-3">${service.description}</p>
                        <div class="flex flex-wrap gap-2 text-sm">
                            <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">${service.price}</span>
                            <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">${service.duration}</span>
                        </div>
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
export function showLogin() { // <--- GARANTIR QUE showLogin ESTÁ EXPORTADA AQUI
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
    const adminContactFormInput = document.getElementById('adminContactForm'); // NEW: Campo do formulário de contato

    if (adminNameInput) adminNameInput.value = businessCardData.personal.name;
    if (adminTitleInput) adminTitleInput.value = businessCardData.personal.title;
    if (adminBioInput) adminBioInput.value = businessCardData.personal.bio;
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

    // NEW: Campo do formulário de contato
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
    const adminContactFormInput = document.getElementById('adminContactForm'); // NEW: Campo do formulário de contato

    if (adminInstagramInput) businessCardData.social.instagram = adminInstagramInput.value;
    if (adminFacebookInput) businessCardData.social.facebook = adminFacebookInput.value;
    if (adminLinkedinInput) businessCardData.social.linkedin = adminLinkedinInput.value;
    if (adminYoutubeInput) businessCardData.social.youtube = adminYoutubeInput.value;
    if (adminTiktokInput) businessCardData.social.tiktok = adminTiktokInput.value;
    if (adminWebsiteInput) businessCardData.social.website = adminWebsiteInput.value;

    // NEW: Salva o link do formulário de contato
    if (adminContactFormInput) businessCardData.additional.contactForm = adminContactFormInput.value;
    
    // Save additional features
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
    const name = document.getElementById('serviceName').value.trim();
    const price = document.getElementById('servicePrice').value.trim();
    const emoji = document.getElementById('serviceEmoji').value.trim();
    const duration = document.getElementById('serviceDuration').value.trim();
    const description = document.getElementById('serviceDesc').value.trim();

    if (!name || !price || !emoji || !duration || !description) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const newService = {
        id: Date.now(),
        name,
        price,
        emoji,
        duration,
        description
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
    } else {
        container.innerHTML = businessCardData.services.map(service => `
            <div class="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl service-item" data-id="${service.id}">
                <div class="flex items-center space-x-4">
                    <i class="fas fa-grip-vertical drag-handle text-gray-400 cursor-grab"></i>
                    <div>
                        <h4 class="font-semibold text-gray-900">${service.name}</h4>
                        <p class="text-sm text-gray-600">${service.description}</p>
                        <div class="flex items-center space-x-2 mt-1">
                            <span class="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">${service.price}</span>
                            <span class="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">${service.duration}</span>
                        </div>
                    </div>
                </div>
                <button data-action="delete-service" data-service-id="${service.id}" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

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

// A função updateCardPreview e related previewBlockTemplates não são necessárias nesta versão funcional.
export function updateCardPreview() {
    // Esta função pode ser deixada vazia, pois nesta versão, não há um preview em tempo real ao lado.
}