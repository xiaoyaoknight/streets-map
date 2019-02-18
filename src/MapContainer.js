import React, { Component } from 'react';
import { Map , Marker , GoogleApiWrapper , InfoWindow } from 'google-maps-react'
import "./App.css";

const style = {
    width: "100%",
    height: "100%",
    position: "absolute"
};

class LoadingContainer extends Component {
    state = {
        content: '加载中...'
    }
    componentDidMount() {
        this.timer = setTimeout(() => {
            this.setState({
                content: '加载超时，请检查网络！'
            });
        }, 1000);
    }
    componentWillUnmount() {
        // 清除计时器
        clearTimeout(this.timer);
    }
    render() {
        return (
            this.state.content
        )
    }
}

//引入FourSquare API
var foursquare = require("react-foursquare")({
    clientID: "AIRZBMKYSGK01J2WDA21RRZPY11IAV4HNUPCKLSNXOPVXJYE",
    clientSecret: "3NLLSRLAXPC0R3RNGWD2CKFCHF0RP3XU3L2UVPOZAD3LQMXB"
});

export class Container extends Component {
    state={
        map: null,
        currentMarker: {},
        showingInfo: false,
        selectLoc: null,
        item1: {},
        item2: {},
        errors: '',
        content: '加载中...'
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.setState({
                content: '加载超时，请检查网络！'
            });
        }, 1000);
    }
    componentWillUnmount() {
        // 清除计时器
        clearTimeout(this.timer);
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props.selectLoc);
        console.log(nextProps);
        console.log(this.refs);
        if (nextProps.selectLoc !== this.props.selectLoc) {
            const markers = this.refs;
            const marker = markers[nextProps.selectLoc.title].marker;
            this.setState({
                showingInfo: true,
                currentMarker: marker,
                selectLoc: nextProps.selectLoc
            });
            //获取搜索列表中点击的地点并执行第三方API的查询
            let loca = nextProps.selectLoc.location;
            this.searchClick(loca);
        }
    }
    

    onMarkerClick = (props, marker, e) => {
        // console.log(props, marker);
        // console.log(this.state.showingInfo);
        this.setState({
            showingInfo: true,
            currentMarker: marker,
            selectLoc: props
        });
        if (this.state.selectLoc !== null) {
            let loca = this.state.selectLoc.position;
            this.searchClick(loca);
        }
    }

    searchClick = loca => {
        let ll = loca.lat + "," + loca.lng;
        let query = this.props.location.title;
        this.setState({
            item1: {},
            item2: {}
        });
        foursquare.venues
            .getVenues({
                ll,
                query
            })
            .then(res => {
                this.setState({
                    item1: res.response.venues[0],
                    item2: res.response.venues[1]
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    errors: '发生了一些错误'
                });
            });
    };

    mapReady = (props, map) => {

        // console.log(props, map);
        this.setState({
            map: map
        });
    }

    mapClick = props => {
        if (this.state.showingInfo) {
            this.setState({
                showingInfo: false,
                currentMarker: null
            });
        }
    };

	render(){
        let locations = this.props.location;

        var bounds = new this.props.google.maps.LatLngBounds();
        for (var i = 0; i < locations.length; i++) {
            bounds.extend(locations[i].location);
        }

        let center;
        if (this.props.location.length !== 0 && this.props.location.length < 9) {
            center = this.props.location[0].location;
        } else {
            center = {
                lat: 30.2743848,
                lng: 120.1553389
            };
        }

        return(
            <Map
                style={style}
                google={this.props.google}
                zoom={12}
                center={center}
                bounds={bounds}
                onReady={this.mapReady}>
                {locations.map((loc) =>( 
                    <Marker	
                        key={loc.key}
                        title={loc.title}
                        position={loc.location}
                        ref={loc.title}
                        onClick={this.onMarkerClick}
                    />
                ))}
                <InfoWindow
                    visible={this.state.showingInfo}
                    marker={this.state.currentMarker}>
                    <div>
                        <h2>{this.state.selectLoc ? this.state.selectLoc.title : ""}</h2>
                        <div>Items:</div>
                        {this.state.item1 ? <p>{this.state.item1.name}</p> : "None"}
                        {this.state.item2 ? <p>{this.state.item2.name}</p> : "None"}
                        {this.state.errors ? <p>{this.state.errors}</p> : ""}
                        <p>(These data from FourSquare.)</p>
                    </div>
                </InfoWindow>
            </Map>
        )
	} 
}

export default GoogleApiWrapper({
    apiKey:'AIzaSyBEls_NbQ2Uw4B7Au7BOMkXmsobmAeSA0Y',
    LoadingContainer: LoadingContainer
})(Container)
