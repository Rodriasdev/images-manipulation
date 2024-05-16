document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('image-upload');
    const originalImage = document.getElementById('original-image');
    const croppedResizedCanvas = document.getElementById('cropped-resized-canvas');
    const mirroredCanvas = document.getElementById('mirrored-canvas');

    imageUpload.addEventListener('change', event => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = e => {
            originalImage.src = e.target.result;

            originalImage.onload = async () => {
                const tensor = tf.browser.fromPixels(originalImage);
                
             
                const croppedTensor = tf.image.cropAndResize(
                    tensor.expandDims(0),
                    [[0.1, 0.1, 0.9, 0.9]],
                    [0],
                    [originalImage.width, originalImage.height]
                ).squeeze();

              
                const resizedTensor = tf.image.resizeBilinear(croppedTensor, [150, 150]);

          
                await tf.browser.toPixels(resizedTensor, croppedResizedCanvas);

             
                const mirroredTensor = resizedTensor.reverse(1);

       
                await tf.browser.toPixels(mirroredTensor, mirroredCanvas);

                tensor.dispose();
                croppedTensor.dispose();
                resizedTensor.dispose();
                mirroredTensor.dispose();
            };
        };

        reader.readAsDataURL(file);
    });
});
