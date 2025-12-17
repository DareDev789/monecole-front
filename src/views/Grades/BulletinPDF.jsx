import { Fragment } from "react";

/**
 * Props attendues :
 * - students: [
 *     {
 *       id,
 *       first_name,
 *       last_name,
 *       average,
 *       subjects: [{ id, name, grade, coefficient }]
 *     }
 *   ]
 * - className: string
 * - termName: string
 */
export default function ClassBulletinsPDF({ students = [], className, termName }) {

    /* 🔢 Calcul des rangs */
    const rankedStudents = [...students]
        .sort((a, b) => b.average - a.average)
        .map((s, index) => ({
            ...s,
            rank: index + 1,
        }));

    return (
        <div className="space-y-12">

            {rankedStudents.map((student, idx) => (
                <div
                    key={student.id}
                    className="bg-white text-black p-6 border rounded shadow print:break-after-page"
                >
                    {/* EN-TÊTE */}
                    <div className="text-center mb-4">
                        <h2 className="text-xl font-bold uppercase">
                            Bulletin de notes
                        </h2>
                        <p className="text-sm">
                            Classe : <strong>{className}</strong> |{" "}
                            Trimestre : <strong>{termName}</strong>
                        </p>
                    </div>

                    {/* INFOS ÉLÈVE */}
                    <div className="flex justify-between mb-4 text-sm">
                        <div>
                            <p>
                                <strong>Élève :</strong>{" "}
                                {student.first_name} {student.last_name}
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Rang :</strong>{" "}
                                {student.rank} / {rankedStudents.length}
                            </p>
                        </div>
                    </div>

                    {/* TABLE NOTES */}
                    <table className="w-full border-collapse border text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1 text-left">
                                    Matière
                                </th>
                                <th className="border px-2 py-1 text-center">
                                    Note
                                </th>
                                <th className="border px-2 py-1 text-center">
                                    Coef
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.subjects.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="border px-2 py-1">
                                        {sub.name}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {sub.grade ?? "-"}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {sub.coefficient}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* MOYENNE */}
                    <div className="flex justify-end mt-4">
                        <p className="text-base font-semibold">
                            Moyenne générale : {student.average}
                        </p>
                    </div>

                    {/* SIGNATURES */}
                    <div className="flex justify-between mt-10 text-sm">
                        <p>Signature professeur</p>
                        <p>Signature direction</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
