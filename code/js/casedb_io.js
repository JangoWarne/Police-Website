
// update database required -> create database (can handle version upgrade if needed))
function updateDatabase(e) {
	console.log("Upgrading...");
	db = e.target.result;
	
	// create missing casedb
	if(!db.objectStoreNames.contains("casedb")) {
		// primary key is sequential unique number
		db.createObjectStore("casedb", {keyPath: "caseID", autoIncrement:true});
	}
}