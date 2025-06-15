export const extractTermFromUrl = (url: string) => {
    let term = url.split("/").at(-1);
    if(typeof term != "string")
        return "";
    return term
}