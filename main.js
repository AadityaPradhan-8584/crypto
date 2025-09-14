// Sample data for demonstration
const sampleData = {
    BTC: {
        hourly: {
            labels: Array.from({length: 100}, (_, i) => `Hour ${i + 1}`),
            actual: [
                4250000, 4255000, 4248000, 4260000, 4265000, 4258000, 4270000, 4275000,
                4268000, 4280000, 4285000, 4278000, 4290000, 4295000, 4288000, 4300000,
                4305000, 4298000, 4310000, 4315000, 4308000, 4320000, 4325000, 4318000,
                4330000, 4335000, 4328000, 4340000, 4345000, 4338000, 4350000, 4355000,
                4348000, 4360000, 4365000, 4358000, 4370000, 4375000, 4368000, 4380000,
                4385000, 4378000, 4390000, 4395000, 4388000, 4400000, 4405000, 4398000,
                4410000, 4415000, 4408000, 4420000, 4425000, 4418000, 4430000, 4435000,
                4428000, 4440000, 4445000, 4438000, 4450000, 4455000, 4448000, 4460000,
                4465000, 4458000, 4470000, 4475000, 4468000, 4480000, 4485000, 4478000,
                4490000, 4495000, 4488000, 4500000, 4505000, 4498000, 4510000, 4515000,
                4508000, 4520000, 4525000, 4518000, 4530000, 4535000, 4528000, 4540000,
                4545000, 4538000, 4550000, 4555000, 4548000, 4560000, 4565000, 4558000,
                4570000, 4575000, 4568000, 4580000
            ],
            predicted: [
                4252000, 4257000, 4250000, 4262000, 4267000, 4260000, 4272000, 4277000,
                4270000, 4282000, 4287000, 4280000, 4292000, 4297000, 4290000, 4302000,
                4307000, 4300000, 4312000, 4317000, 4310000, 4322000, 4327000, 4320000,
                4332000, 4337000, 4330000, 4342000, 4347000, 4340000, 4352000, 4357000,
                4350000, 4362000, 4367000, 4360000, 4372000, 4377000, 4370000, 4382000,
                4387000, 4380000, 4392000, 4397000, 4390000, 4402000, 4407000, 4400000,
                4412000, 4417000, 4410000, 4422000, 4427000, 4420000, 4432000, 4437000,
                4430000, 4442000, 4447000, 4440000, 4452000, 4457000, 4450000, 4462000,
                4467000, 4460000, 4472000, 4477000, 4470000, 4482000, 4487000, 4480000,
                4492000, 4497000, 4490000, 4502000, 4507000, 4500000, 4512000, 4517000,
                4510000, 4522000, 4527000, 4520000, 4532000, 4537000, 4530000, 4542000,
                4547000, 4540000, 4552000, 4557000, 4550000, 4562000, 4567000, 4560000,
                4572000, 4577000, 4570000, 4582000
            ]
        },
        daily: {
            labels: Array.from({length: 60}, (_, i) => `Day ${i + 1}`),
            actual: [
                4200000, 4220000, 4180000, 4250000, 4280000, 4240000, 4300000, 4320000,
                4290000, 4350000, 4380000, 4340000, 4400000, 4420000, 4390000, 4450000,
                4480000, 4440000, 4500000, 4520000, 4490000, 4550000, 4580000, 4540000,
                4600000, 4620000, 4590000, 4650000, 4680000, 4640000, 4700000, 4720000,
                4690000, 4750000, 4780000, 4740000, 4800000, 4820000, 4790000, 4850000,
                4880000, 4840000, 4900000, 4920000, 4890000, 4950000, 4980000, 4940000,
                5000000, 5020000, 4990000, 5050000, 5080000, 5040000, 5100000, 5120000,
                5090000, 5150000, 5180000, 5140000
            ],
            predicted: [
                4210000, 4230000, 4190000, 4260000, 4290000, 4250000, 4310000, 4330000,
                4300000, 4360000, 4390000, 4350000, 4410000, 4430000, 4400000, 4460000,
                4490000, 4450000, 4510000, 4530000, 4500000, 4560000, 4590000, 4550000,
                4610000, 4630000, 4600000, 4660000, 4690000, 4650000, 4710000, 4730000,
                4700000, 4760000, 4790000, 4750000, 4810000, 4830000, 4800000, 4860000,
                4890000, 4850000, 4910000, 4930000, 4900000, 4960000, 4990000, 4950000,
                5010000, 5030000, 5000000, 5060000, 5090000, 5050000, 5110000, 5130000,
                5100000, 5160000, 5190000, 5150000
            ]
        }
    },
    ETC: {
        hourly: {
            labels: Array.from({length: 100}, (_, i) => `Hour ${i + 1}`),
            actual: [
                2800, 2820, 2790, 2840, 2860, 2830, 2870, 2890, 2860, 2900,
                2920, 2890, 2930, 2950, 2920, 2960, 2980, 2950, 2990, 3010,
                2980, 3020, 3040, 3010, 3050, 3070, 3040, 3080, 3100, 3070,
                3110, 3130, 3100, 3140, 3160, 3130, 3170, 3190, 3160, 3200,
                3220, 3190, 3230, 3250, 3220, 3260, 3280, 3250, 3290, 3310,
                3280, 3320, 3340, 3310, 3350, 3370, 3340, 3380, 3400, 3370,
                3410, 3430, 3400, 3440, 3460, 3430, 3470, 3490, 3460, 3500,
                3520, 3490, 3530, 3550, 3520, 3560, 3580, 3550, 3590, 3610,
                3580, 3620, 3640, 3610, 3650, 3670, 3640, 3680, 3700, 3670,
                3710, 3730, 3700, 3740, 3760, 3730, 3770, 3790, 3760, 3800
            ],
            predicted: [
                2810, 2830, 2800, 2850, 2870, 2840, 2880, 2900, 2870, 2910,
                2930, 2900, 2940, 2960, 2930, 2970, 2990, 2960, 3000, 3020,
                2990, 3030, 3050, 3020, 3060, 3080, 3050, 3090, 3110, 3080,
                3120, 3140, 3110, 3150, 3170, 3140, 3180, 3200, 3170, 3210,
                3230, 3200, 3240, 3260, 3230, 3270, 3290, 3260, 3300, 3320,
                3290, 3330, 3350, 3320, 3360, 3380, 3350, 3390, 3410, 3380,
                3420, 3440, 3410, 3450, 3470, 3440, 3480, 3500, 3470, 3510,
                3530, 3500, 3540, 3560, 3530, 3570, 3590, 3560, 3600, 3620,
                3590, 3630, 3650, 3620, 3660, 3680, 3650, 3690, 3710, 3680,
                3720, 3740, 3710, 3750, 3770, 3740, 3780, 3800, 3770, 3810
            ]
        },
        daily: {
            labels: Array.from({length: 60}, (_, i) => `Day ${i + 1}`),
            actual: [
                2750, 2780, 2720, 2810, 2840, 2800, 2870, 2900, 2860, 2930,
                2960, 2920, 2990, 3020, 2980, 3050, 3080, 3040, 3110, 3140,
                3100, 3170, 3200, 3160, 3230, 3260, 3220, 3290, 3320, 3280,
                3350, 3380, 3340, 3410, 3440, 3400, 3470, 3500, 3460, 3530,
                3560, 3520, 3590, 3620, 3580, 3650, 3680, 3640, 3710, 3740,
                3700, 3770, 3800, 3760, 3830, 3860, 3820, 3890, 3920, 3880
            ],
            predicted: [
                2760, 2790, 2730, 2820, 2850, 2810, 2880, 2910, 2870, 2940,
                2970, 2930, 3000, 3030, 2990, 3060, 3090, 3050, 3120, 3150,
                3110, 3180, 3210, 3170, 3240, 3270, 3230, 3300, 3330, 3290,
                3360, 3390, 3350, 3420, 3450, 3410, 3480, 3510, 3470, 3540,
                3570, 3530, 3600, 3630, 3590, 3660, 3690, 3650, 3720, 3750,
                3710, 3780, 3810, 3770, 3840, 3870, 3830, 3900, 3930, 3890
            ]
        }
    },
    LINK: {
        hourly: {
            labels: Array.from({length: 100}, (_, i) => `Hour ${i + 1}`),
            actual: [
                1250, 1260, 1240, 1270, 1280, 1260, 1290, 1300, 1280, 1310,
                1320, 1300, 1330, 1340, 1320, 1350, 1360, 1340, 1370, 1380,
                1360, 1390, 1400, 1380, 1410, 1420, 1400, 1430, 1440, 1420,
                1450, 1460, 1440, 1470, 1480, 1460, 1490, 1500, 1480, 1510,
                1520, 1500, 1530, 1540, 1520, 1550, 1560, 1540, 1570, 1580,
                1560, 1590, 1600, 1580, 1610, 1620, 1600, 1630, 1640, 1620,
                1650, 1660, 1640, 1670, 1680, 1660, 1690, 1700, 1680, 1710,
                1720, 1700, 1730, 1740, 1720, 1750, 1760, 1740, 1770, 1780,
                1760, 1790, 1800, 1780, 1810, 1820, 1800, 1830, 1840, 1820,
                1850, 1860, 1840, 1870, 1880, 1860, 1890, 1900, 1880, 1910
            ],
            predicted: [
                1255, 1265, 1245, 1275, 1285, 1265, 1295, 1305, 1285, 1315,
                1325, 1305, 1335, 1345, 1325, 1355, 1365, 1345, 1375, 1385,
                1365, 1395, 1405, 1385, 1415, 1425, 1405, 1435, 1445, 1425,
                1455, 1465, 1445, 1475, 1485, 1465, 1495, 1505, 1485, 1515,
                1525, 1505, 1535, 1545, 1525, 1555, 1565, 1545, 1575, 1585,
                1565, 1595, 1605, 1585, 1615, 1625, 1605, 1635, 1645, 1625,
                1655, 1665, 1645, 1675, 1685, 1665, 1695, 1705, 1685, 1715,
                1725, 1705, 1735, 1745, 1725, 1755, 1765, 1745, 1775, 1785,
                1765, 1795, 1805, 1785, 1815, 1825, 1805, 1835, 1845, 1825,
                1855, 1865, 1845, 1875, 1885, 1865, 1895, 1905, 1885, 1915
            ]
        },
        daily: {
            labels: Array.from({length: 60}, (_, i) => `Day ${i + 1}`),
            actual: [
                1200, 1220, 1180, 1240, 1260, 1230, 1280, 1300, 1270, 1320,
                1340, 1310, 1360, 1380, 1350, 1400, 1420, 1390, 1440, 1460,
                1430, 1480, 1500, 1470, 1520, 1540, 1510, 1560, 1580, 1550,
                1600, 1620, 1590, 1640, 1660, 1630, 1680, 1700, 1670, 1720,
                1740, 1710, 1760, 1780, 1750, 1800, 1820, 1790, 1840, 1860,
                1830, 1880, 1900, 1870, 1920, 1940, 1910, 1960, 1980, 1950
            ],
            predicted: [
                1210, 1230, 1190, 1250, 1270, 1240, 1290, 1310, 1280, 1330,
                1350, 1320, 1370, 1390, 1360, 1410, 1430, 1400, 1450, 1470,
                1440, 1490, 1510, 1480, 1530, 1550, 1520, 1570, 1590, 1560,
                1610, 1630, 1600, 1650, 1670, 1640, 1690, 1710, 1680, 1730,
                1750, 1720, 1770, 1790, 1760, 1810, 1830, 1800, 1850, 1870,
                1840, 1890, 1910, 1880, 1930, 1950, 1920, 1970, 1990, 1960
            ]
        }
    },
    LTC: {
        hourly: {
            labels: Array.from({length: 100}, (_, i) => `Hour ${i + 1}`),
            actual: [
                8500, 8520, 8480, 8540, 8560, 8530, 8580, 8600, 8570, 8620,
                8640, 8610, 8660, 8680, 8650, 8700, 8720, 8690, 8740, 8760,
                8730, 8780, 8800, 8770, 8820, 8840, 8810, 8860, 8880, 8850,
                8900, 8920, 8890, 8940, 8960, 8930, 8980, 9000, 8970, 9020,
                9040, 9010, 9060, 9080, 9050, 9100, 9120, 9090, 9140, 9160,
                9130, 9180, 9200, 9170, 9220, 9240, 9210, 9260, 9280, 9250,
                9300, 9320, 9290, 9340, 9360, 9330, 9380, 9400, 9370, 9420,
                9440, 9410, 9460, 9480, 9450, 9500, 9520, 9490, 9540, 9560,
                9530, 9580, 9600, 9570, 9620, 9640, 9610, 9660, 9680, 9650,
                9700, 9720, 9690, 9740, 9760, 9730, 9780, 9800, 9770, 9820
            ],
            predicted: [
                8510, 8530, 8490, 8550, 8570, 8540, 8590, 8610, 8580, 8630,
                8650, 8620, 8670, 8690, 8660, 8710, 8730, 8700, 8750, 8770,
                8740, 8790, 8810, 8780, 8830, 8850, 8820, 8870, 8890, 8860,
                8910, 8930, 8900, 8950, 8970, 8940, 8990, 9010, 8980, 9030,
                9050, 9020, 9070, 9090, 9060, 9110, 9130, 9100, 9150, 9170,
                9140, 9190, 9210, 9180, 9230, 9250, 9220, 9270, 9290, 9260,
                9310, 9330, 9300, 9350, 9370, 9340, 9390, 9410, 9380, 9430,
                9450, 9420, 9470, 9490, 9460, 9510, 9530, 9500, 9550, 9570,
                9540, 9590, 9610, 9580, 9630, 9650, 9620, 9670, 9690, 9660,
                9710, 9730, 9700, 9750, 9770, 9740, 9790, 9810, 9780, 9830
            ]
        },
        daily: {
            labels: Array.from({length: 60}, (_, i) => `Day ${i + 1}`),
            actual: [
                8200, 8250, 8150, 8300, 8350, 8280, 8400, 8450, 8380, 8500,
                8550, 8480, 8600, 8650, 8580, 8700, 8750, 8680, 8800, 8850,
                8780, 8900, 8950, 8880, 9000, 9050, 8980, 9100, 9150, 9080,
                9200, 9250, 9180, 9300, 9350, 9280, 9400, 9450, 9380, 9500,
                9550, 9480, 9600, 9650, 9580, 9700, 9750, 9680, 9800, 9850,
                9780, 9900, 9950, 9880, 10000, 10050, 9980, 10100, 10150, 10080
            ],
            predicted: [
                8220, 8270, 8170, 8320, 8370, 8300, 8420, 8470, 8400, 8520,
                8570, 8500, 8620, 8670, 8600, 8720, 8770, 8700, 8820, 8870,
                8800, 8920, 8970, 8900, 9020, 9070, 9000, 9120, 9170, 9100,
                9220, 9270, 9200, 9320, 9370, 9300, 9420, 9470, 9400, 9520,
                9570, 9500, 9620, 9670, 9600, 9720, 9770, 9700, 9820, 9870,
                9800, 9920, 9970, 9900, 10020, 10070, 10000, 10120, 10170, 10100
            ]
        }
    }
};

