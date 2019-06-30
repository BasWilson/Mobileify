/**
 * Mobileify
 * Version: 0.0.3
 * Author: Bas Wilson
 * Hosted at https://npmawesome.net
 * Check for updates at https://npmawesome.net/library/mobileify
 */

var loadedMobileifyApp;

class MobileifyApp {
    /**
     * 
     * @param {*} properties 
     * @param {ThemeifyTheme} theme 
     */
    constructor(properties, theme) {
        this.properties = properties;
        this.theme = theme;
        this.navigator = new MobileifyNavigator();
        this.navbar = properties.navbar ? new MobileifyNavbar() : null

        // Get the theme that is saved in the local storage
        this.enabledTheme = localStorage.getItem('ThemeifyTheme') == "dark" ? 'dark' : 'light';

        this.buildApp().then(() => {
            loadedMobileifyApp = this;
            this.changeView();
        });
    }

    buildApp() {

        return new Promise(resolve => {

            // Add the css to the body 
            var css = document.createElement('style');
            css.type = 'text/css';

            if (css.styleSheet) css.styleSheet.cssText = this.createStyle();
            else css.appendChild(document.createTextNode(this.createStyle()));

            document.getElementsByTagName("head")[0].appendChild(css);

            document.body.innerHTML = `
            <div class="mobileify mob-app">
                <div class="mobileify mob-header">
                    <div class="mobileify mob-header-back">
                        <img class="mobileify mob-header-back-btn" src="assets/back.png" />
                        <h2 id="mob-header-text">${this.properties.name}</h2>
                    </div>
                </div>
                <div class="mobileify mob-content"></div>
                ${this.navbar ? `<div class="mobileify mob-navbar">${this.navbar.renderedNavbar}</div>` : ''}
            </div>
            `;

            if (this.navbar)
                this.navbar.renderNavbar();

            resolve(true);
        });
    }


    /**
     * @param {MobileifyView} view 
     */
    addView(view) {
        if (view.properties.navbar) {
            this.navbar.addNavItem({
                text: view.properties.name,
                icon: view.properties.navbar.icon
            });
        }
        this.navigator.addView(view);
    }

    changeView(viewName) {
        this.navigator.changeView(viewName);
        if (this.navbar)
            this.navbar.updateSelectedNavItem(viewName);
    }

    createStyle() {
        return `

            body {
                margin: 0px;
                padding: 0px;
                user-select: none !important;
            }

            .mob-app {
                height: 100vh;
            }

            .mob-header {
                height: 50px;
                padding: 10px 0px;
                line-height: 35px;
                position: fixed;
                top: 0px;
                right: 0px;
                left: 0px;
                border-bottom: 1px solid rgba(199,197,255,.1);
            }
            .mob-small-header-text {
                font-size: 18px !important;
                font-family: sfpro !important;
                color: #007AFF;
                line-height: 30px;
            }

            .mob-header-back {
                display:flex; 
                flex-direction: row;
                padding: 20px;
            }

            .mob-header-back-btn {
                width: 35px;
                height: auto;
                padding: 0px;
                display: none;
            }

            .mob-header-interact-btn {
                width: auto;
                height: 35px;
                padding: 0px;
                position: absolute;
                right: 20px;
                z-index: 2;
                color: #007AFF;
                line-height: 33px;
                text-align: right;
            }

            .mob-content {
                position: fixed;
                top: 70px;
                left: 0px;
                right: 0px;
                bottom: ${this.navbar ? '90px' : '0px'};
            }

            .mob-view {
                position: absolute;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                overflow-y: scroll;
                -webkit-overflow-scrolling: touch;
            }

            .mob-navbar {
                width: 100%;
                height: 70px;
                position: fixed;
                bottom: 20px;
                display: flex;
                flex-direction: row;
                justify-content: space-evenly;
                border-top: 1px solid rgba(199,197,255,.1);
            }

            .mob-navbar-item {
                display:flex;
                flex-direction: column;
                text-align: center;
                align-items: center;
                font-size: 12px;
                vertical-align: middle;
                width: 100%;
                padding: 10px;
            }

            .mob-navbar-item-selected {
            ;
                /*-webkit-animation-name: nabvar;
                -webkit-animation-duration: .3s;
                */
            }

            @-webkit-keyframes nabvar {
                0%{ background-color: rgba(0,0,0,0);}
                50%{ background-color: rgba(0,0,0,0.1);}
                100%{ background-color: rgba(0,0,0,0);}
            }

            .mob-navbar-item img {
                height: 30px;
                background-color: rgba(0,0,0,0);
                width: 30px;
                margin-bottom: 5px;
            }
            @-webkit-keyframes navigate {
                0% { opacity: 1;}
                100%{ opacity: 1;}
            }

            .mobileify h1, h2, h3, h4, h5, p {
                margin: 0px;
            }
            .mobileify h2 {
                font-size: 25px;
            }

        `;
    }

