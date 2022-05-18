const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const bcrypt = require('bcryptjs');
const {dateToString} = require('../../helpers/date');
const authResolver =require('./auth');
const bookingResolver =require('./booking');
const eventsResolver =require('./events');

const rootResolver = {
  ...authResolver,
  ...bookingResolver,
  ...eventsResolver
}
module.exports = rootResolver;