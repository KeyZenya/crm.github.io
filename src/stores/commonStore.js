import { observable, action, reaction } from 'mobx';
import agent from '../agent';

class CommonStore {

  @observable appName = 'Conduit';
  @observable token = window.localStorage.getItem('jwt');
  @observable npApiKey = window.localStorage.getItem('npApiKey');
  @observable npApiKeyId = window.localStorage.getItem('npApiKeyId');
  @observable autoLogin = window.localStorage.getItem('autoLogin');
  @observable appLoaded = false;

  @observable tags = [];
  @observable isLoadingTags = false;

  constructor() {
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      },

    );
      reaction(
          () => this.npApiKey,
          npApiKey => {
              if (npApiKey) {
                  window.localStorage.setItem('npApiKey', npApiKey);
              } else {
                  window.localStorage.removeItem('npApiKey');
              }
          },

      );
      reaction(
          () => this.npApiKeyId,
          npApiKeyId => {
              if (npApiKeyId) {
                  window.localStorage.setItem('npApiKeyId', npApiKeyId);
              } else {
                  window.localStorage.removeItem('npApiKeyId');
              }
          },

      );
  }

  @action setNpApiKey(npApiKey)
  {
      this.npApiKey = npApiKey;
  }

    @action setNpApiKeyId(npApiKeyId)
    {
        this.npApiKeyId = npApiKeyId;
    }

  @action loadTags() {
    this.isLoadingTags = true;
    return agent.Tags.getAll()
      .then(action(({ tags }) => { this.tags = tags.map(t => t.toLowerCase()); }))
      .finally(action(() => { this.isLoadingTags = false; }))
  }

  @action setToken(token) {
    this.token = token;
  }

  @action setAutoLogin(autoLogin) {
      this.autoLogin = autoLogin;
      window.localStorage.setItem('autoLogin', this.autoLogin);
  }

  @action setAppLoaded() {
    this.appLoaded = true;
  }

}

export default new CommonStore();
