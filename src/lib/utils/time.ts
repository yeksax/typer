const months = [
  "jan.",
  "fev.",
  "mar.",
  "abr.",
  "mai.",
  "jun.",
  "jul.",
  "ago.",
  "set.",
  "out.",
  "nov.",
  "dez.",
];

export class Time {
  public default: string;
  public long: string;
  public full: string;
  public elapsed: string;

  public year: number;
  public month: number;
  public day: number;
  public hour: number;
  public minute: number;
  public second: number;

  public elapsedWeeks: number;
  public elapsedDays: number;
  public elapsedHours: number;
  public elapsedMinutes: number;
  public elapsedSeconds: number;

  constructor(date: Date | string | number) {
    const now = new Date().getTime();
    const d = new Date(date);
    const elapsedTime = now - d.getTime();

    this.year = d.getFullYear();
    this.month = d.getMonth();
    this.day = d.getDate();
    this.hour = d.getHours();
    this.minute = d.getMinutes();
    this.second = d.getSeconds();

    this.elapsedWeeks = Math.floor(elapsedTime / (1000 * 60 * 60 * 24 * 7));
    this.elapsedDays = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    this.elapsedHours = Math.floor(elapsedTime / (1000 * 60 * 60));
    this.elapsedMinutes = Math.floor(elapsedTime / (1000 * 60));
    this.elapsedSeconds = Math.floor(elapsedTime / 1000);

    this.default = `${this.day} de ${months[this.month]}`;
    this.long = `${this.day} de ${months[this.month]} de ${this.year}`;
    this.full = `${this.day} de ${months[this.month]} de ${this.year}, às ${
      this.hour
    }:${this.minute}`;

    if (this.elapsedWeeks > 0) {
      this.elapsed = `${this.elapsedWeeks}w`;
    } else if (this.elapsedDays > 0) {
      this.elapsed = `${this.elapsedDays}d`;
    } else if (this.elapsedHours > 0) {
      this.elapsed = `${this.elapsedHours}h`;
    } else if (this.elapsedMinutes > 0) {
      this.elapsed = `${this.elapsedMinutes}min`;
    } else {
      this.elapsed = `${this.elapsedSeconds}s`;
    }
  }
}
