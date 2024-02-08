export const getBinaryData = async (image, callback) => {
    if (image) {
        try {
            let reader = new FileReader();

            reader.onloadend = function () {
                const result = reader.result;
                callback(result); // Call the callback function with the result
            };

            // triggers onloaded function
            reader.readAsDataURL(image);
        } catch (e) {
            console.error(e);
        }
    }
};
