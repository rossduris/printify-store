import { useFormik } from "formik";
import * as Yup from "yup";
import { Address, CartItem } from "@/types";
import { useCart } from "../context/CartContext";

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
  const { items } = useCart();

  const getShippingInfo = async (
    blueprint_id: number,
    print_provider_id: number
  ) => {
    try {
      const response = await fetch("/api/printify/get-shipping", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          blueprint_id: blueprint_id,
          print_provider_id: print_provider_id,
        }),
        // referrerPolicy: "no-referrer",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch shipping information:", error);
    }
  };

  const calculateShipping = () => {
    if (items) {
      items.map((item: CartItem) => {
        getShippingInfo(item.blueprint_id, item.print_provider_id);
      });
    } else {
      console.log("no items yet");
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country: "",
      region: "",
      address1: "",
      address2: "",
      city: "",
      zip: "",
    } as Address,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      calculateShipping();
      setSubmitting(false);
      // Here you can call the function to calculate the shipping and handle the next checkout steps
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="checkout-form p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4"
    >
      <h2 className=" self-start py-2">Contact Information</h2>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email address</span>
        </label>
        <input
          {...formik.getFieldProps("email")}
          className="input input-bordered"
        />
        {formik.touched.email && formik.errors.email ? (
          <span className="label-text text-error">{formik.errors.email}</span>
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
            className="input input-bordered"
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
            className="input input-bordered"
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
          className="input input-bordered"
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
          className="input input-bordered"
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
            className="input input-bordered"
          />
          {formik.touched.city && formik.errors.city ? (
            <span className="label-text text-error">{formik.errors.city}</span>
          ) : null}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Country</span>
          </label>

          <select className="select" {...formik.getFieldProps("country")}>
            <option value="" disabled>
              Select...
            </option>
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
            className="input input-bordered"
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
            className="input input-bordered"
          />
          {formik.touched.zip && formik.errors.zip ? (
            <span className="label-text text-error">{formik.errors.zip}</span>
          ) : null}
        </div>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Phone</span>
        </label>
        <input
          {...formik.getFieldProps("phone")}
          className="input input-bordered"
        />
        {formik.touched.phone && formik.errors.phone ? (
          <span className="label-text text-error">{formik.errors.phone}</span>
        ) : null}
      </div>
      <button type="submit" className="btn btn-primary">
        Calculate Shipping
      </button>
    </form>
  );
};

export default ShippingForm;
