function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

class CryptoDashboard {
  constructor() {
    this.coinDataContainer = document.getElementById("coinData");
    this.refreshButton = document.getElementById("refreshBtn");
    this.expandButton = document.getElementById("expandBtn");
    this.refreshButton.addEventListener("click", this.refreshData.bind(this));
    this.expandButton.addEventListener("click", this.toggleRows.bind(this));
    this.refreshData();
  }

  async refreshData() {
    try {
      this.expandButton.style.display = "none";
      const response = await fetch("https://api.coincap.io/v2/assets");
      const { data } = await response.json();
      this.renderCoinData(data);
    } catch (error) {
      console.error("An error occurred while fetching the data:", error);
    }
  }

  renderCoinData(assets) {
    this.expandButton.style.display = "inline";
    this.coinDataContainer.innerHTML = "";
    const percentFormatter = new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: 2,
    });
    assets.forEach((asset, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${asset.name}</td>
                <td>${asset.symbol}</td>
                <td>$${formatNumberWithSpaces(
                  parseFloat(asset.priceUsd).toFixed(2)
                )}</td>
                <td class="${
                  asset.changePercent24Hr >= 0 ? "positive" : "negative"
                }">${percentFormatter.format(
        parseFloat(asset.changePercent24Hr) / 100
      )}</td>
                <td>$${
                  asset.marketCapUsd
                    ? formatNumberWithSpaces(
                        parseFloat(asset.marketCapUsd).toFixed(2)
                      )
                    : "N/A"
                }</td>
                <td><a href="${
                  asset.explorer
                }" target="_blank">Info Link</a></td>
            `;
      this.coinDataContainer.appendChild(row);
    });
  }

  toggleRows() {
    const rows = this.coinDataContainer.getElementsByTagName("tr");
    for (let i = 20; i < rows.length; i++) {
      rows[i].classList.toggle("hidden-row");
    }
    this.expandButton.textContent =
      this.expandButton.textContent === "Expand" ? "Collapse" : "Expand";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CryptoDashboard();
});
