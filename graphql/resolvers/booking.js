const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const {dateToString} = require('../../helpers/date');
const {user, events, singleEvent} = require('./merge');


const transformEvent = (event)=> { 
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this,event.creator)
  }
}
const transformBooking = (booking)=> {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this,booking._doc.event),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt),
  }
}
module.exports = {
    bookings: async(args,req)=>{
      try {
        console.log('args==>', args.userId);
        console.log('req==>', req.userId);
      const bookings = await Booking.find({user: req.userId});
       return bookings.map((booking)=> {
         return transformBooking(booking)
        })
      }catch(error){
       throw new Error(error);
      }
    },
    bookEvent: async(args, req)=> {      
      try {
        const fetchedEvent = await Event.findOne({_id: args.eventId });
        const booking =new Booking({
          user: req.userId,
          event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
      } catch(err) {
         throw new Error(err);
      }
    },
    cancelBooking: async(args)=> {
      try {
        const booking = await Booking.findById(args.bookingId).populate('event');
        const event = transformEvent(booking.event);
         await Booking.deleteOne({_id: args.bookingId})
        return event;
      } catch(err){
         throw new Error(err);
      }
    }
  }