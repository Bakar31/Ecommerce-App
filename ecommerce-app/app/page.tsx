import Image from 'next/image'
import Navbar from './components/navbar'

export default function Home() {
  return (
    <div>
      <div>
        <Navbar/>
      </div>
      <div className='flex justify-center'>
        <Image
          src="/cover-photo.jpg"
          width={700}
          height={500}
          alt="Cover photo" 
          />
      </div>
    </div>
    
    
  )
}
