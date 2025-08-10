import { useState } from "react";
import UsersTab from "./UsersTab";
import SchoolYearsPage from "../../pages/SchoolYearsPage";
import { motion } from "framer-motion";

export default function PreferencesManager() {
    const [activeTab, setActiveTab] = useState("schoolYears");

    return (
        <div>
            <div className="relative flex gap-2 bg-gray-300 rounded-md p-1 w-max">
                <button
                    className="relative px-4 py-1 text-sm rounded-md z-10 focus:outline-none"
                    onClick={() => setActiveTab("schoolYears")}
                >
                    {activeTab === "schoolYears" && (
                        <motion.div
                            layoutId="tabHighlight"
                            className="absolute inset-0 bg-gray-900 rounded-md"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{ zIndex: -1 }}
                        />
                    )}
                    <span
                        className={`relative ${activeTab === "schoolYears" ? "text-white" : "text-gray-700"
                            }`}
                    >
                        Années Scolaires
                    </span>
                </button>

                <button
                    className="relative px-4 py-1 text-sm rounded-md z-10 focus:outline-none"
                    onClick={() => setActiveTab("users")}
                >
                    {activeTab === "users" && (
                        <motion.div
                            layoutId="tabHighlight"
                            className="absolute inset-0 bg-gray-900 rounded-md"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{ zIndex: -1 }}
                        />
                    )}
                    <span
                        className={`relative ${activeTab === "users" ? "text-white" : "text-gray-700"
                            }`}
                    >
                        Gestion des Utilisateurs
                    </span>
                </button>
            </div>

            <div className="w-full mt-4">
                {activeTab === "schoolYears" && <SchoolYearsPage />}
                {activeTab === "users" && <UsersTab />}
            </div>
        </div>
    );
}
