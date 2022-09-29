import React, { useState, useContext } from 'react'
import { Container, Row, Col, Card, CardGroup, Button } from 'react-bootstrap'
import { BsFillBarChartFill, BsBoxArrowInLeft, BsBoxArrowRight } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Exist.css'
import  {UserContext} from './Navbar'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { downloadExcel } from 'react-export-table-to-excel';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import faker from 'faker';
import TableAnt from './table/Table';
import axios from 'axios';
import { columns } from './table/Table';
import useFormItemStatus from 'antd/es/form/hooks/useFormItemStatus';
import { date } from 'yup';

var header = []
var body = []
const exist = 0;
function Exist() {
  const { setDataMaterial } = useContext(UserContext)
  //const dataTable=
  const [dataTable, setDataTable] = React.useState([])
  const [exist, setExist] = useState(0)
  const [exportHis,setExportHis]=useState([])
  const [importHis,setImportHis]=useState([])
  const [historyExIm,sethistoryExIm]=useState([])
  const [arrayLayout,setArrayLayout]=useState([])
  React.useEffect(() => {
    header = []
    body = []
    getData()
    getWeek(new Date())
  }, [])

  async function getData() {
    const response = await axios.post('http://113.174.246.52:8082/api/returnAll_materialManagerment')
    let database = await response.data
    const database1 = []
    database.map((val, index) => {
      database1.push(
        {
          key: index,
          ...val
        }
      )
      delete val['img']
      body.push(
        val
      )
      setExist(exist => exist + 1)
    })
    setDataTable(database1)
    setDataMaterial(database)
    columns.map((val, index) =>
      header.push(val.title)
    )


    //lấy lịch sử xuất nhập kho
    const his_ = await axios.post('http://113.174.246.52:8082/api/his_materialManagerment')
   let history = await his_.data
   sethistoryExIm(history)


   //Xuất mảng nhập và xuất trong ngày hiện diện
   const exportHis_=[]
   const importHis_=[]
   const today = new Date()
   today.setHours(0,0,0,0)
   for(const key in history){
    if(history[key].name_action=='Nhập'){
      let thisDate = new Date(history[key].created_at)
      thisDate.setHours(0,0,0,0)
      if(thisDate.getTime()===today.getTime())
      importHis_.push(history[key])
      setImportHis(importHis_)
    }
    
    else{
      let thisDate = new Date(history[key].created_at)
      thisDate.setHours(0,0,0,0)
      if(thisDate.getTime()===today.getTime())
      exportHis_.push(history[key])
      setExportHis(exportHis_)
    }
    
   }

   //lấy danh sách layout hiện có
   const layout = await axios.post('http://113.174.246.52:8082/api/returnLayout_materialManagerment')
   let arrayLayout = await layout.data
   setArrayLayout(arrayLayout)
  }


  //function export Excel
  function handleDownloadExcel() {
    downloadExcel({
      fileName: "bc tonkho" + Date(),
      sheet: "ketqua",
      tablePayload: {
        header,
        // accept two different data structures
        body: body
      },
    });
  }

  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,

  );
  //chart pie
    const dataset=(data)=>{
     
      var lenght =0
      var nul =0
      var name =''
      var datase=[]
      for(const key in data){
        if(name!=data[key].id){
          
          lenght=parseInt(lenght)+1
          name=data[key].id
        }
        if(data[key].id_material==null) nul++
      }
      datase.push(lenght,nul)
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
    },
  };
  //lấy mảng 1 tuần với ngày hiện tại
  const labels = getWeek(new Date())
  function getWeek(today){
    var week= new Array(); 
    // Starting Monday not Sunday
    today.setDate((today.getDate() - today.getDay() +1));
    for (var i = 0; i < 7; i++) {
      let j = new Date(today)
      
        week.push(
          j.toDateString()
        ); 
        today.setDate(today.getDate() +1);
    }
    return week
  }
  
  //hàm lấy số liệu trong 1 ngày
 const returnDataEx=(date)=>{
  var result=0
    exportHis.map((val,index)=>{

      let dates= new Date(val.created_at)
      dates.setHours(0,0,0,0)
      let date_ = new Date(date)
      date_.setHours(0,0,0,0)
      if(date_.getTime()==dates.getTime()){
        result=result+ parseInt(val.amount)
      }
      
    })
    
    return result
  }
  const returnDataIm=(date)=>{
    var result=0
      importHis.map((val,index)=>{
  
        let dates= new Date(val.created_at)
        dates.setHours(0,0,0,0)
        let date_ = new Date(date)
        date_.setHours(0,0,0,0)
        if(date_.getTime()==dates.getTime()){
          result=result+ parseInt(val.amount)
        }
        
      })
    
      return result
    }
 
  const dataLine = {
    labels,
    datasets: [
      {
        label: 'Xuất kho',
        data: labels.map((val,index) => 
          returnDataEx(val)
        ),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Nhập kho',
        data: labels.map((val) => returnDataIm(val)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
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
                    SỐ LƯỢNG TỒN KHO
                  </Card.Title>
                </Card.Body>
              </Card.Header>
              <Card.Body className='d-flex'>
                <Card.Title className='m-1'> <div className='icons'>
                  <BsFillBarChartFill />
                </div></Card.Title>
                <Card.Title className='mb-0' style={{ fontSize: '25px' }}>
                  {exist != 0 && exist}
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
                    NHẬP KHO THEO NGÀY
                  </Card.Title>
                </Card.Body>
              </Card.Header>
              <Card.Body className='d-flex'>
                <Card.Title className='m-1'> <div className='icons'>
                  <BsBoxArrowInLeft />
                </div></Card.Title>
                <Card.Title className='mb-0' style={{ fontSize: '25px' }}>
                  {importHis&&importHis.length}
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
                    XUẤT KHO THEO NGÀY
                  </Card.Title>
                </Card.Body>
              </Card.Header>
              <Card.Body className='d-flex'>
                <Card.Title className='m-1'> <div className='icons'>
                  <BsBoxArrowRight />
                </div></Card.Title>
                <Card.Title className='mb-0' style={{ fontSize: '25px' }}>
                  {exportHis&&exportHis.length}
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
                <h2></h2>
              </div>
              <div>
                <h2>BẢNG TỒN KHO</h2>
              </div>
              <div>
                <Button onClick={handleDownloadExcel}>export</Button>
              </div>
            </Col>


          </Row>

          <TableAnt value={dataTable} />
        </Row>
      </Container>
    </div>
  )
}

export default Exist