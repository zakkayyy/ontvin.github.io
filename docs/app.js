Papa.parse("./countries_info.csv", {
    download: true,
    header: true,
    encoding: "utf-8",
    complete: function(data) {
        console.log(data);

        populateCountryOptions(data.data); // Accessing the 'data' property of the parsed data

        const submitBtn = document.getElementById("submitBtn");
        const form = document.querySelector('form');
        const resultParagraph = document.getElementById('result');
        const finalWords = document.getElementById("final-words");
        const shortVersion = document.getElementById("short-version");


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

            const countryInput = document.getElementById("countryInput").value;
            const lengthOfStay = document.getElementById("lengthOfStay").value;
            const age = document.getElementById("age").value;
            const isPregnant = document.getElementById("isPregnant").checked;

            let patientType = age < 16 ? "child" : (age >= 60 ? "senior" : "adult");
            let ageCategory = age < 16 ? "child" : (age >= 60 ? "senior" : "adult");
            patientType = isPregnant ? `pregnant ${patientType}`: patientType;

            const numWeeks = lengthOfStay / 7;
            let duration = numWeeks <= 1 ? "short" : (numWeeks < 4 ? "middle" : "long");

            const vaccines = logVaccinesForCountry(countryInput, data.data);

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

           // resultParagraph.innerText = result;
           // resultParagraph.style.visibility = "visible";





            //.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-




            /*
            
            let vaccineArray = vaccines.split(",");
            console.log("vaccineArray: ", vaccineArray);

            vaccineArray.forEach(vaccine => {
                let ageCategory = age < 16 ? "child" : (age >= 60 ? "senior" : "adult");
                let isPregnant = document.getElementById("isPregnant").checked;
                isPregnant = isPregnant ? "TRUE" : (!isPregnant ? "FALSE" : "null");
                console.log("vaccine1", vaccine);
                
                Papa.parse("./textBasedOnCountries.csv", {
                    download: true,
                    header: true,
                    encoding: "utf-8",
                    complete: function(data) {
                        // console.log(data);
                        data.data.forEach(text => {
                            console.log("Vaccine2: ", vaccine);
                            console.log(text)
                            if (false)
                            if (text.vaccine === vaccine || text.vaccine == "null") {
                                console.log("same vaccine", vaccine);
                                if (text.pregnant == isPregnant || text.pregnant == "null") {
                                    console.log("pregnancy status matches", isPregnant);
                                    if (text.age === ageCategory || text.age == "null") {
                                        console.log("Age category matches", ageCategory);
                                        console.log("######################### All categories match #####################");
                                        let result = text.text;
                                        if (result !== text.text) {
                                            result + text.text;
                                        }
                                        resultParagraph.innerText = result;
                                    }
                                }
                            }
                        })
                    }
                })
            });

            */

            let vaccineArray = vaccines.split(", ");
            console.log("vaccineArray: ", vaccineArray);
            let resultToBePrinted = "";


            Papa.parse("./textBasedOnCountries.csv", {
                download: true,
                header: true,
                encoding: "utf-8",
                complete: function(data) {
                    console.log("Papa parse complete.", data.data);



                    vaccineArray.forEach(vaccine => {
                        let ageCategory = age < 16 ? "child" : (age >= 60 ? "senior" : "adult");
                        let isPregnant = document.getElementById("isPregnant").checked;
                        isPregnant = isPregnant ? "TRUE" : (!isPregnant ? "FALSE" : "null");
                        console.log("vaccine1: ", vaccine);

                        data.data.forEach(text => {
                            console.log("Vaccine2: ", vaccine);
                            console.log(text);
                            if (text.vaccine === vaccine || text.vaccine == "null") {
                                console.log("same vaccine", vaccine);
                                if (text.pregnant == isPregnant || text.pregnant == "null") {
                                    console.log("pregnancy status matches", isPregnant);
                                    if (text.age === ageCategory || text.age == "null") {
                                        console.log("Age category matches", ageCategory);
                                        console.log("######################### All categories match #####################");
                                        console.log(text.text);
                                        if (!resultToBePrinted.includes(text.text)) {
                                            resultToBePrinted += text.text + "\n \n \n";
                                        }
            
                                        console.log(resultToBePrinted);
                                        resultParagraph.innerText = resultToBePrinted;
                                        resultParagraph.style.visibility = "visible";

                                    }
                                }
                            }
                            finalWords.style.visibility = "visible";
                        });
                    });
                }
            });


        //.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-




        });
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


function populateCountryOptions(csvData) {
    const selectElement = document.getElementById("countryInput");
    selectElement.innerHTML = '';

    console.log("sorted csv data");

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Where are you going";
    placeholder.disabled = true;
    placeholder.selected = true;
    selectElement.appendChild(placeholder);



    csvData.sort((a, b) => a.Land.localeCompare(b.Land));
            console.log("Sorted csvData:", csvData);

            
    csvData.forEach(country => {
        const option = document.createElement("option");
        option.textContent = country.Land;
        selectElement.appendChild(option);
    });


}



 