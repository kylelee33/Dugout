import React, { Component } from "react";
import Slider from "react-slick";
import axios from "axios";
import moment from "moment";

import Typography from "@material-ui/core/Typography";


let todayDate = moment().format("L");

let gameUrl = `https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=${todayDate}`;
// let gameUrl = 'http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=04/18/2019'
export default class SimpleSlider extends Component {

  
    
  getGameInfo = () =>
    this.getGameAndLinescores().then(games => {
      this.setState(() => ({ games: games }));
    });

  getGames = () =>
    axios.get(gameUrl).then(response => response.data.dates[0].games);

  getGameLinescores = gameId =>
    axios
      .get(`https://statsapi.mlb.com//api/v1/game/${gameId}/linescore`)
      .then(response => response.data);

  getGameAndLinescores = () =>
    this.getGames().then(games =>
      Promise.all(
        games.map(game =>
          this.getGameLinescores(game.gamePk).then(linescores => ({
            ...game,
            linescores
          }))
        )
      )
    );

  state = {
    games: [],
    linescores: []
  };

  componentDidMount() {
    console.log(gameUrl);
    this.getGameInfo();
    this.interval = setInterval(this.getGameInfo, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const slideStyle = {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      height: "120px",
      padding: "10px",
      paddingBottom: "10px",
      paddingTop: "5px",
      backgroundColor: "#DDDDDD"
    };

    const awayTeamStyle = {
      display: "flex",
      flexDirection: "column",
      textAlign: "center"
    };

    const homeTeamStyle = {
      display: "flex",
      flexDirection: "column",
      textAlign: "center"
    };

    const scoreStyle = {
      width: "75%",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row"
    };

    const gameInfoStyle = {
      width: "100%",
      justifyContent: "center",
      textAlign: "center",
      display: "flex",
      flexDirection: "column"
    };

    const imgStyle = {
      maxWidth: "100%",
      height: "auto",
      borderStyle: "solid",
      borderRadius: "50%",
      borderWidth: "1px",
      borderColor: "gray",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
    };

    return (
      <div>
        <Slider {...settings}>
          {this.state.games.map((game, i) => {
            let utcTime = game.gameDate;
            let stillUtc = moment.utc(utcTime).toDate();
            let localTime = moment(stillUtc)
              .local()
              .format("h:mm A");

            return (
              <div key={i}>
                <div style={slideStyle}>
                  <div style={awayTeamStyle}>
                    <img
                      style={imgStyle}
                      src={require(`./Images/${game.teams.away.team.name}.png`)}
                    />
                    <Typography variant="caption" style={{ color: "black" }}>
                      {game.teams.away.leagueRecord.wins}-
                      {game.teams.away.leagueRecord.losses}
                    </Typography>
                  </div>
                  <div style={scoreStyle}>
                    <div>
                      <Typography variant="h3">
                        {game.teams.away.score}
                      </Typography>
                      <Typography variant="caption" style={{ fontSize: '0.6rem', verticalAlign: 'text-bottom' }}>{game.teams.away.team.name}</Typography>
                    </div>
                    <div style={gameInfoStyle}>
                      <p>
                        {game.status.detailedState == "In Progress" ? (
                          <div>
                            <Typography
                              variant="caption"
                              style={{ color: "black" }}
                            >
                              {game.linescores.isTopInning ? (
                                <p style={{ margin: "0px" }}>
                                  Top of inning {game.linescores.currentInning}
                                </p>
                              ) : (
                                <p style={{ margin: "0px" }}>
                                  Bottom of inning{" "}
                                  {game.linescores.currentInning}
                                </p>
                              )}
                            </Typography>
                            <Typography
                              variant="caption"
                              style={{ color: "black" }}
                            >
                              Balls: {game.linescores.balls} Strikes:{" "}
                              {game.linescores.strikes}
                            </Typography>
                            <Typography
                              variant="caption"
                              style={{ color: "black" }}
                            >
                              Outs: {game.linescores.outs}
                            </Typography>
                            <Typography variant="caption" style={{ color: "black" }}>
                              {game.linescores.defense.pitcher.fullName}{" "}
                              pitching to{" "}
                              {game.linescores.offense.batter.fullName}
                            </Typography>
                          </div>
                        ) : (
                          <Typography
                            variant="caption"
                            style={{ color: "black" }}
                          >
                            {game.status.detailedState}
                            <br />
                            {localTime}
                          </Typography>
                        )}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Typography variant="h3">
                        {" "}
                        {game.teams.home.score}
                      </Typography>
                      <Typography variant="caption" align="right" style={{ fontSize: '0.6rem' }}>{game.teams.home.team.name}</Typography>
                    </div>
                  </div>
                  <div style={homeTeamStyle}>
                    <img
                      style={imgStyle}
                      src={require(`./Images/${game.teams.home.team.name}.png`)}
                    />
                    <Typography variant="caption" style={{ color: "black" }}>
                      {game.teams.home.leagueRecord.wins}-
                      {game.teams.home.leagueRecord.losses}
                    </Typography>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    );
  }
}
