function init() {
    window.kolommen = 7;
    window.rijen = 6;
    window.rijlengte = 4;
    
    window.spelersBeurt = 0;
    window.grid = [[], [], [], [], [], []];
    window.einde = false;
}

function vieropeenrij(e) {
  function updateMatches(value, matches) {
    return value === spelersBeurt ? (matches || 0) + 1 : 0;
  }

    var colIndex = e.target.cellIndex
    if (einde || typeof colIndex === "undefined") {
      return;
    }
    // Laat vallen
    var i, rowIndex;
    for (i = rijen - 1; i >= 0; i--) {
      if (typeof grid[i][colIndex] === "undefined") {
        rowIndex = i;
        break;
      }
    }
    if (typeof rowIndex === "undefined") {
      return;
    }
    // zet het stukje neer
    grid[rowIndex][colIndex] = spelersBeurt;
    // tel lengte
    var matchesHoriz, matchesVert, matchesDiagonal1, matchesDiagonal2;
    for (i = 0; i < kolommen; i++) {
      // horizontaal
      matchesHoriz = updateMatches(grid[rowIndex][i], matchesHoriz);
      if (i < rijen) {
        // vertikaal
        matchesVert = updateMatches(grid[i][colIndex], matchesVert);
        // diagonaal
        matchesDiagonal1 = updateMatches(
          grid[i][colIndex + rowIndex - i], matchesDiagonal1);
        matchesDiagonal2 = updateMatches(
          grid[i][colIndex - rowIndex + i], matchesDiagonal2);
      }
      // gewonnen?
      if (matchesHoriz >= rijlengte ||
          matchesVert >= rijlengte ||
          matchesDiagonal1 >= rijlengte ||
          matchesDiagonal2 >= rijlengte) {
        einde = true;
      }
    }
    if (einde) {
      return spelersBeurt ? "Rood wint" : "Geel wint";
    }
    // Update bord
    var ret = [spelersBeurt ? "red" : "yellow", rowIndex, colIndex];
    // beurt naar andere speler
    spelersBeurt = spelersBeurt ? 0 : 1;
    return ret;
}