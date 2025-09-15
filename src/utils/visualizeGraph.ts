// Generate graph visualization
export const generateGraphPng = async (
    agent: { getGraphAsync(): Promise<{ drawMermaidPng(): Promise<Blob> }> },
) => {
    const graph = await agent.getGraphAsync();
    const png = await graph.drawMermaidPng();
    await Deno.writeFile("graph.png", new Uint8Array(await png.arrayBuffer()));
};
