import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';

const TransactionHistoryForm = () => {
    const [formData, setFormData] = useState({
        sort: 'asc',
        offset: 20,
        page: 1,
        endBlock: 23196430,
        startBlock: 22214120,
        address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
    });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [metadata, setMetadata] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchData = async (params) => {
        const { address, startBlock, endBlock, page, offset, sort } = params;
        const url = `${process.env.NEXT_PUBLIC_API_URL}/account/txlist/${address}/${startBlock}/${endBlock}/${page}/${offset}/${sort}`;

        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (err) {
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);
        setHasSearched(true);

        try {
            const data = await fetchData(formData);
            setResponse(data);
            if (data.success && data.data) {
                setTableData(data.data.transactions || []);
                setMetadata(data.data.metadata);
                setCurrentPage(formData.page);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePagination = async (newPage) => {
        if (!metadata) return;

        setLoading(true);
        setError(null);


        const paginationParams = {
            ...formData,
            page: newPage
        };

        try {
            const data = await fetchData(paginationParams);
            if (data.success && data.data) {
                setTableData(data.data.transactions || []);
                setMetadata(data.data.metadata);
                setCurrentPage(newPage);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Table column definitions with all fields
    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor('blockNumber', {
            header: 'Block',
            cell: info => (
                <span className="font-mono text-sm ">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('timeStamp', {
            header: 'Age',
            cell: info => {
                const date = new Date(info.getValue());
                const now = new Date();
                const diffMs = now - date;
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                return (
                    <span className="text-sm text-gray-600" title={date.toLocaleString()}>
                        {diffDays > 0 ? `${diffDays}d ${diffHours}h ago` : `${diffHours}h ago`}
                    </span>
                );
            }
        }),
        columnHelper.accessor('hash', {
            header: 'Txn Hash',
            cell: info => (
                <a className="font-mono text-xs text-blue-600 hover:text-blue-800 cursor-pointer" href={`https://etherscan.io/tx/${info.getValue()}`} target="_blank" title={info.getValue()}>
                    {info.getValue().slice(0, 10)}...{info.getValue().slice(-8)}
                </a>
            )
        }),
        columnHelper.accessor('nonce', {
            header: 'Nonce',
            cell: info => <span className="text-sm">{info.getValue()}</span>
        }),
        columnHelper.accessor('transactionIndex', {
            header: 'Index',
            cell: info => <span className="text-sm">{info.getValue()}</span>
        }),
        columnHelper.accessor('blockHash', {
            header: 'Block Hash',
            cell: info => (
                <span className="font-mono text-xs text-gray-600" title={info.getValue()}>
                    {info.getValue().slice(0, 8)}...
                </span>
            )
        }),
        columnHelper.accessor('from', {
            header: 'From',
            cell: info => (
                <span className="font-mono text-xs text-blue-600 hover:text-blue-800 cursor-pointer" title={info.getValue()}>
                    {info.getValue().slice(0, 6)}...{info.getValue().slice(-4)}
                </span>
            )
        }),
        columnHelper.accessor('to', {
            header: 'To',
            cell: info => (
                <span className="font-mono text-xs text-blue-600 hover:text-blue-800 cursor-pointer" title={info.getValue()}>
                    {info.getValue() ? `${info.getValue().slice(0, 6)}...${info.getValue().slice(-4)}` : '-'}
                </span>
            )
        }),
        columnHelper.accessor('valueEth', {
            header: 'Value (ETH)',
            cell: info => (
                <span className="font-semibold text-sm">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('gas', {
            header: 'Gas Limit',
            cell: info => (
                <span className="text-sm text-gray-600">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('gasUsed', {
            header: 'Gas Used',
            cell: info => (
                <span className="text-sm">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('gasPrice', {
            header: 'Gas Price (wei)',
            cell: info => (
                <span className="text-sm text-gray-600">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('cumulativeGasUsed', {
            header: 'Cumulative Gas Used',
            cell: info => (
                <span className="text-sm text-gray-600">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('isError', {
            header: 'Status',
            cell: info => (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    !info.getValue()  ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {!info.getValue()  ? 'Success' : 'Failed'}
                </span>
            )
        }),
        columnHelper.accessor('txReceiptStatus', {
            header: 'Receipt',
            cell: info => (
                <span className={`text-xs ${info.getValue() ? 'text-green-600' : 'text-red-600'}`}>
                    {info.getValue() ? '✓' : '✗'}
                </span>
            )
        }),
        columnHelper.accessor('functionName', {
            header: 'Function',
            cell: info => (
                <span className="text-xs text-gray-600" title={info.getValue()}>
                    {info.getValue() ?
                        (info.getValue().length > 20 ? `${info.getValue().slice(0, 20)}...` : info.getValue())
                        : '-'
                    }
                </span>
            )
        })
    ];

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">ETH Transaction Viewer</h2>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort
                        </label>
                        <select
                            name="sort"
                            value={formData.sort}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="asc">asc</option>
                            <option value="desc">desc</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Transactions per page
                        </label>
                        <input
                            type="number"
                            name="offset"
                            value={formData.offset}
                            onChange={handleInputChange}
                            required
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start block
                        </label>
                        <input
                            type="number"
                            name="startBlock"
                            value={formData.startBlock}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End block
                        </label>
                        <input
                            type="number"
                            name="endBlock"
                            value={formData.endBlock}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                        </span>
                    ) : (
                        'Fetch Transactions'
                    )}
                </button>
            </form>

            {/* Error Display! */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Empty response! */}
            {hasSearched && !loading && tableData.length === 0 && !error && (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden p-12">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No transactions found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No transactions were found for address <span className="font-mono">{formData.address}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            in blocks {formData.startBlock} to {formData.endBlock}
                        </p>
                        <div className="mt-6">
                            <p className="text-sm text-gray-600 mb-2">Try adjusting your search parameters:</p>
                            <ul className="text-sm text-gray-500 space-y-1">
                                <li>• Check if the address is correct</li>
                                <li>• Expand the block range</li>
                                <li>• Verify the address has transactions in this range</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}


            {tableData.length > 0 && (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
                            {metadata && (
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span>
                                        <strong>Address:</strong> {metadata.address.slice(0, 10)}...{metadata.address.slice(-8)}
                                    </span>
                                    <span>
                                        <strong>Blocks:</strong> {metadata.blockRange.start} - {metadata.blockRange.end}
                                    </span>
                                    <span>
                                        <strong>Total:</strong> {metadata.count} transactions
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table Container  */}
                    <div className="relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-70 z-20 flex items-center justify-center">
                                <div className="text-center">
                                    <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="text-gray-600">Loading transactions...</p>
                                </div>
                            </div>
                        )}


                        <div className="max-h-[600px] overflow-auto">
                            <table className={`min-w-full divide-y divide-gray-200 ${loading ? 'opacity-50' : ''}`}>
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing page <strong>{currentPage}</strong> with{' '}
                                <strong>{tableData.length}</strong> transactions
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePagination(currentPage - 1)}
                                    disabled={loading || !metadata || currentPage <= 1}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePagination(currentPage + 1)}
                                    disabled={loading || !metadata || tableData.length < metadata.pagination.offset}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionHistoryForm;