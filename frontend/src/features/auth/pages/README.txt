S&S Vehicle Auction | Registration & Login page redesign

These two replacement pages match the existing Schokman & Samerawickreme theme:
navy #101827, red-600, slate/white, lucide-react icons and Tailwind utility classes.

1. Copy RegisterPage.tsx and LoginPage.tsx into:
   frontend/src/features/auth/pages/
   Overwrite the older pages only.
2. Keep your current authService.ts file unchanged.
3. Ensure frontend/src/routes/AppRoutes.tsx imports the pages and contains:
   <Route path="login" element={<LoginPage />} />
   <Route path="register" element={<RegisterPage />} />
4. In the frontend directory run: npm run dev
5. Test http://localhost:5173/register and http://localhost:5173/login

Uses the project's existing React, react-router-dom, Tailwind CSS v4,
and lucide-react dependencies. No new packages are required.

Note: the background photo is loaded from Unsplash and requires internet;
the dark navy gradient remains readable without it.
