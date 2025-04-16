import React from 'react';

// A simple Tab component to replace @headlessui/react Tab
const Tab = ({ children }) => {
  return <>{children}</>;
};

Tab.Group = ({ children }) => {
  return <div>{children}</div>;
};

Tab.List = ({ children }) => {
  return <div className="flex">{children}</div>;
};

Tab.Panels = ({ children }) => {
  return <div>{children}</div>;
};

Tab.Panel = ({ children }) => {
  return <div>{children}</div>;
};

export default Tab; 