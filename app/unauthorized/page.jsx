import Link from 'next/link';

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-8">
      
      {/* Container for Content */}
      <div className="max-w-md w-full text-center bg-white shadow-xl rounded-2xl p-8 sm:p-12 transition-all duration-300 hover:shadow-2xl">
        
        {/* Error Code & Main Title */}
        <h1 className="text-9xl font-extrabold text-indigo-600 mb-4 tracking-tighter">
          401
        </h1>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          Access Denied
        </h2>
        
        {/* Descriptive Message */}
        <p className="text-lg text-gray-600 mb-8">
          Oops! It looks like you dont have permission to view this page.
          <br />
          Please log in or ensure you have the correct user role.
        </p>
        
        {/* Image/Illustration */}
        {/* This is a visual aid. You can replace this with a custom illustration. */}
        



        
        {/* Call to Action */}
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Go Back to Authorized Area
        </Link>
      </div>
      
      {/* Footer text (Optional) */}
      <p className="mt-8 text-sm text-gray-500">
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
};

export default page;