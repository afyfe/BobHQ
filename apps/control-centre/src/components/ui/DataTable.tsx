import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (item: T) => string;
  getRowClassName?: (item: T) => string | undefined;
  onRowClick?: (item: T) => void;
};

export default function DataTable<T>({ columns, rows, getRowKey, getRowClassName, onRowClick }: DataTableProps<T>) {
  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className={[getRowClassName?.(row), onRowClick ? "table-row--clickable" : undefined]
                .filter(Boolean)
                .join(" ")}
              key={getRowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
