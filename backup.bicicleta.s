.include "p30F3013.inc"
config __FOSC, CSW_FSCM_OFF & FRC
config __FWDT, WDT_OFF
config __FBORPOR, PBOR_ON & BORV27 & PWRT_16 & MCLR_EN
config __FGS, CODE_PROT_OFF & GWRP_OFF

;Program Specific Constants (literals used in code)
.equ SAMPLES, 64         ;Number of samples

;..............................................................................
;Global Declarations:
;..............................................................................

.global _wreg_init       ;Provide global scope to _wreg_init routine
                             ;In order to call this routine from a C file,
                             ;place "wreg_init" in an "extern" declaration
                             ;in the C file.

.global __reset          ;The label for the first line of code.

;Constants stored in Program space
.section .myconstbuffer, code
.palign 2                ;Align next word stored in Program space to an
                             ;address that is a multiple of 2
ps_coeff:
.hword   0x0002, 0x0003, 0x0005, 0x000A

;Uninitialized variables in X-space in data memory
.section .xbss, bss, xmemory
x_input: .space 2*SAMPLES        ;Allocating space (in bytes) to variable.

;Uninitialized variables in Y-space in data memory
.section .ybss, bss, ymemory
y_input:  .space 2*SAMPLES

;Uninitialized variables in Near data memory (Lower 8Kb of RAM)
.section .nbss, bss, near
var1:     .space 2               ;Example of allocating 1 word of space for
                             ;variable "var1".




.text                             ;Start of Code section
__reset:
MOV #__SP_init, W15       ;Initalize the Stack Pointer
MOV #__SPLIM_init, W0     ;Initialize the Stack Pointer Limit Register
MOV W0, SPLIM
NOP                       ;Add NOP to follow SPLIM initialization

CALL _wreg_init           ;Call _wreg_init subroutine
                          ;Optionally use RCALL instead of CALL

CALL INI_PERIPHERALS

NOP
CLR	    PORTB
NOP
CLR	W4
CLR	W9
start:


CALL DELAY_1S

MOV LATD, W9
LSR W9, #8, W9

ADD W9, W4, W4
    CLR LATD;testing

CP  W4, #0
BRA Z,	Apagado

CP  W4, #1
BRA Z, Encendido

CP  W4, #2
BRA Z, BLINK_100

CP  W4, #3
BRA Z, BLINK_500

CP W4, #4
BRA Z, Izq_ini

CP W4, #5
BRA Z, der_ini

CP W4, #6
BRA Z, Izq_ini_100

CP W4, #7
BRA Z, KnightRider


Apagado:

    CLR	PORTB
    CALL    DELAY_150MS
    CALL 	Checar_push
    BRA	Apagado

Encendido:

    SETM	PORTB
    CALL    DELAY_150MS
    CALL 	Checar_push
    BRA Encendido

BLINK_100:
    SETM    PORTB
    CALL DELAY_100m
    CLR PORTB
    CALL DELAY_100m
BRA BLINK_100

BLINK_500:
    SETM    PORTB
    CALL DELAY_500m
    CLR PORTB
    CALL DELAY_500m
BRA BLINK_500

Izq_ini:
    ;MOV	#0X03C0, W2
    MOV #0x03C0, W5 ;Enciendo los 4 primeros 1111000000
    Izquierda:
	CALL DELAY_200m;Dentro de cada uno de los ciclos del delay compruebo el PORTD
	MOV W5, PORTB
	LSR	W5, #1, W5
	CP	W5,  #0
    BRA NZ, Izquierda
BRA Izq_ini

der_ini:
    MOV	#0X3C00, W7
    MOV #0x000F, W6 ;Enciendo los 4 primeros 1111000000
    Derecha:
	CALL DELAY_200m;Dentro de cada uno de los ciclos del delay compruebo el PORTD
	;CALL 	Checar_push
	MOV W6, PORTB
	SL	W6, #1, W6
	CP	W6, W7
    BRA NZ, Derecha
    CLR W7
BRA der_ini

Izq_ini_100:
    ;MOV	#0X03C0, W7
    MOV #0x03C0, W6 ;Enciendo los 4 primeros 1111000000
    Izquierda_100:
	CALL DELAY_100m ;Dentro de cada uno de los ciclos del delay compruebo el PORTD
	MOV W6, PORTB
	LSR	W6, #1, W6
	CP	W6,  #0
    BRA NZ, Izquierda_100
