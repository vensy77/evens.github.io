'use strict';
// Lien Click to Chat : ouvre WhatsApp sans envoyer de message automatiquement.
const contactConfig=window.PORTFOLIO_CONFIG||{};
const whatsappNumber=String(contactConfig.whatsappNumber||'50944028243').replace(/\D/g,'');
const whatsappMessage=contactConfig.whatsappMessage||'Bonjour Evens, je souhaite échanger au sujet d’un projet.';
if(/^\d{8,15}$/.test(whatsappNumber)){
 const whatsappURL='https://wa.me/'+whatsappNumber+'?text='+encodeURIComponent(whatsappMessage);
 document.querySelectorAll('[data-whatsapp]').forEach(link=>{link.href=whatsappURL;});
}
