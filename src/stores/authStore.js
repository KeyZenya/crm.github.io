import { observable, action } from 'mobx';
import agent from '../agent';
import userStore from './userStore';
import commonStore from './commonStore';

class AuthStore {
  @observable inProgress = false;
  @observable errors = undefined;

  @observable values = {
    username: '',
    email: '',
    password: ''
  };

  @action setUsername(username) {
    this.values.username = username;
  }

  @action setEmail(email) {
    this.values.email = email;
  }

  @action setPassword(password) {
    this.values.password = password;
  }

  @action reset() {
    this.values.username = '';
    this.values.email = '';
    this.values.password = '';
      this.values.autoLogin = false;
  }

  @action login() {
    this.inProgress = true;
    this.errors = undefined;
    return agent.Auth.login(this.values.email, this.values.password)
      .then(({ token }) => {
          commonStore.setToken(token);
      })
      .then(() => userStore.pullUser())
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  @action verifyToken() {
      this.inProgress = true;
      this.errors = undefined;
      return agent.Auth.verifyToken(commonStore.token)
          .then(() => userStore.pullUser())
          .catch(action((err) => {
              agent.Auth.refreshToken(commonStore.token)
                  .then(({ token }) => {
                      commonStore.setToken(token);
                  })
                  .then(() => userStore.pullUser())
                  .catch(action((err) => {
                      console.log('Refresh time ended')
                      throw err;
                  }))
          }))
          .finally(action(() => { this.inProgress = false; }));
  }

  @action register() {
    this.inProgress = true;
    this.errors = undefined;
    return agent.Auth.register(this.values.username, this.values.email, this.values.password)
      .then(({ user }) => commonStore.setToken(user.token))
      .then(() => userStore.pullUser())
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  @action logout() {
    commonStore.setToken(undefined);
    userStore.forgetUser();
    commonStore.setAutoLogin(false);
    return Promise.resolve();
  }
}

export default new AuthStore();
