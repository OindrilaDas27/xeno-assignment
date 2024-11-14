import React, { useState } from 'react'
import styles from './Segments.module.css'
import Dropdown from '../Dropdown/Dropdown'
import axios from 'axios';
import { CREATE_SEGMENT_ENDPOINT, GET_CUSTOMER_BY_ID_ENDPOINT } from '../../utils/endpoints';

const Segments = () => {
    const [totalSpendingComparator, setTotalSpendingComparator] = useState("Select Operators");
    const [logicalOperator, setLogicalOperator] = useState("Select Conjunction");
    const [visitComparator, setVisitComparator] = useState("Select Operators");
    const [totalSpending, setTotalSpending] = useState("");
    const [totalVisits, setTtotalVists] = useState("");
    const [customerData, setCustomerData] = useState([]);
    const [totalCustomers, setTotalCustomers] = useState("");

    const spendingComparatorHandle = (option) => {
        setTotalSpendingComparator(option);
        console.log("Selected Option: ", option)
    };
    const joiningHandle = (option) => {
        setLogicalOperator(option);
        console.log("Selected Option: ", option)
    };
    const visitComparatorHandle = (option) => {
        setVisitComparator(option);
        console.log("Selected Option: ", option)
    };

    const handleSegmentSubmit = async (segment) => {
        segment.preventDefault();

        const segmentSummary = `totalSpending ${totalSpendingComparator} ${totalSpending} ${logicalOperator} orderCount ${visitComparator} ${totalVisits}`;

        console.log(segmentSummary)

        try {
            if (segmentSummary === "totalSpending Select Operators  Select Conjunction orderCount Select Operators ") {
                alert('Please submit a valid segement query')
            } else {
                const segmentData = await axios.post(CREATE_SEGMENT_ENDPOINT, 
                    { query: segmentSummary },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                );
                console.log(segmentData.data);
                const fetchSegmentCandidates = segmentData.data.saveSegment.customerIds || [];
                setTotalCustomers(segmentData.data.saveSegment.customerSize);
                console.log(fetchSegmentCandidates);

                if (fetchSegmentCandidates.length === 0) {
                    alert("No customers found for this segment.");
                    return;
                }

                const customerProms = fetchSegmentCandidates.map((customerId) => (
                    axios.get(`${GET_CUSTOMER_BY_ID_ENDPOINT}/${customerId}`)
                ));

                const customers = await Promise.all(customerProms);
                const customerDetails = customers.map(response => response.data);

                setCustomerData(customerDetails);
            }
        } catch (error) {
            console.log("Error in submitting segment: ", error);
        }
    };

    return (
        <div className={styles.segments}>
            <form onSubmit={(e) => handleSegmentSubmit(e)} className={styles.create_segments}>
                <div className={styles.sentence}>
                    <p>Customers with </p>
                    <span>Total Spending</span>
                    <Dropdown
                        label={totalSpendingComparator}
                        options={[">", "<", "=", ">=", "<="]}
                        onSelect={spendingComparatorHandle}
                    />
                    <span>INR</span>
                    <input
                        placeholder='Enter the target spending'
                        label="Total Spending"
                        value={totalSpending ? totalSpending : ""}
                        onChange={(e) => setTotalSpending(e.target.value)}
                    />
                    <Dropdown
                        label={logicalOperator}
                        options={["AND", "OR"]}
                        onSelect={joiningHandle}
                    />
                    <span>visits</span>
                    <Dropdown
                        label={visitComparator}
                        options={[">", "<", "=", ">=", "<="]}
                        onSelect={visitComparatorHandle}
                    />
                    <input placeholder='Enter number of visits'
                        label="Total Visits"
                        value={totalVisits ? totalVisits : ""}
                        onChange={(e) => setTtotalVists(e.target.value)}
                    />
                </div>
                <div className={styles.btn_container}>
                    <button type='submit'>Submit</button>
                </div>
            </form>
            <div style={{ width: "100%", height: "2rem", borderBottom: "1px solid #000", marginBottom: "2rem" }} />
            <div className={styles.segment_output}>
                <p>Total Customers for the segment: <span>{totalCustomers}</span></p>
                {customerData.map((customer, index) => (
                    <div key={index} className={styles.customer_details}>
                        <p>Customer Name: {customer.name}</p>
                        <div className={styles.data}>
                            <p>Total Spending: <span>INR {customer.totalSpending}</span></p>
                            <p>Total Orders: <span>{customer.countVisits}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Segments