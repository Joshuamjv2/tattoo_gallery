import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoutes from "./protected";
import LoadingModal from "../components/common/Loading";


// Lazy-loaded public pages
const ArtistsPage = lazy(() => import("../pages/landing/Artists/Atists"));
const SingleArtistPage = lazy(() => import("../pages/landing/Artists/SingleArtist/SingleArtist"));
const DesignsPage = lazy(() => import("../pages/landing/Designs/Designs"));
const IdeasPage = lazy(() => import ("../pages/landing/TattooIdeas/Ideas"))
const Login = lazy(() => import("../pages/admin/Auth/Login"));
const BookAppointment = lazy(() => import("../pages/landing/BookAppointment/BookAppointment"));


// Lazy-loaded admin pages
const AdminDesigns = lazy(() => import("../pages/admin/Designs"));
const AdminTattooIdeas = lazy(() => import("../pages/admin/Ideas"))
const Appointments = lazy(() => import("../pages/admin/Appointments/Appointments"));
const Settings = lazy(() => import("../pages/admin/Settings"));
const AdminArtists = lazy(() => import("../pages/admin/Artists/Artists"));
const SingleAdminArtistPage = lazy(() => import("../pages/admin/Artists/SingleArtist/SingleAdminArtistPage"));

function AppRoutes() {
    return (
        <Router>
            <Suspense fallback={<LoadingModal with_lazy={true} />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<ArtistsPage />} />
                    <Route path="/:id" element={<SingleArtistPage />} />
                    <Route path="/designs" element={<DesignsPage />} />
                    <Route path="/tattoo_ideas" element={<IdeasPage />} />
                    <Route path="/login" element={<Login />} />

                    {/* Admin (Protected) Routes */}
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/admin" element={<Appointments />} />
                        <Route path="/admin/designs" element={<AdminDesigns />} />
                        <Route path="/admin/settings" element={<Settings />} />
                        <Route path="/admin/artists" element={<AdminArtists />} />
                        <Route path="/admin/tattoo_ideas" element={<AdminTattooIdeas />} />
                        <Route path="/admin/artists/:id" element={<SingleAdminArtistPage />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<div className="p-8 text-center text-lg">Page not found</div>} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default AppRoutes;
