
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaGoogle } from "react-icons/fa";
// import { useForm } from "react-hook-form";
// import { useAuth } from "../context/AuthContext";

// const Register = () => {
//   const [message, setMessage] = useState("");
//   const { registerUser, signInWithGoogle } = useAuth();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       await registerUser(
//         data.email,
//         data.password,
//         data.firstName,
//         data.lastName,
//         data.phone,
//         data.address
//       );
//       alert("User registered successfully!");
//       navigate("/");
//     } catch (error) {
//       setMessage("Please provide valid information.");
//       console.error(error);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       await signInWithGoogle();
//       alert("Register successful!");
//       navigate("/");
//     } catch (error) {
//       alert("Google sign in failed!");
//       console.error(error);
//     }
//   };

//   return (
//     <div className=" flex justify-center items-center">
//       <div className="w-full max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//         <h2 className="text-xl font-semibold mb-4">Please Register</h2>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="firstName"
//             >
//               First Name
//             </label>
//             <input
//               {...register("firstName", { required: true })}
//               type="text"
//               id="firstName"
//               placeholder="First Name"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
//             />
//             {errors.firstName && (
//               <p className="text-red-500 text-xs italic">First Name is required</p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="lastName"
//             >
//               Last Name
//             </label>
//             <input
//               {...register("lastName", { required: true })}
//               type="text"
//               id="lastName"
//               placeholder="Last Name"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
//             />
//             {errors.lastName && (
//               <p className="text-red-500 text-xs italic">Last Name is required</p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="email"
//             >
//               Email
//             </label>
//             <input
//               {...register("email", {
//                 required: true,
//                 pattern:
//                   /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
//               })}
//               type="email"
//               id="email"
//               placeholder="Email Address"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs italic">Valid email is required</p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <input
//               {...register("password", { required: true, minLength: 6 })}
//               type="password"
//               id="password"
//               placeholder="Password (min 6 characters)"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-xs italic">
//                 Password is required (min 6 characters)
//               </p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="phone"
//             >
//               Phone Number
//             </label>
//             <input
//               {...register("phone", {
//                 required: true,
//                 pattern:/^[0-9]{10}$/
// ,
//               })}
//               type="number"
//               id="phone"
//               placeholder="Phone Number"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
//             />
//             {errors.phone && (
//               <p className="text-red-500 text-xs italic">
//                 Valid phone number is required
//               </p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="address"
//             >
//               Address
//             </label>
//             <input
//               {...register("address", { required: true })}
//               type="text"
//               id="address"
//               placeholder="Your Address"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
              
//             />
//             {errors.address && (
//               <p className="text-red-500 text-xs italic">Address is required</p>
//             )}
//           </div>

//           {message && (
//             <p className="text-red-500 text-xs italic mb-3">{message}</p>
//           )}

//           <div>
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none"
//             >
//               Register
//             </button>
//           </div>
//         </form>

//         <p className="align-baseline font-medium mt-4 text-sm">
//           Have an account? Please{" "}
//           <Link to="/login" className="text-blue-500 hover:text-blue-700">
//             Login
//           </Link>
//         </p>

//         <div className="mt-4">
//           <button
//             onClick={handleGoogleSignIn}
//             className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
//           >
//             <FaGoogle />
//             Sign in with Google
//           </button>
//         </div>

//         <p className="mt-5 text-center text-gray-500 text-xs">
//           ©2025 Book Store. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const getAuthErrorMessage = (error) => {
  if (!error) return "Registration failed. Please try again.";
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  const code = error?.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is not enabled in Firebase.";
    default:
      return error?.message || "Registration failed. Please try again.";
  }
};

const Register = () => {
  const [message, setMessage] = useState("");
  const { registerUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`;
      
      await registerUser(
        data.email,
        data.password,
        fullName,
        data.phone,
        data.address
      );
      
      alert("User registered successfully!");
      navigate("/");
    } catch (error) {
      const friendlyMessage = getAuthErrorMessage(error);
      setMessage(friendlyMessage);
      console.error("Registration error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      alert("Google sign in failed!");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Please Register</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              {...register("firstName", { required: "First name is required" })}
              type="text"
              id="firstName"
              placeholder="First Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs italic">{errors.firstName.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              id="lastName"
              placeholder="Last Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs italic">{errors.lastName.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Please enter a valid email"
                }
              })}
              type="email"
              id="email"
              placeholder="Email Address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              {...register("password", { 
                required: "Password is required", 
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              type="password"
              id="password"
              placeholder="Password (min 6 characters)"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a 10-digit phone number"
                }
              })}
              type="tel"
              id="phone"
              placeholder="Phone Number"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs italic">{errors.phone.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <textarea
              {...register("address", { required: "Address is required" })}
              id="address"
              placeholder="Your complete address"
              rows={3}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.address && (
              <p className="text-red-500 text-xs italic">{errors.address.message}</p>
            )}
          </div>

          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}

          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none"
            >
              Register
            </button>
          </div>
        </form>

        <p className="align-baseline font-medium mt-4 text-sm">
          Have an account? Please{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
        </p>

        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            <FaGoogle />
            Sign in with Google
          </button>
        </div>

        <p className="mt-5 text-center text-gray-500 text-xs">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;