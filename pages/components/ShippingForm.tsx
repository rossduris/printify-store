import { useFormik } from "formik";
import * as Yup from "yup";
import { Address, CartItem, ShippingDetails, ShippingProfile } from "@/types";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import CartReview from "./CartReview";
import { loadStripe } from "@stripe/stripe-js";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
  region: Yup.string().required("Required"),
  address1: Yup.string().required("Required"),
  address2: Yup.string(),
  city: Yup.string().required("Required"),
  zip: Yup.string().required("Required"),
});

const ShippingForm = () => {
  const { calculateShipping, selectedCountry, handleCountryChange, items } =
    useCart();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country: selectedCountry,
      region: "",
      address1: "",
      address2: "",
      city: "",
      zip: "",
    } as Address,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      // Perform operations with form values (like shipping calculations)
      console.log(values);

      // Call handleCheckout function to create Stripe session and redirect
      await handleCheckout();

      setSubmitting(false);
    },
  });

  const handleCheckout = async () => {
    const stripePromise = loadStripe(
      String(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    );
    const stripe = await stripePromise;

    if (!stripe) return;

    // Fetch Checkout Session via /api/create-checkout-session
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        customer: {
          email: formik.values.email,
          address: {
            line1: formik.values.address1,
            line2: formik.values.address2 || undefined,
            city: formik.values.city,
            postal_code: formik.values.zip,
            state: formik.values.region,
            country: formik.values.country,
          },
        },
      }),
    });

    const { id: sessionId } = await response.json();

    console.log("sessionId:", sessionId); // Add this line

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId,
    });

    if (result.error) {
      console.log(result.error.message);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="">
      <div className=" grid  bg-white p-10 md:grid-cols-2 sm:grid-cols-1 relative">
        <div>
          <h2 className=" self-start py-2">Contact Information</h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email address</span>
            </label>
            <input
              {...formik.getFieldProps("email")}
              className="input input-bordered "
            />
            {formik.touched.email && formik.errors.email ? (
              <span className="label-text text-error">
                {formik.errors.email}
              </span>
            ) : null}
          </div>

          <h2 className=" self-start py-2 mt-10">Shipping Information</h2>
          <div className=" grid grid-cols-2 gap-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                {...formik.getFieldProps("first_name")}
                className="input input-bordered "
              />
              {formik.touched.first_name && formik.errors.first_name ? (
                <span className="label-text text-error">
                  {formik.errors.first_name}
                </span>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                {...formik.getFieldProps("last_name")}
                className="input input-bordered "
              />
              {formik.touched.last_name && formik.errors.last_name ? (
                <span className="label-text text-error">
                  {formik.errors.last_name}
                </span>
              ) : null}
            </div>
          </div>
          <div className="form-control ">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              {...formik.getFieldProps("address1")}
              className="input input-bordered "
            />
            {formik.touched.address1 && formik.errors.address1 ? (
              <span className="label-text text-error">
                {formik.errors.address1}
              </span>
            ) : null}
          </div>
          <div className="form-control ">
            <label className="label">
              <span className="label-text">Apartment, suite, etc.</span>
            </label>
            <input
              {...formik.getFieldProps("address2")}
              className="input input-bordered "
            />
            {formik.touched.address2 && formik.errors.address2 ? (
              <span className="label-text text-error">
                {formik.errors.address2}
              </span>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-5 ">
            <div className="form-control">
              <label className="label">
                <span className="label-text">City</span>
              </label>
              <input
                {...formik.getFieldProps("city")}
                className="input input-bordered "
              />
              {formik.touched.city && formik.errors.city ? (
                <span className="label-text text-error">
                  {formik.errors.city}
                </span>
              ) : null}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Country</span>
              </label>

              <select
                className="select bg-slate-100"
                {...formik.getFieldProps("country")}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleCountryChange(e);
                }}
              >
                {/* <option disabled>Select...</option> */}
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
              {formik.touched.country && formik.errors.country ? (
                <span className="label-text text-error">
                  {formik.errors.country}
                </span>
              ) : null}
            </div>
          </div>
          <div className=" grid grid-cols-2 gap-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text">State / Province</span>
              </label>
              <input
                {...formik.getFieldProps("region")}
                className="input input-bordered "
              />
              {formik.touched.region && formik.errors.region ? (
                <span className="label-text text-error">
                  {formik.errors.region}
                </span>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Zip code</span>
              </label>
              <input
                {...formik.getFieldProps("zip")}
                className="input input-bordered "
              />
              {formik.touched.zip && formik.errors.zip ? (
                <span className="label-text text-error">
                  {formik.errors.zip}
                </span>
              ) : null}
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              {...formik.getFieldProps("phone")}
              className="input input-bordered "
            />
            {formik.touched.phone && formik.errors.phone ? (
              <span className="label-text text-error">
                {formik.errors.phone}
              </span>
            ) : null}
          </div>
        </div>
        <CartReview>
          <button
            type="submit"
            role="link"
            className="mt-5 w-full px-4 py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
          >
            Proceed to Checkout
          </button>
        </CartReview>
      </div>
    </form>
  );
};

export default ShippingForm;
