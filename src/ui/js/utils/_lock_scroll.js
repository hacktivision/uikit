document.body.lock = function () {
    this.classList.add('body-lock')
    return this
}

document.body.unlock = function () {
    this.classList.remove('body-lock')
    return this
}


document.body.showOverlayPanel = function () {
    try {
        let panel = document.body.querySelector('.panel-overlay') || null
        
        if(!panel) {
            panel = document.createElement('div')
            panel.classList.add('panel-overlay')
            document.body.append(panel)
        }

        panel.classList.add('panel-overlay--active')

        panel.addEventListener('click', (event) => event.currentTarget.classList.remove('panel-overlay--active'), true)

    } catch (err) {
        console.log('Error: ' + err)
    }
}

document.body.hideOverlayPanel = function () {
    try {
        document.body.querySelector('.panel-overlay').classList.remove('panel-overlay--active')
    } catch (err) {
        console.log('Error: ' + err)
    }
}

// Hide elements as active 
function hideElements({
    selectors = []
}) {
    try {
        if(!selectors.length) {
            throw new Error('Please choose elements')
        }

        
        document.body.addEventListener('mouseup', (event) => {
            
            selectors.forEach(selector => {
                if(!event.target.closest(selector)) {
                    document.body.querySelectorAll(selector).forEach(select => select.hide())
                    document.body.unlock()
                }
            })
        })
        

    } catch (err) {
        console.log('Error: ' + err)
    }
}
hideElements({
    selectors: [
        '.ui-select',
    ]
})