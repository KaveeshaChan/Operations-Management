const addImportAirFreight = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, from, to, 
            shipmentReadyDate, deliveryTerm, Type, cargoType, numberOfPallets, chargeableWeight, 
            grossWeight, cargoCBM, LWHWithThePallet, productDescription, targetDate, documentDetails)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, @shipmentReadyDate, @deliveryTerm, 
            @Type, @cargoType, @numberOfPallets, @chargeableWeight, @grossWeight, @cargoCBM, LWHWithThePallet,  
            @productDescription, @targetDate, @documentDetails);
`;

const addImportLCL = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, from, to, 
            shipmentReadyDate, deliveryTerm, Type, numberOfPallets, palletCBM, cargoCBM,
            grossWeight, targetDate, productDescription, documentDetails)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, 
            @shipmentReadyDate, @deliveryTerm, @Type, @numberOfPallets, @palletCBM, @cargoCBM,
            @grossWeight, @targetDate, @productDescription, @documentDetails);
`;

const addImportFCL = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, from, to, 
            shipmentReadyDate, deliveryTerm, Type, numberOfContainers, productDescription, targetDate, documentDetails)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, 
            @shipmentReadyDate, @deliveryTerm, @Type, @numberOfContainers, @productDescription, @targetDate, @documentDetails);
`;

module.exports = {
    addImportAirFreight,
    addImportLCL,
    addImportFCL
};