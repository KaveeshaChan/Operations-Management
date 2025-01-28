const addExportAirFreight = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, [from], [to], 
            shipmentReadyDate, deliveryTerm, [Type], cargoType, numberOfPallets, chargeableWeight, 
            grossWeight, cargoCBM, targetDate, additionalNotes, documentData, documentName, createdBy)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, @shipmentReadyDate, 
            @deliveryTerm, @Type, @cargoType, @numberOfPallets, @chargeableWeight, @grossWeight, @cargoCBM, @targetDate,
            @additionalNotes, @documentData, @documentName, @createdBy);
`;

const addExportLCL = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, [from], [to], 
            shipmentReadyDate, deliveryTerm, [Type], numberOfPallets, palletCBM, cargoCBM,
            grossWeight, targetDate, additionalNotes, documentData, documentName, createdBy)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, 
            @shipmentReadyDate, @deliveryTerm, @Type, @numberOfPallets, @palletCBM, @cargoCBM,
            @grossWeight, @targetDate, @additionalNotes, @documentData, @documentName, @createdBy);
`;

const addExportFCL = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, [from], [to], 
            shipmentReadyDate, deliveryTerm, Type, numberOfContainers, targetDate, additionalNotes, documentData, documentName, createdBy)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, 
            @shipmentReadyDate, @deliveryTerm, @Type, @numberOfContainers, @targetDate, @additionalNotes, @documentData, @documentName, @createdBy);
`;

module.exports = {
    addExportAirFreight,
    addExportLCL,
    addExportFCL
};