const GameLogic = {
    generatePeriodResult() {
        const number = Math.floor(Math.random() * 10);
        let color = '';
        if ([1, 3, 7, 9].includes(number)) color = 'Green';
        else if ([2, 4, 6, 8].includes(number)) color = 'Red';
        else if (number === 0) color = 'Red-Purple';
        else color = 'Green-Purple';

        const size = number >= 5 ? 'Big' : 'Small';
        return { number, color, size };
    }
};
