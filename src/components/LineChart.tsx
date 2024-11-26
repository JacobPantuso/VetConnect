import { useState } from "react";

type LineChartProps = {
    amount: number,
    pet_name: string,
    field: string
}

function LineChart({ amount, pet_name, field }: LineChartProps) {

    return (
        <div className="LineChart">
            <h4>{pet_name}</h4>
            <p>{field}</p>
            <div className="line-chart">
                <div className="line-chart-bar" style={{ width: `${amount}%` }}></div>
            </div>
        </div>
    )
}

export default LineChart;