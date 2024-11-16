import React, { useState } from 'react'
import styles from './Segments.module.css'
import Dropdown from '../../components/Dropdown/Dropdown'
import axios from 'axios';
import { CREATE_SEGMENT_ENDPOINT, GET_CUSTOMER_ENDPOINT } from '../../utils/endpoints';
import { useNavigate } from 'react-router-dom';

const Segments = () => {
    const navigate = useNavigate();

    const [totalSpendingComparator, setTotalSpendingComparator] = useState("Select Operators");
    const [logicalOperator, setLogicalOperator] = useState("Select Conjunction");
    const [visitComparator, setVisitComparator] = useState("Select Operators");
    const [totalSpending, setTotalSpending] = useState("");
    const [totalVisits, setTtotalVists] = useState("");
    const [customerData, setCustomerData] = useState([]);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [segmentName, setSegmentName] = useState("")

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
        console.log("Submit triggered");
    
        const segmentSummary = `totalSpending ${totalSpendingComparator} ${totalSpending} ${logicalOperator} orderCount ${visitComparator} ${totalVisits}`;
    
        console.log(segmentSummary);
    
        if (segmentSummary === "totalSpending Select Operators  Select Conjunction orderCount Select Operators ") {
            alert('Please submit a valid segment query');
            return;
        }
    
        try {
            const segmentData = await axios.post(CREATE_SEGMENT_ENDPOINT,
                {
                    name: segmentName,
                    query: segmentSummary,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
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
    
            const validCustomerIds = fetchSegmentCandidates.filter((id) => id !== null && id !== undefined);
    
            const customerProms = validCustomerIds.map((customerId) => (
                axios.get(`${GET_CUSTOMER_ENDPOINT}/${customerId}`)
            ));
    
            const customers = await Promise.all(customerProms.map((promise) => 
                promise.catch((err) => {
                    console.error(`Error in customer data: ${err.message}`);
                    return null; 
                })
            ));
    
            const customerDetails = customers.filter((data) => data !== null).map((response) => response.data);
    
            setCustomerData(customerDetails);
        } catch (error) {
            console.log("Error in submitting segment: ", error);
        }
    };    

    return (
        <div className={styles.segments}>
            <h1>Create A New Segment</h1>
            <form onSubmit={(e) => handleSegmentSubmit(e)} className={styles.create_segments}>
                <div className={styles.name}>
                    <h3>Name - </h3>
                    <input
                        type="text"
                        placeholder='Enter a valid segment name'
                        label="Segment Name"
                        onChange={(e) => {
                            setSegmentName(e.target.value)
                        }}
                    />
                </div>
                <div className={styles.writeSegments}>
                    <div className={styles.sentence}>
                        <p>Customers with </p>
                        <span>Total Spending</span>
                        <div>
                            <Dropdown
                                label={totalSpendingComparator}
                                options={[">", "<", "=", ">=", "<="]}
                                onSelect={(option) => {
                                    spendingComparatorHandle(option)
                                }}
                                type="button"
                            />
                        </div>
                        <span>INR</span>
                        <input
                            placeholder='Enter the target spending'
                            label="Total Spending"
                            value={totalSpending ? totalSpending : ""}
                            onChange={(e) => setTotalSpending(e.target.value)}
                        />
                        <div>
                            <Dropdown
                                label={logicalOperator}
                                options={["AND", "OR"]}
                                onSelect={(option) => {
                                    joiningHandle(option)
                                }}
                                type="button"
                            />
                        </div>
                        <span>visits</span>
                        <div>
                            <Dropdown
                                label={visitComparator}
                                options={[">", "<", "=", ">=", "<="]}
                                onSelect={(option) => {
                                    visitComparatorHandle(option)
                                }}
                                type="button"
                            />
                        </div>
                        <input placeholder='Enter number of visits'
                            label="Total Visits"
                            value={totalVisits ? totalVisits : ""}
                            onChange={(e) => setTtotalVists(e.target.value)}
                        />
                    </div>
                    <div className={styles.btn_container}>
                        <button type='submit'>Save</button>
                    </div>
                </div>
            </form>
            <div style={{ width: "100%", height: "2rem", borderBottom: "1px solid #509ee3", marginBottom: "2rem" }} />
            <div className={styles.segment_output}>
                <div className={styles.topBar}>
                    <p>Total Customers for the segment: <span>{totalCustomers}</span></p>
                    {totalCustomers !== 0 ?
                        <button onClick={() => {navigate('/campaign')}}>Create New Campaign</button>
                        :
                        <></>
                    }
                </div>
                <div className={styles.content}>
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
        </div>
    )
}

export default Segments