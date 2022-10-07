import React, { useContext } from 'react'
import TableExport from './table/TableExport'
import { UserContext } from './Navbar'
import { Container, Row, Col, Card, CardGroup, Button } from 'react-bootstrap'
import { DatePicker } from 'antd'
import moment from 'moment';
function ReportExport() {
  const { RangePicker } = DatePicker;
  const { dataExIm } = useContext(UserContext)

  const filterData = (data) => {
    var result = []
    data.map((val, index) => {
      if (val.name_action == 'Xuất')
        result.push({
          key: index,
          ...val
        })
    })
    return result

  }
  const onChange = (dates, dateStrings) => {
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  return (
    <div>

      <Row>
        <Col md={10}>
          <RangePicker
            defaultValue={moment(new Date(), 'YYYY-MM-DD')}
            ranges={{
              Today: [moment(), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
            }}
            onChange={onChange}
          />
        </Col>

      </Row>
      <Row>
        <TableExport value={filterData(dataExIm ? dataExIm : '')} />
      </Row>



    </div>
  )
}

export default ReportExport