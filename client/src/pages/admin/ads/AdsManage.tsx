import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Divider, Input } from "antd";
import TableAdsAdmin from "../../../components/TableAdsAdmin";
import { useEffect, useState } from "react";
import { getAllAds } from "../../../services/admin/adsServices";
import ModalCreateAds from "../../../components/ModalCreateAds";
export interface Ads {
  _id: string;
  title: string;
  image: string;
  link: string;
 
}
const AdsManage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [ads, setAds] = useState<Ads[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const getAds = async () => {
    try {
      const res = await getAllAds();
      if (res.data && res.data.code === 200) {
        setAds(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAds();
  }, []);
  const handleCreateAds = () => {
    setIsModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  return (
    <div>
      <div>
        <h2>Advertisement Management</h2>
      </div>
      <Divider />
      <div>
        <div className="d-flex gap-5">
          <Button
            onClick={handleCreateAds}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="large"
          >
            Add New Ads
          </Button>
          <Input
            onChange={(e) => handleSearch(e)}
            size="large"
            placeholder="Title Ads"
            prefix={<SearchOutlined />}
          />
          <ModalCreateAds
            getAds={getAds}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
     
      </div>
      <div className="mt-2">
        <TableAdsAdmin searchKey={searchKey} getAds={getAds} ads={ads} />
      </div>
    </div>
  );
};

export default AdsManage;
