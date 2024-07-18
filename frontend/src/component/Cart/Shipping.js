import React, { Fragment, useState } from 'react';
import "./Shipping.css";
import { useSelector, useDispatch } from 'react-redux';
import { saveShippingInfo } from '../../actions/cartAction';
import MetaData from '../layout/MetaData';
import PinDropIcon from "@material-ui/icons/PinDrop";
import HomeIcon from "@material-ui/icons/Home";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import { Country, State } from "country-state-city";
import { useAlert } from 'react-alert';
import CheckoutSteps from "../Cart/CheckoutSteps.js"
import { useNavigate } from 'react-router-dom';
const Shipping = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { shippingInfo } = useSelector((state) => state.cart);

    const [address, setAddress] = useState(shippingInfo.address || "");
    const [city, setCity] = useState(shippingInfo.city || "");
    const [state, setState] = useState(shippingInfo.state || "");
    const [country, setCountry] = useState(shippingInfo.country || "");
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");

    const shippingSubmit = (e) => {
        e.preventDefault();

        // Validate phone number length
        if (phoneNo.length !== 10) {
            alert.error("Phone Number should be 10 digits long");
            return;
        }

        // Validate pin code length
        if (pinCode.length !== 6) {
            alert.error("Pin Code should be 6 digits long");
            return;
        }

        dispatch(saveShippingInfo({ address, city, state, country, pinCode, phoneNo }));
        alert.success("Shipping Info Saved");
        navigate("/order/confirm");
    }

    const handleNumberInput = (setter, length) => (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, ""); // Remove all non-numeric characters
        if (value.length <= length) {
            setter(value);
        }
    }

    return (
        <Fragment>
            <MetaData title="Shipping Details" />
            <CheckoutSteps activeStep={0} />
            <div className="shippingContainer">
                <div className="shippingBox">
                    <h2 className="shippingHeading">Shipping Details</h2>
                    <form
                        className='shippingForm'
                        encType='multipart/form-data'
                        onSubmit={shippingSubmit}
                    >
                        <div>
                            <HomeIcon />
                            <input
                                type="text"
                                placeholder='Address'
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div>
                            <LocationCityIcon />
                            <input
                                type="text"
                                placeholder='City'
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div>
                            <PinDropIcon />
                            <input
                                type="text"
                                placeholder='Pin Code'
                                required
                                value={pinCode}
                                onChange={handleNumberInput(setPinCode, 6)}
                            />
                        </div>
                        <div>
                            <PhoneIcon />
                            <input
                                type="text"
                                placeholder='Phone Number'
                                required
                                value={phoneNo}
                                onChange={handleNumberInput(setPhoneNo, 10)}
                            />
                        </div>

                        <div>
                            <PublicIcon />
                            <select
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            >
                                <option value="">Country</option>
                                {Country &&
                                    Country.getAllCountries().map((item) => (
                                        <option key={item.isoCode} value={item.isoCode}>
                                            {item.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        {country && (
                            <div>
                                <TransferWithinAStationIcon />
                                <select
                                    required
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                >
                                    <option value="">State</option>
                                    {State &&
                                        State.getStatesOfCountry(country).map((item) => (
                                            <option key={item.isoCode} value={item.isoCode}>
                                                {item.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}

                        <input
                            type="submit"
                            value="Continue"
                            className='shippingBtn'
                            disabled={state ? false : true}
                        />
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Shipping;


