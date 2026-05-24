import { Suspense } from 'react';

export function LazyLoad({ children }) {
  return (
    <Suspense
      fallback={
        <div className="bg-white/70 inset-0 fixed flex z-50">
          <div className="flex justify-center items-center h-full w-full">
            <img
              src="/loading.png"
              alt="loading page with a bird"
              className="h-30 w-30 animate-pulse"
            />
            <p className="font-family text-xl text-black/40">
              Birdie 正在赶来<span className="animate-bounce">...</span>
            </p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
