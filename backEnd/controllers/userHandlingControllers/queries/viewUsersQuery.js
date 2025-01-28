const selectAllFreightAgents = `
SELECT FA.AgentID,
       FA.Freight_Agent,
       FA.Address,
       FA.ContactNumber,
       FA.Email,
       FA.Director1_Name,
       FA.Director1_Contact_Number,
       FA.Director1_Email,
       FA.Director2_Name,
       FA.Director2_Contact_Number,
       FA.Director2_Email,
       FA.BRNumber,
       FA.Country,
       FA.AgentStatus,
       COUNT(FAC.CoordinatorID) AS CoordinatorCount
FROM [FreightAgentAlloc_App].[dbo].[Freight_Agents] FA
LEFT JOIN [FreightAgentAlloc_App].[dbo].[FA_Coordinators] FAC
    ON FA.AgentID = FAC.Freight_Agent
WHERE FA.AgentID != -99
GROUP BY FA.AgentID,
         FA.Freight_Agent,
         FA.Address,
         FA.ContactNumber,
         FA.Email,
         FA.Director1_Name,
         FA.Director1_Contact_Number,
         FA.Director1_Email,
         FA.Director2_Name,
         FA.Director2_Contact_Number,
         FA.Director2_Email,
         FA.BRNumber,
         FA.Country,
         FA.AgentStatus
        `;

const selectFreightCoordinators = `
        SELECT * 
        FROM FA_Coordinators 
        WHERE Freight_Agent = @AgentID
        `;

module.exports = {
    selectAllFreightAgents,
    selectFreightCoordinators
};