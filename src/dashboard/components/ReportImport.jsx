import React, { useEffect, useState } from 'react'
import TableExport from './table/TableExport'
import { UserContext } from './Navbar'
import { Row, Col,Button} from 'react-bootstrap'
import { downloadExcel } from 'react-export-table-to-excel'
import { DatePicker } from 'antd'
import moment from 'moment';
import axios from 'axios'
import {columns} from './table/TableExport'
function ReportImport() {
  const { RangePicker } = DatePicker;
  const [dataIm,setDataIm]=useState([])
  const [dataDate,setDataDate]=useState([])
  var header=[]
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
    !data.errno!=''&&data.map((val, index) => {
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

  const handleExportExcel=()=>{
    columns.map((val, index) =>
      header.push(val.title)
    )

    downloadExcel({
      fileName: "bc nhap kho" + Date(),
      sheet: "ketqua",
      tablePayload: {
        header,
        // accept two different data structures
        body: dataIm
      },
    });
  }
  return (
    <div>

      <Row style={{marginBottom:'20px'}}>
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
        <Col md={2}>
          <Button onClick={handleExportExcel}>Xuất Excel</Button>
        </Col>
      </Row>
      <Row>
        <TableExport value={filterData(dataIm ? dataIm : '')} type={'import'} />
      </Row>



    </div>
  )
}

export default ReportImport