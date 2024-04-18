import * as React from "react";
import axios from "axios";
import Papa from "papaparse";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export type Employee = {
  firstName: string;
  lastName: string;
  department: string;
  phone: string;
  email: string;
  address: string;
};

const isAdmin = true;

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <div>{row.getValue("department")}</div>
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <div>{row.getValue("address")}</div>
  },
  ...(isAdmin
    ? [
        {
          id: "actions",
          header: "Actions",
          enableHiding: false,
          cell: () => (
            <div className="flex justify-center space-x-2">
              <Button variant="ghost">Edit</Button>
              <Button variant="ghost">Delete</Button>
            </div>
          )
        }
      ]
    : [])
];

export function EmployeeTable() {
  const [data, setData] = React.useState<Employee[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/employees");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const downloadCSV = () => {
    const csv = Papa.unparse(data, {
      columns: [
        "emp_id",
        "firstName",
        "lastName",
        "department",
        "phone",
        "email",
        "address"
      ]
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "employees.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters
    }
  });

  return (
    <div className="flex flex-col flex-grow min-w-0 h-screen">
      <div className="flex w-full justify-center items-center mt-4">
        <Input
          placeholder="Filter department..."
          value={
            (table.getColumn("department")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("department")?.setFilterValue(event.target.value)
          }
          className="max-w-sm justify-center items-center mb-4 p-2"
        />
      </div>
      <div className="overflow-auto">
        <div className="py-4 max-w-full flex-grow">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className={header.id === "actions" ? "text-center" : ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex justify-end space-x-2 p-4">
        <Button onClick={downloadCSV}>Download CSV</Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
