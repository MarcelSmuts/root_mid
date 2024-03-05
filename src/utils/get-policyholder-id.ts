import { RootEventPayload, RootEventType } from "src/models/root-event-payload";

export default function getPolicyHolderId(rootEventPayload: RootEventPayload): string {

    switch(rootEventPayload?.event?.type) {
        case RootEventType.PolicyIssued:
        case RootEventType.PolicyUpdated:
        case RootEventType.PolicyCancelled:
        case RootEventType.PolicyExpired:
            return rootEventPayload?.policy?.policyholder_id
        case RootEventType.PolicyholderUpdated:
            return rootEventPayload?.policyholder?.policyholder_id
    }
}