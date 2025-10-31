import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid , Tooltip , Legend, ResponsiveContainer, Cell, } from 'recharts';

const CustomBarChart = ({data}) => {

    // Function for alternate colors
    const getBarColor = (index) =>{
        //   console.log("Color for bar", index, index % 2 === 0 ? "#875cf5" : "#cfbefb");
        return index % 2 === 0 ? "#875cf5" : "#cfbefb";
    };

    const CustomTooltip = ({active, payload}) =>{
        // console.log("Tooltip payload:", payload);
        if(active && payload && payload.length) {
            return (
                <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
                <p className='text-xs font-semibold text-blue-800 mb-1'>{payload[0].payload.category}</p>
                <p className='text-sm text-gray-600'>
                    Amount: <span className='text-sm font-medium text-gray-900'>
                      ₹{payload[0].payload.amount}  
                    </span>
                </p>
            </div> 
            );
        }
        return null ;
    };
  return (
    <div className=''>
        <ResponsiveContainer width='100%' height={300}>
            <BarChart data={data}>
                <CartesianGrid stroke='none' />

                <XAxis dataKey='month' tick={{ fontSize: 12, fill: "#555" }} stroke='none' />
                <YAxis tick={{fontSize:12, fill:"#555"}} stroke='none' />

                <Tooltip content={CustomTooltip} />

                <Bar dataKey='amount'
                fill='#FF8042'
                radius={[10,10,0,0]}
                activeDot={{r:8, fill:"yellow"}}
                activeStyle={{fill:'green'}}
                >
                    {data.map((entry, index)=>(
                        <Cell key={index} fill={getBarColor(index)}/>
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default CustomBarChart