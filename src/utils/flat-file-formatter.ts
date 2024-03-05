export enum FlatFileFieldType {
    AlphaNumeric = 'AlphaNumeric',
    Numeric = 'Numeric'
}

export function padFlatFileField(field: string, type: FlatFileFieldType, length: number): string {

    if (!field || field === 'undefined') {
        field = ''
    }

    let padChar = ' ';

    if (type === FlatFileFieldType.Numeric) {
        padChar = '0';
    }

    return field.padStart(length).substring(0, length);
}