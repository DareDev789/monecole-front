import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import nProgress from "nprogress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Input from "../../Components/ui/Input";
import { useForm } from "react-hook-form";
import Button from "../../Components/ui/Button";

const MatieresForm = ({ initialData, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      coefficient: 1,
      ...initialData,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Désignation"
          name="name"
          type="text"
          required
          value={watch('name')}
          onChange={handleChange}
          error={errors.name}
        />

        <Input
          label="Coefficient"
          name="coefficient"
          type="number"
          required
          step={0.5}
          value={watch('coefficient')}
          onChange={handleChange}
          error={errors.name}
        />


        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel} className="bg-red-700 hover:bg-red-900">
            Annuler
          </Button>
          <Button type="submit" className="bg-gray-800 hover:bg-gray-900">
            {initialData?.id ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default MatieresForm;
