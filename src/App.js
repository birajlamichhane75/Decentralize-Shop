import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'

function App() {
  const [account, setaccount] = useState(null);
  const [provider, setprovider] = useState();
  const [dappazon, setdappazon] = useState();
  const [electronics, setelectronics] = useState();
  const [clothing, setclothing] = useState();
  const [toys, settoys] = useState();
  const [item, setitem] = useState({});
  const [toggle, settoggle] = useState(false);

  let togglePop = (item) => {
    setitem(item);
    console.log(item);
    settoggle(!toggle)

  }


  let loadBlockchainDate = async () => {
    // connect to blockchain
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    setprovider(provider);
    let network = await provider.getNetwork();

    // connect to smart contract 
    let dappazon = new ethers.Contract(config[network.chainId].dappazon.address, Dappazon, provider);
    setdappazon(dappazon)

    // load product
    const items = [];

    for (let i = 0; i < 9; i++) {
      const item = await dappazon.idToProduct(i + 1);
      items.push(item)
    }

    let electronic = items.filter((item) => item.category === "electronics");
    let clothing = items.filter((item) => item.category === "clothing");
    let toys = items.filter((item) => item.category === "toys");
    setelectronics(electronic)
    setclothing(clothing)
    settoys(toys)


  }



  useEffect(() => {
    loadBlockchainDate();
  }, []);



  return (
    <div>
      <Navigation account={account} setAccount={setaccount} />

      <h2 className='font-bold'>D-SHOP Best Seller</h2>
      {
        electronics && clothing && toys && (
          <>
            <div id="first">
              <Section title={"Clothing & Jewelery"} items={clothing} togglePop={togglePop} />
            </div>

            <div id="second">
              <Section id="second" title={"Electronics and Gadget"} items={electronics} togglePop={togglePop} />
            </div>

            <div id="third">
              <Section id="third" title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
            </div>
          </>
        )
      }

      {
        toggle && <Product togglePop={togglePop} item={item} provider={provider} account={account} dappazon={dappazon} />
      }

    </div>
  );
}

export default App;
