function addParticipant() {
    const participantsContainer = document.getElementById('participantsContainer');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'participantInput';
    input.placeholder = 'Enter participant name';
    participantsContainer.appendChild(input);
    input.focus();
}

function addCouple() {
    const couplesContainer = document.getElementById('couplesContainer');
    const coupleContainer = document.createElement('div');
    for (let i = 0; i < 2; i++) {
        const couple_input = document.createElement('input');
        couple_input.type = 'text';
        couple_input.className = 'coupleInput';
        couple_input.placeholder = 'Enter participant '.concat(i + 1);

        coupleContainer.appendChild(couple_input);
    }
    couplesContainer.appendChild(coupleContainer);
}

function generateSecretSanta() {
    const participantInputs = document.querySelectorAll('.participantInput');
    const participants = [];
    participantInputs.forEach(input => {
        if (input.value.trim() !== '') {
            participants.push(input.value.trim());
        }
    });

    const coupleInputs = document.querySelectorAll('.coupleInput');
    const couples = [];
    coupleInputs.forEach((input, index) => {
        if (index % 2 === 0) {
            const couple = [input.value.trim(), coupleInputs[index + 1].value.trim()];
            if (couple[0] !== '' && couple[1] !== '') {
                couples.push(couple);
            }
        }
    });

    const result = document.getElementById('result');

    // Vérification du nombre de participants
    if (participants.length < 3) {
        result.innerHTML = "Il doit y avoir au moins trois participants pour organiser un Secret Santa.";
        return;
    }

    // Création d'une copie des participants
    let remainingParticipants = participants.slice();

    // Tableau pour stocker les paires de donneur-receveur
    let secretSantaPairs = [];

    // Fonction pour vérifier si une paire viole une règle
    function violatesRules(giver, receiver) {
        // Vérifie si la réciprocité est violée
        for (let pair of secretSantaPairs) {
            if (pair.giver === receiver && pair.receiver === giver) {
                return true;
            }
        }
        // Vérifie si le couple est violé
        for (let couple of couples) {
            if ((couple[0] === giver && couple[1] === receiver) ||
                (couple[1] === giver && couple[0] === receiver)) {
                return true;
            }
        }
        return false;
    }

    // Fonction pour choisir un receveur pour un donneur donné
    function chooseReceiver(giver) {
        let validReceivers = remainingParticipants.filter(receiver => receiver !== giver && !violatesRules(giver, receiver));
        if (validReceivers.length === 0) {
            // Si aucun receveur valide n'est trouvé, réinitialiser et recommencer
            remainingParticipants = participants.slice();
            return chooseReceiver(giver);
        }
        const randomIndex = Math.floor(Math.random() * validReceivers.length);
        const receiver = validReceivers[randomIndex];
        // Supprimer le receveur choisi de la liste des participants restants
        remainingParticipants = remainingParticipants.filter(participant => participant !== receiver);
        return receiver;
    }

    // Générer les paires de Secret Santa
    for (let giver of participants) {
        const receiver = chooseReceiver(giver);
        secretSantaPairs.push({ giver, receiver });
    }

    // Afficher les résultats
    let resultHTML = "<h2>Répartition des cadeaux :</h2>";
    for (let pair of secretSantaPairs) {
        resultHTML += `<p>${pair.giver} offre à ${pair.receiver}</p>`;
    }
    result.innerHTML = resultHTML;
}

module.exports = { addParticipant, addCouple, generateSecretSanta };
