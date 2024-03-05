export interface RootEventPayload {
    webhook_id:	string
    event?: any
    policyholder?: any
    verification_token?: string
    environment: string
  }

  export enum RootEventType {
    PolicyIssued = 'policy_issued',
    PolicyUpdated = 'policy_updated',
    PolicyCancelled = 'policy_cancelled',
    PolicyholderUpdated = 'policyholder_updated',
    PolicyExpired = 'policy_expired'
  }