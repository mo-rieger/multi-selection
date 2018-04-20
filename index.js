order = []
anchors = $$('a')
anchors.addClass('test')
$$('a').addEvent('click', function(event){
    recursiveRemoveClass(event.target.parentElement.parentElement, 'clicked')
    event.target.parentElement.addClass('clicked')
    level = Number(event.target.parentElement.parentElement.id.replace('level', ''))
    addProperty(level, event.target.innerHTML)
    console.log('your Order: ' + order)
});
function addProperty(level, item){
    order[level] = item
//slice the last part of the array
    if(level < order.length-1) {
        order = order.slice(0, level+1)
    }
}
function recursiveRemoveClass(element, className) {
    if(element.children) {
        for (var i = 0; i < element.children.length; i++) {
            recursiveRemoveClass(element.children[i], className)
        }
    }
    element.removeClass(className)
}