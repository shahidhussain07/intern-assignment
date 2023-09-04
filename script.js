const dropdownButton = document.querySelectorAll("#menu button")
const dropdownList = document.querySelectorAll(".absolute")

const addWeekButton = document.querySelector("#addButton")
const addWeekCard = document.querySelector("#add-card")

const weekName = document.querySelector("#weekName")

const order = document.querySelector("#order")
const selectedWeek = document.querySelector("#selectedWeek")

const orderList = document.querySelectorAll("li[id^='order']")
const moduleList = document.getElementById("moduleList")


var weekCount = 4;
var weeksData = [];
var recentAddedWeek = null;

//  selection the position of the new week
orderList.forEach((item) => {
    item.addEventListener("click", () => {
        handleSelection("order", item)
    })
})


// handling the selection of the position of the new week to the specified element
const handleSelection = (type, item) => {
    if (type === "order") {
        order.textContent = item.textContent
        document.getElementById("orderText").textContent = item.textContent
    } else if (type === "week") {
        selectedWeek.textContent = item.textContent
        document.getElementById("weekText").textContent = item.textContent
    }
    const menu = item.closest("#menu")
    const ul = menu.querySelector("ul")
    ul.classList.toggle("hidden")
}

addWeekButton.addEventListener("click", () => {
    toggleAddWeekCard()
})


const toggleAddWeekCard = () => {
    addWeekCard.classList.toggle("hidden")
    const placeList = document.getElementById("placeList")
    placeList.innerHTML = ""
    weeksData.forEach((week) => {
        placeList.innerHTML += `<li class="cursor-pointer px-4 py-2 hover:bg-gray-200 text-lg font-medium" id="week_${week.week_number}"> Week ${week.week_number}</li>`
    })

    document.querySelectorAll("li[id^='week']").forEach((item) => {
        item.addEventListener("click", () => {
            handleSelection("week", item)
        })
    })
}

dropdownButton.forEach((button) => {
    button.addEventListener("click", () => {
        const menu = button.closest("#menu")
        const ul = menu.querySelector("ul")

        ul.classList.toggle("hidden")
    })
})


const loadModules = (selectedWeek) => {
    if (selectedWeek) {
        weekName.textContent = `Week ${selectedWeek.week_number}`
        moduleList.innerHTML = ""
        selectedWeek.modules.forEach((module) => {
            const moduleItem = document.createElement("li")
            moduleItem.textContent = module.name
            moduleList.appendChild(moduleItem)
            if (module.tasks) {
                const taskList = document.createElement("ol")
                taskList.style.marginLeft = "20px"
                module.tasks.forEach((task) => {
                    taskList.innerHTML += `<li style="list-style-type: decimal">${task.name}</li>`
                })
                moduleList.appendChild(taskList)
            }
        })
    }
}
const reRenderWeeks = () => {
    const weekList = document.getElementById("weekList")
    weekList.innerHTML = ""
    weeksData.forEach((week) => {
        weekList.innerHTML += `<button class="bg-[#f7f9fb] text-[#3b4c6d] rounded-2xl hover:text-white hover:bg-[#3B4C6D] bg-[#3B4C6D] px-4 py-2" id="week${week.week_number}"> Week ${week.week_number}</button>`
        if (week.week_number === recentAddedWeek) {
            const currentWeek = document.getElementById(`week${week.week_number}`)
            currentWeek.classList.add("active")
            loadModules(week)
        }
    })

}

// assign event listen to various week buttons
const assignEventListen = () => {
    const weekButtons = document.querySelectorAll('button[id^="week"]')
    weekButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const weekNumber = parseInt(button.id.slice(-1))

            const selectedWeek = weeksData.find(
                (week) => week.week_number === weekNumber
            )
            weekButtons.forEach((button) => {
                button.classList.remove("active")
            })
    
            button.classList.add("active")
            loadModules(selectedWeek)
    
            })
    })
}
        

const createNewWeek = () => {
    recentAddedWeek = (() => {
        if (order.textContent.trim() === "Before") {
            return parseInt(selectedWeek.textContent.trim().split(" ")[1])
            
        } else if (order.textContent.trim() === "After") {
            return parseInt(selectedWeek.textContent.trim().split(" ")[1]) + 1
        }
    })()
    
    const newWeek = {
        id: weekCount + 1,
        week_number: recentAddedWeek,
        modules: [
            {
                id: "mod1",
                name: "NewModule1",
            },
        ],
    }
    weeksData.forEach((week) => {
        if (week.week_number >= newWeek.week_number) {
            week.week_number++
        }
    })
    weeksData.splice(newWeek.week_number - 1, 0, newWeek)
    weekCount++
    reRenderWeeks()
    toggleAddWeekCard()
    assignEventListen()
    console.log(weeksData)
}


window.addEventListener("load", async () => {
    const response = await fetch("data.json")
    const jsonData = await response.json()
    weeksData = jsonData.weeks
    const selectedWeek = jsonData.weeks.find(
        (week) => week.week_number === 1
    )
    const week = document.getElementById("week1")
    week.classList.add("active")
    loadModules(selectedWeek)
    assignEventListen()
}
)

// download data as json file
const downloadData = () => {
    const data = JSON.stringify({ weeks: weeksData })
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "week_data.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}



