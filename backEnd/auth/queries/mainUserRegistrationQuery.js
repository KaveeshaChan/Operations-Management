const getAllFromUsers = `
    SELECT * FROM Users WHERE Email = @email
`;

const getAllFromMainUsers = `
    SELECT * FROM Main_Users WHERE Email = @email
`;

const mainUserRegistration = `
BEGIN TRY
    BEGIN TRANSACTION;

    -- Insert into Main_Users table
    INSERT INTO Main_Users (MainUserName, Email, ContactNumber, PasswordHash)
    VALUES (
        @Main_User_Name,
        @Email,
        @ContactNumber,
        @PasswordHash
    );

    -- Insert into Users table
    INSERT INTO Users (User_Contact_Number, Email, PasswordHash, AgentID, RoleID)
    VALUES (
        @ContactNumber,
        @Email,
        @PasswordHash,
        -99,
        2 -- Assuming role as main user
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
    getAllFromUsers,
    getAllFromMainUsers,
    mainUserRegistration
};