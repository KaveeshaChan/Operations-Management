const getAllFromUsers = `
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

const freightAgentRegistration = `
BEGIN TRY
    BEGIN TRANSACTION;

    -- Insert into Freight_Agents table
    INSERT INTO Freight_Agents (Freight_Agent, Address, ContactNumber, Email, Director1_Name, Director1_Contact_Number, Director1_Email, Director2_Name, Director2_Contact_Number, Director2_Email, BRNumber, Country, PasswordHash, AgentStatus)
    VALUES (
        @Freight_Agent,
        @Address,
        @ContactNumber,
        @Email,
        @Director1_Name,
        @Director1_Contact_Number,
        @Director1_Email,
        @Director2_Name,
        @Director2_Contact_Number,
        @Director2_Email,
        @BRNumber,
        @Country,
        @PasswordHash,
        @AgentStatus
    );

    -- Get the auto-generated AgentID
    DECLARE @AgentID INT = SCOPE_IDENTITY();

    -- Insert into Users table
    INSERT INTO Users (User_Contact_Number, Email, PasswordHash, AgentID, RoleID)
    VALUES (
        @ContactNumber,
        @Email,
        @PasswordHash,
        @AgentID,
        3 -- Assuming RoleID for Freight Agents as a common user
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

const getAllFromFreightAgent = `
    SELECT * FROM Freight_Agents WHERE Email = @email
`;

module.exports = {
    getAllFromUsers,
    userRegistration,
    freightAgentRegistration,
    getAllFromFreightAgent
};