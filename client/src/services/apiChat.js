// 防止用户在ai回答时加载历史聊天记录，处理并发竞争，（旧的流式回答没有被中止，token 会"泄漏"到新加载的历史对话里，污染数据）
let controller = null;

export function cancelStream() {
  controller?.abort();
}

// 流式输出
export async function getAnswerStream({ question, token, onToken }) {
  // 虽然客户端和服务端断了，但是服务端仍然完整回答了answer，然后存储到了数据库，所以loadHistory仍能看见完整answer
  cancelStream();
  controller = new AbortController();

  const res = await fetch("/api/chat/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal: controller.signal,
  });

  if (!res.ok) {
    // 防止后端返回的body不是JSON而报错
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "请求失败");
  }

  // ReadableStream : 浏览器原生 API，用于分块读取数据，不需要等全部数据到达才能开始处理。
  const reader = res.body.getReader();
  // UTF-8 文本解码器，把后续读到的字节（Uint8Array）转成字符串。
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let tokenBuffer = "";
  let rafId = null;

  function flush() {
    onToken(tokenBuffer);
    tokenBuffer = "";
    rafId = null;
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // stream: true, 确保中文不会乱码(中文三个字节可能被中间切断，暂存部分字节，下次调用拼接完整)。
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const content = line.slice(6);
      if (content === "[DONE]") {
        if (tokenBuffer) onToken(tokenBuffer);
        return;
      }
      const tokenText = JSON.parse(content);

      tokenBuffer += tokenText;
      if (rafId === null) rafId = requestAnimationFrame(flush);
      // 跟浏览器屏幕刷新同步,减少渲染浪费
    }
  }
  if (tokenBuffer) onToken(tokenBuffer);
}
