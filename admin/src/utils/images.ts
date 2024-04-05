export function getBase64(image: File): Promise<string> {
  const reader = new FileReader();

  return new Promise(resolve => {
    reader.onload = e => {
      resolve(e.target!.result as string);
    };

    reader.readAsDataURL(image);
  });
}

export const getPathsFromFileList = (images: FileList, city_id: string) => {
  return Array.from(images).map(
    image => `${"/static/media/sights/" + city_id}/${image.name}`,
  );
};

export const createImagesFormData = (formData: FormData, images: FileList) => {
  Array.from(images).forEach(file => {
    formData.append("files[]", file);
  });
};
