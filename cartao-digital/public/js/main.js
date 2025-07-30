// public/js/main.js
import {
    loadData,
    updateDisplay,
    updatePhoto,
    updateAdditionalButtons,
    applyColors,
    formatPhone,
    renderSocialMedia,
    renderServicesList,
    renderAdminServices,
    showCardView,
    showAdminPanel, 
    attemptLogin,
    closeLogin,
    logout,
    showLogin, 
    openWhatsApp,
    showServicesModal,
    closeServicesModal,
    contactForService,
    downloadVCF,
    openGoogleReview,
    openLocation,
    savePersonalInfo,
    saveSocialMedia,
    handlePhotoUpload,
    setPrimaryColor,
    setBackgroundColor,
    addService,
    deleteService,
    updateCardPreview, // Embora não haja preview ao lado, a função pode existir.
    isLoggedIn, 
    showAddService, 
    hideAddService,
    showContactFormModal, // NEW: Importar para abrir o modal do formulário
    closeContactFormModal // NEW: Importar para fechar o modal do formulário
} from './app.js'; // Caminho para app.js (na mesma pasta)

// Inicialização da aplicação e adição de Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadData(); // Carrega os dados do localStorage
    updateDisplay(); // Atualiza a visualização do cartão
    renderSocialMedia(); // Renderiza as redes sociais
    updateAdditionalButtons(); // Garante que botões adicionais apareçam/sumam (incluindo o novo forms)
    applyColors(); // Aplica as cores salvas
    
    // --- Adição de Event Listeners para os botões estáticos no HTML ---

    // Botão "Área Administrativa" / "Ver Cartão"
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            if (!isLoggedIn) { 
                showLogin(); 
            } else { 
                if (document.getElementById('cardView').classList.contains('hidden')) {
                    showCardView(); 
                } else {
                    showAdminPanel(); 
                }
            }
        });
    }

    // Login Modal buttons
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    if (loginSubmitBtn) loginSubmitBtn.addEventListener('click', attemptLogin);

    const cancelLoginBtn = document.getElementById('cancelLoginBtn');
    if (cancelLoginBtn) cancelLoginBtn.addEventListener('click', closeLogin);

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Card View Action Buttons
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) whatsappBtn.addEventListener('click', openWhatsApp);

    const servicesModalBtn = document.getElementById('servicesModalBtn');
    if (servicesModalBtn) servicesModalBtn.addEventListener('click', showServicesModal);

    // NEW: Contact Form Button
    const contactFormBtn = document.getElementById('contactFormBtn');
    if (contactFormBtn) contactFormBtn.addEventListener('click', showContactFormModal);

    const saveContactBtn = document.getElementById('saveContactBtn');
    if (saveContactBtn) saveContactBtn.addEventListener('click', downloadVCF);

    const googleReviewBtn = document.getElementById('googleReviewBtn');
    if (googleReviewBtn) googleReviewBtn.addEventListener('click', openGoogleReview);

    const locationBtn = document.getElementById('locationBtn');
    if (locationBtn) locationBtn.addEventListener('click', openLocation);

    // Services Modal close button
    const closeServicesModalBtn = document.getElementById('closeServicesModalBtn');
    if (closeServicesModalBtn) closeServicesModalBtn.addEventListener('click', closeServicesModal);

    // NEW: Contact Form Modal close button
    const closeContactFormModalBtn = document.getElementById('closeContactFormModalBtn');
    if (closeContactFormModalBtn) closeContactFormModalBtn.addEventListener('click', closeContactFormModal);


    // Admin Panel Buttons
    const savePersonalInfoBtn = document.getElementById('savePersonalInfoBtn');
    if (savePersonalInfoBtn) savePersonalInfoBtn.addEventListener('click', savePersonalInfo);

    const saveSocialMediaBtn = document.getElementById('saveSocialMediaBtn');
    if (saveSocialMediaBtn) saveSocialMediaBtn.addEventListener('click', saveSocialMedia);

    const addServiceFormToggleBtn = document.getElementById('addServiceFormToggleBtn');
    if (addServiceFormToggleBtn) addServiceFormToggleBtn.addEventListener('click', showAddService);

    const addServiceBtn = document.getElementById('addServiceBtn');
    if (addServiceBtn) addServiceBtn.addEventListener('click', addService);

    const cancelAddServiceBtn = document.getElementById('cancelAddServiceBtn');
    if (cancelAddServiceBtn) cancelAddServiceBtn.addEventListener('click', hideAddService);

    const backToCardViewBtn = document.getElementById('backToCardViewBtn');
    if (backToCardViewBtn) backToCardViewBtn.addEventListener('click', showCardView);


    // --- Event delegation for dynamically created elements (like "Contratar" and "Excluir" service buttons) ---
    const servicesListContainer = document.getElementById('servicesList');
    if (servicesListContainer) {
        servicesListContainer.addEventListener('click', function(event) {
            const targetButton = event.target.closest('[data-action="contact-service"]');
            if (targetButton) {
                const serviceName = targetButton.dataset.serviceName;
                if (serviceName) {
                    contactForService(serviceName);
                }
            }
        });
    }

    const adminServicesListContainer = document.getElementById('adminServicesList');
    if (adminServicesListContainer) {
        adminServicesListContainer.addEventListener('click', function(event) {
            const targetButton = event.target.closest('[data-action="delete-service"]');
            if (targetButton) {
                const serviceId = parseInt(targetButton.dataset.serviceId);
                if (!isNaN(serviceId)) {
                    deleteService(serviceId);
                }
            }
        });
    }

    // --- Event listeners para os inputs de cores (buttons de seleção de cor) ---
    document.querySelectorAll('[data-color][data-target]').forEach(button => {
        button.addEventListener('click', function() {
            const color = this.dataset.color;
            const target = this.dataset.target;
            if (target === 'primary') {
                setPrimaryColor(color);
            } else if (target === 'background') {
                setBackgroundColor(color);
            }
            updateCardPreview(); 
        });
    });


    // --- Event listeners para os campos do admin para atualizar o preview em tempo real ---
    const adminInputsToPreview = [
        'adminName', 'adminTitle', 'adminBio', 'adminPhone', 'adminEmail',
        'adminInstagram', 'adminLinkedin', 'adminWebsite', 'adminYoutube',
        'adminTiktok', 'adminFacebook', 'adminGoogleReview', 'adminLocation',
        'adminContactForm' // NEW: Adicionado para o formulário de contato
    ];
    adminInputsToPreview.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.addEventListener('input', updateAdditionalButtons); // Atualiza os botões da home
        }
    });

    const photoUploadInput = document.getElementById('photoUpload');
    if (photoUploadInput) {
        photoUploadInput.addEventListener('change', () => {
            handlePhotoUpload(); 
        });
    }

    const primaryColorPicker = document.getElementById('primaryColorPicker');
    if (primaryColorPicker) primaryColorPicker.addEventListener('input', () => {
        setPrimaryColor(primaryColorPicker.value);
    });
    const primaryColorHex = document.getElementById('primaryColorHex');
    if (primaryColorHex) primaryColorHex.addEventListener('input', () => {
        setPrimaryColor(primaryColorHex.value);
    });

    const backgroundColorPicker = document.getElementById('backgroundColorPicker');
    if (backgroundColorPicker) backgroundColorPicker.addEventListener('input', () => {
        setBackgroundColor(backgroundColorPicker.value);
    });
    const backgroundColorHex = document.getElementById('backgroundColorHex');
    if (backgroundColorHex) backgroundColorHex.addEventListener('input', () => {
        setBackgroundColor(backgroundColorHex.value);
    });

    // Listeners para teclas (Enter para login, Escape para fechar modais)
    document.addEventListener('keydown', function(event) {
        const loginModal = document.getElementById('loginModal');
        const servicesModal = document.getElementById('servicesModal');
        const contactFormModal = document.getElementById('contactFormModal'); // NEW: Adicionado para o modal do formulário

        if (event.key === 'Enter' && loginModal && !loginModal.classList.contains('hidden')) {
            attemptLogin();
        }
        if (event.key === 'Escape') {
            if (loginModal && !loginModal.classList.contains('hidden')) {
                closeLogin();
            }
            if (servicesModal && !servicesModal.classList.contains('hidden')) {
                closeServicesModal();
            }
            if (contactFormModal && !contactFormModal.classList.contains('hidden')) { // NEW: Fechar modal do formulário
                closeContactFormModal();
            }
        }
    });
});