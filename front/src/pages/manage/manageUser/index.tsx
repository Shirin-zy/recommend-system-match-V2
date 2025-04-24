import React, { useEffect, useState } from "react";
import style from "./index.less";
import { Button, Modal, Input, Select, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import Table from "./components/table";
import { getAllUser, Register_manger, searchUser } from "@/service/userAccount";

interface userProps {
  username: string;
  email: string;
  role: string;
  status: string;
  createDate: number;
  password?: string;
}
const MangeUser: React.FC = () => {
  const [searchKey, setSearchKey] = useState(""); // 搜索关键字
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 新增账户弹窗
  const [allUser, setAllUser] = useState<userProps[]>([]); // 所有账户
  const [needUpdate, setNeedUpdate] = useState(false); // 是否需要更新，当子组件更新时会更新该字段并通知父组件更新
  const [totalData, setTotalData] = useState(0); // 总账户数量
  const [page, setPage] = useState(1); // 当前页码
  // 在组件顶部添加错误状态
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    role: "",
  });
  // 账户创建表单
  const [userInfo, setUserInfo] = useState<userProps>({
    username: "",
    email: "",
    role: "",
    status: "",
    createDate: NaN,
  });

  // 创建新账户
  const createUser = async () => {
    const newErrors = {
      username: !userInfo.username.trim() ? "用户名不能为空" : "",
      email: !userInfo.email.trim() ? "邮箱不能为空" : "",
      role: !userInfo.role ? "请选择角色" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    // 调用注册接口
    const data = await Register_manger(
      userInfo.email,
      "Aa123456",
      userInfo.username,
      userInfo.role
    );
    // 清空表单数据并关闭面板
    setUserInfo([]);
    setNeedUpdate(true);
    // 提示信息
    if (data.data.result === false) {
      message.error(data.msg);
    } else {
      message.success(data.msg);
    }
    setIsAddModalOpen(false);
  };

  // 获取所有用户信息
  const getAllAccount = async (page: number, limit: number) => {
    const res = await getAllUser(page, limit);
    setAllUser(res.data.list);
    setTotalData(res.data.total);
    setNeedUpdate(false);
  };

  // 按关键词搜索用户信息
  const searchAccount = async (keyword: string) => {
    const res = await searchUser(searchKey);
    setAllUser(res.data.list);
  };

  useEffect(() => {
    getAllAccount(page, 10);
  }, [needUpdate, page]);

  useEffect(() => {
    console.log("searchKey:", searchKey);
    searchAccount(searchKey);
  }, [searchKey]);

  return (
    <>
      <div className={style.body}>
        <div className={style.pageHeader}>
          <div className={style.title}>用户账号管理</div>
          <div className={style.add}>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "#359eff" }}
              onClick={() => {
                setIsAddModalOpen(true);
              }}
            >
              <PlusCircleOutlined />
              新增
            </Button>
          </div>
        </div>
        <Table
          userList={allUser}
          setNeedUpdate={setNeedUpdate}
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          totalData={totalData}
          setPage={setPage}
        />
        {/* 管理员直接创建用户 */}
        <Modal
          width={400}
          centered
          title="创建用户"
          okText="创建"
          cancelText="取消"
          open={isAddModalOpen}
          onOk={createUser}
          onCancel={() => {
            setIsAddModalOpen(false);
          }}
        >
          <div className={style.editInfo}>
            <div>
              <span>用户名</span>
              <Input
                status={errors.username ? "error" : ""}
                value={userInfo.username}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, username: e.target.value });
                  setErrors((prev) => ({ ...prev, username: "" }));
                }}
              />
              {errors.username && (
                <div style={{ color: "red" }}>{errors.username}</div>
              )}
            </div>

            <div>
              <span>邮箱</span>
              <Input
                status={errors.email ? "error" : ""}
                value={userInfo.email}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, email: e.target.value });
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
              />
              {errors.email && (
                <div style={{ color: "red" }}>{errors.email}</div>
              )}
            </div>

            <div>
              <span>角色</span>
              <Select
                status={errors.role ? "error" : ""}
                value={userInfo.role}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, role: e });
                  setErrors((prev) => ({ ...prev, role: "" }));
                }}
                options={[
                  { value: "admin", label: "管理员" },
                  { value: "common", label: "普通用户" },
                  { value: "root", label: "超级管理员" },
                ]}
                style={{ width: "100%" }}
              />
              {errors.role && <div style={{ color: "red" }}>{errors.role}</div>}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default MangeUser;
