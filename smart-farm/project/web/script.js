//..........................YOUR FIREBASE..........................
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
}; 
//   // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

//   // Firebase



const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

// Kiểm tra xem dark mode có được bật hay không trong localStorage
const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

// Function để bật hoặc tắt dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode-variables');
  darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
  darkMode.querySelector('span:nth-child(2)').classList.toggle('active');

  // Lưu trạng thái dark mode vào localStorage
  const isDarkModeEnabled = document.body.classList.contains('dark-mode-variables');
  localStorage.setItem('darkMode', isDarkModeEnabled ? 'enabled' : 'disabled');
}

// Nếu dark mode đã được bật từ trước, kích hoạt nó
if (isDarkMode) {
  toggleDarkMode();
}

// Thêm sự kiện click cho darkMode
darkMode.addEventListener('click', toggleDarkMode);


// Ham chinh aside khi phong to window tro  lai//////////////
window.addEventListener('resize', function() {
  var screenWidth = window.innerWidth;
  var asideElement = document.querySelector('aside');

  if (screenWidth >= 769) {
      asideElement.style.display = 'block';
  } else {
      asideElement.style.display = 'none';
  }
});


/////////////////////////////////////
// chuyen phong ////////
function switchPage(evt, pageName) {
  var i, sections, links;

  // Lấy danh sách các sections
  sections = document.getElementsByTagName("section");

  // Ẩn tất cả các sections
  for (i = 0; i < sections.length; i++) {
      sections[i].style.display = "none";
  }

  // Lấy danh sách các links có class "active"
  links = document.getElementsByClassName("active");

  // Loại bỏ class "active" từ tất cả các links
  for (i = 0; i < links.length; i++) {
      links[i].classList.remove("active");
  }

  // Hiển thị phần tử được chọn và thêm class "active" cho link
  var targetSection = document.getElementById(pageName);
  if (targetSection) {
      if (targetSection.style.display !== "flex") {
          targetSection.style.display = "block";
          evt.currentTarget.classList.add("active");
      }
  }
  // Ngăn chặn mặc định của sự kiện (ví dụ: chặn link từ việc chuyển hướng)
  evt.preventDefault();
}

// Chuyen trang thai dieu khien ///////////////
document.addEventListener('DOMContentLoaded', function() {
  var colorModeToggle = document.getElementById('color_mode');
  var settimeDiv = document.querySelector('.settime');
  var setvalueDiv = document.querySelector('.setvalue');
  var switches = document.querySelectorAll('.switch input[type="checkbox"]');

  function updateDisplay() {
      if (colorModeToggle.checked) {
          settimeDiv.classList.add('hidden');
          setvalueDiv.classList.remove('hidden');
          switches.forEach(function(switchBtn) {
            switchBtn.disabled = true;
            switchBtn.parentNode.classList.add('disabled');
        });
      } else {
          settimeDiv.classList.remove('hidden');
          setvalueDiv.classList.add('hidden');
          switches.forEach(function(switchBtn) {
            switchBtn.disabled = false;
            switchBtn.parentNode.classList.remove('disabled');
        });
      }
  }

  colorModeToggle.addEventListener('change', function() {
    updateDisplay();
    var mode = colorModeToggle.checked ? 'Auto' : 'Manual';
    database.ref('/Mode').set(mode);
});

// Lấy trạng thái từ Firebase khi trang được tải lại
database.ref('/Mode').once('value').then(function(snapshot) {
    var mode = snapshot.val();
    if (mode === 'Auto') {
        colorModeToggle.checked = true;
    } else {
        colorModeToggle.checked = false;
    }
    updateDisplay();
});

updateDisplay();
});

// // Sensorssssssssssssss///////////////////////
firebase.database().ref("/Sensor/Temperature").on("value", function(snapshot) {
  var temp = snapshot.val();
  document.getElementById("temp").innerHTML = temp;
});
firebase.database().ref("/Sensor/Humidity").on("value", function(snapshot) {
  var hum = snapshot.val();
  document.getElementById("hum").innerHTML = hum;
});
firebase.database().ref("/Sensor/Bright").on("value", function(snapshot) {
  var bright = snapshot.val();
  document.getElementById("bright").innerHTML = bright;
});

