import { create } from "zustand";

import { postJson } from "utils/request";
import _cloneDeep from "utils/lodash/cloneDeep";
import uniqueId from "utils/lodash/uniqueId";

interface StoreHomeState {
  loading: boolean;
  token: string | null;
  userInfo: UserInfo | null;
  favorites: any[] | null;
  menus: Menu[]; // 假设 Menu 和 UserInfo 是定义好的类型
  firstMenukey: string;
  tabPanes: TabPane[];
  activePanelKey: string;
  prevActivePanelKey: string;
  permission: string[];
  fixedSider: boolean;
  showTour: boolean;
  messageCount: number;
}

interface UserInfo {
  // 定义用户信息的类型
}

interface Menu {
  // 定义菜单项的类型
}

interface TabPane {
  id: string;
  title: string;
  url: string;
  closable: boolean;
}

export const storeHome: any = create<StoreHomeState>((set, get) => ({
  loading: false,
  token: null,
  userInfo: null,
  favorites: null,
  menus: [],
  firstMenukey: "",
  tabPanes: [],
  activePanelKey: "m-home",
  prevActivePanelKey: "",
  permission: [],
  fixedSider: localStorage.getItem("main-fixed-sider") !== "false",
  showTour: !localStorage.getItem("main-show-tour"),
  messageCount: 0,
  // 设置store
  changeState: async (params = {}) => {
    set((state) => ({ ...state, ...params }));
  },
  // 打开tab页签
  openTab: async (option: any) => {
    if (!option.id) {
      option.id = uniqueId();
    }
    const prevActivePanelKey = get().activePanelKey;
    const currentKey = get().activePanelKey;
    const tabPanes = get().tabPanes;

    if (
      tabPanes.find((item) => item.id === option.id && item.url === option.url)
    ) {
      // tab页签列表中存在，直接激活  且刷新页面
      set({
        activePanelKey: option.id,
      });
      // (window as any)?.getPageTab(option.id)?.location?.reload();
    } else if (
      tabPanes.find((item) => item.id === option.id && item.url !== option.url)
    ) {
      // 相同menu更新url
      set({
        activePanelKey: option.id,
        prevActivePanelKey:
          currentKey === option.id ? prevActivePanelKey || "" : currentKey,
      });

      (get() as any)?.updateTab({
        id: option.id,
        title: option?.title || "",
        url: option.url,
      });
    } else {
      // tab页签列表中不存在
      set({
        prevActivePanelKey: currentKey,
        activePanelKey: option.id,
        tabPanes: [...tabPanes, { closable: true, ...option }],
      });
    }
  },
  // 更新tab页签
  updateTab: async (params: any) => {
    const { title = "", url = "", id = "" }: any = params;
    params.id = id?.replace("page_", "");
    const { tabPanes, activePanelKey } = get();
    const mTabPanes = _cloneDeep(tabPanes);
    const modifyTaget: any =
      mTabPanes?.find((item: any) => item.id === (id || activePanelKey)) || {};

    if (modifyTaget) {
      modifyTaget.title = title ? title : modifyTaget?.title;
      modifyTaget.url = url ? url : modifyTaget?.url;
    }
    set({ tabPanes: [...mTabPanes] });
  },
  // 获取菜单信息
  getMenuInfo: async () => {
    set({ loading: true });
    const result = await postJson("/platform/portal/getWebMenuList.do");
    if (result.code === "1") {
      set({ menus: result.data });
    }
    set({ loading: false });
  },
}));
