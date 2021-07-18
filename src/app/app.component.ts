import { Component } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import * as moment from 'moment';
import { forkJoin } from 'rxjs'
import { ApiService } from './api/api.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AppComponent {
  title = 'HackerTest';
  columnsToDisplay = ['title', 'score', 'time', 'by', 'view'];
  expandedElement: HackerElement | null = null;
  stories: HackerElement[] = []
  comments: any = {}

  constructor(
    private apiService: ApiService,    
  ) {
  }

  ngOnInit() {
    this.getTopStories();
  }

  async getTopStories() {
    let topStories = await this.apiService.getTopStories(`topstories.json?print=pretty`);
    if (topStories.length > 5) {
      topStories = topStories.slice(0, 5)
    }
    
    const suggestionRequests: any = [];

    topStories.forEach((story_id: string) => {
      suggestionRequests.push(this.apiService.getHackerElement(story_id));
    });

    forkJoin(suggestionRequests)
      .subscribe((resArray: any) => {
        this.stories = resArray.map((item: HackerElement) => ({
          ...item,
          timestamp: item.time,
          time: moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')
        }));
        this.stories.forEach((story: HackerElement) => {
          let kids = story.kids ?? [];
          if (kids.length === 0) {
            this.comments[story.id] = []
            return
          }

          if (kids.length > 3) {
            kids = kids.slice(0, 3)
          }

          const commentsRequests: any = [];
          kids.forEach((comment_id: string) => {
            commentsRequests.push(this.apiService.getHackerElement(comment_id));
          });

          forkJoin(commentsRequests)
            .subscribe((commentsArray: any) => {
              this.comments[story.id] = commentsArray.map((item: HackerElement) => ({
                ...item,
                timestamp: item.time,
                time: moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')
              }));
            })
        })
      });
  }
}

export interface HackerElement {
  id: string;
  by: string;
  descendants?: number,
  kids?: any[];
  score?: number;
  time: number;
  title?: string;
  type: string;
  url?: string
  text?: string
}
