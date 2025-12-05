"use client"

import React, { useState } from 'react';

// --- Configuration: Mock API Setup ---
// We replace the external fetch call with a mock function that simulates network latency (1.5s)
// and returns predefined success or error responses to ensure the component's state logic is sound.
const mockRegisterApi = (payload) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple logic to simulate server errors (e.g., email already exists)
      if (payload.email.includes('error@')) {
        resolve({
          ok: false,
          status: 409,
          json: () => Promise.resolve({ 
            message: 'Email address already registered. Please try logging in.' 
          })
        });
        return;
      }

      // Simulate successful registration (HTTP 201 Created)
      resolve({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ 
          message: `User ${payload.name} successfully registered.` 
        })
      });

    }, 1500); // 1.5 second delay to simulate network latency
  });
};

// --- INLINE ICON DEFINITIONS (for self-contained file) ---

const Icon = ({ children, className = '' }) => (
  <svg className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {children}
  </svg>
);

// User Icon
const UserIcon = () => (
  <Icon className="text-green-500">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </Icon>
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

// Logo: Stylized C.T.I.
const Logo = () => (
  <div className="w-12 h-12 text-xl font-extrabold rounded-lg flex items-center justify-center shadow-lg shadow-green-400/70">
    <img 
      src="/image3.png"
      alt="Cross-Talk Innovatives Logo"
      width={58}
      height={58}
      className="rounded-lg" 
    />
  </div>
);

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

// Regex: Min 8 chars, at least one uppercase, one lowercase, one number, one symbol
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-+])[A-Za-z\d!@#$%^&*-+]{8,}$/;


export default function SignUp() {
  const [loading, setLoading] = useState(false);
  
  // State variables for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State for client-side field validation errors
  const [errors, setErrors] = useState({});
  
  // State for server-side API response messages
  const [apiSuccessMessage, setApiSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // 1. Username check (Mapping to 'name' in API payload)
    if (!username.trim()) {
        newErrors.username = 'Username cannot be empty.';
        isValid = false;
    }

    // 2. Email validation: Must contain @
    if (!email.includes('@') || email.length < 5) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // 3. Password validation: Upper, lower, number, symbol (and min 8 chars for security)
    if (!PASSWORD_REGEX.test(password)) {
      newErrors.password = 'Password requires 8+ chars, upper/lower case, a number, and a symbol.';
      isValid = false;
    }

    // 4. Confirm Password match
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiSuccessMessage('');
    setApiError('');

    if (!validateForm()) {
      return; // Stop if client-side validation fails
    }

    setLoading(true);

    try {
      const payload = {
        name: username, // Mapping username state to 'name' field for API
        email: email,
        password: password,
      };

      // Use the mock API function instead of fetch
      const response = await mockRegisterApi(payload);

      // Attempt to read the JSON body for messages regardless of status
      const data = await response.json().catch(() => ({ message: response.statusText }));
      
      // Status 201 means Created (Success)
      if (response.ok && response.status === 201) {
        setApiSuccessMessage(`✅ Success! ${data.message || 'Registration successful.'}`);
        // Clear form fields after success
        setUsername(''); 
        setEmail(''); 
        setPassword(''); 
        setConfirmPassword('');
        setErrors({});
         // Clear any residual validation errorsc
         setTimeout(() => {
            window.location.href = '/signin'; // This triggers the navigation
        }, 2000);

      } else {
        // Handle simulated server-side errors (e.g., 409 Conflict)
        const msg = data.message || `Server Error: Status ${response.status}.`;
        setApiError(`❌ Error: ${msg}`);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      // This catch block would normally handle network errors (though unlikely with the mock)
      setApiError('❌ Error: An unexpected issue occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 font-sans">
      {/* <script src="https://cdn.tailwindcss.com"></script> */}
      <div className="w-full grid lg:grid-cols-2 rounded-xl overflow-hidden shadow-xs bg-white">

        {/* 1. Left Panel (Image) */}
        <div className="hidden lg:block bg-green-600 p-6 relative">
          {/* Using CSS background-image style */}
          <div className="absolute inset-0 bg-cover bg-center opacity-50 bg-blend-multiply"
              style={{backgroundImage: 'url(/image4.jpg)'}}>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-white text-center">
            <h1 className="text-4xl font-extrabold mb-3">Cross-Talk Innovatives</h1>
            <p className="text-lg mt-2 font-light">Your journey to innovation starts here.</p>
            <p className="text-sm mt-8 opacity-80">Sign up in seconds and access premium tools.</p>
          </div>
        </div>

        {/* 2. Right Panel (Sign Up Form) */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center items-center w-full">
          <div className="max-w-md w-full text-center">
            
            {/* Logo and Headings */}
            <div className="mb-6">
              <div className="flex justify-center mb-2">
                <Logo />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
              <p className="text-gray-500 mt-1">Create your secure account</p>
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
              
              {/* Username Input (Maps to 'name' in API) */}
              <SoftInput
                icon={UserIcon}
                name="username"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrors(prev => ({...prev, username: null})) }}
                error={errors.username}
              />
              
              {/* Email Input */}
              <SoftInput
                icon={EmailIcon}
                name="email"
                placeholder="Email Address"
                type="text"
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

              {/* Confirm Password Input (With Toggle) */}
              <SoftInput
                icon={LockIcon}
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({...prev, confirmPassword: null})) }}
                error={errors.confirmPassword}
              />

              {/* Sign Up Button */}
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
                  'Sign up'
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <p className="mt-6 text-gray-600 text-xs sm:text-sm">
              Already have an account?
              <a href="/signin" className="font-medium text-green-600 hover:underline ml-1">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}