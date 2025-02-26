import { Table, Button, Image } from "antd";
import { Ads } from "../pages/admin/ads/AdsManage";
import { toast } from "react-toastify";
import { deleteAds } from "../services/admin/adsServices";
import { useState } from "react";
import ModalEditAds from "./ModalEditAds";
interface TableAdsAdminProps {
  ads: Ads[];
  searchKey: string;
  getAds: () => Promise<void>;
}

const TableAdsAdmin = ({ ads, searchKey, getAds }: TableAdsAdminProps) => {
  const [adsData, setAdsData] = useState<Ads>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleDeleteteAds = async (idAds: string) => {
    try {
      const res = await deleteAds(idAds);
      if (res.data && res.data.code === 200) {
        toast.success(res.data.message);
        await getAds();
      } else {
        toast.error("Delete Ads Failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAds = (ads: Ads) => {
    setAdsData(ads);
    setIsModalOpen(true);
  };
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Image width={70} src={image} alt="Ad Image" />
      ),
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_: any, ads: Ads) => (
        <>
          <Button
            className="me-2"
            onClick={() => handleEditAds(ads)}
            color="default"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteteAds(ads._id)}
            danger
            variant="solid"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const dataSource = ads
    .filter((ad) => ad.title.toLowerCase().includes(searchKey.toLowerCase()))
    .map((ad, i) => ({
      key: i,
      _id: ad._id,
      title: ad.title,
      image: ad.image,
      link: ad.link,
    }));

  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
      <ModalEditAds
        getAds={getAds}
        adsData={adsData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default TableAdsAdmin;
