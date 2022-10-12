import React, { useEffect, useState } from 'react'
import TableExport from './table/TableExport'
import { UserContext } from './Navbar'
import { Row, Col} from 'react-bootstrap'
import { DatePicker } from 'antd'
import moment from 'moment';
import axios from 'axios'
function ReportImport() {
  const { RangePicker } = DatePicker;
  const [dataIm,setDataIm]=useState([])
  const [dataDate,setDataDate]=useState([])
  useEffect(()=>{
    if(dataDate==''){
      setDataDate([{'StartDay':`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,'EndDay':`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`}])
    }
    getDataEx(dataDate)
  },[dataDate])

  function getDataEx(dataDate){
    if(dataDate!=''){
      let Type ='Nhập'
      let Start=dataDate[0].StartDay
      let End =dataDate[0].EndDay
      axios.post('http://113.174.246.52:8082/api/his_materialManagerment',{Start,End,Type})
      .then((res)=>{
        setDataIm(res.data)
      } )
    }
  }

  const filterData = (data) => {
    var result = []
    data.map((val, index) => {
        result.push({
          key: index,
          ...val
        })
    })
    return result
  }
  const onChange = (dates, dateStrings) => {
    setDataDate([{StartDay:dateStrings[0],EndDay:dateStrings[1]}])
  }
  return (
    <div>

      <Row>
        <Col md={10}>
          <RangePicker
            defaultValue={[moment(), moment()]}
            ranges={{
              Today: [moment(), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
            }}
            onChange={onChange}
          />
        </Col>

      </Row>
      <Row>
        <TableExport value={filterData(dataIm ? dataIm : '')} />
      </Row>



    </div>
  )
}

export default ReportImport