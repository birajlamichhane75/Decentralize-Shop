import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {

    let handelClick = async () => {
        let accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        let account =  ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }

    return (
        <nav>
            <div className='grid grid-cols-3 px-10 py-3'>
                <div className='nav__brand'>
                    <h1 className='font-bold text-3xl text-white'>D-SHOP</h1>
                </div>

                <div className='nav__brand'>
                    <input className='nav__search' type="text" placeholder='Search products..' />
                </div>

                <div className='nav__brand'>
                    {
                        account ?
                            <button
                                className='nav__connect'
                            >
                               {account.slice(0, 6)+ "..." + account.slice(-4)}
                            </button>
                            :
                            <button
                                onClick={handelClick}
                                className='nav__connect'
                            >
                                Connect
                            </button>
                    }


                </div>
            </div>

            <div className='nav__links'>
                <li><a href="#first">Clothing & Jewellery</a></li>
                <li><a href="#second">Electoronic & Gadget</a></li>
                <li><a href="#third">Toys & Gaming</a></li>
            </div>
        </nav>
    );
}

export default Navigation;