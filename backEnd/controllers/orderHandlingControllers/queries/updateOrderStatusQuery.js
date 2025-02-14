const updateOrderStatus = `
    UPDATE OrderDocs
    SET orderStatus = @orderStatus
    WHERE OrderID = @OrderID
`;

module.exports = {
    updateOrderStatus
};