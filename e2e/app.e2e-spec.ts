import { AmplitudeAppPage } from './app.po';

describe('amplitude-app App', () => {
  let page: AmplitudeAppPage;

  beforeEach(() => {
    page = new AmplitudeAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
