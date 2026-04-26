import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ register, name, placeholder }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className='relative mb-4'>
      <input
        {...register(name, { required: true })}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        className='w-full border p-2 pr-10 rounded'
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-2 top-2 text-gray-500"
        tabIndex={-1}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

export default PasswordInput;
