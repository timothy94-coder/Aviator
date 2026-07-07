import { useEffect, useState } from "react";
import { getUser } from "../lib/auth";

export function useAuth() {

    const [user, setUser] = useState(null);


    useEffect(() => {

        // Load logged in user
        const currentUser = getUser();

        setUser(currentUser);



        // Listen for login changes
        const updateUser = () => {

            const updated = getUser();

            setUser(updated);

        };


        window.addEventListener(
            "auth-change",
            updateUser
        );


        return () => {

            window.removeEventListener(
                "auth-change",
                updateUser
            );

        };


    }, []);



    return {
        user
    };

}