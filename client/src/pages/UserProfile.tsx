import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const UserProfile = () => {
  const {
    firstName = "",
    lastName = "",
    email = "",
    image = ""
  } = { ...JSON.parse(localStorage.getItem("user")!) };
  return (
    <Table>
      <TableCaption>Admin Profile</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Image</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{firstName}</TableCell>
          <TableCell>{lastName}</TableCell>
          <TableCell>{email}</TableCell>
          <TableCell>
            <img src={image} alt="User Image" className="rounded-full" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default UserProfile;
