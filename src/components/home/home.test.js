import React from 'react';
import { shallow, render, mount } from 'enzyme';
import home from './home';

describe('home', () => {
  let props;
  let shallowhome;
  let renderedhome;
  let mountedhome;

  const shallowTestComponent = () => {
    if (!shallowhome) {
      shallowhome = shallow(<home {...props} />);
    }
    return shallowhome;
  };

  const renderTestComponent = () => {
    if (!renderedhome) {
      renderedhome = render(<home {...props} />);
    }
    return renderedhome;
  };

  const mountTestComponent = () => {
    if (!mountedhome) {
      mountedhome = mount(<home {...props} />);
    }
    return mountedhome;
  };  

  beforeEach(() => {
    props = {};
    shallowhome = undefined;
    renderedhome = undefined;
    mountedhome = undefined;
  });

  // Shallow / unit tests begin here
 
  // Render / mount / integration tests begin here
  
});
