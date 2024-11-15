import React, { useEffect, useState } from 'react'
import styles from './Campaigns.module.css'
import Dropdown from '../../components/Dropdown/Dropdown';
import axios from 'axios';
import { CREATE_CAMPAIGN_ENDPOINT, GET_SEGMENTS_ENDPOINT } from '../../utils/endpoints';
import { useLocation, useNavigate } from 'react-router-dom';

const Campaigns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;

  console.log("segment id: ", id);

  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(id || "Past Segments");
  const [campaignTitle, setCampaignTitle] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("");

  useEffect(() => {
    const fetchAllSegments = async () => {
      const response = await axios.get(GET_SEGMENTS_ENDPOINT);
      setSegments(response.data.Segments);
      console.log("Segments from fetch: ", segments)
    }
    fetchAllSegments();
  }, []);

  const selectSegmentHandle = (option) => {
    setSelectedSegment(option);
  }

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit triggered");

    if (selectedSegment === "Past Segments" || campaignTitle === "" || messageTemplate === "") {
      alert('One or more fields are missing. Please submit a valid campaign value');
      return;
    }

    try {
      const selectedSegmentObject = id ? segments.find(segment => segment._id === selectedSegment) : segments.find(segment => segment.name === selectedSegment);

      console.log("segment id: ", selectedSegmentObject._id)

      if (!selectedSegmentObject) {
        alert('Selected segment not found');
        return;
      }

      const campaignData = await axios.post(CREATE_CAMPAIGN_ENDPOINT,
        {
          title: campaignTitle,
          segmentId: selectedSegmentObject._id,
          messageTemplate: messageTemplate
        }
      );

      console.log("Campaign Data: ", campaignData);

      if (campaignData.status === 200) {
        alert("Campaign has been successfully created!");
        navigate(`/campaign/${campaignData.data.Campaign._id}`);
      } else {
        alert("Campaign unsuccessful");
      }
    } catch (error) {
      console.log("Error in creatign new campaign: ", error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.campaignForm}>
        <h3>Start a new Campaign</h3>
        <form onSubmit={(e) => handleCampaignSubmit(e)} className={styles.campaign}>
          <div className={styles.content}>
            <p>Segment - </p>
            {id ? <p>{selectedSegment}</p> :
              <Dropdown
                label={selectedSegment}
                options={segments.map((data) => (data.name))}
                onSelect={(option) => {
                  selectSegmentHandle(option)
                }}
                type="button"
              />}
          </div>
          <div className={styles.content}>
            <p>Campaign Title - </p>
            <input
              placeholder='Enter your Campaign Title'
              value={campaignTitle ? campaignTitle : ""}
              onChange={(e) => setCampaignTitle(e.target.value)}
            />
          </div>
          <div className={styles.msg}>
            <h3>Message Template - </h3>
            <p><span style={{ fontWeight: "700" }}>NOTE: </span>For personlised texts plase write &#123;name&#125; to the template</p>
            <textarea
              placeholder='Enter your Campaign Title'
              value={messageTemplate ? messageTemplate : ""}
              onChange={(e) => setMessageTemplate(e.target.value)}
            />
          </div>
          <div className={styles.btn_container}>
            <button type='submit'>Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Campaigns