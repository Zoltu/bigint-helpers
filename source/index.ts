export function uint8ArrayToSignedBigint(uint8Array: Uint8Array): bigint {
	const valueAsHexString = uint8ArrayToHexString(uint8Array)
	return hexStringToSignedBigint(valueAsHexString)
}

export function uint8ArrayToUnsignedBigint(uint8Array: Uint8Array): bigint {
	const valueAsHexString = uint8ArrayToHexString(uint8Array)
	return BigInt(`0x${valueAsHexString}`)
}

export function hexStringToSignedBigint(hexString: string): bigint {
	const normalizedHexString = validateAndNormalizeHexString(hexString)
	const numberOfBits = normalizedHexString.length * 4
	const unsignedInterpretation = BigInt(`0x${normalizedHexString}`)
	return twosComplement(unsignedInterpretation, numberOfBits)
}

export function hexStringToUnsignedBigint(hexString: string): bigint {
	const normalizedHexString = validateAndNormalizeHexString(hexString)
	return BigInt(`0x${normalizedHexString}`)
}

export function signedBigintToUint8Array(value: bigint, numberOfBits: number): Uint8Array {
	if (numberOfBits % 8) throw new Error(`Only 8-bit increments are supported when (de)serializing a bigint.`)
	if (value >= 2n**BigInt(numberOfBits - 1) || value < -(2n**BigInt(numberOfBits - 1))) throw new Error(`Cannot fit ${value} into a ${numberOfBits}-bit signed integer.`)
	const valueAsHexString = signedBigintToHexString(value, numberOfBits)
	return hexStringToUint8Array(valueAsHexString)
}

export function unsignedBigintToUint8Array(value: bigint, numberOfBits: number): Uint8Array {
	if (numberOfBits % 8) throw new Error(`Only 8-bit increments are supported when (de)serializing a bigint.`)
	if (value > 2n**BigInt(numberOfBits) || value < 0) throw new Error(`Cannot fit ${value} into a ${numberOfBits}-bit unsigned integer.`)
	const valueAsHexString = unsignedBigintToHexString(value, numberOfBits)
	return hexStringToUint8Array(valueAsHexString)
}

export function signedBigintToHexString(value: bigint, numberOfBits: number): string {
	if (numberOfBits % 8) throw new Error(`Only 8-bit increments are supported when (de)serializing a bigint.`)
	const valueToSerialize = twosComplement(value, numberOfBits)
	return unsignedBigintToHexString(valueToSerialize, numberOfBits)
}

export function unsignedBigintToHexString(value: bigint, numberOfBits: number): string {
	const byteSize = numberOfBits / 8
	const hexStringLength = byteSize * 2
	return ('0'.repeat(hexStringLength) + value.toString(16)).slice(-hexStringLength)
}

function validateAndNormalizeHexString(hex: string): string {
	const match = new RegExp(`^(?:0x)?([a-fA-F0-9]*)$`).exec(hex)
	if (match === null) throw new Error(`Expected a hex string encoded byte array with an optional '0x' prefix but received ${hex}`)
	const normalized = match[1]
	if (normalized.length % 2) throw new Error(`Hex string encoded byte array must be an even number of charcaters long.`)
	return normalized
}

function uint8ArrayToHexString(array: Uint8Array): string {
	const hexStringFromByte = (byte: number): string => ('00' + byte.toString(16)).slice(-2)
	const appendByteToString = (value: string, byte: number) => value + hexStringFromByte(byte)
	return array.reduce(appendByteToString, '')
}

function hexStringToUint8Array(hex: string): Uint8Array {
	const match = new RegExp(`^(?:0x)?([a-fA-F0-9]*)$`).exec(hex)
	if (match === null) throw new Error(`Expected a hex string encoded byte array with an optional '0x' prefix but received ${hex}`)
	const normalized = match[1]
	if (normalized.length % 2) throw new Error(`Hex string encoded byte array must be an even number of charcaters long.`)
	const byteLength = normalized.length / 2
	const bytes = new Uint8Array(byteLength)
	for (let i = 0; i < byteLength; ++i) {
		bytes[i] = (Number.parseInt(`${normalized[i*2]}${normalized[i*2+1]}`, 16))
	}
	return bytes
}

function twosComplement(value: bigint, numberOfBits: number): bigint {
	const mask = 2n**(BigInt(numberOfBits) - 1n) - 1n
	return (value & mask) - (value & ~mask)
}
