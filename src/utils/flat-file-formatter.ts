export enum FlatFileFieldType {
    AlphaNumeric = 'AlphaNumeric',
    Numeric = 'Numeric'
}

export function padFlatFileField(field: string, type: FlatFileFieldType, length: number): string {
    let padChar = ' ';

    if (type === FlatFileFieldType.Numeric) {
        padChar = '0';
    }

    return field.padStart(length);
}