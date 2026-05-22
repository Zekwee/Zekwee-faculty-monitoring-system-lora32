import { onMount } from "../../core/hooks.js";

export default function Filters(onFilterChange) {
  onMount(() => {
    const dateStartInput = document.getElementById("filter-date-start");
    const dateEndInput = document.getElementById("filter-date-end");
    const roomIdInput = document.getElementById("filter-room-id");
    const uidInput = document.getElementById("filter-uid");
    const clearButton = document.getElementById("clear-filters-btn");

    let debounceTimer;

    // Debounce function for text inputs (300ms)
    function debounce(callback, value) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        callback(value);
      }, 300);
    }

    // Handle date start change
    if (dateStartInput) {
      dateStartInput.addEventListener("change", (e) => {
        const dateStart = e.target.value ? new Date(e.target.value).getTime() : null;
        onFilterChange({ dateStart });
      });
    }

    // Handle date end change
    if (dateEndInput) {
      dateEndInput.addEventListener("change", (e) => {
        const dateEnd = e.target.value ? new Date(e.target.value + "T23:59:59").getTime() : null;
        onFilterChange({ dateEnd });
      });
    }

    // Handle room ID input with debouncing
    if (roomIdInput) {
      roomIdInput.addEventListener("input", (e) => {
        debounce((value) => {
          onFilterChange({ roomId: value });
        }, e.target.value);
      });
    }

    // Handle UID input with debouncing
    if (uidInput) {
      uidInput.addEventListener("input", (e) => {
        debounce((value) => {
          onFilterChange({ uid: value });
        }, e.target.value);
      });
    }

    // Handle clear filters button
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        // Clear all input values
        if (dateStartInput) dateStartInput.value = "";
        if (dateEndInput) dateEndInput.value = "";
        if (roomIdInput) roomIdInput.value = "";
        if (uidInput) uidInput.value = "";

        // Reset filters
        onFilterChange({
          dateStart: null,
          dateEnd: null,
          roomId: "",
          uid: ""
        });
      });
    }
  });

  return `
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Filters</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Date Start Filter -->
        <div>
          <label for="filter-date-start" class="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="filter-date-start"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <!-- Date End Filter -->
        <div>
          <label for="filter-date-end" class="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            id="filter-date-end"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <!-- Room ID Filter -->
        <div>
          <label for="filter-room-id" class="block text-sm font-medium text-gray-700 mb-2">
            Room ID
          </label>
          <input
            type="text"
            id="filter-room-id"
            placeholder="e.g., room_1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <!-- UID Filter -->
        <div>
          <label for="filter-uid" class="block text-sm font-medium text-gray-700 mb-2">
            UID
          </label>
          <input
            type="text"
            id="filter-uid"
            placeholder="e.g., D9:1B:2E:12"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <!-- Clear Filters Button -->
      <div class="mt-4">
        <button
          id="clear-filters-btn"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  `;
}
