import React from 'react'
import styled from 'styled-components';
import { UncontrolledTooltip } from "reactstrap";

export const AgendaDetail = ({heading}) => {
  return (
    <div className="row mt-4">
    <div className="card w-100 mx-4">
     
        <div className="card-header b-t-success" style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <div>  <b>Agenda Detail</b></div>
        </div>
        <div>
       
        </div>
        <div className="card-body">
       
          
            <form onSubmit={()=>console.log('called')}>
            <div className='col-md-9'>
                        <div className="form-group mt-3">
                            <label htmlFor="company_code">Agenda Title</label>
                            <input
                                    type="text"
                                    name="agenda_title"
                                    id="agenda_title"
                                    style={{minWidth: '200px'}}
                                    placeholder="Enter Agenda Title"
                                    className="form-control"
                                   
                                />
                          
                        </div>
                    </div>
                    <div className='col-md-9'>
                        <div className="form-group mt-3">
                            <label htmlFor="company_code">Agenda Item</label>

                            <textarea
                                    name="agenda_item"
                                    id="agenda_item"
                                    rows={3}
                                    style={{minWidth: '200px'}}
                                    placeholder="Enter Agenda Details"
                                    className="form-control"
                                  
                                />

                            
                        </div>
                    </div>
                   
                </form>
            <div style={{ marginTop: '20px'}}>
   
   
   <button className="btn btn-primary "   id = 'addAgenda' >{heading}</button>
   <UncontrolledTooltip placement="top" target="addAgenda">
{heading}
</UncontrolledTooltip>
                     </div> 
        </div>
    </div>
</div>
  )
}
const TableWrapper = styled.table`
padding-bottom: 40px;
overflow-x: scroll;
overflow-x: scroll;
::-webkit-scrollbar{
  height: 5px;
  width: 3px;
}

::-webkit-scrollbar-track{
  background: #F9F9FB;
}
::-webkit-scrollbar-thumb{
  background: #4E515680;
  border-radius: 5px;

}

`;