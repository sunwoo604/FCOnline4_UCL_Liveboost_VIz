function def(){
    let resConverter = function(d){
        return{
            team1 : d.team1,
            team2: d.team2,
            team1_score1: parseInt(d.team1_score1),
            team2_score1: parseInt(d.team2_score1),
            team1_score2: parseInt(d.team1_score2),
            team2_score2: parseInt(d.team2_score2),
            team1_tot: parseInt(d.team1_tot),
            team2_tot: parseInt(d.team2_tot),
            winner: d.winner
        }
    }
    let boostConverter = function(d){
        return{
            name: d.name,
            boost: parseInt(d.boost),
            rating1: parseFloat(d.rating_1),
            min1 : parseInt(d.min_1),
            rating2: parseFloat(d.rating_2),
            min2: parseInt(d.min_2),
            team: d.team
        }
    }
    Promise.all([
        d3.csv("res16.csv",resConverter),
        d3.csv("boost16.csv",boostConverter),
        d3.csv("res8.csv",resConverter),
        d3.csv("boost8.csv",boostConverter),
        d3.csv("res4.csv",resConverter),
        d3.csv("boost4.csv",boostConverter),
        d3.csv('player_team.csv'),
        d3.csv('team_count.csv')
    ]).then(function(files) {
        bracket(files)
        map(files)
    }).catch(function(err) {
        console.log(err)
    })
}
function bracket(files){
    let team_names = {'Liverpool':'Liverpool FC',
    'Real Madrid':'Real Madrid',
    'Dourtmund': 'Dortmund',
    'Chelsea': 'Chelsea FC',
    'Leipzig': 'RB Leipsizg',
    'Man_City':'Manchester City',
    'PSG':'Paris Saint Germain',
    'Bayern':'FC Bayern Munich',
    'AC Milan':'AC Milan',
    'Spurs':'Tottenham Hotspurs',
    'Frankfurt':'Eintracht Frankfurt',
    'Napoli':'S.S.C. Napoli',
    'Brugge': 'Club Brugge',
    'Benfica':'SL Benfica',
    'Inter' :'Inter Milan',
    'Porto':'FC Porto'}

    let team_color = {'Liverpool':'#d00027',
    'Real Madrid':'#fec557',
    'Dourtmund': '#fbfb04',
    'Chelsea': '#034694',
    'Leipzig': '#de013f',
    'Man_City':'#6caddf',
    'PSG':'#0454b4',
    'Bayern':'#dd0129',
    'AC Milan': '#df061b',
    'Spurs':'#001c57',
    'Frankfurt':'#e2000f',
    'Napoli':'#003c82',
    'Brugge': '#006aa8',
    'Benfica':'#009248',
    'Inter' :'#001ea0',
    'Porto':'#205299'}

    function avgrate(a,b){
        if(a==0){
            return b
        }
        if(b==0){
            return a
        }
        return (a+b)/2
    }

    var mouseover = function(d) {
        ptip.style("opacity",1)
        let x = d.offsetX+20
        let y = d.offsetY-30
    }
    var mousemove = function(d) {
        ptxt.selectAll('text').remove()
        let data = d.target.__data__
        let x = d.offsetX+20
        let y = d.offsetY-30
        ptxt
            .attr("x", x+10)
            .attr("y", y+15)
        prect
            .attr("x", x)
            .attr("y", y)
        
        ptxt.append("text")
        .attr("x", x+10)
        .attr("y",y+15)
        .html(`Name: ${data.name}`)

        ptxt.append("text")
        .attr("x", x+10)
        .attr("y",y+25)
        .html(`Rating 1: ${data.rating1}`)

        ptxt.append("text")
        .attr("x", x+10)
        .attr("y",y+35)
        .html(`Playing Time 1: ${data.min1}`)

        ptxt.append("text")
        .attr("x", x+10)
        .attr("y",y+45)
        .html(`Rating 2: ${data.rating2}`)

        ptxt.append("text")
        .attr("x", x+10)
        .attr("y",y+55)
        .html(`Playing Time 2: ${data.min2}`)

        ptxt.append("text")
        .attr("x", x+10)
        .attr("y",y+65)
        .html(`Boost: ${data.boost}`)

        ptxt.append("text")
        .attr("x", x+10)
        .attr("y",y+75)
        .html(`Team: ${data.team}`)
        
    }
    var mouseleave = function(d) {
        ptip.style("opacity", 0)
        prect.attr('y',100000)
        ptxt.select('*').remove()
    }

    var mouseclick = function(d) {
        let data = d.target.__data__
        console.log(data)
        let x = d.offsetX-toolwidth/2
        let y = d.offsetY-30
        let players = data.players
        console.log(players)
        toolrect
        .attr("x", x)
        .attr("y", y)
        if(Tooltip.style('Opacity')==0){
            Tooltip.style('Opacity',1)
        }
        else{
            Tooltip.selectAll(".pscat").remove()
            Tooltip.selectAll("g").remove()
            tooltxt.html("")
        }
        tooltxt.html(`${team_names[data.team1]} ${data.team1_tot} : ${data.team2_tot} ${team_names[data.team2]}`)
        .attr("x",x+toolwidth/5)
        .attr("y",y+40)

        var legend = Tooltip.append('g')
        .attr('class','legend')
        .style("font-size", "12px")

        legend.append('circle')
        .attr('r',5)
        .attr("fill",team_color[data.team1])
        .attr('cx',x+4*(toolwidth/5))
        .attr('cy',y+20)

        legend.append('circle')
        .attr('r',5)
        .attr("fill",team_color[data.team2])
        .attr('cx',x+4*(toolwidth/5))
        .attr('cy',y+35)

        legend.append('text').html(team_names[data.team1])
        .attr('x',x+4*(toolwidth/5)+15)
        .attr('y',y+25)
        .style('fill','black')

        legend.append('text').html(team_names[data.team2])
        .attr('x',x+4*(toolwidth/5)+15)
        .attr('y',y+40)
        .style('fill','black')

        legend.append('text').html('Total Played Minutes')
        .attr('x',x+2*(toolwidth/5))
        .attr('y',y+toolheight-toolPadding/2)
        .style('fill','black')

        legend.append('text').html('Avg Ratings')
        .attr('x',x+toolPadding/10)
        .attr('y',y+toolheight/2-toolPadding/3+5)
        .style('fill','black')


        let minScale = d3.scaleLinear().domain([-10,190]).range([toolPadding, toolwidth-toolPadding])
        let rateScale = d3.scaleLinear().domain([2,10]).range([toolheight-toolPadding,toolPadding])
        let boostScale = d3.scaleLinear().domain([-4,7]).range([3,17])
        const xAxis = d3.axisBottom().scale(minScale)
        const yAxis = d3.axisLeft().scale(rateScale)
        Tooltip.append('g').call(xAxis).attr("class","xAxis").attr("transform",`translate(${x},${y+toolheight-toolPadding})`)
        Tooltip.append('g').call(yAxis).attr("class","yAxis").attr("transform",`translate(${x+toolPadding},${y})`)
        Tooltip.selectAll(".pscat").data(players).join("circle")
        .attr("class","pscat")
        .attr("r",d=>boostScale(d.boost))
        .attr("fill",d=>team_color[d.team])
        .attr("opacity",0.8)
        .attr("cx",d=>x+minScale(d.min1+d.min2))
        .attr("cy",d=>y+rateScale(avgrate(d.rating1,d.rating2)))
        .attr('id',d=>d.name)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    }

    var tooltipclick = function(d) {
        Tooltip.style('Opacity',0)
        Tooltip.selectAll(".pscat").remove()
        Tooltip.selectAll(".legend").remove()
        Tooltip.selectAll("g").remove()
        toolrect.attr("y",10000)
        ptip.style("opacity", 0)
    }
    let res16 = files[0]
    let boost16 = files[1]
    let res8 = files[2]
    let boost8 = files[3]
    let res4 = files[4]
    let boost4 = files[5]
    res16.map(function(d){
        let team1 = d.team1
        let team2 = d.team2
        let round = boost16.filter(d => (d.team==team1 || d.team==team2))
        d.players = round
        return d
    })
    res8.map(function(d){
        let team1 = d.team1
        let team2 = d.team2
        let round = boost8.filter(d => (d.team==team1 || d.team==team2))
        d.players = round
        return d
    })
    res4.map(function(d){
        let team1 = d.team1
        let team2 = d.team2
        let round = boost4.filter(d => (d.team==team1 || d.team==team2))
        d.players = round
        return d
    })

    const svgWidth = 1300;
    const svgHeight = 900;
    const padding16 = 75;
    let svg = d3.select('#bracket').append('svg')
    .attr('width',svgWidth)
    .attr('height',svgHeight)
    const xScale16 = d3.scalePoint().domain([0,1,2,3,4,5,6,7,8]).range([padding16,svgWidth-padding16])
    const xScale8 = d3.scalePoint().domain([0,1,2,3,4]).range([padding16+100,svgWidth])
    const xScale4 = d3.scalePoint().domain([0,1,2]).range([padding16+250,svgWidth+175])
    const ybScale = d3.scalePoint().domain([16,8,4]).range([0,svgHeight-300])
    const max16 = Math.max(d3.max(res16,d=>d.team1_tot),d3.max(res16,d=>d.team2_tot))
    const size16 = d3.scaleLinear().domain([0,max16]).range([25,75])
    const max8 = Math.max(d3.max(res8,d=>d.team1_tot),d3.max(res8,d=>d.team2_tot))
    const size8 = d3.scaleLinear().domain([0,max8]).range([25,75])
    const max4 = Math.max(d3.max(res4,d=>d.team1_tot),d3.max(res4,d=>d.team2_tot))
    const size4 = d3.scaleLinear().domain([0,max4]).range([25,75])

    
    svg.selectAll(".r16")
    .data(res16)
    .enter().append("g")
    .attr('class','r16')
    .on('click',mouseclick)
    
    svg.selectAll(".r16").append("rect")
        .attr("height", 100)
        .attr("width", 125)
        .attr('x',(d,i)=>xScale16(i))
        .attr('y',ybScale(16))
        .style('fill','white')
        .style('opacity',0.15)
    
    svg.selectAll(".r16").append("svg:image")
    .attr('width', d=>size16(d.team1_tot))
    .attr('height', d=>size16(d.team1_tot))
    .attr("xlink:href", d=>"logos/"+d.team1+".png")
    .attr('x',(d,i)=>xScale16(i))
    .attr('y',ybScale(16))
    .attr("transform",d=>`translate(0,${50-size16(d.team1_tot)/2})`)
    .style('opacity',function(d){
        if(d.team1 == d.winner){
            return 1
        }
        return 0.6
    })

    svg.selectAll(".r16").append("svg:image")
    .attr('width', d=>size16(d.team2_tot))
    .attr('height', d=>size16(d.team2_tot))
    .attr("xlink:href", d=>"logos/"+d.team2+".png")
    .attr('x',(d,i)=>xScale16(i)+50)
    .attr('y',ybScale(16))
    .attr("transform",d=>`translate(${70-size16(d.team2_tot)},${50-size16(d.team2_tot)/2})`)
    .style('opacity',function(d){
        if(d.team2 == d.winner){
            return 1
        }
        return 0.6
    })

    svg.selectAll(".r8")
    .data(res8)
    .enter().append("g")
    .attr('class','r8')
    .on('click',mouseclick)
    
    svg.selectAll(".r8").append("rect")
        .attr("height", 100)
        .attr("width", 125)
        .attr('x',(d,i)=>xScale8(i))
        .attr('y',ybScale(8))
        .style('fill','white')
        .style('opacity',0.15)
    
    svg.selectAll(".r8").append("line")
        .attr('x1',(d,i)=>xScale8(i)+63)
        .attr('y1',ybScale(8))
        .attr('x2',(d,i)=>xScale16(i*2)+63)
        .attr('y2',ybScale(16)+100)
        .attr('stroke',d=>team_color[d.team1])
        .attr('stroke-width',3)
    svg.selectAll(".r8").append("line")
        .attr('x1',(d,i)=>xScale8(i)+63)
        .attr('y1',ybScale(8))
        .attr('x2',(d,i)=>xScale16(i*2+1)+63)
        .attr('y2',ybScale(16)+100)
        .attr('stroke',d=>team_color[d.team2])
        .attr('stroke-width',3)
    
    svg.selectAll(".r8").append("svg:image")
    .attr('width', d=>size8(d.team1_tot))
    .attr('height', d=>size8(d.team1_tot))
    .attr("xlink:href", d=>"logos/"+d.team1+".png")
    .attr('x',(d,i)=>xScale8(i))
    .attr('y',ybScale(8))
    .attr("transform",d=>`translate(0,${50-size8(d.team1_tot)/2})`)
    .style('opacity',function(d){
        if(d.team1 == d.winner){
            return 1
        }
        return 0.6
    })

    svg.selectAll(".r8").append("svg:image")
    .attr('width', d=>size8(d.team2_tot))
    .attr('height', d=>size8(d.team2_tot))
    .attr("xlink:href", d=>"logos/"+d.team2+".png")
    .attr('x',(d,i)=>xScale8(i)+50)
    .attr('y',ybScale(8))
    .attr("transform",d=>`translate(${70-size8(d.team2_tot)},${50-size8(d.team2_tot)/2})`)
    .style('opacity',function(d){
        if(d.team2 == d.winner){
            return 1
        }
        return 0.6
    })

    svg.selectAll(".r4")
    .data(res4)
    .enter().append("g")
    .attr('class','r4')
    .on('click',mouseclick)

    svg.selectAll(".r4").append("line")
    .attr('x1',(d,i)=>xScale4(i)+63)
    .attr('y1',ybScale(4))
    .attr('x2',(d,i)=>xScale8(i*2)+63)
    .attr('y2',ybScale(8)+100)
    .attr('stroke',d=>team_color[d.team1])
    .attr('stroke-width',3)
    svg.selectAll(".r4").append("line")
    .attr('x1',(d,i)=>xScale4(i)+63)
    .attr('y1',ybScale(4))
    .attr('x2',(d,i)=>xScale8(i*2+1)+63)
    .attr('y2',ybScale(8)+100)
    .attr('stroke',d=>team_color[d.team2])
    .attr('stroke-width',5)
    
    svg.selectAll(".r4").append("rect")
        .attr("height", 100)
        .attr("width", 125)
        .attr('x',(d,i)=>xScale4(i))
        .attr('y',ybScale(4))
        .style('fill','white')
        .style('opacity',0.3)
    
    svg.selectAll(".r4").append("svg:image")
    .attr('width', d=>size4(d.team1_tot))
    .attr('height', d=>size4(d.team1_tot))
    .attr("xlink:href", d=>"logos/"+d.team1+".png")
    .attr('x',(d,i)=>xScale4(i))
    .attr('y',ybScale(4))
    .attr("transform",d=>`translate(0,${50-size4(d.team1_tot)/2})`)
    .style('opacity',function(d){
        if(d.team1 == d.winner){
            return 1
        }
        return 0.6
    })

    svg.selectAll(".r4").append("svg:image")
    .attr('width', d=>size4(d.team2_tot))
    .attr('height', d=>size4(d.team2_tot))
    .attr("xlink:href", d=>"logos/"+d.team2+".png")
    .attr('x',(d,i)=>xScale4(i)+50)
    .attr('y',ybScale(4))
    .attr("transform",d=>`translate(${70-size4(d.team2_tot)},${50-size4(d.team2_tot)/2})`)
    .style('opacity',function(d){
        if(d.team2 == d.winner){
            return 1
        }
        return 0.6
    })



    var toolwidth = 600
    var toolheight = 450
    var toolPadding = 80
    var Tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("fill","white")
        .style("opacity",0)
        .on("click",tooltipclick)
    var toolrect = svg.select('.tooltip')
        .append("rect")
        .attr("width",toolwidth)
        .attr("height",toolheight)
        .style("stroke","black")
        .style("stroke-width","1")
        .attr("y",10000)
    var tooltxt = svg.select('.tooltip')
    .append("text")
    .style("fill","black")

    var ptip = svg.append("g")
        .attr("class", "ptip")
        .style("fill","white")
        .style("opacity",0)
        .on("click",tooltipclick)
    var prect = svg.select('.ptip')
        .append("rect")
        .attr("width",130)
        .attr("height",90)
        .style("stroke","black")
        .style("stroke-width","1")
        .attr("y",10000)
    var ptxt = svg.select('.ptip')
    .append("g")
    .style("fill","black")
    .style("font-size", "10px")
}


