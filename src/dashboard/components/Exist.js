import React from 'react'
import { Container, Row, Col, Card, CardGroup } from 'react-bootstrap'
import { BsFillBarChartFill, BsBoxArrowInLeft, BsBoxArrowRight } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Exist.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend,CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import faker from 'faker';
function Exist() {
  ChartJS.register(ArcElement, Tooltip, Legend,CategoryScale,
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
        position: 'top' ,
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
      <Container bg='light'>
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
                  <Card.Title className='m-1'>
                    <div className='icons'>
                      <BsFillBarChartFill />
                    </div>
                  </Card.Title>
                  <Card.Title className='mb-0'>
                    Tồn kho
                  </Card.Title>
                </Card.Body>
              </Card.Header>
              <Card.Body className='d-flex'>
                <Card.Title className='m-1'>Số lượng</Card.Title>
                <Card.Title className='mb-0'>
                  1806204
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
                  <Card.Title className='m-1'>
                    <div className='icons'>
                      <BsBoxArrowInLeft />
                    </div>
                  </Card.Title>
                  <Card.Title className='mb-0'>
                    Nhập kho
                  </Card.Title>
                </Card.Body>
              </Card.Header>
              <Card.Body className='d-flex'>
                <Card.Title className='m-1'>Theo ngày</Card.Title>
                <Card.Title className='mb-0'>
                  1806204
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
                  <Card.Title className='m-1'>
                    <div className='icons'>
                      <BsBoxArrowRight />
                    </div>
                  </Card.Title>
                  <Card.Title className='mb-0'>
                    Xuất kho
                  </Card.Title>
                </Card.Body>
              </Card.Header>
              <Card.Body className='d-flex'>
                <Card.Title className='m-1'>Theo ngày</Card.Title>
                <Card.Title className='mb-0'>
                  1806204
                </Card.Title>
              </Card.Body>

            </Card>
          </Col>
        </Row>
        <Row className='chart'>
          <Col md='5'>
            <Pie data={data}/> 
          </Col>
          <Col md='5'>
          <Line options={options} data={dataLine} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Exist