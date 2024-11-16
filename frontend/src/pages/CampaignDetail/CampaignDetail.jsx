import React, { useEffect, useState } from 'react';
import styles from './CampaignDetail.module.css'
import axios from 'axios';
import { GET_CAMPAIGN_ENDPOINT, GET_SEGMENTS_ENDPOINT } from '../../utils/endpoints';
import { useParams } from 'react-router-dom';
import { PieChart } from '@mui/x-charts'

const CampaignDetail = () => {
    const { id } = useParams();
    const [campaignData, setCampaignData] = useState("");
    const [messages, setMessages] = useState([]);
    const [segmentDetails, setSegmentDetails] = useState("");

    useEffect(() => {
        const fetchCampaignDetails = async () => {
            const getData = await axios.get(`${GET_CAMPAIGN_ENDPOINT}/${id}`);
            const fetchedCampaignData = getData.data.campaign;
            setCampaignData(fetchedCampaignData);

            if (fetchedCampaignData.segmentId) {
                const segmentId = fetchedCampaignData.segmentId;
                console.log("Segment id: ", segmentId);
                const getSegment = await axios.get(`${GET_SEGMENTS_ENDPOINT}/${segmentId}`);
                setSegmentDetails(getSegment.data);
            }
            setMessages(getData.data.message.flat());
            console.log(getData.data);
            console.log("Messages: ", getData.data.message.flat())
        }
        fetchCampaignDetails();
    }, [])

    return (
        <div className={styles.campaignDetail}>
            <h1>{campaignData.title}</h1>
            <div className={styles.stats}>
                <div className={styles.content}>
                    <p className={styles.title}>Campaign Msg: </p>
                    <p className={styles.details}>{campaignData.messageTemplate}</p>
                </div>
                <div className={styles.content}>
                    <p className={styles.title}>Audience Size: </p>
                    <p className={styles.details}>{segmentDetails.customerSize}</p>
                </div>
                <div className={styles.content}>
                    <p className={styles.title}>Delivery Rate: </p>
                    <PieChart
                        colors={['#f77979', '#82ff58']}
                        series={[
                            {
                                data: [
                                    { value: campaignData.status, label: `${campaignData.status}% Success`, color: '#82ff58' },
                                    { value: 100 - campaignData.status, label: `${100 - campaignData.status}% Failure`, color: '#f77979' },
                                ],
                                innerRadius: 30,
                                cornerRadius: 8,
                                paddingAngle: 2
                            },
                        ]}
                        width={420}
                        height={200}
                    />
                </div>
            </div>
            <div className={styles.message_container}>
                <div className={styles.customer_heading} >
                    <div style={{ marginRight: "20%" }}>Message</div>
                    <div>Customer Name</div>
                    <div style={{ marginRight: "8rem" }}>Status</div>
                </div>
                <div className={styles.scroll}>
                    {messages.map((data) => (
                        <div className={styles.customer} key={data._id}>
                            <div>{data.message}</div>
                            <div style={{ marginLeft: "-10rem" }}>{data.customerName}</div>
                            <div>
                                <PieChart
                                    colors={['#f77979', '#82ff58']}
                                    series={[
                                        {
                                            data: [
                                                { value: data.status, color: '#82ff58' },
                                                { value: 100 - data.status, color: '#f77979' },
                                            ],
                                            // innerRadius: 20,
                                            cornerRadius: 2,
                                            paddingAngle: 1
                                        },
                                    ]}
                                    width={160}
                                    height={90}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CampaignDetail