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

module.exports = {
    viewQuotationForOrder,
    selectQuoteForOrder
};