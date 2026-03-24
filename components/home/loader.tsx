export default function TypingLoader() {
  return (
    <div className="flex justify-start my-1">
      <div className="flex items-center justify-between bg-gray-200 px-3 py-2 rounded-xl w-14">
        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0s]" />
        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.15s]" />
        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.3s]" />
      </div>
    </div>
  );
}