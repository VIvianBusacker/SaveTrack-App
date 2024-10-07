import { Dialog, Transition } from "@headlessui/react"; // Remove TransitionChild
import { Fragment } from "react";
import PropTypes from 'prop-types';

const DialogWrapper = ({ isOpen, closeModal, children }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={closeModal}>
        <Transition.Child // Use Transition.Child instead of TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/60' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child // Use Transition.Child here as well
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              {children}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

DialogWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,    // Corrected to bool
  closeModal: PropTypes.func.isRequired, // Corrected to func
  children: PropTypes.node.isRequired,
};

export default DialogWrapper;
