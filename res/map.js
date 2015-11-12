var map = {
    data: [
        { type: 'bg', imgName: 'bg1Tiled' },
        { x: 300, y: 300, r: 200, type: 'lamp' },
        { x: 300, y: 800, r: 200, type: 'lamp' },
        { x: 800, y: 300, r: 200, type: 'lamp' },
        { x: 800, y: 800, r: 200, type: 'lamp' },
        { x: 550, y: 550, r: 300, type: 'lamp', power: 1, on: false },
        { x: 250, y: 650, size: 400, type: 'tree', imgName: 'tree1' },
        { x: 800, y: 650, size: 400, type: 'tree', imgName: 'tree2' },
        { x: 600, y: 1250, size: 400, type: 'tree', imgName: 'tree3' }],
    creatures: [
        { x: 600, y: 600, type: 'zombie' },
        { x: 1300, y: 900, type: 'zombie' },
        { x: -500, y: -450, type: 'zombie' },
        { x: -300, y: 150, type: 'zombie' }
    ]
};

var randomMap = (function () {
    var map = {
        data: [{ type: 'bg', imgName: 'bg1Tiled' }],
        creatures: []
    };
    for (var i = 0; i < 40; i++) {
        map.data.push({
            type: 'lamp',
            x: rand(-5000, 5000) | 0,
            y: rand(-4000, 4000) | 0,
            r: rand(100, 400) | 0,
            power: rand(0.4, 1),
            on: !!(rand(0.5, 2) | 0)
        })
        map.data.push({
            type: 'tree',
            size: rand(300, 500) | 0,
            x: rand(-5000, 5000) | 0,
            y: rand(-4000, 4000) | 0,
            imgName: 'tree' + (rand(1, 4) | 0)
        });
        map.creatures.push({
            type: 'zombie',
            x: rand(-5000, 5000) | 0,
            y: rand(-4000, 4000) | 0,
        });
    }
    return map;
})();