// Global variables
let currentChart = null;
let currentCrypto = 'BTC';
let currentTimeframe = 'hourly';

// DOM Elements
const cryptoSelect = document.getElementById('crypto-select');
const hourlyBtn = document.getElementById('hourly-btn');
const dailyBtn = document.getElementById('daily-btn');
const chartTitle = document.getElementById('chart-title');
const predictionChart = document.getElementById('predictionChart');
const currentPriceInput = document.getElementById('current-price');
const forecastBtn = document.getElementById('forecast-btn');
const forecastBtnText = document.getElementById('forecast-btn-text');
const forecastResult = document.getElementById('forecast-result');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCharts();
    initializeEventListeners();
    
    // Initialize predictions page if elements exist
    if (cryptoSelect && predictionChart) {
        updateChart();
        updateForecastButton();
    }
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
}

// Initialize charts
function initializeCharts() {
    // Hero chart for homepage
    const heroChart = document.getElementById('heroChart');
    if (heroChart) {
        createHeroChart();
    }

    // Accuracy chart for about page
    const accuracyChart = document.getElementById('accuracyChart');
    if (accuracyChart) {
        createAccuracyChart();
    }
}

// Create hero chart
function createHeroChart() {
    const ctx = document.getElementById('heroChart').getContext('2d');
    const data = sampleData.BTC.hourly;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels.slice(-20),
            datasets: [{
                label: 'BTC Price',
                data: data.actual.slice(-20),
                borderColor: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });
}

