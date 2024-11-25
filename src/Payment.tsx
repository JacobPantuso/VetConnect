import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/Payment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faMoneyBill,
  faShopLock,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { Font, pdf } from "@react-pdf/renderer";
import InvoicePDF, { InvoiceData } from "./components/InvoicePDF";
import {
  Appointment,
  fetchAppointments,
  fetchPaymentForms,
  PaymentForm,
  updatePaymentForm,
} from "./utils/supabase";

type CardType = "visa" | "mastercard" | "amex" | null;

function Payment() {
  const { appointmentid } = useParams<{ appointmentid: string }>();
  const [paymentForm, setPaymentForm] = useState<PaymentForm | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardType, setCardType] = useState<CardType>(null);
  const [cardHolder, setCardHolder] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (appointmentid) {
      fetchPaymentForms({ appointmentId: parseInt(appointmentid) }).then(
        (paymentForms) => {
          if (paymentForms.length === 0) {
            navigate("/appointments");
          } else {
            setPaymentForm(paymentForms[0]);
            setFetching(false);
          }
        }
      );
      fetchAppointments({ appointmentId: parseInt(appointmentid) }).then(
        (appointments) => {
          setAppointment(appointments[0]);
        }
      );
    }
  }, [appointmentid, navigate]);

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s+/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s+/g, "");
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
        return "/visa.png";
      case "mastercard":
        return "/mastercard.png";
      case "amex":
        return "/amex.png";
      default:
        return "";
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
  };

  const invoiceData = {
    clientName: `Tax information not on file. Please contact clinic...`,
    invoiceNumber: `${Math.floor(Math.random() * 1000000)}-${paymentForm?.id}`,
    invoiceDate: `${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    dueDate: `${new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    lastDigits: `${cardNumber.slice(-4)} (${cardType?.toUpperCase()})`,
    items: [
      {
        description: `${appointment?.service}`,
        rate: paymentForm?.charge ?? 0,
        duration: `${appointment?.scheduled_date.slice(10)}`,
      },
    ],
    subTotal: paymentForm?.charge ?? 0,
  };

  const handleOpenPDF = async (invoiceData: InvoiceData) => {
    const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL, "_blank");
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
    if (
      (cvv.length !== 3 && cardType !== "amex") ||
      (cvv.length !== 4 && cardType === "amex")
    ) {
      hasError = true;
    }

    setIsError(hasError);

    if (hasError) {
      return;
    }

    setVerifying(true);
    if (!paymentForm) {
      return;
    }
    updatePaymentForm(paymentForm.id, {status: "paid"}).then(() => {
        setTimeout(() => {
        handleOpenPDF(invoiceData).then(() => {
            setVerifying(false);
            navigate("/appointments");
        });
        }, 3000);
    });
  };

  if (fetching) {
    return (
      <div className="Payment fetching">
        <h2>Payment</h2>
        <div className="fetching-payment-container">
          <p className="loader"></p>
          <p>Fetching requested payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Payment">
      <h2>Invoice #{paymentForm?.id}</h2>
      <p>Please fill out the form below to complete your payment.</p>
      <div className="payment-container">
        <div className="paying-this">
          <h3>
            <FontAwesomeIcon icon={faDollarSign} /> Invoice Details
          </h3>
          <div key={appointment?.id} className="appointment">
            <div className="left">
              <div className="pet-img">
                <img
                  src="https://media.istockphoto.com/id/474486193/photo/close-up-of-a-golden-retriever-panting-11-years-old-isolated.jpg?s=612x612&w=0&k=20&c=o6clwQS-h6c90AHlpDPC74vAgtc_y2vvGg6pnb7oCNE="
                  alt={"test"}
                />
              </div>
              <div className="appointment-details">
                <h3>
                  {appointment?.service}
                </h3>
                <p>
                  <b>Completed:</b>{" "}
                  {appointment?.scheduled_date && new Date(
                    appointment.scheduled_date.split(" ")[0]
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  from {appointment?.scheduled_date.slice(10)}
                </p>
              </div>
            </div>
            <div className="appt-right-payment">
              <p>
                <b>Total Due:</b> ${paymentForm?.charge}
              </p>
            </div>
          </div>
          <div className="payment-details">
            <div className="payment-detail">
              <h4>
                <FontAwesomeIcon icon={faStethoscope} /> Service
              </h4>
              <p>{appointment?.service}</p>
            </div>
            <div className="payment-detail">
              <h4>
                <FontAwesomeIcon icon={faMoneyBill} /> Amount
              </h4>
              <p>${paymentForm?.charge} CAD</p>
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
                    <img
                      src={getCardLogo()}
                      alt="Card Logo"
                      className="input-icon"
                    />
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
            <button className="submit-button" onClick={handleSubmit}>
              <FontAwesomeIcon icon={faDollarSign} /> Submit Payment
            </button>
          </div>
          <div className="right-payment">
            <FontAwesomeIcon icon={faShopLock} size="4x" />
            <h4>Secure Payment</h4>
            <p>
              The details you enter in this form will remain confidential. You
              will receive a confirmation email when the payment is processed.
            </p>
          </div>
        </div>
      </div>
      {verifying && (
        <div className="verifying-payment">
          <div className="verifying-content">
            <p className="loader"></p>
            <h3>Please Wait...</h3>
            <p>
              We're verifying your payment information with{" "}
              {cardType === "visa"
                ? "VISA"
                : cardType === "mastercard"
                ? "Mastercard"
                : cardType === "amex"
                ? "American Express"
                : "your bank"}
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
