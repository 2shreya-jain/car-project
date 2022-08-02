import React from 'react';
import { shallow, render, mount } from 'enzyme';
import register from './register';

describe('register', () => {
  let props;
  let shallowregister;
  let renderedregister;
  let mountedregister;

  const shallowTestComponent = () => {
    if (!shallowregister) {
      shallowregister = shallow(<register {...props} />);
    }
    return shallowregister;
  };

  const renderTestComponent = () => {
    if (!renderedregister) {
      renderedregister = render(<register {...props} />);
    }
    return renderedregister;
  };

  const mountTestComponent = () => {
    if (!mountedregister) {
      mountedregister = mount(<register {...props} />);
    }
    return mountedregister;
  };  

  beforeEach(() => {
    props = {};
    shallowregister = undefined;
    renderedregister = undefined;
    mountedregister = undefined;
  });

  // Shallow / unit tests begin here
 
  // Render / mount / integration tests begin here
  
});
