import React, { useRef, useEffect, useState } from "react";
import "./addition.scss";
import Navbar from "../navbar";
import { Tabs } from "antd";
import { Select } from "antd";
import { Form, Input, InputNumber, Button, AutoComplete} from 'antd';
import { TimePicker } from 'antd';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import myData from "./addition.json";
import axios from "axios";
import ReactMapGL, {
  NavigationControl,
  Popup,
  Marker,
  GeolocateControl,
} from "react-map-gl";
import * as turf from "@turf/turf";
const { TextArea } = Input;
const MAPBOX_TOKEN =
  "pk.eyJ1IjoicHVsa2l0MDQwOSIsImEiOiJja3ZwMHF3cDAwdmlwMm9xaGdhZDEyYmppIn0.tnFpGKz1oAJyJsVadjvgEA";
let data = [...myData];
const baseURL = "http://localhost:5000/api/";
const navControlStyle = {
  right: 10,
  top: 10,
};

const geolocateStyle = {
  top: 0,
  left: 0,
  margin: 10,
};
const positionOptions = { enableHighAccuracy: true };

const { Option } = Select;


export default function Addition() {
  const history = useHistory()
  const [popupInfo, setPopupInfo] = useState({ latitude: 0, longitude: 0 });
  const [otherTime, otherTimeState] = useState(false);
  const [locationData, locationInfo] = useState({});
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    longitude: -122.45,
    latitude: 41.35,
    zoom: 8,
  });
  const [options, setOptions] = useState([]);

  const [form] = Form.useForm();

  const getLocation = (e) => {
    return e;
  };

  const checkTime = (e) =>{
    if(e.includes('other')){
      form.setFieldsValue({
        time: ['other'],
      });
      otherTimeState(true);
    }
    else{
      otherTimeState(false);
    }
  }

  const changeMapMarker = (nextViewport) =>{
  setTimeout(()=>{
    const langlot = nextViewport.lngLat;
   const data = langlot.join();

    axios
          .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${data}.json?limit=1&access_token=pk.eyJ1IjoicHVsa2l0MDQwOSIsImEiOiJja3ZwMHF3cDAwdmlwMm9xaGdhZDEyYmppIn0.tnFpGKz1oAJyJsVadjvgEA`)
          .then((response) => {
            const info = response.data;
            let city = '';
            let country = '';
            let address = info.features[0].place_name;
            info.features[0].context.map((x)=>{
              if(x.id.includes('district')){
                city = x.text;
              }
              else if(x.id.includes('country')){
                country = x.text;
              }
            });
            locationInfo({points:langlot})
            setTimeout((x)=>{
              setOptions([]);
              form.setFieldsValue({
                longitude : langlot[0],
                latitude : langlot[1],
                address : address,
                city: city,
                country: country,
                search : ''
  
              })
            },2000)

          });
        },200);

  }

  const getAddressUsingSearch = (e) =>{
    console.log(e);
    let localeOptions = [];
    setTimeout(()=>{
     axios
            .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e}.json?access_token=pk.eyJ1IjoicHVsa2l0MDQwOSIsImEiOiJja3ZwMHF3cDAwdmlwMm9xaGdhZDEyYmppIn0.tnFpGKz1oAJyJsVadjvgEA`)
            .then((response) => {
              const info = response.data;
             info.features.map((x)=>{
               localeOptions= [...localeOptions,{
                 value : x.place_name,
                 lngLat: x.center
               }];
               setOptions(localeOptions);
               console.log(options);
             })
            });
          },200);
  }

  const onSelect = (e,o) => {
    console.log(e,o);
    if(e && e.lngLat){
    setViewport({...viewport,longitude : e.lngLat[0],latitude: e.lngLat[1]});
    changeMapMarker(e);
    }
  }

  const onFinish = (values) => {
    console.log('Success:', values);
    values.time = values.time.join();
    values.userID = JSON.parse(sessionStorage.getItem('userDetails')).id;
      axios
        .post(baseURL+'addslug', values
        )
        .then((response) => {
          if(response.status===200){
            alert('Data Added SuccessFully');
            history.push('/home');
          }
        });
  };
  return (
    <div style={{ height: "100%" }}>
      <Navbar />
      <div className="addition-page">
        <div className="left-pane">
        <Form
      name="basic"
      form={form}
      onFinish={onFinish}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
    >
      <Form.Item
        label="Parking Name"
        name="parkingName"
        rules={[
          {
            required: true,
            message: 'Please input your parkingName!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Area (in Sq.Ft.)"
        name="area"
        rules={[
          {
            required: true,
            message: 'Please input your parking area!',
          },
        ]}
      >
        <span>
      <InputNumber
        type="number"
        placeholder="Please input your parking area"
        style={{ width: '60%' }}
      />
      <Select
      placeholder="Please select the unit"
       style={{ width: '37%', marginLeft: '3%' }}
      >
        <Option value="rmb">ft<sup>2</sup></Option>
        <Option value="dollar">m<sup>2</sup></Option>
      </Select>
    </span>
      </Form.Item>

      <Form.Item
        label="Availibility Time"
        name="time"
        rules={[
          {
            required: true,
            message: 'Please select the availibility !',
          },
        ]}
      >
       <Select
          placeholder="Please select the availibility"
          allowClear
          onChange={(e)=>{checkTime(e)}}
          mode="multiple"
        >
          <Option value="weekdays">Weekdays(24*7)</Option>
          <Option value="weekends">Weekends(24*7)</Option>
          <Option value="office">Office Hours(09:00-18:00)</Option>
          <Option value="after">After Hours(18:00-09:00)</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      {otherTime && (  <span style={{display: 'flex',justifyContent: 'space-between'}}>
      <Form.Item
        label="Start Time"
        name="startTime"
        style={{ width: '48.5%' }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TimePicker format='HH:MM' />
      </Form.Item>

      <Form.Item
        label="End Time"
        name="endTime"
        style={{ width: '48.5%' }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TimePicker format='HH:MM' />
      </Form.Item>
        </span>)}
      <Form.Item
        label="Price"
        name="price"
        rules={[
          {
            required: true,
            message: 'Please input price !',
          },
        ]}
      >
       <Input
        placeholder="Please input price"
        suffix = "/hour"
        style={{ width: '100%' }}
      />
      </Form.Item>

      <Form.Item
        label="Search Address"
        name="search"
      > 
      <AutoComplete
    style={{
      width: '100%',
    }}
    options={options}
    placeholder="try to type `Delhi`"
    onSearch={(e)=>{getAddressUsingSearch(e)}}
    onSelect={(e,option)=>{onSelect(option)}}
    filterOption={(inputValue, option) =>
      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    }
  />
  </Form.Item>
      <Form.Item
        label="Address"
        name="address"
        style={{ width: '100%' }}
      >
      <TextArea placeholder="Please enter your address with landmark" allowClear />
      </Form.Item>
      
      <span style={{display: 'flex',justifyContent: 'space-between'}}>
      <Form.Item
        label="Latitude"
        name="latitude"
       
        style={{ width: '48.5%' }}
      >
      <Input
       readOnly={true}
      />
      </Form.Item>
      <Form.Item
        label="Longitude"
        name="longitude"
        
        style={{ width: '48.5%' }}
      >
      <Input
      readOnly={true}
      />
      </Form.Item>
      </span>

      <span style={{display: 'flex',justifyContent: 'space-between'}}>
      <Form.Item
        label="City"
        name="city"
       
        style={{ width: '48.5%' }}
      >
      <Input
       readOnly={true}
      />
      </Form.Item>
      <Form.Item
        label="Country"
        name="country"
        
        style={{ width: '48.5%' }}
      >
      <Input
      readOnly={true}
      />
      </Form.Item>
      </span>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
        </div>
        <div className="right-pane">
          <ReactMapGL
            {...viewport}
            width="100%"
            height="100%"
            onViewportChange={(nextViewport) => {setViewport(nextViewport);console.log(nextViewport)}}
            onClick={(e)=>{changeMapMarker(e)}}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxApiAccessToken={MAPBOX_TOKEN}
          >
            <GeolocateControl
              style={geolocateStyle}
              positionOptions={positionOptions}
              trackUserLocation
              showUserHeading
              onGeolocate={(e) => {
                getLocation(e);
              }}
              auto
            />
            <NavigationControl style={navControlStyle} />

            {locationData.points && (
              <Marker
                latitude={locationData.points[1]}
                longitude={locationData.points[0]}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <img src="https://img.icons8.com/fluency/48/000000/marker-a.png" />
              </Marker>
            )}
          </ReactMapGL>
        </div>
      </div>
    </div>
  );
}