BRA Izq_ini_100

KnightRider:
    ;MOV	#0XFFFF, W4
    MOV	#0X03C0, W8
    MOV	#0x03C0, W5 ;Enciendo los 4 primeros 1111000000
    corr_der:
	CALL DELAY_200m;Dentro de cada uno de los ciclos del delay compruebo el PORTD
	MOV W5, PORTB
	LSR W5, #1, W5
	CP	W5, #0X000F
	BRA NZ, corr_der
	BRA corr_izq

    corr_izq:
	CALL DELAY_200m
	;CALL 	Checar_push
	MOV W5, PORTB
	SL	W5, #1, W5
	CP	W5, W8
	BRA NZ, corr_izq
	BRA corr_der





Checar_push:
    MOV	LATD, W9
    LSR W9, #8, W9
    CP W9, #1
    BRA Z, start
    return

DELAY_1S:
	PUSH	    W0
	PUSH	    W1
	MOV	    #10,	    W1
    CYCLE1_2:
	CLR	    W0


    CYCLE1_1:
	DEC	    W0,		    W0
	BRA	    NZ,		    CYCLE1_1

	DEC	    W1,		    W1
	BRA	    NZ,		    CYCLE1_2

	POP	    W1
	POP	    W0
RETURN


DELAY_150MS:
PUSH	    W0
PUSH	    W1

MOV	    #7,	    W1
CYCLE2:
;CLR	    W0
MOV	    #0X1C02,	     W0

CYCLE1:
DEC	    W0,		    W0
BRA	    NZ,		    CYCLE1

DEC	    W1,		    W1
BRA	    NZ,		    CYCLE2

POP	    W1
POP	    W0
RETURN



DELAY_100m:
PUSH	    W0
PUSH	    W1

MOV	    #7,	    W1
CYCLE2_100:
MOV	    #0x2272,		    W0
CALL 	Checar_push


CYCLE1_100:
    CALL 	Checar_push;Se lee el PORTD en cada ciclo
DEC	    W0,		    W0
BRA	    NZ,		    CYCLE1_100

    CALL 	Checar_push
DEC	    W1,		    W1
BRA	    NZ,		    CYCLE2_100

POP	    W1
POP	    W0

RETURN

DELAY_500m:
PUSH	    W0
PUSH	    W1

MOV	    #7,	    W1
CYCLE2_500:
MOV	    #0xAB72,		    W0
    CALL 	Checar_push

CYCLE1_500:
    CALL 	Checar_push
DEC	    W0,		    W0
BRA	    NZ,		    CYCLE1_500
    CALL 	Checar_push
DEC	    W1,		    W1
BRA	    NZ,		    CYCLE2_500

POP	    W1
POP	    W0
RETURN


DELAY_200m:
PUSH	    W0
PUSH	    W1

MOV	    #7,	    W1
CYCLE2_200:
MOV	    #0x54FF,		    W0
    CALL 	Checar_push

CYCLE1_200:
    CALL 	Checar_push
DEC	    W0,		    W0
BRA	    NZ,		    CYCLE1_200
    CALL 	Checar_push
DEC	    W1,		    W1
BRA	    NZ,		    CYCLE2_200

POP	    W1
POP	    W0
RETURN


DELAY_15m:
PUSH	    W0
PUSH	    W1

MOV	    #7,	    W1
CYCLE2_15:
MOV	    #0xADA2,		    W0

CYCLE1_15:
DEC	    W0,		    W0
BRA	    NZ,		    CYCLE1_15

DEC	    W1,		    W1
BRA	    NZ,		    CYCLE2_15

POP	    W1
POP	    W0
RETURN


INI_PERIPHERALS:
    CLR         PORTB
    NOP
    CLR         LATB
    NOP
    CLR         TRISB	    ;PORTB AS OUTPUT
    NOP
    SETM	    ADPCFG		  ;Disable analogic inputs

    CLR         PORTD
    NOP
    CLR         LATD
    NOP
    SETM        TRISD		   ;PORTD AS INPUT
    NOP
RETURN


_wreg_init:
CLR W0
MOV W0, W14
REPEAT #12
MOV W0, [++W14]
CLR W14
RETURN


.end                               ;End of program code in this file
