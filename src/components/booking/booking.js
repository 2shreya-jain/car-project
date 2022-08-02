import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./booking.scss";
import Navbar from "../navbar";
import { Tabs } from "antd";
import { Select } from "antd";
import { useHistory } from "react-router-dom";
import { Row, Col } from "antd";
import { List, Avatar } from "antd";
import myData from "./address.json";
import axios from "axios";
import moment from "moment";
import {
  Drawer,
  Form,
  Button,
  Input,
  DatePicker,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ReactMapGL, {
  NavigationControl,
  Popup,
  Marker,
  GeolocateControl,
} from "react-map-gl";
import * as turf from "@turf/turf";
const baseURL = "http://localhost:5000/api/";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoicHVsa2l0MDQwOSIsImEiOiJja3ZwMHF3cDAwdmlwMm9xaGdhZDEyYmppIn0.tnFpGKz1oAJyJsVadjvgEA";
let data = [];
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

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
function callback(key) {
  console.log(key);
}

let slugFlag = 0;




function handleChange(value) {
  let sdata = [];
  switch (value) {
    case "low":
      sdata = data.sort((a, b) => {
        return a.price - b.price;
      });
      data = [];
      data = sdata;
      break;
    case "high":
      sdata = data.sort((a, b) => {
        return b.price - a.price;
      });
      data = [];
      data = sdata;
      break;

    case "larea":
      sdata = data.sort((a, b) => {
        return b.area - a.area;
      });
      data = [];
      data = sdata;
      break;

    case "sarea":
      sdata = data.sort((a, b) => {
        return b.area - a.area;
      });
      data = [];
      data = sdata;
      break;

    case "ddsc":
      sdata = data.sort((a, b) => {
        return b.distance - a.distance;
      });
      data = [];
      data = sdata;
      break;

    case "dasc":
      sdata = data.sort((a, b) => {
        return b.distance - a.distance;
      });
      data = [];
      data = sdata;
      break;
    default:
      break;
  }
}



export default function Booking() {
  const history = useHistory()
  let displayData = [];
  const [form] = Form.useForm();
  const [popupInfo, setPopupInfo] = useState({ latitude: 0, longitude: 0 });
  const [locationData, locationInfo] = useState({});
  const [visible, setVisible] = useState(false);
  const [finishData, updateFinish] = useState({});
  
  const getDistance = (long, lat) => {
    data = [
      ...data.map((x) => {
        const from = turf.point([long, lat]);
        const to = turf.point([x.point[0], x.point[1]]);
        const options = { units: "miles" };
  
        const distance = turf.distance(from, to, options);
        x.distance = distance.toFixed(2);
        return x;
      }),
    ];
    return data;
  };
  const getData = (long, lat) => {
    axios.get(baseURL + "getslug").then((response) => {
      if (response.status === 200) {
        console.log("hello", response.data);
        response["data"].data.map((x) => {
          let obj = {
            id: x[0],
            slug: x[1],
            point: [+x[7], +x[6]],
            display_name: x[8],
            country: x[9],
            address: x[5],
            distance: null,
            price: x[4],
            area: x[2],
            availability: x[3],
            userid: x[10],
          };
          data.push(obj);
        });
        data = data.slice().reverse().filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i).reverse()
        return getDistance(long, lat);
      }
    });
  };
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  const onFinish = (values) => {
    console.log('Success:', values,finishData);
    let data = {start:values.start,end:values.end,...finishData};
    // values.time = values.time.join();
      axios
        .post(baseURL+'bookslug', data
        )
        .then((response) => {
          if(response.status===200){
            alert('Your parking is booked. you will find owner details in your order section');
            history.push('/home')
          }
        });
  };
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    longitude: -122.45,
    latitude: 41.35,
    zoom: 8,
  });
  const getLocation = (e) => {
    getData(e.coords.longitude, e.coords.latitude);
    return e;
  };
  const [dates, setDates] = useState([]);
  const [hackValue, setHackValue] = useState();
  const [value, setValue] = useState();
  const disabledDate = current => {
    const curr = moment().isBefore(current);
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
    return tooLate || curr;
  };

  const onOpenChange = open => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };

  const highLight = (item) => {
    locationInfo({
      slug: item.slug,
      name: item.display_name,
      distance: item.distance,
      points: item.point,
    });
    updateFinish({
      bookingid : ''+item.id,
      bookinguserid : item.userid,
      currentuserid : ''+JSON.parse(sessionStorage.getItem('userDetails')).id
    })
    setViewport({
      ...viewport,
      longitude: item.point[0],
      latitude: item.point[1],
    });
    setPopupInfo({
      longitude: item.point[0],
      latitude: item.point[1],
    });

    // setTimeout(() => {
    //   setPopupInfo({ latitude: 0, longitude: 0 });
    // }, 3000);
  };

  if (data) {
    return (
      <div style={{ height: "100%" }}>
        <Navbar />
        <div className="booking-page">
          <div className="left-pane">
            <div className="tabs-area">
              <Row style={{ width: "100%", padding: "0 10px" }}>
                <Col span={24}>
                  <label style={{ paddingLeft: 10 }}>Sort</label>
                  <Select
                    placeholder="Sort"
                    style={{ width: "100%", paddingLeft: 10 }}
                    onChange={handleChange}
                  >
                    <Option value="clear">Clear Sort</Option>
                    <Option value="low">Price : Low to High</Option>
                    <Option value="high">Price : High to Low</Option>
                    <Option value="larea">Larger Area First</Option>
                    <Option value="sarea">Smaller Area First</Option>
                    <Option value="ddesc">Distance(Descending)</Option>
                    <Option value="dasc">Distance(Ascending)</Option>
                  </Select>
                </Col>
              </Row>

              <Tabs
                defaultActiveKey="1"
                onChange={callback}
                style={{ position: "relative", paddingLeft: "10px" }}
              >
                <TabPane tab="Parking List" key="1">
                  <List
                    style={{ overflow: "auto", height: "calc(100vh - 178px)" }}
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                      <List.Item style={{ position: "relative" }}>
                        <List.Item.Meta
                          title={<a href="https://ant.design">{item.slug}</a>}
                          description={
                            <span className="description-list">
                              <p>{item.display_name}</p>
                              <p>
                                {item.area} ft<sup>2</sup>
                              </p>
                              <p>{item.distance} Miles</p>
                              <p
                                className="price"
                                onClick={() => {
                                  highLight(item);
                                }}
                              >
                                {item.price} Rs
                              </p>
                            </span>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </TabPane>
              </Tabs>
            </div>
          </div>
          <div className="right-pane">
            <ReactMapGL
              {...viewport}
              width="100%"
              height="100%"
              onViewportChange={(nextViewport) => setViewport(nextViewport)}
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
              {popupInfo && (
                <Popup
                  tipSize={5}
                  className="popupWindow"
                  anchor="top"
                  longitude={popupInfo.longitude}
                  latitude={popupInfo.latitude}
                  closeOnClick={false}
                  onClose={setPopupInfo}
                >
                  <div className="popupInfo">
                    <p>
                      <span>Name: </span>
                      {locationData.slug}
                    </p>
                    <p>
                      <span>City: </span>
                      {locationData.name}
                    </p>
                    <p>
                      <span>Distance: </span>
                      {locationData.distance}
                    </p>
                    <button onClick={showDrawer}>Book Now</button>
                  </div>
                </Popup>
              )}

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

        <Drawer title="Book Now" width={500} placement="right" onClose={onClose} visible={visible}>
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
        label="Start Time (DD/MM/YY HH:MM)"
        name="start"
        rules={[
          {
            required: true,
            message: 'Please input start date',
          },
        ]}
      >
        <span>
      <Input

        placeholder="Please input Start date"
        style={{ width: '100%' }}
      />
    </span>
      </Form.Item>

        <Form.Item
        label="End Time (DD/MM/YY HH:MM)"
        name="end"
        rules={[
          {
            required: true,
            message: 'Please input End date',
          },
        ]}
      >
        <span>
      <Input
        placeholder="Please input End date"
        style={{ width: '100%' }}
      />
    </span>
      </Form.Item>
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
      </Drawer>
      </div>
    );
  }
  return <div></div>;
}
