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
    const [minX, setMinX]=useState([...data_x].sort(function(a, b){return a - b})[0])
    const [maxX, setMaxX]=useState([...data_x].sort(function(a, b){return a - b})[data_x.length-1])
    const [minY, setMinY]=useState([...data_y].sort(function(a, b){return a - b})[0])
    const [maxY, setMaxY]=useState([...data_y].sort(function(a, b){return a - b})[data_y.length-1])
    let numPoints=data_x.length;
    let sumX = 0;
    let sumXsq = 0;
    let sumY = 0;
    let sumXY=0;
    let SSR= 0;
    let SST= 0;
    data_x.forEach((num,ind)=>{
        sumX+=data_x[ind];
        sumY+=data_y[ind];
        sumXY+=(data_x[ind]*data_y[ind]);
        sumXsq+=(data_x[ind]*data_x[ind]);
    })
    let mean=sumY/numPoints;
    let yintercept= (sumY*sumXsq - sumX*sumXY)/(numPoints*sumXsq-sumX**2);
    let slope=(numPoints*sumXY-sumX*sumY)/(numPoints*sumXsq-sumX**2)
    const regressionline=(x,slope,yint)=>x*slope+yint
    const regressionData=data_x.map(num=>regressionline(num,slope,yintercept))
    let firstPointY=regressionData.sort(function(a, b){return a - b})[0]
    let lastPointY=regressionData.sort(function(a, b){return a - b})[numPoints-1]
    data_x.forEach((num,ind)=>{
        SSR+=(data_y[ind]-regressionline(data_x[ind],slope,yintercept))**2;
        SST+=(data_y[ind]-mean)**2;
    })
    let r_squared=1-(SSR/SST);


    const margin = { top: 80, right: 160, bottom: 80, left: 80 }
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
            .select(`#scatter`)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)

        // create X and Y axis
        svg
            .append('g')
            .attr('color', 'blue')
            .attr('stroke-width', '5px')
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("class", "tickmarks")
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

        let equation= ``;
        let rsqString=``;
        if(data_x.length>0){
            equation=`y=${yintercept.toFixed(2)}+${slope.toFixed(2)}x`
            rsqString=`r^2=${r_squared.toFixed(2)}`
        }

        // regression equation label
        svg.append('text')
            .attr('class','equationText')
            .attr('x', (chartWidth-150))
            .attr('y', margin.top+70)            
            .style('font-family', 'Helvetica')
            .text(equation);
        // regression coeff.
        svg.append('text')
            .attr('class','equationText')
            .attr('x', (chartWidth-150))
            .attr('y', margin.top+100)
            .style('font-family', 'Helvetica')
            .text(rsqString);

        // creates the line
        const line = d3
            .line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))

        //appends the line
        const lineWrapper = svg
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        
        //appends the path between the points
        lineWrapper
            .append('path')
            .datum([{x:minX,y:firstPointY},{x:maxX,y:lastPointY}])
            .attr('fill', 'none')
            .attr('stroke', '#3b4456')
            .attr('stroke-width', '3')
            .style("stroke-dasharray", ("7, 7")) 
            .attr('d', line)

        // create scatter points
        svg.append('g')
            .selectAll("dot")
            .data(dataset)
            .enter()
            .append("circle")
                .attr("cx", function (d) { return xScale(d.x); } )
                .attr("cy", function (d) { return yScale(d.y); } )
                .attr("r", 5)
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .style("fill", "#CC0000");
        return ()=>{
            d3.selectAll("#scatter svg").remove();
        }
    },[data_x,data_y,chartWidth])

    return(
        <>
        <div id="scatter"></div>
        </>
    )
}

export default Scatterplot;
