import { useFormik } from "formik";
import * as Yup from "yup";
import { Address } from "@/types";

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

const Checkout = () => {
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
    onSubmit: (values) => {
      console.log(values);
      // Here you can call the function to calculate the shipping and handle the next checkout steps
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="checkout-form p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4"
    >
      <div className=" grid grid-cols-2 gap-5">
        <div className="form-control">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            {...formik.getFieldProps("first_name")}
            className="input input-bordered"
            placeholder="First Name"
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
            placeholder="Last Name"
          />
          {formik.touched.last_name && formik.errors.last_name ? (
            <span className="label-text text-error">
              {formik.errors.last_name}
            </span>
          ) : null}
        </div>
      </div>
      <div className="form-control flex-grow">
        <label className="label">
          <span className="label-text">Address 1</span>
        </label>
        <input
          {...formik.getFieldProps("address1")}
          className="input input-bordered"
          placeholder="Address 1"
        />
        {formik.touched.address1 && formik.errors.address1 ? (
          <span className="label-text text-error">
            {formik.errors.address1}
          </span>
        ) : null}
      </div>
      <div className="form-control flex-grow">
        <label className="label">
          <span className="label-text">Address 2</span>
        </label>
        <input
          {...formik.getFieldProps("address2")}
          className="input input-bordered"
          placeholder="Address 2"
        />
        {formik.touched.address2 && formik.errors.address2 ? (
          <span className="label-text text-error">
            {formik.errors.address2}
          </span>
        ) : null}
      </div>
      <div className="form-control flex-grow">
        <label className="label">
          <span className="label-text">Country</span>
        </label>
        <select className="select">
          <option value="">Select...</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
        </select>
        {formik.touched.country && formik.errors.country ? (
          <span className="label-text text-error">{formik.errors.country}</span>
        ) : null}
      </div>
      <button type="submit" className="btn btn-primary">
        Proceed to Shipping
      </button>
    </form>
  );
};

export default Checkout;
