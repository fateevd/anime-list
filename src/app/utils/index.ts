import {MediaType} from "@/generated/graphql";

interface IDate {
  season: Season;
  year: number;
}

type Season = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
const seasons: Season[] = [
  'WINTER',
  'SPRING',
  'SUMMER',
  'FALL',
];

export class DateInfo implements IDate {
  public season: Season;
  public year: number;

  constructor() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    this.season = seasons[Math.floor((currentMonth % 12) / 3)];
    this.year = currentDate.getFullYear();
  }

  formatStartZero(date: number[]): string {
    const result = [];
    for (const number of date) {
      if (number === null) {
        break;
      }

      if (number < 10) {
        result.push(`0${number}`);
        continue;
      }

      result.push(number);
    }

    if (result.length === 0) {
      return 'еще выходит';
    }

    return result.join('.');
  }

  get date() {
    return {
      year: this.year,
      season: this.season,
    }
  }
}


class Variables {
  public result: unknown;

  constructor(id?: number, type?: MediaType, needDate?: boolean) {
    const {date} = new DateInfo();
    this.result = this.findVariables(id, type, date, needDate);
  }

  //TODO: переделать как время будет
  findVariables(id?: number, type?: MediaType, date?: IDate, needDate?: boolean) {

    if (needDate) {

      if (id) {
        return {
          type: !type ? "ANIME" : type,
          id,
          ...date,
        }
      }

      return {
        type: !type ? "ANIME" : type,
        ...date
      }
    }

    if (!id && type === "MANGA") {
      return {
        type,
      }
    }

    return {
      id,
      type,
    }


  };


  get listVariables() {
    return this.result;
  }

}

export default Variables;
