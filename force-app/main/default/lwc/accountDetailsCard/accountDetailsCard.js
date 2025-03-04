import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ADDRESS_FIELD from '@salesforce/schema/Account.Address_c__c';
import OWNER_FIELD from '@salesforce/schema/Account.OwnerId';
import USER_NAME_FIELD from '@salesforce/schema/User.Name';
import USER_PHOTO_FIELD from '@salesforce/schema/User.SmallPhotoUrl';
import CASE_ACCOUNT_FIELD from '@salesforce/schema/Case.AccountId';

export default class AccountDetailsCard extends LightningElement {
    @api recordId; // Case의 ID를 받음
    accountId;
    accountName;
    accountAddress;
    ownerId;
    ownerName;
    ownerPhotoUrl;
    error;

    //Case에서 AccountId 가져오기
    @wire(getRecord, { recordId: '$recordId', fields: [CASE_ACCOUNT_FIELD] })
    wiredCase({ error, data }) {
        if (data) {
            this.accountId = data.fields.AccountId?.value;
        } else if (error) {
            this.error = `Error fetching Case AccountId: ${JSON.stringify(error)}`;
        }
    }

    //Account 정보 가져오기 (Case에서 가져온 AccountId 사용)
    @wire(getRecord, { recordId: '$accountId', fields: [ACCOUNT_NAME_FIELD, ADDRESS_FIELD, OWNER_FIELD] })
    wiredAccount({ error, data }) {
        if (data) {
            this.accountName = data.fields.Name.value;
            this.accountAddress = data.fields.Address_c__c?.value || 'No Address';
            this.ownerId = data.fields.OwnerId?.value;
        } else if (error) {
            this.error = `Error fetching Account details: ${JSON.stringify(error)}`;
        }
    }

    //Owner 정보 가져오기
    @wire(getRecord, { recordId: '$ownerId', fields: [USER_NAME_FIELD, USER_PHOTO_FIELD] })
    wiredOwner({ error, data }) {
        if (data) {
            this.ownerName = data.fields.Name.value;
            this.ownerPhotoUrl = data.fields.SmallPhotoUrl.value;
        } else if (error) {
            this.error = `Error fetching Owner Name: ${JSON.stringify(error)}`;
        }
    }
}
