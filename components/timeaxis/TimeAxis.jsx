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
    }
    )=>{

    const [minX, setMinX]=useState( new Date(data_x[0])  )
    const [maxX, setMaxX]=useState( new Date(data_x[data_x.length-1])  )
    const [minY, setMinY]=useState(Math.min(...data_y))
    const [maxY, setMaxY]=useState(Math.max(...data_y))

    const [timeValues,setTimeValues]=useState(data_x.map(timestamp=>{
        let newTime= new Date(timestamp)
        return newTime
    }))
    let numPoints=data_x.length;
   useEffect(()=>{
    setMinX( new Date(data_x[0])  )
    setMaxX( new Date(data_x[data_x.length-1])  )
    setMinY(Math.min(...data_y))
    setMaxY(Math.max(...data_y))
    setTimeValues(data_x.map(timestamp=>{
        let newTime= new Date(timestamp)
        return newTime
    }))

   },[data_x,data_y])

    const margin = { top: 80, right: 80, bottom: 80, left: 80 }
    const width = chartWidth - margin.left - margin.right
    const height = chartHeight - margin.top - margin.bottom

    //creates the xScale and yScale functions
    const xScale = d3.scalePoint().domain(timeValues).range([0, width])
    const yScale = d3.scaleLinear().domain([minY-(maxY-minY)*0.25,maxY+(maxY-minY)*0.1]).range([height, 0])


    //create the grids
    const xAxisGrid = d3.axisBottom(xScale)
    .tickSize(-height)
    // .tickValues(timeValues)
    // .tickFormat("%Y-%m-%d")
    .tickFormat("")
    .ticks(10)

    const yAxisGrid = d3.axisLeft(yScale)
    .tickSize(-width)
    .tickFormat('')
    .ticks(15);

    // creates a dataset object
    const dataset = d3.range(numPoints).map((d,ind) => {
        return { x: timeValues[ind], y: data_y[ind] }
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
            .call(d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%H:%M"))
            )
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
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
            .attr('x', (chartWidth/2)-80)
            .attr('y', margin.top-5)
            .text(`${gTitle}`);

        // X label
        svg.append('text')
            .attr('x', width/2 + 80)
            .attr('y', height - margin.top + 220)
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
            .attr('stroke', 'red')
            .attr('stroke-width', '3')


        return ()=>{
            d3.selectAll("#scatter2 svg").remove();
        }
    },[data_x,data_y,chartWidth])

    return(
        <>
           <div id="scatter2"/>
        </>
    )
}

export default Scatterplot;
