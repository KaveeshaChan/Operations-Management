const addImportAirFreight = `
        INSERT INTO Order_Quotations (orderNumber, AgentID, airFreightCost, AWB, carrier, 
            transitTime, vesselOrFlightDetails, validityTime, totalFreight, createdBy)
        VALUES (@orderNumber, @AgentID, @airFreightCost, @AWB, @carrier, @transitTime, 
            @vesselOrFlightDetails, @validityTime, @totalFreight, @createdBy);
`;

const addImportLCL = `
        INSERT INTO Order_Quotations (orderNumber, AgentID, transShipmentPort, transitTime, vesselOrFlightDetails, 
            validityTime, netFreight, totalFreight, createdBy)
        VALUES (@orderNumber, @AgentID, @transShipmentPort, @transitTime, @vesselOrFlightDetails, @validityTime, 
            @netFreight, @totalFreight, @createdBy);
`;

const addImportFCL = `
        INSERT INTO Order_Quotations (orderNumber, AgentID, netFreight, DTHC, freeTime, 
            transShipmentPort, carrier, transitTime, vesselOrFlightDetails, validityTime, createdBy)
        VALUES (@orderNumber, @AgentID, @netFreight, @DTHC, @freeTime, @transShipmentPort, 
            @carrier, @transitTime, @vesselOrFlightDetails, @validityTime, @createdBy);
`;

module.exports = {
    addImportAirFreight,
    addImportLCL,
    addImportFCL
};