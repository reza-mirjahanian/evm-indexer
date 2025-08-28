"use client"; // This is a client component
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {useState} from "react";
import EthBalanceForm from "@/app/components/EthBalanceForm";
import TransactionHistoryForm from "@/app/components/TransactionHistoryForm";
import TransactionTokenTransfer from "@/app/components/TransactionTokenTransfer";
export default function Home() {
    const [activeTab, setActiveTab] = useState("tab1");
  return (
        <div className={styles.container}>
            <Head>
                <title>EVM Web Client | By Reza Mirjahan</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main }>
                <h4 className={styles.title}>
                    EVM Web Client
                </h4>


                <div className="w-full  mt-10">
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-300">
                        {[
                            { id: "tab1", label: "Account Balance (ETH)" },
                            { id: "tab2", label: "Account TX History" },
                            { id: "tab3", label: "ERC20 TX History" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 text-sm font-medium transition-colors duration-200 
              ${
                                    activeTab === tab.id
                                        ? "border-b-2 border-blue-500 text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 bg-white shadow-md rounded-b-2xl">
                        {activeTab === "tab1" && (
                            <div>
                                <p  className="text-gray-600">Given a date in YYYY-MM-DD format, the program should return the exact value of ETH that was available on the given address at YYYY-MM-DD 00:00 UTC time.</p>
                                <EthBalanceForm/>
                            </div>
                        )}

                        {activeTab === "tab2" && (
                            <div>

                                <TransactionHistoryForm/>
                            </div>
                        )}

                        {activeTab === "tab3" && (
                            <div>
                                <TransactionTokenTransfer/>
                            </div>
                        )}
                    </div>
                </div>




            </main>

            <footer className={styles.footer}>
                Reza Mir
            </footer>
        </div>
    );

}
