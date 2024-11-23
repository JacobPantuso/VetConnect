import { useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/Payment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faShopLock } from "@fortawesome/free-solid-svg-icons";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF, {InvoiceData} from "./components/InvoicePDF";

type CardType = "visa" | "mastercard" | "amex" | null;

function Payment() {
    const { paymentid } = useParams<{ paymentid: string }>();
    const [cardNumber, setCardNumber] = useState<string>("");
    const [cardType, setCardType] = useState<CardType>(null);
    const [cardHolder, setCardHolder] = useState<string>("");
    const [expiryDate, setExpiryDate] = useState<string>("");
    const [cvv, setCvv] = useState<string>("");
    const [verifying, setVerifying] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const navigate = useNavigate();
    const formatCardNumber = (value: string) => {
        return value.replace(/\s+/g, '')
            .replace(/(\d{4})/g, "$1 ")
            .trim();
    };

    const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\s+/g, '');
        setCardNumber(rawValue.slice(0, 16));

        if (/^4/.test(rawValue)) {
            setCardType("visa");
        } else if (/^5[1-5]/.test(rawValue)) {
            setCardType("mastercard");
        } else if (/^3[47]/.test(rawValue)) {
            setCardType("amex");
        } else {
            setCardType(null);
        }
    };

    const handleBlur = () => {
        setCardNumber(formatCardNumber(cardNumber));
    };

    const getCardLogo = () => {
        switch (cardType) {
            case "visa":
                return '/visa.png';
            case "mastercard":
                return '/mastercard.png';
            case "amex":
                return '/amex.png';
            default:
                return '';
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        switch (name) {
            case "cardHolder":
                setCardHolder(value);
                break;
            case "expiryDate":
                setExpiryDate(value);
                break;
            case "cvv":
                setCvv(value);
                break;
            default:
                break;
        }
    }

    const invoiceData = {
        clientName: "John Doe",
        invoiceNumber: "INV-123456",
        invoiceDate: "01/01/2022",
        dueDate: "01/15/2022",
        lastDigits: "1234",
        items: [
            {
                description: "Annual Checkup",
                rate: 100.00,
                duration: "1 hour",
            },
        ],
        subTotal: 100.00
    };

    const handleOpenPDF = async (invoiceData: InvoiceData) => {
        const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
        const blobURL = URL.createObjectURL(blob);
        window.open(blobURL, '_blank');
      };

    const handleSubmit = () => {
        let hasError = false;
    
        if (cardNumber.length !== 19) {
            hasError = true;
        }
    
        if (cardHolder === "") {
            hasError = true;
        }
    
        if (expiryDate.length !== 5) {
            hasError = true;
        }
        if ((cvv.length !== 3 && cardType !== "amex") || (cvv.length !== 4 && cardType === "amex")) {
            hasError = true;
        }
    
        setIsError(hasError);
    
        if (hasError) {
            return;
        }
    
        setVerifying(true);
        setTimeout(() => {
           handleOpenPDF(invoiceData).then(() => {
                setVerifying(false);
                navigate("/appointments");
              });
        }, 3000);
    };
    

    return (
        <div className="Payment">
            <h2>Payment #{paymentid}</h2>
            <p>Please fill out the form below to complete your payment.</p>
            <div className="payment-container">
                <div className="paying-this">
                    <h3>Invoice Details</h3>
                    <div className="payment-details">
                        <div className="payment-detail">
                            <h4>Service</h4>
                            <p>Annual Checkup</p>
                        </div>
                        <div className="payment-detail">
                            <h4>Amount</h4>
                            <p>$100.00</p>
                        </div>
                    </div>
                </div>
                <div className="payment-form-container">
                    <div className="left-payment">
                        <h3>Checkout</h3>
                        <form className="payment-form">
                            <div className="form-group card-number-group">
                                <label htmlFor="cardNumber">Card Number</label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        onBlur={handleBlur}
                                        className={isError ? "input-field error" : "input-field"}
                                    />
                                    {cardType && (
                                        <img src={getCardLogo()} alt="Card Logo" className="input-icon" />
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="cardHolder">Cardholder Name</label>
                                <input
                                    type="text"
                                    id="cardHolder"
                                    name="cardHolder"
                                    value={cardHolder}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className={isError ? "input-field error" : "input-field"}
                                    />
                            </div>
                            <div className="form-group expiry-cvv">
                                <div className="expiry-container">
                                    <label htmlFor="expiryDate">Expiry Date</label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        name="expiryDate"
                                        value={expiryDate}
                                        onChange={handleInputChange}
                                        placeholder="MM/YY"
                                        className={isError ? "input-field error" : "input-field"}
                                    />
                                </div>
                                <div className="cvv-container">
                                    <label htmlFor="cvv">CVV</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        value={cvv}
                                        onChange={handleInputChange}
                                        placeholder="CVV"
                                        maxLength={cardType === "amex" ? 4 : 3}
                                        className={isError ? "input-field error" : "input-field"}
                                    />
                                </div>
                            </div>
                        </form>
                        <button className="submit-button" onClick={handleSubmit}><FontAwesomeIcon icon={faDollarSign} /> Submit Payment</button>
                    </div>
                    <div className="right-payment">
                        <FontAwesomeIcon icon={faShopLock} size="4x" />
                        <h4>Secure Payment</h4>
                        <p>The details you enter in this form will remain confidential. You will receive a confirmation email when the payment is processed.</p>
                    </div>
                </div>
            </div>
            {verifying && (
                <div className="verifying-payment">
                    <div className="verifying-content">
                        <p className="loader"></p>
                        <h3>Please Wait...</h3>
                        <p>
                            We're verifying your payment information with {cardType === "visa" ? "VISA" : cardType === "mastercard" ? "Mastercard" : cardType === "amex" ? "American Express" : "your bank"}.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Payment;
