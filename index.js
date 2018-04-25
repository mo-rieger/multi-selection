const locale = 'de'; // 'set to 'en' for english localisation
let selectedId = '';
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
// run into CORS while serving .json local on Chrome - run in firefox for developent
const jsonRequest = new Request.JSON({
    url: 'navigation.json',
    headers: {'Access-Control-Allow-Headers': ' X-Requested-With'},
    onSuccess: function(navigation){
        buildMultiSelection(navigation, '.nav.site-nav', '.flyout', 0, 'PET').inject('ms-wrapper')
    }}).send();

function buildMultiSelection(navigation, ulClasses, liClasses,level, type) {
    let multiSelection = new Element('ul' + ulClasses);
    let headline = new Element('h3');
    headline.inject(multiSelection);
    navigation.forEach(function(selectable) {
        if (level === 0) type = locale === 'de'? selectable.titleDe: selectable.titleEn;
        let listElement = new Element('li' + liClasses).grab(
            new Element('a',{
                text: locale === 'de'? selectable.titleDe: selectable.titleEn,
                href: '#',
                events: {
                    click: function (event) {
                        recursiveRemoveClass(event.target.parentElement.parentElement, 'clicked');
                        event.target.parentElement.addClass('clicked');
                        selectedId = selectable.id;
                        enableSearch(selectable.executable);
                    }
                }
            })
        );
        if(selectable.children != null){
            listElement.grab(buildMultiSelection(selectable.children, '.flyout-content.nav.stacked', '.flyout-alt', level+1, type));
        }
        multiSelection.grab(listElement);
    });
    console.log(level, type);
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
