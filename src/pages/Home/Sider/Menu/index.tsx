import React, { useMemo } from "react";
import { shallow } from "zustand/shallow";
import { storeHome } from "store/Home";
import { Menu, Layout } from "antd";
import { AlibabaOutlined } from "@ant-design/icons";

const FirstLevelMenu = (): any => {
  const { menus, firstMenukey, changeState } = storeHome(
    (props: any) => ({
      menus: props.menus,
      firstMenukey: props.firstMenukey,
      changeState: props.changeState,
    }),
    shallow
  );

  // 处理菜单
  const _items = useMemo(() => {
    return menus
      .filter((item: any) => item.parentId === "-1")
      .map((item: any) => ({
        key: item.id,
        label: item.name,
        icon: <AlibabaOutlined />,
      }));
  }, [menus]); // eslint-disable-line

  // 点击一级菜单
  const handleClick = ({ key }: { key: string }) => {
    changeState({
      firstMenukey: key,
    });
  };

  return (
    <Layout.Content>
      <Menu
        mode="inline"
        inlineIndent={10}
        theme="dark"
        selectedKeys={[firstMenukey || []]}
        items={_items}
        onClick={handleClick}
      />
    </Layout.Content>
  );
};

export default FirstLevelMenu;
