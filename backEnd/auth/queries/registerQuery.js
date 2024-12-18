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

module.exports = {
    getAllFromUsers,
    userRegistration
};