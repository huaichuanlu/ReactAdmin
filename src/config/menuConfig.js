import {
    AppstoreOutlined,
    BarChartOutlined,
    AreaChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    AccountBookOutlined,
    UserOutlined,
    OrderedListOutlined
  } from '@ant-design/icons';


const menuList = [
    { title: '首页', key: '/home', icon: <DesktopOutlined /> },
    { title: '商品', key: '/products', icon: <AppstoreOutlined />,
        children: [{ title: '品类管理', key: '/category', icon: <OrderedListOutlined /> },
                   { title: '商品管理', key: '/product', icon: <AccountBookOutlined /> }]},
    { title: '用户管理', key: '/user', icon: <UserOutlined /> },
    { title: '角色管理', key: '/role', icon: <ContainerOutlined /> },
    { title: '图形图表', key: '/charts', icon: <AreaChartOutlined />, children:
                   [{ title: '柱形图', key: '/charts/bar', icon: <BarChartOutlined />, },
                    { title: '折线图', key: '/charts/line', icon: <LineChartOutlined /> },
                    { title: '饼图', key: '/charts/pie', icon: <PieChartOutlined /> },]
    }
]

export default menuList