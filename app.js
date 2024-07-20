window.addEventListener('load', function() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    } else {
        console.log('Please install MetaMask!');
        alert('Please install MetaMask to use this dApp!');
    }

    const contractAddress = '0xYourContractAddress';  // Replace with your contract address
    const contractABI = [ /* ABI from your compiled contract */ ];

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const dataForm = document.getElementById('dataForm');
    const dataDisplay = document.getElementById('dataDisplay');

    dataForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const humidity = document.getElementById('humidity').value;
        const temperature = document.getElementById('temperature').value;
        const turbidity = document.getElementById('turbidity').value;
        const ph = document.getElementById('ph').value;
        const conductivity = document.getElementById('conductivity').value;

        const accounts = await web3.eth.getAccounts();

        contract.methods.addData(humidity, temperature, turbidity, ph, conductivity)
            .send({ from: accounts[0] })
            .on('receipt', function(receipt) {
                console.log('Data successfully added!', receipt);
                alert('Data successfully added!');
            })
            .on('error', function(error) {
                console.error('Error adding data:', error);
                alert('Error adding data. Check the console for more details.');
            });
    });

    async function loadData() {
        const dataCount = await contract.methods.dataRecords().call();
        dataDisplay.innerHTML = '';

        for (let i = 0; i < dataCount.length; i++) {
            const data = await contract.methods.getData(i).call();
            dataDisplay.innerHTML += `<p>Timestamp: ${new Date(data.timestamp * 1000).toLocaleString()}</p>
                                      <p>Humidity: ${data.humidity}</p>
                                      <p>Temperature: ${data.temperature}</p>
                                      <p>Turbidity: ${data.turbidity}</p>
                                      <p>pH: ${data.ph}</p>
                                      <p>Conductivity: ${data.conductivity}</p><hr>`;
        }
    }

    loadData();
});
