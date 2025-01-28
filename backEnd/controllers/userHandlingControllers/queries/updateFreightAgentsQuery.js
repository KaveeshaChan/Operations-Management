const updateFreigtAgentStatus = `
        UPDATE Freight_Agents
        SET AgentStatus = @AgentStatus
        WHERE AgentID = @AgentID
        `;

module.exports = {
    updateFreigtAgentStatus,
};