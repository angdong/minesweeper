// refer to https://velog.io/@home_2201/JS%EB%A1%9C-%EC%A7%80%EB%A2%B0%EC%B0%BE%EA%B8%B0%EB%A5%BC-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%90

$(document).ready(function() {
  // setting gameboard and mines
  const size = Number(sessionStorage.getItem("size"));
  const numMine = Number(sessionStorage.getItem("mine"));
  // to access all the td element(equal to tile)
  const tdArr = document.getElementsByTagName("td");
  // variable for checking clicked tile. If it is same as (gameboard size - mine), then game end!
  var clickedTile = 0;

  // for disable mouse-right button
  fn_control_mouse();

  let tableEle = '<table>';

  // make gameboard with respect to the size
  for (let i = 0; i < size; i++) {
    tableEle += '<tr>';
    for (let j = 0; j < size; j++) {
      tableEle += '<td>0</td>'
    }
    tableEle += '</tr>';
  }
  tableEle += '</table>';
  document.getElementById("gameBoard").innerHTML = tableEle;

  // to set mines in gameboard randomly
  let mineArr = [];
  for (let i = 0; i < numMine; i++) {
    let randomNum = Math.floor(Math.random() * size * size);
    if (mineArr.indexOf(randomNum) === -1) {
      mineArr.push(randomNum);
    } else {
      i--;
    }
  }

  // set the value of tiles with number of mines nearby
  for (let i = 0; i < tdArr.length; i++) {
    if (mineArr.indexOf(i) !== -1) {
      // if it is mine!
      tdArr[i].classList.add("mine");
      // to access td element
      var now_row = parseInt(i / size);
      var now_col = i % size;

      $('table tr:eq(' + String(now_row) + ')>td:eq(' + String(now_col) + ')').html("");
      // iteration to fill out the tile's number(that indicate the number of mines nearby it)
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
          if (now_row + j >= 0 && now_row + j < size && now_col + k >= 0 && now_col + k < size) {
            var tmp = Number($('table tr:eq(' + String(now_row + j) + ')>td:eq(' + String(now_col + k) + ')').html());
            $('table tr:eq(' + String(now_row + j) + ')>td:eq(' + String(now_col + k) + ')').html(String(tmp + 1));
          }
        }
      }
    }
  }
  // set color of tile's number
  for (let i = 0; i < tdArr.length; i++) {
    var now_row = parseInt(i / size);
    var now_col = i % size;
    if (mineArr.indexOf(i) == -1) {
      // check whether tile is mine
      var number = Number($('table tr:eq(' + String(now_row) + ')>td:eq(' + String(now_col) + ')').html());
      $('table tr:eq(' + String(now_row) + ')>td:eq(' + String(now_col) + ')').addClass('color_' + String(number));
    } else {
      // if it is mine, then erase the number
      $('table tr:eq(' + String(now_row) + ')>td:eq(' + String(now_col) + ')').html("");
    }
    $('table tr:eq(' + String(now_row) + ')>td:eq(' + String(now_col) + ')').addClass('unclicked');
  }

  var width = size * 30;
  // set width of boards
  $("#gameBoard").width(String(width) + "px");
  $(".stateBar").width(String(width) + "px");
  $("#goMain").width(String(width) + "px");

  $("#leftMine").html(numMine);
  $("#time").html("0");

  // count-up timer
  setInterval(function() {
    if ($("#leftMine").html() != 0) {
      $("#time").html(String(Number($("#time").html()) + 1));
    }
  }, 1000);

  // if you click centered emoji, then page will be reloaded
  $(".emoji").on("click", function() {
    location.reload();
  });

  // click some tile
  $("td").on("click", function() {
    // can't click already clicked tile or flag tile
    if ($(this).hasClass("unclicked") !== true || $(this).hasClass("flag") == true) {
      return;
    }
    $(this).removeClass("question");
    $(this).removeClass("unclicked");
    if ($(this).hasClass("mine") === true) {
      // if the clicked tile is mine
      $('#leftMine').html('0');
      for (let i = 0; i < size * size; i++) {
        // variables to access td element
        var now_row = parseInt(i / size);
        var now_col = i % size;
        var tile = 'table tr:eq(' + String(now_row) + ')>td:eq(' + String(now_col) + ')';
        if ($(tile).hasClass("mine") == true) {
          // change all the styles and classes of mine tiles
          $(tile).removeClass("unclicked");
          $(tile).removeClass("flag");
          $(tile).removeClass("question");
          $(tile).css("background-image", "url(./assets/mine.png)");
          $(tile).css("background-color", '#747474');
        } else {
          if ($(tile).hasClass("unclicked") == true) {
            $(tile).removeClass("unclicked");
            $(tile).css("color", '#B0B2B2');
          }
        }
      }
      $(this).css("background-color", "DarkRed");
      $(this).css("border-color", "DarkRed");
      $(".emoji").css("background-image", "url(./assets/no.png)");
    } else {
      clickedTile += 1;
      if (clickedTile == size * size - numMine) {
        // game end
        $('#leftMine').html('0');
        for (let i = 0; i < size * size; i++) {
          var now_row = parseInt(i / size);
          var now_col = i % size;
          var tile = 'table tr:eq(' + String(now_row) + ')>td:eq(' + String(now_col) + ')';
          if ($(tile).hasClass('unclicked') === true) {
            // unclicked tiles are mine tiles that are marked with flags
            $(tile).removeClass('unclicked');
            $(tile).addClass('flag');
            $(tile).css("background-image", "url(./assets/flag.png)");
            $(tile).css("background-color", "#747474");
          }
        }
        // change emoji that indicate the end of game
        $(".emoji").css("background-image", "url(./assets/complete.png)");
        var leftTime = String($("#time").html());
        alert("Congratulations!\nYou win in " + leftTime + " seconds!");
        return;
      }
      if ($(this).html() == 0) {
        // if  clicked tile is 0(ther's no mine nearby it)
        // then open near tiles other than mines or flags
        var now_row = $(this).parent().index();
        var now_col = $(this).index();
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (i + j == 1 || i + j == -1) {
              // nearby tiles with diagonal will be excepted
              if (now_row + i >= 0 && now_row + i < size && now_col + j >= 0 && now_col + j < size) {
                // td's position should be constraint to gameboard
                var nextTile = $('table tr:eq(' + String(now_row + i) + ')>td:eq(' + String(now_col + j) + ')');
                if ($(nextTile).hasClass("mine") !== true) {
                  if ($(nextTile).hasClass("unclicked") === true && $(nextTile).hasClass("flag") !== true) {
                    // for the tiles near the clicked tile, open all
                    // except flags and mines
                    $(nextTile).trigger("click");
                  }
                  // not mine and don't have number
                }
              }
            }
          }
        }
      }
    }
  })

  $("td").mousedown(function(e) {
    $(this)[0].oncontextmenu = function() {
      // for disabling contextmenu that seen when you right-mouse down
      return false;
    }
    if (e.which == 2) {
      // wheel button. trigger click events nearby its tile
      if ($(this).hasClass("unclicked") !== true) {
        var now_row = $(this).parent().index();
        var now_col = $(this).index();
        var mineCheck = 0;
        var numFlag = 0;
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (now_row + i >= 0 && now_row + i < size && now_col+j >= 0 && now_col+j < size) {
              // constraint to follow gameboard size
              var nextTile = $('table tr:eq(' + String(now_row + i) + ')>td:eq(' + String(now_col + j) + ')');
              if ($(nextTile).hasClass("flag") !== true) {
                $(nextTile).trigger("click");
              } else {
                numFlag += 1;
                if ($(nextTile).hasClass("mine")) {
                  mineCheck += 1;
                }
              }
            }
          }
        }
        if (mineCheck == $(this).html() && mineCheck == numFlag) {
          // if correctly put flags
          // -> put flags on all of the mine tiles and not put flags on the others
          //    for nearby tiles
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              if (now_row + i >= 0 && now_row + i < size && now_col+j >= 0 && now_col+j < size) {
                var nextTile = $('table tr:eq(' + String(now_row + i) + ')>td:eq(' + String(now_col + j) + ')');
                if ($(nextTile).hasClass("flag") == true && $(nextTile).hasClass("unclicked") == true) {
                  // disable the mines
                  $(nextTile).removeClass("unclicked");
                  $(nextTile).css("background-color", '#747474');
                  $('#leftMine').html(String(Number($('#leftMine').html()) - 1));
                }
              }
            }
          }
        }
      }
    }
    if (e.which == 3) {
      // right button of mouse
      // original block -> flag -> question mark, iteratevely
      if ($(this).hasClass("unclicked") !== true) {
        // right mouse button only available with already clicked tiles
        return;
      }
      // set flag or quesion mark
      // $(this).removeClass("unclicked");
      if ($(this).hasClass("flag") == true) {
        // already have flag -> set question mark
        if ($(this).hasClass("mine") == true) {
          $(this).css("background-image", "url(./assets/question.png)");
        }
        $(this).removeClass("flag");
        $(this).addClass("question");
      } else if ($(this).hasClass("question") == true) {
        // already have question mark -> erase it
        if ($(this).hasClass("mine") == true) {
          $(this).css("background-image", "url(./assets/mine.png)");
        }
        $(this).removeClass("question");
      } else {
        // nothing on it -> put on a flag
        if ($(this).hasClass("mine") == true) {
          $(this).css("background-image", 'url(./assets/flag.png)');
        }
        $(this).addClass("flag");
      }
    }
  });
});

function fn_control_mouse() {
  // to disable mouse drag.
  // if drag is allowed, then tiles' number can be exposed
  $(document).bind('selectstart', function() {
    return false;
  });
  $(document).bind('dragstart', function() {
    return false;
  });
}
