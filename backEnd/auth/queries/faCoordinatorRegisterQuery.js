const getFreightAgentsList = `
    SELECT AgentID, Freight_Agent FROM Freight_Agents
`;

const getAllFromFACoordinators = `
    SELECT * FROM Users WHERE Email = @email
`;

const userRegistration = `
      INSERT INTO Users (User_Contact_Number, Email, PasswordHash, AgentID, RoleID)
      VALUES (
        @User_Contact_Number,
        @email, 
        @hashedPassword,
        (SELECT AgentID FROM Freight_Agents WHERE Freight_Agent = @Freight_Agent), 
        (SELECT RoleID FROM Roles WHERE RoleName = @roleName)
      )
`;

const FACoordinatorRegistration = `
BEGIN TRY
    BEGIN TRANSACTION;

    -- Insert into Freight_Agents table
    INSERT INTO FA_Coordinators (Coordinator_Name, ContactNumber, Email, Freight_Agent, PasswordHash)
    VALUES (
        @Coordinator_Name,
        @ContactNumber,
        @Email,
        @Freight_Agent,
        @PasswordHash
    );

    -- Insert into Users table
    INSERT INTO Users (User_Contact_Number, Email, PasswordHash, AgentID, RoleID)
    VALUES (
        @ContactNumber,
        @Email,
        @PasswordHash,
        @Freight_Agent, -- Use the mapped AgentID
        3 -- Assuming RoleID for Freight Agent Coordinators
    );

    -- Commit the transaction if all is successful
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    -- Rollback the transaction if any error occurs
    ROLLBACK TRANSACTION;

    -- Optionally, re-throw the error or log it
    THROW;
END CATCH;

`;

module.exports = {
    getFreightAgentsList,
    getAllFromFACoordinators,
    FACoordinatorRegistration
};