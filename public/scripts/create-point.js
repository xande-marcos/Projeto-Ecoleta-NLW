
function populateUFs(){
    const ufSelect = document.querySelector('select[name=uf]')
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then( (res) => {return res.json()})
    .then(states =>{

        for(const state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
        
    })
}

populateUFs()

function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value //Evento (change), onde ele foi executado (target)

    const indexOfSelectedState = event.target.selectedIndex //Vai pegar o número da option selecionada
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a cidade</option>";
    citySelect.disabled = true;

    fetch(url)
    .then( res => res.json() )
    .then(cities =>{
        for(const city of cities){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
        
        citySelect.disabled = false;
    })
}

/*A promise poderia ser abreviada, em (res => res.json())*/ 
document
    .querySelector("select[name=uf]") //Procura o select com o nome UF
    .addEventListener('change', getCities) /*Só será executada quandom udar*///Criar uma função anônima, isso é igual a function(){}

//Itens de coleta  ESTUDAR NOVAMENTE!!!!!
//Pegar todos os li's
const itemsToCollect = document.querySelectorAll('.items-grid li');

//Pega todos os items das 6 li's
for (const item of itemsToCollect){
    item.addEventListener('click', handleSelectedItem)
}

const collectedItems = document.querySelector('input[name=items]')

let selectedItems = []

//Chama a função selected que exibirá o estilo
function handleSelectedItem(event){
    //adicionar ou remover uma class com js
    const itemLi = event.target

    itemLi.classList.toggle("selected"); //Adiciona ou remove

    const itemId = itemLi.dataset.id //Pegou o ID
    console.log('ITEM ID:', itemId)
    //Verificar se existem itens selecionados, se sim
    //Pegar os itens selecionados

    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId //Será true ou false
        return itemFound
    })

    //Se ja estiver selecionado tirar da seleção
    if(alreadySelected >= 0){ /*Se referindo ao INDEX - Índice do array*/
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId;  //true 
            return itemIsDifferent
        })
        selectedItems = filteredItems
    }else{
    //Senão estiver selecionado, adicionar à seleção
        selectedItems.push(itemId) //Senão estiver selecionado ele adiciona dentro do array
    }

    console.log('selectedItems')
    /* console.log(selectedItems) */
    //Atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
}