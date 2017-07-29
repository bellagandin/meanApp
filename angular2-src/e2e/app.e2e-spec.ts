import { Angular2SrcPage } from './app.po';

describe('angular2-src App', function() {
  let page: Angular2SrcPage;

  beforeEach(() => {
    page = new Angular2SrcPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
