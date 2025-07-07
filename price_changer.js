(function () {
    'use strict';
    
    // Constants
    const BGN_TO_EUR_RATE = 1.95583;
    const BGN_REGEX = /BGN\s+([\d,]+\.?\d*)/;
    //const BGN_REGEX = /(?:BGN\s+([\d,\s]+\.?\d*)|([\d,\s]+\.?\d*)\s+BGN)/;
    const DELAY_MS = 1000;
    
    // Cache for performance
    let currentURL = window.location.href;
    let processedElements = new WeakSet();
    
    /**
     * Find elements containing specific text using XPath
     * @param {string} text - Text to search for
     * @returns {Element[]} Array of matching elements
     */
    function findElementsContainingText(text) {
        try {
            const xpath = `//*[contains(text(), '${text}')]`;
            const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const elements = [];
            
            for (let i = 0; i < result.snapshotLength; i++) {
                elements.push(result.snapshotItem(i));
            }
            
            return elements;
        } catch (error) {
            console.error('Error finding elements:', error);
            return [];
        }
    }
    
    /**
     * Convert BGN amount to EUR
     * @param {number} bgnAmount - Amount in BGN
     * @returns {string} Formatted EUR amount
     */
    function convertBGNToEUR(bgnAmount) {
        const eurAmount = bgnAmount / BGN_TO_EUR_RATE;
        return Math.round(eurAmount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    /**
     * Update element text to include EUR conversion
     * @param {Element} element - DOM element to update
     */
    function updateBGNToEUR(element) {
        // Skip if already processed
        if (processedElements.has(element)) {
            return;
        }
        
        const text = element.textContent;
        const bgnMatch = text.match(BGN_REGEX);
        
        if (bgnMatch && !text.includes('EUR')) {
            try {
                const bgnAmount = parseFloat(bgnMatch[1].replace(/,/g, ''));
                if (!isNaN(bgnAmount)) {
                    const eurAmount = convertBGNToEUR(bgnAmount);
                    element.textContent = `${text} - EUR ${eurAmount}`;
                    processedElements.add(element);
                }
            } catch (error) {
                console.error('Error converting BGN to EUR:', error);
            }
        }
    }
    
    /**
     * Get price containers containing BGN text
     * @returns {Element[]} Array of price container elements
     */
    function getPriceContainers() {
        const bgnElements = findElementsContainingText('BGN');
        return bgnElements.filter(element => element.tagName !== 'SCRIPT' && element.tagName !== 'STYLE');
    }
    
    /**
     * Update all price elements to show EUR conversion
     */
    function changePriceToEUR() {
        const priceContainers = getPriceContainers();
        priceContainers.forEach(updateBGNToEUR);
    }
    
    /**
     * Setup comprehensive URL change detection
     */
    function setupURLChangeDetection() {
        // Handle popstate (back/forward)
        window.addEventListener('popstate', handleURLChange);
        
        // Override pushState
        const originalPushState = history.pushState;
        history.pushState = function (state, title, url) {
            originalPushState.apply(history, arguments);
            handleURLChange();
        };
        
        // Override replaceState
        const originalReplaceState = history.replaceState;
        history.replaceState = function (state, title, url) {
            originalReplaceState.apply(history, arguments);
            handleURLChange();
        };
        
        // Handle hash changes
        window.addEventListener('hashchange', handleURLChange);
    }
    
    /**
     * Handle URL changes
     */
    function handleURLChange() {
        const newURL = window.location.href;
        if (currentURL !== newURL) {
            currentURL = newURL;
            onURLChange(newURL);
        }
    }
    
    /**
     * Callback function for URL changes
     * @param {string} url - New URL
     */
    function onURLChange(url) {
        setTimeout(() => {
            changePriceToEUR();
        }, DELAY_MS);
    }
    
    /**
     * Initialize the script
     */
    function init() {
        setupURLChangeDetection();
        setTimeout(changePriceToEUR, DELAY_MS);
    }
    
    // Start the script
    init();
})();