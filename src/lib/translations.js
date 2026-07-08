// Patient-facing survey translations
// Languages: es (Español), ca (Català), eu (Euskara), gl (Galego)

const translations = {
  es: {
    label: 'Español',
    // Staff step
    staffTitle: '¿Quién del equipo te ha atendido?',
    staffSubtitle: 'Puedes seleccionar más de uno',
    staffSkip: 'No lo recuerdo',
    continue: 'Continuar',
    // Score step
    scoreTitle: '¿Cómo ha sido tu experiencia?',
    scoreSubtitle: 'Del 0 al 10, ¿cuánto recomendarías nuestra clínica a un amigo o familiar?',
    scoreLow: 'Nada probable',
    scoreHigh: 'Muy probable',
    sending: 'Enviando...',
    // Feedback step (detractor)
    feedbackDetractorTitle: 'Vaya, parece que algo ha ido mal',
    feedbackDetractorSubtitle: 'Lamentamos lo sucedido. ¿Podría contarnos más cuál ha sido el problema?',
    // Feedback step (passive)
    feedbackPassiveTitle: 'Muchas gracias por su opinión',
    feedbackPassiveSubtitle: '¿Podría decirnos qué tendríamos que mejorar para que nuestra próxima nota sea un 10?',
    feedbackPlaceholder: 'Escribe aquí tu comentario...',
    feedbackSkip: 'Prefiero no comentar',
    // Phone step
    phoneTitle: '¿Querría que le llamemos?',
    phoneSubtitle: 'Deje su número de teléfono y alguien del equipo le llamará para tratar de solucionar el problema.',
    phonePlaceholder: 'Ej: 612 345 678',
    phoneSend: 'Enviar',
    phoneSkip: 'No, gracias',
    // Thank you
    thankYouTitle: '¡Muchas gracias!',
    thankYouSubtitle: 'Su opinión es muy valiosa para nosotros. Nos ayuda a mejorar cada día.',
    // Google review redirect
    reviewTitle: '¡Muchísimas gracias!',
    reviewSubtitle: 'Nos alegra saber que ha tenido una buena experiencia. Nos ayudan mucho sus reseñas de 5 estrellas. ¿Podría dejarnos una reseña en Google?',
    reviewButton: 'Dejar reseña en Google',
    reviewNotConfigured: 'Enlace de reseñas no configurado.',
    reviewSkip: 'Prefiero no hacerlo ahora',
    // Footer
    poweredBy: 'Powered by',
    // Greeting
    greeting: 'Hola',
  },

  ca: {
    label: 'Català',
    staffTitle: 'Qui de l\'equip t\'ha atès?',
    staffSubtitle: 'Pots seleccionar més d\'un',
    staffSkip: 'No ho recordo',
    continue: 'Continuar',
    scoreTitle: 'Com ha estat la teva experiència?',
    scoreSubtitle: 'Del 0 al 10, quant recomanaries la nostra clínica a un amic o familiar?',
    scoreLow: 'Gens probable',
    scoreHigh: 'Molt probable',
    sending: 'Enviant...',
    feedbackDetractorTitle: 'Vaja, sembla que alguna cosa ha anat malament',
    feedbackDetractorSubtitle: 'Lamentem el que ha passat. Podria explicar-nos quin ha estat el problema?',
    feedbackPassiveTitle: 'Moltes gràcies per la seva opinió',
    feedbackPassiveSubtitle: 'Podria dir-nos què hauríem de millorar perquè la nostra propera nota sigui un 10?',
    feedbackPlaceholder: 'Escriu aquí el teu comentari...',
    feedbackSkip: 'Prefereixo no comentar',
    phoneTitle: 'Voldria que el truquéssim?',
    phoneSubtitle: 'Deixi el seu número de telèfon i algú de l\'equip el trucarà per tractar de solucionar el problema.',
    phonePlaceholder: 'Ex: 612 345 678',
    phoneSend: 'Enviar',
    phoneSkip: 'No, gràcies',
    thankYouTitle: 'Moltes gràcies!',
    thankYouSubtitle: 'La seva opinió és molt valuosa per a nosaltres. Ens ajuda a millorar cada dia.',
    reviewTitle: 'Moltíssimes gràcies!',
    reviewSubtitle: 'Ens alegra saber que ha tingut una bona experiència. Ens ajuden molt les seves ressenyes de 5 estrelles. Podria deixar-nos una ressenya a Google?',
    reviewButton: 'Deixar ressenya a Google',
    reviewNotConfigured: 'Enllaç de ressenyes no configurat.',
    reviewSkip: 'Prefereixo no fer-ho ara',
    poweredBy: 'Powered by',
    greeting: 'Hola',
  },

  eu: {
    label: 'Euskara',
    staffTitle: 'Taldeko nork artatu zaitu?',
    staffSubtitle: 'Bat baino gehiago aukeratu dezakezu',
    staffSkip: 'Ez dut gogoratzen',
    continue: 'Jarraitu',
    scoreTitle: 'Nolakoa izan da zure esperientzia?',
    scoreSubtitle: '0tik 10era, zenbat gomendatuko zenuke gure klinika lagun edo senide bati?',
    scoreLow: 'Batere probablea ez',
    scoreHigh: 'Oso probablea',
    sending: 'Bidaltzen...',
    feedbackDetractorTitle: 'Badirudi zerbait gaizki joan dela',
    feedbackDetractorSubtitle: 'Sentitzen dugu gertatutakoa. Azaldu ahal diguzu zein izan den arazoa?',
    feedbackPassiveTitle: 'Eskerrik asko zure iritziaregatik',
    feedbackPassiveSubtitle: 'Esan ahal diguzu zer hobetu beharko genukeen hurrengo notean 10 bat lortzeko?',
    feedbackPlaceholder: 'Idatzi hemen zure iruzkina...',
    feedbackSkip: 'Nahiago dut ez iruzkindu',
    phoneTitle: 'Nahi duzu deitzea?',
    phoneSubtitle: 'Utzi zure telefono zenbakia eta taldeko norbaitek deituko dizu arazoa konpontzen saiatzeko.',
    phonePlaceholder: 'Adib: 612 345 678',
    phoneSend: 'Bidali',
    phoneSkip: 'Ez, eskerrik asko',
    thankYouTitle: 'Eskerrik asko!',
    thankYouSubtitle: 'Zure iritzia oso baliotsua da guretzat. Egunero hobetzen laguntzen digu.',
    reviewTitle: 'Mila esker!',
    reviewSubtitle: 'Pozten gaitu esperientzia ona izan duzula jakitea. Asko laguntzen digute zure 5 izarrekoa iritziek. Google-n iruzkin bat utzi ahal diguzu?',
    reviewButton: 'Google-n iruzkina utzi',
    reviewNotConfigured: 'Iruzkinen esteka konfiguratu gabe.',
    reviewSkip: 'Nahiago dut orain ez egin',
    poweredBy: 'Powered by',
    greeting: 'Kaixo',
  },

  gl: {
    label: 'Galego',
    staffTitle: 'Quen do equipo te atendeu?',
    staffSubtitle: 'Podes seleccionar máis dun',
    staffSkip: 'Non o lembro',
    continue: 'Continuar',
    scoreTitle: 'Como foi a túa experiencia?',
    scoreSubtitle: 'Do 0 ao 10, canto recomendarías a nosa clínica a un amigo ou familiar?',
    scoreLow: 'Nada probable',
    scoreHigh: 'Moi probable',
    sending: 'Enviando...',
    feedbackDetractorTitle: 'Vaites, parece que algo foi mal',
    feedbackDetractorSubtitle: 'Lamentamos o sucedido. Podería contarnos máis cal foi o problema?',
    feedbackPassiveTitle: 'Moitas grazas pola súa opinión',
    feedbackPassiveSubtitle: 'Podería dicirnos que deberiamos mellorar para que a nosa próxima nota sexa un 10?',
    feedbackPlaceholder: 'Escribe aquí o teu comentario...',
    feedbackSkip: 'Prefiro non comentar',
    phoneTitle: 'Quería que lle chamásemos?',
    phoneSubtitle: 'Deixe o seu número de teléfono e alguén do equipo chamarao para tratar de solucionar o problema.',
    phonePlaceholder: 'Ex: 612 345 678',
    phoneSend: 'Enviar',
    phoneSkip: 'Non, grazas',
    thankYouTitle: 'Moitas grazas!',
    thankYouSubtitle: 'A súa opinión é moi valiosa para nós. Axúdanos a mellorar cada día.',
    reviewTitle: 'Moitísimas grazas!',
    reviewSubtitle: 'Alegrámonos de saber que tivo unha boa experiencia. Axúdannos moito as súas recensións de 5 estrelas. Podería deixarnos unha recensión en Google?',
    reviewButton: 'Deixar recensión en Google',
    reviewNotConfigured: 'Enlace de recensións non configurado.',
    reviewSkip: 'Prefiro non facelo agora',
    poweredBy: 'Powered by',
    greeting: 'Ola',
  }
}

export function getTranslations(lang) {
  return translations[lang] || translations.es
}

export const LANGUAGES = Object.entries(translations).map(([code, t]) => ({
  code,
  label: t.label
}))
