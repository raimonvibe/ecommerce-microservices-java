export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gold-600/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
