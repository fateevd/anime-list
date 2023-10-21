interface IDate {
  currentSeason: Season;
  currentYear: number;
}

type Season = 'Winter' |
  'Spring' |
  'Summer' |
  'Fall';

const seasons: Season[] = [
  'Winter',
  'Spring',
  'Summer',
  'Fall',
];

class DateInfo implements IDate {
  public season: number;
  public year: number;
  public month: number;

  constructor() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    this.season = Math.floor((currentMonth % 12) / 3);
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth();
  }

  get currentSeason(): Season {
    return seasons[this.season];
  }

  get infoDate() {
    const nextSeason = (this.season + 1) % 4
    return {
      seasonYear: this.year,
      season: this.currentSeason,
    }
  }

  nextYear(offset = 1) {
    return this.year + offset;
  }

  prevYear(offset = 1) {
    return this.year - offset;
  }


}

export const {nextYear, prevYear, infoDate, currentSeason} = new DateInfo()