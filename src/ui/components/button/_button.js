// module.exports = {
//     handlers: [
//         {
//             target: '.button',
//             event: 'click',
//             action: async (event) => {
//                 await new Promise( async (resolve, reject) => {
//                     await setTimeout(() => {
//                         console.log(`Handler bfore`)
//                     }, 1000)
//                     resolve(`Hi, i'm is handler 1!`)
//                 })
//                 .then((data) => {
//                     setTimeout(() => {
//                         console.log(data)
//                     }, 1000)
//                 })
//                 .then(() => {
//                     console.log("Handler after")
//                 })
//             },
//         },
//         {
//             target: '.button',
//             event: 'click',
//             action: (event) => setTimeout(() => {console.log(`Hi, i'm is handler 2!`)}, 500)
//         },
//         {
//             target: '.button',
//             event: 'click',
//             action: (event) => console.log(`Hi, i'm is handler 3!`)
//         }
//     ]
// }
