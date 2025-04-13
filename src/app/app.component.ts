import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';

import { b1 } from './data/disco_b1';
import { CUT } from './data/model';
import { b2 } from './data/disco_b2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'gigamix';
  block1: CUT[] = [];
  block2: CUT[] = [];
  block3: CUT[] = [];

  blocks: CUT[][] = [];

  selected: number = 0;
  constructor(private cdr: ChangeDetectorRef) {}

  get block(): CUT[] {
    return this.blocks[this.selected];
  }

  ngAfterViewInit(): void {
    this.block1 = this.createBlock(b1);
    this.block2 = this.createBlock(b2);
    this.block3 = this.createBlock(b2);
    this.blocks = [this.block1, this.block2, this.block3];
    this.cdr.detectChanges();
  }

  select(b: number): void {
    this.selected = b;
    console.log(b);
  }

  c(cut: CUT): string {
    return cut.up ? '<' : '>';
  }

  private createBlock(cuts: CUT[]): CUT[] {
    const result: CUT[] = [];
    cuts.forEach((c, i) => {
      if (i !== cuts.length - 1) {
        let start: string = c.T;
        if (start.length === 7) start = `0${start}`;
        let end: string = cuts[i + 1].T;
        if (end.length === 7) end = `0${end}`;
        const trans: boolean = !c.song;
        const bpm = { start: c.tempo || 0, end: c.tempo || 0 };
        if (trans && !c.tempo) {
          bpm.start = cuts[i - 1].tempo || 0;
          bpm.end = cuts[i + 1].tempo || 0;
        }
        const change: boolean = bpm.start !== bpm.end;
        const up: boolean = bpm.start < bpm.end;

        const d: { d: number; du: string } = this.calculeDur(start, end);
        const cut: CUT = {
          ...c,
          start,
          end,
          bpm,
          change,
          up,
          dur: d.d,
          duration: d.du,
        };
        result.push(cut);
      }
    });
    this.calculatePerc(result);
    return result;
  }

  private calculatePerc(b: CUT[]): void {
    const max: number = Math.max(...b.map((b) => b.dur || 0));
    b.forEach((b) => {
      const perc: number = (100 / max) * (b.dur || 0);
      b.perc = perc;
    });
  }

  private calculeDur(s: string, e: string): { d: number; du: string } {
    const start: number = this.calculeTime(s);
    const end: number = this.calculeTime(e);
    const d: number = end - start;
    const du: string = this.calcInter(d);
    return { d, du };
  }

  private calcInter(d: number): string {
    const mins: number = Math.floor(d / 60);
    const secs: number = d % 60;
    const _m: string = mins.toString().padStart(2, '0');
    const _d: string = secs.toString().padStart(2, '0');
    return `${_m}:${_d}`;
  }

  private calculeTime(v: string): number {
    const min: number = parseInt(v.split(':')[0]);
    const sec: number = parseInt(v.split(':')[1]);
    const t: number = min * 60 + sec;
    return t;
  }
}
