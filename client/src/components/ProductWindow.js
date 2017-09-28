import React from 'react';

import './styles/ProductWindow.css';

class ProductWindow extends React.Component {
    

    render() {
        return (
            <div className="product-window">
                <div className="item-overview">
                    <h2>Coke</h2>
                    <p>Added by Jon</p>
                    <img src="http://via.placeholder.com/350x150"/>
                </div>
                <div className="item-info">
                    <table>
                        <tr>
                            <th>Price</th>
                            <th>$50</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>UPC Code</th>
                            <th>21345515093</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>Store 1</th>
                            <th>Target</th>
                            <th>Not in stock</th>
                        </tr>
                        <tr>
                            <th>Store 2</th>
                            <th>Gas station on Main St</th>
                            <th>Last seen by Dan</th>
                        </tr>
                    </table>
                </div>
            </div>
        )
    }
}

export default ProductWindow;
