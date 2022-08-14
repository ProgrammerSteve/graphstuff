import * as d3 from "d3";
import { useEffect, useState } from 'react';

const Scatterplot=(
    {
        data_x,
        data_y,
        chartWidth,
        chartHeight,
        xTitle="x-axis",
        yTitle="y-axis",
        gTitle="Title",
        children
    }
    )=>{
        const [minX, setMinX]=useState(data_x.reduce((a, b) => Math.min(a, b), Infinity))
        const [maxX, setMaxX]=useState(data_x.reduce((a, b) => Math.max(a, b), -Infinity))
        const [minY, setMinY]=useState(data_x.reduce((a, b) => Math.min(a, b), Infinity))
        const [maxY, setMaxY]=useState(data_y.reduce((a, b) => Math.max(a, b), -Infinity))
    let numPoints=data_x.length;

    const margin = { top: 80, right: 80, bottom: 80, left: 80 }
    const width = chartWidth - margin.left - margin.right
    const height = chartHeight - margin.top - margin.bottom

    //creates the xScale and yScale functions
    const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, width])
    const yScale = d3.scaleLinear().domain([minY,maxY]).range([height, 0])
    // const yScale = d3.scaleLinear().domain([(minY>firstPointY)?firstPointY:minY, (maxY<lastPointY)?lastPointY:maxY]).range([height, 0])

    //create the grids
    const xAxisGrid = d3.axisBottom(xScale)
    .tickSize(-height)
    .tickFormat('')
    .ticks(10);
    const yAxisGrid = d3.axisLeft(yScale)
    .tickSize(-width)
    .tickFormat('')
    .ticks(10);

    //creates a dataset object
    const dataset = d3.range(numPoints).map((d,ind) => {
        return { x: data_x[ind], y: data_y[ind] }
    })

    useEffect(()=>{
        const svg = d3
            .select(`#scatter2`)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)

        // create X axis
        svg
            .append('g')
            .attr('color', 'blue')
            .attr('stroke-width', '5px')
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("class", "tickmarks")
        // create Y axis
        svg
            .append('g')
            .attr('color', 'blue')
            .attr('stroke-width', '5px')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .attr("fill", "black")
            .attr("font-size", "20px")


        // create the grids
        svg.append('g')
            .attr('fill', "rgba(227,226,247,0.5)")
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
            .call(xAxisGrid);
        svg.append('g')
            .attr('fill', "rgba(227,226,247,0.5)")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(yAxisGrid);
            
        // Title
        svg.append('text')
            .attr('fill',`black`)
            .attr('font-family',`Helvetica`)
            .attr('font-size',`30px`)
            .attr('x', (chartWidth/2)+200)
            .attr('y', margin.top-5)
            .text(`${gTitle}`);

        // X label
        svg.append('text')
            .attr('x', width/2 + 80)
            .attr('y', height - margin.top + 150)
            .attr('fill',`black`)
            .attr('font-family',`Helvetica`)
            .attr('font-size',`20px`)
            .text(`${xTitle}`);
        
        // Y label
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(20,' + height/2.3 + ')rotate(-90)')
            .attr('class','axisText')
            .style('font-family', 'Helvetica')
            .text(`${yTitle}`);

        // creates the line
        const line = d3
            .line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))

        //appends the line
        const lineWrapper = svg
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        

        return ()=>{
            d3.selectAll("#scatter2 svg").remove();
        }
    },[data_x,data_y,chartWidth])

    return(
        <>
            {children}
        </>
    )
}

export default Scatterplot;
