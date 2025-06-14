export function useScripts() {
  const formatText = (text) => {
    if (!text) return "";

    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<p>$1</p>")
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>'
      )
      .replace(/\n/g, "<br>")
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto mt-2 mb-2"><code class="font-mono text-sm">$1</code></pre>'
      )
      .replace(/^\d+\.\s(.+)$/gm, '<div class="ml-4 mb-1">• $1</div>')
      .replace(/^[-*]\s(.+)$/gm, '<div class="ml-4 mb-1">• $1</div>');
  };
  const isValidImageUrl = (url) =>
    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);

  return { formatText, isValidImageUrl };
}
