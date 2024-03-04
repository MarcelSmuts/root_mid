export interface PolicyExpired {
  webHookId: string;
  environment: string;
  event: {
    type: string;
    created_at: string;
    metadata: {
      requestedAt: string;
      requestedBy: {
        type: string;
      }
    }
    terms_uri: string;
    policy_id: string;
    requested_by: {
      type: string;
    }
  }
}