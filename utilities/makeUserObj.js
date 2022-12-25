const makeUserObj = (user) => {
  if (!user?._id) {
    return null;
  }
  const { _id: id, name, email, phone, role, createdAt } = user;
  return { id, name, email, phone, role, createdAt };
};

module.exports = makeUserObj;
