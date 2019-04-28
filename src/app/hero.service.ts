import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService} from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { type } from 'os';
import { templateRefExtractor } from '@angular/core/src/render3';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // Web APIのURL
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getHeroes(): Observable<Hero[]>　{
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('HeroService: fetched heroes'))
      , catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`HeroService: fetched hero id=${id}`))
      , catchError(this.handleError<Hero>(`id=${id}`))
    );
  }

  /** GET: ヒーローを検索する
   * 検索語なし＝空の配列を返す
   * */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`))
      , catchError(this.handleError<Hero[]>(`search heroes matching "$term"`))
    );
  }

  /** POST: サーバーのヒーローを更新する */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`))
      , catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: サーバーに新しいヒーローを登録する */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post(this.heroesUrl, hero, httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`))
      , catchError(this.handleError<any>('addHero'))
    );
  }

  /** DELETE: サーバーからヒーローを削除 */
  deleteHero(hero: Hero): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url,httpOptions).pipe(
      tap(_ => this.log(`${url}`))
      , catchError(this.handleError<Hero>(''))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
  *
  * 失敗したHttp操作を処理します。
  * アプリを持続させます。
  * @param operation - 失敗した操作の名前
  * @param result - observableな結果として返す任意の値
  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error); // 今回はConsole出力でお茶を濁す

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善するらしい
      this.log(`${operation} failed: ${error.message}`);

      // 持続させるためにオブジェクトをリターンする エラー握りつぶしているイメージ？
      return of(result as T);
    };
  }

}
