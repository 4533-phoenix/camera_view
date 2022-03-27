const cameras = {
    "front": {
        "url": "http://wpilibpi.local:1181/stream.mjpg",
        "fps": 15,
        "options": {
            "angleRotation": 0,
            "flipVertically": true,
            "flipHorizontally": false
        }
    },
    "limelight": {
        "url": "http://limelight.local:5800/",
        "fps": 15,
        "options": {
            "angleRotation": 0,
            "flipVertically": false,
            "flipHorizontally": false
        }
    },
    "testing": {
        "url": "http://camera.butovo.com/mjpg/video.mjpg",
        "fps": 15,
        "options": {
            "angleRotation": 0,
            "flipVertically": false,
            "flipHorizontally": false
        }
    }
}