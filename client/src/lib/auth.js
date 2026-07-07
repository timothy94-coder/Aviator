import { supabase } from "./supabase";


// SIGN UP PHONE
export async function signUp(phone, password) {

    const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();


    if(existing){

        throw new Error("Phone number already registered");

    }



    const { data, error } = await supabase
        .from("users")
        .insert([
            {
                phone,
                password
            }
        ])
        .select()
        .single();



    if(error){

        throw error;

    }



    localStorage.setItem(
        "user",
        JSON.stringify(data)
    );


    return data;

}





// LOGIN PHONE
export async function signIn(phone,password){


    const { data,error } = await supabase
        .from("users")
        .select("*")
        .eq("phone",phone)
        .eq("password",password)
        .maybeSingle();



    if(error){

        throw error;

    }



    if(!data){

        throw new Error(
            "Invalid phone number or password"
        );

    }



    localStorage.setItem(
    "user",
    JSON.stringify(data)
);


window.dispatchEvent(
    new Event("auth-change")
);


    return data;

}





// LOGOUT

export async function signOut(){

    localStorage.removeItem("user");


    window.dispatchEvent(
        new Event("auth-change")
    );

}




// CURRENT USER

export function getUser(){

    const saved = localStorage.getItem("user");


    return saved
        ? JSON.parse(saved)
        : null;

}