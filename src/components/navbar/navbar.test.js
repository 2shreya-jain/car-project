import React from 'react';
import { shallow, render, mount } from 'enzyme';
import navbar from './navbar';

describe('navbar', () => {
  let props;
  let shallownavbar;
  let renderednavbar;
  let mountednavbar;

  const shallowTestComponent = () => {
    if (!shallownavbar) {
      shallownavbar = shallow(<navbar {...props} />);
    }
    return shallownavbar;
  };

  const renderTestComponent = () => {
    if (!renderednavbar) {
      renderednavbar = render(<navbar {...props} />);
    }
    return renderednavbar;
  };

  const mountTestComponent = () => {
    if (!mountednavbar) {
      mountednavbar = mount(<navbar {...props} />);
    }
    return mountednavbar;
  };  

  beforeEach(() => {
    props = {};
    shallownavbar = undefined;
    renderednavbar = undefined;
    mountednavbar = undefined;
  });

  // Shallow / unit tests begin here
 
  // Render / mount / integration tests begin here
  
});
