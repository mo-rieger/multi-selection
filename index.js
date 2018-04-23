const locale = 'de'; // 'set to 'en' for english localisation
let selectedId = '';
// run into CORS while serving .json local on Chrome - run in firefox for developent
const jsonRequest = new Request.JSON({
    url: 'navigation.json',
    headers: {'Access-Control-Allow-Headers': ' X-Requested-With'},
    onSuccess: function(navigation){
        buildMultiSelection(navigation, '.nav.site-nav', '.flyout').inject('ms-wrapper')
    }}).send();

function buildMultiSelection(navigation, ulClasses, liClasses) {
    let multiSelection = new Element('ul' + ulClasses);
    navigation.forEach(function(selectable) {
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
            listElement.grab(buildMultiSelection(selectable.children, '.flyout-content.nav.stacked', '.flyout-alt'));
        }
        multiSelection.grab(listElement);
    });
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
