export const errorHandler = (error: any) => {
    let errorMessage = error.message;

    if(error?.response?.data?.message){
        errorMessage = error.response.data.message;
    } else {
        if(error.response.data?.detail){
            if(error.response.data.detail[0]){
                errorMessage = error.response.data.detail[0].msg;
            }
        }
    }

    return errorMessage;
}