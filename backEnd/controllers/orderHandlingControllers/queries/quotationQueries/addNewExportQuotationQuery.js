const addExportAirFreight = `
        INSERT INTO Order_Quotations (orderNumber, AgentID, netFreight, transShipmentPort, transitTime, 
            vesselOrFlightDetails, totalFreight, validityTime, airLine, AWB, HAWB, 
            createdBy)
        VALUES (@orderNumber, @AgentID, @netFreight, @transShipmentPort, @transitTime, @vesselOrFlightDetails, 
            @totalFreight, @validityTime, @airLine, @AWB, @HAWB, @createdBy);
`;

const addExportLCL = `
        INSERT INTO Order_Quotations (orderNumber, AgentID, transShipmentPort, transitTime, vesselOrFlightDetails, 
            validityTime, netFreight, totalFreight, createdBy)
        VALUES (@orderNumber, @AgentID, @transShipmentPort, @transitTime, @vesselOrFlightDetails, @validityTime, 
            @netFreight, @totalFreight, @createdBy);
`;

const addExportFCL = `
        INSERT INTO Order_Quotations (orderNumber, AgentID, netFreight, DTHC, freeTime, 
            transShipmentPort, carrier, transitTime, vesselOrFlightDetails, validityTime, createdBy)
        VALUES (@orderNumber, @AgentID, @netFreight, @DTHC, @freeTime, @transShipmentPort, 
            @carrier, @transitTime, @vesselOrFlightDetails, @validityTime, @createdBy);
`;

module.exports = {
    addExportAirFreight,
    addExportLCL,
    addExportFCL
};