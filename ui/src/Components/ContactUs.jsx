import React from 'react';

const ContactUs = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">Contact Us</h1>
      <p className="mb-4 text-lg">
        If you have any questions or feedback, please reach out to us at:
      </p>
      <ul className="list-disc list-inside mb-6 space-y-2 text-lg">
        <li>
          <strong>Email:</strong> support@peer2play.com
        </li>
        <li>
          <strong>Phone:</strong> +1 234 567 890
        </li>
        <li>
          <strong>Address:</strong> 123 Peer2Play Street, Blockchain City, 00000
        </li>
      </ul>
      <p className="mb-8">We look forward to hearing from you!</p>
      <p className="text-center font-semibold mb-8">Thank you for using our application!</p>
      <p className="text-center text-gray-500 text-sm">Peer2Play Team</p>
      <p className="text-center text-gray-400 text-xs mt-2">© 2023 Peer2Play. All rights reserved.</p>
    </div>
  );
};

export default ContactUs;
