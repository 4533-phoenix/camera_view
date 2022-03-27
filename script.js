let cameraSelector = document.getElementById("cameraSelectorButtons");

let cameraURL = document.getElementById("cameraURL");
let cameraName = document.getElementById("cameraName");
let cameraId = document.getElementById("cameraId");
let cameraElementId = document.getElementById("cameraElementId");
let cameraStatus = document.getElementById("cameraStatus");

let flipVertically = document.getElementById("flipVerticallyCheckbox");
let flipHorizontally = document.getElementById("flipHorizontallyCheckbox");
let angleRotation = document.getElementById("angleRotationNumber");
let refreshCamera = document.getElementById("refreshCameraButton");
let resetOptions = document.getElementById("resetOptionsButton");

let activeCamera = document.getElementsByClassName("activeCamera")[0];
let storage = window.localStorage;
let customOptions = {};

String.prototype.fromCamelCase = function() {
  return this.replace(/([A-Z])/g, " $1").replace(/^./, function(str) {
    return str.toUpperCase();
  });
};

function fixCustomOptions() {
  Object.entries(cameras || {}).forEach(function (camera) {
    const [cameraName, cameraSettings] = camera;
    if (!customOptions[cameraName]) {
      return;
    } else if (Object.keys(customOptions[cameraName]).length == 0) {
      delete customOptions[cameraName];
      return;
    }

    Object.entries(cameraSettings.options || {}).forEach(function (option) {
      const [optionName, optionValue] = option;
      if (customOptions[cameraName][optionName] == optionValue) {
        delete customOptions[cameraName][optionName];
      }
    });
  });
}

function saveCustomOptions() {
  storage.setItem("customSettings", JSON.stringify(customOptions));
}

function loadCustomOptions() {
  if (!storage.getItem("customSettings")) {
    storage.setItem("customSettings", "{}");
  }

  customOptions = JSON.parse(storage.getItem("customSettings"));
}

function parseActiveCameraOptions() {
  let name = activeCamera.id.slice(0, -3);
  let imageOptions = {...cameras[name]["options"]};

  Object.entries(customOptions[name] || {}).forEach(function(customOption) {
    const [customOptionName, customOptionValue] = customOption;
    imageOptions[customOptionName] = customOptionValue;
  });

  fixCustomOptions();
  saveCustomOptions();
  activeCamera.removeAttribute("style");
  Object.entries(imageOptions).forEach(function(imageOption) {
    const [imageOptionName, imageOptionValue] = imageOption;

    switch (imageOptionName) {
      case "angleRotation":
        activeCamera.style.transform += `rotate(${imageOptionValue}deg)`;
        angleRotation.value = imageOptionValue;
        break;
      case "flipVertically":
        imageOptionValue
          ?
          (activeCamera.style.transform += "scaleX(-1)") :
          (activeCamera.style.transform += "scaleX(1)");
        flipVertically.checked = imageOptionValue;
        break;
      case "flipHorizontally":
        imageOptionValue
          ?
          (activeCamera.style.transform += "scaleY(-1)") :
          (activeCamera.style.transform += "scaleY(1)");
        flipHorizontally.checked = imageOptionValue;
        break;
    }
  });
}

function setCustomOption(key, value) {
  let name = activeCamera.id.slice(0, -3);

  if (!customOptions[name]) {
    customOptions[name] = {}
  }

  customOptions[name][key] = value;
  parseActiveCameraOptions();
}

function setActiveCamera(name, overideActive) {
  if (activeCamera.id == name && !overideActive) {
    return;
  }
  const options = cameras[name];
  let oldButton = document.getElementById(activeCamera.id.slice(0, -3) + "Btn");

  !!oldButton && oldButton.classList.remove("selected");
  document.getElementById(name + "Btn").classList.add("selected");

  activeCamera.src = "transparent.png";
  setTimeout(function() {
    activeCamera.src = options.url;
    activeCamera.id = name + "Cam";
    parseActiveCameraOptions();
  }, 5);

  cameraURL.href = cameraURL.innerHTML = options.url;
  cameraName.innerHTML = name.fromCamelCase();
  cameraId.innerHTML = name;
  cameraElementId.innerHTML = name + "Cam";
  cameraStatus.innerHTML = "Loading";
  cameraStatus.style["background-color"] = "yellow";
  cameraStatus.style["color"] = "black";
}

Object.keys(cameras || {}).forEach(function(name, index) {
  let optionElement = document.createElement("div");

  optionElement.classList.add("cameraButton");
  optionElement.onclick = function() {
    setActiveCamera(name);
  };
  optionElement.innerHTML = (((index + 1) <= 9) ? ("(" + parseInt(index + 1) + ") ") : "") + name.fromCamelCase();
  optionElement.id = name + "Btn";
  cameraSelector.appendChild(optionElement);
});

window.addEventListener("load", function(event) {
  loadCustomOptions();
  setActiveCamera(Object.keys(cameras)[0]);
});

activeCamera.addEventListener("error", function(event) {
  if (!event.target.src.endsWith("transparent.png")) {
    cameraStatus.innerHTML = "Error";
    cameraStatus.style["background-color"] = "red";
    cameraStatus.style["color"] = "white";
    activeCamera.src = "transparent.png";
    activeCamera.removeAttribute("style");
  }
});

activeCamera.addEventListener("load", function(event) {
  if (!event.target.src.endsWith("transparent.png")) {
    cameraStatus.innerHTML = "Online";
    cameraStatus.style["background-color"] = "green";
    cameraStatus.style["color"] = "white";
  }
});

activeCamera.addEventListener("click", function(event) {
  window.open(cameras[event.target.id.slice(0, -3)].url, "_blank");
});

document.addEventListener("keydown", function (event) {
  if (!isNaN(event.key)) {
    let number = parseInt(event.key) - 1;
    number = (number < 0) ? 9 : number;

    let cameraName = Object.keys(cameras || {})[number];
    if (!!cameraName) {
      setActiveCamera(cameraName);
    }
  } else {
    switch (event.key.toLowerCase()) {
      case "r":
        setActiveCamera(activeCamera.id.slice(0, -3), true);
        break;
    }
  }
});

flipVertically.addEventListener("change", function (event) {
  setCustomOption("flipVertically", event.target.checked);
});

flipHorizontally.addEventListener("change", function (event) {
  setCustomOption("flipHorizontally", event.target.checked);
});

angleRotation.addEventListener("change", function (event) {
  setCustomOption("angleRotation", event.target.value)
});

refreshCamera.addEventListener("click", function (event) {
  setActiveCamera(activeCamera.id.slice(0, -3), true);
});

resetOptions.addEventListener("click", function (event) {
  let name = activeCamera.id.slice(0, -3);
  delete customOptions[name];
  parseActiveCameraOptions();
});