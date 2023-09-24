'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CoreAPIGET, CoreAPI } from '@/dep/core/coreHandler';
import AddRole from './AddRole';
import { DeleteModal, alertDelete } from '@/components/Feature';
import { ItmsPerPageComp, PaginationComp } from '@/components/PaginationControls';
import { Separator } from '@/components/ui/separator';

function RoleTable() {
  const router = useRouter();
  const [listRoles, setListRoles] = useState([]);
  const [roleNames, setRoleNames] = useState({});
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRoleID, setDeletingRoleID] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pageInfo, setPageInfo] = useState({ TotalPage: 0 });

  const fetchListRoles = async () => {
    try {
      const response = await CoreAPIGET(`listrole?page=${currentPage}&num=${itemsPerPage}`);
      const jsonData = response.body.Data;
      const pageInfo = response.body.Info;
      setListRoles(jsonData);
      setPageInfo(pageInfo);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchRoleName = async (roleID) => {
    try {
      const responseRole = await CoreAPIGET(`role?RoleID=${roleID}`);
      return responseRole.body.Data.RoleName;
    } catch (error) {
      console.error('Error fetching role name:', error);
      return null;
    }
  };

  const updateRoleNames = async () => {
    const roleNamesMap = {};
    for (const role of listRoles) {
      if (!roleNamesMap[role.RoleParentID]) {
        roleNamesMap[role.RoleParentID] = await fetchRoleName(role.RoleParentID);
      }
    }
    setRoleNames(roleNamesMap);
  };

  const handleConfirmDelete = async () => {
    try {
      const responseDel = await CoreAPI('DELETE', 'role', { RoleID: deletingRoleID });

      const updatedListRoles = listRoles.filter(
        (role) => role.RoleID !== deletingRoleID,
      );
      setListRoles(updatedListRoles);
      alertDelete(responseDel);
      setIsDeleteModalOpen(false);
      setDeletingRoleID(null);
    } catch (error) {
      console.error('Error deleting Role:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingRoleID(null);
  };

  useEffect(() => {
    fetchListRoles();
  }, [router.pathname, itemsPerPage, currentPage]);

  useEffect(() => {
    if (listRoles.length > 0) {
      updateRoleNames();
    }
  }, [listRoles]);

  const handleNavigate = (RoleID) => {
    router.push(`/roles/${RoleID}`);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <section className="h-screen flex flex-auto w-full md:w-4/5 lg:w-3/4">
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-semibold mb-1">List Roles</h2>
        <p className="text-xs mb-4">
          view and access list of roles.
        </p>
        <Separator className="mb-4" />
        <div className="my-2">
          <AddRole fetchData={fetchListRoles} />
        </div>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Role Name</th>
              <th className="px-4 py-2">Parent Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listRoles.map((role) => (
              <tr key={role.RoleID} className="border-b">
                <td className="px-4 py-2">{role.RoleID}</td>
                <td className="px-4 py-2">{role.RoleName}</td>
                <td className="px-4 py-2 text-center">
                  {' '}
                  {roleNames[role.RoleParentID] === role.RoleName ? '-' : roleNames[role.RoleParentID] || role.RoleParentID}
                </td>
                <td className="px-4 py-2 flex justify-end items-center">
                  <button
                    onClick={() => handleNavigate(role.RoleID)}
                    className="bg-yellow-500 text-white rounded px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeletingRoleID(role.RoleID);
                      setDeleteMessage(
                        `Are you sure you would like to delete "${role.RoleName}" role? This action cannot be undone.`,
                      );
                      setIsDeleteModalOpen(true);
                    }}
                    className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PaginationComp
          currentPage={currentPage}
          totalPages={pageInfo.TotalPage}
          totalRow={pageInfo.TotalRow}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
          upperLimit={pageInfo.UpperLimit}
          lowerLimit={pageInfo.LowerLimit}
        />
        <ItmsPerPageComp
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDelete}
          message={deleteMessage}
        />
      </div>
    </section>
  );
}

export default RoleTable;