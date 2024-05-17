import supabase from "./createClient";

export async function getEbook(filePath){
    const { data, error } = await supabase
    .storage
    .from('ebooks-bucket')
    .download(`${filePath}`);

    if(error){
        console.log('Error al obtener el pdf ', error)
        return null;
    }

    return data;
}

