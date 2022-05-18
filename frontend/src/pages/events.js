import React, { Component, useState, useRef, useContext, useEffect } from 'react';
import Spinner from '../components/Spinner/Spinner';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList';


const EventsPage = () => {
    const [creating, setCreating] = useState(false);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const titleElRef = useRef(null);
    const priceElRef = useRef(null);
    const dateElRef = useRef(null);
    const descriptionElRef = useRef(null);
    const authContext = useContext(AuthContext);

    useEffect(()=> {     
        console.log('selectedEvent=>', selectedEvent != null)
     fetchEvents();
    }, [])

    const createHandler = () => {
        setCreating(true);
    }
    const modalCancelHandler = () => {
        setCreating(false);
        setSelectedEvent(null);
    }
    const modalConfirmHandler = () => {        
        const title = titleElRef.current.value;
        const price = parseFloat(priceElRef.current.value);
        const date = dateElRef.current.value;
        const description = descriptionElRef.current.value;
        console.log('price==>', typeof price);
        console.log('desc==>', description);
        /*if (title.trim().length === 0 || price > 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }*/
        const event = { title, price, date, description }
        console.log('event', event);
        const requestBody = {
            query: `
        mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date:"${date}"} ){
                _id
                title
                description
                price
                date                
            }
        }
        `
        }
        const token = authContext.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            if (res.status != 200 && res.status != 201) {
                throw new Error('Failed');                
            }
            return res.json()

        }).then((resData) => {
            console.log(resData);
            setEvents([...events, {
                _id: resData.data.createEvent._id,
                title: resData.data.createEvent.title,
                description: resData.data.createEvent.description,
                price: resData.data.createEvent.price,
                date: resData.data.createEvent.date,
                creator: {
                    _id: authContext.userId,                    
                }
            }])
            setCreating(false);
        })
        .catch((error) => {
            console.log(error)
            setCreating(false);
        })        
    }
    const fetchEvents = ()=> {
        setIsLoading(true);
        const requestBody = {
            query: `
        query {
            events {
                _id
                title
                description
                price
                date
                creator {
                    _id
                    email
                }
            }
        }
        `
        }
        const token = authContext.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'                
            }
        }).then((res) => {
            if (res.status != 200 && res.status != 201) {
                throw new Error('Failed');
            }
            return res.json()
        }).then((resData) => {
            const events = resData.data.events;
            setEvents(events);
            setIsLoading(false);
        })
        .catch((error) => {
            setIsLoading(false);
            console.log(error)
        })

    }
    const showDetailHandler= (data)=>{
        let getSelectedEventDetails = events.find(o => o._id === data);
        setSelectedEvent(getSelectedEventDetails)        
    }
    const modalBookingHandler = ()=>{
        const token = authContext.token;
        if (!token) {
            setSelectedEvent(null);
            return;
        } 
        const requestBody = {
            query: `
        mutation {
            bookEvent (eventId: "${selectedEvent._id}" ){
                _id
                createdAt
                updatedAt
            }
        }
        `
        }        
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`                
            }
        }).then((res) => {
            if (res.status != 200 && res.status != 201) {
                throw new Error('Failed');
            }
            return res.json()
        }).then((resData) => {
            console.log('Response Data=>', resData);            
            setSelectedEvent(null);
        })
        .catch((error) => {
            setIsLoading(false);
            console.log(error)
        })
    }
    return (        
        <React.Fragment>
            {(creating || selectedEvent != null) && <Backdrop />}
            {
                creating &&
                <Modal title="Add Event" canCancel canConfirm onCancel={modalCancelHandler} onConfirm={modalConfirmHandler} confirmText={'Confirm'}>
                    <form>
                        <div className='form-control'>
                            <label htmlFor='title'>Title</label>
                            <input type="text" id="title" ref={titleElRef} />
                        </div>
                        <div className='form-control'>
                            <label htmlFor='price'>Price</label>
                            <input type="number" id="price" ref={priceElRef} />
                        </div>
                        <div className='form-control'>
                            <label htmlFor='date'>Date</label>
                            <input type="datetime-local" id="date" ref={dateElRef} />
                        </div>
                        <div className='form-control'>
                            <label htmlFor='description'>Description</label>
                            <textarea id="description" rows="4" ref={descriptionElRef} />
                        </div>
                    </form>
                </Modal>
            }
            {
                selectedEvent != null && <Modal title="View Event" canCancel canConfirm onCancel={modalCancelHandler} onConfirm={modalBookingHandler} confirmText={ authContext.token ? 'Book' : 'Confirm'}>
                     <h1>{selectedEvent.title}</h1>
                     <h2>${selectedEvent.price}- {new Date(selectedEvent.date).toLocaleDateString()}</h2>
                     <p>{selectedEvent.description}</p>
                </Modal>
            }
            {authContext.token && (
                <div className="events-control">
                    <p>Share your Events!</p>
                    <button className="btn" onClick={createHandler}>Create Event</button>
                </div>
            )} 
            {
                isLoading ? <Spinner/> :<EventList events= {events} authUserId= {authContext.userId} onViewDetails={(data)=> showDetailHandler(data)}/>
            }                       
        </React.Fragment>
    )
}

export default EventsPage;