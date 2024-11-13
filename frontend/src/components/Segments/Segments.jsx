import React, { useState } from 'react'
import styles from './Segments.module.css'
import Dropdown from '../Dropdown/Dropdown'

const Segments = () => {
    const [totalSpendingComparator, setTotalSpendingComparator] = useState("Select Operators");
    const [logicalOperator, setLogicalOperator] = useState("Select Conjunction");
    const [visitComparator, setVisitComparator] = useState("Select Operators");
    const [totalSpending, setTotalSpending] = useState(undefined);
    const [totalVisits, setTtotalVists] = useState(undefined);

    const spendingComparatorHandle = (option) => {
        setTotalSpendingComparator(option);  // Update state with the selected option
        console.log("Selected Option: ", option)
    };
    const joiningHandle = (option) => {
        setLogicalOperator(option);  // Update state with the selected option
        console.log("Selected Option: ", option)
    };
    const visitComparatorHandle = (option) => {
        setVisitComparator(option);  // Update state with the selected option
        console.log("Selected Option: ", option)
    };

    const handleSegmentSubmit = (segment) => {
        segment.preventDefault();

        const segmentSummary = `Total Spending ${totalSpendingComparator} INR ${totalSpending} ${logicalOperator} visits ${visitComparator} ${totalVisits}`;

        console.log(segmentSummary)
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
        </div>
    )
}

export default Segments