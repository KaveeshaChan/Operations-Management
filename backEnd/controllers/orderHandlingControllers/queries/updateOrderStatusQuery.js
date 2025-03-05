const updateOrderStatus = `
    UPDATE OrderDocs
    SET orderStatus = @orderStatus
    WHERE OrderID = @OrderID
`;

const addToCancelOrder = `
UPDATE OrderDocs
SET orderStatus = @orderStatus,
    cancelledReason = @cancelledReason,
    cancelledBy = @cancelledBy
WHERE OrderID = @OrderID;

SELECT @OrderNumber = orderNumber
FROM OrderDocs
WHERE OrderID = @OrderID;
`;

module.exports = {
    updateOrderStatus,
    addToCancelOrder
};