// // Deviceeeeeeeeeeeeeeeeee///////////////////
var bulb = document.getElementById("bulb-btn"); 
bulb.onclick = function(){  
      firebase.database().ref("/Device").once("value").then(function(snapshot) {
        var currentStatus = snapshot.child("Bulb").val();
    
        // Chuyển đổi trạng thái
        var newStatus = (currentStatus === "OFF") ? "ON" : "OFF";
    
        // Cập nhật trạng thái mới vào Firebase
        firebase.database().ref("/Device").update({
          "Bulb": newStatus
        });
      });
};

firebase.database().ref("/Device/Bulb").on("value", function(snapshot) {
  var bulb = snapshot.val();
  document.getElementById("bulb-status").innerHTML = bulb;
  if (bulb == 'ON') {
    document.getElementById("bulb-img").src = "./img/light-on.png";
    document.getElementById("bulb-btn").checked = true;
  }
  else {
    document.getElementById("bulb-img").src = "./img/light-off.png";
    document.getElementById("bulb-btn").checked = false;
  }
});

var fan = document.getElementById("fan-btn"); 
fan.onclick = function(){  
      firebase.database().ref("/Device").once("value").then(function(snapshot) {
        var currentStatus = snapshot.child("Fan").val();
    
        // Chuyển đổi trạng thái
        var newStatus = (currentStatus === "OFF") ? "ON" : "OFF";
    
        // Cập nhật trạng thái mới vào Firebase
        firebase.database().ref("/Device").update({
          "Fan": newStatus
        });
      });
};

firebase.database().ref("/Device/Fan").on("value", function(snapshot) {
  var fan = snapshot.val();
  var fan_img = document.getElementById("fan-img");
  document.getElementById("fan-status").innerHTML = fan;
  if (fan == 'ON') {
    document.getElementById("fan-img").src = "./img/fan-on.png";
    fan_img.classList.add('rotate');
    document.getElementById("fan-btn").checked = true;
  }
  else {
    document.getElementById("fan-img").src = "./img/fan-off.png";
    fan_img.classList.remove('rotate');
    document.getElementById("fan-btn").checked = false;
  }
});

var pump = document.getElementById("pump-btn"); 
pump.onclick = function(){  
      firebase.database().ref("/Device").once("value").then(function(snapshot) {
        var currentStatus = snapshot.child("Pump").val();
    
        // Chuyển đổi trạng thái
        var newStatus = (currentStatus === "OFF") ? "ON" : "OFF";
    
        // Cập nhật trạng thái mới vào Firebase
        firebase.database().ref("/Device").update({
          "Pump": newStatus
        });
      });
};

firebase.database().ref("/Device/Pump").on("value", function(snapshot) {
  var pump = snapshot.val();
  document.getElementById("pump-status").innerHTML = pump;
  if (pump == 'ON') {
    document.getElementById("pump-img").src = "./img/pump-on.png";
    document.getElementById("pump-btn").checked = true;
  }
  else {
    document.getElementById("pump-img").src = "./img/pump-off.png";
    document.getElementById("pump-btn").checked = false;
  }
});

