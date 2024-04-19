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
      <h1 className="flex text-3xl font-semibold mb-12 justify-center items-center">
        {}User Profile
      </h1>
      <div className="w-full max-w-4xl shadow-md rounded-lg overflow-hidden border border-gray-300 divide-y divide-gray-300">
        <Table>
          <TableCaption className="bg-gray-300 font-semibold text-lg text-black mt-0">
            Admin Profile
          </TableCaption>
          <TableHeader>
            <TableRow className="border-b border-gray-300">
              <TableHead className="border-r border-gray-300">
                First Name
              </TableHead>
              <TableHead className="border-r border-gray-300">
                Last Name
              </TableHead>
              <TableHead className="border-r border-gray-300">Email</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-gray-300">
              <TableCell className="border-r border-gray-300">
                {currentUser?.firstName || firstName}
              </TableCell>
              <TableCell className="border-r border-gray-300">
                {currentUser?.lastName || lastName}
              </TableCell>
              <TableCell className="border-r border-gray-300">
                {currentUser?.email}
              </TableCell>
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
