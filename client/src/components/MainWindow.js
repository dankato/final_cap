import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { render } from 'react-dom';
// import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { fetchItems } from '../actions/';

import ProductWindow from './ProductWindow';
import './styles/MainWindow.css';
import './styles/ProductWindow.css';


class MainWindow extends React.Component {
    constructor(props){
        super(props);
        this.state = {id: this.props.match.params.id}
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({id: nextProps.id})
        // console.log(this.state)
    }

    componentDidMount() {
        if(this.props.match.params.itemId) {
            this.props.dispatch(fetchItems(this.props.match.params.itemId));
        } else {
            console.log(this.props, 'THESE ARE THE PROPS FROM ELSE IN COMPDIDMOUNT')
            this.props.dispatch(fetchItems("1"));
            // alert('NOPE')
        }
      }
      
    
        renderResults() {
            // console.log('MAINWINDOW PROPS', this.props);            
        
        
        
             
        if (this.props.loading) {
            // return <Spinner spinnerName="circle" noFadeIn />;

            console.log('LOADING');
            return <div>loading items...</div>;
        }
      
        if (this.props.error) {
            return (
              <strong>
                {this.props.error}
              </strong>
            );
          }
          if (this.props.activeItem === null) {

            console.log('NULL ERROR');
              return (
                  <div className="product-window">
                      <p>didnt work</p>
                  </div>
              )
          }
        if (this.props.activeItem) {
            const currentItem = this.props.activeItem;
            const storeData = currentItem.stores.map((item, index) =>
                <tr key={index}>
                    <th>Store</th>
                    <th>{item.name}</th>
                    <th>{item.inventory}</th>
                </tr>
        );

        return (
            <div className="product-window">
                <div className="item-overview">
                    <h2>{currentItem.itemName}</h2>
                    <p>Added by {currentItem.creator}</p>
                    <img src={currentItem.image}/>
                </div>
                <div className="item-info">
                    <table>
                        <tr>
                            <th>Price</th>
                            <th>${currentItem.price}</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>UPC Code</th>
                            <th>{currentItem.upcCode}</th>
                            <th></th>
                        </tr>
                        {storeData}
                    </table>
                </div>
            </div>
        )
    }
        }
        
    
    render() {
        return (
          <div className="user-data">
            <div className="user-sessions-container">
              {this.renderResults()}
              {/* <p>Hello</p> */}
            </div>
          </div>
        );
      }

    }
const mapStateToProps = function(state) {
    return {
        loggedIn: state.loggedIn,
        itemData: state.itemData,
        activeItem: state.activeItem
    };
};

export default connect(mapStateToProps)(MainWindow);
