"use strict";
// User - Booking(Pending) -> Payment(Unpaid) -> SSLCommers -> Booking update = Confirm -> Payment update = Paid
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOOKING_STATUS = void 0;
var BOOKING_STATUS;
(function (BOOKING_STATUS) {
    BOOKING_STATUS["PENDING"] = "PENDING";
    BOOKING_STATUS["CANCEL"] = "CANCEL";
    BOOKING_STATUS["COMPLETE"] = "COMPLETE";
    BOOKING_STATUS["FAIL"] = "FAIL";
})(BOOKING_STATUS || (exports.BOOKING_STATUS = BOOKING_STATUS = {}));
//# sourceMappingURL=booking.interface.js.map