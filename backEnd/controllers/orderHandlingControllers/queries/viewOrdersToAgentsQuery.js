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
    ON od.orderNumber = q.orderNumber

WHERE od.orderStatus = @orderStatus
GROUP BY 
    od.OrderID, od.orderType, od.shipmentType, od.orderNumber, od.[from], od.[to], 
    od.shipmentReadyDate, od.deliveryTerm, od.cargoType, od.Type, od.numberOfPallets, 
    od.numberOfContainers, od.LWHWithThePallet, od.palletCBM, od.cargoCBM, 
    od.grossWeight, od.chargeableWeight, od.targetDate, od.additionalNotes, 
    od.productDescription, od.documentName, od.orderCreatedDate, od.orderStatus, 
    od.createdBy, od.dueDate;
`;

const retrieveInPtogressOrders = `
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
    COUNT(q.OrderQuoteID) AS quotationCount,

    -- Check if a quote exists for the given AgentID
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM FreightAgentAlloc_App.dbo.Order_Quotations oq
            WHERE oq.orderNumber = od.orderNumber 
            AND oq.AgentID = @AgentID
        ) THEN 'Yes' 
        ELSE 'No' 
    END AS alreadyQuoted

FROM FreightAgentAlloc_App.dbo.OrderDocs od
LEFT JOIN FreightAgentAlloc_App.dbo.Order_Quotations q 
    ON od.orderNumber = q.orderNumber

WHERE od.orderStatus = @orderStatus
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

const retrieveCompletedOrders = `
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
    od.[Type], 
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

    -- Calculate the actual due date
    DATEADD(DAY, od.dueDate, od.orderCreatedDate) AS actualDueDate,

    -- OrderQuoteID from orderSelectedForwarders
    osf.OrderQuoteID,

    -- Order_Quotations details
    oq.AgentID,
    fa.Freight_Agent,
    oq.[netFreight],
    oq.[DTHC],
    oq.[netFreightPerContainer],
	oq.[freeTime],
	oq.[transShipmentPort],
	oq.[carrier],
	oq.[transitTime],
    oq.[vesselOrFlightDetails],
    oq.[totalFreight],
    oq.[validityTime],
    oq.[airLine],
    oq.[AWB],
    oq.[HAWB],
    oq.[airFreightCost],
    oq.[DOFee],
    oq.[quotationCreatedDate],
    oq.[createdBy]

FROM FreightAgentAlloc_App.dbo.OrderDocs od
LEFT JOIN FreightAgentAlloc_App.dbo.orderSelectedForwarders osf 
    ON od.orderNumber = osf.orderNumber  -- Get OrderQuoteID from selected forwarders

LEFT JOIN FreightAgentAlloc_App.dbo.Order_Quotations oq
    ON osf.OrderQuoteID = oq.OrderQuoteID  -- Get details from Order_Quotations

LEFT JOIN FreightAgentAlloc_App.dbo.Freight_Agents fa
    ON oq.AgentID = fa.AgentID --Get details Freight_Agents

WHERE od.orderStatus = @orderStatus
GROUP BY 
    od.OrderID, od.orderType, od.shipmentType, od.orderNumber, od.[from], od.[to], 
    od.shipmentReadyDate, od.deliveryTerm, od.cargoType, od.Type, od.numberOfPallets, 
    od.numberOfContainers, od.LWHWithThePallet, od.palletCBM, od.cargoCBM, 
    od.grossWeight, od.chargeableWeight, od.targetDate, od.additionalNotes, 
    od.productDescription, od.documentName, od.orderCreatedDate, od.orderStatus, 
    od.createdBy, od.dueDate, osf.OrderQuoteID, oq.AgentID, oq.[netFreight],
    oq.[DTHC], oq.[netFreightPerContainer],	oq.[freeTime], oq.[transShipmentPort],
	oq.[carrier], oq.[transitTime], oq.[vesselOrFlightDetails], oq.[totalFreight],
    oq.[validityTime], oq.[airLine], oq.[AWB], oq.[HAWB], oq.[airFreightCost],
    oq.[DOFee], oq.[quotationCreatedDate], oq.[createdBy],fa.Freight_Agent;

`;

