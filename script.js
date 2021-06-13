const nameInput = document.getElementById('nameinput');
const table = document.getElementById('table');
const popup = document.querySelector('.popup');
const pagination = document.getElementById('pagination');
const perpagenum = document.getElementById('perpagenumber');
let playerName = nameInput.value;
let pageNumber = 1;
let perPageNumber =25;
let transaction = {};
let player_infos = [];
let number_buttons;
let paginationButtons;
table.style.display = "none";

let flag = false;


document.getElementById('getPlayers').addEventListener
('click', playerInput);
document.getElementById('getTeams').addEventListener
('click', searchTeams);
perpagenum.addEventListener('change', displayPerPage);


function displayPerPage(e) {
    perPageNumber = e.target.value;
    playerInput();
}

function showPopup(id) { 
    const playerID = player_infos.filter(player_info => player_info.id === id)[0]

    let tempPopup = ``;

    fetch(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${id}`)
    .then((res) => res.json())
    .then((data) => {

        console.log(data.data.length);
        document.querySelector('.modal-body').style = "padding-top: 0px; padding-left: 0px; padding-right: 0px;"
        document.querySelector('.img-close').innerHTML = `<i class="fas fa-window-close" onclick="hidePopup()"></i>`;
        document.getElementById('playername').innerHTML = `<b>${playerID.firstname} ${playerID.lastname}</b>`;
        if (data.data.length === 0) {
            document.getElementById('dataPopup').innerHTML = `<tr id="trpopupbody">
                                                             <td id="tdpopup">NA</td>
                                                             <td id="tdpopup">NA</td>
                                                             <td id="tdpopup">NA</td>
                                                             <td id="tdpopup">NA</td>
                                                             <td id="tdpopup">NA</td>
                                                             <td id="tdpopup">NA</td>
                                                             <td id="tdpopup">NA</td>
                                                             <td id="tdpopup">NA</td>
                                                             <td id="tdpopup">NA</td>
                                                             <td id="tdpopup">NA</td></tr>`;
        } else {
            tempPopup +=`<tr id="trpopupbody">`;
            tempPopup +=`<td id="tdpopup">${data.data[0].min}</td>`;
            tempPopup +=`<td id="tdpopup">${data.data[0].fg_pct}</td>`;
            tempPopup +=`<td id="tdpopup">${data.data[0].ft_pct}</td>`;
            tempPopup +=`<td id="tdpopup">${data.data[0].fg3m}</td>`;
            tempPopup +=`<td id="tdpopup">${data.data[0].pts}</td>`;
            tempPopup +=`<td id="tdpopup">${data.data[0].reb}</td>`;
            tempPopup +=`<td id="tdpopup">${data.data[0].ast}</td>`;
            tempPopup +=`<td id="tdpopup">${data.data[0].stl}</td>`;
            tempPopup +=`<td id="tdpopup">${data.data[0].blk}</td>`;
            tempPopup +=`<td id="tdpopup">${data.data[0].turnover}</td><tr>`;

            document.getElementById('dataPopup').innerHTML = tempPopup;
        }
    });

    popup.classList.add('open');

}

function hidePopup() {
    popup.classList.remove('open');
}

// PAGINATION START
const pageNumbers = (total, max, current) => {
    const half = Math.floor(max / 2);
    let to = max;
    
    if(current + half >= total) {
      to = total;
    } else if(current > half) {
      to = current + half ;
    }
    
    let from = to - max;
  
    return Array.from({length: max}, (_, i) => (i + 1) + from);
  }
  
function PaginationButton(totalPages, maxPagesVisible = 10, currentPage = 1) {
    let pages = pageNumbers(totalPages, maxPagesVisible, currentPage);
    let currentPageBtn = null;
    const buttons = new Map();
    const disabled = {
      start: () => pages[0] === 1,
      prev: () => currentPage === 1,
      end: () => pages.slice(-1)[0] === totalPages,
      next: () => currentPage === totalPages
    }
    const frag = document.createDocumentFragment();
    const paginationButtonContainer = document.createElement('div');
    paginationButtonContainer.className = 'pagination-buttons';
    
    const createAndSetupButton = (label = '', cls = '', disabled = false, handleClick) => {
      const buttonElement = document.createElement('button');
      buttonElement.textContent = label;
      buttonElement.className = `page-btn ${cls}`;
      buttonElement.disabled = disabled;
      buttonElement.addEventListener('click', e => {
        handleClick(e);
        this.update();
        paginationButtonContainer.value = currentPage;
        paginationButtonContainer.dispatchEvent(new Event('change'));
      });
      
      return buttonElement;
    }
    
    const onPageButtonClick = e => currentPage = Number(e.currentTarget.textContent);
    
    const onPageButtonUpdate = index => (btn) => {
      btn.textContent = pages[index];
      
      if(pages[index] === currentPage) {
        currentPageBtn.classList.remove('active');
        btn.classList.add('active');
        currentPageBtn = btn;
        currentPageBtn.focus();
      }
    };
    
    buttons.set(
      createAndSetupButton('start', 'start-page', disabled.start(), () => currentPage = 1),
      (btn) => btn.disabled = disabled.start()
    )
    
    buttons.set(
      createAndSetupButton('prev', 'prev-page', disabled.prev(), () => currentPage -= 1),
      (btn) => btn.disabled = disabled.prev()
    )
    
    pages.map((pageNumber, index) => {
      const isCurrentPage = currentPage === pageNumber;
      const button = createAndSetupButton(
        pageNumber, isCurrentPage ? 'active' : '', false, onPageButtonClick
      );
      
      if(isCurrentPage) {
        currentPageBtn = button;
      }
      
      buttons.set(button, onPageButtonUpdate(index));
    });
    
    buttons.set(
      createAndSetupButton('next', 'next-page', disabled.next(), () => currentPage += 1),
      (btn) => btn.disabled = disabled.next()
    )
    
    buttons.set(
      createAndSetupButton('end', 'end-page', disabled.end(), () => currentPage = totalPages),
      (btn) => btn.disabled = disabled.end()
    )
    
    buttons.forEach((_, btn) => frag.appendChild(btn));
    paginationButtonContainer.appendChild(frag);
    
    this.render = (container = pagination) => {
      container.appendChild(paginationButtonContainer);
    }
    
    this.update = (newPageNumber = currentPage) => {
      currentPage = newPageNumber;
      pages = pageNumbers(totalPages, maxPagesVisible, currentPage);
      buttons.forEach((updateButton, btn) => updateButton(btn));
    }
    
    this.onChange = (handler) => {
      paginationButtonContainer.addEventListener('change', handler);
    }
}

// PAGINATION END

function playerInput() {
    playerName = nameInput.value
    pageNumber = 1;
    pagination.innerHTML = "";
    flag = false;
    searchPlayers(pageNumber);
}

function searchPlayers(pageNumber) {
    fetch(`https://www.balldontlie.io/api/v1/players?search=${playerName}&page=${pageNumber}&per_page=${perPageNumber}`)
    .then((res) => res.json())
    .then((data) => {
        let temp = ``;
        
        data.data.forEach((player) => {
            if (player.position === "") {
                position = "NA";
            } else {
                position = player.position;
            }
            
            const player_info = {
                id: player.id,
                firstname: player.first_name,
                lastname: player.last_name
            };

            player_infos.push(player_info);

            temp +=`<tr>`;
            temp +=`<td id="tdbody-id"><div class="id">${player.id}</div></td>`;
            temp +=`<td id="tdbody-name"><div class="name">${player.first_name} ${player.last_name}</div> <i class="fas fa-poll-h" onclick="showPopup(
                ${player.id}
                )"></i></td>`;
            temp +=`<td id="tdbody-position"><div class="position">${position}</div></td>`;
            temp +=`<td id="tdbody-team"><div class="team">${player.team.abbreviation}</div></td>`;
            temp +=`<td id="tdbody-conference"><div class="conference">${player.team.conference}</div></td>`;
            temp +=`<td id="tdbody-division"><div class="division">${player.team.division}</div></td></tr>`;

        });
        table.style.display = "block";
        table.style = "table-stripped";
        document.getElementById('teams').innerHTML = "";
        document.getElementById('players').innerHTML = "Players";
        document.getElementById('data').innerHTML = temp;

        transaction = {
            total_pages: data.meta.total_pages,
            current_page: data.meta.current_page,
            next_page: data.meta.next_page,
            per_page: data.meta.per_page,
            total_count: data.meta.total_count
          };
        
        if (+transaction.total_pages > 4) {
            number_buttons = 5;
        } else {
            number_buttons = +transaction.total_pages;
        }  

        paginationButtons = new PaginationButton(transaction.total_pages, number_buttons);

        if (flag === false) {
            paginationButtons.render();
        }
        
        flag = true;

        paginationButtons.onChange(e => {
            searchPlayers(e.target.value);
        });


    })
    .catch((err) => console.log(err));
    nameInput.value = "";
    
}

function searchTeams() {
    fetch(`https://www.balldontlie.io/api/v1/teams/`)
    .then((res) => res.json())
    .then((data) => {
        let output = `<h2 class="mt-4 mb-4">Teams</h2>`;
        let number = 0;
        const image = ["logo/atlanta.png", "logo/boston.png", "logo/brooklyn.png",
                     "logo/charlotte.png", "logo/chicago.png", "logo/cleveland.png",
                     "logo/dallas.png", "logo/denver.png", "logo/detroit.png",
                     "logo/goldenstate.png", "logo/houston.png", "logo/indiana.png",
                     "logo/losangelesclippers.png", "logo/losangeleslakers.png", "logo/memphis.png",
                     "logo/miami.png", "logo/milwaukee.png", "logo/minnesota.png",
                     "logo/pelicans.png", "logo/newyork.png", "logo/oklahoma.png",
                     "logo/orlando.png", "logo/philadelphia.png", "logo/phoenix.png",
                     "logo/portland.png", "logo/sacramento.png", "logo/sanantonio.png",
                     "logo/toronto.png", "logo/utah.png", "logo/washington.png"];
        const links = ["https://www.nba.com/hawks/", "https://www.nba.com/celtics/",
                       "https://www.nba.com/nets/", "https://www.nba.com/hornets/",
                       "https://www.nba.com/bulls/", "https://www.nba.com/cavaliers/",
                       "https://www.nba.com/mavericks/", "https://www.nba.com/nuggets/",
                       "https://www.nba.com/pistons/", "https://www.nba.com/warriors/",
                       "https://www.nba.com/rockets/", "https://www.nba.com/pacers/",
                       "https://www.nba.com/clippers/", "https://www.nba.com/lakers/",
                       "https://www.nba.com/grizzlies/", "https://www.nba.com/heat/",
                       "https://www.nba.com/bucks/", "https://www.nba.com/timberwolves/",
                       "https://www.nba.com/pelicans/", "https://www.nba.com/knicks/",
                       "https://www.nba.com/thunder/", "https://www.nba.com/magic/",
                       "https://www.nba.com/sixers/", "https://www.nba.com/suns/",
                       "https://www.nba.com/blazers/", "https://www.nba.com/kings/",
                       "https://www.nba.com/spurs/", "https://www.nba.com/raptors/",
                       "https://www.nba.com/jazz/", "https://www.nba.com/wizards/",];
        data.data.forEach((team) => {
            output += `
                <div class="card card-body mb-1">
                    <ol start="${number+1}">
                        <li>
                            <div class="nba">
                                <a href=${links[number]}>${team.full_name}</a>
                            </div>
                            <div>
                                <img src=${image[number]} alt="" class="atlanta-img" />
                            </div>
                        </li>
                    </ol>
                </div>
            `;
            number += 1 
        });

        

        table.style.display = "none";
        document.getElementById('players').innerHTML = "";
        pagination.innerHTML = "";
        document.getElementById('teams').innerHTML = output;
        // document.getElementById('teams').style = "text-align: center;"
        nameInput.value = "";
    })
    .catch((err) => console.log(err));
}

searchPlayers(1);