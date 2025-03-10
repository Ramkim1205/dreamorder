import { LightningElement, api, wire } from 'lwc';
import getAccountDetails from '@salesforce/apex/AccountCustomerFieldsController.getAccountDetails';
import getFormattedAmount from '@salesforce/apex/AccountCustomerFieldsController.getFormattedAmount';

export default class AccountCustomerFields extends LightningElement {
    @api recordId;
    account;
    formattedAmount; // 금액을 저장할 변수
    error;

    @wire(getAccountDetails, { recordId: '$recordId' })
    wiredAccount({ error, data }) {
        if (data) {
            this.account = data;
            this.error = undefined;
            this.fetchFormattedAmount();
        } else if (error) {
            this.error = error;
            this.account = undefined;
        }
    }

    fetchFormattedAmount() {
        getFormattedAmount({ recordId: this.recordId })
            .then(result => {
                this.formattedAmount = result;
            })
            .catch(error => {
                console.error('Error fetching formatted amount:', error);
                this.formattedAmount = '₩0'; // 오류 발생 시 기본값 설정
            });
    }
}