    /**
     * Sets the theme to light or dark mode
     * @param {string} themeStyle 
     */
    setTheme(themeStyle) {
        this.enabledTheme = themeStyle;
        theme.applyTheme(this.enabledTheme);
    }

}

class MobileifyNavbar {
    constructor() {
        this.selectedNavItem = null;
        this.navItems = [];
        this.renderedNavbar = this.renderNavbar();
        this.rendered = false;
    }

    renderNavbar() {
        var barItems = '';
        for (let i = 0; i < this.navItems.length; i++) {
            barItems += `
            <div class="mobileify mob-navbar-item" data-navitem="${this.navItems[i].text}" onclick="app.changeView('${this.navItems[i].text}')">
                <img class="mobileify mob-navbar-icon" src="${this.navItems[i].icon}" />
                <p>${this.navItems[i].text}</p>
            </div>`;
        }
        this.renderedNavbar = barItems;

        if (this.rendered) {
            document.querySelector('.mob-navbar').innerHTML = this.renderedNavbar;
        }

        this.rendered = true;
        return barItems;
    }

    addNavItem(item) {
        this.navItems.push(item);
        this.renderNavbar();
    }

    updateSelectedNavItem(navItemName) {
        if (this.selectedNavItem) {
            if (document.querySelector(`[data-navitem="${this.selectedNavItem}"]`)) {
                document.querySelector(`[data-navitem="${this.selectedNavItem}"]`).classList.remove('mob-navbar-item-selected');
                // Change the icon to the inctive version
                var icon = document.querySelector(`[data-navitem="${this.selectedNavItem}"]`).childNodes[1];
                icon.src = icon.src.replace('_active.png', '.png');
            }

        }

        if (!navItemName)
            navItemName = this.navItems[0].text;

        if (document.querySelector(`[data-navitem="${navItemName}"]`))
            document.querySelector(`[data-navitem="${navItemName}"]`).classList.add('mob-navbar-item-selected');

        // Change the icon to the active version
        if (document.querySelector(`[data-navitem="${navItemName}"]`)) {
            var icon = document.querySelector(`[data-navitem="${navItemName}"]`).childNodes[1];
            icon.src = icon.src.replace('.png', '_active.png');
        }

        // end icon change

        this.selectedNavItem = navItemName;
    }
}

class MobileifyNavigator {

    constructor() {
        this.currentView = null;
        this.views = [];
        this.navigating = false;
    }

    /**
     * 
     * @param {string} viewName 
     */
    changeView(viewName) {
        this.navigating = true;
        if (!viewName)
            viewName = this.views[0].properties.name;
        this.renderView(viewName).then((result) => {
            if (result.renderedView) {
                this.animateViewSwitch(result.renderedView, result.viewIndex);
            }
        });
    }

    /**
     * 
     * @param {string} viewName 
     */
    renderView(viewName) {
        return new Promise(resolve => {

            for (let i = 0; i < this.views.length; i++) {
                if (this.views[i].properties.name == viewName) {
                    document.querySelector('.mob-header').style.display = this.views[i].properties.header ? 'flex' : 'none';
                    document.querySelector('.mob-content').style.top = this.views[i].properties.header ? '70px' : '0px';

                    return resolve({ renderedView: this.views[i], viewIndex: i });
                }
            }
            return resolve(false);
        });
    }

