# Helper functions for ES2019 bigint primitive

A 0-dependency library that contains tools for (de)serializing native ES `bigint` values into/out of Uint8Arrays or hex strings for transport over some channel.  It encodes using big endian and twos-complement.  Supports numbers of any size that `bigint` supports, tested on nodejs up to 256-bits.

## Serialization
```typescript
unsignedBigintToUint8Array(0n, 8) // [0x00] as Uint8Array
signedBigIntToUint8Array(0n, 8) // [0x00] as Uint8Array
unsignedBigintToUint8Array(255n, 8) // [0xff] as Uint8Array
signedBigintToUint8Array(-1n, 8) // [0xff] as Uint8Array
unsignedBigintToHexString(255n, 8) // 'ff' as string
signedBigintToHexString(-1n, 8) // 'ff' as string
unsignedBigintToUint8Array(255n, 16) // [0x00, 0xff] as Uint8Array
signedBigintToUint8Array(-1n, 16) // [0xff, 0xff] as Uint8Array
unsignedBigintToHexString(255n, 16) // '00ff' as string
signedBigintToHexString(-1n, 16) // 'ffff' as string
```

## Deserialization
```typescript
uint8ArrayToUnsignedBigint(new Uint8Array([0x00])) // 0n
uint8ArrayToSignedBigint(new Uint8Array([0x00])) // 0n
uint8ArrayToUnsignedBigint(new Uint8Array([0xff])) // 255n
uint8ArrayToSignedBigint(new Uint8Array([0xff])) // -1n
hexStringToUnsignedBigint('ff') // 255n
hexStringToSignedBigint('ff') // -1
```
