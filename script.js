// Get elements
const priorSlider = document.getElementById('prior');
const likelihoodSlider = document.getElementById('likelihood');
const likelihoodNotSlider = document.getElementById('likelihood-not');

const priorValue = document.getElementById('prior-value');
const likelihoodValue = document.getElementById('likelihood-value');
const likelihoodNotValue = document.getElementById('likelihood-not-value');

const posteriorText = document.getElementById('posterior');

// Setup Pie Chart
const ctx = document.getElementById('bayesChart').getContext('2d');
const bayesChart = new Chart(ctx, {
    type: 'doughnut', // changed to doughnut chart
    data: {
        labels: ['Posterior P(A|B)', 'Complement (1 - P(A|B))'],
        datasets: [{
            data: [0.5, 0.5], // Placeholder values
            backgroundColor: ['#2196F3', '#FF7043'],
            borderWidth: 2
        }]
    },
    options: {
        cutout: '60%', // Make a nice hole in the middle
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#333',
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        let value = context.parsed;
                        return `${label}: ${(value * 100).toFixed(2)}%`;
                    }
                }
            }
        }
    }
});

// Function to calculate and update posterior
function updatePosterior() {
    const prior = parseFloat(priorSlider.value);
    const likelihood = parseFloat(likelihoodSlider.value);
    const likelihoodNot = parseFloat(likelihoodNotSlider.value);

    // Update slider displayed values
    priorValue.textContent = prior.toFixed(2);
    likelihoodValue.textContent = likelihood.toFixed(2);
    likelihoodNotValue.textContent = likelihoodNot.toFixed(2);

    // Bayes' theorem formula
    const numerator = likelihood * prior;
    const denominator = (likelihood * prior) + (likelihoodNot * (1 - prior));
    const posterior = denominator === 0 ? 0 : numerator / denominator;

    // Update result text
    posteriorText.textContent = `${(posterior * 100).toFixed(2)}%`;

    // Update pie chart
    bayesChart.data.datasets[0].data = [posterior, 1 - posterior];
    bayesChart.update();
}

// Add event listeners to sliders
priorSlider.addEventListener('input', updatePosterior);
likelihoodSlider.addEventListener('input', updatePosterior);
likelihoodNotSlider.addEventListener('input', updatePosterior);

// Initial chart update
updatePosterior();


// Reset button functionality
document.getElementById('reset-btn').addEventListener('click', () => {
    priorSlider.value = 0.5;
    likelihoodSlider.value = 0.7;
    likelihoodNotSlider.value = 0.2;
    updatePosterior();
});

// Info Modal functionality
const modal = document.getElementById('info-modal');
const btn = document.getElementById('info-btn');
const span = document.getElementsByClassName('close')[0];

btn.onclick = function () {
    modal.style.display = 'block';
};

span.onclick = function () {
    modal.style.display = 'none';
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Function to calculate and update posterior
function updatePosterior() {
    // Show loader
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    // Delay a little to simulate processing (for a better UX feel)
    setTimeout(() => {
        const prior = parseFloat(priorSlider.value);
        const likelihood = parseFloat(likelihoodSlider.value);
        const likelihoodNot = parseFloat(likelihoodNotSlider.value);

        // Update slider displayed values
        priorValue.textContent = prior.toFixed(2);
        likelihoodValue.textContent = likelihood.toFixed(2);
        likelihoodNotValue.textContent = likelihoodNot.toFixed(2);

        // Bayes' theorem calculation
        const numerator = likelihood * prior;
        const denominator = (likelihood * prior) + (likelihoodNot * (1 - prior));
        const posterior = denominator === 0 ? 0 : numerator / denominator;

        // Update result text
        // posteriorText.textContent = `${(posterior * 100).toFixed(2)}%`;
        // Animate Posterior % update
        let start = 0;
        const end = (posterior * 100).toFixed(2);
        const duration = 500; // 0.5 seconds
        const stepTime = Math.abs(Math.floor(duration / end));
        const increment = end > start ? 1 : -1;

        let current = start;
        const timer = setInterval(() => {
            current += increment;
            posteriorText.textContent = `${current.toFixed(2)}%`;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                clearInterval(timer);
                posteriorText.textContent = `${end}%`; // Ensure exact final value
            }
        }, stepTime);



        // Update pie chart
        bayesChart.data.datasets[0].data = [posterior, 1 - posterior];
        bayesChart.update();

        // Hide loader after updating
        loader.style.display = 'none';
    }, 500); // 0.5 second delay
}
