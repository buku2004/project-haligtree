import Footer from './components/Footer'
import DashboardShell from './components/DashboardShell'

export default async function page() {
  await new Promise((res) => setTimeout(res, 2000))

  return (
    <>
      <DashboardShell />
      <Footer/>
    </>
  )
}
