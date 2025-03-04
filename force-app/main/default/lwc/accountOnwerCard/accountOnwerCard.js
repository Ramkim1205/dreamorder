import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OWNER_FIELD from '@salesforce/schema/Account.OwnerId';
import USER_NAME_FIELD from '@salesforce/schema/User.Name';
import USER_TITLE_FIELD from '@salesforce/schema/User.Title';
import USER_EMAIL_FIELD from '@salesforce/schema/User.Email';
import USER_PHOTO_FIELD from '@salesforce/schema/User.SmallPhotoUrl';
import getMentionText from '@salesforce/apex/ChatterController.getMentionText'; // Apex 호출

export default class AccountOwnerCard extends LightningElement {
    @api recordId;
    ownerId;
    ownerName;
    ownerTitle;
    ownerEmail;
    ownerPhotoUrl;
    error;
    mentionText='';

    //Account에서 OwnerId 가져오기
    @wire(getRecord, { recordId: '$recordId', fields: [ACCOUNT_OWNER_FIELD] })
    wiredAccount({ error, data }) {
        if (data) {
            this.ownerId = data.fields.OwnerId?.value;
        } else if (error) {
            this.error = `Error fetching Account OwnerId: ${JSON.stringify(error)}`;
        }
    }

    //Owner 정보 가져오기
    @wire(getRecord, { recordId: '$ownerId', fields: [USER_NAME_FIELD, USER_TITLE_FIELD, USER_EMAIL_FIELD, USER_PHOTO_FIELD] })
    wiredOwner({ error, data }) {
        if (data) {
            this.ownerName = data.fields.Name.value;
            this.ownerTitle = data.fields.Title?.value || 'No Title';
            this.ownerEmail = data.fields.Email.value;
            this.ownerPhotoUrl = data.fields.SmallPhotoUrl.value;
        } else if (error) {
            this.error = `Error fetching Owner details: ${JSON.stringify(error)}`;
        }
    }

    // ✅ Apex 호출하여 @mention 텍스트 가져오기
    @wire(getMentionText, { ownerId: '$ownerId', ownerName: '$ownerName' })
    wiredMentionText({ error, data }) {
        if (data) {
            this.mentionText = data;
            console.log('### Mention Text 로드 성공:', this.mentionText);
        } else if (error) {
            console.error('### Mention Text 로드 실패:', error);
        }
    }
 
    handleChatClick() {
        console.log('### Chat 버튼 클릭됨');
    
        let attempts = 0;
        const maxAttempts = 10; // 최대 10번 시도 (5초)
    
        const interval = setInterval(() => {
            // ✅ 단 하나의 querySelector로 상위 → 하위 요소까지 한 번에 탐색
            let feedTab = document.querySelector(
                "flexipage-tabset lightning-tab-bar li[data-label='Feed'], " +  // 🔥 표준 구조
                "flexipage-tabset lightning-tab-bar a[data-label='Feed'], " +   // 🔥 <a> 태그 지원
                "li[data-label='Feed'], " +                                     // 🔥 일반적인 구조
                "a[data-label='Feed']"                                          // 🔥 최후의 수단
            );
    
            // ✅ iframe 내부 탐색 (Feed 탭이 iframe 안에 있을 경우)
            if (!feedTab) {
                let iframe = document.querySelector('iframe');
                if (iframe && iframe.contentDocument) {
                    feedTab = iframe.contentDocument.querySelector(
                        "flexipage-tabset lightning-tab-bar li[data-label='Feed'], " + 
                        "flexipage-tabset lightning-tab-bar a[data-label='Feed'], " +   
                        "li[data-label='Feed'], " +                                     
                        "a[data-label='Feed']"
                    );
                }
            }
    
            if (feedTab) {
                console.log("### Feed 탭 발견 → 클릭 실행:", feedTab);
                feedTab.click();
                clearInterval(interval);
            } else {
                console.warn(`### Feed 탭을 찾는 중... (${attempts + 1}/${maxAttempts})`);
                attempts++;
            }
    
            if (attempts >= maxAttempts) {
                console.error("### ERROR: Feed 탭을 찾을 수 없음 (5초 경과)");
                clearInterval(interval);
            }
        }, 500);
    }
    
    
    

    //Email 버튼 클릭 이벤트
    handleEmailClick() {
        if (this.ownerEmail) {
            window.location.href = `mailto:${this.ownerEmail}`;
        } else {
            this.error = 'No email available.';
        }
    }
}
