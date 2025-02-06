window.addEventListener("DOMContentLoaded",localStorage.clear());






window.addEventListener("DOMContentLoaded", localStorage.clear());

// Toggle the visibility of the options container when the selected option is clicked
document.getElementById("selected-pregnancy-option").addEventListener("click", () => {
    document.getElementById("pregnancy-options-container").classList.toggle("hidden");
});

// Add an event listener to hide the options when clicking outside of the custom select
window.addEventListener("click", (event) => {
    const customSelect = document.getElementById("pregnancy-select");
    if (!customSelect.contains(event.target)) {
        document.getElementById("pregnancy-options-container").classList.add("hidden");
    }
});

// Add event listener to each pregnancy option
document.querySelectorAll("#pregnancy-options-container > div").forEach(option => {
    option.addEventListener("click", () => {
        document.getElementById("selected-pregnancy-option").textContent = option.textContent;
        document.getElementById("pregnancy-options-container").classList.add("hidden");
        document.getElementById("selected-pregnancy-option").style.color = "hsl(0, 0%, 10%)"; // Change color to black when selected
    });
});



Papa.parse("./countries_info.csv", {
    download: true,
    header: true,
    encoding: "utf-8",
    complete: function(data) {

        const toBepassedIntoCreateTemplate = data.data;

        console.log("data", data);

        populateCountryOptions(toBepassedIntoCreateTemplate); // Accessing the 'data' property of the parsed data

        const submitBtn = document.getElementById("submitBtn");
        const form = document.querySelector('form');
        const shortResultParagraph = document.getElementById('result');
        const finalWords = document.getElementById("final-words");

        //const shortVersion = document.getElementById("short-version");




        //detailed.html
        const resultLong = document.getElementById("result-long");
        const exampleHeader = document.getElementById("example-header");

        submitBtn.addEventListener("mousedown", () => submitBtn.style.backgroundColor="hsl(0, 0%, 95%)");
        submitBtn.addEventListener("mouseup", () => submitBtn.style.backgroundColor="hsl(0, 0%, 75%)");
        submitBtn.addEventListener("mouseleave", () => submitBtn.style.backgroundColor="hsl(0, 0%, 55%)");
        submitBtn.addEventListener("mouseover", () => submitBtn.style.backgroundColor="hsl(0, 0%, 75%)");

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            console.clear();



            const actualForm = document.getElementById("actualForm");
            actualForm.style.width="fit-content";
            actualForm.style.overflowY="scroll";

            const resultsDivContainer = document.getElementById("resultsDivContainer");
            resultsDivContainer.style.display="block";



            const selectedCountry = document.querySelector('#selected-option').textContent.trim();
            const selectedPregnancyStatus = document.querySelector('#selected-pregnancy-option').textContent.trim();
        
            // Check if a country is selected
            if (selectedCountry === 'Destination' || selectedCountry === '') {
                alert('Please select a country.');
                event.preventDefault(); // Prevent form submission
                return;
            }
        
            // Check if a pregnancy status is selected (if applicable)
            if (selectedPregnancyStatus === 'Pregnancy status' || selectedPregnancyStatus === '') {
                alert('Please select a pregnancy status.');
                event.preventDefault(); // Prevent form submission
                return;
            }




            const countryInput = document.getElementById("selected-option").textContent;
            const lengthOfStay = document.getElementById("lengthOfStay").value;
            const age = document.getElementById("age").value;


                        // Determine pregnancy status based on the selected pregnancy option
            const selectedPregnancyOption = document.getElementById("selected-pregnancy-option").textContent;
            const isPregnant = selectedPregnancyOption === "pregnant/intend to be";
            

            let patientType = age < 16 ? "child" : (age >= 60 ? "senior" : "adult");
            let ageCategory = age < 16 ? "child" : (age >= 60 ? "senior" : "adult");
            patientType = isPregnant ? `pregnant ${patientType}`: patientType;

            const numWeeks = lengthOfStay / 7;
            let duration = numWeeks <= 1 ? "short" : (numWeeks < 4 ? "middle" : "long");

            const vaccines = logVaccinesForCountry(countryInput, data.data);
            const vaccineArray = vaccines.split(", ");



            populateLongText(toBepassedIntoCreateTemplate, duration, vaccineArray, isPregnant, ageCategory);
            populateShortText(duration, vaccineArray, isPregnant, ageCategory, shortResultParagraph);



            ///const result = `
            console.log(`
country: ${countryInput},   
duration: ${lengthOfStay} days,
age: ${age},    
age category: ${ageCategory},
pregnant: ${isPregnant},
continent: ${getContinent(countryInput, data.data)},
Vaccines: ${vaccines},
You are a: ${patientType},
Your stay is: ${duration}
            `);

        });
        console.log(typeof(isPregnant));

    }
});







