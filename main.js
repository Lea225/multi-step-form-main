document.addEventListener("DOMContentLoaded", () => {
  const toggleIcon = document.querySelector("#toggleIcon");
  const plans = document.querySelectorAll(".step-content.step-2 .cards > div");
  const addons = document.querySelectorAll(".step-content.step-3 .addons");
  const planChoiceElement = document.querySelector('.step-4 .plan-choice');
  const planBillingElement = document.querySelector('.step-4 .plan-billing');
  const addonsListElement = document.querySelector('.step-4 .addons-list');
  const totalBillingElement = document.querySelector('.step-4 .total-billing');

  let selectedPlan = null;
  let selectedAddons = [];

  // Fonction pour afficher ou masquer les prix mensuels et annuels
  function updateBillingDisplay() {
    const isYearly = toggleIcon.classList.contains('active');
    const monthlyBillings = document.querySelectorAll('.monthly-billing');
    const yearlyBillings = document.querySelectorAll('.yearly-billing');
    const discounts = document.querySelectorAll('.discount');
  
    monthlyBillings.forEach(el => {
      el.style.display = isYearly ? 'none' : 'block';
    });
  
    yearlyBillings.forEach(el => {
      el.style.display = isYearly ? 'block' : 'none';
    });
  
    discounts.forEach(el => {
      if (isYearly) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }
  
  // Appel initial pour configurer l'affichage correct des prix et du rabais
  updateBillingDisplay();  

// Fonction pour obtenir le prix numérique à partir d'une chaîne
function getPrice(priceString) {
  const numericValue = parseFloat(priceString.replace(/[^\d.-]/g, ''));
  return isNaN(numericValue) ? 0 : numericValue;
}

// Fonction pour mettre à jour le résumé
function updateSummary() {
  let total = 0;
  const isYearly = toggleIcon.classList.contains('active');

  // Mettre à jour le choix de plan
  if (selectedPlan) {
    const planName = selectedPlan.querySelector('h3').textContent.trim();
    const planPriceElement = selectedPlan.querySelector('h3 + p'); // Sélecteur pour récupérer le prix du plan
    const planPrice = planPriceElement ? planPriceElement.textContent.trim() : '';

    planChoiceElement.textContent = `${planName} (${isYearly ? "Yearly" : "Monthly"})`;
    planBillingElement.innerHTML = `<div class = "selected-plan-price">${planPrice}</div>`;
    total += getPrice(planPrice); // Ajouter le prix du plan au total
  } else {
    planChoiceElement.textContent = '';
    planBillingElement.textContent = '';
  }

  // Mettre à jour la liste des add-ons
  addonsListElement.innerHTML = '';
  selectedAddons.forEach(addon => {
    const addonName = addon.querySelector('.checkbox-label h4').textContent.trim();
    const addonPriceElement = isYearly ? addon.querySelector('.yearly-billing') : addon.querySelector('.monthly-billing');
    
    if (addonPriceElement) {
      const addonPrice = addonPriceElement.textContent.trim();
      const addonItem = document.createElement('div');
      addonItem.classList.add('addon-item');
      addonItem.innerHTML = `<div>${addonName}</div><div class="addon-price">${addonPrice}</div>`;
      addonsListElement.appendChild(addonItem);

      total += getPrice(addonPrice); // Ajouter le prix de l'addon au total
    } else {
      console.error('Addon Price Element not found');
    }
  });

  // Afficher le total calculé
  totalBillingElement.textContent = `$${total}/${isYearly ? 'yr' : 'mo'}`;
}

  // Appel initial pour configurer l'affichage correct des prix
  updateBillingDisplay();


  const prevButtons = document.querySelectorAll('.prev-step');
  const nextButtons = document.querySelectorAll('.next-step');
  const confirmButton = document.querySelector('.confirm');

  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      const activeStep = document.querySelector('.step-content.active');
      const prevStep = activeStep.previousElementSibling;

      if (prevStep && prevStep.classList.contains('step-content')) {
        showStep(prevStep.id);
      }
    });
  });

  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const activeStep = document.querySelector('.step-content.active');
      const nextStep = activeStep.nextElementSibling;

      if (nextStep && nextStep.classList.contains('step-content')) {
        showStep(nextStep.id);
      }
    });
  });

  // Ajouter un gestionnaire d'événements pour le bouton Confirm
  confirmButton.addEventListener('click', () => {
    showStep('thanks');
  });

  // Écouteurs d'événements pour la sélection de plan
  plans.forEach(plan => {
    plan.addEventListener('click', () => {
      plans.forEach(p => p.classList.remove('selected'));
      plan.classList.add('selected');
      selectedPlan = plan;
      updateSummary();
    });
  });

  // Écouteurs d'événements pour la sélection d'addons
  addons.forEach(addon => {
    addon.addEventListener('click', () => {
      addon.classList.toggle('selected');
      selectedAddons = Array.from(addons).filter(a => a.classList.contains('selected'));
      updateSummary();
    });
  });

  // Écouteur d'événement pour le bouton de bascule
  toggleIcon.addEventListener('click', () => {
    toggleIcon.classList.toggle('active');
    updatePlansAndAddons();
    updateBillingDisplay();
    updateSummary();
  });
  

  // Fonction pour mettre à jour les prix des plans et des addons
  function updatePlansAndAddons() {
    const isYearly = toggleIcon.classList.contains('active');

    // Mettre à jour les prix des plans
    plans.forEach(plan => {
      const arcadeBillingElement = plan.querySelector('.arcade-billing');
      const advancedBillingElement = plan.querySelector('.advanced-billing');
      const proBillingElement = plan.querySelector('.pro-billing');

      if (arcadeBillingElement) {
        arcadeBillingElement.textContent = isYearly ? '$90/yr' : '$9/mo';
      }
      if (advancedBillingElement) {
        advancedBillingElement.textContent = isYearly ? '$120/yr' : '$12/mo';
      }
      if (proBillingElement) {
        proBillingElement.textContent = isYearly ? '$150/yr' : '$15/mo';
      }
    });

    // Mettre à jour les prix des add-ons
    addons.forEach(addon => {
      const addonBillingElement = addon.querySelector('.online-billing, .larger-billing, .customizable-profile-billing');
      if (addonBillingElement) {
        const index = addon.dataset.index;
        if (index === "0") {
          addonBillingElement.textContent = isYearly ? '+$10/yr' : '+$1/mo';
        } else if (index === "1") {
          addonBillingElement.textContent = isYearly ? '+$20/yr' : '+$2/mo';
        } else if (index === "2") {
          addonBillingElement.textContent = isYearly ? '+$20/yr' : '+$2/mo';
        }
      }
    });
  }

  // Fonction pour afficher l'étape actuelle
  const stepButtons = document.querySelectorAll('.step-button');
  const steps = document.querySelectorAll('.step-content');

  // Fonction pour montrer l'étape correspondante
  function showStep(targetId) {
    steps.forEach(step => {
      if (step.id === targetId) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Mettre à jour les boutons actifs
    stepButtons.forEach(button => {
      if (button.getAttribute('data-target') === targetId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  // Ajouter un gestionnaire d'événements pour chaque bouton
  stepButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      showStep(targetId);
    });
  });

  // Afficher la première étape par défaut
  showStep('step-1');

    // Écouteurs d'événements pour la sélection d'addons
  const checkboxes = document.querySelectorAll('.addons .checkbox');
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('click', () => {
      checkbox.classList.toggle('checked');
      updateSelectedAddons();
    });
  });

  // Fonction pour mettre à jour visuellement les addons sélectionnés
  function updateSelectedAddons() {
    addons.forEach((addon, index) => {
      if (addon.checked) {
        addon.classList.add('checked');
      } else {
        addon.classList.remove('checked');
      }
    });
  }


  // Écouteur d'événement pour le bouton "Change" dans la section "Finishing Summary"
  const changePlanLink = document.querySelector('.change-plan');
  if (changePlanLink) {
    changePlanLink.addEventListener('click', () => {
      // Afficher la section "Selected Plan" en utilisant l'index approprié (index 1 dans votre cas)
      showStep('step-2'); // Assurez-vous que 1 est l'index correct pour la section "Selected Plan"
    });
  }

  // Fonction de validation de formulaire
  function validateForm() {
    const inputs = document.querySelectorAll('.step-content.active input[required]');
    let valid = true;

    inputs.forEach(input => {
      const errorMessage = input.nextElementSibling; // Le message d'erreur correspondant au champ

      if (!input.value) {
        valid = false;
        input.classList.add('error');
        errorMessage.textContent = "This field is required"; // Message générique pour champ vide
        errorMessage.style.display = 'flex'; // Affiche le message d'erreur
      } else if (input.type === 'email' && !isValidEmail(input.value)) {
        valid = false;
        errorMessage.textContent = "Invalid email format"; // Message spécifique pour email invalide
        errorMessage.style.display = 'flex'; // Affiche le message d'erreur
        input.classList.add('error');
      } else {
        input.classList.remove('error');
        errorMessage.style.display = 'none'; // Cache le message d'erreur s'il devient valide
      }
    });

    return valid;
  }

  // Fonction pour valider le format d'email
  function isValidEmail(email) {
    // Expression régulière pour vérifier le format d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
});