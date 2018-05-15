<?php
    error_reporting(E_ALL); // Turn on all errors, warnings and notices for easier debugging

	
	//////// Search for list of bikes on ebay //////////
	
    // API request variables
    $endpoint = 'http://svcs.ebay.com/services/search/FindingService/v1'; // URL to call
    $version = '1.0.0'; 			// API version supported by your application
    $appid = 'AaranCoa-PoliceWe-PRD-5fb0c962d-d2c3c91c'; // Replace with your own AppID
    $globalid = 'EBAY-GB'; 			// Global ID of the eBay site you want to search (e.g., EBAY-DE)
    $query = $_POST['query'];		//'bicycles'; // You may want to supply your own query 
    $safequery = urlencode($query); // Make the query URL-friendly
    $category = 7294;				// Restrict to ebay cycling section
    $page = $_POST['page'];


    // Construct the findItemsByKeywords HTTP GET call
    $apicall = "$endpoint?";
    $apicall .= "OPERATION-NAME=findItemsByKeywords";
    $apicall .= "&SERVICE-VERSION=$version";
    $apicall .= "&SECURITY-APPNAME=$appid";
    $apicall .= "&GLOBAL-ID=$globalid";
    $apicall .= "&keywords=$safequery";
    $apicall .= "&categoryId=$category";
    $apicall .= "&paginationInput.entriesPerPage=10"; //50
    $apicall .= "&paginationInput.pageNumber=$page";
    $apicall .= "&IncludeSelector=Description,ItemSpecifics";


    // Load the call and capture the document returned by eBay API
    $resp = simplexml_load_file($apicall);


    // Check to see if the request was successful, else print an error
    if ($resp->ack == "Success") {
        
        $IDs = "";
        $first = true;
        
        // Read each result to get bike id
        foreach($resp->searchResult->item as $item) {
            
            // item id and add to list of IDs to get more info for
            $id = $item->itemId;
            if ($first) {
	            // dont add comma to first entry
	            $IDs = $id;
            } else {
	            $IDs = $IDs.",".$id;
            }
            $first = false;
        }
        
        
        
		//////// Get detailed info for list of bikes on ebay //////////
        
        $apicall2 = "http://open.api.ebay.com/shopping?";
        $apicall2 .= "callname=GetMultipleItems&";
        $apicall2 .= "responseencoding=XML&";
        $apicall2 .= "appid=AaranCoa-PoliceWe-PRD-5fb0c962d-d2c3c91c&";
        $apicall2 .= "siteid=3&";
        $apicall2 .= "version=1033&";
        $apicall2 .= "ItemID=$IDs&";
        $apicall2 .= "IncludeSelector=Description,ItemSpecifics,Details";
        
        // Load the call and capture the document returned by eBay API
        $resp2 = simplexml_load_file($apicall2);
        
        // Check to see if the request was successful, else print an error
        if ($resp2->Ack == "Success") {
        	//print_r( $resp2->Item );
	        
	        $results = '';
	        $num = 0;
	        
	        $bikes = array();
		        
			//////// Compile information to return to page //////////
            
            $i = 0;
            // Read each result to get detailed information
	        foreach($resp2->Item as $item) {
		        
		        // bike information array for single bike view
		        $bikes[$i] = returnBikeData($item);
				$i = $i + 1;
	            
	            // list to display on page
				$results .= bikeList($item);
            }
            
            // encode values as json string
            echo json_encode(array(
            	"status" => 'success',
            	"list" => $results,
            	"bikes" => $bikes
            ));
        }
    } else {
	    // return error
        echo json_encode(array(
        	"status" => 'success',
        	"error" => "Invalid App ID"
        ));
    }
    
    
    
    
    
    
    // list to display on page
    function bikeList($item) {
	    
	    // Values to display in list
        $pic = $item->PictureURL;
        $ebayUrl = $item->ViewItemURLForNaturalSearch;
        $id = $item->ItemID;
        
        
        // Bike information in NameValueList (default to empty string)
        $brand = "";
        $model = "";
        $colour = "";
        $material = "";
        
        // Get information from NameValueList
        foreach($item->ItemSpecifics->NameValueList as $nameValue) {
            
            switch($nameValue->Name) {
	            case 'Brand':
	            	$brand = $nameValue->Value;
	            	break;
	            case 'Model':
	            	$model = $nameValue->Value;
	            	break;
	            case 'Colour':
	            	$colour = $nameValue->Value;
	            	break;
	            case 'Frame Material':
	            	$material = $nameValue->Value;
	            	break;
	            default:
	            	
            }
        }

        // get number of string matches
        $matches = 15;
        
        // For each SearchResultItem node, build a link and append it to $results
        $result =
            '<tr class="item" id="ebay-row-$id">'.
                '<td>'.
                    '<a href="'.$ebayUrl.'">'.
                        '<table class="ebay">'.
                            '<tr class="ebay_bike_img">'.
                                '<td rowspan="6">'.
                                    '<div class="bike_Image">'.
                                        '<div class="outer_constraint">'.
                                            '<div class="inner_constraint">'.
                                                '<img src="'.$pic.'" alt="ebay_'.$id.'">'.
                                            '</div>'.
                                        '</div>'.
                                    '</div>'.
                                '</td>'.
                                '<td rowspan="6">'.
                                    '<div class="ebay_padding">'.
                                    '</div>'.
                                '</td>'.
                                '<td class="ebay_heading">Brand:</td>'.
                                '<td class="ebay_values">'.$brand.'</td>'.
                            '</tr>'.
                            '<tr class="ebay_row">'.
                                '<td class="ebay_heading">Model:</td>'.
                                '<td>'.$model.'</td>'.
                            '</tr>'.
                            '<tr class="ebay_row">'.
                                '<td class="ebay_heading">Colour:</td>'.
                                '<td>'.$colour.'</td>'.
                            '</tr>'.
                            '<tr class="ebay_row">'.
                                '<td class="ebay_heading">Frame Material:</td>'.
                                '<td>'.$material.'</td>'.
                            '</tr>'.
                            '<tr class="case_row">'.
                                '<td class="ebay_heading"></td>'.
                                '<td></td>'.
                            '</tr>'.
                            '<tr class="ebay_row">'.
                                '<td class="ebay_heading"><b>Matching Words:</td>'.
                                '<td>'.$matches.'</b></td>'.
                            '</tr>'.
                        '</table>'.
                    '</a>'.
                '</td>'.
            '</tr>';
        
        return $result;
    }
    
    
    
    
    // bike information for single bike view
    function returnBikeData($item) {
	    
	    // Bike information in object
        $pic = $item->PictureURL;
        $ebayUrl = $item->ViewItemURLForNaturalSearch;
        $id = $item->ItemID;
        $title = $item->Title;
        $desc = $item->Description;
        $itemLocation = $item->Location;
        $itemPost = $item->PostalCode;
        $sellerFirstN = $item->BusinessSellerDetails->Address;
/*
        $sellerFirstN = $item->BusinessSellerDetails->Address->FirstName;
        $sellerLastN = $item->BusinessSellerDetails->Address->LastName;
        $sellerCompanyN = $item->BusinessSellerDetails->Address->CompanyName;
        $sellerStreet = $item->BusinessSellerDetails->Address->Street1;
        $sellerPost = $item->BusinessSellerDetails->Address->PostalCode;
        $sellerPhone = $item->BusinessSellerDetails->Address->Phone;
*/
        
        
        // Bike information in NameValueList (default to empty string)
        $brand = "";
        $model = "";
        $colour = "";
        $material = "";
        $type = "";
        $gender = "";
        $gearNum = "";
        $suspension = "";
        $brake = "";
        $handlebar = "";
        $mpn = "";
        $features = "";
        
        // Get information from NameValueList
        foreach($item->ItemSpecifics->NameValueList as $nameValue) {
            
            switch($nameValue->Name) {
	            case 'Brand':
	            	$brand = $nameValue->Value;
	            	break;
	            case 'Model':
	            	$model = $nameValue->Value;
	            	break;
	            case 'Colour':
	            	$colour = $nameValue->Value;
	            	break;
	            case 'Frame Material':
	            	$material = $nameValue->Value;
	            	break;
	            case 'Type':
	            	$type = $nameValue->Value;
	            	break;
	            case 'Gender':
	            	$gender = $nameValue->Value;
	            	break;
	            case 'Number of Gears':
	            	$gearNum = $nameValue->Value;
	            	break;
	            case 'Suspension':
	            	$suspension = $nameValue->Value;
	            	break;
	            case 'Brake Type':
	            	$brake = $nameValue->Value;
	            	break;
	            case 'Handlebar Type':
	            	$handlebar = $nameValue->Value;
	            	break;
	            case 'MPN':
	            	$mpn = $nameValue->Value;
	            	break;
	            case 'Features':
	            	$features = $nameValue->Value;
	            	break;
	            default:
	            	
            }
        }
        
        // encode information as json string
        $bike = json_encode(array(
        	"pic" => $pic,
        	"ebayURL" => $ebayUrl,
        	"id" => $id,
        	"title" => $title,
        	"list" => $desc,
        	"desc" => $itemLocation,
        	"itemPost" => $itemPost,
        	"sellerFirstN" => $sellerFirstN,
/*
        	"sellerLastN" => $sellerLastN,
        	"sellerCompanyN" => $sellerCompanyN,
        	"sellerStreet" => $sellerStreet,
        	"sellerPost" => $sellerPost,
        	"sellerPhone" => $sellerPhone,
*/
        	"brand" => $brand,
        	"model" => $model,
        	"colour" => $colour,
        	"material" => $material,
        	"type" => $type,
        	"gender" => $gender,
        	"gearNum" => $gearNum,
        	"suspension" => $suspension,
        	"brake" => $brake,
        	"handlebar" => $handlebar,
        	"mpn" => $mpn,
        	"features" => $features
        ));
        
        return $bike;
    }

?>