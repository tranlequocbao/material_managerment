import React, { useState } from 'react'
import { Container, Row, Col, Card, CardGroup, Button } from 'react-bootstrap'
import { BsFillBarChartFill, BsBoxArrowInLeft, BsBoxArrowRight } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Exist.css'
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

var header = []
var body = []
const exist=0;
function Exist() {

  //const dataTable=
  const [dataTable, setDataTable] = React.useState([])
  const [exist,setExist]=useState(0)

  React.useEffect(() => {
    header=[]
    body=[]
    getData()

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
      setExist(exist=>exist+1)
    })
    setDataTable(database1)

    columns.map((val, index) =>
      header.push(val.title)
    )
  
  }


  //function export Excel
  function handleDownloadExcel() {
    downloadExcel({
      fileName: "bc tonkho"+Date(),
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
  const data = {
    labels: ['Trống', 'Đã có'],
    datasets: [
      {
        label: '# of Votes',
        data: [20, 80],
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
  //chart line
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Xuất Nhập Kho',
      },
    },
  };
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const dataLine = {
    labels,
    datasets: [
      {
        label: 'Xuất kho',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Nhập kho',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
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
                  {exist!=0&&exist}
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
                  05
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
                  00
                </Card.Title>
              </Card.Body>

            </Card>
          </Col>
        </Row>
        <Row className='chart'>
          <Col md='4'>
            <Pie data={data} />
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