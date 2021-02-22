from cv2 import *
import matplotlib.colors as mcolors
import numpy as np
import time


def grab_frame(cap):
    s, img = cap.read()
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # OpenCV uses BGR as its default colour order for images, matplotlib uses RGB.

    # get size of image
    rows, cols, _ = img.shape
    rowsHalf = rows//2
    colsHalf = cols//2

    # convert to HSV
    array = np.asarray(img)
    arr = (array.astype(float)) / 255.0  # data is originally UINT8
    img_hsv = mcolors.rgb_to_hsv(arr)

    # divid into quadrants
    quad1HSV = img_hsv[0:rowsHalf, colsHalf:, :]
    quad2HSV = img_hsv[0:rowsHalf, 0:colsHalf, :]
    quad3HSV = img_hsv[rowsHalf:, 0:colsHalf, :]
    quad4HSV = img_hsv[rowsHalf:, colsHalf:, :]

    quad1V = quad1HSV[..., 2]
    quad2V = quad2HSV[..., 2]
    quad3V = quad3HSV[..., 2]
    quad4V = quad4HSV[..., 2]

    quad1Means = np.mean(quad1V)
    quad2Means = np.mean(quad2V)
    quad3Means = np.mean(quad3V)
    quad4Means = np.mean(quad4V)
    retMeans = np.array([quad1Means, quad2Means, quad3Means, quad4Means])

    return retMeans


# initialize the camera
cam = VideoCapture(0)   # 0 -> index of camera
old_means = grab_frame(cam)

print("Starting...")
while True:
    means = grab_frame(cam)

    absMean = np.absolute(means - old_means)

    if np.any(absMean >= 0.2):
        print("One or more quadrants are blocked.\n")
    else:
        print("----\n")

    old_means = means
    time.sleep(0.5)
