import React, { useState, useEffect } from "react";
import API from "./../utils/API";
import Container from "../components/Container";
import insightAPI from "./../utils/insightAPI";
import LoadingIndicator from "../components/LoadingIndicator";
import { Link } from "react-router-dom";
import ModalComp from "../components/Modal/Modal";
import Task from "../components/Form/taskCard";
import { trackPromise } from "react-promise-tracker";
import TaskInfoModal from "../components/Modal/TaskInfoModal";
import { useAuth } from "../utils/auth";
import WeatherInfoModal from "../components/Modal/WeatherInfo";
import "./style.css";

function Profile() {
  const [username, setUsername] = useState("");
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showTaskInfoModal, setShowTaskInfoModal] = useState(false);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    loadForecast();
  }, []);

  //trackPromise sets the loading indicator while data is fetched.
  function loadForecast() {
    trackPromise(
      insightAPI.getForecast().then((res) => {
        const forecastData = Object.entries(res.data);
        setForecast(forecastData);
        // console.log(res.data);
      })
    ).catch((err) => console.log(err));
  }

  useEffect(() => {
    trackPromise(
      API.getUser(user.id).then((res) => {
        setUsername(res.data.username);
      })
    );
  }, [user]);

  const handleTaskSaved = () => {
    setShowModal(true);
  };

  const handleTaskInfoModal = () => {
    setShowTaskInfoModal(true);
  };

  const handleWeatherModal = () => {
    setShowWeatherModal(true);
  };

  return (
    // Header Start
    <Container>
      <h1>SPACEBOOK</h1>
      <div className="card mb-3 text-center clear-card">
        <div className="card-body welcome-banner">
          Greetings! <br />
          {username}
          <LoadingIndicator />
        </div>
      </div>
      <div className="mb-3 row justify-content-around">
        <Link to="/forecast">
          <button type="button" className="btn btn-primary btn-sm styledBtn">
            Forecast
          </button>
        </Link>
        <Link to="/task">
          <button type="button" className="btn btn-primary btn-sm styledBtn">
            Tasks
          </button>
        </Link>
        <Link to="/roverphotos">
          <button type="button" className="btn btn-primary btn-sm styledBtn">
            Rover
          </button>
        </Link>
      </div>
    
      {/* Weather Start */}
      {showWeatherModal && (
        <WeatherInfoModal onHide={() => setShowWeatherModal(false)} />
      )}

      <h2>
        Today's Weather{" "}
        <button
          type="button"
          className="btn btn-dark"
          title="More information"
          onClick={(event) => {
            handleWeatherModal();
            event.preventDefault();
          }}
        >
          ?
        </button>
      </h2>
      {forecast.slice(0, 1).map((data) => {
        const marsDay = data[0];
        const min = data[1].AT?.mn;
        const max = data[1].AT?.mx;
        const season = data[1].Season;
        const earthDay = data[1].First_UTC;
        // console.log("data:" + data);

        const formatDate = (date) =>
          date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        const earthDate = earthDay
          ? formatDate(new Date(earthDay))
          : "Data Currently Unavailable";

        const marsMax = max ? max.toFixed(2) : "N/A";
        const marsMin = min ? min.toFixed(2) : "N/A";

        const marsMaxF = max ? ((marsMax * 9) / 5 + 32).toFixed(2) : "N/A";
        const marsMinF = min ? ((marsMin * 9) / 5 + 32).toFixed(2) : "N/A";

        return (
          <div className="card mb-3 clear-card" key={marsDay}>
            <div className="card-body">
              <LoadingIndicator />
              <p>Season: {season ? season : "Data Currently Unavailable"}</p>
              <p>Earth Day: {earthDate}</p>
              <p>Martian Sol: {marsDay ? marsDay : "N/A"}</p>
              <p>
                High Temp: {marsMax} °C | {marsMaxF} °F
              </p>
              <p>
                Low Temp: {marsMin} °C | {marsMinF} °F
              </p>
            </div>
          </div>
        );
      })}

      {/* Tasks Start */}
      {showTaskInfoModal && (
        <TaskInfoModal onHide={() => setShowTaskInfoModal(false)} />
      )}

      <h2>
        Quickly Add a Task{" "}
        <button
          type="button"
          className="btn btn-dark"
          title="More information"
          onClick={(event) => {
            handleTaskInfoModal();
            event.preventDefault();
          }}
        >
          ?
        </button>
      </h2>
      <Task onTaskSaved={handleTaskSaved} />
      {showModal && <ModalComp onHide={() => setShowModal(false)} />}
    </Container>
  );
}

export default Profile;
