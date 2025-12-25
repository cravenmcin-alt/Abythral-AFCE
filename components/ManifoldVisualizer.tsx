import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default ({ stress }: { stress: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const w = svgRef.current.clientWidth, h = svgRef.current.clientHeight;
    const rows = 20, cols = 25, pts: any[] = [];
    for (let r = 0; r <= rows; r++)
      for (let c = 0; c <= cols; c++)
        pts.push({ x: (c/cols)*w, y: (r/rows)*h, ox: (c/cols)*w, oy: (r/rows)*h, n: Math.random()*Math.PI*2 });
    const line = d3.line<any>().x(d => d.x).y(d => d.y).curve(d3.curveBasis);
    const g = svg.append("g");
    const render = () => {
      const t = Date.now() * 0.001;
      pts.forEach(p => {
        p.x = p.ox + Math.sin(t + p.n) * (20 * stress);
        p.y = p.oy + Math.cos(t + p.n) * (20 * stress);
      });
      g.selectAll("path").remove();
      const color = d3.interpolateRgb("rgba(139, 92, 246, 0.3)", "rgba(239, 68, 68, 0.7)")(stress);
      for (let r = 0; r <= rows; r++) g.append("path").datum(pts.slice(r*(cols+1), (r+1)*(cols+1))).attr("d", line).attr("fill", "none").attr("stroke", color).attr("stroke-width", 0.7);
      requestAnimationFrame(render);
    };
    render();
  }, [stress]);
  return <svg ref={svgRef} className="w-full h-full" />;
};
