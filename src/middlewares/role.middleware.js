const AccessControl = require("accesscontrol");

let grantList = [
  {
    role: "admin",
    resource: "profile",
    action: "read:any",
    attributes: "*, !view",
  },
  { role: "shop", resource: "profile", action: "read:own", attributes: "*" },
];

module.exports = new AccessControl(grantList);
