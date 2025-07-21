/**
 * Advanced HTML/CSS/JS Refactoring Engine
 * Implements best practices for component extraction and code organization
 */

class RefactoringEngine {
    constructor() {
        this.namingConventions = {
            bem: true, // Block Element Modifier
            camelCase: false,
            kebabCase: true,
            pascalCase: false
        };
        
        this.componentPatterns = {
            navigation: [
                'nav', '.nav', '.navbar', '.navigation', '.menu', '.header-nav',
                '[role="navigation"]', '.site-nav', '.main-nav'
            ],
            header: [
                'header', '.header', '.site-header', '.page-header', '.masthead',
                '.banner', '.top-bar'
            ],
            hero: [
                '.hero', '.banner', '.jumbotron', '.intro', '.splash',
                '.hero-section', '.main-banner', '.featured'
            ],
            card: [
                '.card', '.box', '.panel', '.tile', '.item', '.post',
                '.product', '.feature', '.service'
            ],
            form: [
                'form', '.form', '.contact-form', '.search-form', '.login-form',
                '.signup-form', '.newsletter'
            ],
            button: [
                'button', '.btn', '.button', '.cta', '.action', '.submit',
                'input[type="submit"]', 'input[type="button"]'
            ],
            footer: [
                'footer', '.footer', '.site-footer', '.page-footer', '.bottom',
                '.copyright'
            ],
            modal: [
                '.modal', '.popup', '.dialog', '.overlay', '.lightbox',
                '[role="dialog"]', '.modal-dialog'
            ],
            sidebar: [
                '.sidebar', '.aside', 'aside', '.secondary', '.widget-area',
                '.complementary'
            ],
            gallery: [
                '.gallery', '.carousel', '.slider', '.slideshow', '.images',
                '.photo-gallery'
            ]
        };
        
        this.cssVariables = new Map();
        this.componentRegistry = new Map();
    }

    /**
     * Main refactoring method
     */
    refactorDocument(document, componentType) {
        try {
            this.analyzeDocument(document);
            
            switch (componentType) {
                case 'navigation':
                    return this.refactorNavigationComponent(document);
                case 'header':
                    return this.refactorHeaderComponent(document);
                case 'hero':
                    return this.refactorHeroComponent(document);
                case 'card':
                    return this.refactorCardComponent(document);
                case 'form':
                    return this.refactorFormComponent(document);
                case 'button':
                    return this.refactorButtonComponent(document);
                case 'footer':
                    return this.refactorFooterComponent(document);
                case 'layout':
                    return this.refactorLayoutSystem(document);
                case 'styles':
                    return this.refactorStyleSystem(document);
                case 'scripts':
                    return this.refactorScriptModules(document);
                default:
                    throw new Error(`Unknown component type: ${componentType}`);
            }
        } catch (error) {
            console.error('Refactoring error:', error);
            throw error;
        }
    }

    /**
     * Analyze document structure and extract patterns
     */
    analyzeDocument(document) {
        // Extract CSS variables and custom properties
        this.extractCSSVariables(document);
        
        // Identify component patterns
        this.identifyComponentPatterns(document);
        
        // Analyze color schemes and design tokens
        this.analyzeDesignTokens(document);
        
        // Extract JavaScript patterns
        this.analyzeJavaScriptPatterns(document);
    }

    /**
     * Extract CSS variables and design tokens
     */
    extractCSSVariables(document) {
        const styleElements = document.querySelectorAll('style');
        const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
        
        styleElements.forEach(style => {
            const cssText = style.textContent;
            this.parseCSSForVariables(cssText);
        });
        
        // Extract inline styles and convert to variables
        const elementsWithStyles = document.querySelectorAll('[style]');
        elementsWithStyles.forEach(element => {
            this.extractInlineStyles(element);
        });
    }

    /**
     * Parse CSS text for variables and patterns
     */
    parseCSSForVariables(cssText) {
        // Extract CSS custom properties
        const variableRegex = /--([\w-]+):\s*([^;]+);/g;
        let match;
        
        while ((match = variableRegex.exec(cssText)) !== null) {
            this.cssVariables.set(match[1], match[2].trim());
        }
        
        // Extract color values
        const colorRegex = /(color|background|border):\s*(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\))/g;
        const colors = new Set();
        
        while ((match = colorRegex.exec(cssText)) !== null) {
            colors.add(match[2]);
        }
        
