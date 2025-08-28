import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const EthBalanceForm = () => {
    const [blockPosition, setBlockPosition] = useState('before');
    const [address, setAddress] = useState('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
    const [selectedDate, setSelectedDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            // Convert selected date to Unix timestamp
            const dateObj = new Date(selectedDate + 'T00:00:00Z');
            const timestamp = Math.floor(dateObj.getTime() / 1000);


            const url = `${process.env.NEXT_PUBLIC_API_URL}/account/eth-balance/${timestamp}/${address}/${blockPosition}`;

            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = address && selectedDate;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">ETH Balance Checker</h2>

                {/* Block Position Dropdown */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Closest block before or after the timestamp (default: before)
                    </label>
                    <select
                        value={blockPosition}
                        onChange={(e) => setBlockPosition(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        disabled={isLoading}
                    >
                        <option value="before">Before</option>
                        <option value="after">After</option>
                    </select>
                </div>

                {/* Address Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        The address to check for ETH balance at the block
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="0x..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        disabled={isLoading}
                    />
                </div>

                {/* Date Picker */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        The timestamp to check for ETH
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            disabled={isLoading}
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">
                        The selected date will be converted to Unix timestamp at 00:00 UTC
                    </p>
                </div>


                <button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className={`w-full py-2 px-4 rounded-md font-medium transition duration-150 ${
                        isLoading || !isFormValid
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
                    ) : (
                        'Check Balance'
                    )}
                </button>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">Error: {error}</p>
                    </div>
                )}

                {/* Response Display */}
                {response && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-600 font-medium mb-2">Response:</p>
                        <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
              {JSON.stringify(response.data, null, 2)}
            </pre>
                    </div>
                )}
            </form>
        </div>
    );
};

export default EthBalanceForm;
