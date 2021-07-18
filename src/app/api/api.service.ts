import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected http: HttpClient
  protected apiUrl = `https://hacker-news.firebaseio.com/v0/`

  constructor(
    httpClient: HttpClient,
  ) {
    this.http = httpClient
  }

  async getTopStories(uri: string) {
    return await this.doAPI(async () => {
      const url = `${this.apiUrl}/${uri}`
      const resp = await this.http
        .get(url)
        .toPromise()
      return resp;
    })
  }

  async getHackerElement(id: string) {
    return await this.doAPI(async () => {
      const url = `${this.apiUrl}/item/${id}.json?print=pretty`
      const resp = await this.http
        .get(url)
        .toPromise()
      return resp;
    })
  }

  protected async doAPI(fn: any, message = '') {
    try {
      return await fn()
    } catch (error) {
      if (error.status === 200 || error.status === 204 || error.status === '200') {
        return;
      } else {
        return this.handleError(error)
      }
    } finally {
    }
  }

  private handleError(error: any) {
    let errorMessage: any
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    } else {
      if (error) {
        if (error.error) {
          const e = error.error
          if (e.message !== undefined && e.message !== null) {
            errorMessage = e.message
          } else if (e.full_messages && Array.isArray(e.full_messages)) {
            errorMessage = e.full_messages.join('<br>');
          } else if (typeof e === 'object') {
            errorMessage = 'Common.Toast.network_lost';
          } else {
            errorMessage = e.join('/n')
          }
        }
      }
    }
    console.log(">>>>>>>>>>error:", errorMessage);
    return {
      error: errorMessage,
    }
  }
}
