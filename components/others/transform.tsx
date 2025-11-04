import Image from 'next/image';
import VideoHeroWithModal from './video-hero';
import VideoHeroWithModal2 from './video-hero2';

const Transform = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mt-16 flex flex-col items-center">
        <h2 className="md:text-6xl text-[1.75rem] text-gray-600 md:font-medium font-bold">
          Transform Your Home
        </h2>
        <p className="md:text-2xl text-base mt-2 md:mt-4 text-gray-600 md:w-1/3 w-3/4 text-center font-medium">
          NEO takes on the boring and mundane tasks around the house so you can
          focus on what matters to you.
        </p>
      </div>

      {/* Video 1 */}
      <div className="flex relative items-center justify-center w-full min-h-[500px]">
        <VideoHeroWithModal />
      </div>

      {/* Clock Section */}
      <div className="flex items-center justify-center gap-16 my-8">
        <div className="flex justify-center flex-col items-center w-[250px] text-center gap-1.5">
          <Image src={'/img/hands.svg'} alt="" width={32} height={32} />
          <h3 className="font-semibold text-lg">Helping Hand</h3>
          <p className="text-lg">Provide assistance with everyday tasks</p>
        </div>
        <div className="flex justify-center flex-col items-center w-[250px] text-center gap-1.5">
          <Image src={'/img/clock.svg'} alt="" width={32} height={32} />
          <h3 className="font-semibold text-lg">Reclaim Time</h3>
          <p className="text-lg">
            Automate household chores, freeing time for priorities
          </p>
        </div>
        <div className="flex justify-center flex-col items-center w-[250px] text-center gap-1.5">
          <Image src={'/img/star.svg'} alt="" width={32} height={32} />
          <h3 className="font-semibold text-lg">Helpful Intelligence</h3>
          <p className="text-lg">
            Bring useful insight into every conversation
          </p>
        </div>
      </div>

      {/* Hero 2 */}
      <div className="flex relative items-center justify-center w-full min-h-[500px]">
        <VideoHeroWithModal2 />
      </div>
    </div>
  );
};

export default Transform;
