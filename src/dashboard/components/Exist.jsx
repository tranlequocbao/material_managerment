import React, { useState, useContext,createContext } from 'react'
import { Container, Row, Col, Card, CardGroup, Button } from 'react-bootstrap'
import { BsFillBarChartFill, BsBoxArrowInLeft, BsBoxArrowRight } from 'react-icons/bs'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../Styles/Exist.css'
import { UserContext } from './Navbar'

import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js'
import { notification, DatePicker } from 'antd'
import { downloadExcel } from 'react-export-table-to-excel'
import { Pie } from 'react-chartjs-2'
import { Line } from 'react-chartjs-2'
import 'chartjs-plugin-datalabels';
import TableAnt from './table/Table'
import axios from 'axios';

//import { columns } from './table/Table'

export const setColumn = createContext()
var header = []
var body = []
function Exist() {
  const { setDataMaterial } = useContext(UserContext)
  const [columns,setColumns] =useState([])
  //const dataTable=
  const [dataTable, setDataTable] = React.useState([])
  const [exist, setExist] = useState(0)
  const [exportHis, setExportHis] = useState([])
  const [importHis, setImportHis] = useState([])
  const [historyExIm, sethistoryExIm] = useState([])
  const [arrayLayout, setArrayLayout] = useState([])
  const [checkNow,setCheckNow]=useState(true)
 
  React.useEffect(() => {
    header = []
    body = []
    getData()
  }, [])

  async function getData() {
    const response = await axios.post('http://113.174.246.52:8082/api/returnAll_materialManagerment')
    let database = await response.data
    const database1 = []
    let totalPrice = 0;
    database.map((val, index) => {
      database1.push(
        {
          key: index,
          ...val
        }
      )
      delete val['img']
      delete val['id_type']
      body.push(
        val
      )
      if (val['total_price'] != '') totalPrice += val['total_price']
    


    })
    setExist(totalPrice)
    setDataTable(database1)
    setDataMaterial(database)
    
  

    // thông báo

    //lấy lịch sử xuất nhập kho
    let Start = `${new Date().getFullYear()}-01-01`
    let End = `${new Date().getFullYear()}-12-31`
    let Type = 'All'
    axios.post('http://113.174.246.52:8082/api/his_materialManagerment', {
      Start, End, Type
    }).
      then(res => {
        let history = res.data
        sethistoryExIm(history)



        //Xuất mảng nhập và xuất trong ngày hiện diện
        const exportHis_ = []
        const importHis_ = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        for (const key in history) {
          if (history[key].name_action == 'Nhập') {
            let thisDate = new Date(history[key].created_at)
            thisDate.setHours(0, 0, 0, 0)
            if (thisDate.getTime() === today.getTime())
              importHis_.push(history[key])
            let total_price = 0
            importHis_.map(val => {
              if (val['total_price'] !== '')
                total_price += val['total_price']
            })

            setImportHis(total_price)
          }

          else {
            let thisDate = new Date(history[key].created_at)
            thisDate.setHours(0, 0, 0, 0)
            if (thisDate.getTime() === today.getTime())
              exportHis_.push(history[key])
            let total_price = 0;
            exportHis_.map(val => {
              if (val['total_price'] !== '')
                total_price += val['total_price']
            })
            setExportHis(total_price)
          }
          //lấy lịch sử tồn kho
        }
        //  axios.post('http://113.174.246.52:8082/api/returnExistMonth_materialManagerment')
        // .then(res=>{
        //   let dataExist = res.data
        //   setamountExistForMonth(dataExist)
        // })
        

      })

    //lấy danh sách layout hiện có
    const layout = await axios.post('http://113.174.246.52:8082/api/returnLayout_materialManagerment')
    let arrayLayout = await layout.data
    setArrayLayout(arrayLayout)

    // //lấy sô tiền tồn hàng tháng
    
   

  }

  //chốt hàng tồn kho trong tháng
  const handleCloseExist = () => {
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    axios.post('http://113.174.246.52:8082/api/setExist_materialManagerment', { month, year })
      .then((res) => {
        if (res.data['errno']) {
          openNotification("THÊM DỮ LIỆU THẤT BẠI", 'error',)
        }
        else {
          openNotification("THÊM DỮ LIỆU THÀNH CÔNG", 'success',)
        }
      })
  }
  const openNotification = (status, type) => {
    notification[type]({  
      message: 'THÔNG BÁO',
      description: status,
    })
  }

  //function export Excel
  function handleDownloadExcel() {
    columns.map((val, index) =>
    header.push(val.title)
  )
    downloadExcel({
      fileName: "bc tonkho" + Date(),
      sheet: "ketqua",
      tablePayload: {
        header,
        // accept two different data structures
        body: body
      },
    })
  }

  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,

  );
  //chart pie
  const dataset = (data) => {

    var lenght = 0
    var nul = 0
    var name = ''
    var datase = []
    for (const key in data) {
      if (name != data[key].id) {
        lenght = parseInt(lenght) + 1
        name = data[key].id
      }
      if (data[key].id_material == null) nul++
    }
    datase.push(lenght, nul)
    return datase
  }

  const data = {
    labels: ['Tổng vị trí', 'Trống'],
    title: {
      display: true,
      text: 'Layout',
    },
    datasets: [
      {
        label: '# of Votes',
        data: dataset(arrayLayout),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionLine = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Tình trạng layout Kho',
      },
    },
  };

  //chart line
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Xuất Nhập Kho Trong Tuần',
      },
      // datalabels: {
      //   display: true,
      //   color: 'white'
      // }
    },
  };
  //lấy mảng 1 tuần với ngày hiện tại
  const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']


  //hàm lấy số liệu trong 1 ngày
  const returnDataEx = (date) => {
    //console.log(date)
    var result = 0
    var arraylist = historyExIm.filter(da => new Date(da.created_at).getMonth() == new Date(date).getMonth() && da.name_action == 'Xuất')
    arraylist.map((val, index) => {

      if (val.total_price !== null && val.total_price !== NaN) {
        result = result + parseInt(val.total_price)
      }

    })

    return result
  }

  const returnDataIm = (date) => {
    var result = 0
    var arraylist = historyExIm.filter(da => new Date(da.created_at).getMonth() == new Date(date).getMonth() && da.name_action == 'Nhập')
    arraylist.map((val, index) => {
      if (val.total_price !== null && val.total_price !== NaN) {
        result = result + parseInt(val.total_price)
      }

    })
    return result
  }

  // const returnDataExist = (date) => {
  //   var result = 0
  //   if (amountExistForMonth) {
  //     amountExistForMonth.map((val, index) => {
  //       if (val.MONTHSUM === date)
  //         result = parseInt(val.count)
  //     })
  //   }
  //   return result

  // }

  const dataLine = {
    labels,
    datasets: [
      {
        label: 'Xuất kho',
        data: labels.map((val, index) =>
          returnDataEx(new Date(`${new Date().getFullYear()}-${index + 1}`))
        ),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Nhập kho',
        data: labels.map((val, index) => returnDataIm(new Date(`${new Date().getFullYear()}-${index + 1}`))),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      // {
      //   label: 'Tồn kho',
      //   data: labels.map((val, index) => returnDataExist(index + 1)),
      //   borderColor: 'rgb(120, 245, 150)',
      //   backgroundColor: 'rgba(120, 245, 150, 0.8)',
      // },
    ],
  };


  //kiểm tra lịch sử tồn kho theo tháng
  const handleTimeExist = async (date, dateString) => {
    let month = ''; let year = '';
    let arrDate = dateString.split('-')
    month = arrDate[1]; year = arrDate[0];
    var checkDateNow = new Date(dateString)
    var dateNow = new Date()
    if (dateNow.getFullYear() == checkDateNow.getFullYear() && dateNow.getMonth() == checkDateNow.getMonth()) {
      const response = await axios.post('http://113.174.246.52:8082/api/returnAll_materialManagerment')
      let database = await response.data
      const database1 = []
      let totalPrice = 0;
      database.map((val, index) => {
        database1.push(
          {
            key: index,
            ...val
          }
        )
      })
      setDataTable(database1)
      setCheckNow(true)
    }
    else {
      axios.post('http://113.174.246.52:8082/api/hisExist_materialManagerment', { year, month })
        .then(res => {
          let database = res.data
          let data = []
          database.map((val, index) => {
            data.push(
              {
                key: index,
                ...val
              }
            )
          })
          setDataTable(data)
          setCheckNow(false)
        })
    }



  }

  return (
    <div >
      <Container fluid bg='light'>
        <Row xs={1} md={3} className="cardDash g-4 mb-5">
          {/* Tồn kho */}
          <Col>
            {/* tồn kho */}
            <Card
              bg={'primary'}
              text={'light'}
              className="mb-2 exist"
            >
              <Card.Header>
                <Card.Body className='d-flex'>
                  <Card.Title className='mb-0'>
                    TỔNG TIỀN TỒN KHO
                  </Card.Title>
                </Card.Body>
              </Card.Header>
              <Card.Body className='d-flex'>
                <Card.Title className='m-1'> <div className='icons'>
                  <BsFillBarChartFill />
                </div></Card.Title>
                <Card.Title className='mb-0' style={{ fontSize: '25px' }}>
                  {exist != 0 && exist.toLocaleString()}
                </Card.Title>
              </Card.Body>

            </Card>
          </Col>
          {/* xuất kho */}
          <Col>
            <Card
              bg={'success'}
              text={'light'}

              className="mb-2 export"
            >
              <Card.Header>
                <Card.Body className='d-flex'>
                  <Card.Title className='mb-0'>
                    TỔNG TIỀN NHẬP TRONG NGÀY
                  </Card.Title>
                </Card.Body>
              </Card.Header>
              <Card.Body className='d-flex'>
                <Card.Title className='m-1'> <div className='icons'>
                  <BsBoxArrowInLeft />
                </div></Card.Title>
                <Card.Title className='mb-0' style={{ fontSize: '25px' }}>
                  {importHis && importHis.toLocaleString()}
                </Card.Title>
              </Card.Body>

            </Card>
          </Col>
          {/* Nhập kho */}
          <Col>
            <Card
              bg={'info'}
              text={'light'}

              className="mb-2 import"
            >
              <Card.Header>
                <Card.Body className='d-flex'>

                  <Card.Title className='mb-0' >
                    TỔNG TIỀN XUẤT TRONG NGÀY
                  </Card.Title>
                </Card.Body>
              </Card.Header>
              <Card.Body className='d-flex'>
                <Card.Title className='m-1'> <div className='icons'>
                  <BsBoxArrowRight />
                </div></Card.Title>
                <Card.Title className='mb-0' style={{ fontSize: '25px' }}>
                  {exportHis && exportHis.toLocaleString()}
                </Card.Title>
              </Card.Body>

            </Card>
          </Col>
        </Row>
        <Row className='chart'>
          <Col md='4'>
            <Pie options={optionLine} data={data} />
          </Col>
          <Col md='8'>
            <Line options={options} data={dataLine} />
          </Col>
        </Row>
        <Row>
          <Row className='titleTable text-center mt-5'>
            <Col className='groupTitle'>
              <div>
                <DatePicker onChange={handleTimeExist} picker="month" />
              </div>
              <div>
                <h2>BẢNG TỒN KHO</h2>
              </div>
              <div>
                <Button variant="warning" onClick={handleCloseExist} style={{ marginRight: '20px' }}>CHỐT TỒN KHO</Button>
                <Button onClick={handleDownloadExcel}>export</Button>
              </div>
            </Col>
          </Row>
          <setColumn.Provider value={{setColumns,checkNow}}>
            <TableAnt value={dataTable} />
          </setColumn.Provider>
        </Row>
      </Container>
    </div>
  )
}

export default Exist