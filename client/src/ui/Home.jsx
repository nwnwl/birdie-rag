import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useSelector } from 'react-redux';

function Home() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  function handleClick() {
    if (token) {
      navigate('/chat');
    } else {
      navigate('/user');
    }
  }

  return (
    <div className="flex flex-col text-center lg:gap-20 md:gap-15 gap-10 lg:translate-0 md:translate-y-6 sm:translate-y-16 translate-y-20 justify-start  pt-40">
      <h1 className=" text-amber-900/90 ">
        <p className="lg:text-9xl md:text-8xl  sm:text-7xl text-6xl font-cause lg:mb-10 md:mb-8 sm:mb-6 mb-4  ">
          Hello, I'm birdie
        </p>
        <p className="lg:text-4xl md:text-3xl    sm:text-2xl text-xl font-cause">
          Smart Q&A for Your Documents
        </p>
      </h1>

      <div>
        <Button onClick={() => handleClick()} type="begin">
          Let's Start!
        </Button>
      </div>
    </div>
  );
}

export default Home;
