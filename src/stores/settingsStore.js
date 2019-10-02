import { observable, action, computed } from 'mobx';
import agent from '../agent';
import userStore from './userStore';

export class SettingsStore {

    @observable isLoading = false;
    @observable settings = {
        id: 0,
        token: '',
        senderCity: '',
        senderCityName: '',
        senderWarehouse: '',
        senderWarehouseName: '',
        smsServiceLogin: '',
        smsServicePassword: '',
    };

    @action loadSettings() {
        this.isLoading = true;
        agent.Settings.getByUserId(userStore.currentUser.id)
            .then(action((settings) => {
                this.settings = settings;
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action saveSettings()
    {
        this.isLoading = true;
        agent.Settings.saveByUserId(userStore.currentUser.id, this.settings)
            .then(action((settings) => {
                this.settings = settings;
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action setSettingsProperty(name, value)
    {
        this.settings[name] = value;
    }
}

export default new SettingsStore();
