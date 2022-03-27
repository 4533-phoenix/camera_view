let cameraSelector = document.getElementById("cameraSelectorButtons");
let cameraURL = document.getElementById("cameraURL");
let cameraName = document.getElementById("cameraName");
let cameraId = document.getElementById("cameraId");
let cameraElementId = document.getElementById("cameraElementId");
let cameraStatus = document.getElementById("cameraStatus");
let activeCamera = document.getElementsByClassName("activeCamera")[0];
let customOptions = {};

String.prototype.fromCamelCase = function() {
  return this.replace(/([A-Z])/g, " $1").replace(/^./, function(str) {
    return str.toUpperCase();
  });
};

function parseActiveCameraOptions() {
  let name = activeCamera.id.slice(0, -3);
  let imageOptions = cameras[name]["options"];

  activeCamera.removeAttribute("style");

  Object.entries(customOptions[name] || {}).forEach(function(customOption) {
    const [customOptionName, customOptionValue] = customOption;
    imageOptions[customOptionName] = customOptionValue;
  });

  Object.entries(imageOptions).forEach(function(imageOption) {
    const [imageOptionName, imageOptionValue] = imageOption;

    switch (imageOptionName) {
      case "angleRotation":
        activeCamera.style.transform += `rotate(${imageOptionValue}deg)`;
      case "flipVertically":
        imageOptionValue
          ?
          (activeCamera.style.transform += "scaleX(-1)") :
          (activeCamera.style.transform += "scaleX(1)");
      case "flipHorizontally":
        imageOptionValue
          ?
          (activeCamera.style.transform += "scaleY(-1)") :
          (activeCamera.style.transform += "scaleY(1)");
    }
  });
}

function setActiveCamera(name) {
  if (activeCamera.id == name) {
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
  optionElement.innerHTML = name.fromCamelCase();
  optionElement.id = name + "Btn";
  cameraSelector.appendChild(optionElement);
});

window.addEventListener("load", function(event) {
  setActiveCamera(Object.keys(cameras)[0]);
});

activeCamera.addEventListener("error", function(event) {
  if (!activeCamera.src.endsWith("transparent.png")) {
    cameraStatus.innerHTML = "Error";
    cameraStatus.style["background-color"] = "red";
    cameraStatus.style["color"] = "white";
    activeCamera.src = "transparent.png";
    activeCamera.removeAttribute("style");
  }
});

activeCamera.addEventListener("load", function(event) {
  if (!activeCamera.src.endsWith("transparent.png")) {
    cameraStatus.innerHTML = "Online";
    cameraStatus.style["background-color"] = "green";
    cameraStatus.style["color"] = "white";
  }
});

activeCamera.addEventListener("click", function(event) {
  window.open(cameras[activeCamera.id.slice(0, -3)].url, "_blank");
});