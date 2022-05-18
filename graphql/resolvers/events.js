const Event = require('../../models/event');
const User = require('../../models/user');
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

module.exports = {
    events:async ()=>{
      try {
        let events = await Event.find();
        return events.map((event)=> {          
           return transformEvent(event);
        })
      } catch(error) {
        throw new Error(error);
      }      
    },
    createEvent:async(args, req)=> {
      if (!req.isAuth) {
        throw new Error('Unauthenticated');
      }
      try {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: req.userId
        })
        let user = await User.findById(req.userId);
        if (user) {
          user.createdEvents.push(event);
          let userResult = await user.save();
          let result = await event.save();
          return transformEvent(result);
        } else {
         throw new Error('User is not available')
        }
      } catch(error) {
        throw new Error(error);
      }       
    },
  }