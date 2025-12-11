import Image from "next/image";

function Loading() {
  return (
    // <body className="body bg-black/50">
    <div className="flex items-center justify-center min-h-screen transparent bg-zinc-800">
      {/* <h1 className="text-white">Loading...</h1> */}
      <Image 
        src="/images/preloader.gif" 
        alt="preloader" 
        width={100} 
        height={100} 
        unoptimized
      />
    </div>
    // </body>
  )
}

export default Loading;
