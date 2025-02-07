const fetchAgentID = `
        SELECT U.AgentID, 
                       CASE WHEN FA.AgentStatus = 'Active' THEN 1 ELSE 0 END AS IsActive
                FROM Users U 
                LEFT JOIN Freight_Agents FA ON U.AgentID = FA.AgentID
                WHERE U.UserID = @UserID;
`;

const retrieveOrders = `
            SELECT OrderID, orderType, shipmentType, orderNumber, [from], [to], shipmentReadyDate, 
                   deliveryTerm, cargoType, Type, numberOfPallets, numberOfContainers, LWHWithThePallet, 
                   palletCBM, cargoCBM, grossWeight, chargeableWeight, targetDate, additionalNotes, 
                   productDescription, documentName, orderCreatedDate, orderStatus, createdBy, dueDate
            FROM FreightAgentAlloc_App.dbo.OrderDocs;
`;

const fetchDocumentData = `
            SELECT documentData, documentName
            FROM FreightAgentAlloc_App.dbo.OrderDocs
            WHERE orderNumber = @orderNumber
`;

module.exports = {
    fetchAgentID,
    retrieveOrders,
    fetchDocumentData
};