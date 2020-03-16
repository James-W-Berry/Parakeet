import React, { Component } from "react";
import SearchBar from "material-ui-search-bar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

class SearchForPerson extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <SearchBar
          onChange={() => console.log("onChange")}
          onRequestSearch={() => console.log("onRequestSearch")}
          style={{
            margin: "0 auto",
            maxWidth: "33vw",
            minWidth: "25vw"
          }}
        />
      </MuiThemeProvider>
    );
  }
}

export default SearchForPerson;
