const width = 1366;
const height= 660;

const svg = d3.select('svg');

const render = data => {
    const xValue = d => d.population;
    const yValue = d => d.country;
    const margin = {
        top: 70,
        bottom: 50,
        left: 150,
        right: 150
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    console.log(innerWidth);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);

    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    const g = svg.append('g')
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    const xAxisFormat = number => d3.format(".3s")(number)
        .replace("G", "B");
    
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(xAxisFormat)
        .tickSize(-innerHeight + 5);

    g.append('g').call(d3.axisLeft(yScale))
        .selectAll('.tick line').remove();
    
    const xAxisG = g.append('g').call(xAxis)
        .attr("transform", "translate(" + 0 + ", " + innerHeight + ")");

    xAxisG.append('text')
        .text('Population')
        .attr('fill', 'black')
        .attr('x', innerWidth / 2)
        .attr('y', 60)
        .attr('class', 'x-title');

    g.selectAll('.domain').remove();

    g.append('text')
        .text('Top 10 Most Populous Countries')
        .attr('class', 'title-bar')
        .attr('y', -15)
        .attr('x', 300);

    g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth());
};

d3.csv('data.csv').then(data => {
    data.forEach(d => {
        d.population = +d.population * 1000;
    });
    render(data);
});
