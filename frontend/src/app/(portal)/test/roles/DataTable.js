'use client';

import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import AddRole from '../../(user)/roles/AddRole';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CoreAPI, CoreAPIGET } from '@/dep/core/coreHandler';
import PaginationCtrl from '@/components/Table/PaginationCtrl';
import { DeleteModal, alertDelete } from '@/components/Feature';

export default function DataTable() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [pageInfo, setPageInfo] = useState({ TotalPage: 0 });
  const columns = [
    {
      accessorKey: 'RoleID',
      header: ({ column }) => (
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue('RoleID')}</div>
      ),
    },
    {
      accessorKey: 'RoleName',
      header: ({ column }) => (
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('RoleName')}</div>
      ),
    },
    {
      accessorKey: 'RoleParentID',
      header: ({ column }) => (
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Parent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue('RoleParentID')}</div>,
    },
    {
      accessorKey: 'RoleDescription',
      header: ({ column }) => (
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue('RoleDescription')}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const items = row.original;
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        const [deletingRoleID, setDeletingRoleID] = useState(null);
        const [deleteMessage, setDeleteMessage] = useState('');
        const router = useRouter();
        const handleNavigate = (RoleID) => {
          console.log(`handleNavigate is running on ${items.RoleID}`);
          router.push(`/roles/${RoleID}`);
        };
        const handleConfirmDelete = async () => {
          try {
            const responseDel = await CoreAPI('DELETE', 'role', { RoleID: deletingRoleID });
            alertDelete(responseDel);
            setIsDeleteModalOpen(false);
            setDeletingRoleID(null);
            fetchData();
          } catch (error) {
            console.error('Error deleting category:', error);
          }
        };
        return (
          <>
            {' '}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(items.RoleID)}
                  className="hover:underline"
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:underline" onClick={() => handleNavigate(items.RoleID)}>View</DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:underline  hover:text-red-600"
                  onClick={() => {
                    setDeletingRoleID(items.RoleID);
                    setDeleteMessage(
                      `Are you sure you would like to delete "${items.RoleName}" Role? This action cannot be undone.`,
                    );
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onDelete={handleConfirmDelete}
              message={deleteMessage}
            />
          </>

        );
      },
    },
  ];
  const fetchData = async () => {
    try {
      const response = await CoreAPIGET(`listrole?page=${currentPage}&num=${itemsPerPage}`);
      console.log('data fetched in page', currentPage, 'and', itemsPerPage, 'items per page');
      setPageInfo(response.body.Info);
      console.log(response);
      setData(response.body.Data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Roles Name..."
          value={(table.getColumn('RoleName')?.getFilterValue() ?? '')}
          onChange={(event) => table.getColumn('RoleName')?.setFilterValue(event.target.value)}
          className="max-w-sm bg-gray-100"
        />
        <div className=" ml-auto item-justify-end inline-flex">
          <AddRole fetchData={fetchData} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className=" ml-2 bg-gray-100">
                Columns
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-100">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize hover:underline hover:cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border bg-gray-100">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((
                row,
              ) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex-1 text-sm font-medium text-muted-foreground">
          Data show
          {' '}
          {pageInfo.LowerLimit}
          {' '}
          -
          {' '}
          {pageInfo.UpperLimit}
          {' '}
          of
          {' '}
          {pageInfo.TotalRow}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                const newItemsPerPage = Number(value);
                setItemsPerPage(newItemsPerPage);
                console.log('Button clicked', itemsPerPage);
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <PaginationCtrl
            currentPage={currentPage}
            totalPage={pageInfo.TotalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
