"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, FileText, FileSpreadsheet, File } from "lucide-react";

// For exports
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
    },
  });

  // --- Export Functions ---
  const getTableDataForExport = () => {
    const visibleColumns = table.getAllColumns().filter(column => column.getIsVisible());
    const headers = visibleColumns.map(col => col.columnDef.header as string);
    
    const rows = table.getFilteredRowModel().rows.map(row => 
        visibleColumns.map(column => {
            const columnId = column.id;
            if (columnId === 'details') {
                return 'View Details';
            }
            if (columnId === 'actions') {
                return 'Actions';
            }

            const cellValue = (row.original as any)[columnId];
            
            if (columnId === 'createdAt') {
              return new Date(cellValue).toLocaleDateString();
            }

            return cellValue || '';
        })
    );
    return { headers, rows };
  };

  const exportCSV = () => {
    const { headers, rows } = getTableDataForExport();
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "data.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportExcel = () => {
    const { headers, rows } = getTableDataForExport();
    const data = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "data.xlsx");
  };

  const exportPDF = () => {
    const { headers, rows } = getTableDataForExport();
    const doc = new jsPDF();
    (doc as any).autoTable({
        head: [headers],
        body: rows,
    });
    doc.save("data.pdf");
  };

  // --- Pagination and Count ---
  const totalCount = table.getFilteredRowModel().rows.length;
  const startIndex = table.getState().pagination.pageIndex * table.getState().pagination.pageSize;
  const showingFrom = totalCount === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + table.getState().pagination.pageSize, totalCount);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem onClick={exportCSV}>
                  <File className="mr-2 h-4 w-4" /> Export to CSV
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={exportExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Export to Excel
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={exportPDF}>
                  <FileText className="mr-2 h-4 w-4" /> Export to PDF
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Total Entries: <span className="font-semibold">{totalCount}</span>
      </p>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                table.getRowModel().rows.map((row) => (
                  <TableRow className="bg-white"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const renderedContent = flexRender(cell.column.columnDef.cell, cell.getContext());
                      const content = typeof renderedContent === 'string' && renderedContent.length > 2
                        ? `${renderedContent.substring(0, 2)}...`
                        : renderedContent;

                      return (
                        <TableCell key={cell.id}>
                          {content}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-500 p-2">
          Showing <span className="font-semibold">{showingFrom}</span> - <span className="font-semibold">{showingTo}</span> of <span className="font-semibold">{totalCount}</span> entries
        </div>
        <div className="space-x-2">
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
  );
}