function logVaccinesForCountry(countryName, vaccineTable) {
    let countryData = null;
    let vaccines = []; // Initialize an array to store vaccine names

    for (let i = 0; i < vaccineTable.length; i++) {
        if (vaccineTable[i].Land === countryName) {
            countryData = vaccineTable[i];
            break;
        }
    }

    if (countryData) {
        for (const key in countryData) {
            if (countryData[key] === "1") {
                vaccines.push(key); // Add the vaccine name to the array
            }
        }
        return vaccines.join(", "); // Return a comma-separated string of vaccine names
    } else {
        return "Country not found";
    }
}




// function populateCountryOptions(csvData) {
//     const selectElement = document.getElementById("countryInput");
//     selectElement.innerHTML = '';
    


//     const placeholder = document.createElement("option");
//     placeholder.value = "";
//     placeholder.textContent = "Where are you going";
//     placeholder.disabled = true;
//     placeholder.selected = true;
//     placeholder.classList.add("placeholderForCountryInput");
//     placeholder.classList.add("placeholderClass");
//     placeholder.style.color = "rgb(250, 0, 50)";

//     selectElement.appendChild(placeholder);
//     // console.log(placeholder.className);
    
    
//     csvData.sort((a, b) => a.Land.localeCompare(b.Land));

//     csvData.forEach(country => {
//         const option = document.createElement("option");
        
//         option.textContent = country.Land;
//         option.style.color = "hsl(50, 0%, 50%)";
//         selectElement.appendChild(option);
//     });
// }


function populateCountryOptions(csvData) {
    const optionsContainer = document.getElementById("options-container");
    const selectedOption = document.getElementById("selected-option");
    
    // Clear any existing options
    optionsContainer.innerHTML = '';

    // Sort CSV data by country name
    csvData.sort((a, b) => a.Land.localeCompare(b.Land));

    // Add each country as an option
    csvData.forEach(country => {
        const optionDiv = document.createElement("div");
        optionDiv.textContent = country.Land;
        // optionDiv.classList.add("formInputBoxes");
        optionDiv.addEventListener("click", () => {
            selectedOption.textContent = country.Land;
            optionsContainer.classList.add("hidden");
            selectedOption.style.color = "hsl(0, 0%, 10%)"; // Change color to black when selected
        });
        optionsContainer.appendChild(optionDiv);
    });
}

// Toggle the visibility of the options container when the selected option is clicked
document.getElementById("selected-option").addEventListener("click", () => {
    document.getElementById("options-container").classList.toggle("hidden");
});




// Add an event listener to hide the options when clicking outside of the custom select
window.addEventListener("click", (event) => {
    const customSelect = document.getElementById("custom-select");
    if (!customSelect.contains(event.target)) {
        document.getElementById("options-container").classList.add("hidden");
    }
});

function getContinent(countryName, vaccineTable) {
    for (let i = 0; i < vaccineTable.length; i++) {
        if (vaccineTable[i].Land === countryName) {
            return vaccineTable[i].Kontinent;
        }
    }
    return "Country not found";
}   



