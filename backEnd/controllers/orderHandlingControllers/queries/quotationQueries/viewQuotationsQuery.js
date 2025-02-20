const viewQuotationForOrder = `
        SELECT *
        FROM [FreightAgentAlloc_App].[dbo].[Order_Quotations]
        WHERE orderNumber = @orderNumber
`;

module.exports = {
    viewQuotationForOrder
};