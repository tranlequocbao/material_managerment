import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  ExportOutlined,
  ImportOutlined
} from '@ant-design/icons';

import { Breadcrumb, Tooltip, Layout, Menu } from 'antd';
import Exist from './Exist';
import Import from './Import';
import Export from './Export';
import React, { useState } from 'react';
import '../Styles/Dashboard.css'
import Img from "../../Assets/to_readme/Logobg.png"
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(
    <Tooltip placement="right" title="Báo cáo tồn kho" arrowPointAtCenter>Báo cáo tồn kho</Tooltip>,
    'exist',
    <PieChartOutlined />
  ),
  getItem(
    <Tooltip placement="right" title="Báo cáo nhập xuất kho" arrowPointAtCenter> Báo cáo nhập xuất kho</Tooltip>,
    'expImp',
    <PieChartOutlined />,
    [
      getItem(<Tooltip placement="right" title="Báo cáo Nhập kho" arrowPointAtCenter> Báo cáo Nhập kho</Tooltip>, 'Rimport', <ImportOutlined />),
      getItem(<Tooltip placement="right" title="Báo cáo Xuất kho" arrowPointAtCenter>Báo cáo Xuất kho</Tooltip>, 'Rexport', <ExportOutlined />)
    ]
  ),
  getItem(
    <Tooltip placement="right" title="Chức năng nhập xuất kho" arrowPointAtCenter>
      Chức năng nhập xuất kho
    </Tooltip>
    , 'sub1', <UserOutlined />, [
    getItem('Nhập kho', 'import', <ImportOutlined />),
    getItem('Xuất kho', 'export', <ExportOutlined />),
  ]),

];

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [page,setPage]=useState('exist')
  const [title,setTitle]=useState(page)
  const components={
    'exist':<Exist/>,
    'import':<Import/>,
    'export':<Export/>
  }
  console.log(components['exist'])
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo">
          {!collapsed && <img src={Img} alt="Hình banner" className='logoThaco' />}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={e=>{
            const {innerText} = e.domEvent.target
            
            setPage(e.key)
            setTitle(innerText)
            }}
            
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          
          className="site-layout-background"
          style={{
            padding: 0,
          }}
          
        >
          <div className='title'>{title}</div>
        </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            {components[page]}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          make by Trần Lê Quốc Bảo - Antd support
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Navbar;