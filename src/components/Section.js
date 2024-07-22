import { ethers } from 'ethers'

// Components
import Rating from './Rating'

const Section = ({ title, items, togglePop }) => {
    return (
        <div className='cards__section'>
            <h3 className='font-semibold'>{title}</h3>
            <hr />

            <div className="cards">
                {
                    items && items.map((item, i) => {
                        return (
                            <div key={i} className='card' onClick={()=>{
                                togglePop(item)
                            }}>
                                <img src={item.image} alt="" />
                                <div className="card__info">
                                    <h4>{item.name}</h4>
                                    <div className='rating'><Rating value={item.rating}/></div>
                                    <p>{ethers.utils.formatEther(item.cost.toString())} ETH</p>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    );
}

export default Section;