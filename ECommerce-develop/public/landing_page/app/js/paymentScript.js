// This is your test publishable API key.
const stripe = Stripe("pk_test_51O49dTDB1UugWx3SywDY2xXN6L4PaFneasKFXdfXQnhmjI4leq9druszn9qBvYf0CYJH4LHwF4gAYbKUQHPrc1py00Ac1KPywc");

// The items the customer wants to buy
// const items = [{ id: "xl-tshirt" }];

let elements, paymentId;

initialize();
checkStatus();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch("/payments/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ "items": "item" }),
  });
  const { clientSecret, paymentIntentId } = await response.json();
  paymentId = paymentIntentId;

  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);  
  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "http://localhost:3000/item-listing/listings",
    },
    redirect: 'if_required',
  });
  if(error) {
    if (error.type === "card_error" || error.type === "validation_error") {
      showMessage(error.message);
    } else {
      console.log(error.message);
      showMessage("An unexpected error occurred.");
    }
  }
  else 
  {
      //Call API to flush cart and store order details. (Victor's/Kush's part).
      console.log(paymentId); //This Id can be used by Victor for storing in payments table.
      await fetch("/cart/checkout", 
      {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "paymentID": paymentId })

      }).then(response => 
        {
            return response.json().then(data => {
                if (response.ok) {
                    // If the response is successful, alert the message and then redirect
                    alert(data.message);
                    window.location.href = data.redirectUrl || '/users/get-purchase-history';
                } else {
                    // If the response is not successful, throw an error with the message from the server
                    throw new Error(data.message);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('errorMsg').innerText = error.message || 'An unexpected error occurred.';
        });
  
  }
  setLoading(false);
  
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}