public with sharing class ChatterController {
    @AuraEnabled(cacheable=true)
    public static String getMentionText(Id ownerId, String ownerName) {
        try {
            System.debug('### Mention Text 생성 시작');
            
            if (ownerId == null || ownerName == null) {
                throw new AuraHandledException('Invalid Owner ID or Name');
            }

            // ✅ @mention을 포함한 텍스트 생성
            String mentionText = '@[' + ownerName + '](' + ownerId + ') Can you check this case?';
            
            System.debug('### Mention Text: ' + mentionText);
            return mentionText;

        } catch (Exception e) {
            System.debug('### ERROR generating mention text: ' + e.getMessage());
            throw new AuraHandledException('Failed to generate mention text: ' + e.getMessage());
        }
    }
}