// Create accuracy chart
function createAccuracyChart() {
    const ctx = document.getElementById('accuracyChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Hourly Models', 'Daily Models'],
            datasets: [{
                label: 'R² Score',
                data: [0.92, 0.85],
                backgroundColor: ['#4F46E5', '#7C3AED'],
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Initialize event listeners
function initializeEventListeners() {
    if (cryptoSelect) {
        cryptoSelect.addEventListener('change', (e) => {
            currentCrypto = e.target.value;
            updateChart();
            updateForecastButton();
        });
    }

    if (hourlyBtn && dailyBtn) {
        hourlyBtn.addEventListener('click', () => {
            setTimeframe('hourly');
        });

        dailyBtn.addEventListener('click', () => {
            setTimeframe('daily');
        });
    }

    if (forecastBtn) {
        forecastBtn.addEventListener('click', generateForecast);
    }

    if (currentPriceInput) {
        currentPriceInput.addEventListener('input', validatePriceInput);
    }
}

// Set timeframe
function setTimeframe(timeframe) {
    currentTimeframe = timeframe;
    
    // Update button states
    if (hourlyBtn && dailyBtn) {
        hourlyBtn.classList.toggle('active', timeframe === 'hourly');
        dailyBtn.classList.toggle('active', timeframe === 'daily');
    }
    
    updateChart();
    updateForecastButton();
}

// Update chart
function updateChart() {
    if (!predictionChart) return;

    const data = sampleData[currentCrypto][currentTimeframe];
    const cryptoNames = {
        'BTC': 'Bitcoin (BTC)',
        'ETC': 'Ethereum Classic (ETC)',
        'LINK': 'Chainlink (LINK)',
        'LTC': 'Litecoin (LTC)'
    };

    // Update chart title
    if (chartTitle) {
        const timeframeText = currentTimeframe === 'hourly' ? 'Hourly' : 'Daily';
        chartTitle.textContent = `${cryptoNames[currentCrypto]} - ${timeframeText} Predictions`;
    }

    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }

    // Create new chart
    const ctx = predictionChart.getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Actual Price (INR)',
                    data: data.actual,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 1,
                    pointHoverRadius: 5
                },
                {
                    label: 'Predicted Price (INR)',
                    data: data.predicted,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 1,
                    pointHoverRadius: 5,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Update forecast button text
function updateForecastButton() {
    if (!forecastBtnText) return;
    
    const timeText = currentTimeframe === 'hourly' ? '2 Hours' : '2 Days';
    forecastBtnText.textContent = `Forecast Next ${timeText}`;
}

// Validate price input
function validatePriceInput() {
    const value = parseFloat(currentPriceInput.value);
    const isValid = !isNaN(value) && value > 0;
    
    forecastBtn.disabled = !isValid;
    forecastBtn.style.opacity = isValid ? '1' : '0.6';
}

// Generate forecast
function generateForecast() {
    const currentPrice = parseFloat(currentPriceInput.value);
    if (isNaN(currentPrice) || currentPrice <= 0) {
        alert('Please enter a valid current price');
        return;
    }

    // Simulate API call with loading state
    forecastBtn.disabled = true;
    forecastBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    setTimeout(() => {
        // Generate realistic predictions based on current price
        const variation1 = (Math.random() - 0.5) * 0.1; // ±5% variation
        const variation2 = (Math.random() - 0.5) * 0.15; // ±7.5% variation
        
        const prediction1 = currentPrice * (1 + variation1);
        const prediction2 = currentPrice * (1 + variation1 + variation2);
        
        // Determine trend
        const trend = prediction2 > currentPrice ? 'bullish' : 'bearish';
        const trendIcon = trend === 'bullish' ? 'fa-arrow-up' : 'fa-arrow-down';
        const trendText = trend === 'bullish' ? 'Bullish Trend' : 'Bearish Trend';
        const trendClass = trend === 'bullish' ? 'bullish' : 'bearish';

        // Update results
        document.getElementById('prediction-1').textContent = `₹${prediction1.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('prediction-2').textContent = `₹${prediction2.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        const trendIndicator = document.getElementById('trend-indicator');
        trendIndicator.className = `trend-indicator ${trendClass}`;
        trendIndicator.innerHTML = `<i class="fas ${trendIcon}"></i><span>${trendText}</span>`;

        // Show results
        forecastResult.classList.remove('hidden');
        forecastResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Reset button
        forecastBtn.disabled = false;
        forecastBtn.innerHTML = `<i class="fas fa-magic"></i><span id="forecast-btn-text">Forecast Next ${currentTimeframe === 'hourly' ? '2 Hours' : '2 Days'}</span>`;
        
    }, 2000);
}

// Add fade-in animation to elements
function addFadeInAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements that should fade in
    document.querySelectorAll('.feature-card, .asset-card, .tech-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize fade-in animations when DOM is loaded
document.addEventListener('DOMContentLoaded', addFadeInAnimation);