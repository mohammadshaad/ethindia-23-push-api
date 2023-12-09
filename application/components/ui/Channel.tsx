import React, { useState, useEffect } from 'react';
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";


const Channel = () => {
  const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    delegateAddresses: '',
  });

  // State to hold added delegates
  const [addedDelegates, setAddedDelegates] = useState([]);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Assuming userAlice.channel.create is an asynchronous function
      const response = await userAlice.channel.create({
        name: formData.name,
        description: formData.description,
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
        url: "https://push.org",
      });

      // Handle the response or any additional logic here
      console.log(response);

      // Add delegates if provided
      if (formData.delegateAddresses) {
        const addresses = formData.delegateAddresses.split(',');
        const delegatePromises = addresses.map(async (address) => {
          const addedDelegate = await userAlice.channel.delegate.add(
            `eip155:11155111:${address.trim()}`,
          );
          return addedDelegate;
        });

        // Wait for all delegate additions to complete
        const addedDelegatesResult = await Promise.all(delegatePromises);

        // Update the addedDelegates state
        setAddedDelegates(addedDelegatesResult);
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

  // useEffect to log the added delegates whenever it changes (for debugging purposes)
  useEffect(() => {
    console.log('Added Delegates:', addedDelegates);
  }, [addedDelegates]);

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

      <label className="mb-2" htmlFor="delegateAddresses">
        Delegate Addresses (comma-separated):
      </label>
      <input
        type="text"
        id="delegateAddresses"
        name="delegateAddresses"
        value={formData.delegateAddresses}
        onChange={handleInputChange}
        className="border p-2 mb-4"
      />

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