const retrieveCancelledOrders = `
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
    od.[Type], 
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
    od.cancelledReason,
    od.cancelledBy,

    -- Calculate the actual due date
    DATEADD(DAY, od.dueDate, od.orderCreatedDate) AS actualDueDate,

    -- OrderQuoteID from orderSelectedForwarders
    osf.OrderQuoteID,

    -- Order_Quotations details
    oq.AgentID,
    fa.Freight_Agent,
    oq.[netFreight],
    oq.[DTHC],
    oq.[netFreightPerContainer],
	oq.[freeTime],
	oq.[transShipmentPort],
	oq.[carrier],
	oq.[transitTime],
    oq.[vesselOrFlightDetails],
    oq.[totalFreight],
    oq.[validityTime],
    oq.[airLine],
    oq.[AWB],
    oq.[HAWB],
    oq.[airFreightCost],
    oq.[DOFee],
    oq.[quotationCreatedDate],
    oq.[createdBy],

    -- Get the cancelledBy name based on RoleID
    CASE 
        WHEN u.RoleID = 1 THEN 'Admin' 
        WHEN u.RoleID = 2 THEN mu.MainUserName 
        ELSE 'Unknown'
    END AS cancelledByName

FROM FreightAgentAlloc_App.dbo.OrderDocs od
LEFT JOIN FreightAgentAlloc_App.dbo.orderSelectedForwarders osf 
    ON od.orderNumber = osf.orderNumber  -- Get OrderQuoteID from selected forwarders

LEFT JOIN FreightAgentAlloc_App.dbo.Order_Quotations oq
    ON osf.OrderQuoteID = oq.OrderQuoteID  -- Get details from Order_Quotations

LEFT JOIN FreightAgentAlloc_App.dbo.Freight_Agents fa
    ON oq.AgentID = fa.AgentID -- Get details Freight_Agents

-- Join Users table to get RoleID
LEFT JOIN FreightAgentAlloc_App.dbo.Users u
    ON od.cancelledBy = u.UserID 

-- Join Main_Users table to get MainUserName using Email
LEFT JOIN FreightAgentAlloc_App.dbo.Main_Users mu
    ON u.Email = mu.Email

WHERE od.orderStatus = @orderStatus
GROUP BY 
    od.OrderID, od.orderType, od.shipmentType, od.orderNumber, od.[from], od.[to], 
    od.shipmentReadyDate, od.deliveryTerm, od.cargoType, od.Type, od.numberOfPallets, 
    od.numberOfContainers, od.LWHWithThePallet, od.palletCBM, od.cargoCBM, 
    od.grossWeight, od.chargeableWeight, od.targetDate, od.additionalNotes, 
    od.productDescription, od.documentName, od.orderCreatedDate, od.orderStatus, 
    od.createdBy, od.dueDate, od.cancelledReason, od.cancelledBy, 
    osf.OrderQuoteID, oq.AgentID, oq.[netFreight],
    oq.[DTHC], oq.[netFreightPerContainer], oq.[freeTime], oq.[transShipmentPort],
	oq.[carrier], oq.[transitTime], oq.[vesselOrFlightDetails], oq.[totalFreight],
    oq.[validityTime], oq.[airLine], oq.[AWB], oq.[HAWB], oq.[airFreightCost],
    oq.[DOFee], oq.[quotationCreatedDate], oq.[createdBy], fa.Freight_Agent, 
    u.RoleID, mu.MainUserName;
`;

const fetchDocumentData = `
            SELECT documentData, documentName
            FROM FreightAgentAlloc_App.dbo.OrderDocs
            WHERE orderNumber = @orderNumber
`;

const retrieveCompletedOrdersForAgent = `
SELECT	osf.orderNumber,
		osf.OrderQuoteID,
		oq.netFreight,
		oq.DTHC,
		oq.netFreightPerContainer,
		oq.freeTime,
		oq.transShipmentPort,
		oq.carrier,
		oq.transitTime,
		oq.vesselOrFlightDetails,
		oq.totalFreight,
		oq.validityTime,
		oq.airLine,
		oq.AWB,
		oq.HAWB,
		oq.airFreightCost,
		oq.DOFee,
		oq.quotationCreatedDate,
		od.orderType,
		od.shipmentType, 
		od.[from], 
		od.[to], 
		od.shipmentReadyDate, 
		od.deliveryTerm, 
		od.cargoType, 
		od.[Type], 
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
		od.orderCreatedDate,
		od.orderStatus, 
		od.createdBy
FROM [FreightAgentAlloc_App].[dbo].[orderSelectedForwarders] osf
JOIN [FreightAgentAlloc_App].[dbo].[Order_Quotations] oq
    ON osf.OrderQuoteID = oq.OrderQuoteID

LEFT JOIN FreightAgentAlloc_App.dbo.OrderDocs od
	ON od.orderNumber = osf.orderNumber

WHERE oq.AgentID = @AgentID;
`;

const retrieveOrderWithOrderNumber = `
SELECT  
    orderType, 
    shipmentType,
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
    productDescription

FROM FreightAgentAlloc_App.dbo.OrderDocs

where orderNumber = @orderNumber
`;

const orderCounts = `  
    SELECT COUNT (OrderID) as allOrders,
        COUNT (CASE WHEN orderStatus = 'active' THEN 1 END) AS allActiveOrders,
        COUNT (CASE WHEN orderStatus = 'pending' THEN 1 END) AS allPendingOrders,
        COUNT (CASE WHEN orderStatus = 'completed' THEN 1 END) AS allCompletedOrders,
        COUNT (CASE WHEN orderStatus = 'cancelled' THEN 1 END) AS allCancelledOrders,
		COUNT(CASE WHEN shipmentType = 'airFreight' AND orderType = 'import' THEN 1 END) AS allImportAF,
		COUNT(CASE WHEN shipmentType = 'lcl' AND orderType = 'import' THEN 1 END) AS allImportLCL,
		COUNT(CASE WHEN shipmentType = 'fcl' AND orderType = 'import' THEN 1 END) AS allImportFCL,
		COUNT(CASE WHEN shipmentType = 'airFreight' AND orderType = 'export' THEN 1 END) AS allExportAF,
		COUNT(CASE WHEN shipmentType = 'lcl' AND orderType = 'export' THEN 1 END) AS allExportLCL,
		COUNT(CASE WHEN shipmentType = 'fcl' AND orderType = 'export' THEN 1 END) AS allExportFCL
            FROM OrderDocs
                    `;

module.exports = {
    fetchAgentID,
    retrieveOrders,
    fetchDocumentData,
    retrieveOrderWithOrderID,
    retrieveCompletedOrders,
    retrieveInPtogressOrders,
    retrieveCancelledOrders,
    retrieveCompletedOrdersForAgent,
    retrieveOrderWithOrderNumber,
    orderCounts
};