function populateLongText(vaccineDB, stayDuration, vaccineArray, isPregnant, ageCategory) {
    Papa.parse("./testing-carlo-idea-texts.csv", {
        download: true,
        header: true,
        encoding: "utf-8",
        complete: function(data) {

            console.log("vaccine array ffrom inside createTemplate", vaccineArray);
            console.log("vaccineDB", vaccineDB);

            const textsDB = data.data;
            console.log(textsDB);
            let buildingMainText = "";

            let vaccineTextsArray = [];






            let pregnancyStatusAsString = isPregnant.toString().toUpperCase();


            let mainTextType;

            //console.log("main data from create template function:", vaccineData);
            //console.log("Papa parse complete.", fileObject);
            //console.log("textsDB:", textsDB);




//------------------------------------------------------------------------------------------------
            textsDB.forEach(row => {

               // console.log("row.vaccine", row.vaccine);
               // console.log("row.mainTextID", row.mainTextID)

                if (row.mainTextID === "1") {
                    if (stayDuration == "short") {
                        console.log("--------------------------short text-----------------------------");
                        mainTextType = "short";

                    }

                    else if (stayDuration == "middle") {
                        console.log("--------------------------middle text-----------------------------");
                        mainTextType = "middle";

                    }

                    else if (stayDuration == "long") {
                        console.log("--------------------------long text-----------------------------");
                        mainTextType = "long";

                    }

                    if (row.lengthOfStay === mainTextType) {
                        buildingMainText = row.text;

                    }
                }
    

// add pregnant and child texts if required ---------------------------------------------
                if (row.mainTextID === "2") {
                    console.log("Found 2")
                    if (pregnancyStatusAsString === row.pregnant) {
                        buildingMainText = row.text + "\n" + buildingMainText;
                        // console.log("Pregnant text should be added");
                    }

                    if (ageCategory === row.age) {
                        buildingMainText = row.text + "\n" + buildingMainText;
                        // console.log("kinder text should be added");

                    }
                }
//------------------------------------------------------------------------------------------------


// add elderly text to the end
                if (row.mainTextID === "3") {
                    if (ageCategory === row.age) {
                        buildingMainText = buildingMainText + "\n" + row.text;
                        // console.log("Elderly text should be added");
                    }
                }

// add words for everyone to the very end

                if (row.mainTextID === "4") {
                    // console.log("final words for everyone", row.text);
                    buildingMainText = buildingMainText + "\n" + "\n" + "\n" + row.text
                }


// append to vaccineTextsArray all required vaccine texts --------------------------------------------------------
                if (row.mainTextID === "null") {                   
                    vaccineArray.forEach(vaccine => {
                        if (row.vaccine === vaccine || row.vaccine === "null") {
                            if (row.pregnant === pregnancyStatusAsString || row.pregnant === "null") {
                                if (row.age === ageCategory || row.age === "null") {
                                    if (row.lengthOfStay === stayDuration || row.lengthOfStay === "null") {
                                       // console.log("everything matches");
                            


                                       // console.log("row.vaccine matches vaccine");
                                        
                                        /* var key = vaccine;
                                        var obj = {};
                                        obj[key] = row.text;  */
            
                                        // Push the object with dynamic key to the array

                                        var obj = {};

                                        // Assign the vaccine text and map to the object properties
                                        obj[row.vaccine] = row.text;
                                        obj.map = row.map; // Adjust this field name as per your data
                                    
                                        vaccineTextsArray.push(obj);  
                                    }
                                } 
                            }
                        }
                    });
                }

//------------------------------------------------------------------------------------------------

            });


           console.log("vaccineTextsArray", vaccineTextsArray);
           console.log(vaccineArray);

            vaccineTextsArray.forEach(text => {
                console.log("text lol", text)
                console.log("required map", text.map);


                let meningitisText = (text.MenAfrica || "") + (text.MenSaudi || "");
                let yellowFeverText = (text.YF1 || "") + (text.YF2 || "") + (text.YF3 || "") + (text.YF4 || "");
                let malariaText = (text.MalHrE || "") + (text.MalHrS || "") + (text.MalLr || "");
                let JEText = (text.JE || "");
                let FSMEText = (text.FSME || "");

                console.log("Text.map", text.map);
                if (!isNaN(text.map)) {
                    // Check if meningitisText is not empty
                    if (meningitisText !== "") {
                        // Add <br> tags before and after the text
                        meningitisText = "<br><br>" + meningitisText + `<img src="Map${text.map}.JPG" alt="Map">` +  "<br>";
                    }

                    // Check if yellowFeverText is not empty
                    if (yellowFeverText !== "") {
                        // Add <br> tags before and after the text
                        yellowFeverText = "<br><br>" + yellowFeverText + `<img src="Map${text.map}.JPG" alt="Map">` +  "<br>";
                    }

                    // Check if malariaText is not empty
                    if (malariaText !== "") {
                        // Add <br> tags before and after the text
                        malariaText = "<br><br>" + malariaText + `<img src="Map${text.map}.JPG" alt="Map">` +  "<br>";
                    }

                    // Check if JEText is not empty
                    if (JEText !== "") {
                        // Add <br> tags before and after the text
                        JEText = "<br><br>" + JEText + `<img src="Map${text.map}.JPG" alt="Map">` +  "<br>";
                    }

                    // Check if FSMEText is not empty
                    if (FSMEText !== "") {
                        // Add <br> tags before and after the text
                        FSMEText = "<br><br>" + FSMEText + `<img src="Map${text.map}.JPG" alt="Map">` +  "<br>";
                    }
                } else if (text.map === "TBD by country") {
                    console.log("Extra logic goes here");
                }
            


                buildingMainText = buildingMainText.replace("//{{YellowFever}}//", yellowFeverText !== "" ? yellowFeverText : "//{{YellowFever}}//");

                buildingMainText = buildingMainText.replace("//{{JE}}//", JEText !== "" ? JEText : "//{{JE}}//");
                buildingMainText = buildingMainText.replace("//{{FSME}}//", FSMEText !== "" ? FSMEText : "//{{FSME}}//");
                buildingMainText = buildingMainText.replace("//{{Malaria}}//", malariaText !== "" ? malariaText : "//{{Malaria}}//");
                buildingMainText = buildingMainText.replace("//{{Meningitis}}//", meningitisText !== "" ? meningitisText : "//{{Meningitis}}//");

            });

            buildingMainText = buildingMainText.replace("//{{YellowFever}}//", "");
            buildingMainText = buildingMainText.replace("//{{JE}}//", "");
            buildingMainText = buildingMainText.replace("//{{FSME}}//", "");
            buildingMainText = buildingMainText.replace("//{{Malaria}}//", "");
            buildingMainText = buildingMainText.replace("//{{Meningitis}}//", "");

            buildingMainText = buildingMainText.replace("//{{MapPolio}}//", `<img src"./MapPolio.JPG" alt="Polio Map">`);
            buildingMainText = buildingMainText.replace("//{{MapZIKA}}//", `<img src"./MapZIKA.JPG" alt="ZIKA Map">`) 

            console.log(buildingMainText);
            localStorage.setItem("buildingMainText", buildingMainText);

        }
    });
}



