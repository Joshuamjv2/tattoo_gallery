import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    ColumnDef,
    RowData,
  } from "@tanstack/react-table";
  import React from "react";
  
  interface FlexibleTableProps<T extends RowData> {
    data: T[];
    columns: ColumnDef<T, any>[];
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
  }
  
  export function FlexibleTable<T extends RowData>({
    data,
    columns,
    onRowClick,
    emptyMessage = "No records found.",
  }: FlexibleTableProps<T>) {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <div className="overflow-x-auto overflow-y-auto max-h-[85vh] border border-gray-200 rounded scrollbar-hide">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="sticky top-0 bg-gray-200 z-10"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-medium text-black/90 text-[1.1rem] bg-white"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr  onClick={() => onRowClick?.(row.original)} className="hover:bg-black/20 hover:duration-300 cursor-pointer relative" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-[.85rem] font-medium text-black/70">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-3 text-center text-gray-700"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
