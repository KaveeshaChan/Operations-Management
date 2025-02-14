const fetchAgentID = `
        SELECT U.AgentID, 
                       CASE WHEN FA.AgentStatus = 'Active' THEN 1 ELSE 0 END AS IsActive
                FROM Users U 
                LEFT JOIN Freight_Agents FA ON U.AgentID = FA.AgentID
                WHERE U.UserID = @UserID;
`;

const retrieveOrders = `
SELECT 
    od.OrderID, 
    od.orderType, 
    od.shipmentType, 
    od.orderNumber, 
    od.[from], 
    od.[to], 
    od.shipmentReadyDate, 
    od.deliveryTerm, 
    od.cargoType, 
    od.Type, 
    od.numberOfPallets, 
    od.numberOfContainers, 
    od.LWHWithThePallet, 
    od.palletCBM, 
    od.cargoCBM, 
    od.grossWeight, 
    od.chargeableWeight, 
    od.targetDate, 
    od.additionalNotes, 
    od.productDescription, 
    od.documentName, 
    od.orderCreatedDate, 
    od.orderStatus, 
    od.createdBy, 
    od.dueDate,

    -- Calculate the actual due date
    DATEADD(DAY, od.dueDate, od.orderCreatedDate) AS actualDueDate,

    -- Calculate remaining days before due date
    DATEDIFF(DAY, GETUTCDATE(), DATEADD(DAY, od.dueDate, od.orderCreatedDate)) AS daysRemaining,

    -- Count how many quotations exist for each order
    COUNT(q.OrderQuoteID) AS quotationCount

FROM FreightAgentAlloc_App.dbo.OrderDocs od
LEFT JOIN FreightAgentAlloc_App.dbo.Order_Quotations q 
    ON od.orderNumber = q.orderNumber  -- Assuming orderNumber is the link between the tables

WHERE od.orderStatus = COALESCE(@status, 'active')
GROUP BY 
    od.OrderID, od.orderType, od.shipmentType, od.orderNumber, od.[from], od.[to], 
    od.shipmentReadyDate, od.deliveryTerm, od.cargoType, od.Type, od.numberOfPallets, 
    od.numberOfContainers, od.LWHWithThePallet, od.palletCBM, od.cargoCBM, 
    od.grossWeight, od.chargeableWeight, od.targetDate, od.additionalNotes, 
    od.productDescription, od.documentName, od.orderCreatedDate, od.orderStatus, 
    od.createdBy, od.dueDate;

`;

const retrieveOrderWithOrderID = `
SELECT 
    OrderID, 
    orderType, 
    shipmentType, 
    orderNumber, 
    [from], 
    [to], 
    shipmentReadyDate, 
    deliveryTerm, 
    cargoType, 
    Type, 
    numberOfPallets, 
    numberOfContainers, 
    LWHWithThePallet, 
    palletCBM, 
    cargoCBM, 
    grossWeight, 
    chargeableWeight, 
    targetDate, 
    additionalNotes, 
    productDescription, 
    documentName, 
    orderCreatedDate, 
    orderStatus, 
    createdBy, 
    dueDate,
    
    -- Calculate the actual due date
    DATEADD(DAY, dueDate, orderCreatedDate) AS actualDueDate,

    -- Calculate remaining days before due date
    DATEDIFF(DAY, GETUTCDATE(), DATEADD(DAY, dueDate, orderCreatedDate)) AS daysRemaining

FROM FreightAgentAlloc_App.dbo.OrderDocs

where OrderID = @OrderID
`;

const fetchDocumentData = `
            SELECT documentData, documentName
            FROM FreightAgentAlloc_App.dbo.OrderDocs
            WHERE orderNumber = @orderNumber
`;

module.exports = {
    fetchAgentID,
    retrieveOrders,
    fetchDocumentData,
    retrieveOrderWithOrderID
};