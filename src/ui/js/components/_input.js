

// const field = document.querySelector('#field')

// field.onblur = function () {

// 	if(!this.classList.contains('.is-data') && this.value) {
// 		this.classList.add('is-data')
// 	} else {
// 		this.classList.remove('is-data')
// 		this.dataset.message = ''
// 	}

// 	console.log(this.dataset.status)
// 	if(this.value.length === 11) {
// 		this.closest('[data-status]').dataset.status = 'success'
// 		this.dataset.message = ''
		
// 	} else if(this.value.length > 0) {
// 		this.closest('[data-status]').dataset.status = 'error'
		
// 		const mess = document.createElement('div')
// 		mess.classList.add('message')
// 		mess.setAttribute('data-message', 'error')
// 		mess.textContent = 'Не меньше 5 символов!'
// 		this.dataset.message = 'error'
// 		this.closest('[data-status]').append(mess)
		
// 		setTimeout(() => {
// 			mess.remove()
// 		}, 2400)
// 	} else if(this.value.length <= 0) {
// 		this.placeholder = ''
// 	}
	
// }

// field.onfocus = function() {
// 	this.placeholder = '_ ___ ___ ____'
// }

// field.addEventListener('keydown', (event) => {
// 	const current = event.currentTarget
	
// 	if(current.value.length > 11) {
// 		current.value = current.value.slice(0, 11)
// 	}
	
// })
