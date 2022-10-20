import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  ExportOutlined,
  ImportOutlined,
  LogoutOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import Img from "../../Assets/to_readme/Logobg.png"
import { Breadcrumb, Tooltip, Layout, Menu, Button } from 'antd';
import Exist from './Exist';
import Import from './Import';
import Export from './Export';
import ReportExport from './ReportExport';
import ReportImport from './ReportImport'
import Layouts from './Layout'
import React, { useState, useRef, useLayoutEffect,createContext } from 'react';

import '../Styles/Dashboard.css'



const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
export const UserContext = createContext();
const items = [
  getItem(
    <Tooltip placement="right" title="Báo cáo tồn kho" arrowPointAtCenter>Báo cáo tồn kho</Tooltip>,
    'exist',
    <PieChartOutlined />
  ),
  getItem(
    <Tooltip placement="right" title="Báo cáo nhập xuất kho" arrowPointAtCenter>Nhập Kho</Tooltip>,
    'expImp',
    <PieChartOutlined />,
    [
      getItem(<Tooltip placement="right" title="Nhập Kho" arrowPointAtCenter>Nhập kho</Tooltip>, 'import', <ImportOutlined />),
      getItem(<Tooltip placement="right" title="Báo cáo Nhập kho" arrowPointAtCenter>Báo cáo Nhập kho</Tooltip>, 'reportImport', <ExportOutlined />)
    ]
  ),
  getItem(
    <Tooltip placement="right" title="Xuất Kho" arrowPointAtCenter>
      Xuất Kho
    </Tooltip>
    , 'sub1', <UserOutlined />, [
      getItem(<Tooltip placement="right" title="Xuất Kho" arrowPointAtCenter>Xuất kho</Tooltip>, 'export', <ImportOutlined />),
      getItem(<Tooltip placement="right" title="Báo cáo Xuất kho" arrowPointAtCenter>Báo cáo Xuất kho</Tooltip>, 'reportExport', <ExportOutlined />)
  ]),
  getItem(
    <Tooltip placement="right" title="Vị trí tại kho" arrowPointAtCenter>Khai báo vị trí</Tooltip>,
    'layout',
    <DatabaseOutlined />
  ),

];

const Navbar = () => {
  //get width of window
  const targetRef = useRef();
  const [dataMaterial,setDataMaterial]=useState([])
  const [dataExIm,setDataExIm]=useState([])
  const [collapsed, setCollapsed] = useState(false)
  const [page, setPage] = useState('exist')
  const [title, setTitle] = useState("Báo cáo tồn Kho")
  useLayoutEffect(() => {

    if (targetRef.current) {
      setResponsive(targetRef.current.offsetWidth)
    }
  }, []);

  const setResponsive = (witdh) => {
    witdh <= 760 ? setCollapsed(true) : setCollapsed(false)
  }
  const components = {
    'exist': <Exist />,
    'import': <Import />,
    'export': <Export />,
    'layout': <Layouts />,
    'reportExport':<ReportExport/>,
    'reportImport':<ReportImport/>,
  }
  
  //console.log(components['exist'])
  return (
    <UserContext.Provider value={{
      dataMaterial,
      setDataMaterial,
      dataExIm,
      setDataExIm,
      setPage
      }}>
    <Layout
      style={{
        minHeight: '100vh',
      }}
      ref={targetRef}
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
          onClick={e => {
            const { innerText } = e.domEvent.target
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
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >

          <div className='title'>{title}</div>
          <div className='navMenu' style={{ marginRight: '10px',display:'flex',marginLeft:'10px' }}>
          <div>
          <UserOutlined style={{display:'inline-flex',marginRight:'5px'}}/>
          {` ${JSON.parse(localStorage.getItem('user'))}`}
          </div>

            <a 
            className='logout'
            style={{ marginLeft: '10px', display: 'flex' }}
            onClick={()=>{
              localStorage.clear()
              window.location.reload()
              }}
              href=''
            > 
            <div><LogoutOutlined style={{display:'inline-flex',marginRight:'5px'}}/></div> 
            Đăng xuất
            </a>
          </div>
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
            {/* <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
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
          Made by GIẢI PHÁP ỨNG DỤNG Team 
        </Footer>
      </Layout>
    </Layout>
    </UserContext.Provider>
  )
}

export default Navbar;