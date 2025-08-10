import { Controller, useForm } from "react-hook-form";
import { usersApi } from "../../services/api";
import Input from "../../Components/ui/Input";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Components/ui/Button";
import nProgress from "nprogress";

export default function UserForm({ form, editing, handleChange, fetchUsers, resetForm, loading, roles }) {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: form,
    });

    const onSubmit = async (data) => {
        
        nProgress.start();
        if (data.password && data.password.trim() === "") {
            delete data.password;
        }
        console.log(data.password);
        try {
            if (editing) {
                let formData;
                if (data.password && data.password.trim() === "") {
                    formData = {
                        is_active : data.is_active,
                        name : data.name,
                        role : data.role,
                        school_id : data.school_id,
                    }
                }else{
                    formData = {
                        is_active : data.is_active,
                        name : data.name,
                        role : data.role,
                        school_id : data.school_id,
                        password : data.password,
                    }
                }
                const res = await usersApi.update(form.id, formData);
                Notiflix.Notify.success(res.data.message);
            } else {
                const res = await usersApi.create(data);
                Notiflix.Notify.success(res.data.message);
            }
            resetForm();
            fetchUsers(pagination.current_page);
        } catch (error) {
            console.log("Erreur lors de la sauvegarde", error);
        } finally {
            nProgress.done();
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Input label="Nom et prénom" required {...field} />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Input label="Email" required {...field} />
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 ">
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{ required: false }}
                        render={({ field }) => (
                            <Input type="password" label="Mot de passe" {...field} />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 ">
                    <Controller
                        name="role"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Listbox value={field.value} onChange={field.onChange}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                                        <span className="block truncate">
                                            {field.value
                                                ? field.value.charAt(0).toUpperCase() + field.value.slice(1)
                                                : "Sélectionner un rôle"}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <FontAwesomeIcon icon={faChevronUp} />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {roles.map((role) => (
                                                <Listbox.Option
                                                    key={role}
                                                    className={({ active }) =>
                                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                        }`
                                                    }
                                                    value={role}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected ? "font-medium" : "font-normal"
                                                                    }`}
                                                            >
                                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 ">
                    <Controller
                        name="is_active"
                        control={control}
                        defaultValue={false} // ou true selon ton besoin
                        render={({ field }) => (
                            <Input
                                type="checkbox"
                                className="select-none"
                                checked={Boolean(field.value)}
                                onChange={(e) => field.onChange(e.target.checked)}
                                label="Actif"
                            />
                        )}
                    />

                </div>

                <div>
                    <Button type="submit"
                        className="bg-gray-700 hover:bg-gray-800"
                        disabled={loading}>
                        {editing ? "Mettre à jour" : "Ajouter"}
                    </Button>
                    {editing && (
                        <Button type="button"
                            onClick={resetForm}
                            className="ml-3 bg-red-500 hover:bg-red-600"
                            disabled={loading}>
                            Annuler
                        </Button>
                    )}
                </div>
            </form>
        </>
    )
}