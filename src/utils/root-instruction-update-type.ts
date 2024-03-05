import { InstructionUpdateType } from "src/models/mid-record"
import { RootEventType } from "src/models/root-event-payload"

export default function getInstructionUpdateType(eventType) {
    switch (eventType) {
        case RootEventType.PolicyIssued:
            return InstructionUpdateType.InitialCreate
        case RootEventType.PolicyUpdated:
        case RootEventType.PolicyholderUpdated:
            return InstructionUpdateType.Update
        case RootEventType.PolicyCancelled:
        case RootEventType.PolicyExpired:
            return InstructionUpdateType.Delete
        default:
            throw new Error(`Unknown event type: ${eventType}`)
    }
}