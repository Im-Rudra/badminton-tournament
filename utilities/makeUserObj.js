const makeUserObj = (user) => {
  if (!user?._id) {
    return null;
  }
  const { _id: id, firstName, lastName, email, phone, role, createdAt } = user;
  return { id, firstName, lastName, email, phone, role, createdAt };
};

module.exports = makeUserObj;
