import gif from './components/uchiha-sharingan.gif'

export default function Loading() {
  return (
    <div className="h-full w-full ">
      <div className="flex justify-center items-center h-full w-full">
        <img width={150} height={150} src={gif.src} alt=""/>
      </div>
    </div>
  )
}

