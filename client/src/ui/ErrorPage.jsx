import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div className="h-full w-full bg-[#f5f5f5]">
      <div className="h-full w-full bg-[url('/b8.png')] bg-center bg-no-repeat z-50 flex flex-col justify-center items-center font-cause text-3xl text-black/40 gap-4 text-center">
        <p className="translate-y-8 translate-x-2">
          Page Not Found
          <Link to="/" className="block underline">
            return
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ErrorPage;