        this.cssVariables.set('extracted-colors', Array.from(colors));
    }

    /**
     * Extract and normalize inline styles
     */
    extractInlineStyles(element) {
        const style = element.getAttribute('style');
        if (!style) return;
        
        const styleProps = style.split(';').filter(prop => prop.trim());
        const normalizedStyles = {};
        
        styleProps.forEach(prop => {
            const [property, value] = prop.split(':').map(s => s.trim());
            if (property && value) {
                normalizedStyles[property] = value;
            }
        });
        
        return normalizedStyles;
    }

    /**
     * Identify component patterns in the document
     */
    identifyComponentPatterns(document) {
        Object.keys(this.componentPatterns).forEach(componentType => {
            const patterns = this.componentPatterns[componentType];
            const elements = [];
            
            patterns.forEach(pattern => {
                const found = document.querySelectorAll(pattern);
                elements.push(...Array.from(found));
            });
            
            if (elements.length > 0) {
                this.componentRegistry.set(componentType, {
                    elements: elements,
                    count: elements.length,
                    patterns: this.analyzeElementPatterns(elements)
                });
            }
        });
    }

    /**
     * Analyze patterns in similar elements
     */
    analyzeElementPatterns(elements) {
        const patterns = {
            commonClasses: new Set(),
            commonStructure: null,
            commonStyles: new Map()
        };
        
        elements.forEach(element => {
            // Collect common classes
            if (element.className) {
                element.className.split(' ').forEach(cls => {
                    if (cls.trim()) patterns.commonClasses.add(cls.trim());
                });
            }
            
            // Analyze structure
            if (!patterns.commonStructure) {
                patterns.commonStructure = this.getElementStructure(element);
            }
        });
        
        return patterns;
    }

    /**
     * Get element structure for pattern analysis
     */
    getElementStructure(element) {
        return {
            tagName: element.tagName.toLowerCase(),
            childCount: element.children.length,
            childTags: Array.from(element.children).map(child => child.tagName.toLowerCase()),
            hasText: element.textContent.trim().length > 0,
            attributes: Array.from(element.attributes).map(attr => attr.name)
        };
    }

    /**
     * Analyze design tokens and create CSS variables
     */
    analyzeDesignTokens(document) {
        const designTokens = {
            colors: new Set(),
            fonts: new Set(),
            spacing: new Set(),
            borderRadius: new Set(),
            shadows: new Set()
        };
        
        // Extract computed styles from elements
        const allElements = document.querySelectorAll('*');
        
        // Note: In a real browser environment, we would use getComputedStyle
        // For this implementation, we'll extract from style attributes and CSS
        
        return designTokens;
    }

    /**
     * Analyze JavaScript patterns
     */
    analyzeJavaScriptPatterns(document) {
        const scripts = document.querySelectorAll('script');
        const patterns = {
            eventListeners: [],
            domQueries: [],
            functions: [],
            classes: []
        };
        
        scripts.forEach(script => {
            if (script.textContent) {
                this.parseJavaScriptCode(script.textContent, patterns);
            }
        });
        
        return patterns;
    }

    /**
     * Parse JavaScript code for patterns
     */
    parseJavaScriptCode(code, patterns) {
        // Extract event listeners
        const eventListenerRegex = /addEventListener\s*\(\s*['"]([^'"]+)['"]/g;
        let match;
        
        while ((match = eventListenerRegex.exec(code)) !== null) {
            patterns.eventListeners.push(match[1]);
        }
        
        // Extract DOM queries
        const domQueryRegex = /(querySelector|querySelectorAll|getElementById|getElementsByClassName)\s*\(\s*['"]([^'"]+)['"]/g;
        
        while ((match = domQueryRegex.exec(code)) !== null) {
            patterns.domQueries.push({
                method: match[1],
                selector: match[2]
            });
        }
        
        // Extract function declarations
        const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
        
        while ((match = functionRegex.exec(code)) !== null) {
            patterns.functions.push(match[1]);
        }
    }

    /**
     * Refactor Navigation Component
     */
    refactorNavigationComponent(document) {
        const navData = this.componentRegistry.get('navigation');
        if (!navData || navData.elements.length === 0) {
            return this.createEmptyComponent('navigation');
        }

        const primaryNav = navData.elements[0];
        const navStructure = this.analyzeNavigationStructure(primaryNav);
        
        const refactoredHTML = this.generateNavigationHTML(navStructure);
        const refactoredCSS = this.generateNavigationCSS(navStructure);
        const refactoredJS = this.generateNavigationJS(navStructure);

        return {
            html: refactoredHTML,
            css: refactoredCSS,
            js: refactoredJS,
            metadata: {
                componentType: 'navigation',
                accessibility: true,
                responsive: true,
                framework: 'vanilla'
            }
        };
    }

    /**
     * Analyze navigation structure
     */
    analyzeNavigationStructure(navElement) {
        const structure = {
            hasLogo: false,
            logoText: '',
            logoImage: null,
            menuItems: [],
            hasDropdowns: false,
            hasMobileToggle: false,
            classes: Array.from(navElement.classList),
            id: navElement.id || null
        };

        // Look for logo
        const logoSelectors = ['.logo', '.brand', '.site-title', 'h1', 'h2'];
        logoSelectors.forEach(selector => {
            const logoElement = navElement.querySelector(selector);
            if (logoElement && !structure.hasLogo) {
                structure.hasLogo = true;
                structure.logoText = logoElement.textContent.trim();
                
                const logoImg = logoElement.querySelector('img');
                if (logoImg) {
                    structure.logoImage = logoImg.src;
                }
            }
        });

        // Extract menu items
        const menuSelectors = ['ul', 'ol', '.menu', '.nav-menu'];
        menuSelectors.forEach(selector => {
            const menuElement = navElement.querySelector(selector);
            if (menuElement && structure.menuItems.length === 0) {
                const items = menuElement.querySelectorAll('li, a');
                items.forEach(item => {
                    if (item.tagName.toLowerCase() === 'a' || item.querySelector('a')) {
                        const link = item.tagName.toLowerCase() === 'a' ? item : item.querySelector('a');
                        structure.menuItems.push({
                            text: link.textContent.trim(),
                            href: link.href || '#',
                            hasSubmenu: item.querySelector('ul, ol') !== null
                        });
                        
                        if (item.querySelector('ul, ol')) {
                            structure.hasDropdowns = true;
                        }
                    }
                });
            }
        });

        // Check for mobile toggle
        const toggleSelectors = ['.menu-toggle', '.nav-toggle', '.hamburger', '.mobile-menu'];
        structure.hasMobileToggle = toggleSelectors.some(selector => 
            navElement.querySelector(selector) !== null
        );

        return structure;
    }

    /**
     * Generate refactored navigation HTML
     */
    generateNavigationHTML(structure) {
        const logoHTML = structure.hasLogo ? `
        <div class="nav__brand">
            ${structure.logoImage ? 
                `<img src="${structure.logoImage}" alt="${structure.logoText}" class="nav__logo-image">` : 
                `<span class="nav__logo-text">${structure.logoText}</span>`
            }
        </div>` : '';

        const menuItemsHTML = structure.menuItems.map(item => `
            <li class="nav__item">
                <a href="${item.href}" class="nav__link">${item.text}</a>
                ${item.hasSubmenu ? '<ul class="nav__submenu"></ul>' : ''}
            </li>`).join('');

        const mobileToggleHTML = structure.hasMobileToggle || structure.menuItems.length > 0 ? `
        <button class="nav__toggle" aria-label="Toggle navigation" aria-expanded="false">
            <span class="nav__toggle-line"></span>
            <span class="nav__toggle-line"></span>
            <span class="nav__toggle-line"></span>
        </button>` : '';

        return `<!-- Navigation Component -->
<nav class="nav" role="navigation" aria-label="Main navigation">
    <div class="nav__container">
        ${logoHTML}
        
        ${mobileToggleHTML}
        
        <ul class="nav__menu" role="menubar">
            ${menuItemsHTML}
        </ul>
    </div>
</nav>`;
    }

    /**
     * Generate refactored navigation CSS
     */
    generateNavigationCSS(structure) {
        return `/* Navigation Component */
:root {
    --nav-bg: #ffffff;
    --nav-border: #e2e8f0;
    --nav-text: #64748b;
    --nav-text-hover: #2563eb;
    --nav-text-active: #1d4ed8;
    --nav-padding: 1rem;
    --nav-height: 4rem;
    --nav-z-index: 1000;
    --container-width: 1200px;
    --transition-speed: 0.2s;
}

.nav {
    position: sticky;
    top: 0;
    background: var(--nav-bg);
    border-bottom: 1px solid var(--nav-border);
    z-index: var(--nav-z-index);
    height: var(--nav-height);
}

.nav__container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 var(--nav-padding);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nav__brand {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--nav-text-active);
    text-decoration: none;
}

.nav__logo-image {
    height: 2rem;
    width: auto;
}

.nav__logo-text {
    font-weight: 700;
    color: var(--nav-text-active);
}

.nav__menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
    align-items: center;
}

.nav__item {
    position: relative;
}

.nav__link {
    color: var(--nav-text);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 0;
    transition: color var(--transition-speed) ease;
    display: block;
}

.nav__link:hover,
.nav__link:focus {
    color: var(--nav-text-hover);
}

.nav__link--active {
    color: var(--nav-text-active);
}

.nav__toggle {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    gap: 0.25rem;
}

.nav__toggle-line {
    width: 1.5rem;
    height: 2px;
    background: var(--nav-text);
    transition: all var(--transition-speed) ease;
}

/* Mobile Styles */
@media (max-width: 768px) {
    .nav__toggle {
        display: flex;
    }
    
    .nav__menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--nav-bg);
        border-top: 1px solid var(--nav-border);
        flex-direction: column;
        gap: 0;
        padding: 1rem 0;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-speed) ease;
    }
    
    .nav__menu--open {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }
    
    .nav__item {
        width: 100%;
    }
    
    .nav__link {
        padding: 0.75rem var(--nav-padding);
        border-bottom: 1px solid var(--nav-border);
    }
    
    .nav__toggle--active .nav__toggle-line:nth-child(1) {
        transform: rotate(45deg) translate(0.375rem, 0.375rem);
    }
    
    .nav__toggle--active .nav__toggle-line:nth-child(2) {
        opacity: 0;
    }
    
    .nav__toggle--active .nav__toggle-line:nth-child(3) {
        transform: rotate(-45deg) translate(0.375rem, -0.375rem);
    }
}

/* Accessibility */
.nav__link:focus {
    outline: 2px solid var(--nav-text-active);
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    .nav__link,
    .nav__toggle-line,
    .nav__menu {
        transition: none;
    }
}`;
    }

    /**
     * Generate refactored navigation JavaScript
     */
    generateNavigationJS(structure) {
        return `// Navigation Component JavaScript
class NavigationComponent {
    constructor(element) {
        this.nav = element;
        this.toggle = this.nav.querySelector('.nav__toggle');
        this.menu = this.nav.querySelector('.nav__menu');
        this.links = this.nav.querySelectorAll('.nav__link');
        
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setActiveLink();
        this.setupAccessibility();
    }
    
    bindEvents() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
                this.toggle.focus();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('nav__menu--open');
        this.toggle.classList.add('nav__toggle--active');
        this.toggle.setAttribute('aria-expanded', 'true');
        
        // Focus first menu item
        const firstLink = this.menu.querySelector('.nav__link');
        if (firstLink) {
            firstLink.focus();
        }
    }
    
    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('nav__menu--open');
        this.toggle.classList.remove('nav__toggle--active');
        this.toggle.setAttribute('aria-expanded', 'false');
    }
    
    setActiveLink() {
        const currentPath = window.location.pathname;
        
        this.links.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (linkPath === currentPath) {
                link.classList.add('nav__link--active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('nav__link--active');
                link.removeAttribute('aria-current');
            }
        });
    }
    
    setupAccessibility() {
        // Set ARIA attributes
        if (this.toggle) {
            this.toggle.setAttribute('aria-expanded', 'false');
            this.toggle.setAttribute('aria-controls', 'nav-menu');
        }
        
        if (this.menu) {
            this.menu.setAttribute('id', 'nav-menu');
        }
        
        // Handle keyboard navigation
        this.links.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextLink = this.links[index + 1] || this.links[0];
                    nextLink.focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevLink = this.links[index - 1] || this.links[this.links.length - 1];
                    prevLink.focus();
                }
            });
        });
    }
}

// Auto-initialize navigation components
document.addEventListener('DOMContentLoaded', () => {
    const navElements = document.querySelectorAll('.nav');
    navElements.forEach(nav => new NavigationComponent(nav));
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationComponent;
}`;
    }

    /**
     * Create empty component template
     */
    createEmptyComponent(type) {
        return {
            html: `<!-- No ${type} elements found in the document -->`,
            css: `/* No ${type} styles to extract */`,
            js: `// No ${type} scripts found`,
            metadata: {
                componentType: type,
                isEmpty: true
            }
        };
    }

    /**
     * Refactor Header Component (placeholder for now)
     */
    refactorHeaderComponent(document) {
        // Implementation similar to navigation but for headers
        return this.createEmptyComponent('header');
    }

    /**
     * Refactor Hero Component (placeholder for now)
     */
    refactorHeroComponent(document) {
        return this.createEmptyComponent('hero');
    }

    /**
     * Refactor Card Component (placeholder for now)
     */
    refactorCardComponent(document) {
        return this.createEmptyComponent('card');
    }

    /**
     * Refactor Form Component (placeholder for now)
     */
    refactorFormComponent(document) {
        return this.createEmptyComponent('form');
    }

    /**
     * Refactor Button Component (placeholder for now)
     */
    refactorButtonComponent(document) {
        return this.createEmptyComponent('button');
    }

    /**
     * Refactor Footer Component (placeholder for now)
     */
    refactorFooterComponent(document) {
        return this.createEmptyComponent('footer');
    }

    /**
     * Refactor Layout System (placeholder for now)
     */
    refactorLayoutSystem(document) {
        return this.createEmptyComponent('layout');
    }

    /**
     * Refactor Style System (placeholder for now)
     */
    refactorStyleSystem(document) {
        return this.createEmptyComponent('styles');
    }

    /**
     * Refactor Script Modules (placeholder for now)
     */
    refactorScriptModules(document) {
        return this.createEmptyComponent('scripts');
    }
}

// Export the refactoring engine
if (typeof window !== 'undefined') {
    window.RefactoringEngine = RefactoringEngine;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = RefactoringEngine;
}

