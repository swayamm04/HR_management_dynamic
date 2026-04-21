export function numberToIndianWords(num: number): string {
  if (num === 0) return "Zero";

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const format = (n: number, suffix: string) => {
    if (n === 0) return '';
    let str = '';
    if (n > 19) {
      str = b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    } else {
      str = a[n];
    }
    return str + ' ' + suffix + ' ';
  };

  let words = '';
  // Crores
  words += format(Math.floor(num / 10000000), 'Crore');
  num %= 10000000;
  // Lakhs
  words += format(Math.floor(num / 100000), 'Lakh');
  num %= 100000;
  // Thousands
  words += format(Math.floor(num / 1000), 'Thousand');
  num %= 1000;
  // Hundreds
  words += format(Math.floor(num / 100), 'Hundred');
  num %= 100;
  // Tens & Units
  if (num > 0 && words !== '') words += 'and ';
  if (num > 19) {
    words += b[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + a[num % 10] : '');
  } else {
    words += a[num];
  }

  return words.trim() + " Rupees only";
}
