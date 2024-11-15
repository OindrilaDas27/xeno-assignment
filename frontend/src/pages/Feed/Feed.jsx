import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import styles from './Feed.module.css';
import Table from '../../components/Table/Table';
import axios from 'axios';
import { GET_CAMPAIGN_ENDPOINT, GET_SEGMENTS_ENDPOINT } from '../../utils/endpoints';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
    const userName = localStorage.getItem('userName');
    const navigate = useNavigate();
    const [campaignData, setCampaignData] = useState([]);
    const [segments, setSegments] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const getCampignData = await axios.get(GET_CAMPAIGN_ENDPOINT);
                setCampaignData(getCampignData.data.Campaigns);
                console.log("Fetched Campaign Data: ", getCampignData.data.Campaigns)

                const getSegmentData = await axios.get(GET_SEGMENTS_ENDPOINT);
                setSegments(getSegmentData.data.Segments);
                console.log("Fetch all Segments: ",getSegmentData.data.Segments)
            } catch (error) {
                console.log("Error in fetching Data, ", error);
            }
        }
        getData()
    }, [])
    
    return (
        <div className={styles.container}>
            <div className={styles.components}>
                <div className={styles.campaigns}>
                    <div className={styles.topBar}>
                        <h2>Campaigns</h2>
                        <button onClick={() => {navigate('/campaign')}}>Create New</button>
                    </div>
                    <Table tableData={campaignData} type="campaign" />
                </div>
                <div className={styles.segments}>
                    <div className={styles.topBar}>
                        <h2>Segments</h2>
                        <button onClick={() => {navigate('/segment')}}>Create New</button>
                    </div>
                    <Table tableData={segments} type="segment" />
                </div>
            </div>
        </div>
    )
}

export default Feed