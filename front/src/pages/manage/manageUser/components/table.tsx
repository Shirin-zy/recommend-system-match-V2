import React, { useEffect, useState } from "react";
import style from "./table.less";
import {
  Input,
  Popover,
  Modal,
  message,
  Select,
  Popconfirm,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  SafetyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { updateAccount, deleteAccount } from "@/service/userAccount";

interface TableRowProps {
  username: string;
  email: string;
  role: string;
  status: string;
  createDate: number;
  password: string;
}

interface TableProps {
  userList: TableRowProps[]; // 账户信息列表
  setNeedUpdate: (status: boolean) => void; // 在表格中更新账户信息后通知父组件需要重新渲染
  setSearchKey: (key: string) => void; // 设置搜索关键字
  totalData: number; // 总账户数量
  setPage: (page: number) => void; // 设置当前页码
}
interface RowProps {
  userInfo: TableRowProps; // 单个账户信息
  setNeedUpdate: (status: boolean) => void;
}

enum Role {
  root = "超级管理员",
  admin = "管理员",
  common = "普通用户",
}

const formatTimestamp = (seconds: number): string => {
  // 转换为毫秒并创建 Date 对象
  const date = new Date(seconds * 1000);

  // 提取时间组件
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始需要+1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const secondsPart = String(date.getSeconds()).padStart(2, "0");

  // 组合成目标格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${secondsPart}`;
};

// 表头
const TableHeader = () => {
  return (
    <>
      <div className={style.tableHeader}>
        <div style={{ flex: 1 }}>用户名</div>
        <div style={{ flex: 2 }}>邮箱</div>
        <div style={{ flex: 1 }}>角色</div>
        <div style={{ flex: 1 }}>状态</div>
        <div style={{ flex: 2 }}>创建日期</div>
        <div style={{ flex: 1 }}>操作</div>
      </div>
    </>
  );
};

// 表格行数据
const TableRow: React.FC<RowProps> = (RowProps) => {
  const { userInfo: row, setNeedUpdate } = RowProps;
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // 账户详情弹窗
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 编辑账户信息弹窗
  const [userInfo, setUserInfo] = useState<TableRowProps>({
    username: "",
    email: "",
    role: "",
    status: "",
    createDate: NaN,
    password: "",
  });

  // 删除账户
  const deleteUser = async () => {
    const data = await deleteAccount(row.email);
    setNeedUpdate(true);
    console.log(data);
    message.success("删除成功");
  };

  useEffect(() => {
    setUserInfo(row);
  }, [row]);

  // 更新账户信息
  const updateInfo = async () => {
    setIsEditModalOpen(false);
    const data = await updateAccount(
      userInfo.email,
      userInfo.username,
      userInfo.role,
      userInfo.status,
      userInfo.password
    );
    setNeedUpdate(true);
    message.success(data.msg);
  };
  return (
    <>
      <div className={style.tableRow}>
        <div style={{ flex: 1 }}>{row.username}</div>
        <div style={{ flex: 2 }}>{row.email}</div>
        <div style={{ flex: 1 }}>{Role[row.role]}</div>
        <div style={{ flex: 1 }}>
          <span
            style={{
              paddingLeft: "12px",
              borderRadius: "15px",
              lineHeight: "30px",
              height: "30px",
              width: "60px",
              display: "inline-block",
              backgroundColor: row.status === "active" ? "#dcfce7" : "#f3f4f6",
            }}
          >
            {row.status === "active" ? "活跃" : "停用"}
          </span>
        </div>
        <div style={{ flex: 2 }}>{formatTimestamp(row.createDate)}</div>
        <div style={{ flex: 1 }}>
          <Popover
            className={style.handle}
            placement="bottom"
            content={
              <div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsInfoModalOpen(true);
                  }}
                >
                  查看详情
                </div>
                <div style={{ cursor: "pointer" }}>
                  <Popconfirm
                    title="删除用户"
                    description="您确认是否要删除该用户？"
                    onConfirm={deleteUser}
                    okText="确认"
                    cancelText="取消"
                  >
                    删除
                  </Popconfirm>
                </div>
              </div>
            }
          >
            ···
          </Popover>
        </div>
      </div>
      {/* 详细信息面板 */}
      <Modal
        centered
        title="用户详情"
        okText="编辑"
        cancelText="关闭"
        open={isInfoModalOpen}
        onOk={() => {
          setIsInfoModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onCancel={() => {
          setIsInfoModalOpen(false);
        }}
      >
        <div className={style.infoCard}>
          <div className={style.avatar}>
            <UserOutlined
              style={{ fontSize: "40px", color: "#359eff", marginTop: "10px" }}
            />
          </div>
          <div className={style.name}>{row.username}</div>
          <div
            className={style.status}
            style={{
              backgroundColor: row.status === "active" ? "#dcfce7" : "#f3f4f6",
            }}
          >
            {row.status === "active" ? "活跃" : "冻结"}
          </div>
          <div className={style.detail}>
            <div>
              <MailOutlined style={{ color: "#359eff" }} />
              <span>邮箱：</span>
              <span style={{ color: "#000" }}>{row.email}</span>
            </div>
            <div>
              <SafetyOutlined style={{ color: "#359eff" }} />
              <span>角色：</span>
              <span style={{ color: "#000" }}>{Role[row.role]}</span>
            </div>
            <div>
              <CalendarOutlined style={{ color: "#359eff" }} />
              <span>创建时间：</span>
              <span style={{ color: "#000" }}>
                {formatTimestamp(row.createDate)}
              </span>
            </div>
          </div>
        </div>
      </Modal>
      {/* 修改账户信息 */}
      <Modal
        width={400}
        centered
        title="编辑用户"
        okText="更新"
        cancelText="取消"
        open={isEditModalOpen}
        onOk={updateInfo}
        onCancel={() => {
          setIsEditModalOpen(false);
          setIsInfoModalOpen(true);
        }}
      >
        <div className={style.editInfo}>
          {" "}
          <span>用户名</span>
          <Input
            value={userInfo.username}
            onChange={(e) => {
              setUserInfo({
                ...userInfo,
                username: e.target.value,
              });
            }}
          ></Input>
          <span>邮箱</span>
          <Input
            disabled
            value={userInfo.email}
            onChange={(e) => {
              setUserInfo({
                ...userInfo,
                email: e.target.value,
              });
            }}
          ></Input>
          <span>密码</span>
          <Input
            value={userInfo.password}
            onChange={(e) => {
              setUserInfo({
                ...userInfo,
                password: e.target.value,
              });
            }}
          ></Input>
          <span>角色</span>
          <Select
            value={userInfo.role}
            onChange={(e) => {
              setUserInfo({
                ...userInfo,
                role: e,
              });
            }}
            options={[
              { value: "admin", label: "管理员" },
              { value: "common", label: "普通用户" },
              { value: "root", label: "超级管理员" },
            ]}
            style={{ width: "100%" }}
          />
          <span>状态</span>
          <Select
            value={userInfo.status}
            onChange={(e) => {
              setUserInfo({
                ...userInfo,
                status: e,
              });
            }}
            options={[
              { value: "active", label: "活跃" },
              { value: "lock", label: "冻结" },
            ]}
            style={{ width: "100%" }}
          />
        </div>
      </Modal>
    </>
  );
};

// 表格
const Table: React.FC<TableProps> = (TableProps) => {
  const { userList, totalData, setNeedUpdate, setSearchKey, setPage } =
    TableProps;
  const [input, setInput] = useState(""); // 搜索框内容
  return (
    <>
      <div className={style.content}>
        <div className={style.search}>
          <Input
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // 按下回车将输入框内容同步给搜索关键词并清空输入框
                setSearchKey(input);
                setInput("");
              }
            }}
            value={input}
            prefix={<SearchOutlined />}
            placeholder="收缩用户名、邮箱或角色"
          ></Input>
        </div>
        <div className={style.table}>
          <TableHeader />
          {userList.map((item, index) => (
            <TableRow userInfo={item} setNeedUpdate={setNeedUpdate} />
          ))}
          <Pagination
            style={{ marginTop: "30px" }}
            align="center"
            onChange={(e) => {
              setPage(e);
            }}
            showSizeChanger={false}
            pageSize={10}
            defaultCurrent={1}
            total={totalData}
          />
        </div>
      </div>
    </>
  );
};

export default Table;
