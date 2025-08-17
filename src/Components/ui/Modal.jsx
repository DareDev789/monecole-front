import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Modal({ isOpen, setIsOpen, title, width = 'max-w-xl', children }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`${width} relative w-full max-h-[100vh] overflow-auto transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                {/* Bouton de fermeture */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 rounded-full p-2 text-red-500 hover:bg-red-100 hover:text-red-700 focus:outline-none"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>

                {/* Titre */}
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 pr-8">
                  {title}
                </Dialog.Title>

                {/* Contenu */}
                <div className="mt-4">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
