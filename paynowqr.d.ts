declare module 'paynowqr' {
    interface PaynowQROptions {
        uen: string;              // Required: UEN of the company
        amount: number;           // Required: Amount of money to pay
        refNumber: string;        // Required: Reference number for the transaction
        company?: string;         // Optional: Company name to embed in the QR code
    }

    interface PaynowQR {
        output: () => string;     // Method to output the QR code as a UTF-8 string
    }

    class PaynowQR {
        constructor(options: PaynowQROptions);
        output(): string;          // Output the QR code string
    }

    export default PaynowQR;
}