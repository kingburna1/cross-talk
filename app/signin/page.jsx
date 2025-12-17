"use client"
import Image from 'next/image';
import React, { useState } from 'react'; 

// This mock simulates the POST request to your backend's login endpoint.
// const mockLoginApi = (payload) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // Simulate server error/unauthorized (401) for specific inputs
//       if (payload.password === 'badpassword' || payload.email === 'user@unauthorized.com') {
//         resolve({
//           ok: false,
//           status: 401,
//           json: () => Promise.resolve({ 
//             message: 'Invalid credentials. Please check your email and password.' 
//           })
//         });
//         return;
//       }
      
//       // Simulate successful login (HTTP 200 OK) for any valid input
//       resolve({
//         ok: true,
//         status: 200,
//         json: () => Promise.resolve({ 
//           token: 'mock_jwt_token_12345',
//           message: `Welcome back, ${payload.email}! You are now logged in.` 
//         })
//       });

//     }, 1500); // 1.5 second delay to simulate network latency
//   });
// };


// Placeholder Icon for User/Lock
const Icon = ({ children, className = '' }) => (
  <svg className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {children}
  </svg>
);



// Email Icon
const EmailIcon = () => (
  <Icon className="text-green-500">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.8 5.2a2 2 0 002.4 0L21 8m-1 7a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h12a2 2 0 012 2v4z" />
  </Icon>
);

// Lock Icon
const LockIcon = () => (
  <Icon className="text-green-500">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a3 3 0 116 0v2H9v-2z" />
  </Icon>
);

// Eye Icon (Visible)
const EyeIcon = () => (
  <Icon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </Icon>
);

// Eye Off Icon (Hidden)
const EyeOffIcon = () => (
  <Icon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.875 18.825A10.05 10.05 0 0112 19c4.478 0 8.268-2.943 9.542-7a9.97 9.97 0 01-1.563-3.029m-5.858-.908a3 3 0 11-4.243-4.243M21 21L3 3" />
  </Icon>
);


// Logo: Stylized F/V (Updated to use standard <img>)
const Logo = () => (
  <div className="w-12 h-12 text-xl font-extrabold rounded-lg flex items-center justify-center shadow-lg shadow-green-400/70">
    {/* Using standard img tag with a placeholder URL */}
    <Image
      src="/image3.png"
      alt="Future Innovatives Logo"
      width={58}
      height={58}
      className="rounded-lg" 
    />
  </div>
);

// --- COMPONENT PARTS ---

// --- INPUT COMPONENT (Reusable with Visibility Toggle and Error Display) ---