function populateShortText (stayDuration, vaccineArray, isPregnant, ageCategory, shortResultParagraph) {
    Papa.parse("./testing-carlo-idea-texts.csv", {
        download: true,
        header: true,
        encoding: "utf-8",
        complete: function(data) {

            let shortTextBuilder = "";

            const textsDB = data.data;
            let pregnancyStatusAsString = isPregnant.toString().toUpperCase();

            textsDB.forEach(row => {
                if (row.mainTextID === "5") {
                    vaccineArray.forEach(vaccine => {
                        if (row.vaccine === vaccine || row.vaccine === "null") {
                            if (row.pregnant === pregnancyStatusAsString || row.pregnant === "null") {
                                if (row.age === ageCategory || row.age === "null") {
                                    if (row.lengthOfStay === stayDuration || row.lengthOfStay === "null") {
                                        shortTextBuilder = shortTextBuilder + "\n \n" + row.text;
                                    }
                                }
                            }
                        }
                    });
                }

                if (row.mainTextID === "6") {
                    if (row.pregnant === pregnancyStatusAsString || row.pregnant === "null") {
                        if (row.age === ageCategory || row.age === "null") {
                            if (row.lengthOfStay === stayDuration || row.lengthOfStay === "null") {
                                shortTextBuilder = shortTextBuilder + "\n \n" + row.text;
                            }
                        }
                    }
                }

                if (row.mainTextID === "7") {
                    shortTextBuilder = shortTextBuilder + "\n \n" + row.text;
                }
            });


            console.log("Short text is as follows for this country", shortTextBuilder);
            localStorage.setItem("shortTextBuilder", shortTextBuilder);

            shortResultParagraph.innerText = shortTextBuilder;
            shortResultParagraph.style.visibility = "visible";


            const moreInfoLinkContainer = document.createElement("div");
            moreInfoLinkContainer.id = "linkContainer";



            // come back to this
            // const printBtn = document.createElement("button");
            // printBtn.id = "printBtn";


        
            const linkToMoreInfo = document.createElement("a");
            linkToMoreInfo.href = "detailed.html";
            linkToMoreInfo.textContent = "Get more detailed information";
        
            moreInfoLinkContainer.appendChild(linkToMoreInfo);
            shortResultParagraph.appendChild(moreInfoLinkContainer);
        }
    })


}