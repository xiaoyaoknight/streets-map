import React, { Component } from 'react';
import './App.css';
import escapeRegExp from 'escape-string-regexp';
import MapContainer from './MapContainer'
import locations from "./Locations.js";
import Nav from "./Nav";
import Menu from "./Menu";

class App extends Component {
    state = {
        location: [],
        navShow: false,
        selectLoc: {}
    }

    componentDidMount() {
        this.setState({
            location: locations
        });
    }

    /*侧边栏显示*/
    navChange() {
        this.setState({ navShow: !this.state.navShow });
    }

    /*搜索过滤list和marker*/
    filterLocation(query) {
        this.setState({ query: query });
        let showLocations = [];

        if (query.trim() !== "") {
        const match = new RegExp(escapeRegExp(query), "i");
        showLocations = locations.filter(loc => {
            return match.test(loc.title);
        });
        this.setState({
            location: showLocations
        });
        } else {
        this.setState({
            location: locations
        });
        }
    }

    showClickLoc(loc) {
        this.setState({ selectLoc: loc });
    }

    render() {
        return (
            <div id="container">
                <Nav
                location={this.state.location}
                navBar={this.state.navShow}
                queryLocation={query => this.filterLocation(query)}
                showClickLoc={loc => this.showClickLoc(loc)}
                />
                <div className="main">
                    <Menu navChange={() => this.navChange()} />
                    <div className="map">
                        <MapContainer
                            location={this.state.location}
                            selectLoc={this.state.selectLoc}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
