import React, {useContext} from 'react'
import TableExport from './table/TableExport'
import { UserContext } from './Navbar'

function ReportImport() {
    const {dataExIm}=useContext(UserContext)
    
    const filterData =(data)=>{
        var result =[]
        data.map((val,index)=>{
            if(val.name_action=='Nhập')
            result.push({
                key:index,
                ...val
            })
        })
        return result

    }
  return (
    <div><TableExport value={filterData(dataExIm?dataExIm:'')}/></div>
  )
}

export default ReportImport