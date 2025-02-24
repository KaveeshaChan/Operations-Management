const viewQuotationForOrder = `
SELECT oq.[OrderQuoteID],
       oq.[orderNumber],
	   oq.[AgentID],
       fa.[Freight_Agent] AS Agent,  -- Fetch Freight_Agent name
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
       fc.[Coordinator_Name] AS createdUser  -- Fetch Coordinator_Name
FROM [FreightAgentAlloc_App].[dbo].[Order_Quotations] oq
LEFT JOIN [FreightAgentAlloc_App].[dbo].[Freight_Agents] fa 
    ON oq.[AgentID] = fa.[AgentID]  -- Join to get Freight_Agent

LEFT JOIN [FreightAgentAlloc_App].[dbo].[Users] u 
    ON oq.[createdBy] = u.[UserID]  -- Join to get Email

LEFT JOIN [FreightAgentAlloc_App].[dbo].[FA_Coordinators] fc 
    ON u.[Email] = fc.[Email]  -- Join to get Coordinator_Name

WHERE oq.[orderNumber] = @orderNumber;
`;

const selectQuoteForOrder = `
    BEGIN TRANSACTION;
    
    INSERT INTO [FreightAgentAlloc_App].[dbo].[orderSelectedForwarders] (orderNumber, OrderQuoteID)
    VALUES (@orderNumber, @OrderQuoteID);
    
    UPDATE [FreightAgentAlloc_App].[dbo].[OrderDocs]
    SET orderStatus = 'completed'
    WHERE orderNumber = @orderNumber;
    
    COMMIT TRANSACTION;
`;

// SELECT 
//     od.OrderID, 
//     od.orderType, 
//     od.shipmentType, 
//     od.orderNumber, 
//     od.[from], 
//     od.[to], 
//     od.shipmentReadyDate, 
//     od.deliveryTerm, 
//     od.cargoType, 
//     od.Type, 
//     od.numberOfPallets, 
//     od.numberOfContainers, 
//     od.LWHWithThePallet, 
//     od.palletCBM, 
//     od.cargoCBM, 
//     od.grossWeight, 
//     od.chargeableWeight, 
//     od.targetDate, 
//     od.additionalNotes, 
//     od.productDescription, 
//     od.documentName, 
//     od.orderCreatedDate, 
//     od.orderStatus, 
//     od.createdBy, 

//     -- Calculate the actual due date
//     DATEADD(DAY, od.dueDate, od.orderCreatedDate) AS actualDueDate,

//     -- OrderQuoteID from orderSelectedForwarders
//     osf.OrderQuoteID,

//     -- Order_Quotations details
//     oq.AgentID,
//     oq.[netFreight],
//     oq.[DTHC],
//     oq.[netFreightPerContainer],
// 	oq.[freeTime],
// 	oq.[transShipmentPort],
// 	oq.[carrier],
// 	oq.[transitTime],
//     oq.[vesselOrFlightDetails],
//     oq.[totalFreight],
//     oq.[validityTime],
//     oq.[airLine],
//     oq.[AWB],
//     oq.[HAWB],
//     oq.[airFreightCost],
//     oq.[DOFee],
//     oq.[quotationCreatedDate],
//     oq.[createdBy]

// FROM FreightAgentAlloc_App.dbo.OrderDocs od
// LEFT JOIN FreightAgentAlloc_App.dbo.orderSelectedForwarders osf 
//     ON od.orderNumber = osf.orderNumber  -- Get OrderQuoteID from selected forwarders

// LEFT JOIN FreightAgentAlloc_App.dbo.Order_Quotations oq
//     ON osf.OrderQuoteID = oq.OrderQuoteID  -- Get details from Order_Quotations

// WHERE od.orderStatus = 'completed'
// GROUP BY 
//     od.OrderID, od.orderType, od.shipmentType, od.orderNumber, od.[from], od.[to], 
//     od.shipmentReadyDate, od.deliveryTerm, od.cargoType, od.Type, od.numberOfPallets, 
//     od.numberOfContainers, od.LWHWithThePallet, od.palletCBM, od.cargoCBM, 
//     od.grossWeight, od.chargeableWeight, od.targetDate, od.additionalNotes, 
//     od.productDescription, od.documentName, od.orderCreatedDate, od.orderStatus, 
//     od.createdBy, od.dueDate, osf.OrderQuoteID, oq.AgentID, oq.[netFreight],
//     oq.[DTHC], oq.[netFreightPerContainer],	oq.[freeTime], oq.[transShipmentPort],
// 	oq.[carrier], oq.[transitTime], oq.[vesselOrFlightDetails], oq.[totalFreight],
//     oq.[validityTime], oq.[airLine], oq.[AWB], oq.[HAWB], oq.[airFreightCost],
//     oq.[DOFee], oq.[quotationCreatedDate], oq.[createdBy];

module.exports = {
    viewQuotationForOrder,
    selectQuoteForOrder
};