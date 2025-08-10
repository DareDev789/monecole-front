import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import nProgress from "nprogress";
import { Controller, useForm } from "react-hook-form";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import { personnelsApi } from "../../services/api";

const PersonnelsForm = ({ selectedEmploye, onSuccess, onCancel }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: selectedEmploye,
  });

  const onSubmit = async (data) => {
    nProgress.start();

    try {
      if (selectedEmploye) {
        await personnelsApi.update(selectedEmploye.id, data);
      } else {
        await personnelsApi.create(data);
      }

      onSuccess();
      
    } catch (err) {
      console.error("Erreur lors de la soumission", err);
    } finally {
      nProgress.done();
    }
  };

  return (
    <>
      <div className="max-h-[80vh] overflow-auto relative">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="first_name"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input label="Prénom" required {...field} />
              )}
            />
            <Controller
              name="last_name"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input label="Nom" required {...field} />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="email" label="Email" required {...field} />
              )}
            />
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input label="Téléphone" required {...field} />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="position"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input label="Poste" required {...field} />
              )}
            />
            <Controller
              name="salary"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="number" label="Salaire (Ariary)" required {...field} />
              )}
            />
          </div>

          <div className="mb-4">
            <Controller
              name="hire_date"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="date" label="Date d'embauche" required {...field} />
              )}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel} className='bg-gray-400 hover:bg-gray-500'>
              Annuler
            </Button>
            <Button type="submit" className='bg-gray-700 hover:bg-gray-900'>
              {selectedEmploye ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PersonnelsForm;
