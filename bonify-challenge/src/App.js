import React, { Component } from 'react';
import $ from 'jquery';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      recommendations: [],
      participants: [],
      name: '',
      optVenue: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.addParticipant = this.addParticipant.bind(this);
  }


  onChange(e) {
    console.log('onChange', e.target.name)
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addParticipant() {
    const participantsArr = this.state.participants;
    console.log(participantsArr);
    console.log('this.state');
    console.log(this.state)
    participantsArr.push({
      name: this.state.name,
      option: this.state.optVenue,
      isVoteAdd: false
    })
    this.state.recommendations.map((venue, i) => {
      console.log(i)
      this.state.participants.map(participant => {
        console.log('this.participant>> ', participant.option, i);
        if (participant.option == i && !participant.isVoteAdd) {
          venue.optedBy += 1;

          participant.isVoteAdd = true;
          console.log(venue.optedBy);
        }
      });
    });

    // Winning Venue
    var max = this.state.recommendations.reduce(function (prev, current) {
      return (prev.optedBy > current.optedBy) ? prev : current
    });
    console.log(max);
    this.state.recommendations.map((venue, i) => {
      if (venue.id == max.id) {
        venue.winner = 'winner';
      } else {
        venue.winner = null;
      }
    });

    console.log(this.state.recommendations);
    this.setState({
      participants: participantsArr
    })
  }

  onSearch() {
    this.state.recommendations = [];
    this.state.participants = [];
    const params = {
      client_id: 'MXP2AOYXZUZZQNWKPJNFJ2JFQR1ZPJDIH5KCCWQ55M3X3HST',
      client_secret: '4RNK0TPMNTVLULMPXE34E0UYJFOWHYWUTHB2U1VQROIX4BCM',
      near: `${this.state.searchInput}`,
      query: 'lunch',
      v: '20190724',
      limit: 3
    }
    // Get most popular 3 venues based on the geo code 
    const urlParam = 'https://api.foursquare.com/v2/venues/search?' + new URLSearchParams(params);
    console.log(urlParam);
    $.ajax({
      method: 'GET',
      url: urlParam,
      success: ((result) => {
        if (result.response.venues) {

          result.response.venues.forEach(venue => {
            const params = {
              client_id: 'MXP2AOYXZUZZQNWKPJNFJ2JFQR1ZPJDIH5KCCWQ55M3X3HST',
              client_secret: '4RNK0TPMNTVLULMPXE34E0UYJFOWHYWUTHB2U1VQROIX4BCM',
              v: '20190724',
            }
            // Get venue specific details like URL, Category and Rating for each venue
            const getVenueDetails = 'https://api.foursquare.com/v2/venues/' + venue.id + '?' + new URLSearchParams(params);
            console.log(getVenueDetails);

            $.ajax({
              method: 'GET',
              url: getVenueDetails,
              success: ((result) => {
                const venues = this.state.recommendations;
                const venueResponse = result.response.venue;
                if (venueResponse) {
                  venues.push({
                    'id': venue.id,
                    'name': venue.name,
                    'category': venueResponse.categories[0] ? venueResponse.categories[0].name : '',
                    'url': venueResponse.url,
                    'rating': venueResponse.rating,
                    'optedBy': 0,
                    'winner': null

                  });
                  console.log(venues);
                  this.setState({
                    recommendations: venues
                  })
                }
              }),
              error: ((error) => {
                console.log(error);
              })
            });
          });

        }
      }),
      error: ((error) => {
        console.log(error);
      })
    });

  }

  render() {
    return (
      <div className="uk-container uk-fex uk-flex-center uk-padding App" >
        <div>
          <h2 id="header">Lunch Place</h2>
          <p>Choose a venue for lunch, highest votes is your lunch destination </p>
          <div className="searchInput-1">
            <div className="searchInput-2">
              <input className="searchInput-3" type="search" name="searchInput" value={this.state.searchInput} placeholder=" 12305 Berlin" onChange={this.onChange} />
              <button id="searchBtn" type="submit" onClick={this.onSearch} >Search</button>
            </div>
          </div>
          {this.state.recommendations.length ?
            <div className="searchResults uk-flex uk-flex-center">
              <div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Participants</th>
                      {this.state.recommendations.map((venue, i) =>
                        (
                          <th scope='col' key={i}>
                            {venue.url ?
                              <h2 className="title"><a className="title" href={venue.url} target="_blank">{venue.name}</a>	</h2>
                              :
                              <h2>{venue.name}</h2>
                            }
                            {venue.category ?
                              <p>{venue.category}</p>
                              : null
                            }
                            {venue.rating ?
                              <p>{venue.rating}</p>
                              : null
                            }
                            {venue.winner ?
                              <p className='tickGreen'> ✔ </p>
                              : null
                            }
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.participants.length ? this.state.participants.map((participant, i) => (
                      <tr>
                        <td className="participant-add">
                          <p className="taylan">{participant.name}</p>
                        </td>
                        {this.state.recommendations.map((venue, i) => (
                          <td className={i == participant.option ? 'checkgreen' : ''}>{i == participant.option ? 'Yes' : 'No'}</td>))}
                      </tr>
                    )) : ''}
                    <tr>
                      <td>
                        <input className="participant-wrt" type="text" name="name" value={this.state.name} placeholder="Type here" onChange={this.onChange} />
                      </td>
                      <td>
                        <div class="radio">
                          <input type="radio" id='0' name="optVenue" value="0" onChange={this.onChange} />
                        </div>
                      </td>
                      <td>
                        <div class="radio">
                          <input type="radio" id='1' name="optVenue" value="1" onChange={this.onChange} />
                        </div>
                      </td>
                      <td>
                        <div class="radio">
                          <input type="radio" id='2' name="optVenue" value="2" onChange={this.onChange} />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button type="button" className="add-participant" onClick={this.addParticipant}>Add Participant</button>
              </div>
            </div>
            :
            ''
          }
        </div>
      </div>
    );
  }
}

export default App;



