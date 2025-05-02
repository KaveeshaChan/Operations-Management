const updateImportAirFreight = `
UPDATE Order_Quotations
SET 
    AgentID = @AgentID,
    airFreightCost = @airFreightCost,
    AWB = @AWB,
    carrier = @carrier,
    transitTime = @transitTime,
    vesselOrFlightDetails = @vesselOrFlightDetails,
    validityTime = @validityTime,
    createdBy = @createdBy
WHERE OrderQuoteID = @OrderQuoteID;
`;

const updateImportLCL = `
UPDATE Order_Quotations
SET 
    AgentID = @AgentID,
    netFreight = @netFreight,
    transShipmentPort = @transShipmentPort,
    transitTime = @transitTime,
    vesselOrFlightDetails = @vesselOrFlightDetails,
    freeTime = @freeTime,
    DOFee = @DOFee,
    validityTime = @validityTime,
    totalFreight = @totalFreight,
    createdBy = @createdBy
WHERE OrderQuoteID = @OrderQuoteID;
`;

const updateImportFCL = `
UPDATE Order_Quotations
SET 
    AgentID = @AgentID,
    netFreight = @netFreight,
    DOFee = @DOFee,
    transShipmentPort = @transShipmentPort,
    freeTime = @freeTime,
    carrier = @carrier,
    transitTime = @transitTime,
    vesselOrFlightDetails = @vesselOrFlightDetails,
    validityTime = @validityTime,
    createdBy = @createdBy
WHERE OrderQuoteID = @OrderQuoteID;
`;

module.exports = {
    updateImportAirFreight,
    updateImportLCL,
    updateImportFCL
};