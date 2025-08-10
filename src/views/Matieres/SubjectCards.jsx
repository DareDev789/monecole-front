import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2, ChevronDown, ChevronUp } from "lucide-react";

export default function SubjectCards({ subjects = [], onEdit = () => {}, onDelete = () => {}, onRemoveClass = () => {} }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <motion.article
            key={subject.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            whileHover={{ translateY: -4, boxShadow: "0 10px 30px rgba(2,6,23,0.12)" }}
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="p-5">
              <div className="flex items-start justify-between space-x-4">
                <div>
                  <Link to={`/view-one-matiere/${subject.id}`} className="text-slate-900 hover:underline">
                    <h3 className="text-lg sm:text-xl font-semibold leading-tight">{subject.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">Coeff. <span className="font-medium text-gray-700">{subject.coefficient}</span></p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    aria-label={`Edit ${subject.name}`}
                    onClick={() => onEdit(subject)}
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                    title="Editer"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    aria-label={`Delete ${subject.name}`}
                    onClick={() => onDelete(subject.id)}
                    className="p-2 rounded-md hover:bg-red-50 hover:text-red-600 transition"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <hr className="my-4 border-t border-gray-100" />

              {/* classes list */}
              <div>
                <div className="flex flex-wrap gap-2 mb-1">
                  {subject.classes && subject.classes.slice(0, 6).map((c) => (
                    <motion.span
                      key={c.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full text-sm border border-gray-100"
                    >
                      <span className="truncate max-w-[8rem] md:max-w-[10rem]">{c.name}</span>
                      <button
                        onClick={() => onRemoveClass(c.id, subject)}
                        title={`Retirer ${c.name}`}
                        className="p-1 rounded-full hover:bg-red-50 hover:text-red-600"
                        aria-label={`Retirer ${c.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.span>
                  ))}

                  {subject.classes && subject.classes.length > 6 && (
                    <span className="text-xs text-gray-400 self-center">+{subject.classes.length - 6} autres</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Liste complète des classes</p>

                  <button
                    onClick={() => setOpenId(openId === subject.id ? null : subject.id)}
                    className="flex items-center gap-2 text-sm px-2 py-1 rounded-md hover:bg-gray-100"
                    aria-expanded={openId === subject.id}
                    aria-controls={`classes-${subject.id}`}
                  >
                    <span>{openId === subject.id ? "Cacher" : "Voir"}</span>
                    {openId === subject.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                <AnimatePresence>
                  {openId === subject.id && (
                    <motion.ul
                      id={`classes-${subject.id}`}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                      {subject.classes && subject.classes.map((classe) => (
                        <motion.li
                          key={classe.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2 border border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-300 to-indigo-400 flex items-center justify-center text-white text-xs font-semibold">
                              {classe.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="text-sm">
                              <div className="font-medium truncate max-w-[12rem]">{classe.name}</div>
                              <div className="text-xs text-gray-400">ID: {classe.id}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onRemoveClass(classe.id, subject)}
                              className="p-2 rounded-md hover:bg-red-50 hover:text-red-600"
                              title={`Retirer ${classe.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              layout
              className="bg-gradient-to-r from-white/0 to-gray-50 px-4 py-3 flex justify-end gap-2"
            >
              <button
                onClick={() => onEdit(subject)}
                className="text-sm px-3 py-2 rounded-lg border border-gray-100 hover:shadow-sm"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(subject.id)}
                className="text-sm px-3 py-2 rounded-lg bg-red-600 text-white hover:brightness-110"
              >
                Supprimer
              </button>
            </motion.div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
