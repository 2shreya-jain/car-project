import React from 'react';
import { shallow, render, mount } from 'enzyme';
import booking from './booking';

describe('booking', () => {
  let props;
  let shallowbooking;
  let renderedbooking;
  let mountedbooking;

  const shallowTestComponent = () => {
    if (!shallowbooking) {
      shallowbooking = shallow(<booking {...props} />);
    }
    return shallowbooking;
  };

  const renderTestComponent = () => {
    if (!renderedbooking) {
      renderedbooking = render(<booking {...props} />);
    }
    return renderedbooking;
  };

  const mountTestComponent = () => {
    if (!mountedbooking) {
      mountedbooking = mount(<booking {...props} />);
    }
    return mountedbooking;
  };  

  beforeEach(() => {
    props = {};
    shallowbooking = undefined;
    renderedbooking = undefined;
    mountedbooking = undefined;
  });

  // Shallow / unit tests begin here
 
  // Render / mount / integration tests begin here
  
});
