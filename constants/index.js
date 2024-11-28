exports.ROLES = {
  ADMIN: "Administrator",
  MODERATOR: "Moderator",
  USER: "User",
};

const styles = {
  header: {
    font: {
      bold: true,
      color: { rgb: "FFFFFF" },
    },
    fill: {
      fgColor: { rgb: "4F81BD" },
    },
  },
  cell: {
    font: {
      color: { rgb: "FFFFFF" },
    },
  },
};

exports.excelSpecification = {
  teamName: {
    displayName: "Team Name",
    width: 100,
    headerStyle: styles.header,
  },
  teamType: {
    displayName: "Team Type",
    width: 100,
    headerStyle: styles.header,
  },
  paymentStatus: {
    displayName: "Payment Status",
    width: 100,
    headerStyle: styles.header,
  },
  fullName_1: {
    displayName: "Name 1",
    width: 100,
    headerStyle: styles.header,
  },
  fullName_2: {
    displayName: "Name 2",
    width: 100,
    headerStyle: styles.header,
  },
  phone_1: {
    displayName: "Phone 1",
    width: 100,
    headerStyle: styles.header,
  },
  phone_2: {
    displayName: "Phone 2",
    width: 100,
    headerStyle: styles.header,
  },
  createdAt: {
    displayName: "Registered On",
    width: 100,
    headerStyle: styles.header,
  },
};
