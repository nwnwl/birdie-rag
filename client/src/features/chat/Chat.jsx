import { useEffect, useRef, useState } from 'react';
import Button from '../../ui/Button';
import Message from '../../ui/Message';
import { useDispatch, useSelector } from 'react-redux';
import { answerStream } from './chatSlice';

function Chat() {
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const { token } = useSelector((state) => state.user);
  const { messages, loading } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    // question
    const question = input.trim();
    if (!question) return;
    setInput('');

    // answer
    await dispatch(answerStream({ question, token }));
  }

  function handleOnKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  useEffect(() => {
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 justify-around items-center h-screen w-screen bg-cover bg-center bg-fixed">
      <div className=" border border-amber-900 p-10 lg:w-5xl lg:h-140 md:w-4xl sm:w-2xl  h-130 w-130 bg-[#F0F1E6] mt-10 rounded-4xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ">
        <div
          className="flex flex-col overflow-y-auto h-full hide-scrollbar gap-8  scroll-smooth"
          ref={listRef}
        >
          {messages?.map((msg, i) => {
            return (
              <Message role={msg?.role} key={i}>
                {msg?.content}
              </Message>
            );
          })}

          {loading && messages[messages.length - 1]?.role === 'user' && (
            <div className="py-2 bg-[#c8d4b6] rounded-4xl px-4 self-start animate-bounce">
              Loading...
            </div>
          )}
        </div>
      </div>

      <form className="my-10 relative" onSubmit={(e) => handleSubmit(e)}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleOnKeyDown(e)}
          placeholder="给>Birdie发送消息"
          className="border bg-[#F0F1E6] lg:w-5xl md:w-4xl sm:w-2xl  w-130 h-30 rounded-full mb-20 font-family md:text-2xl text-xl overflow-y-auto text-amber-900/70 px-20 py-4 wrap-break-word hide-scrollbar  overflow-visible shadow-xl hover:shadow-2xl transition-shadow duration-300 outline-none"
        />
        <div className="absolute right-6 top-8 ">
          <Button type="question" onClick={(e) => handleSubmit(e)}>
            ⬆
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
