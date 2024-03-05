import { FlatFileFieldType, padFlatFileField } from "src/utils/flat-file-formatter"
import { RootEventPayload, RootEventType } from "./root-event-payload"
import getInstructionUpdateType from "src/utils/root-instruction-update-type"
import { RootPlatformService } from "src/root-platform-api/root-platform.service"

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
    format(): string
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

    format(): string {
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
        return `${this.RecordType.format()}${this.SupplierId.format()}${this.FileSequenceNumber.format()}${this.Date.format()}`
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
    PolicyHolderName?: FlatFileField<string>
}

export class MIDInstructionRecord implements MIDInstructionRecord {
    readonly RecordType = new FlatFileField('RecordType', MIDRecordType.Instruction, FlatFileFieldType.Numeric, 1, 1)

    constructor(record: {updateType: InstructionUpdateType, policyNumber: string, policyControlCount: number, startDate: number, expiryDate: number, cancellationIndicator: string, reference?: string, policyHolderName: string}) {
        this.UpdateType = new FlatFileField('UpdateType', record.updateType, FlatFileFieldType.AlphaNumeric, 1, 2)
        this.PolicyNumber = new FlatFileField('PolicyNumber', record.policyNumber, FlatFileFieldType.AlphaNumeric, 20, 3)
        this.PolicyControlCount = new FlatFileField('PolicyControlCount', record.policyControlCount, FlatFileFieldType.Numeric, 4, 23)
        this.StartDate = new FlatFileField('StartDate', record.startDate, FlatFileFieldType.Numeric, 8, 31)
        this.ExpiryDate = new FlatFileField('ExpiryDate', record.expiryDate, FlatFileFieldType.Numeric, 8, 39)
        this.CancellationIndicator = new FlatFileField('CancellationIndicator', record.cancellationIndicator, FlatFileFieldType.AlphaNumeric, 1, 40)
        this.Reference = new FlatFileField('Reference', record.reference, FlatFileFieldType.AlphaNumeric, 35, 61)
        this.PolicyHolderName = new FlatFileField('PolicyHolderName', record.policyHolderName, FlatFileFieldType.AlphaNumeric, 20, 41)
    }

    static async fromRootEventPayload(rootEventPayload: RootEventPayload, rootPlatformService: RootPlatformService) {
        const policyHolder = await rootPlatformService.getPolicyHolder(rootEventPayload)

        if (!policyHolder) {
            throw new Error('No Policyholder data')
        }

        return new MIDInstructionRecord({
            cancellationIndicator: rootEventPayload.event?.type === RootEventType.PolicyCancelled ? '1' : '0',
            expiryDate: rootEventPayload.event?.end_date,
            policyControlCount: 1, // TODO: not sure what this is.
            policyNumber: rootEventPayload.event?.policy_number,
            startDate: rootEventPayload.event?.start_date,
            updateType: getInstructionUpdateType(rootEventPayload.event?.type),
            policyHolderName: `${policyHolder.first_name} ${policyHolder.last_name}`
        }) 
    }

    validate(): void {
        // TODO
    }

    format(): string {
        return `${this.RecordType.format()}${this.UpdateType.format()}${this.PolicyNumber.format()}${this.PolicyControlCount.format()}${this.StartDate.format()}${this.ExpiryDate.format()}${this.CancellationIndicator.format()}${this.PolicyHolderName?.format()}${this.Reference?.format()}`
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
        return `${this.RecordType.format()}${this.FileSequenceNumber.format()}${this.RecordCount.format()}`
    }
}