    /**
     * 
     * @param {MobileifyView} renderedView 
     * @param {number} viewIndex 
     */
    animateViewSwitch(renderedView, viewIndex) {

        if (this.currentView) {
            document.querySelector(`#mob-view-${this.currentView}`).style.display = 'none';
        }

        // If the view has not been assigned to HTML yet (loaded)
        if (!renderedView.loaded) {
            document.querySelector('.mob-content').innerHTML += renderedView.view;
        }

        // Now that the page has been rendered and fully assigned to the HTML, apply the theme
        loadedMobileifyApp.setTheme(loadedMobileifyApp.enabledTheme);

        // Lock the body scroll, webkit fix for ios
        bodyScrollLock.disableBodyScroll(document.querySelector(`#mob-view-${renderedView.name}`));
        
        document.querySelector('#mob-header-text').innerHTML = renderedView.properties.name;
        document.querySelector(`#mob-view-${renderedView.name}`).style.display = 'block';

        /**
         * Back button
         */
        if (!renderedView.previousViewName)
            renderedView.previousViewName = this.currentView;
        this.currentView = renderedView.name;

        if (this.views[viewIndex].previousViewName && renderedView.properties.navigatable) {
            var thisd = this;
            document.querySelector('.mob-header-back-btn').style.display = 'block';
            document.querySelector('#mob-header-text').classList.add("mob-small-header-text");
            document.querySelector('#mob-header-text').innerHTML = this.views[viewIndex].previousViewName.replace('_', ' ');
            document.querySelector('.mob-header-back').style.padding = '10px 10px';
            document.querySelector('.mob-header').style.lineHeight = '50px';
            setTimeout(() => {
                document.querySelector('.mob-header-back-btn').setAttribute( "onClick", `app.changeView('${this.views[viewIndex].previousViewName.replace('_', ' ')}')` )
                document.querySelector('#mob-header-text').setAttribute( "onClick", `app.changeView('${this.views[viewIndex].previousViewName.replace('_', ' ')}')` )
            }, 100);

            // hide the nav bar
            if (document.querySelector('.mob-navbar')) {
                document.querySelector('.mob-navbar').style.display = 'none';
                document.querySelector('.mob-content').style.bottom = '0px';
            }

        } else {
            document.querySelector('.mob-header-back-btn').style.display = 'none';
            document.querySelector('.mob-header').style.lineHeight = '35px';
            document.querySelector('.mob-header-back').style.padding = '10px 20px';
            document.querySelector('#mob-header-text').classList.remove("mob-small-header-text");
            document.querySelector('.mob-header-back-btn').removeAttribute( "onClick" )
            document.querySelector('#mob-header-text').removeAttribute( "onClick" )
            if (document.querySelector('.mob-navbar')) {
                document.querySelector('.mob-navbar').style.display = 'flex';
                document.querySelector('.mob-content').style.bottom = '90px';
            }
        }
        // End of back button

        // Action button
        if (renderedView.properties.actionButton) {
            if (document.querySelector('.mob-header-interact-btn'))
                document.querySelector('.mob-header-interact-btn').remove();
                if (renderedView.properties.actionButton.text)
                    document.querySelector('.mob-header-back').innerHTML += `<p class="mobileify mob-header-interact-btn" onclick="${renderedView.properties.actionButton.onclick}">${renderedView.properties.actionButton.text}</p>`;
                else
                    document.querySelector('.mob-header-back').innerHTML += `<img class="mobileify mob-header-interact-btn" onclick="${renderedView.properties.actionButton.onclick}" src="${renderedView.properties.actionButton.icon}" />`;
        } else {
            if (document.querySelector('.mob-header-interact-btn'))
                document.querySelector('.mob-header-interact-btn').remove();
        }
        
        this.navigating = false;
        this.views[viewIndex].loaded = true;
        if (this.views[viewIndex].properties.onload) {
            this.views[viewIndex].properties.onload();
        }
    }
    /**
     * @param {MobileifyView} view 
     */
    addView(view) {
        this.views.push(view);
    }

}

class MobileifyView {

    /**
     * 
     * @param {*} properties 
     * @param {string} html 
     */
    constructor(properties, html) {
        this.properties = properties;
        this.name = this.properties.name.replace(' ', '_');
        this.loaded = false;
        this.view = `<div class="mobileify mob-view" id="mob-view-${this.name}">${html}</div>`;
        this.previousViewName = null;
    }

}