// translations.js - Système de traduction complet

const translations = {
  fr: {
    // NAVIGATION
    nav_label: "Menu principal",
    nav_accueil: "Accueil",
    nav_accueil_meta: "Présentation",
    nav_galerie: "Galerie",
    nav_galerie_meta: "Œuvres",
    nav_disponibles: "Disponibles",
    nav_disponibles_meta: "Acheter",
    nav_expositions: "Expositions",
    nav_expositions_meta: "Évènements",
    nav_concerts: "Concerts",
    nav_concerts_meta: "Lyrique",
    nav_actualites: "Actualités",
    nav_actualites_meta: "En ce moment",
    nav_apropos: "À propos",
    nav_apropos_meta: "Biographie",
    nav_presse: "Presse",
    nav_presse_meta: "Médias",
    nav_contact: "Contact",
    nav_contact_meta: "Me joindre",
    
    // PAGE ACCUEIL
    home_kicker: "Galerie en ligne",
    home_title: "Soazig Héaulme",
    home_subtitle: "ARTISTE PEINTRE, CHANTEUSE LYRIQUE.\nComme un trait continu, l'expression artistique a toujours été une respiration, qui s'est imposée au fil du temps comme projet de vie.",
    home_cta_galerie: "Découvrir la galerie",
    home_cta_apropos: "À propos",
    home_oeuvre_une: "Œuvre à la une",
    
    // SECTION ŒUVRES PHARES
    phares_kicker: "Sélection",
    phares_title: "Œuvres phares",
    
    // SECTION ACTUALITÉS
    actus_kicker: "Actualités",
    actus_title: "En ce moment",
    actus_exposition: "Exposition",
    actus_concert: "Concert",
    actus_oeuvre: "Œuvre",
    actus_nouvelle: "Nouvelle œuvre",
    actus_aucune_expo: "Aucune exposition prévue",
    actus_aucun_concert: "Aucun concert prévu",
    
    // ŒUVRES
    oeuvre_disponible: "Disponible",
    oeuvre_indisponible: "Indisponible",
    oeuvre_vendu: "Vendu",
    oeuvre_voir_plus: "Voir plus",
    oeuvre_description: "Description",
    lire_plus: "En savoir plus…",
    
    // PAGE GALERIE
    galerie_title: "Galerie",
    galerie_subtitle: "Œuvres de Soazig Héaulme",
    galerie_collection: "Disponibles, collections privées, archives",
    galerie_kicker: "Œuvres",
    galerie_toutes: "Toutes les œuvres",
    galerie_tout: "Tout",
    
    // PAGE DISPONIBLES
    disponibles_title: "Œuvres disponibles",
    disponibles_subtitle: "Acquisition · Collectionneurs · Galeries",
    disponibles_kicker: "Acquisitions",
    disponibles_actuelles: "Œuvres actuelles",
    
    // PAGE EXPOSITIONS
    expositions_title: "Expositions",
    expositions_subtitle: "Évènements",
    expositions_kicker_encours: "En ce moment",
    expositions_encours: "En cours",
    expositions_kicker_avenir: "Agenda",
    expositions_avenir: "À venir",
    expositions_kicker_passees: "Archives",
    expositions_passees: "Passées",
    
    // PAGE CONCERTS
    concerts_title: "Concerts",
    concerts_subtitle: "Lyrique",
    concerts_kicker_avenir: "Agenda",
    concerts_prochains: "Prochains concerts",
    concerts_kicker_passes: "Archives",
    concerts_passes: "Concerts passés",
    concerts_a_venir: "À venir",
    
    // PAGE ACTUALITÉS
    actualites_title: "Actualités",
    actualites_subtitle: "En ce moment",
    actualites_tout: "Tout",
    actualites_exposition: "Exposition",
    actualites_concert: "Concert",
    actualites_presse: "Presse",
    actualites_nouvelle: "Nouvelle",
    
    // PAGE PRESSE
    presse_title: "Presse & collaborations",
    presse_subtitle: "Sélection",
    presse_kicker: "Articles",
    presse_selection: "Sélection Presse",
    presse_lien: "Ouvrir l'article",
    
    // PAGE À PROPOS
    apropos_title: "À propos",
    apropos_subtitle: "Artiste peintre & chanteuse lyrique",
    apropos_meta1: "Parcours artistique & lyrique",
    apropos_meta2: "Peinture · Chant lyrique",
    
    // PAGE CONTACT
    contact_title: "Contact",
    contact_subtitle: "Galeries · Programmateurs · Presse · Collectionneurs",
    contact_reponse: "Réponse personnalisée par email",
    contact_form_kicker: "Formulaire",
    contact_form_title: "Entrer en contact",
    contact_type_label: "Vous êtes",
    contact_type_galerie: "Galerie / institution",
    contact_type_programmateur: "Programmateur·rice / salle",
    contact_type_presse: "Presse",
    contact_type_collectionneur: "Collectionneur·se",
    contact_type_autre: "Autre",
    contact_nom: "Nom",
    contact_nom_label: "Nom",
    contact_nom_placeholder: "Votre nom / structure",
    contact_email: "Email",
    contact_email_label: "Email",
    contact_email_placeholder: "email@exemple.com",
    contact_objet_label: "Objet",
    contact_objet_placeholder: "Exposition / acquisition / presse...",
    contact_message: "Message",
    contact_message_label: "Message",
    contact_message_placeholder: "Projet d'exposition, demande d'acquisition, programmation de concert...",
    contact_envoyer: "Envoyer",
    contact_send: "Envoyer",
    contact_hint: "Réponse sous 72h · Aucun spam · Vos informations restent privées",
    contact_info_kicker: "Coordonnées",
    contact_info_title: "Informations",
    contact_info_text: "Pour toute demande concernant les œuvres (prix, disponibilité, exposition), les concerts ou la presse, vous pouvez écrire directement à :",
    contact_instagram: "Instagram",
    contact_info_docs: "Sur demande : biographies, fiches techniques, visuels HD pour la presse, dossier de présentation, etc.",
    
    // PAGE 404
    page_404_title: "404",
    page_404_meta: "Page introuvable",
    page_404_meta2: "Cette page n'existe pas ou plus",
    page_404_text: "La page que vous cherchez n'a pas été trouvée. Elle a peut-être été déplacée, renommée ou supprimée.",
    page_404_cta: "Retour à l'accueil",
    
    // PAGE CONFIDENTIALITÉ
    confidentialite_title: "Confidentialité",
    confidentialite_subtitle: "Politique de protection des données",
    confidentialite_rgpd: "RGPD",
    
    // PAGE MENTIONS LÉGALES
    mentions_title: "Mentions légales",
    mentions_subtitle: "Informations légales & conditions d'utilisation",
    mentions_site: "Site vitrine",
    
    // FOOTER
    footer_copyright: "© 2025 · Soazig Héaulme",
    footer_subtitle: "Galerie en ligne · Paris",
    footer_mentions: "Mentions légales",
    footer_confidentialite: "Confidentialité",
    
    // BOUTON LANGUE
    lang_fr: "FR",
    lang_en: "EN",
    
    // DIVERS
    lire_plus: "Lire plus",
    fermer: "Fermer"
  },
  
  en: {
    // NAVIGATION
    nav_label: "Main menu",
    nav_accueil: "Home",
    nav_accueil_meta: "Presentation",
    nav_galerie: "Gallery",
    nav_galerie_meta: "Artworks",
    nav_disponibles: "Available",
    nav_disponibles_meta: "Purchase",
    nav_expositions: "Exhibitions",
    nav_expositions_meta: "Events",
    nav_concerts: "Concerts",
    nav_concerts_meta: "Lyric",
    nav_actualites: "News",
    nav_actualites_meta: "Current",
    nav_apropos: "About",
    nav_apropos_meta: "Biography",
    nav_presse: "Press",
    nav_presse_meta: "Media",
    nav_contact: "Contact",
    nav_contact_meta: "Get in touch",
    
    // PAGE ACCUEIL
    home_kicker: "Online gallery",
    home_title: "Soazig Héaulme",
    home_subtitle: "PAINTER, LYRIC SINGER.\nLike a continuous line, artistic expression has always been a breath, which has become a life project over time.",
    home_cta_galerie: "Discover the gallery",
    home_cta_apropos: "About",
    home_oeuvre_une: "Featured artwork",
    
    // SECTION ŒUVRES PHARES
    phares_kicker: "Selection",
    phares_title: "Featured artworks",
    
    // SECTION ACTUALITÉS
    actus_kicker: "News",
    actus_title: "Right now",
    actus_exposition: "Exhibition",
    actus_concert: "Concert",
    actus_oeuvre: "Artwork",
    actus_nouvelle: "New artwork",
    actus_aucune_expo: "No upcoming exhibition",
    actus_aucun_concert: "No upcoming concert",
    
    // ŒUVRES
    oeuvre_disponible: "Available",
    oeuvre_indisponible: "Unavailable",
    oeuvre_vendu: "Sold",
    oeuvre_voir_plus: "See more",
    oeuvre_description: "Description",
    lire_plus: "Read more…",
    
    // PAGE GALERIE
    galerie_title: "Gallery",
    galerie_subtitle: "Artworks by Soazig Héaulme",
    galerie_collection: "Available, private collections, archives",
    galerie_kicker: "Artworks",
    galerie_toutes: "All artworks",
    galerie_tout: "All",
    
    // PAGE DISPONIBLES
    disponibles_title: "Available works",
    disponibles_subtitle: "Acquisition · Collectors · Galleries",
    disponibles_kicker: "Acquisitions",
    disponibles_actuelles: "Current works",
    
    // PAGE EXPOSITIONS
    expositions_title: "Exhibitions",
    expositions_subtitle: "Events",
    expositions_kicker_encours: "Right now",
    expositions_encours: "Current",
    expositions_kicker_avenir: "Schedule",
    expositions_avenir: "Upcoming",
    expositions_kicker_passees: "Archives",
    expositions_passees: "Past",
    
    // PAGE CONCERTS
    concerts_title: "Concerts",
    concerts_subtitle: "Lyric",
    concerts_kicker_avenir: "Schedule",
    concerts_prochains: "Upcoming concerts",
    concerts_kicker_passes: "Archives",
    concerts_passes: "Past concerts",
    concerts_a_venir: "Upcoming",
    
    // PAGE ACTUALITÉS
    actualites_title: "News",
    actualites_subtitle: "Current",
    actualites_tout: "All",
    actualites_exposition: "Exhibition",
    actualites_concert: "Concert",
    actualites_presse: "Press",
    actualites_nouvelle: "New",
    
    // PAGE PRESSE
    presse_title: "Press & collaborations",
    presse_subtitle: "Selection",
    presse_kicker: "Articles",
    presse_selection: "Press selection",
    presse_lien: "Open article",
    
    // PAGE À PROPOS
    apropos_title: "About",
    apropos_subtitle: "Painter & lyric singer",
    apropos_meta1: "Artistic & lyric journey",
    apropos_meta2: "Painting · Lyric singing",
    
    // PAGE CONTACT
    contact_title: "Contact",
    contact_subtitle: "Galleries · Programmers · Press · Collectors",
    contact_reponse: "Personalized response by email",
    contact_form_kicker: "Form",
    contact_form_title: "Get in touch",
    contact_type_label: "You are",
    contact_type_galerie: "Gallery / institution",
    contact_type_programmateur: "Programmer / venue",
    contact_type_presse: "Press",
    contact_type_collectionneur: "Collector",
    contact_type_autre: "Other",
    contact_nom: "Name",
    contact_nom_label: "Name",
    contact_nom_placeholder: "Your name / organization",
    contact_email: "Email",
    contact_email_label: "Email",
    contact_email_placeholder: "email@example.com",
    contact_objet_label: "Subject",
    contact_objet_placeholder: "Exhibition / acquisition / press...",
    contact_message: "Message",
    contact_message_label: "Message",
    contact_message_placeholder: "Exhibition project, acquisition request, concert programming...",
    contact_envoyer: "Send",
    contact_send: "Send",
    contact_hint: "Response within 72h · No spam · Your information remains private",
    contact_info_kicker: "Contact details",
    contact_info_title: "Information",
    contact_info_text: "For any request concerning artworks (prices, availability, exhibition), concerts or press, you can write directly to:",
    contact_instagram: "Instagram",
    contact_info_docs: "Upon request: biographies, technical sheets, HD visuals for the press, presentation file, etc.",
    
    // PAGE 404
    page_404_title: "404",
    page_404_meta: "Page not found",
    page_404_meta2: "This page does not exist",
    page_404_text: "The page you are looking for was not found. It may have been moved, renamed or deleted.",
    page_404_cta: "Back to home",
    
    // PAGE CONFIDENTIALITÉ
    confidentialite_title: "Privacy",
    confidentialite_subtitle: "Data protection policy",
    confidentialite_rgpd: "GDPR",
    
    // PAGE MENTIONS LÉGALES
    mentions_title: "Legal notice",
    mentions_subtitle: "Legal information & terms of use",
    mentions_site: "Showcase website",
    
    // FOOTER
    footer_copyright: "© 2025 · Soazig Héaulme",
    footer_subtitle: "Online gallery · Paris",
    footer_mentions: "Legal notice",
    footer_confidentialite: "Privacy",
    
    // BOUTON LANGUE
    lang_fr: "FR",
    lang_en: "EN",
    
    // DIVERS
    lire_plus: "Read more",
    fermer: "Close"
  }
};