// Set valueeeeeeeeeeee///////////
document.addEventListener('DOMContentLoaded', function() {
  // Xử lý sự kiện submit cho các giá trị min/max
  function isValidInput(min, max) {
    if (isNaN(min) || isNaN(max)) {
        alert("Vui lòng nhập số hợp lệ cho giá trị min và max.");
        return false;
    }
    if (parseFloat(min) >= parseFloat(max)) {
        alert("Giá trị max phải lớn hơn giá trị min.");
        return false;
    }
    return true;
}

  document.getElementById('temp-submit').addEventListener('click', function() {
      var tempMin = document.getElementById('text-temp-min').value;
      var tempMax = document.getElementById('text-temp-max').value;
      if (isValidInput(tempMin, tempMax)) {
        database.ref('Set Value/Temperature').set({
            Min: tempMin,
            Max: tempMax
        });
      }
  });

  document.getElementById('hum-submit').addEventListener('click', function() {
      var humMin = document.getElementById('text-hum-min').value;
      var humMax = document.getElementById('text-hum-max').value;
      if (isValidInput(humMin, humMax)) {
        database.ref('Set Value/Humidity').set({
            Min: humMin,
            Max: humMax
        });
      }
  });

  document.getElementById('bright-submit').addEventListener('click', function() {
      var brightMin = document.getElementById('text-bright-min').value;
      var brightMax = document.getElementById('text-bright-max').value;
      if (isValidInput(brightMin, brightMax)) {
        database.ref('Set Value/Brightness').set({
            Min: brightMin,
            Max: brightMax
        });
      }
  });

  // Lấy các giá trị min/max từ Firebase khi tải lại trang
  database.ref('Set Value/Temperature').once('value').then(function(snapshot) {
      var tempSettings = snapshot.val();
      document.getElementById('text-temp-min').value = tempSettings.Min;
      document.getElementById('text-temp-max').value = tempSettings.Max;
  });

  database.ref('Set Value/Humidity').once('value').then(function(snapshot) {
      var humSettings = snapshot.val();
      document.getElementById('text-hum-min').value = humSettings.Min;
      document.getElementById('text-hum-max').value = humSettings.Max;
  });

  database.ref('Set Value/Brightness').once('value').then(function(snapshot) {
      var brightSettings = snapshot.val();
      document.getElementById('text-bright-min').value = brightSettings.Min;
      document.getElementById('text-bright-max').value = brightSettings.Max;
  });

  // Kiểm tra các giá trị và điều khiển thiết bị
  function checkAndControlDevices() {
      // Lấy các giá trị từ Firebase
      database.ref('/Mode').once('value').then(function(snapshot) {
        var mode = snapshot.val();
        if (mode === 'Auto') {
          firebase.database().ref("/Sensor").on("value", function(snapshot) {
              var currentTemp = snapshot.child("Temperature").val(); 
              var currentHum = snapshot.child("Humidity").val(); 
              var currentBright = snapshot.child("Bright").val(); 

              firebase.database().ref("/Set Value").on("value", function(snapshot) {
              // Điều khiển thiết bị dựa trên giá trị nhiệt độ
                var setvalue = snapshot.val();
                if (currentTemp < setvalue.Temperature.Min || currentBright < setvalue.Brightness.Min) {
                  controlDevice('Bulb', 'ON');
                }
                else {
                  controlDevice('Bulb', 'OFF');
                }
                if (currentHum < setvalue.Humidity.Min || currentTemp > setvalue.Temperature.Max) {
                  controlDevice('Pump', 'ON');
                }
                else {
                  controlDevice('Pump', 'OFF');
                }
                if (currentHum > setvalue.Humidity.Max || currentTemp > setvalue.Temperature.Max) {
                  controlDevice('Fan', 'ON');
                }
                else {
                  controlDevice('Fan', 'OFF');
                }
            });
          });
        }
        else firebase.database().ref("/Sensor").off("value");
      });
  }
  function controlDevice(device, state) {
    var devicePath = "/Device/" + device;
    database.ref(devicePath).set(state);
}
  setInterval(checkAndControlDevices, 1000);
});
// Clockkkkkkkkkkkk/////////
// Lấy các phần tử HTML cần thao tác
var hourDisplay = document.querySelector('.hdisplay');
var minuteDisplay = document.querySelector('.mdisplay');
var secondDisplay = document.querySelector('.sdisplay');

// Hàm cập nhật giờ, phút, giây
function updateClock() {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');

    // Cập nhật nội dung cho các phần tử hiển thị giờ, phút, giây
    hourDisplay.textContent = hours;
    minuteDisplay.textContent = minutes;
    secondDisplay.textContent = seconds;
}

// Gọi hàm cập nhật lần đầu tiên để hiển thị thời gian ban đầu
updateClock();

// Cập nhật thời gian mỗi giây
setInterval(updateClock, 1000);

// Lấy phần tử HTML cần thao tác
var dayDisplay = document.querySelector('.day-display');
var monthDisplay = document.querySelector('.month-display');
var yearDisplay = document.querySelector('.year-display');

// Hàm cập nhật ngày, tháng, năm
function updateDate() {
    var now = new Date();
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var dayOfWeek = daysOfWeek[now.getDay()];
    var month = monthsOfYear[now.getMonth()];
    var day = now.getDate();
    var year = now.getFullYear();

    // Cập nhật nội dung cho các phần tử hiển thị ngày, tháng, năm
    dayDisplay.textContent = dayOfWeek + ", " + month + " " + day + " " + year;
}

// Gọi hàm cập nhật ngày tháng khi trang web được tải
updateDate();
