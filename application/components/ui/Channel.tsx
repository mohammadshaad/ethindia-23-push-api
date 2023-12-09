// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";


interface ChannelProps {
  signer: any; // Adjust the type of signer based on your application
}

const Channel: React.FC<ChannelProps> = ({ signer }) => {
  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    icon: ''
    // delegateAddresses: null,
  });

  // State to    added delegates
  // const [addedDelegates, setAddedDelegates] = useState([]);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  // Function to handle form submission
  const handleSubmit = async () => {
    const push_signer = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
    try {
      if (signer) {
        const response = await push_signer.channel.create({
          name: formData.name,
          description: formData.description,
          url: formData.url,
          icon: formData.icon
        });
        console.log("Channel Created", response);
        // Rest of your code...
      } else {
        console.error('Signer or signer.channel.create is undefined');
      }
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  };

  // useEffect to log the form data whenever it changes (for debugging purposes)
  useEffect(() => {
    console.log('Form Data:', formData);
  }, [formData]);

  useEffect(() => { handleSubmit }, [signer]);

  // useEffect to log the added delegates whenever it changes (for debugging purposes)
  // useEffect(() => {
  //   console.log('Added Delegates:', addedDelegates);
  // }, [addedDelegates]);

  return (
    <div className="flex flex-col items-center">
      <label className="mb-2" htmlFor="name">
        Channel Name:
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="border p-2 mb-4"
      />

      <label className="mb-2" htmlFor="description">
        Channel Description:
      </label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        className="border p-2 mb-4"
      />

      <label className="mb-2" htmlFor="url">
        URL
      </label>
      <textarea
        id="url"
        name="url"
        value={formData.url}
        onChange={handleInputChange}
        className="border p-2 mb-4"
      />

      <label className="mb-2" htmlFor="icon">
        ICON
      </label>
      <textarea
        id="icon"
        name="icon"
        value={formData.icon}
        onChange={handleInputChange}
        className="border p-2 mb-4"
      />


      {/* <label className="mb-2" htmlFor="delegateAddresses">
                Delegate Addresses (comma-separated):
              </label>
              <input
                type="text"
                id="delegateAddresses"
                name="delegateAddresses"
                value={formData.delegateAddresses}
                onChange={handleInputChange}
                className="border p-2 mb-4"
              /> */}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
};

export default Channel;
