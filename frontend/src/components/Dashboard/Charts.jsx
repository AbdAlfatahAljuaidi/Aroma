import React from 'react'
import {Chart as ChartJS } from 'chart.js/auto'
import {Bar, Doughnut, Line} from 'react-chartjs-2'
const Charts = () => {
  return (
    <div className='mt-16 md:grid grid-cols-2 gap-20 px-10 '>
      <div>  <Bar 
        data={{
            labels: ["ميلك شيك" , "قهوة تركي" , "اسبريسو"],
            datasets:[
                {
                    label:"الربح",
                    data:[200,400,500],
                    backgroundColor:[
                      "rgb(146, 64, 14)"
                    ]
                }
            ]
        }}
        /></div>
      <div className='mt-10 md:mt-0'>  <Line 
        data={{
            labels: ["الشهر الاول" , "الشهر التاني" , "الشهر الثالث"],
            datasets:[
                {
                    label:"المبيعات",
                    data:[200,400,500],
                    backgroundColor:[
                      "rgb(146, 64, 14)",
                    ]
                }
            ]
        }}
        /></div>

        
    </div>
  )
}

export default Charts