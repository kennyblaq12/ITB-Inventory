document.addEventListener("DOMContentLoaded", () => {
  const addNewAssetBtn = document.getElementById("addNewAssetBtn");
  const popup = document.getElementById("popup");
  const assetForm = document.getElementById("assetForm");
  const formTitle = document.getElementById("formTitle");
  const submitBtn = document.getElementById("Submit_Btn");
  const displayTableBody = document.querySelector("#displayTable tbody");
  const searchForm = document.querySelector(".search-form");
  const searchInput = searchForm.querySelector("input[name='search']");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const cards = document.querySelectorAll(".card");

  // Get references to the paragraph elements within each card for updating counts
  const totalAssetsCountP = document.getElementById("totalAssetsCount");
  const laptopsCountP = document.getElementById("laptopsCount");
  const monitorsCountP = document.getElementById("monitorsCount");
  const phonesCountP = document.getElementById("phonesCount");
  const printersCountP = document.getElementById("printersCount");
  const plotterCountP = document.getElementById("plotterCountP");
  const desktopCountP = document.getElementById("desktopCountP");

  // Variable to store the row being edited
  let editingRow = null;

  // Initial dummy data
  const initialAssets = [
    {
      assetTag: "ITB-L-001",
      category: "Laptops",
      assetName: "Dell Latitude",
      manufacturer: "Dell",
      model: "E7470",
      serialNumber: "SN123456",
      location: "Main Office", // Added Location
      assignedTo: "John Doe",
      department: "IT",
      date: new Date(2024, 0, 15, 10, 30).toLocaleString(),
      status: "Active",
    },
    {
      assetTag: "ITB-M-001",
      category: "Monitors",
      assetName: "LG Ultrawide",
      manufacturer: "LG",
      model: "29WL500",
      serialNumber: "SN789012",
      location: "Branch Office", // Added Location
      assignedTo: "Jane Smith",
      department: "HR",
      date: new Date(2024, 1, 20, 14, 0).toLocaleString(),
      status: "Active",
    },
    {
      assetTag: "ITB-P-001",
      category: "",
      assetName: "HP LaserJet",
      manufacturer: "HP",
      model: "M102a",
      serialNumber: "SN345678",
      location: "Warehouse", // Added Location
      assignedTo: "Office General",
      department: "Admin",
      date: new Date(2024, 2, 5, 9, 15).toLocaleString(),
      status: "Repairing",
    },
    {
      assetTag: "ITB-L-002",
      category: "plotter",
      assetName: "HP ProBook",
      manufacturer: "HP",
      model: "450 G8",
      serialNumber: "SN901234",
      location: "Main Office", // Added Location
      assignedTo: "Alice Brown",
      department: "Architecture",
      date: new Date(2024, 3, 1, 11, 45).toLocaleString(),
      status: "Damaged",
    },
    {
      assetTag: "ITB-PH-001",
      category: "Phones",
      assetName: "iPhone 13",
      manufacturer: "Apple",
      model: "A2633",
      serialNumber: "SN567890",
      location: "Sales Department", // Added Location
      assignedTo: "Bob White",
      department: "Import",
      date: new Date(2024, 4, 10, 16, 20).toLocaleString(),
      status: "Active",
    },
  ];

  // Function to add a single asset row to the table
  function addAssetToTable(asset) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${asset.assetTag}</td>
      <td>${asset.category}</td>
      <td>${asset.assetName}</td>
      <td>${asset.manufacturer}</td>
      <td>${asset.model}</td>
      <td>${asset.serialNumber}</td>
      <td>${asset.location || ""}</td> <td>${asset.assignedTo}</td>
      <td>${asset.department}</td>
      <td>${asset.date}</td>
      <td>${asset.status}</td>
      <td>
        <button class="edit-btn">Edit</button>
      </td>
    `;
    displayTableBody.appendChild(newRow);

    newRow.querySelector(".edit-btn").addEventListener("click", () => {
      openEditPopup(newRow);
    });
  }

  // Function to update card counts
  function updateCardCounts(change = 0, category = null) {
    totalAssetsCountP.textContent =
      parseInt(totalAssetsCountP.textContent) + change;

    if (category) {
      let targetP = null;
      switch (category.toLowerCase()) {
        case "laptops":
          targetP = laptopsCountP;
          break;
        case "monitors":
          targetP = monitorsCountP;
          break;
        case "phones":
          targetP = phonesCountP;
          break;
        case "printers":
          targetP = printersCountP;
          break;
        case "desktop":
          targetP = desktopCountP;
          break;
        case "plotter":
          targetP = plotterCountP;
        default:
          break;
      }

      if (targetP) {
        targetP.textContent = parseInt(targetP.textContent) + change;
      }
    }
  }

  // --- Initial Setup ---
  // Set initial counts to 0 before populating from dummy data
  totalAssetsCountP.textContent = 0;
  laptopsCountP.textContent = 0;
  monitorsCountP.textContent = 0;
  phonesCountP.textContent = 0;
  printersCountP.textContent = 0;
  plotterCountP.textContent = 0;
  desktopCountP.textContent = 0;

  // Initialize table with dummy data and update counts
  initialAssets.forEach((asset) => {
    addAssetToTable(asset);
    updateCardCounts(1, asset.category);
  });

  // Set "Total Assets" card as active by default and display all assets
  document.querySelector('.card[data-category="all"]').classList.add("active");
  filterAssetsByCategory("all");
  // --- End Initial Setup ---

  // 🔹 Show popup when "Add New Asset" button is clicked
  addNewAssetBtn.addEventListener("click", () => {
    editingRow = null; // Ensure we are in "add" mode
    formTitle.textContent = "Add New Asset";
    submitBtn.textContent = "Add Asset";
    assetForm.reset();
    popup.style.display = "flex";
  });

  // 🔹 Hide popup when user clicks outside the form content
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
      assetForm.reset(); // Reset form when closing
      editingRow = null; // Clear editing row reference
      formTitle.textContent = "Add New Asset"; // Reset title
      submitBtn.textContent = "Add Asset"; // Reset button text
    }
  });

  // 🔹 Function to open popup for editing
  function openEditPopup(row) {
    editingRow = row; // Store reference to the row being edited
    formTitle.textContent = "Edit Asset";
    submitBtn.textContent = "Update Asset";

    // Populate the form fields with data from the row
    const cells = row.cells;
    assetForm.asset_tag.value = cells[0].textContent;
    assetForm.Category.value = cells[1].textContent;
    assetForm.asset_name.value = cells[2].textContent;
    assetForm.Manufacturer.value = cells[3].textContent;
    assetForm.Model.value = cells[4].textContent;
    assetForm.serial_number.value = cells[5].textContent;
    assetForm.Location.value = cells[6].textContent; // Populate Location field
    assetForm.assigned_to.value = cells[7].textContent;
    assetForm.Department.value = cells[8].textContent;
    // Date (index 9) is display only, not edited via form in this setup
    assetForm.Status.value = cells[10].textContent; // Populate Status field (now at index 10)

    popup.style.display = "flex"; // Show the popup
  }

  assetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(assetForm);

    // Send form data to PHP file
    fetch("add_asset.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((result) => {
        // Add the new asset to the table and update counts
        const newAssetData = {
          assetTag: assetForm.asset_tag.value.trim().toUpperCase(),
          category: assetForm.Category.value.trim(),
          assetName: assetForm.asset_name.value.trim().toUpperCase(),
          manufacturer: assetForm.Manufacturer.value.trim().toUpperCase(),
          model: assetForm.Model.value.trim().toUpperCase(),
          serialNumber: assetForm.serial_number.value.trim().toUpperCase(),
          location: assetForm.Location.value.trim().toUpperCase(),
          assignedTo: assetForm.assigned_to.value.trim().toUpperCase(),
          department: assetForm.Department.value.trim().toUpperCase(),
          date: new Date().toLocaleString(),
          status: assetForm.Status.value.trim(),
        };

        if (editingRow) {
          const oldCategory = editingRow.cells[1].textContent.trim();
          editingRow.cells[0].textContent = newAssetData.assetTag;
          editingRow.cells[1].textContent = newAssetData.category;
          editingRow.cells[2].textContent = newAssetData.assetName;
          editingRow.cells[3].textContent = newAssetData.manufacturer;
          editingRow.cells[4].textContent = newAssetData.model;
          editingRow.cells[5].textContent = newAssetData.serialNumber;
          editingRow.cells[6].textContent = newAssetData.location;
          editingRow.cells[7].textContent = newAssetData.assignedTo;
          editingRow.cells[8].textContent = newAssetData.department;
          editingRow.cells[9].textContent = newAssetData.date;
          editingRow.cells[10].textContent = newAssetData.status;

          if (oldCategory !== newAssetData.category) {
            updateCardCounts(-1, oldCategory);
            updateCardCounts(1, newAssetData.category);
          }
        } else {
          addAssetToTable(newAssetData);
          updateCardCounts(1, newAssetData.category);
        }

        assetForm.reset();
        popup.style.display = "none";
        editingRow = null;
        formTitle.textContent = "Add New Asset";
        submitBtn.textContent = "Add Asset";

        filterAssetsByCategory(
          document.querySelector(".card.active")?.dataset.category || "all"
        );
      })
      .catch((error) => {
        console.error("Error submitting asset:", error);
        alert("Failed to submit asset. Please try again.");
      });
  });

  // Reset form and close popup
  assetForm.reset();
  popup.style.display = "none";
  editingRow = null; // Clear editing row reference
  formTitle.textContent = "Add New Asset"; // Reset title
  submitBtn.textContent = "Add Asset"; // Reset button text

  // Re-filter/display all assets based on the current card selection
  filterAssetsByCategory(
    document.querySelector(".card.active")?.dataset.category || "all"
  );
});

// 🔹 Function: Filter and display assets based on category
function filterAssetsByCategory(category) {
  const allRows = Array.from(displayTableBody.rows);
  allRows.forEach((row) => {
    const rowCategory = row.cells[1].textContent.toLowerCase(); // Category is in the second column (index 1)
    const rowStatus = row.cells[10].textContent.toLowerCase(); // Status is now in the eleventh column (index 10)
    const keyword = searchInput.value.toLowerCase().trim(); // Get current search keyword

    const categoryMatches =
      category === "all" || rowCategory.includes(category.toLowerCase());

    const searchMatches =
      keyword === "" ||
      Array.from(row.cells).some((cell, index) => {
        // Exclude the 'Action' column from search, which is now index 11
        return index < 11 && cell.textContent.toLowerCase().includes(keyword);
      });

    row.style.display = categoryMatches && searchMatches ? "" : "none";
  });
}

// 🔹 Add click event listeners to each card for filtering
cards.forEach((card) => {
  card.addEventListener("click", () => {
    // Remove 'active' class from all cards
    cards.forEach((c) => c.classList.remove("active"));
    // Add 'active' class to the clicked card
    card.classList.add("active");

    const category = card.dataset.category; // Get category from data-category attribute
    filterAssetsByCategory(category);
  });
});

// 🔹 Handle search functionality
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  filterAssetsByCategory(
    document.querySelector(".card.active")?.dataset.category || "all"
  );
});

// 🔹 Restore full list when search input is cleared
searchInput.addEventListener("input", function () {
  if (searchInput.value.trim() === "") {
    filterAssetsByCategory(
      document.querySelector(".card.active")?.dataset.category || "all"
    );
  } else {
    filterAssetsByCategory(
      document.querySelector(".card.active")?.dataset.category || "all"
    );
  }
});

// 🔹 Clear search input button
clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterAssetsByCategory(
    document.querySelector(".card.active")?.dataset.category || "all"
  );
});
