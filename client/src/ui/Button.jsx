function Button({ children, onClick, type }) {
  let className;
  if (type === "begin")
    className =
      "rounded-2xl lg:px-8 lg:py-6 md:px-6 md:py-4 px-4 py-2 bg-[#9DB37F] font-cause md:text-2xl text-xl text-[#F0F1E6] hover:bg-[#7d8e65]/90  btn focus-visible:border-2 focus-visible:border-[#7d8e65] ";

  if (type === "sidebar")
    className =
      "sm:px-7 px-4 py-5.25  rounded-r-full bg-[#9DB37F]  text-xl text-[#F0F1E6] z-50 hover:bg-[#7d8e65]/90  btn focus-visible:border-2 focus-visible:border-[#7d8e65]";

  if (type === "start")
    className =
      "rounded-2xl bg-[#9DB37F] py-2   font-cause mt-8 text-amber-50 hover:bg-[#7d8e65]/90 btn  focus-visible:border-2 focus-visible:border-[#7d8e65]";

  if (type === "sign")
    className =
      "underline px-4 ml-2 bg-[#9DB37F] text-white rounded-2xl  hover:bg-[#7d8e65]/90  focus-visible:border-2   focus-visible:border-[#7d8e65] btn";

  if (type === "question")
    className =
      "bg-[#9DB37F] rounded-full hover:bg-[#7d8e65]/90 px-4 py-3 text-[#F0F1E6]  btn focus-visible:border-2 focus-visible:border-[#7d8e65] ";

  if (type === "logout")
    className =
      " bg-[#fcf6bb] text-black/60 rounded-l-full sm:py-4 sm:px-8 py-2 pl-4 pr-5 font-cause sm:text-2xl text-base hover:bg-[#f7ee9e]/90  btn  focus-visible:border-2 focus-visible:border-[#b4b191]";

  if (type === "confirm")
    className =
      " bg-red-800 text-white font-family lg:px-8 lg:py-2 md:px-6 md:py-1 py-1.5 text-2xl rounded-3xl hover:bg-red-900  focus-visible:border-red-900 focus-visible:border-2 btn";

  if (type === "cancel")
    className =
      "bg-[#EAEAEA] text-black/70    font-family lg:px-8 lg:py-2 md:px-6 md:py-1 py-1.5 text-2xl rounded-3xl hover:bg-[#e2dfdf]   focus-visible:border-[#d1d0d0] focus-visible:border-2 btn";

  if (type === "selectFile")
    className =
      "rounded-2xl md:px-6 md:py-4 px-4 py-2   bg-[#9DB37F]  text-[#F0F1E6] hover:bg-[#7d8e65]/90  focus-visible:border-2 focus-visible:border-[#7d8e65] font-family text-base tracking-wider ml-4 btn";

  if (type === "refresh")
    className =
      " bg-[#9DB37F] rounded-2xl md:px-4 md:py-2 px-2 py-1 text-[#F0F1E6] font-family text-base tracking-wider ml-4 hover:bg-[#7d8e65]/90  focus-visible:border-2 focus-visible:border-[#7d8e65] btn";

  if (type === "file")
    className =
      " text-black/70 sm:text-[20px] text-base hover:underline  focus-visible:border-2 focus-visible:border-[#7d8e65] ";

  if (type === "chat")
    className =
      " text-black/70 sm:text-[20px] text-base hover:underline  focus-visible:border-2 focus-visible:border-[#7d8e65]";

  if (type === "delete")
    className =
      " bg-red-300 rounded-2xl px-2 py-1 hover:bg-red-400  focus-visible:border-red-900  focus-visible:border-2 btn ";

  if (type === "rename")
    className =
      " bg-white/60 px-2 py-1 rounded-2xl hover:bg-gray-200  focus-visible:border-2 focus-visible:border-gray-400 btn";

  if (type === "changeConfirm")
    className =
      " focus-visible:border-2 leading-none focus-visible:text-red-800 rounded-md text-red-300 btn hover:text-red-400";

  if (type === "changeCancel")
    className =
      " focus-visible:border-2 py-1 leading-none  rounded-md focus-visible:border-gray-400 bg-white  hover:bg-gray-300 btn";

  if (type === "history")
    className =
      " hover:bg-gray-200/80 text-black/40 mr-2 rounded-md px-2 focus-visible:border focus-visible:border-gray-400 btn right-1 z-50";

  return (
    <button
      className={className}
      onClick={(e) => {
        onClick?.(e);
        {
          /* 在点击后移除焦点环 */
        }
        e.currentTarget.blur();
      }}
      type={type === "start" ? "submit" : "button"}
    >
      {children}
    </button>
  );
}

export default Button;
