import Alignment from './components/Alignment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default async function page() {
  await new Promise((res) => setTimeout(res, 2000))

  return (
    <>
      <Navbar />
      <Alignment />
      <Footer/>
    </>
  )
}
