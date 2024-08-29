/**
 * RadarVariant Component:
 * - This component renders a RadarChart using the Recharts library, displaying data in a radial format.
 * - It includes key chart components like PolarGrid, PolarAngleAxis, PolarRadiusAxis, and Radar.
 * - The chart is designed to be responsive, adjusting its size to fit different screen widths with a fixed height of 350px.
 * - The Radar component is styled with a stroke and fill color, offering visual clarity with a semi-transparent fill.
 * - The chart's labels are adjusted for better readability with a font size of 12px.
 **/

import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from "recharts";

type Props = {
    data?: {
        name: string;
        value: number;
    }[];
};


export const RadarVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%"  height={350}>
            <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="60%"
            data={data}
            >
                <PolarGrid />
                <PolarAngleAxis style={{ fontSize: "12px" }} dataKey="name"/>
                <PolarRadiusAxis style={{ fontSize: "12px" }} />
                <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6}/>
            </RadarChart>
        </ResponsiveContainer>
    );
};
