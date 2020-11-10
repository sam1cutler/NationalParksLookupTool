'use strict';

// Define list of states with 2-letter abbreviations to make the form
const statesList = [ ['AK','Alaska'], 
                ['AL','Alabama'], 
                ['AR','Arkansas'], 
                ['AS','American Samoa'], 
                ['AZ','Arizona'], 
                ['CA','California'], 
                ['CO','Colorado'], 
                ['CT','Connecticut'], 
                ['DC','District of Columbia'], 
                ['DE','Delaware'], 
                ['FL','Florida'], 
                ['GA','Georgia'], 
                ['GU','Guam'], 
                ['HI','Hawaii'], 
                ['IA','Iowa'], 
                ['ID','Idaho'], 
                ['IL','Illinois'], 
                ['IN','Indiana'], 
                ['KS','Kansas'], 
                ['KY','Kentucky'], 
                ['LA','Louisiana'], 
                ['MA','Massachusetts'], 
                ['MD','Maryland'], 
                ['ME','Maine'], 
                ['MI','Michigan'], 
                ['MN','Minnesota'], 
                ['MO','Missouri'], 
                ['MS','Mississippi'], 
                ['MT','Montana'], 
                ['NC','North Carolina'], 
                ['ND','North Dakota'], 
                ['NE','Nebraska'], 
                ['NH','New Hampshire'], 
                ['NJ','New Jersey'], 
                ['NM','New Mexico'], 
                ['NV','Nevada'], 
                ['NY','New York'], 
                ['OH','Ohio'], 
                ['OK','Oklahoma'], 
                ['OR','Oregon'], 
                ['PA','Pennsylvania'], 
                ['PR','Puerto Rico'], 
                ['RI','Rhode Island'], 
                ['SC','South Carolina'], 
                ['SD','South Dakota'], 
                ['TN','Tennessee'], 
                ['TX','Texas'], 
                ['UT','Utah'], 
                ['VA','Virginia'], 
                ['VI','Virgin Islands'], 
                ['VT','Vermont'], 
                ['WA','Washington'], 
                ['WI','Wisconsin'], 
                ['WV','West Virginia'], 
                ['WY','Wyoming'] ];

// Define my apiKey (would like to find more secure solution eventually?)
const apiKey = 'kOf6V8XbiNOXEOa7YUkCv6nq1CCkMYhgOBkTFEDP';

// Define the part of the endpoint URl that will always be present
const endpointURLstart = 'https://developer.nps.gov/api/v1/parks?';


function displayResults(responseJson) {
    //console.log(responseJson.data[0]);
    
    // Empty results list, if it has contents from a previous search.
    $('#results-list').empty();

    // Iterate through the array of parks, creating a list entry for each one
    for (let i=0 ; i<responseJson.data.length ; i++) {
        console.log(responseJson.data[i]);
        $('.js-results-list').append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
            <ul>
                <li>${responseJson.data[i].description}</li>
                <li>Park website: <a href=${responseJson.data[i].url} target="_blank">${responseJson.data[i].url}</a></li>
            </ul>
            </li>`)
    }

    // Reveal the "results" section.
    $('.results').removeClass('hidden');

    // Reveal the "reset form" button.
    $('.reset-button').removeClass('hidden');

    // Hide the search form.
    $('.js-query-form').addClass('hidden');

    // Scroll to the top of the page.
    $(window).scrollTop(0);

}

// Function to create the string containing the search parameters
function formatQueryParams(parameters) {
    console.log('Ran formatQueryParams function');
    
    // Initialize empty queryString
    let queryString = 'stateCode='

    // Add the state codes
    for (let i=0 ; i<parameters.states.length ; i++) {
        console.log(parameters.states[i]);
        queryString += `${parameters.states[i]},`;
    }
    console.log(queryString);

    queryString = queryString.slice(0,-1); // remove the final comma

    console.log('sliced string is '+queryString);
    
    // Add the max results to displayu
    queryString += `&limit=${parameters.maxResults}`;
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
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
    
    
}

// Function to set up the event listener on the search form submission
function watchFormSubmission() {
    console.log('Ran watchFormSubmission function.');

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
        
        // Provide submitted info as arguments to getParkInfo function
        getParkInfo(requestedStates, maxResults);
    })
}

// Function to set up the event listener on clearing the form
function watchFormReset() {
    console.log('Ran watchFormReset function.');

    $('.reset-button').on('click', function(event) {
        console.log('User requested to clear the form.');
        event.preventDefault();
        
        // Hide the reset button and results.
        $('.reset-button').addClass('hidden');
        $('.results').addClass('hidden');

        // Freshly render the form.
        renderParksForm();

        // Reveal the form.
        $('.js-query-form').removeClass('hidden');
    })
}

function renderParksForm() {
    console.log('Ran renderParksForm function.')

    // Initialize empty HTML form string
    let stateOptionsHTML = '';

    for (let i=0 ; i<statesList.length ; i++) {
        let activeAbbrev = statesList[i][0].toLowerCase();
        let activeState = statesList[i][1];
        stateOptionsHTML += `
            <input name="${activeAbbrev}" type="checkbox" id="${activeAbbrev}">
            <label for="${activeAbbrev}">${activeState}</label><br>`;
    };

    $('.js-state-options-target').html(stateOptionsHTML);

}


function handleLookUpPage() {
    renderParksForm();
    watchFormSubmission();
    watchFormReset();
}

$(handleLookUpPage);