import * as d3 from "d3";
import { useEffect, useState } from 'react';

const LineGraph=( { data_x, data_y,chartWidth,chartHeight,color="#CC0000",children} )=>{
    const [minX, setMinX]=useState(data_x.reduce((a, b) => Math.min(a, b), Infinity))
    const [maxX, setMaxX]=useState(data_x.reduce((a, b) => Math.max(a, b), -Infinity))
    const [minY, setMinY]=useState(data_y.reduce((a, b) => Math.min(a, b), Infinity))
    const [maxY, setMaxY]=useState(data_y.reduce((a, b) => Math.max(a, b), -Infinity))
    
    let numPoints=data_x.length;
    const margin = { top: 80, right: 80, bottom: 80, left: 80 }
    const width = chartWidth - margin.left - margin.right
    const height = chartHeight - margin.top - margin.bottom
    const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, width])
    const yScale = d3.scaleLinear().domain([minY,maxY]).range([height, 0])
    const dataset = d3.range(numPoints).map((d,ind) => {
        return { x: data_x[ind], y: data_y[ind] }
    })
    useEffect(()=>{
        const svg = d3.select(`#scatter2 svg`)
        // creates the line
        const line = d3.line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(d3.curveMonotoneX)

        //appends the line
        svg
            .append('path')
            .datum(dataset)
            .attr('class','line')
            .attr('d', line)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', '3')
            

        return ()=>{
            d3.selectAll("#scatter2 svg").remove();
    }
    },[data_x,data_y,chartWidth])
    
    return(
        <>{children}</>
    )
}

export default LineGraph