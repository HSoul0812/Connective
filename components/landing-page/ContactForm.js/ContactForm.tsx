import { FormEvent } from "react";
import useInput from "../../../hooks/use-input";
import Api from "../../../services/api";

const ContactForm = () => {
  // Name input
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    valueBlurHandler: nameBlurHandler,
    reset: nameReset,
  } = useInput((value: string) => value.trim() !== "");

  // Email input
  const validRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    valueBlurHandler: emailBlurHandler,
    reset: emailReset,
  } = useInput((value: string) => value.match(validRegex) != null);

  // Phone Number input
  const {
    value: enteredNumber,
    isValid: enteredNumberIsValid,
    hasError: numberHasError,
    valueChangeHandler: numberChangeHandler,
    valueBlurHandler: numberBlurHandler,
    reset: numberReset,
  } = useInput((value: string) => value.trim() !== "");

  // Message input
  const {
    value: enteredMessage,
    isValid: enteredMessageIsValid,
    hasError: messageHasError,
    valueChangeHandler: messageChangeHandler,
    valueBlurHandler: messageBlurHandler,
    reset: messageReset,
  } = useInput((value: string) => value.trim() !== "");

  // form validation && submission
  let formIsValid = false;
  if (
    enteredNameIsValid &&
    enteredEmailIsValid &&
    enteredMessageIsValid &&
    enteredNumberIsValid
  ) {
    formIsValid = true;
  }

  const formSubmissionHandler = async (
    e: FormEvent<HTMLFormElement> | FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const mailMessage = `<p>My name is ${enteredName}, my phone number is ${enteredNumber}, and email address is <a href='mailto:${enteredEmail}'> ${enteredEmail} </a></p>`;
    if (
      !enteredNameIsValid &&
      !enteredEmailIsValid &&
      !enteredMessageIsValid &&
      !enteredNumberIsValid
    ) {
    }

    const send = await Api.email("SMTP", {
      subject: `${enteredName} contacted you`,
      msg: mailMessage,
      typename: "EmailContent"
    });

    if (send) {
      console.log("Sent message");
      nameReset();
      emailReset();
      messageReset();
      numberReset();
    }
  };

  return (
    <section
      id="contact"
      className="bg-white font-[Poppins] py-20 mx-auto px-[1.8rem]"
    >
      <h2 className="text-center text-4xl font-bold text-[#061A40] mb-6">
        Contact Us
      </h2>
      <p className="font-normal text-[#061A40] text-lg text-center mx-auto mb-12">
        Got questions? Don't hesitate to contact us.
      </p>

      <form
        className="flex flex-col justify-center items-center mx-auto gap-5"
        onSubmit={formSubmissionHandler}
      >
        <div>
          <label className="text-[#0D1011] font-bold text-xs" htmlFor="name">
            Name
          </label>
          <br />
          <input
            className={`inputClass ${nameHasError ? "error-border" : ""} ${
              enteredName ? "valid-border" : ""
            }`}
            type="text"
            placeholder="Your name"
            id="name"
            name="name"
            value={enteredName}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
          />
          {nameHasError && (
            <p className="error-message mt-1">This field is required</p>
          )}
        </div>

        <div>
          <label className="text-[#0D1011] font-bold text-xs" htmlFor="email">
            E-mail
          </label>
          <br />
          <input
            className={`inputClass ${emailHasError ? "error-border" : ""} ${
              enteredEmail ? "valid-border" : ""
            }`}
            type="text"
            placeholder="Your e-mail"
            id="email"
            name="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
          {emailHasError && (
            <p className="error-message mt-1">
              This field is required, enter a valid email
            </p>
          )}
        </div>

        <div>
          <label className="text-[#0D1011] font-bold text-xs" htmlFor="number">
            Phone Number
          </label>
          <br />
          <input
            className={`inputClass ${numberHasError ? "error-border" : ""} ${
              enteredNumber ? "valid-border" : ""
            }`}
            type="text"
            placeholder="Your phone number"
            id="number"
            name="number"
            value={enteredNumber}
            onChange={numberChangeHandler}
            onBlur={numberBlurHandler}
          />
          {numberHasError && (
            <p className="error-message mt-1">This field is required</p>
          )}
        </div>

        <div>
          <label className="text-[#0D1011] font-bold text-xs" htmlFor="message">
            What do you need help with?
          </label>
          <br />
          <input
            className={`inputClass ${messageHasError ? "error-border" : ""} ${
              enteredMessage ? "valid-border" : ""
            }`}
            type="text"
            placeholder="Reason to message"
            id="message"
            name="message"
            value={enteredMessage}
            onChange={messageChangeHandler}
            onBlur={messageBlurHandler}
          />
          {messageHasError && (
            <p className="error-message mt-1">This field is required</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="bg-[#061A40] font-[Poppins] w-fit py-2 px-10 text-base text-[#F2F4F5] rounded-[50px] cursor-pointer"
          disabled={!formIsValid}
          onSubmit={formSubmissionHandler}
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
