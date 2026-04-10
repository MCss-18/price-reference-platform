export const getInitials = (name: string, surname: string) => {
  const nameInitial = name?.charAt(0) ?? "";
  const surnameInitial = surname?.charAt(0) ?? "";
  return (nameInitial + surnameInitial).toUpperCase();
};