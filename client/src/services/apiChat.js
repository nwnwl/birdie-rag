// 流式输出
export async function getAnswerStream({ question, token, onToken, onDone }) {
  const res = await fetch('/api/chat/ask', {
    method: 'POST',
    body: JSON.stringify({ question }),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || '请求失败');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let tokenBuffer = '';
  let rafId = null;

  function flush() {
    onToken(tokenBuffer);
    tokenBuffer = '';
    rafId = null;
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const content = line.slice(6);
      if (content === '[DONE]') {
        if (tokenBuffer) onToken(tokenBuffer);
        onDone();
        return;
      }
      const tokenText = JSON.parse(content);

      tokenBuffer += tokenText;
      if (rafId === null) rafId = requestAnimationFrame(flush);
    }
  }
  if (tokenBuffer) onToken(tokenBuffer);
}
