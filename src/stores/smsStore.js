import { observable, action, computed } from 'mobx';
import agent from '../agent';
import ttnsStore from './ttnsStore'
import settingsStore from "./settingsStore";

export class SmsStore {

    @observable isLoading = false;
    @observable smsRegistry = observable.map();
    @observable smsTemplatesRegistry = observable.map();
    @observable sendSms = {
        text: '',
    };
    @observable smsTemplate = {
        id: 0,
        name: '',
        text: ''
    };

    @computed get sms() {
        return this.smsRegistry.values();
    };

    @computed get smsTemplates() {
        return this.smsTemplatesRegistry.values();
    };

    @action loadSms() {
        this.isLoading = true;
        agent.Sms.all()
            .then(action((sms) => {
                this.smsRegistry.clear();
                sms.forEach(single => this.smsRegistry.set(single.id, single));
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action loadSmsTemplates() {
        this.isLoading = true;
        agent.SmsTemplates.all()
            .then(action((smsTemplates) => {
                this.smsTemplatesRegistry.clear();
                smsTemplates.forEach(smsTemplate => this.smsTemplatesRegistry.set(smsTemplate.id, smsTemplate));
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action createSmsTemplate()
    {
        this.isLoading = true;
        agent.SmsTemplates.create(this.smsTemplate)
            .then(action((smsTemplate) => {
                this.setSmsTemplate(smsTemplate);
                this.smsTemplatesRegistry.set(this.smsTemplate.id, this.smsTemplate);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action sendSmsToPhones(data)
    {
        const login = settingsStore.settings.smsServiceLogin;
        const password = settingsStore.settings.smsServicePassword;
        let ttnNumber, sent, message, url;
        this.isLoading = true;
        data.forEach((el) => {
            ttnNumber = el.order.ttn ? ttnsStore.ttnsRegistry.get(el.order.ttn).ttnNumber : 'Немає ен';
            // ttnNumber = el.order.ttn;
            sent = el.order.sent ? el.order.sent : 'Не відправлено';
            message = eval('`' + this.sendSms.text + '`');
            url = 'https://smsc.ua/sys/send.php?login=' + login + '&psw=' + password + '&phones=' + el.phone + '&mes=' + message;
            agent.Sms.create({order: el.order.id, text: message})
                .then(action((sms) => {
                    this.smsRegistry.set(sms.id, sms);
                    agent.SMSC.send(url);
                }));
        });
        this.isLoading = false;
    }

    @action setSmsTemplate(smsTemplate)
    {
        this.smsTemplate = smsTemplate;
    }

    @action setSmsTemplateId(id)
    {
        this.smsTemplate.id = id;
    }

    @action setSmsTemplateName(name)
    {
        this.smsTemplate.name = name;
    }

    @action setSmsTemplateText(text)
    {
        this.smsTemplate.text = text;
    }

    @action addTtnToSmsTemplate()
    {
        this.smsTemplate.text += '${ttn}'
    }

    @action addSentToSmsTemplate()
    {
        this.smsTemplate.text += '${sent}'
    }

    @action setSmsText(text)
    {
        this.sendSms.text = text;
    }

}

export default new SmsStore();
