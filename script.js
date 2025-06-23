document.addEventListener('DOMContentLoaded', () => {

    // --- CHART AND DATA CONFIGURATION ---
    const dataConfig = {
        temp: {
            label: "Sea Temperature",
            valueEl: document.getElementById('temp-value'),
            chartEl: document.getElementById('temp-chart'),
            unit: ' °C',
            range: { min: 5, max: 18 },
            norm: { min: 10, max: 15 },
            info: "Sea temperature is a critical indicator of the ocean's health. Rising temperatures, a direct consequence of climate change, can lead to coral bleaching, alter fish migration patterns, and reduce the ocean's ability to absorb CO2. Consistently high temperatures can stress local ecosystems like eelgrass beds."
        },
        oxygen: {
            label: "Dissolved Oxygen",
            valueEl: document.getElementById('oxygen-value'),
            chartEl: document.getElementById('oxygen-chart'),
            unit: ' mg/L',
            range: { min: 6, max: 12 },
            norm: { min: 8, max: 11 },
            info: "Dissolved oxygen is essential for marine life to breathe. Low oxygen levels (hypoxia) create 'dead zones' where most organisms cannot survive. Hypoxia is often caused by nutrient runoff and warming waters, as warmer water holds less dissolved gas. Protecting our coast from these conditions is vital."
        },
        sealevel: {
            label: "Sea Level (vs. Normal)",
            valueEl: document.getElementById('sealevel-value'),
            chartEl: document.getElementById('sealevel-chart'),
            unit: ' cm',
            range: { min: -15, max: 15 },
            norm: { min: -5, max: 5 },
            info: "This measures the current sea level compared to the historical average for this time of year. Global sea-level rise, driven by melting glaciers and thermal expansion of water from climate change, is a major long-term threat. Even small increases can dramatically increase the frequency and severity of coastal flooding and erosion."
        },
        salinity: {
            label: "Salinity",
            valueEl: document.getElementById('salinity-value'),
            chartEl: document.getElementById('salinity-chart'),
            unit: ' PSU',
            range: { min: 32, max: 35 },
            norm: { min: 33, max: 34.5 },
            info: "Salinity is the concentration of salt in the water. It affects water density and ocean currents. Significant changes, often due to increased freshwater input from melting ice or altered rainfall patterns, can disrupt the delicate balance required by local marine species like eelgrass and toad populations."
        },
        turbidity: {
            label: "Turbidity",
            valueEl: document.getElementById('turbidity-value'),
            chartEl: document.getElementById('turbidity-chart'),
            unit: ' NTU',
            range: { min: 0, max: 25 },
            norm: { min: 0, max: 10 },
            info: "Turbidity measures water clarity. High turbidity means the water is cloudy from suspended particles, often from erosion or pollution. This can block sunlight from reaching underwater plants like eelgrass, hindering photosynthesis and disrupting the entire food web that depends on them."
        },
        ph: {
            label: "pH Level",
            valueEl: document.getElementById('ph-value'),
            chartEl: document.getElementById('ph-chart'),
            unit: ' pH',
            range: { min: 7.8, max: 8.3 },
            norm: { min: 8.0, max: 8.2 },
            info: "pH measures the acidity of the seawater. The ocean is absorbing vast amounts of CO2 from the atmosphere, causing its pH to drop in a process called ocean acidification. This makes it harder for organisms like shellfish, corals, and some plankton to build their shells and skeletons, threatening the marine food chain."
        }
    };

    // Helper to map a value to a percentage (0-100)
    const mapToPercent = (value, min, max) => {
        const clampedValue = Math.max(min, Math.min(value, max));
        return ((clampedValue - min) / (max - min)) * 100;
    };

    // --- CHART INITIALIZATION (NOW PRE-FILLS BARS) ---
    function initializeCharts() {
        Object.values(dataConfig).forEach(config => {
            for (let i = 0; i < 12; i++) {
                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                // Generate a random height for each initial bar
                const initialValue = (Math.random() * (config.range.max - config.range.min) + config.range.min);
                bar.style.height = mapToPercent(initialValue, config.range.min, config.range.max) + '%';
                config.chartEl.appendChild(bar);
            }
            const normalRangeEl = config.chartEl.querySelector('.normal-range');
            const normMinPercent = mapToPercent(config.norm.min, config.range.min, config.range.max);
            const normMaxPercent = mapToPercent(config.norm.max, config.range.min, config.range.max);
            normalRangeEl.style.bottom = `${normMinPercent}%`;
            normalRangeEl.style.height = `${normMaxPercent - normMinPercent}%`;
        });
    }

    // --- LIVE DATA AND CHART UPDATE ---
    function updateDashboard() {
        Object.values(dataConfig).forEach(config => {
            const currentValue = (Math.random() * (config.range.max - config.range.min) + config.range.min);
            let displayValue = currentValue.toFixed(config === dataConfig.ph ? 2 : 1); // More precision for pH
            if (config === dataConfig.sealevel && currentValue > 0) displayValue = `+${displayValue}`;
            config.valueEl.textContent = displayValue + config.unit;

            if (currentValue < config.norm.min || currentValue > config.norm.max) {
                config.valueEl.classList.add('value-warning');
            } else {
                config.valueEl.classList.remove('value-warning');
            }

            const bars = config.chartEl.querySelectorAll('.chart-bar');
            for (let i = 0; i < bars.length - 1; i++) {
                bars[i].style.height = bars[i + 1].style.height;
            }
            bars[bars.length - 1].style.height = `${mapToPercent(currentValue, config.range.min, config.range.max)}%`;
        });
    }

    // --- MODAL LOGIC ---
    const modal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const dataMetrics = document.querySelectorAll('.data-metric');

    dataMetrics.forEach(metric => {
        metric.addEventListener('click', () => {
            const key = metric.dataset.metricKey;
            if (dataConfig[key]) {
                modalTitle.textContent = dataConfig[key].label;
                modalText.textContent = dataConfig[key].info;
                modal.classList.add('visible');
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('visible');
    };

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) { // Only close if clicking on the overlay itself
            closeModal();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    
    // --- FORM HANDLING ---
    const feedbackForm = document.getElementById('feedback-form');
    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        if (name) {
            alert(`Thank you for your feedback, ${name}! Your message has been received.`);
            feedbackForm.reset();
        }
    });

    // --- START THE DASHBOARD ---
    initializeCharts();
    updateDashboard(); // Run once immediately to set initial text values
    setInterval(updateDashboard, 3000);

});