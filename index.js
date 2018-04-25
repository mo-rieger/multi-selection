const locale = 'de'; // 'set to 'en' for english localisation
const headlines = {
    de: {
        PET: ['Typ', 'Farbe', 'Beschichtung', 'Auswahl 4', 'Auswahl 5'],
        OPA: ['Typ', 'Auswahl2', 'Beschichtung', 'Auswahl 4', 'Auswahl 5'],
        BOPP: ['Typ', 'Farbe', 'Beschichtung', 'Auswahl 4', 'Auswahl 5'],
        Aluminium: ['Typ', 'Farbe', 'Beschichtung', 'Auswahl 4', 'Auswahl 5'],
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
const icons = {
    PET:  'img/placeholder-icon.png',
    OPA:  'img/placeholder-icon.png',
    BOPP:  'img/placeholder-icon.png',
    Aluminium: 'img/placeholder-icon.png',
    Reserved:  'img/placeholder-icon.png',
    Reserviert:  'img/placeholder-icon.png'
}
let selectedId;
// run into CORS while serving .json local on Chrome - run in firefox for developent
const jsonRequest = new Request.JSON({
    url: 'navigation.json',
    headers: {'Access-Control-Allow-Headers': ' X-Requested-With'},
    onSuccess: function(navigation){
        buildMultiSelection(navigation, '.nav.site-nav', '.flyout.first-item', 0).inject('ms-wrapper')
    }}).send();

function buildMultiSelection(navigation, ulClasses, liClasses,level, type) {
    let multiSelection = new Element('ul' + ulClasses);
    let headline = new Element('h3');
    headline.inject(multiSelection);
    navigation.forEach(function(selectable) {
        let anchor = createAnchor(selectable);
        if (level === 0) {
            type = locale === 'de'? selectable.titleDe: selectable.titleEn;
            let icon = createIcon(type);
            icon.inject(anchor)
        }
        new Element('span', {
            text: locale === 'de'? selectable.titleDe: selectable.titleEn,
        }).inject(anchor);
        let listElement = new Element('li' + liClasses).grab(anchor);
        if(selectable.children != null){
            listElement.grab(
                buildMultiSelection(selectable.children, '.flyout-content.nav.stacked', '.flyout-alt', level+1, type)
            );
        }
        multiSelection.grab(listElement);
    });
    headline.set('text', headlines[locale][type][level]);
    // headline.inject(multiSelection)
    return multiSelection;
}

function enableSearch(executable){
    $$('button').setProperties({
        disabled: !executable
    })
}

function recursiveRemoveClass(element, className) {
    if (element.children) {
        for (let i = 0; i < element.children.length; i++) {
            recursiveRemoveClass(element.children[i], className);
        }
    }
    element.removeClass(className);
}
function createAnchor(selectable) {
    return new Element('a',{
        href: '#',
        events: {
            click: function (event) {
                recursiveRemoveClass(event.target.getParent('ul'), 'clicked');
                event.target.getParent('li').addClass('clicked');
                selectedId = selectable.id;
                enableSearch(selectable.executable);
            }
        }
    });
}
function createIcon(type) {
    return new Element('img', {
        src: icons[type],
        height: 55,
        alt: 'icon'
    })
}

/**
 * Makes a get request and
 */
function showTable() {
    const table = $('stock-table');
    new Request({
        url: 'example.php',
        method: 'get',
        onRequest: function(){
            table.set('text', 'loading...');
        },
        onSuccess: function(responseText){
            table.set('text', responseText);
        },
        onFailure: function(){
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
