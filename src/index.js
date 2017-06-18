import * as axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';


function LocationDisplay(props) {
  return (<div className="weather-container text-center">
              <div className="weather-location">
                <span id="city">{props.city}</span>, 
                <span id="country"> {props.country}</span>
              </div>
          </div>);
}

function WeatherDisplay(props) {
    return (<div className="weather-status text-center">
              <p><span className="temp">{props.temp} &#176; </span><span className="unit" onClick={() => props.onClick()}>{props.unit}</span></p>
              <p><span className="desc">{props.desc}</span></p>
              <div className="icon"><img src={props.icon} alt="weather-icon"/></div>
            </div>
          );
}

class WeatherApp extends React.Component{
    constructor(props) { 
      super(props);
      this.state = {
        city: "",
        countryCode: "",
        temp: "",
        desc: "",
        weatherType: "",
        unit : "C",
        icon : ""
      };
      
    }
  
  componentDidMount() {
   axios.get("https://ipinfo.io/json")
            .then(result => 
                  {
                    this.setState({city: result.data.city,
                                   countryCode: result.data.country
                                  });
                    let city = result.data.city, countryCode = result.data.country;
                    return axios.get(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&units=metric&APPID=f39e6760557f597c5b5af18007651b00`);
                  }
                  )
                .then(result => {
                   this.setState({temp: result.data.main.temp,
                                  desc: result.data.weather[0].description,
                                  weatherType: result.data.weather[0].main
                              })
                    this.getIcon(this.state.weatherType);
                });
             
  }
  
  getIcon(weatherType) {
    let _weatherType = weatherType.toLowerCase();
    switch (_weatherType) {
      case 'drizzle':
        this.setState({icon: "http://openweathermap.org/img/w/09d.png"});
        break;
      case 'clouds':
        this.setState({icon: "http://openweathermap.org/img/w/03d.png"});
        break;
      case 'rain':
        this.setState({icon: "http://openweathermap.org/img/w/10d.png"});
        break;
      case 'snow':
        this.setState({icon: "http://openweathermap.org/img/w/13d.png"});
        break;
      case 'clear':
        this.setState({icon: "http://openweathermap.org/img/w/01d.png"});
        break;
      case 'thunderstom':
        this.setState({icon: "http://openweathermap.org/img/w/11d.png"});
        break;
      }
  }
  
  toggleUnit() {
    if (this.state.unit === 'C') {
      this.setState({temp : (this.state.temp * 9) / 5 + 32, unit : "F"});
    }
    else if (this.state.unit === 'F') {
      this.setState({temp: ((this.state.temp - 32) * (5 / 9)).toFixed(2), unit: "C"});
    }
  }
  
  render() {
    return (
    <div className="container">
      <div className="title">
        <h1 className="text-center">Weather App</h1>
      </div>

      <LocationDisplay city={this.state.city} country={this.state.countryCode}/>
    
      <WeatherDisplay temp={this.state.temp} desc={this.state.desc} icon={this.state.icon} 
        unit={this.state.unit} onClick={() => this.toggleUnit()}/>
    
    </div>);
  }
}

ReactDOM.render(<WeatherApp/>, document.getElementById('app'));

