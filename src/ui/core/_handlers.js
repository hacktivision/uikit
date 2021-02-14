function actionHandler(handlerls = null) {

    try {
        if(!handlerls) {
            throw new Error().message = 'Handler error!'
        }

        if(Array.isArray(handlerls)) {
            
            for(const handle of handlerls) {

                document.body.addEventListener(handle.event, (event) => {

                    const target = event.currentTarget.querySelector(handle.target)

                    target.addEventListener(handle.event, handle.action )

                }, true)

            }
            
        }

    } catch (err) {
        console.error('Error: ' + err)
    }

}

module.exports = actionHandler