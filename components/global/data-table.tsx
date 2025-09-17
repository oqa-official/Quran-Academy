"use client";

import { useState, useMemo } from "react";
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
import {
  ChevronDown,
  FileText,
  FileSpreadsheet,
  File,
} from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder: string;
  searchKey?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder,
  searchKey
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnsWithSerial = useMemo(() => {
    const serialNumberColumn: ColumnDef<TData> = {
      id: "serialNumber",
      header: "S.No.",
      cell: ({ row }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <span>{pageIndex * pageSize + row.index + 1}</span>;
      },
    };
    return [serialNumberColumn, ...columns];
  }, [columns]);

  const table = useReactTable({
    data,
    columns: columnsWithSerial,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    state: { columnFilters },
  });

  // --- Export helpers ---
  const getTableDataForExport = () => {
    const visibleColumns = table.getAllColumns().filter((c) => c.getIsVisible());
    const headers = visibleColumns.map(
      (col) => col.columnDef.header as string
    );
    const rows = table.getFilteredRowModel().rows.map((row, idx) =>
      visibleColumns.map((col) => {
        const colId = col.id;

        if (colId === "serialNumber") return idx + 1;
        if (colId === "actions") return "Actions";
        if (colId === "details") return "View Details";

        const value = (row.original as any)[colId];
        if (colId === "createdAt" && value)
          return new Date(value).toLocaleDateString();

        return typeof value === "string" ? value : "";
      })
    );
    return { headers, rows };
  };

  const exportCSV = () => {
    const { headers, rows } = getTableDataForExport();
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
  };

  const exportExcel = () => {
    const { headers, rows } = getTableDataForExport();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "data.xlsx");
  };

  const exportPDF = () => {
    const { headers, rows } = getTableDataForExport();
    const doc = new jsPDF();
    (doc as any).autoTable({ head: [headers], body: rows });
    doc.save("data.pdf");
  };

  // --- Pagination values ---
  const totalCount = table.getFilteredRowModel().rows.length;
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const showingFrom = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const showingTo = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <div className="space-y-4 md:p-4 p-2 bg-white dark:bg-[#122031] rounded-md">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
       
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchKey || "title")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn(searchKey || "title")?.setFilterValue(e.target.value)
          }
          className="w-full md:max-w-sm rounded-md border px-3 py-2"
        />


        <div className="flex max-md:flex-wrap items-center gap-2">
          {/* Export dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="">
                <FileText className=" h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem onClick={exportCSV}>
                <File className="-ms-5 h-4 w-4" /> CSV
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={exportExcel}>
                <FileSpreadsheet className="-ms-5 h-4 w-4" /> Excel
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={exportPDF}>
                <FileText className="-ms-5 h-4 w-4" /> PDF
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Per-page dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Per Page: {pageSize} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[5, 10, 20, 50].map((size) => (
                <DropdownMenuCheckboxItem
                  key={size}
                  checked={pageSize === size}
                  onCheckedChange={() => table.setPageSize(size)}
                >
                  {size}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Column toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.id}
                    checked={c.getIsVisible()}
                    onCheckedChange={(v) => c.toggleVisibility(!!v)}
                  >
                    {c.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border bg-background">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-sm font-semibold text-foreground px-4 py-3"
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 text-sm text-foreground"
                      >
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
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-2">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{showingFrom}</span> -{" "}
          <span className="font-medium">{showingTo}</span> of{" "}
          <span className="font-medium">{totalCount}</span> entries
        </div>

        <div className="flex gap-2">
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
