
const Event = require('../../models/event');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date');

const transformEvent = (event)=> { 
    return {
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: user.bind(this,event.creator)
    }
  }

const events = async (eventIds)=> {
    try {
      let events =await Event.find({id: {$in: eventIds}});
     return events.map((event)=> {
          return transformEvent(event)
      })
    }catch(error) {
    throw new Error(error);
    }   
  }
  
  const singleEvent = async(eventId)=> {
      try {
        let event = await Event.findById(eventId);    
        return transformEvent(event);
      } catch(error) {
        throw new Error(error);
      }
  }
  
  const user = async (userID)=> {
    try {
      let user = await User.findById(userID);    
      return {...user._doc, _id: user.id, createdEvents: events.bind(this,user._doc.createdEvents)};
    } catch(error) {
       throw new Error(error);
    }
  }

  exports.events = events;
  exports.singleEvent = singleEvent;
  exports.user = user;