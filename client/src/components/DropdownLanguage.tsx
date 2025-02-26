import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Space } from "antd";
import { useTranslation } from "react-i18next";
import { locales } from "../i18n/i18n";

const DropdownLanguage = () => {
    const { i18n } = useTranslation();
    const currentLanguage = locales[i18n.language as keyof typeof locales];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    }

    const items: MenuProps['items'] = [
        {
            label: 'English',
            key: '1',
            onClick: () => changeLanguage('en')
        },
        {
            label: 'Tiếng Việt',
            key: '2',
            onClick: () => changeLanguage('vi')

        },

    ];
    const menuProps = {
        items,
    };
    return (
        <>
            <Dropdown className="me-3" menu={menuProps}>
                <Button>
                    <Space>
                        {currentLanguage}
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
        </>
    );
};

export default DropdownLanguage;