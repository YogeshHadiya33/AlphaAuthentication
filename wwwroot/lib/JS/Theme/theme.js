
/* -------------------------------------------------------------------------- */
/*                               Feather Icon                              */
/* -------------------------------------------------------------------------- */

const handleFeatherIconInit = () => {
    feather.replace();
}


/* ---------------------------------- Store --------------------------------- */

const getItemFromStore = (key, defaultValue, store = localStorage) => {
    try {
        return JSON.parse(store.getItem(key)) || defaultValue;
    } catch {
        return store.getItem(key) || defaultValue;
    }
};

const setItemToStore = (key, payload, store = localStorage) =>
    store.setItem(key, payload);
const getStoreSpace = (store = localStorage) =>
    parseFloat(
        (
            escape(encodeURIComponent(JSON.stringify(store))).length /
            (1024 * 1024)
        ).toFixed(2)
    );


const resize = fn => window.addEventListener('resize', fn);

/* -------------------------------------------------------------------------- */
/*                               Navbar Vertical                              */
/* -------------------------------------------------------------------------- */

const handleNavbarVerticalCollapsed = () => {

    const Selector = {
        HTML: 'html',
        BODY: 'body',
        NAVBAR_VERTICAL: '.navbar-vertical',
        NAVBAR_VERTICAL_TOGGLE: '.navbar-vertical-toggle',
        NAVBAR_VERTICAL_COLLAPSE: '.navbar-vertical .navbar-collapse',
        ACTIVE_NAV_LINK: '.navbar-vertical .nav-link.active'
    };

    const Events = {
        CLICK: 'click',
        MOUSE_OVER: 'mouseover',
        MOUSE_LEAVE: 'mouseleave',
        NAVBAR_VERTICAL_TOGGLE: 'navbar.vertical.toggle'
    };
    const ClassNames = {
        NAVBAR_VERTICAL_COLLAPSED: 'navbar-vertical-collapsed'
    };
    const navbarVerticalToggle = document.querySelector(
        Selector.NAVBAR_VERTICAL_TOGGLE
    );
    // const html = document.querySelector(Selector.HTML);
    const navbarVerticalCollapse = document.querySelector(
        Selector.NAVBAR_VERTICAL_COLLAPSE
    );
    const activeNavLinkItem = document.querySelector(Selector.ACTIVE_NAV_LINK);
    const isNavbarVerticalCollapsed = getItemFromStore(
        'phoenixIsNavbarVerticalCollapsed',
        false
    );
    if (navbarVerticalToggle) {
        navbarVerticalToggle.addEventListener(Events.CLICK, e => {
            navbarVerticalToggle.blur();
            document.documentElement.classList.toggle(
                ClassNames.NAVBAR_VERTICAL_COLLAPSED
            );

            // Set collapse state on localStorage
            setItemToStore(
                'phoenixIsNavbarVerticalCollapsed',
                !isNavbarVerticalCollapsed
            );

            const event = new CustomEvent(Events.NAVBAR_VERTICAL_TOGGLE);
            e.currentTarget?.dispatchEvent(event);
        });
    }
    if (navbarVerticalCollapse) {
        if (activeNavLinkItem && !isNavbarVerticalCollapsed) {
            activeNavLinkItem.scrollIntoView({ behavior: 'smooth' });
        }
    }
    const setDocumentMinHeight = () => {
        const bodyHeight = document.querySelector(Selector.BODY).offsetHeight;
        const navbarVerticalHeight = document.querySelector(
            Selector.NAVBAR_VERTICAL
        )?.offsetHeight;

        if (
            document.documentElement.classList.contains(
                ClassNames.NAVBAR_VERTICAL_COLLAPSED
            ) &&
            bodyHeight < navbarVerticalHeight
        ) {
            document.documentElement.style.minHeight = `${navbarVerticalHeight}px`;
        } else {
            document.documentElement.removeAttribute('style');
        }
    };

    // set document min height for collapse vertical nav
    setDocumentMinHeight();
    resize(() => {
        setDocumentMinHeight();
    });
    if (navbarVerticalToggle) {
        navbarVerticalToggle.addEventListener('navbar.vertical.toggle', () => {
            setDocumentMinHeight();
        });
    }
};

const InitFlatPickr = () => {
    const fp = flatpickr(".date-picker", {
        disableMobile: true,
        dateFormat: "m / d / Y",

    }); // flatpickr

}

/* -------------------------------------------------------------------------- */
/*                                   Popover                                  */
/* -------------------------------------------------------------------------- */

const InitPopOver= () => {
    const popoverTriggerList = Array.from(
        document.querySelectorAll('[data-bs-toggle="popover"]')
    );

    popoverTriggerList.map(popoverTriggerEl => {
        return new bootstrap.Popover(popoverTriggerEl);
    });
};