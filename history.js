document.addEventListener("DOMContentLoaded", () => {
  fetch("info.json")
    .then(res => res.json())
    .then(data => {
      const tableBody = document.getElementById("history-table");

      data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td class="px-4 py-2">${item.dateTime}</td>
          <td class="px-4 py-2">${item.method}</td>
          <td class="px-4 py-2 ${item.status === 'successful' ? 'text-green-400' : 'text-red-400'}">
            ${item.status}
          </td>
          <td class="px-4 py-2">${item.location}</td>
          <td class="px-4 py-2 font-bold">${item.amount}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(err => console.error("Error loading JSON:", err));
});
