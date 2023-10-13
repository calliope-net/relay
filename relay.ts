
//% color=#7F0000 icon="\uf011" block="Relay" weight=05
namespace relay
/* 231013 https://github.com/calliope-net/relay

Code anhand der Python- und  Arduino Library neu programmiert von Lutz Elßner im Oktober 2023
*/ {
    export enum eADDR { Relay_x18 = 0x18, Relay_x19 = 0x19 }
    /*
# Some devices have multiple available addresses - this is a list of these addresses.
# NOTE: The first address in this list is considered the default I2C address for the
# device.
SINGLE_RELAY_DEFUALT_ADDR      = 0x18
SINGLE_RELAY_JUMPER_CLOSE_ADDR = 0x19
QUAD_RELAY_DEFUALT_ADDR      = 0x6D
QUAD_RELAY_JUMPER_CLOSE_ADDR = 0x6C
DUAL_SOLID_STATE_RELAY_DEFUALT_ADDR      = 0x0A
DUAL_SOLID_STATE_RELAY_JUMPER_CLOSE_ADDR = 0x0B
QUAD_SOLID_STATE_RELAY_DEFUALT_ADDR      = 0x08
QUAD_SOLID_STATE_RELAY_JUMPER_CLOSE_ADDR = 0x09
    */
    let n_i2cCheck: boolean = false // i2c-Check
    let n_i2cError: number = 0 // Fehlercode vom letzten WriteBuffer (0 ist kein Fehler)

    // Py Define the register offsets of each relay
    const RELAY_ONE = 1
    const RELAY_TWO = 2
    const RELAY_THREE = 3
    const RELAY_FOUR = 4

    // Py define register start positions
    const DUAL_QUAD_TOGGLE_BASE = 0x00  // 0 1 2 3
    const STATUS_BASE = 0x04            // 4 5 6 7
    const DUAL_QUAD_PWM_BASE = 0x0F
    const TURN_ALL_OFF = 0x0A
    const TURN_ALL_ON = 0x0B
    const TOGGLE_ALL = 0x0C

    const SINGLE_OFF = 0x00
    const SINGLE_ON = 0x01
    const SINGLE_FIRMWARE_VERSION = 0x04
    const SINGLE_STATUS = 0x05

    // Py Define the value of an "Off" relay
    const STATUS_OFF = 0
    /* 
        export enum SF_QUAD_RELAY_COMMANDS { // Arduino
            TOGGLE_RELAY_ONE = 0x01,
            TOGGLE_RELAY_TWO,
            TOGGLE_RELAY_THREE,
            TOGGLE_RELAY_FOUR,
            RELAY_ONE_STATUS,
            RELAY_TWO_STATUS,
            RELAY_THREE_STATUS,
            RELAY_FOUR_STATUS,
            TURN_ALL_OFF = 0xA,
            TURN_ALL_ON,
            TOGGLE_ALL,
            RELAY_ONE_PWM = 0x10,
            RELAY_TWO_PWM,
            RELAY_THREE_PWM,
            RELAY_FOUR_PWM
        }
        export enum SF_QUAD_RELAY_STATUS {
            QUAD_RELAY_OFF = 0,
            QUAD_RELAY_ON = 15
        } */
    export enum eSF_SINGLE_RELAY_COMMANDS { // Arduino
        TURN_RELAY_OFF = 0x00,
        TURN_RELAY_ON = 0x01,
        SINGLE_CHANGE_ADDRESS = 0x03, // nur in Arduino, nicht in Python
        SFE_SINGLE_FIRMWARE_VERSION = 0x04, // 2 Byte ??
        MYSTATUS = 0x05
    }
    export enum eSF_SINGLE_RELAY_STATUS {
        SING_RELAY_OFF = 0,
        SING_RELAY_ON = 1
    }
    // Arduino
    //const QUAD_CHANGE_ADDRESS = 0xC7
    const SINGLE_CHANGE_ADDRESS = 0x03
    const INCORR_PARAM = 0xFF




    //% group="beim Start"
    //% block="i2c-Check %ck"
    //% ck.shadow="toggleOnOff" ck.defl=1
    export function beimStart(ck: boolean) {
        n_i2cCheck = ck
        n_i2cError = 0 // Reset Fehlercode
    }


    //% group="SparkFun Qwiic Single Relay"
    //% block="i2c %pADDR %pOnOff"
    //% pADDR.shadow="relay_eADDR"
    //% pOnOff.shadow="toggleOnOff"
    export function turnRelay(pADDR: number, pOnOff: boolean) {
        if (pOnOff) {
            i2cWriteBuffer(pADDR, Buffer.fromArray([eSF_SINGLE_RELAY_COMMANDS.TURN_RELAY_ON])) // 1
            //writeCommand(pADDR, eSF_SINGLE_RELAY_COMMANDS.TURN_RELAY_ON) // 1
        } else {
            i2cWriteBuffer(pADDR, Buffer.fromArray([eSF_SINGLE_RELAY_COMMANDS.TURN_RELAY_OFF])) // 0
            //writeCommand(pADDR, eSF_SINGLE_RELAY_COMMANDS.TURN_RELAY_OFF) // 0
        }
    }

    //% group="SparkFun Qwiic Single Relay"
    //% block="i2c %pADDR lese Status" weight=4
    //% pADDR.shadow="relay_eADDR"
    export function getState(pADDR: number): boolean { // 5
        //let bu = Buffer.fromArray([eSF_SINGLE_RELAY_COMMANDS.MYSTATUS])
        //bu.setUint8(0, eSF_SINGLE_RELAY_COMMANDS.MYSTATUS)
        i2cWriteBuffer(pADDR, Buffer.fromArray([eSF_SINGLE_RELAY_COMMANDS.MYSTATUS]), true)
        //bu = i2cReadBuffer(pADDR, 1)
        return i2cReadBuffer(pADDR, 1).getUint8(0) == eSF_SINGLE_RELAY_STATUS.SING_RELAY_ON
        //return readRegister(pADDR, eSF_SINGLE_RELAY_COMMANDS.MYSTATUS) == eSF_SINGLE_RELAY_STATUS.SING_RELAY_ON
    }



    //% group="Single Relay Register" advanced=true
    //% block="i2c %pADDR Version" weight=4
    //% pADDR.shadow="relay_eADDR"
    export function singleRelayVersion(pADDR: number) {
        //let bu = Buffer.create(1)
        //bu.setUint8(0, eSF_SINGLE_RELAY_COMMANDS.SFE_SINGLE_FIRMWARE_VERSION) // 4
        i2cWriteBuffer(pADDR, Buffer.fromArray([eSF_SINGLE_RELAY_COMMANDS.SFE_SINGLE_FIRMWARE_VERSION]), true)
        //bu = i2cReadBuffer(pADDR, 4)
        return i2cReadBuffer(pADDR, 4).toHex()
        //return readRegister(pADDR, eSF_SINGLE_RELAY_COMMANDS.SFE_SINGLE_FIRMWARE_VERSION) // 4
    }

    //% group="Single Relay Register" advanced=true
    //% block="i2c %pADDR changeAddress %newAddress" weight=2
    //% pADDR.shadow="relay_eADDR"
    //% newAddress.min=7 newAddress.max=120 newAddress.defl=0x18
    export function changeAddress(pADDR: number, newAddress: number) {
        if (newAddress >= 0x07 && newAddress <= 0x78){
            //let bu = Buffer.create(2)
            //bu.setUint8(0, eSF_SINGLE_RELAY_COMMANDS.SINGLE_CHANGE_ADDRESS) // 3
            //bu.setUint8(1, newAddress)
            i2cWriteBuffer(pADDR, Buffer.fromArray([eSF_SINGLE_RELAY_COMMANDS.SINGLE_CHANGE_ADDRESS, newAddress]))
        }
            //writeRegister(pADDR, eSF_SINGLE_RELAY_COMMANDS.SINGLE_CHANGE_ADDRESS, newAddress)
    }


/* 
    function set_relay_on(pADDR: number) {
        writeCommand(pADDR, eSF_SINGLE_RELAY_COMMANDS.TURN_RELAY_ON) // 1
    }

    function set_relay_off(pADDR: number) {
        writeCommand(pADDR, eSF_SINGLE_RELAY_COMMANDS.TURN_RELAY_OFF) // 0
    }

    function get_relay_state(pADDR: number) {
        return readRegister(pADDR, eSF_SINGLE_RELAY_COMMANDS.MYSTATUS) // 5
    }
 */
    // ========== group="Single Relay Register"

    // group="Single Relay Register" advanced=true
    // block="i2c %pADDR readRegister %pRegister" weight=2
    // pADDR.shadow="relay_eADDR"
/*     function readRegister(pADDR: number, pRegister: eSF_SINGLE_RELAY_COMMANDS) {
        let bu = Buffer.create(1)
        bu.setUint8(0, pRegister)
        i2cWriteBuffer(pADDR, bu, true)
        bu = i2cReadBuffer(pADDR, 1)
        return bu.getUint8(0)
    } */

    // group="Single Relay Register" advanced=true
    // block="i2c %pADDR writeRegister %pRegister %byte" weight=1
    // pADDR.shadow="relay_eADDR"
    // pRegister.defl=qwiicgpio.eCommandByte.OUTPUT_PORT
    // byte.min=0 byte.max=255 byte.defl=1
    // inlineInputMode=inline
/*     function writeRegister(pADDR: number, pRegister: eSF_SINGLE_RELAY_COMMANDS, byte: number) {
        let bu = Buffer.create(2)
        bu.setUint8(0, pRegister)
        bu.setUint8(1, byte)
        i2cWriteBuffer(pADDR, bu)
    } */
/* 
    function writeCommand(pADDR: number, pCommand: eSF_SINGLE_RELAY_COMMANDS) {
        let bu = Buffer.create(1)
        bu.setUint8(0, pCommand)
        i2cWriteBuffer(pADDR, bu)
    }
 */




    // ========== group="i2c Adressen"

    //% blockId=relay_eADDR
    //% group="i2c Adressen" advanced=true
    //% block="%pADDR" weight=4
    export function relay_eADDR(pADDR: eADDR): number { return pADDR }

    //% group="i2c Adressen" advanced=true
    //% block="i2c Fehlercode" weight=2
    export function i2cError() { return n_i2cError }

    function i2cWriteBuffer(pADDR: number, buf: Buffer, repeat: boolean = false) {
        if (n_i2cError == 0) { // vorher kein Fehler
            n_i2cError = pins.i2cWriteBuffer(pADDR, buf, repeat)
            if (n_i2cCheck && n_i2cError != 0)  // vorher kein Fehler, wenn (n_i2cCheck=true): beim 1. Fehler anzeigen
                basic.showString(Buffer.fromArray([pADDR]).toHex()) // zeige fehlerhafte i2c-Adresse als HEX
        } else if (!n_i2cCheck)  // vorher Fehler, aber ignorieren (n_i2cCheck=false): i2c weiter versuchen
            n_i2cError = pins.i2cWriteBuffer(pADDR, buf, repeat)
        //else { } // n_i2cCheck=true und n_i2cError != 0: weitere i2c Aufrufe blockieren
    }

    function i2cReadBuffer(pADDR: number, size: number, repeat: boolean = false): Buffer {
        if (!n_i2cCheck || n_i2cError == 0)
            return pins.i2cReadBuffer(pADDR, size, repeat)
        else
            return Buffer.create(size)
    }
} // relay.ts
