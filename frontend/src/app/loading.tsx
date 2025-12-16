export default function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-white" />
        <div className="absolute inset-0 rounded-full blur-md bg-white/20"/>
      </div>

      <p className="mt-6 text-sm uppercase tracking-widest text-gray-400">
        Initializing Cryptoboard
      </p>
    </div>
  )
}