function map(files){
    let team_names = {'Liverpool':'Liverpool FC',
    'Real Madrid':'Real Madrid',
    'Dourtmund': 'Dortmund',
    'Chelsea': 'Chelsea FC',
    'Leipzig': 'RB Leipsizg',
    'Man_City':'Manchester City',
    'PSG':'Paris Saint Germain',
    'Bayern':'FC Bayern Munich',
    'AC Milan':'AC Milan',
    'Spurs':'Tottenham Hotspurs',
    'Frankfurt':'Eintracht Frankfurt',
    'Napoli':'S.S.C. Napoli',
    'Brugge': 'Club Brugge',
    'Benfica':'SL Benfica',
    'Inter' :'Inter Milan',
    'Porto':'FC Porto'}
    const player_team = files[6]
    const team_count = files[7]
    const statesmap = d3.json("europe.geojson")
    const svgWidth = 1300
    const svgHeight = 1000;
    const teamCnt = {}
    console.log(team_count)
    team_count.map(function(d){
        if(teamCnt[d.country]==null){
            teamCnt[d.country] = [d.team]
        }
        else{
            teamCnt[d.country].push(d.team)
        }
    })
    console.log(teamCnt)
    let svg = d3.select('#mapsvg')
    let europeProjection = d3.geoMercator()
    .center([ 13, 52 ])
    .scale([ svgWidth / 1.5 ])
    .translate([ svgWidth / 2, svgHeight / 2 ])

    statesmap.then(function(data){
        var mouseover = function(d) {
            let data = d.target.__data__
            ttip.style("opacity",1)
            let x = d.offsetX+20
            let y = d.offsetY-30
            trect.attr('height',50+10*data.players.length)
        }
        var mousemove = function(d) {
            ttxt.selectAll('text').remove()
            let data = d.target.__data__
            let x = d.offsetX+20
            let y = d.offsetY-30
            ttxt
                .attr("x", x+10)
                .attr("y", y+15)
            trect
                .attr("x", x)
                .attr("y", y)
            ttxt.append('text')
            .attr('x',x+10)
            .attr('y',y+15)
            .html(team_names[data.team])
            ttxt.selectAll("text")
            .data(data.players).enter()
            .append('text')
            .attr('x',(d,i)=>x+10)
            .attr('y',(d,i)=>y+30+i*10)
            .html(d=>d.player)
        }
        var mouseleave = function(d) {
            ttip.style("opacity", 0)
            trect.attr('y',100000)
            ttxt.select('*').remove()
        }
        var mouseclick = function(d) {
            Tooltip.selectAll(".logo").remove()
            let data = d.target.__data__
            console.log(data)
            let player_list = data.teams
            player_list = player_list.map(function(team){
                out = {}
                out.team = team
                players = player_team.filter(d=> d.team == team)
                out.players = players
                return out
            })
            let x = d.offsetX
            let y = d.offsetY-30
            toolrect.attr("width", player_list.length*50 + 50)
            const teamScale = d3.scalePoint().domain(data.teams).range([toolPadding,player_list.length*50+50-toolPadding])
            toolrect
            .attr("x", x)
            .attr("y", y)
            Tooltip.selectAll(".logo")
            .data(player_list)
            .enter().append("svg:image")
            .attr('class',"logo")
            .attr('width', 30)
            .attr('height', 30)
            .attr("xlink:href", d=>"logos/"+d.team+".png")
            .attr('x',(d,i)=>teamScale(d.team)+x)
            .attr('y',y+toolheight/2)
            .attr("transform",d=>`translate(${-15},${-15})`)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            if(Tooltip.style('opacity')==0){
                Tooltip.style('opacity',1)
            }
            
        }
        var tooltipclick = function(d) {
            Tooltip.style('opacity',0)
            toolrect.attr("y",10000)
            Tooltip.selectAll(".logo").remove()
            ttip.style("opacity", 0)
        }
        let finData = data.features.map(d=>{
            if(teamCnt[d.properties.NAME] == null){
                d.teams = []
            }
            else{
                d.teams = teamCnt[d.properties.NAME]
            }
            return d
        })
        console.log(finData)
        const color = d3.scaleSequential().domain([0,4])
        .interpolator(d3.interpolate("#00016d","#b9e2ff"))

        var path = d3.geoPath().projection(europeProjection)
        svg.selectAll("path").data(finData).enter()
        .append('path')
        .attr("d", path)
        .style("fill",d=>color(d.teams.length))
        .on('click',mouseclick)
        var toolwidth = 400
        var toolheight = 100
        var toolPadding = 50
        var Tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("fill","white")
            .style("opacity",0)
            .on("click",tooltipclick)
        var toolrect = svg.select('.tooltip')
            .append("rect")
            .attr("width",toolwidth)
            .attr("height",toolheight)
            .style("stroke","black")
            .style("stroke-width","1")
            .attr("y",10000)

        var ttip = svg.append("g")
            .attr("class", "ptip")
            .style("fill","white")
            .style("opacity",0)
        var trect = svg.select('.ptip')
            .append("rect")
            .attr("width",130)
            .attr("height",90)
            .style("stroke","black")
            .style("stroke-width","1")
            .attr("y",10000)
        var ttxt = svg.select('.ptip')
        .append("g")
        .style("fill","black")
        .style("font-size", "10px")
    })
}