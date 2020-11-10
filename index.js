'use strict';

// Define my apiKey (would like to find more secure solution eventually?)
const apiKey = 'kOf6V8XbiNOXEOa7YUkCv6nq1CCkMYhgOBkTFEDP';

// Define the part of the endpoint URl that will always be present
const endpointURLstart = 'https://developer.nps.gov/api/v1/parks?';

// Function to create the string containing the search parameters
function formatQueryParams(parameters) {
    console.log('Ran formatQueryParams function');
    
    // Initialize empty queryString
    let queryString = ''

    // Add the state codes
    for (let i=0 ; i<parameters.states.length ; i++) {
        console.log(parameters.states[i]);
        queryString += `stateCode=${parameters.states[i]}&`;
    }
    console.log(queryString);
    
    // Add the max results to displayu
    queryString += `limit=${parameters.maxResults}`;
    console.log(queryString);

    // Add the API key
    queryString += `&api_key=${apiKey}`;
    console.log(queryString);

    return queryString;
}


// Function to submit the GET request
function getParkInfo(requestedStates, maxResults) {
    console.log('Ran getParkInfo function.');
    console.log(`User is interested in a maximum of ${maxResults} parks in ${requestedStates}.`);

    const params = {
        key: apiKey,
        states: requestedStates,
        maxResults
    };

    console.log(params);

    const queryString = formatQueryParams(params);
    //console.log(queryString);
    const URLtoBeFetched = endpointURLstart+queryString;
    console.log(URLtoBeFetched);

    fetch(URLtoBeFetched)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Erro(response.statusText);
        })
        .then(responseJson => console.log(responseJson))


}

// Function to set up the event listener on the search form submission
function watchForm() {
    console.log('Ran watchForm function');

    $('form').on('submit', function(event) {
        event.preventDefault();
        console.log('You submitted the form');

        // Log the submitted info
        let requestedStates = []
        $('input[type="checkbox"]:checked').each(function() {
            requestedStates.push(this.name);})
        console.log(requestedStates);

        const maxResults = $('#js-max-results').val()
        console.log(maxResults);

        getParkInfo(requestedStates, maxResults);
    })
}

$(watchForm);