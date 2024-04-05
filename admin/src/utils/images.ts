export function getBase64(image: File): Promise<string> {
  const reader = new FileReader();

  return new Promise(resolve => {
    reader.onload = e => {
      resolve(e.target!.result as string);
    };

    reader.readAsDataURL(image);
  });
}
