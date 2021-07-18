import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from './api/api.service'

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: any;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [ApiService],
    }).compileComponents();

    apiService = TestBed.inject(ApiService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'getTopStories').and.callThrough();
    spyOn(apiService, 'getTopStories').and.callThrough();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call `getTopStories` method on ngOnInit ', () => {
    component.ngOnInit();
    expect(component.getTopStories).toHaveBeenCalled();
  });

  it('should call `getTopStories and match result` method of apiService on getTopStories ', () => {
    component.getTopStories();
    expect(apiService.getTopStories).toHaveBeenCalled();
    expect(component.stories.length).toEqual(0);
  });

  it('should stories length is 5', () => {
    setTimeout(() => {
      expect(component.stories.length).toEqual(5);
    }, 3000)
  });
});
