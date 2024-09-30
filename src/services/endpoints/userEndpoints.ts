const userRoutes={
    

    signup:'/user/register',
    login:'/user/login',
    verify_otp:'/user/verify-otp',
    resendOtp:'/user/verify',
    Gsignup:'/user/Gsignup',
    forgetPass:'/user/forgetPass',
    verify_Forgetotp:"/user/verifyForgetOtp",
    changePass:"/user/changePass",
    addRoom:"/user/addRoom",
    fetchRoomsById:"/user/myRooms",
    fetchRoomById:"/user/Room",
    editRoom:"/user/editRoom",
    fetchAllRooms:"/user/fetchAllRooms",
    editUser:"/user/editUser",
    fetchNearestRooms:"/user/fetchNearestRooms",
    bookRoom:"/user/bookRoom",
    logOut:"/user/logOut",
    fetchBookings:"/user/getbookings",
    changePassword:"/user/changePassword",
    fetchWallet:"/user/fetchWallet",
    postReview:"/user/postReview",
    fetchReviews:"/user/fetchReviews",
    postMessage:"/user/addMessage",
    fetchPrevMsgs:"/user/fetchMessages",
    fetchContacts:"/user/fetchContacts",
    fetchOwnerDetails:"/user/fetchOwnerDetails",
    cancelBooking:"/user/cancelBooking",
    checkBookingValid:"/user/checkBookingValid",
    bookRoomWallet:"/user/walletRoomBooking"
    
}

export default userRoutes 