const updateExportAirFreight = `
UPDATE Order_Quotations
SET 
    AgentID = @AgentID,
    netFreight = @netFreight,
    AWB = @AWB,
    HAWB = @HAWB,
    airLine = @airLine,
    transShipmentPort = @transShipmentPort,
    transitTime = @transitTime,
    vesselOrFlightDetails = @vesselOrFlightDetails,
    validityTime = @validityTime,
    createdBy = @createdBy
WHERE OrderQuoteID = @OrderQuoteID;
`;

const updateExportLCL = `
UPDATE Order_Quotations
SET 
    AgentID = @AgentID,
    netFreight = @netFreight,
    totalFreight = @totalFreight,
    transShipmentPort = @transShipmentPort,
    transitTime = @transitTime,
    vesselOrFlightDetails = @vesselOrFlightDetails,
    validityTime = @validityTime,
    createdBy = @createdBy
WHERE OrderQuoteID = @OrderQuoteID;
`;

const updateExportFCL = `
UPDATE Order_Quotations
SET 
    AgentID = @AgentID,
    netFreight = @netFreight,
    DTHC = @DTHC,
    freeTime = @freeTime,
    transShipmentPort = @transShipmentPort,
    carrier = @carrier,
    transitTime = @transitTime,
    vesselOrFlightDetails = @vesselOrFlightDetails,
    validityTime = @validityTime,
    createdBy = @createdBy
WHERE OrderQuoteID = @OrderQuoteID;
`;

module.exports = {
    updateExportAirFreight,
    updateExportLCL,
    updateExportFCL
};