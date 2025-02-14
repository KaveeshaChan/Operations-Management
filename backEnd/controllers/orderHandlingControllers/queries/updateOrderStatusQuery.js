const updateOrderStatus = `
            SELECT documentData, documentName
            FROM FreightAgentAlloc_App.dbo.OrderDocs
            WHERE orderNumber = @orderNumber
`;

module.exports = {
    updateOrderStatus
};