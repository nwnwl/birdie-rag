function Message({ children, role }) {
  return (
    <div className={`bg-[#F0F1E6] flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="py-2 bg-[#c8d4b6] rounded-4xl px-4 flex">{children}</div>
    </div>
  );
}

export default Message;