// Langue actuelle
let currentLang = localStorage.getItem('soazig_lang') || 'fr';

// Fonction pour obtenir une traduction
function t(key) {
  return translations[currentLang]?.[key] || translations['fr'][key] || key;
}

// Fonction pour changer la langue
function setLanguage(lang) {
  if (!translations[lang]) return;
  
  currentLang = lang;
  localStorage.setItem('soazig_lang', lang);
  
  // Afficher le loader
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.style.display = 'flex';
    loader.setAttribute('aria-hidden', 'false');
  }
  
  // Recharger la page après un court délai pour que le loader s'affiche
  setTimeout(() => {
    window.location.reload();
  }, 100);
}

// Fonction pour mettre à jour tous les textes de la page
function updatePageTexts() {
  // Mettre à jour tous les éléments avec data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    
    // Si c'est un placeholder
    if (el.hasAttribute('placeholder')) {
      el.placeholder = translation;
    } 
    // Si c'est un input value
    else if (el.tagName === 'INPUT' && el.type === 'submit') {
      el.value = translation;
    }
    // Si c'est une option de select
    else if (el.tagName === 'OPTION') {
      el.textContent = translation;
    }
    // Sinon c'est du texte normal
    else {
      // Préserver les retours à la ligne
      if (translation.includes('\n')) {
        el.style.whiteSpace = 'pre-line';
      }
      el.textContent = translation;
    }
  });
  
  // Mettre à jour les placeholders avec data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  
  // Gérer les contenus bilingues avec lang-fr et lang-en
  document.querySelectorAll('[lang="fr"]').forEach(el => {
    el.style.display = currentLang === 'fr' ? '' : 'none';
  });
  document.querySelectorAll('[lang="en"]').forEach(el => {
    el.style.display = currentLang === 'en' ? '' : 'none';
  });
  
  // Mettre à jour le titre de la page si présent
  const titleKey = document.documentElement.getAttribute('data-title-i18n');
  if (titleKey) {
    document.title = t(titleKey) + ' · Soazig Héaulme';
  }
  
  // Mettre à jour les boutons de langue actifs
  document.querySelectorAll('.nav-lang a').forEach(link => {
    if (link.textContent.toLowerCase() === currentLang) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updatePageTexts);
} else {
  updatePageTexts();
}
