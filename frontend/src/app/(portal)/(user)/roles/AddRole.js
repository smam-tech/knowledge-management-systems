import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CoreAPI } from '@/dep/core/coreHandler';

import { roleSchema } from '@/constants/schema';
import { RequiredFieldIndicator, ErrorMessage } from '@/components/FormComponent';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  useOutsideClick, useModal, alertAdd,
} from '@/components/Feature';
import { closeIcon } from '@/constants/icon';

function AddRole({ fetchData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const {
    handleSubmit, control, reset, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      RoleName: '',
      RoleParentID: '',
      RoleDescription: '',
    },
    resolver: yupResolver(roleSchema),
  });

  useOutsideClick(ref, closeModal);

  const handleClose = () => {
    reset();
    closeModal();
  };

  const onSubmit = async (formData) => {
    try {
      const { error } = roleSchema.validate(formData);

      if (error) {
        console.error('Validation error:', error.details);
        return;
      }

      const response = await CoreAPI('POST', 'role', formData);
      await new Promise((resolve) => setTimeout(resolve, 300));
      fetchData();
      alertAdd(response);
      handleClose();
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <div>
      <Button
        type="button"
        onClick={openModal}
        className="rounded bg-blue-500 text-white w-full md:w-36"
      >
        Add New +
      </Button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
          isModalOpen ? 'visible z-20' : 'invisible'
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex justify-center items-center ${
          isModalOpen ? 'visible z-30' : 'invisible'
        }`}

      >
        <div className="bg-white rounded-lg p-6 shadow-md relative z-40 w-[66vh] mx-2" ref={ref}>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            {closeIcon}
          </button>
          <h2 className="text-2xl font-medium mb-2">Add Role</h2>
          <Separator className="mb-4" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block font-medium mb-1">
                Role Name
                <RequiredFieldIndicator />
              </label>
              <Controller
                name="RoleName"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                      placeholder="Public"
                    />
                    <p className="text-xs mt-1">
                      Min 2 characters & Max 50 characters. Required.
                    </p>
                    {errors.RoleName && (<ErrorMessage error={errors.RoleName.message} />)}
                  </>
                )}
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-1">
                Role Parent ID
                <RequiredFieldIndicator />
              </label>
              <Controller
                name="RoleParentID"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
                      placeholder="Role Parent ID"
                    />
                    <p className="text-xs mt-1">
                      Input a valid Role Parent ID. Number Only. Required.
                    </p>
                    {errors.RoleParentID && (<ErrorMessage error={errors.RoleParentID.message} />)}
                  </>
                )}
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-1">
                Description
              </label>
              <Controller
                name="RoleDescription"
                control={control}
                render={({ field }) => (
                  <>
                    <textarea
                      {...field}
                      type="textarea"
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1 border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y  md:max-w-md"
                      placeholder="Designed for public"
                    />
                    <p className="text-xs mt-1">
                      Give a brief explanation of the role.
                    </p>
                    {errors.RoleDescription && (<ErrorMessage error={errors.RoleDescription.message} />)}
                  </>
                )}
              />
            </div>
            <div className="place-content-end mt-10 flex">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-400 border border-gray-200 text-white px-4 py-2 rounded mr-2 w-full md:w-36"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-blue-500 text-white w-full md:w-36"
              >
                Add
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddRole;

// "use client";
// import React, { useState } from "react";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { KmsAPI } from "@/dep/kms/kmsHandler";

// function AddProduct() {
//   const [formData, setFormData] = useState({
//     CategoryName: "",
//     CategoryParentID: "",
//     CategoryDescription: "",
//   });
//   const [modal, setModal] = useState(false);
//   const [isMutating, setIsMutating] = useState(false);

//   const router = useRouter();

//   function handleSubmit(e) {
//     e.preventDefault();

//     setIsMutating(true);

// // Use useEffect to fetch data
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       await KmsAPI("POST", "category", data);
//       setIsMutating(false);
//       router.refresh();
//       setModal(false);
//     } catch (error) {
//       console.log("Error occurred:", error);
//       setIsMutating(false);
//       // Handle error, show a message, etc.
//     }
//   };

//   fetchData();
// }, [data, router]); // Add data and router as dependencies for useEffect
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   function handleChange() {
//     setModal(!modal);
//   }

//   return (
//     <div>
//       <button  onClick={handleChange} className="bg-blue-500 text-white rounded px-2 py-1">
//         Add New +
//       </button>
//       <input
//         type="checkbox"
//         checked={modal}
//         onChange={handleChange}
//         className="modal-toggle"
//       />

//       <div className="modal">
//         <div className="modal-box">
//           <h3 className="font-bold text-lg">Add New Product</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="form-control">
//               <label className="label font-bold">CategoryName</label>
//               <input
//                 type="text"
//                 value={formData.CategoryName}
//           onChange={handleInputChange}
//                 className="input w-full input-bordered"
//                 placeholder="Product Name"
//               />
//             </div>
//             <div className="form-control">
//               <label className="label font-bold">Price</label>
//               <input
//                 type="text"
//                 value={formData.CategoryParentID}
//           onChange={handleInputChange}
//                 className="input w-full input-bordered"
//                 placeholder="Price"
//               />
//             </div>
//             <div className="form-control">
//               <label className="label font-bold">Price</label>
//               <input
//                 type="text"
//                 value={formData.CategoryDescription}
//                 onChange={handleInputChange}
//                 className="input w-full input-bordered"
//                 placeholder="Price"
//               />
//             </div>
//             <div className="modal-action">
//               <button type="button" className="btn" onClick={handleChange}>
//                 Close
//               </button>
//               {!isMutating ? (
//                 <button type="submit" className="btn btn-primary">
//                   Save
//                 </button>
//               ) : (
//                 <button type="button" className="btn loading">
//                   Saving...
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddProduct;