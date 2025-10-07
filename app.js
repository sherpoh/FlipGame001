const contractAddress = "0x0a26278EDF60c74ddcfce3fCFc9Bb113C09C6894";

let provider, signer, contract;

// Fungsi koneksi wallet
document.getElementById("connectBtn").onclick = async () => {
  if (window.okxwallet) {
    provider = new ethers.providers.Web3Provider(window.okxwallet);
  } else if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    document.getElementById("status").innerText = "Tidak ada wallet yang terdeteksi.";
    return;
  }

  try {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const response = await fetch('./abi.json');
    const abi = await response.json();
    contract = new ethers.Contract(contractAddress, abi, signer);

    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = `Wallet terhubung: ${address}`;
    document.getElementById("status").innerText = "Wallet berhasil terhubung.";
  } catch (err) {
    document.getElementById("status").innerText = "Gagal koneksi wallet: " + err.message;
  }
};

// Fungsi mainkan flip
async function playFlip() {
  if (!contract) {
    document.getElementById("status").innerText = "Hubungkan wallet terlebih dahulu.";
    return;
  }

  const choice = document.getElementById("choice").value;
  const bet = document.getElementById("betAmount").value;

  if (!bet || bet <= 0) {
    document.getElementById("status").innerText = "Masukkan jumlah taruhan yang valid.";
    return;
  }

  const value = ethers.utils.parseEther(bet);

  try {
    const tx = await contract.playFlip(choice, { value });
    document.getElementById("status").innerText = "Transaksi dikirim: " + tx.hash;
    await tx.wait();
    document.getElementById("status").innerText = "Flip selesai!";
  } catch (err) {
    document.getElementById("status").innerText = "Error saat flip: " + err.message;
  }
}

// Fungsi redeem FLIP
async function redeemFLIP() {
  if (!contract) {
    document.getElementById("status").innerText = "Hubungkan wallet terlebih dahulu.";
    return;
  }

  const amount = document.getElementById("redeemAmount").value;

  if (!amount || amount <= 0) {
    document.getElementById("status").innerText = "Masukkan jumlah FLIP yang valid.";
    return;
  }

  const tokens = ethers.utils.parseUnits(amount, 18);

  try {
    const tx = await contract.redeemFLIP(tokens);
    document.getElementById("status").innerText = "Convert dikirim: " + tx.hash;
    await tx.wait();
    document.getElementById("status").innerText = "FLIP berhasil ditukar!";
  } catch (err) {
    document.getElementById("status").innerText = "Error saat convert: " + err.message;
  }
}
