import { lazy, Suspense } from 'react';
import { About } from './components/About';
import { AstronautLayer } from './components/AstronautLayer';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Members } from './components/Members';
import { Navbar } from './components/Navbar';
import { PlanetsLayer } from './components/PlanetsLayer';
import { Repertoire } from './components/Repertoire';
import { RocketLayer } from './components/RocketLayer';
import { SpaceBackground } from './components/space/SpaceBackground';
import { ToastProvider } from './components/ui/Toast';

const InstagramSection = lazy(() => import('./components/InstagramSection').then((module) => ({ default: module.InstagramSection })));
const Gallery = lazy(() => import('./components/Gallery').then((module) => ({ default: module.Gallery })));
const PublicRecordsSection = lazy(() => import('./components/PublicRecordsSection').then((module) => ({ default: module.PublicRecordsSection })));
const Testimonials = lazy(() => import('./components/Testimonials').then((module) => ({ default: module.Testimonials })));
const Contact = lazy(() => import('./components/Contact').then((module) => ({ default: module.Contact })));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));

const isAdminRoute = window.location.pathname === '/admin';

export default function App() {
  if (isAdminRoute) {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-surface">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <AdminPanel />
      </Suspense>
    );
  }

  return (
    <ToastProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-[#030305] text-on-surface">
        <SpaceBackground />
        <PlanetsLayer />
        <AstronautLayer />
        <RocketLayer />
        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Members />
            <Repertoire />
            <Suspense fallback={null}>
              <InstagramSection />
              <Gallery />
              <PublicRecordsSection />
              <Testimonials />
              <Contact />
            </Suspense>
          </main>
          <Footer />
        </div>
      </div>
    </ToastProvider>
  );
}