// Select plugin


create( buildTree({
    element: '#langs',
}))

create( buildTree({
    element: '#nums',
}))

// Create select
function create({
    element = element,
    classList = null,
    name = null,
    dataset = null,
    options = [],
    selected = null,
    insertTo = null,
} = {}){
    try {
        // Is exist element
        if(!element) {
            throw new Error('Selector does not exist')
        }

        // Main
        const select = document.createElement('div')
        select.classList.add('ui-select', classList)

        // Current selected option
        const current = document.createElement('div')
        current.classList.add('ui-select__current')
        current.textContent = options.find(item => item.selected).text
        select.append(current)

        // Drop container for item option
        const drop = document.createElement('div')
        drop.classList.add('ui-select__drop')
        
        // Create options
        options.forEach(item => {
            const option = document.createElement('div')
            option.classList.add('ui-select__option')
            option.textContent = item.text

            option.setAttribute('data-index', item.index)
            option.setAttribute('data-value', item.value)
                
            if(item.selected) {
                option.setAttribute('data-selected', item.selected)
            }

            if(item.disabled) {
                option.setAttribute('data-disabled', item.disabled)
            }

            drop.append(option)
        })  

        /**
         * API
         * 
        */

        // Toggle
        select.toggle = function () {
            if(select.classList.contains('ui-select--active')) {
                select.classList.remove('ui-select--active')
                document.body.unlock().hideOverlayPanel()
            } else {
                select.classList.add('ui-select--active')
                document.body.lock().showOverlayPanel()
            }
                
        }

        // Show
        select.show = function () {
            select.classList.add('ui-select--active')
            document.body.lock().showOverlayPanel()
            
        }

        // Hide
        select.hide = function () {
            select.classList.remove('ui-select--active')
            document.body.unlock().hideOverlayPanel()
        }
        

        // End build
        select.append(drop)
        element.insertAdjacentElement('beforebegin', select)

        // Toggle active select
        select.addEventListener('click', () => select.toggle())

        
        
        // Selected option
        drop.addEventListener(
            "mousedown", 
            (event) => {
                event.stopImmediatePropagation()
                Array.from(drop.children).forEach(option => option.removeAttribute('data-selected'))
                event.target.setAttribute('data-selected', true)
                current.textContent = event.target.textContent
                element.options[event.target.dataset.index].selected = true
            }, false)

    } catch (err) {
        console.log('Error: ' + err)
    }

} 

// Build tree select
function buildTree({
    element = null,
} = {}) {

    try {
        if(!element) {
            throw new Error('Selector does not exist')
        }

        // Get element
        element = document.querySelector(element)
        // Hide default element
        element.style.display = 'none'

        // Data parse from element select
        const tree = {
            element: element, // Current select element,
            classList: (element.classList || null),
            name: (element.name || null), // Attribute name
            dataset: (Object.fromEntries(Object.entries(element.dataset)) || null), // All data attribute
            options: (Array.from(element.options) // All options with data
                .map((option) => ({
                    index: option.index, 
                    value: option.value,
                    text: option.text, 
                    disabled: option.disabled, 
                    selected: option.selected,
                })) 
                || null),
            selected: (element.value), // Current selected option
            selectedIndex: (element.selectedIndex || null), // Index selected option
            insertTo: (element.dataset.insertTo || null), // Insert to(default before current element)
        }
        return tree

    } catch (err) {
        console.log('Error: ' + err)
    }
}


// Utils____________________________________



