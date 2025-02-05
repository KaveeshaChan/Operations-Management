const addExportAirFreight = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, [from], [to], 
            shipmentReadyDate, deliveryTerm, [Type], cargoType, numberOfPallets, chargeableWeight, 
            grossWeight, cargoCBM, targetDate, additionalNotes, documentData, documentName, createdBy, dueDate)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, @shipmentReadyDate, 
            @deliveryTerm, @Type, @cargoType, @numberOfPallets, @chargeableWeight, @grossWeight, @cargoCBM, @targetDate,
            @additionalNotes, @documentData, @documentName, @createdBy, @dueDate);
`;

const addExportLCL = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, [from], [to], 
            shipmentReadyDate, deliveryTerm, [Type], numberOfPallets, palletCBM, cargoCBM,
            grossWeight, targetDate, additionalNotes, documentData, documentName, createdBy, dueDate)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, 
            @shipmentReadyDate, @deliveryTerm, @Type, @numberOfPallets, @palletCBM, @cargoCBM,
            @grossWeight, @targetDate, @additionalNotes, @documentData, @documentName, @createdBy, @dueDate);
`;

const addExportFCL = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, [from], [to], 
            shipmentReadyDate, deliveryTerm, Type, numberOfContainers, targetDate, additionalNotes, documentData, documentName, createdBy, dueDate)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, 
            @shipmentReadyDate, @deliveryTerm, @Type, @numberOfContainers, @targetDate, @additionalNotes, @documentData, @documentName, @createdBy, @dueDate);
`;

module.exports = {
    addExportAirFreight,
    addExportLCL,
    addExportFCL
};