// Helpers
function dataParser(data) {
    const options = Object.fromEntries(
        data.split(';')
    )

    
    const arr = []

    for(let i = 0; i < data.length; i++) {
        options[i].split(':')
    }
}