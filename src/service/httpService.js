import axios from "axios"

const client = axios.create({
    baseURL: 'http://localhost:30000/'
});


const getSeats = (cinema) => {

    return client({
        method: 'GET',
        url: `/seating/${cinema}`,        
    })
    .then(response => response.data)
    .catch(error => console.log(error));
}

const holdSeat = (seat) => {

    return client({
        method: 'POST',
        url: `/seating/hold`,  
        data: seat      
    })
    .then(response => response.data)
    .catch(error => console.log(error));
}

const releaseSeat = (seat) => {

    return client({
        method: 'POST',
        url: `/seating/release`,  
        data: seat      
    })
    .then(response => response.data)
    .catch(error => console.log(error));
}

const processPayment = (payment) => {
    return client({
        method: 'POST',
        url: `/seating/purchase`,  
        data: payment
    })
    .then(response => response.data)
    .catch(error => console.log(error));
}

export const HttpService = {
    getSeats,
    holdSeat,
    releaseSeat,
    processPayment
}