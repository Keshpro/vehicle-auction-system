import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
export default function MainLayout(){return <div className="min-h-screen bg-[#0b0b0c]"><Navbar/><main><Outlet/></main><Footer/></div>}
