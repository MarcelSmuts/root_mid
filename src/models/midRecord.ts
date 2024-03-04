export enum MIDRecordType {
    Header = 1,
    Instruction = 2,
    Trailer = 3
}

export enum InstructionUpdateType {
    InitialCreate = 'I',
    Update = 'U',
    Cancel = 'C',
    Delete = 'D'
}

export interface MIDHeaderRecord {
    readonly RecordType: MIDRecordType.Header
    SupplierId: string
    FileSequenceNumber: number
    Date: number
}

export class MIDHeaderRecord implements MIDHeaderRecord {
    constructor(record: {supplierId: string, fileSequenceNumber: number, date: number}) {
        this.SupplierId = record.supplierId
        this.FileSequenceNumber = record.fileSequenceNumber
        this.Date = record.date
    }

    toCSV(): string {
        return `${this.RecordType},${this.SupplierId},${this.FileSequenceNumber},${this.Date}`
    }
}

export interface MIDInstructionRecord {
    readonly RecordType: MIDRecordType.Instruction
    UpdateType: InstructionUpdateType
    PolicyNumber: string
    PolicyControlCount: number
    StartDate: number
    ExpiryDate: number
    CancellationIndicator: string
    Reference?: string
}

export class MIDInstructionRecord implements MIDInstructionRecord {
    readonly RecordType: MIDRecordType.Instruction
    UpdateType: InstructionUpdateType
    PolicyNumber: string
    PolicyControlCount: number
    StartDate: number
    ExpiryDate: number
    CancellationIndicator: string
    Reference?: string

    toCSV(): string {
        return `${this.RecordType},${this.UpdateType},${this.PolicyNumber},${this.PolicyControlCount},${this.StartDate},${this.ExpiryDate},${this.CancellationIndicator},${this.Reference}`
    }
}