const locale = 'de'; // 'set to 'en' for english localisation
/**
 *
 * @type {{de: {PET: string[], OPA: string[], BOPP: string[], Aluminium: string[], Reserviert: string[]}, en: {PET: string[], OPA: string[], BOPP: string[], Aluminium: string[], Reserved: string[]}}}
 */
const headlines = {
    de: {
        PET: ['Typ', 'Farbe', 'Beschichtung', 'Auswahl 4', 'Auswahl 5'],
        OPA: ['Typ', 'Behandlung', 'Stärke', 'Auswahl 4', 'Auswahl 5'],
        BOPP: ['Typ', 'Farbe', 'Beschichtung', 'Auswahl 4', 'Auswahl 5'],
        Aluminium: ['Typ', 'Farbe', 'Stärke', 'Breite', 'Auswahl 5'],
        Reserviert: ['Typ']
    },
    en: {
        PET: ['type', 'color', 'surface', 'selection 4', 'selection 5'],
        OPA: ['type', 'color', 'surface', 'selection 4', 'selection 5'],
        BOPP: ['type', 'color', 'surface', 'selection 4', 'selection 5'],
        Aluminium: ['type', 'color', 'surface', 'selection 4', 'selection 5'],
        Reserved: ['type']
    }
};
/**
 *
 * @type {{PET: string, OPA: string, BOPP: string, Aluminium: string, Reserved: string, Reserviert: string}}
 */
const icons = {
    PET: 'img/placeholder-icon.png',
    OPA: 'img/placeholder-icon.png',
    BOPP: 'img/placeholder-icon.png',
    Aluminium: 'img/placeholder-icon.png',
    Reserved: 'img/placeholder-icon.png',
    Reserviert: 'img/placeholder-icon.png'
};
let selectedId;
// run into CORS while serving .json locally on Chrome - run in firefox for developent
new Request.JSON({
    url: 'navigation.json',
    headers: {'Access-Control-Allow-Headers': ' X-Requested-With'},
    onSuccess: function (navigation) {
        buildMultiSelection(navigation, '.nav.site-nav', '.flyout.first-item', 0).inject('ms-wrapper')
    }
}).send();

/**
 * Build the multi selection
 * @param navigation the JSON Response
 * @param ulClasses CSS Classes
 * @param liClasses CSS Classes
 * @param level, is the level of the current selectable-group
 * @param type, main type of the selection eg. 'PET', 'OPA'
 * @returns {Element}
 */
function buildMultiSelection(navigation, ulClasses, liClasses, level, type) {
    let multiSelection = new Element('ul' + ulClasses);
    let headline = new Element('h7', {
        events: {
            click: function (event) {
                recursiveRemoveClass(event.target.getParent('ul'), 'clicked');
            }
        }
    });
    headline.inject(multiSelection);
    navigation.forEach(function (selectable) {
        let anchor = createAnchor(selectable);
        if (level === 0) {
            type = locale === 'de' ? selectable.titleDe : selectable.titleEn;
            let icon = createIcon(type);
            icon.inject(anchor)
        }
        new Element('span', {
            text: locale === 'de' ? selectable.titleDe : selectable.titleEn,
        }).inject(anchor);
        let listElement = new Element('li' + liClasses).grab(anchor);
        if (selectable.children != null) {
            listElement.grab(
                buildMultiSelection(selectable.children, '.flyout-content.nav.stacked', '.flyout-alt', level + 1, type)
            );
        }
        multiSelection.grab(listElement);
    });
    headline.set('text', headlines[locale][type][level]);
    // headline.inject(multiSelection)
    return multiSelection;
}

/**
 * enables the search button if a clicked selectable is executable
 * @param executable
 */
function enableSearch(executable) {
    $$('button').setProperties({
        disabled: !executable
    })
}

/**
 * remove the clicked class of all interleaved classes in the DOM-Tree
 * @param element
 * @param className
 */
function recursiveRemoveClass(element, className) {
    if (element.children) {
        for (let i = 0; i < element.children.length; i++) {
            recursiveRemoveClass(element.children[i], className);
        }
    }
    element.removeClass(className);
}

/**
 *
 * @param selectable
 * @returns {Element}
 */
function createAnchor(selectable) {
    return new Element('a', {
        href: '#',
        events: {
            click: function (event) {
                recursiveRemoveClass(event.target.getParent('ul'), 'clicked');
                let selected = event.target.getParent('li')
                selected.getSiblings().addClass('hidden-mobile')
                selected.addClass('clicked');
                selectedId = selectable.id;
                enableSearch(selectable.executable);
            }
        }
    });
}

/**
 * Creates an Icon Element for the given type.
 * The icon for a type must be specified in the icons array,
 * keep in mind that you have to handle them for each locale.
 * @param type like 'PET', 'OPA' ...
 * @returns {Element} HTMLImageElement
 */
function createIcon(type) {
    return new Element('img', {
        src: icons[type],
        height: 48,
        alt: 'icon'
    })
}

/**
 * Makes a get request and inject the result into the stock-table div element
 */
function showTable() {
    const table = $('stock-table');
    new Request({
        url: 'example.php',
        method: 'get',
        onRequest: function () {
            table.set('text', 'loading...');
        },
        onSuccess: function (responseText) {
            table.set('text', responseText);
        },
        onFailure: function () {
            table.set('text', 'Sorry, your search ' + selectedId + ' could not be loaded.');
        }
    }).send('param=' + selectedId);
}

// function loadJSON(callback) {
//     var xobj = new XMLHttpRequest();
//     xobj.overrideMimeType("application/json");
//     xobj.open('GET', 'navigation.json', true);
//     xobj.onreadystatechange = function () {
//         if (xobj.readyState == 4 && xobj.status == "200") {
//             // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
//             callback(xobj.responseText);
//         }
//     };
//     xobj.send(null);
// }

// loadJSON(res => {
//     navigation = JSON.parse(res)
//     console.log(navigation)
//     buildMultiSelection(navigation)
// })
