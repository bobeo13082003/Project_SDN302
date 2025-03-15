import axios from "../../utils/CustomizeApi";

export const getAllAds = async () => {
  return axios.get("/ads/get-ads");
};

export const addNewAds = async (
  title: string,
  image: File,
  link: string

) => {
  console.log(title, image, link);
  
  const formData = new FormData();
  formData.append("title", title);
  formData.append("image", image);
  formData.append("link", link);
  return axios.post("ads/add-ads", formData);
};

export const deleteAds = async (id: string) => {
  return axios.delete("ads/deleteAds", {
    params: { id },
  });
};

export const updateAds = async (
  id : string,
  title: string,
  image: File,
  link: string
) => {
  const formData = new FormData();
  console.log(id);
  formData.append("id",id);
  formData.append("title", title);
  formData.append("image", image);
  formData.append("link", link);
  return axios.patch("ads/editAds", formData);

};