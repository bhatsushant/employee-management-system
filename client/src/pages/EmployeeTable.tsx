import * as React from "react";
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
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import type { Employee } from "@/models/employee";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const isAdmin = true;

export function EmployeeTable() {
  const [data, setData] = React.useState<Employee[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { employees, getEmployees, deleteEmployee } = useEmployeeContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await getEmployees();
        setData(employeesData);
        const employedEmployees = employeesData.filter(emp => emp.isEmployed);
        setData(employedEmployees);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [employees, getEmployees]);

  const downloadCSV = () => {
    const csv = Papa.unparse(data, {
      columns: [
        "emp_id",
        "first_name",
        "last_name",
        "dept",
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

  const handleEditEmployee = (employee: Employee) => {
    navigate("/employee_form", { state: { employee, isEdit: true } });
  };
  const handleDeleteEmployee = (employee: Employee) => {
    console.log("Employee:", employee);
    deleteEmployee(employee.employeeId);
  };
  const handleViewEmployee = (employee: string) => {
    navigate("/employee", { state: { employee } });
  };

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
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>
    },
    ...(isAdmin
      ? [
          {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }: { row: any }) => (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => handleViewEmployee(row.original)}
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleEditEmployee(row.original)}
                >
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => handleDeleteEmployee(row.original)}
                >
                  Delete
                </Button>
              </div>
            )
          }
        ]
      : [])
  ];

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
    <div className="flex flex-col flex-grow min-w-0">
      <div className="mt-4 mb-4 flex justify-center">
        <Input
          placeholder="Filter department..."
          value={
            (table.getColumn("department")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("department")?.setFilterValue(event.target.value)
          }
          className="max-w-sm w-full"
        />
      </div>
      <div className="flex flex-grow items-center justify-center overflow-hidden">
        <div className="w-full max-w-screen-lg">
          <div className="max-w-screen-lg">
            <div className="rounded-md border shadow overflow-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => {
                        return (
                          <TableHead
                            key={header.id}
                            className={
                              header.id === "actions" ? "text-center" : ""
                            }
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
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
            <div className="flex justify-between mt-4">
              <Button onClick={downloadCSV}>Download CSV</Button>
              <div className="flex items-center space-x-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
