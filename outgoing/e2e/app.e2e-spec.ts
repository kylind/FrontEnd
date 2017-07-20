import { OutgoingPage } from './app.po';

describe('outgoing App', () => {
  let page: OutgoingPage;

  beforeEach(() => {
    page = new OutgoingPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
