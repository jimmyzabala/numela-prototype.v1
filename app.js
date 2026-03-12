/* ============================================================
   NUMELA — App JavaScript
   Charts, interactions, animations, and predictions
   ============================================================ */

(function () {
  'use strict';

  // ── Theme Toggle ──────────────────────────────────────────
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let currentTheme = 'dark'; // default
  root.setAttribute('data-theme', currentTheme);

  if (toggle) {
    toggle.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      toggle.setAttribute('aria-label', 'Switch to ' + (currentTheme === 'dark' ? 'light' : 'dark') + ' mode');
      toggle.innerHTML = currentTheme === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

      // Update chart colors
      updateChartTheme();
    });
  }

  // ── Mobile Menu ───────────────────────────────────────────
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', function () {
      navLinks.classList.toggle('active');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('active');
      });
    });
  }

  // ── Phase Card Expand ─────────────────────────────────────
  document.querySelectorAll('.phase-card').forEach(function (card) {
    card.addEventListener('click', function () {
      const isActive = card.classList.contains('active');
      // Close all
      document.querySelectorAll('.phase-card').forEach(function (c) {
        c.classList.remove('active');
      });
      // Toggle clicked
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });

  // ── Scroll Reveal ─────────────────────────────────────────
  function handleReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-stagger');
    var windowHeight = window.innerHeight;
    reveals.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < windowHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', handleReveal, { passive: true });
  // Trigger on load
  setTimeout(handleReveal, 100);

  // ── Chart.js Global Config ────────────────────────────────
  function getChartColors() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    return {
      primary: isDark ? '#00d4ff' : '#0891b2',
      primaryAlpha: isDark ? 'rgba(0,212,255,0.2)' : 'rgba(8,145,178,0.15)',
      text: isDark ? '#e8ecf4' : '#0f172a',
      textMuted: isDark ? '#8a94a8' : '#475569',
      grid: isDark ? 'rgba(0,212,255,0.06)' : 'rgba(8,145,178,0.08)',
      surface: isDark ? '#0f1535' : '#ffffff',
      clusterColors: [
        isDark ? 'rgba(239,68,68,0.8)' : 'rgba(220,38,38,0.7)',      // red
        isDark ? 'rgba(245,158,11,0.8)' : 'rgba(217,119,6,0.7)',     // amber
        isDark ? 'rgba(0,212,255,0.9)' : 'rgba(8,145,178,0.8)',       // cyan (HV)
        isDark ? 'rgba(124,58,237,0.8)' : 'rgba(109,40,217,0.7)',     // purple
        isDark ? 'rgba(16,185,129,0.8)' : 'rgba(5,150,105,0.7)',      // green
      ]
    };
  }

  Chart.defaults.font.family = "'General Sans', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#8a94a8';

  // ── Feature Importance Chart ──────────────────────────────
  var featureCtx = document.getElementById('featureChart');
  var featureChart = null;

  function createFeatureChart() {
    var c = getChartColors();
    if (featureChart) featureChart.destroy();

    featureChart = new Chart(featureCtx, {
      type: 'bar',
      data: {
        labels: ['PageValues', 'Prod. Duration', 'ExitRates', 'Prod. Related', 'BounceRates'],
        datasets: [{
          data: [0.357270, 0.089697, 0.087130, 0.070744, 0.057448],
          backgroundColor: [
            c.primary,
            'rgba(' + (root.getAttribute('data-theme') === 'dark' ? '0,212,255' : '8,145,178') + ',0.7)',
            'rgba(' + (root.getAttribute('data-theme') === 'dark' ? '0,212,255' : '8,145,178') + ',0.55)',
            'rgba(' + (root.getAttribute('data-theme') === 'dark' ? '0,212,255' : '8,145,178') + ',0.4)',
            'rgba(' + (root.getAttribute('data-theme') === 'dark' ? '0,212,255' : '8,145,178') + ',0.25)',
          ],
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.7,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: c.surface,
            titleColor: c.text,
            bodyColor: c.textMuted,
            borderColor: 'rgba(0,212,255,0.2)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) {
                return 'Importance: ' + ctx.raw.toFixed(4);
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: c.grid },
            ticks: { color: c.textMuted, font: { size: 11 } },
            max: 0.4
          },
          y: {
            grid: { display: false },
            ticks: {
              color: c.text,
              font: { size: 11, weight: 500 },
            }
          }
        },
        animation: {
          duration: 1200,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  // ── Cluster Scatter Chart ─────────────────────────────────
  var clusterCtx = document.getElementById('clusterChart');
  var clusterChart = null;

  // Generate fake scatter data around centroids
  function generateClusterData(cx, cy, n, spread) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({
        x: cx + (Math.random() - 0.5) * spread * 2,
        y: cy + (Math.random() - 0.5) * spread * 1.5
      });
    }
    return pts;
  }

  var clusterData = [
    { label: 'Budget Seniors', cx: 26.75, cy: 18.35, data: generateClusterData(26.75, 18.35, 30, 12) },
    { label: 'Young Enthusiasts', cx: 41.09, cy: 62.24, data: generateClusterData(41.09, 62.24, 35, 14) },
    { label: 'Premium Spenders', cx: 86.10, cy: 81.53, data: generateClusterData(86.10, 81.53, 25, 10) },
    { label: 'High Income Savers', cx: 86.10, cy: 19.36, data: generateClusterData(86.10, 19.36, 28, 11) },
    { label: 'Moderate Mature', cx: 54.38, cy: 48.85, data: generateClusterData(54.38, 48.85, 32, 16) },
  ];

  function createClusterChart() {
    var c = getChartColors();
    if (clusterChart) clusterChart.destroy();

    clusterChart = new Chart(clusterCtx, {
      type: 'scatter',
      data: {
        datasets: clusterData.map(function (cluster, i) {
          return {
            label: cluster.label,
            data: cluster.data,
            backgroundColor: c.clusterColors[i],
            pointRadius: 5,
            pointHoverRadius: 8,
          };
        })
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: c.textMuted,
              font: { size: 11 },
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
            }
          },
          tooltip: {
            backgroundColor: c.surface,
            titleColor: c.text,
            bodyColor: c.textMuted,
            borderColor: 'rgba(0,212,255,0.2)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) {
                return ctx.dataset.label + ': Income $' + ctx.parsed.x.toFixed(0) + 'k, Score ' + ctx.parsed.y.toFixed(0);
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Annual Income ($k)', color: c.textMuted, font: { size: 11 } },
            grid: { color: c.grid },
            ticks: { color: c.textMuted },
            min: 0,
            max: 120
          },
          y: {
            title: { display: true, text: 'Spending Score', color: c.textMuted, font: { size: 11 } },
            grid: { color: c.grid },
            ticks: { color: c.textMuted },
            min: 0,
            max: 100
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  // ── Silhouette Score Chart ────────────────────────────────
  var silCtx = document.getElementById('silhouetteChart');
  var silChart = null;

  function createSilhouetteChart() {
    var c = getChartColors();
    if (silChart) silChart.destroy();

    silChart = new Chart(silCtx, {
      type: 'line',
      data: {
        labels: ['k=2', 'k=3', 'k=4', 'k=5', 'k=6'],
        datasets: [{
          label: 'Silhouette Score',
          data: [0.34, 0.36, 0.40, 0.42, 0.43],
          borderColor: c.primary,
          backgroundColor: c.primaryAlpha,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 10,
          pointBackgroundColor: c.primary,
          pointBorderColor: c.surface,
          pointBorderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: c.surface,
            titleColor: c.text,
            bodyColor: c.textMuted,
            borderColor: 'rgba(0,212,255,0.2)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) {
                return 'Silhouette: ' + ctx.raw.toFixed(2);
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: c.grid },
            ticks: { color: c.textMuted }
          },
          y: {
            grid: { color: c.grid },
            ticks: { color: c.textMuted },
            min: 0.3,
            max: 0.5,
            title: { display: true, text: 'Silhouette Score', color: c.textMuted, font: { size: 11 } }
          }
        },
        animation: {
          duration: 1200,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  // ── Initialize Charts ─────────────────────────────────────
  function initCharts() {
    createFeatureChart();
    createClusterChart();
    createSilhouetteChart();
  }

  function updateChartTheme() {
    createFeatureChart();
    createClusterChart();
    createSilhouetteChart();
  }

  initCharts();

  // ── Accuracy Ring Animation ───────────────────────────────
  var accuracyRing = document.getElementById('accuracyRing');
  var accuracyText = document.getElementById('accuracyText');
  var accuracyAnimated = false;

  function animateAccuracy() {
    if (accuracyAnimated) return;
    var circumference = 2 * Math.PI * 60; // r=60
    var target = 0.89;
    var offset = circumference * (1 - target);

    accuracyRing.style.strokeDasharray = circumference;
    accuracyRing.style.strokeDashoffset = offset;
    accuracyAnimated = true;

    // Animate number
    var start = 0;
    var duration = 1500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * 89);
      accuracyText.textContent = current + '%';
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // Trigger when visible
  var accObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateAccuracy();
        accObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  if (accuracyRing) {
    accObserver.observe(accuracyRing.closest('.demo-panel'));
  }

  // ── KPI Counter Animation ─────────────────────────────────
  var kpiAnimated = false;

  function animateCounters() {
    if (kpiAnimated) return;
    kpiAnimated = true;

    document.querySelectorAll('.counter').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var duration = 1500;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    });
  }

  var kpiObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
        kpiObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  var kpiGrid = document.getElementById('kpiGrid');
  if (kpiGrid) {
    kpiObserver.observe(kpiGrid);
  }

  // ── Purchase Intent Predictor ─────────────────────────────
  var pvSlider = document.getElementById('pvSlider');
  var prdSlider = document.getElementById('prdSlider');
  var brSlider = document.getElementById('brSlider');
  var erSlider = document.getElementById('erSlider');

  var pvValue = document.getElementById('pvValue');
  var prdValue = document.getElementById('prdValue');
  var brValue = document.getElementById('brValue');
  var erValue = document.getElementById('erValue');

  // Update slider displays
  if (pvSlider) {
    pvSlider.addEventListener('input', function () { pvValue.textContent = this.value; });
    prdSlider.addEventListener('input', function () { prdValue.textContent = this.value; });
    brSlider.addEventListener('input', function () {
      brValue.textContent = (this.value / 1000).toFixed(3);
    });
    erSlider.addEventListener('input', function () {
      erValue.textContent = (this.value / 1000).toFixed(3);
    });
  }

  // Prediction logic (weighted scoring based on feature importance)
  var predictBtn = document.getElementById('predictBtn');
  var predictionResult = document.getElementById('predictionResult');

  if (predictBtn) {
    predictBtn.addEventListener('click', function () {
      var pv = parseFloat(pvSlider.value);
      var prd = parseFloat(prdSlider.value);
      var br = parseFloat(brSlider.value) / 1000;
      var er = parseFloat(erSlider.value) / 1000;

      // Normalize features to 0-1 range
      var pvNorm = pv / 100;
      var prdNorm = prd / 60000;
      var brNorm = 1 - (br / 0.2); // inverted — lower bounce = better
      var erNorm = 1 - (er / 0.2); // inverted — lower exit = better

      // Weighted score using feature importance
      var score =
        0.357270 * pvNorm +
        0.089697 * prdNorm +
        0.087130 * erNorm +
        0.070744 * prdNorm * 0.8 +
        0.057448 * brNorm;

      // Scale to percentage (0-100), add some sigmoid-like behavior
      var sigmoid = 1 / (1 + Math.exp(-12 * (score - 0.15)));
      var confidence = Math.round(sigmoid * 100);

      var isHigh = confidence >= 50;

      predictionResult.className = 'prediction-result ' + (isHigh ? 'high' : 'low');
      predictionResult.querySelector('.prediction-label').textContent =
        isHigh ? 'High Purchase Intent' : 'Low Purchase Intent';
      predictionResult.querySelector('.prediction-confidence').textContent =
        'Confidence: ' + confidence + '%';

      // Pulse animation
      predictionResult.style.transform = 'scale(1.02)';
      setTimeout(function () { predictionResult.style.transform = 'scale(1)'; }, 200);
    });
  }

  // ── Cluster Tab Explorer ──────────────────────────────────
  var clusterTabs = document.getElementById('clusterTabs');
  if (clusterTabs) {
    clusterTabs.addEventListener('click', function (e) {
      var tab = e.target.closest('.cluster-tab');
      if (!tab) return;

      var clusterId = tab.getAttribute('data-cluster');

      // Update tabs
      clusterTabs.querySelectorAll('.cluster-tab').forEach(function (t) {
        t.classList.remove('active');
      });
      tab.classList.add('active');

      // Update profiles
      document.querySelectorAll('.cluster-profile').forEach(function (p) {
        p.classList.remove('active');
      });
      var target = document.querySelector('[data-cluster-profile="' + clusterId + '"]');
      if (target) target.classList.add('active');
    });
  }

  // ── Smooth scroll for CTA ─────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
