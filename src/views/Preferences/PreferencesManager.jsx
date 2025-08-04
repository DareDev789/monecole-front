import { useState } from "react";
import UsersTab from "./UsersTab";
import SchoolYearsPage from "../../pages/SchoolYearsPage";

export default function PreferencesManager() {
    const [activeTab, setActiveTab] = useState("schoolYears");

    return (
        <div>
            <div className="flex gap-2">
                <button className={`px-4 py-1 text-sm rounded-md ${activeTab !== 'schoolYears' ? "bg-gray-300" : "bg-gray-900 text-white"}`} onClick={() => setActiveTab("schoolYears")}>Années Scolaires</button>
                <button className={`px-4 py-1 text-sm rounded-md ${activeTab !== 'schoolYears' ? "bg-gray-900 text-white" : "bg-gray-300"}`} onClick={() => setActiveTab("users")}>Gestion des Utilisateurs</button>
            </div>

            <div className="w-full mt-4">
                {activeTab === "schoolYears" && <SchoolYearsPage />}
                {activeTab === "users" && <UsersTab />}
            </div>
        </div>
    );
}
