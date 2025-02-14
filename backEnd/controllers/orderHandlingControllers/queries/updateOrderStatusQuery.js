const updateOrderStatus = `
    UPDATE OrderDocs
    SET orderStatus = @orderStatus
    WHERE orderID = @orderID
`;

module.exports = {
    updateOrderStatus
};