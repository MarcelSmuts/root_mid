import { FlatFileFieldType, padFlatFileField } from "src/utils/flat-file-formatter"

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

export interface FlatFileRecord {
    RecordType: FlatFileField<MIDRecordType>
    validate(): void
    toString(): string
}

export interface MIDHeaderRecord extends FlatFileRecord {
    readonly RecordType: FlatFileField<MIDRecordType>
    SupplierId: FlatFileField<string>
    FileSequenceNumber: FlatFileField<number> // TODO - Maintain file sequence number and increment for each file. Reset to 0 when files are sent.
    Date: FlatFileField<number>
}

export class FlatFileField<T> {
    key: string
    value: T
    type: FlatFileFieldType
    length: number
    startingPosition: number

    constructor(key: string, value: T, type: FlatFileFieldType, length: number, startingPosition: number) {
        this.key = key
        this.value = value
        this.type = type
        this.length = length
        this.startingPosition = startingPosition
    }

    toString(): string {
        return padFlatFileField(String(this.value), this.type, this.length)
    }
}

export class MIDHeaderRecord implements MIDHeaderRecord {
    readonly RecordType = new FlatFileField('RecordType', MIDRecordType.Header, FlatFileFieldType.Numeric, 1, 1)

    constructor(record: {supplierId: string, fileSequenceNumber: number, date: number}) {
        this.SupplierId = new FlatFileField('SupplierId', record.supplierId, FlatFileFieldType.AlphaNumeric, 3, 2)
        this.FileSequenceNumber = new FlatFileField('FileSequenceNumber', record.fileSequenceNumber, FlatFileFieldType.Numeric, 6, 5)
        this.Date = new FlatFileField('Date', record.date, FlatFileFieldType.Numeric, 8, 11)
    }

    validate(): void {
        // TODO
    }

    format(): string {
        return `${this.RecordType.toString()}${this.SupplierId.toString()}${this.FileSequenceNumber.toString()}${this.Date.toString()}`
    }
}

export interface MIDInstructionRecord extends FlatFileRecord {
    readonly RecordType: FlatFileField<MIDRecordType>
    UpdateType: FlatFileField<InstructionUpdateType>
    PolicyNumber: FlatFileField<string>
    PolicyControlCount: FlatFileField<number>
    StartDate: FlatFileField<number>
    ExpiryDate: FlatFileField<number>
    CancellationIndicator: FlatFileField<string>
    Reference?: FlatFileField<string>
}

export class MIDInstructionRecord implements MIDInstructionRecord {
    readonly RecordType = new FlatFileField('RecordType', MIDRecordType.Instruction, FlatFileFieldType.Numeric, 1, 1)

    constructor(record: {updateType: InstructionUpdateType, policyNumber: string, policyControlCount: number, startDate: number, expiryDate: number, cancellationIndicator: string, reference?: string}) {
        this.UpdateType = new FlatFileField('UpdateType', record.updateType, FlatFileFieldType.AlphaNumeric, 1, 2)
        this.PolicyNumber = new FlatFileField('PolicyNumber', record.policyNumber, FlatFileFieldType.AlphaNumeric, 20, 3)
        this.PolicyControlCount = new FlatFileField('PolicyControlCount', record.policyControlCount, FlatFileFieldType.Numeric, 4, 23)
        this.StartDate = new FlatFileField('StartDate', record.startDate, FlatFileFieldType.Numeric, 8, 31)
        this.ExpiryDate = new FlatFileField('ExpiryDate', record.expiryDate, FlatFileFieldType.Numeric, 8, 39)
        this.CancellationIndicator = new FlatFileField('CancellationIndicator', record.cancellationIndicator, FlatFileFieldType.AlphaNumeric, 1, 40)
        this.Reference = new FlatFileField('Reference', record.reference, FlatFileFieldType.AlphaNumeric, 35, 41)
    }

    validate(): void {
        // TODO
    }

    format(): string {
        return `${this.RecordType.toString()}${this.UpdateType.toString()}${this.PolicyNumber.toString()}${this.PolicyControlCount.toString()}${this.StartDate.toString()}${this.ExpiryDate.toString()}${this.CancellationIndicator.toString()}${this.Reference?.toString()}`
    }
}

export interface MIDTrailerRecord extends FlatFileRecord {
    readonly RecordType: FlatFileField<MIDRecordType>
    FileSequenceNumber: FlatFileField<number>
    RecordCount: FlatFileField<number>
}

export class MIDTrailerRecord implements MIDTrailerRecord {
    readonly RecordType = new FlatFileField('RecordType', MIDRecordType.Trailer, FlatFileFieldType.Numeric, 1, 1)

    constructor(record: {fileSequenceNumber: number, recordCount: number}) {
        this.FileSequenceNumber = new FlatFileField('FileSequenceNumber', record.fileSequenceNumber, FlatFileFieldType.Numeric, 6, 2)
        this.RecordCount = new FlatFileField('RecordCount', record.recordCount, FlatFileFieldType.Numeric, 9, 8)
    }

    validate(): void {
        // TODO
    }

    format(): string {
        return `${this.RecordType.toString()}${this.FileSequenceNumber.toString()}${this.RecordCount.toString()}`
    }
}