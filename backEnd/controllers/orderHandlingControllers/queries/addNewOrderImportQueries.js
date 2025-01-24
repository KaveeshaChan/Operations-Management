const addImportAirFreight = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, [from], [to], 
            shipmentReadyDate, deliveryTerm, [Type], cargoType, numberOfPallets, chargeableWeight, 
            grossWeight, cargoCBM, LWHWithThePallet, productDescription, targetDate, additionalNotes, documentData, documentName)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, @shipmentReadyDate, @deliveryTerm, 
            @Type, @cargoType, @numberOfPallets, @chargeableWeight, @grossWeight, @cargoCBM, @LWHWithThePallet,  
            @productDescription, @targetDate, @additionalNotes, @documentData, @documentName);
`;

const addImportLCL = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, [from], [to], 
            shipmentReadyDate, deliveryTerm, Type, numberOfPallets, palletCBM, cargoCBM,
            grossWeight, targetDate, productDescription, additionalNotes, documentData, documentName)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, 
            @shipmentReadyDate, @deliveryTerm, @Type, @numberOfPallets, @palletCBM, @cargoCBM,
            @grossWeight, @targetDate, @productDescription, @additionalNotes, @documentData, @documentName);
`;

const addImportFCL = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, [from], [to], 
            shipmentReadyDate, deliveryTerm, [Type], numberOfContainers, productDescription, targetDate, additionalNotes, documentData, documentName)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, 
            @shipmentReadyDate, @deliveryTerm, @Type, @numberOfContainers, @productDescription, @targetDate, @additionalNotes, @documentData, @documentName);
`;

module.exports = {
    addImportAirFreight,
    addImportLCL,
    addImportFCL
};