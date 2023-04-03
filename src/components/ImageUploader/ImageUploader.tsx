import React, { useState, useEffect } from 'react'

//import './ImageUploader.css'

interface IIimageUploaderProps {
  type: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  update: Function
  // eslint-disable-next-line @typescript-eslint/ban-types
  upload: Function
}

export const ImageUploader = React.forwardRef<HTMLInputElement, IIimageUploaderProps>((props, ref) => {
  const {type, update, upload} = props
  const [image, setImage] = useState<any>(null)

  useEffect(() => {
    if(!image) return

    update(type, URL.createObjectURL(image))
    upload(type, image)
    setImage(null)
  }, [image, type, update, upload])

  const onImageChange = (e: any) => {
    setImage(e.target.files.item(0))
  }

  return (
    <input ref={ref} type='file' accept='image/*' onChange={(e) => onImageChange(e)} style={{display: 'none'}} />
  )
})
ImageUploader.displayName = 'ImageUploader'



// interface IIimageUploaderProps {
//   uploadImage: Function;
// };

// export const ImageUploader: React.FC<IIimageUploaderProps> = (props: IIimageUploaderProps) => {
//   const [images, setImages] = useState<any>([]);
//   const [imageURLs, setImageURLs] = useState([]);

//   useEffect(() => {
//     if(images.length < 1) return;
//     const newImgURLs: any = [];
//     images.forEach((i: any) => { 
//       newImgURLs.push(URL.createObjectURL(i))
//     });
//     setImageURLs(newImgURLs);
//   }, [images]);

//   const onImageChange = (e: any) => {
//     const t: FileList = e.target.files;
//     setImages(Array.from(t));
//   }

//   return (
//     <>
//       <input type='file' multiple accept='image/*' onChange={(e) => onImageChange(e)} />
//       {imageURLs.map((imageSrc, key) => <img key={`upload-${key}`} src={imageSrc} alt='upload' />)}

//       <button
//         className="Button-standard"
//         style={{ marginTop: "1rem" }}
//         onClick={() => props.uploadImage(images[0], 'avatar')}
//       >
//         Upload
//       </button>
//     </>
//   );
// };