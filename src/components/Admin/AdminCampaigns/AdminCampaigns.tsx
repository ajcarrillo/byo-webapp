import React, { useCallback, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { apiCall } from '../../../utils/api-utils'
import '../../CustomControls/DatePicker/style-overrides.css'
import './AdminCampaigns.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type ChartData = {
  labels: string[];
  datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminCampaignsProps {}

const AdminCampaigns: React.FC<IAdminCampaignsProps> = (props: IAdminCampaignsProps) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [startDate, endDate] = dateRange
  const [chartData, setChartData] = useState<ChartData | null>(null)

  const rgbColours = [
    '144, 166, 249',
    '116, 137, 215',
    '99, 117, 184',
    '83, 99, 158',
    '66, 80, 131',
    '53, 64, 105',
    '40, 48, 79'
  ]

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Campaign Sales Conversions',
      },
    },
  }

  const handleClickSearch = () => {
    if(startDate && endDate) getOrdersList()
  }

  /**
   * Requests orders
   */
  const getOrdersList = useCallback(async () => {
    const token = getStoredAccessToken().accesToken
    const start = startDate ? startDate.toJSON() : ''
    const end = endDate ? endDate.toJSON() : ''
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/admin/shop/orders`,
      'POST',
      token,
      {startDate: start, endDate: end},
      'json'
    )

    if(response.status === 200){
      generateCampaignData(response.data.orders)
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      //
    }
  },[endDate, startDate])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateCampaignData = (orders: any[]) => {
    const trackers: {product: string, type: string, code: string}[] = []
    for(let i = 0; i < orders.length; i++){
      if(orders[i].sales_trackers){
        trackers.push(...(JSON.parse(orders[i].sales_trackers)))
      }
    }

    if(trackers.length > 0){
      const trackerProducts: string[] = []
      const trackerCampaigns: {campaign: string, results: {product: string, sales: number}[]}[] = []

      for(let t = 0; t < trackers.length; t++){
        if(trackers[t].type === 'campaign'){
          if(!trackerProducts.includes(trackers[t].product)){
            trackerProducts.push(trackers[t].product)
          }

          const existingCampaign = trackerCampaigns.find(c => c.campaign === trackers[t].code)
          if(!existingCampaign){
            // Add new campaign with associated product
            trackerCampaigns.push({
              campaign: trackers[t].code, 
              results: [{product: trackers[t].product, sales: 1}]
            })
          }else{
            const results = [...existingCampaign.results]
            const productIndex = results.findIndex(r => r.product === trackers[t].product)
            // Find product in existing campaign
            if(productIndex >= 0){
              results[productIndex].sales++
            }else{
              results.push({product: trackers[t].product, sales: 1})
            }
            const campaignIndex = trackerCampaigns.findIndex(c => c.campaign === trackers[t].code)
            if(campaignIndex >= 0){
              trackerCampaigns[campaignIndex].results = results
            }
          }
        }
      }

      let rgbIndex = -1
      const data = {
        labels: trackerCampaigns.map(l => l.campaign),
        datasets: trackerProducts.map(product => {
          rgbIndex++
          rgbIndex = rgbIndex < rgbColours.length ? rgbIndex : 0
          return {
            label: product,
            data: trackerCampaigns.map(d => {
              const prod = d.results.find(r => r.product === product)
              return prod ? prod.sales : 0
            }),
            backgroundColor: `rgba(${rgbColours[rgbIndex]}, 1)`,
          }
        })
      }
      
      setChartData(data)
    } else {
      setChartData(null)
    }
  }

  return (
    <>
      <div className='AdminCampaigns-container'>
        <div className='AdminCampaigns-header-container'>

          <div className="PanelLabel" style={{border: '1px solid rgb(67,69,81)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <div style={{marginBottom: '.6rem'}}>Search by date range</div>
              <DatePicker 
                dateFormat="dd/MM/yyyy" 
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(date) => setDateRange(date)} 
                isClearable={true}
                showIcon={true} 
                placeholderText="Select a date range"
              />

              <button
                className={!startDate || !endDate ? 'Button-standard-disabled' : 'Button-standard'} 
                style={{marginLeft:'.6rem'}} 
                onClick={() => handleClickSearch()}
                disabled={!startDate || !endDate}
              >
                Generate Report
              </button>              
            </div>

            <div style={{paddingLeft: '2rem'}}>
              To create campaign data, add the following parameter to a product&apos;s url: <br />
              {'www.byowave.com/product/<product_address>'}<strong>?cp={'<campaign_name>'}</strong>
            </div>
          </div>

          <div style={{padding: '1rem', display: 'flex', justifyContent: 'center'}}>
            {chartData && (
              <div style={{width: '90%'}}>
                <Bar options={chartOptions} data={chartData} />
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default AdminCampaigns
