export const extractTermFromUrl = (url: string) => {
    let term = url.split("/").at(-1);
    if(typeof term != "string")
        return ""
    term = term?.replaceAll(" ", "_");
    return encodeURIComponent(term)
}