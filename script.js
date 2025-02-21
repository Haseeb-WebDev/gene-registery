const form = document.getElementById("userForm");
const cardContainer = document.getElementById("cardContainer");
const searchGene = document.getElementById("searchGene");
const searchBtn = document.getElementById("searchBtn");

// Handle form submission
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("name").value.trim();
    const rollNo = document.getElementById("rollNo").value.trim();
    const gene = document.getElementById("gene").value.trim().toUpperCase(); // Standardized gene names

    if (!name || !rollNo || !gene) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, rollNo, gene }),
        });

        const result = await response.json();
        alert(result.message);
        form.reset();
        loadCards(); // Refresh cards
    } catch (error) {
        console.error("Error submitting data:", error);
        alert("Failed to add entry. Please try again.");
    }
});

// Function to load cards from backend
async function loadCards() {
    try {
        const response = await fetch("http://localhost:5000/data");
        const data = await response.json();

        cardContainer.innerHTML = ""; // Clear existing cards
        if (data.length === 0) {
            cardContainer.innerHTML = "<p class='text-gray-500'>No data available.</p>";
            return;
        }

        data.forEach(entry => {
            const card = document.createElement("div");
            card.className = "bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300";
            card.innerHTML = `
                <p class="font-semibold text-gray-800">${entry.name}</p>
                <p class="text-gray-600">${entry.rollNo}</p>
                <p class="text-blue-600 font-medium">Gene: ${entry.gene}</p>
            `;
            cardContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading data:", error);
        cardContainer.innerHTML = "<p class='text-red-500'>Failed to load data.</p>";
    }
}

// Gene search function
searchBtn.addEventListener("click", async () => {
    const query = searchGene.value.trim().toUpperCase();
    if (!query) {
        alert("Please enter a gene name to search.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/search/${query}`);
        const result = await response.json();

        if (result.exists) {
            alert(`The gene "${query}" is already selected.`);
        } else {
            alert(`The gene "${query}" is available.`);
        }
    } catch (error) {
        console.error("Error searching gene:", error);
        alert("Failed to search for the gene. Please try again.");
    }
});

// Load existing data on page load
loadCards();
