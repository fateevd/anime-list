const numberOfName: Record<number, string> = {
  1: 'a',
  2: 'b',
  3: 'c',
  4: 'd',
}


export default function getTitle<T>(title: T, number?: number) {

  if (typeof title === "undefined") {
    return '';
  }

  if (number) {
    const key = numberOfName[number];
    if (key && title) {
      const val = title[key as keyof typeof title];
      if (val) {
        return val;
      }
    }
  }

  for (const titleKey in title) {
    const value = title[titleKey];
    if (value && titleKey !== '__typename') {
      return value
    }
  }

  return '-'
}