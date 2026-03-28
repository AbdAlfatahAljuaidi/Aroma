import React, { useState } from 'react'
import SideMenu from './SideMenu'
import Statistics from './Statistics'
import Sales from './Sales'
import Orders from './Orders'
import Products from './Products'
import Materials from './Materials'
import Inventory from './Inventory'
import Clients from './Clients'
import AI from './AI'

const Dashboard = () => {
const [page,setPage] = useState("Statistics")

  return (
    <div className='md:grid grid-cols-[20%_80%]'>
        <SideMenu setPage={setPage} page={page}   />
   <div>
    {page === "Statistics" && <Statistics />}
    {page === "Sales" && <Sales />}
    {page === "Orders" && <Orders />}
    {page === "Products" && <Products />}
    {page == "Materials" && <Materials />}
    {page == "Inventory" && <Inventory />}
    {page == "Clients" && <Clients />}
    {page == "AI" && <AI />}
   </div>
    </div>
  )
}

export default Dashboard