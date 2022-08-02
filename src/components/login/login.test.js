import React from 'react';
import { shallow, render, mount } from 'enzyme';
import login from './login';

describe('login', () => {
  let props;
  let shallowlogin;
  let renderedlogin;
  let mountedlogin;

  const shallowTestComponent = () => {
    if (!shallowlogin) {
      shallowlogin = shallow(<login {...props} />);
    }
    return shallowlogin;
  };

  const renderTestComponent = () => {
    if (!renderedlogin) {
      renderedlogin = render(<login {...props} />);
    }
    return renderedlogin;
  };

  const mountTestComponent = () => {
    if (!mountedlogin) {
      mountedlogin = mount(<login {...props} />);
    }
    return mountedlogin;
  };  

  beforeEach(() => {
    props = {};
    shallowlogin = undefined;
    renderedlogin = undefined;
    mountedlogin = undefined;
  });

  // Shallow / unit tests begin here
 
  // Render / mount / integration tests begin here
  
});
