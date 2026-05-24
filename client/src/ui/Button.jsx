function Button({ children, onClick, type }) {
  let className;
  if (type === "begin")
    className =
      "rounded-2xl lg:px-8 lg:py-6 md:px-6 md:py-4 px-4 py-2  cursor-pointer  bg-[#9DB37F] font-cause md:text-2xl text-xl text-[#F0F1E6] hover:bg-[#7d8e65]/90 transition-colors outline-none focus-visible:border-2 focus-visible:border-[#7d8e65] duration-500";

  if (type === "sidebar")
    className =
      "sm:px-7 px-4 py-5.25 cursor-pointer rounded-r-full bg-[#9DB37F]  text-xl text-[#F0F1E6] z-50 hover:bg-[#7d8e65]/90 transition-colors outline-none duration-500 focus-visible:border-2 focus-visible:border-[#7d8e65]";

  if (type === "start")
    className =
      "rounded-2xl bg-[#9DB37F] py-2 cursor-pointer  font-cause mt-8 text-amber-50 hover:bg-[#7d8e65]/90 transition-colors duration-500 outline-none focus-visible:border-2 focus-visible:border-[#7d8e65]";

  if (type === "sign")
    className =
      "underline px-4 ml-2 bg-[#9DB37F] text-white rounded-2xl cursor-pointer hover:bg-[#7d8e65]/90 transition-colors outline-none focus-visible:border-2   focus-visible:border-[#7d8e65] duration-500";

  if (type === "question")
    className =
      "bg-[#9DB37F] rounded-full hover:bg-[#7d8e65]/90 px-4 py-3 text-[#F0F1E6] cursor-pointer duration-500 transition-colors focus-visible:border-2 focus-visible:border-[#7d8e65] outline-none";

  if (type === "logout")
    className =
      "cursor-pointer bg-[#fcf6bb] text-black/60 rounded-l-full sm:py-4 sm:px-8 py-2 pl-4 pr-5 font-cause sm:text-2xl text-base hover:bg-[#f7ee9e]/90 transition-colors outline-none duration-500  focus-visible:border-2 focus-visible:border-[#b4b191]";

  if (type === "confirm")
    className =
      "cursor-pointer bg-red-800 text-white font-family lg:px-8 lg:py-2 md:px-6 md:py-1 py-1.5 text-2xl rounded-3xl hover:bg-red-900 transition-colors outline-none focus-visible:border-red-900 focus-visible:border-2 duration-500";

  if (type === "cancel")
    className =
      "bg-[#EAEAEA] text-black/70 cursor-pointer   font-family lg:px-8 lg:py-2 md:px-6 md:py-1 py-1.5 text-2xl rounded-3xl hover:bg-[#e2dfdf] transition-colors outline-none  focus-visible:border-[#d1d0d0] focus-visible:border-2 duration-500";

  if (type === "selectFile")
    className =
      "rounded-2xl md:px-6 md:py-4 px-4 py-2 cursor-pointer  bg-[#9DB37F]  text-[#F0F1E6] hover:bg-[#7d8e65]/90 transition-colors outline-none focus-visible:border-2 focus-visible:border-[#7d8e65] font-family text-base tracking-wider ml-4 duration-500";

  if (type === "refresh")
    className =
      "cursor-pointer bg-[#9DB37F] rounded-2xl md:px-4 md:py-2 px-2 py-1 text-[#F0F1E6] font-family text-base tracking-wider ml-4 hover:bg-[#7d8e65]/90 transition-colors outline-none focus-visible:border-2 focus-visible:border-[#7d8e65] duration-500";

  if (type === "file")
    className =
      "cursor-pointer text-black/70 sm:text-[20px] text-base hover:underline outline-none focus-visible:border-2 focus-visible:border-[#7d8e65] ";

  if (type === "chat")
    className =
      "cursor-pointer text-black/70 sm:text-[20px] text-base hover:underline outline-none focus-visible:border-2 focus-visible:border-[#7d8e65]";

  if (type === "delete")
    className =
      "cursor-pointer bg-red-300 rounded-2xl px-2 py-1 hover:bg-red-400 transition-colors outline-none focus-visible:border-red-900  focus-visible:border-2 duration-500 ";

  if (type === "rename")
    className =
      "cursor-pointer bg-white/60 px-2 py-1 rounded-2xl hover:bg-gray-200 transition-colors outline-none focus-visible:border-2 focus-visible:border-gray-400 duration-500";

  if (type === "changeConfirm")
    className =
      "outline-none  cursor-pointer focus-visible:border-2 leading-none focus-visible:text-red-800 rounded-md duration-500";

  if (type === "changeCancel")
    className =
      "outline-none  cursor-pointer focus-visible:border-2 py-1 leading-none  rounded-md focus-visible:border-gray-400 duration-500 transition-colors";

  if (type === "history")
    className =
      "outline-none  cursor-pointer hover:bg-gray-200/80 text-black/40 mr-2 rounded-md px-2 focus-visible:border focus-visible:border-gray-400 duration-500 transition-colors right-1 z-50";

  return (
    <button
      className={className}
      onClick={(e) => {
        onClick?.(e);
        e.currentTarget.blur();
      }}
      type={type === "start" ? "submit" : "button"}
    >
      {children}
    </button>
  );
}

export default Button;
