import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useAuth } from "@/contexts/UserContext";

const UserProfile = () => {
  const { currentUser } = useAuth();
  return (
    <div className="flex h-screen w-full">
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
            <TableCell>{currentUser?.firstName}</TableCell>
            <TableCell>{currentUser?.lastName}</TableCell>
            <TableCell>{currentUser?.email}</TableCell>
            <TableCell>
              <img
                src={currentUser?.image}
                alt="User Image"
                className="rounded-full h-1/3"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UserProfile;
