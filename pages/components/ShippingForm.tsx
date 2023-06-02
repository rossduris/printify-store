import { useFormik } from "formik";
import * as Yup from "yup";
import { Address, CartItem, ShippingDetails, ShippingProfile } from "@/types";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

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
  const [shippingData, setShippingData] = useState<ShippingDetails>();
  const { items, updateItem } = useCart();

  const getShippingInfo = async (item: CartItem, country: string) => {
    try {
      const response = await fetch("/api/printify/get-shipping", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          blueprint_id: item.blueprint_id,
          print_provider_id: item.print_provider_id,
        }),
      });
      const data = await response.json();
      setShippingData(data);

      const restOfTheWorldProfile = data.profiles.find(
        (profile: ShippingProfile) =>
          profile.countries.includes("REST_OF_THE_WORLD")
      );

      // Filter profiles to those applicable for this item's variant_id and the selected country
      const applicableProfiles = data.profiles.filter(
        (profile: ShippingProfile) => {
          return (
            profile.variant_ids.includes(item.variant_id) &&
            profile.countries.includes(country)
          );
        }
      );

      // If no applicable profile found for the selected country, use the "REST_OF_THE_WORLD" profile
      let profile;
      if (applicableProfiles.length) {
        profile = applicableProfiles[0];
      } else if (restOfTheWorldProfile) {
        profile = restOfTheWorldProfile;
      } else {
        console.error(
          "No applicable shipping profile found for item",
          item.id,
          "and country",
          country
        );
        return; // Or handle this situation appropriately
      }

      const shippingCost = profile.first_item.cost / 100; // assuming cost is in cents
      const additionalItemCost = profile.additional_items.cost / 100;

      // Calculate total shipping cost based on quantity
      // The cost for the first item plus the additional cost for any additional items
      const totalShippingCost =
        shippingCost + additionalItemCost * (item.quantity - 1);

      return totalShippingCost;
    } catch (error) {
      console.error("Failed to fetch shipping information:", error);
    }
  };

  useEffect(() => {
    if (shippingData && shippingData.profiles) {
      console.log(shippingData.profiles);
      // shippingData.profiles.map((profile) => {
      //   console.log(
      //     `First item: ${JSON.stringify(profile.first_item.cost / 100)}
      //       Additional items: ${JSON.stringify(
      //         profile.additional_items.cost / 100
      //       )}`
      //   );
      // });
    }
  }, [shippingData]);

  // in your calculateShipping function, call updateItem after getting the shipping info:
  const calculateShipping = (country: string) => {
    if (items) {
      items.map((item: CartItem) => {
        getShippingInfo(item, country).then((shippingCost) => {
          // once you've got the shipping cost, update the item in the cart:
          updateItem(item.id, item.variant_id, item.quantity, shippingCost);
        });
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
      calculateShipping(values.country);
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
          className="input input-bordered bg-slate-100 text-slate-500"
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
            className="input input-bordered bg-slate-100 text-slate-500"
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
            className="input input-bordered bg-slate-100 text-slate-500"
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
          className="input input-bordered bg-slate-100 text-slate-500"
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
          className="input input-bordered bg-slate-100 text-slate-500"
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
            className="input input-bordered bg-slate-100 text-slate-500"
          />
          {formik.touched.city && formik.errors.city ? (
            <span className="label-text text-error">{formik.errors.city}</span>
          ) : null}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Country</span>
          </label>

          <select
            className="select bg-slate-100 text-slate-500"
            {...formik.getFieldProps("country")}
            onChange={(e) => {
              formik.handleChange(e);
              calculateShipping(e.target.value);
            }}
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
          {formik.touched.country && formik.errors.country ? (
            <span className="label-text bg-slate-100 text-slate-500">
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
            className="input input-bordered bg-slate-100 text-slate-500"
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
            className="input input-bordered bg-slate-100 text-slate-500"
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
          className="input input-bordered bg-slate-100 text-slate-500"
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