const SoftInput = ({ icon: IconComponent, placeholder, type: initialType = 'text', value, name, onChange, error }) => {
  const isPasswordField = initialType === 'password';
  const [showPassword, setShowPassword] = useState(false); 

  const inputType = isPasswordField 
      ? (showPassword ? 'text' : 'password') 
      : initialType;

  // Determine the padding-right for the input field to make space for the toggle icon
  const prClass = isPasswordField ? 'pr-10' : 'pr-6'; 

  // Add extra margin bottom if there's an error message to display
  const mbClass = error ? 'mb-6' : 'mb-3';

  return (
    <div className={`relative w-full ${mbClass}`}>
      {/* Left Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <IconComponent />
      </div>

      {/* Input Field */}
      <input
        type={inputType}
        name={name} // Added name attribute for form data
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full py-2.5 pl-10 ${prClass} text-gray-700 bg-white border-none rounded-full focus:outline-none 
          shadow-lg transition-all duration-300 placeholder:text-gray-400 text-sm
          ${error ? 'ring-2 ring-red-500 shadow-red-200/50' : 'shadow-gray-200/50 hover:shadow-md hover:shadow-gray-200/70'}`}
        required
      />

      {/* Eye Icon Button */}
      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-green-600 transition-colors duration-200 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}

      {/* Error Message Display */}
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-3 absolute -bottom-5 left-0 text-left font-medium">{error}</p>
      )}
    </div>
  );
};


// --- MAIN COMPONENT ---

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  
  // State variables for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for client-side field validation errors
  const [errors, setErrors] = useState({});
  
  // State for server-side API response messages
  const [apiSuccessMessage, setApiSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // 1. Email validation: Must be present
    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // 2. Password validation: Must be present
    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {  
  e.preventDefault();
try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // IMPORTANT: include cookies
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    setApiError(`❌ ${data.message || 'Login failed'}`);
    setLoading(false);
    return;
  }

  // Login succeeded; server set cookie; data.user contains role
  setApiSuccessMessage('✅ Login successful — Redirecting...');

  // Redirect based on role
    if (data.user.role === "admin") {
      window.location.href = "/dashboard"; 
    } else if (data.user.role === "employee") {
      window.location.href = "/dashboard/salesinventorymanagement";
    }

} catch (err) {
  setApiError('❌ Network error');
  setLoading(false);
}

    // e.preventDefault();
    // setApiSuccessMessage('');
    // setApiError('');

    // if (!validateForm()) {
    //   return; // Stop if client-side validation fails
    // }

    // setLoading(true);

    // try {
    //   const payload = {
    //     email: email,
    //     password: password,
    //   };

    //   // Use the mock API function 
    //   const response = await mockLoginApi(payload);

    //   const data = await response.json().catch(() => ({ message: response.statusText }));
      
    //   // Status 200 means OK (Success)
    //   if (response.ok && response.status === 200) {
    //     // --- START OF REDIRECT IMPLEMENTATION ---
    //     setApiSuccessMessage(`✅ Login successful! Redirecting to Dashboard...`);
        
    //     // In a real app, you would store the token (data.token) here.
        
    //     // Clear form fields
    //     setPassword(''); 
    //     setErrors({}); 

    //     // Redirect to dashboard after a successful login display (1.5s delay)
    //     setTimeout(() => {
    //         // Note: Since this is a single component file without a router,
    //         // we use direct window navigation to simulate the redirect.
    //         window.location.href = '/dashboard';
    //     }, 1500); 
    //     // --- END OF REDIRECT IMPLEMENTATION ---

    //   } else {
    //     // Handle simulated server-side errors (e.g., 401 Unauthorized)
    //     const msg = data.message || `Server Error: Status ${response.status}.`;
    //     setApiError(`❌ Error: ${msg}`);
    //   }
    // } catch (error) {
    //   console.error("Login Error:", error);
    //   // Handle network errors
    //   setApiError('❌ Error: Network error or server is unavailable.');
    // } finally {
    //   // Only set loading to false in the case of a failed login, 
    //   // as successful login initiates a redirect which will unload the component.
    //   if (apiError || !apiSuccessMessage) { 
    //     setLoading(false);
    //   }
    // }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4">
      {/* Reduced max-w-6xl to max-w-4xl */}
      <div className="w-full grid lg:grid-cols-2 rounded-xl overflow-hidden shadow-xs bg-white">

        {/* 1. Left Panel (Image - Hidden on small screens) */}
        <div className="hidden lg:block bg-green-600 p-6 relative">
          <div className="absolute inset-0 bg-cover bg-center opacity-50"
               // Updated style to use a placeholder image URL
               style={{backgroundImage: 'url(/image4.jpg)'}}>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-white text-center">
            <h1 className="text-3xl font-bold mb-3">Cross-Talk Innovatives</h1>
            <p className="text-base">Access all your cutting-edge tools and products in one secure place.</p>
          </div>
        </div>

        {/* 2. Right Panel (Sign In Form) */}
        {/* Reduced padding */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center items-center w-full">
          <div className="max-w-md w-full text-center">
            
            {/* Logo and Headings */}
            <div className="mb-8"> {/* Reduced mb-10 to mb-8 */}
              <div className="flex justify-center mb-5">
                <Logo />
              </div>
              {/* Reduced text-3xl to text-2xl */}
              <h1 className="text-2xl font-semibold text-gray-800">Welcome back!</h1>
              <p className="text-gray-500 mt-1">Login to your account</p>
            </div>
                {/* API Status Message Display (Success or Error) */}
            {(apiSuccessMessage || apiError) && (
              <div 
                className={`border px-4 py-3 rounded-xl relative mb-4 text-sm font-medium transition-opacity duration-300 ${
                  apiSuccessMessage 
                    ? 'bg-green-100 border-green-400 text-green-700'
                    : 'bg-red-100 border-red-400 text-red-700'
                }`} 
                role="alert"
              >
                {apiSuccessMessage || apiError}
              </div>
            )}
            

             <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <SoftInput
                icon={EmailIcon}
                name="email"
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: null})) }}
                error={errors.email}
              />
              
              {/* Password Input (With Toggle) */}
              <SoftInput
                icon={LockIcon}
                name="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: null})) }}
                error={errors.password}
              />

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 mt-6 text-base font-semibold text-white rounded-full bg-green-600 border-none transition-all duration-300
                  shadow-xl shadow-green-500/50 hover:bg-green-700 active:translate-y-0.5 disabled:opacity-50 flex justify-center items-center`} 
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8"> {/* Reduced my-10 to my-8 */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                {/* <span className="px-4 bg-white text-gray-500">
                  Or sign in with
                </span> */}
              </div>
            </div>


            {/* Sign Up Link */}
            {/* <p className="mt-8 text-gray-600 text-xs sm:text-sm"> 
                  Dont have an account?
              <a href="/signup" className="font-medium text-green-600 hover:underline">
                Sign up here
              </a>
            </p> */}
            
          </div>
        </div>
      </div>
    </div>
  );
}