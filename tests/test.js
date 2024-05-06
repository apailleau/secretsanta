const { JSDOM } = require('jsdom');
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.document = dom.window.document;

const { addParticipant, addCouple, generateSecretSanta } = require('../secretsanta');

describe('Secret Santa', () => {
    beforeEach(() => {
        // Reset the document body
        document.body.innerHTML = `
            <div id="participantsContainer"></div>
            <div id="couplesContainer"></div>
            <div id="result"></div>
        `;
    });

    test('addParticipant adds a participant input', () => {
        addParticipant();
        const inputs = document.querySelectorAll('.participantInput');
        expect(inputs.length).toBe(1);
    });

    test('addCouple adds a couple input', () => {
        addCouple();
        const inputs = document.querySelectorAll('.coupleInput');
        expect(inputs.length).toBe(2);
    });

    // This is a basic test for generateSecretSanta, you may need to add more tests based on your requirements
    test('generateSecretSanta generates secret santa pairs', () => {
        // Add participants
        addParticipant();
        addParticipant();
        addParticipant();
        const participantInputs = document.querySelectorAll('.participantInput');
        participantInputs[0].value = 'Alice';
        participantInputs[1].value = 'Bob';
        participantInputs[2].value = 'Charlie';

        // Generate secret santa pairs
        generateSecretSanta();

        // Check result
        const result = document.getElementById('result');
        expect(result.innerHTML).toContain('Alice offre à');
        expect(result.innerHTML).toContain('Bob offre à');
        expect(result.innerHTML).toContain('Charlie offre à');
    });


    test('generateSecretSanta ensures no reciprocity', () => {
        // Add participants
        for (let i = 0; i < 100; i++) {
            addParticipant();
        }
        const participantInputs = document.querySelectorAll('.participantInput');
        for (let i = 0; i < 100; i++) {
            participantInputs[i].value = `Participant ${i + 1}`;
        }

        // Run the secret santa generation multiple times
        for (let i = 0; i < 1000; i++) {
            // Generate secret santa pairs
            generateSecretSanta();

            // Check result
            const result = document.getElementById('result');
            const pairs = result.innerHTML.split('<p>').slice(1).map(pair => pair.split(' offre à '));
            pairs.forEach(([giver, receiver]) => {
                const reciprocatingPair = pairs.find(([g, r]) => g === receiver && r === giver);
                expect(reciprocatingPair).toBeUndefined();
            });

            // Reset the result
            result.innerHTML = '';
        }
    });

    test('generateSecretSanta ensures couples do not give to each other', () => {
        // Add participants
        for (let i = 0; i < 50; i++) {
            addParticipant();
            addParticipant();
            addCouple();
        }
        const participantInputs = document.querySelectorAll('.participantInput');
        const coupleInputs = document.querySelectorAll('.coupleInput');
        for (let i = 0; i < 100; i++) {
            participantInputs[i].value = `Participant ${i + 1}`;
            coupleInputs[i].value = `Participant ${i + 1}`;
        }

        // Run the secret santa generation multiple times
        for (let i = 0; i < 1000; i++) {
            // Generate secret santa pairs
            generateSecretSanta();

            // Check result
            const result = document.getElementById('result');
            const pairs = result.innerHTML.split('<p>').slice(1).map(pair => pair.split(' offre à '));
            pairs.forEach(([giver, receiver]) => {
                const couple = Array.from(coupleInputs).find(input => input.value === giver);
                if (couple) {
                    const coupleIndex = Array.from(coupleInputs).indexOf(couple);
                    const otherCoupleMember = coupleInputs[coupleIndex % 2 === 0 ? coupleIndex + 1 : coupleIndex - 1];
                    expect(receiver).not.toBe(otherCoupleMember.value);
                }
            });

            // Reset the result
            result.innerHTML = '';
        }
    });
});
