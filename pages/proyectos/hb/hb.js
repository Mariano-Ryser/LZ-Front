import Link from 'next/link'

export default function Hb() {
  return (
    <>

  <Link href="items/items"><li>/hb/items</li></Link>
  <Link href="monsters/monsters"><li>/hb/monsters</li></Link>
  <Link href="sounds/music"><li>/hb/sounds</li></Link>

  <style jsx>{`
  

      
@media (max-width: 600px) {
 
                 
}
       
         `}</style>
    </>
  )
}