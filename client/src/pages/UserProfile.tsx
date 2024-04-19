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
  const [firstName, lastName] = currentUser?.displayName?.split(" ") || [
    "",
    ""
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
      <div className="w-full max-w-4xl shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableCaption className="bg-gray-100 p-4 font-semibold text-lg">
            Admin Profile
          </TableCaption>
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
              <TableCell>{currentUser?.firstName || firstName}</TableCell>
              <TableCell>{currentUser?.lastName || lastName}</TableCell>
              <TableCell>{currentUser?.email}</TableCell>
              <TableCell>
                <img
                  src={
                    currentUser?.image ||
                    currentUser?.photoURL ||
                    "https://via.placeholder.com/150"
                  }
                  alt="User Image"
                  className="w-16 h-16 rounded-full mx-auto"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserProfile;
