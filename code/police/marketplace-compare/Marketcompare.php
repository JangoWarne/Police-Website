<?php

    error_reporting(E_ALL); // Turn on all errors, warnings and notices for easier debugging

    // API request variables
    $endpoint = 'http://svcs.ebay.com/services/search/FindingService/v1'; // URL to call
    $version = '1.0.0'; // API version supported by your application
    $appid = 'AaranCoa-PoliceWe-PRD-5fb0c962d-d2c3c91c'; // Replace with your own AppID
    $globalid = 'EBAY-GB'; // Global ID of the eBay site you want to search (e.g., EBAY-DE)
    $query = $_POST['query'];//'bicycles'; // You may want to supply your own query 
    $safequery = urlencode($query); // Make the query URL-friendly
// Create a PHP array of the item filters you want to use in your request
/*$filterarray =
  array(
    array(
    'name' => 'model',
    'value' => 'bmx',
    'paramName' => 'Currency',
    'paramValue' => 'USD'),
     array(
    'name' => 'FreeShippingOnly',
    'value' => 'true',
    'paramName' => '',
    'paramValue' => ''),
    array(
    'name' => 'ListingType',
    'value' => array('AuctionWithBIN','FixedPrice'),
    'paramName' => '',
    'paramValue' => ''),*/
  //);
    $i = '0'; // Initialize the item filter index to 0


    // Construct the findItemsByKeywords HTTP GET call
    $apicall = "$endpoint?";
    $apicall .= "OPERATION-NAME=findItemsByKeywords";
    $apicall .= "&SERVICE-VERSION=$version";
    $apicall .= "&SECURITY-APPNAME=$appid";
    $apicall .= "&GLOBAL-ID=$globalid";
    $apicall .= "&keywords=$safequery";
    $apicall .= "&paginationInput.entriesPerPage=10";


    // Load the call and capture the document returned by eBay API
    $resp = simplexml_load_file($apicall);


    // Check to see if the request was successful, else print an error
    if ($resp->ack == "Success") {
        $results = '';
        
        // If the response was loaded, parse it and build links
        foreach($resp->searchResult->item as $item) {
            
            $pic = $item->galleryURL;
            $link = $item->viewItemURL;
            $title = $item->title;
            //$model = $item->bikeModel;

            // For each SearchResultItem node, build a link and append it to $results
            $results .= "<tr><td><img src=\"$pic\"></td><td><a href=\"$link\">$title</a></td></tr>";
        }
        
        // turn list of values into a list then in a standerdised way (JSON) turn into a string
        echo $results;
    }
    // If the response does not indicate 'Success,' print an error
    else {
        echo "Invalid AppID";
    }

?>