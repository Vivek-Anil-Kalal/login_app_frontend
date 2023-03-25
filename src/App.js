import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PageNotFound, Username, Profile, Password, Recovery, Register, Reset } from './components'
import { AuthorizeUser, ProtectRoute } from './middleware/auth.js'
/* root routes */
const router = createBrowserRouter([
    {
        path: "/",
        element: <Username />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/password",
        element: <ProtectRoute > <Password /> </ProtectRoute>
    },
    {
        path: "/profile",
        element: <AuthorizeUser > <Profile /> </AuthorizeUser>
    },
    {
        path: "/recovery",
        element: <Recovery />
    },
    {
        path: "/reset",
        element: <Reset />
    },
    {
        // This path will specify that there is any invalid request then show the page not found component
        path: "*",
        element: <PageNotFound />
    },
])

const App = () => {
    return (
        <main>
            <RouterProvider router={router}>

            </RouterProvider>
        </main>
    )
}

export default App