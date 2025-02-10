const addImportAirFreight = `
        INSERT INTO Order_Quotations (orderNumber, AgentID, airFreightCost, AWB, carrier, 
            transitTime, vesselOrFlightDetails, validityTime, totalFreight, createdBy)
        VALUES (@orderNumber, @AgentID, @airFreightCost, @AWB, @carrier, @transitTime, 
            @vesselOrFlightDetails, @validityTime, @totalFreight, @createdBy);
`;

const addImportLCL = `
        INSERT INTO Order_Quotations (orderNumber, AgentID, netFreight, transShipmentPort, transitTime, 
            vesselOrFlightDetails, freeTime, DOFee, validityTime, totalFreight, createdBy)
        VALUES (@orderNumber, @AgentID, @netFreight, @transShipmentPort, @transitTime, @vesselOrFlightDetails, 
            @freeTime, @DOFee, @validityTime, @totalFreight, @createdBy);
`;

const addImportFCL = `
        INSERT INTO Order_Quotations (orderNumber, AgentID, netFreight, DOFee, transShipmentPort, 
            freeTime, carrier, transitTime, vesselOrFlightDetails, validityTime, createdBy)
        VALUES (@orderNumber, @AgentID, @netFreight, @DOFee, @transShipmentPort, @freeTime, 
            @carrier, @transitTime, @vesselOrFlightDetails, @validityTime, @createdBy);
`;

module.exports = {
    addImportAirFreight,
    addImportLCL,
    addImportFCL
};