import formatCurrency from '../scripts/utils/money.js';

function assertEqual(actual, expected, testName) {
  if (actual !== expected) {
    throw new Error(`${testName} failed: expected "${expected}", got "${actual}"`);
  }
}

function runMoneyTests() {
  const tests = [
    {
      name: 'formats whole dollars',
      actual: formatCurrency(2095),
      expected: '20.95'
    },
    {
      name: 'formats zero cents',
      actual: formatCurrency(0),
      expected: '0.00'
    },
    {
      name: 'formats single-digit cents',
      actual: formatCurrency(5),
      expected: '0.05'
    },
    {
      name: 'formats large values',
      actual: formatCurrency(123456789),
      expected: '1234567.89'
    },
    {
      name: 'formats negative values',
      actual: formatCurrency(-500),
      expected: '-5.00'
    }
  ];

  tests.forEach((test) => {
    assertEqual(test.actual, test.expected, test.name);
  });

  console.log(`All ${tests.length} money.js tests passed.`);
}

runMoneyTests();
