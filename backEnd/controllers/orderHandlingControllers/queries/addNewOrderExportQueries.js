const addExportAirFreight = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, from, to, 
            shipmentReadyDate, deliveryTerm, Type, cargoType, numberOfPallets, chargeableWeight, 
            grossWeight, cargoCBM, targetDate, documentDetails)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, @shipmentReadyDate, 
            @deliveryTerm, @Type, @cargoType, @numberOfPallets, @chargeableWeight, @grossWeight, @cargoCBM, @targetDate, @documentDetails);
`;

const addExportLCL = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, from, to, 
            shipmentReadyDate, deliveryTerm, Type, numberOfPallets, palletCBM, cargoCBM,
            grossWeight, targetDate, documentDetails)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, 
            @shipmentReadyDate, @deliveryTerm, @Type, @numberOfPallets, @palletCBM, @cargoCBM,
            @grossWeight, @targetDate, @documentDetails);
`;

const addExportFCL = `
        INSERT INTO OrderDocs (orderType, shipmentType, orderNumber, from, to, 
            shipmentReadyDate, deliveryTerm, Type, numberOfContainers, targetDate, documentDetails)
        VALUES (@orderType, @shipmentType, @orderNumber, @from, @to, 
            @shipmentReadyDate, @deliveryTerm, @Type, @numberOfContainers, @targetDate, @documentDetails);
`;

module.exports = {
    addExportAirFreight,
    addExportLCL,
    addExportFCL
};