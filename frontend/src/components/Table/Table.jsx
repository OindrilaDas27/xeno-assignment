import React from 'react'
import styles from './Table.module.css'
import { useNavigate } from 'react-router-dom'

const Table = ({ tableData, type }) => {
    const navigate = useNavigate();
    return (
        <div className={styles.table}>
            {tableData.map((data) => (
            <div className={styles.contentDetails} key={data._id}>
                <h3>{type === 'campaign' ? data.title : data.name}</h3>
                <button onClick={() => {type=== "campaign" ? navigate(`/campaign/${data._id}`) : navigate('/campaign',  { state: { id: data._id } })}}>{type=== "campaign" ? "View Campaign Stats" : "Run a Campaign"}</button>
            </div>
            ))}
        </div>
    )
}

export default Table