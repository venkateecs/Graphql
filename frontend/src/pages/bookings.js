import React, { Component, useEffect, useState, useContext } from 'react';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList.js'

function BookingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const authContext = useContext(AuthContext);
    useEffect(() => {
        fetchBookedEvents();
    }, [])
    const fetchBookedEvents = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
    query {
        bookings {
            _id
            createdAt
            updatedAt
            event {
            title
            description
            price
            }
        }
    }`
        }
        const token = authContext.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        }).then((res) => {
            if (res.status != 200 && res.status != 201) {
                throw new Error('Failed');
            }
            return res.json()
        }).then((resData) => {
            setBookings(resData.data.bookings)
            setIsLoading(false);
        })
            .catch((error) => {
                setIsLoading(false);
                console.log(error)
            })

    }
    const deleteBookingHandler = (bookingID) => {
        console.log('bookingID=>', bookingID);
        setIsLoading(true);
        const requestBody = {
            query: `
                mutation {
                    cancelBooking(bookingId: "${bookingID}") {
                        _id
                        title
                    }
                }`
        }
        const token = authContext.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        }).then((res) => {
            if (res.status != 200 && res.status != 201) {
                throw new Error('Failed');
            }
            return res.json()
        }).then((resData) => {
            const getBookings = [...bookings];
            const updatedBookings = getBookings.filter((data)=> {
               return data._id != bookingID;
            })
            setBookings(updatedBookings);
            setIsLoading(false);
        })
            .catch((error) => {
                setIsLoading(false);
                console.log(error)
            })

    }
    return (
        <React.Fragment>
            {isLoading ? <Spinner /> : <BookingList bookings={bookings} onDelete={deleteBookingHandler} />}
        </React.Fragment>
    )
}

export default BookingsPage;