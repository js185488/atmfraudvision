from cv2 import *
import matplotlib.colors as mcolors
import numpy as np
import matplotlib.pyplot as plt


# https://stackoverflow.com/questions/44598124/update-frame-in-matplotlib-with-live-camera-preview


def grab_frame(cap):
    s, img = cap.read()
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) # OpenCV uses BGR as its default colour order for images, matplotlib uses RGB.


    # get size of image
    rows, cols, _ = img.shape
    rowsHalf = rows//2
    colsHalf = cols//2


    #divid into Cartesian quadrants
    quad1RGB = img[0:rowsHalf, colsHalf:, :]
    quad2RGB = img[0:rowsHalf, 0:colsHalf, :]
    quad3RGB = img[rowsHalf:, 0:colsHalf, :]
    quad4RGB = img[rowsHalf:, colsHalf:, :]

    quad1R, quad1G, quad1B = quad1RGB[..., 0], quad1RGB[..., 1], quad1RGB[..., 2]
    quad2R, quad2G, quad2B = quad2RGB[..., 0], quad2RGB[..., 1], quad2RGB[..., 2]
    quad3R, quad3G, quad3B = quad3RGB[..., 0], quad3RGB[..., 1], quad3RGB[..., 2]
    quad4R, quad4G, quad4B = quad4RGB[..., 0], quad4RGB[..., 1], quad4RGB[..., 2]

    retQuadRGB = [quad1RGB, quad2RGB, quad3RGB, quad4RGB]


    # convert to HSV
    array = np.asarray(img)
    arr = (array.astype(float)) / 255.0 # data is originally UINT8
    img_hsv = mcolors.rgb_to_hsv(arr)

    #divid into quadrants
    quad1HSV = img_hsv[0:rowsHalf, colsHalf:, :]
    quad2HSV = img_hsv[0:rowsHalf, 0:colsHalf, :]
    quad3HSV = img_hsv[rowsHalf:, 0:colsHalf, :]
    quad4HSV = img_hsv[rowsHalf:, colsHalf:, :]

    quad1H, quad1S, quad1V = quad1HSV[..., 0], quad1HSV[..., 1], quad1HSV[..., 2]
    quad2H, quad2S, quad2V = quad2HSV[..., 0], quad2HSV[..., 1], quad2HSV[..., 2]
    quad3H, quad3S, quad3V = quad3HSV[..., 0], quad3HSV[..., 1], quad3HSV[..., 2]
    quad4H, quad4S, quad4V = quad4HSV[..., 0], quad4HSV[..., 1], quad4HSV[..., 2]

    quad1Means = [np.mean(quad1R), np.mean(quad1G), np.mean(quad1B), np.mean(quad1H), np.mean(quad1S), np.mean(quad1V)]
    quad2Means = [np.mean(quad2R), np.mean(quad2G), np.mean(quad2B), np.mean(quad2H), np.mean(quad2S), np.mean(quad2V)]
    quad3Means = [np.mean(quad3R), np.mean(quad3G), np.mean(quad3B), np.mean(quad3H), np.mean(quad3S), np.mean(quad3V)]
    quad4Means = [np.mean(quad4R), np.mean(quad4G), np.mean(quad4B), np.mean(quad4H), np.mean(quad4S), np.mean(quad4V)]
    retMeans = [quad1Means, quad2Means, quad3Means, quad4Means]

    return retQuadRGB, retMeans

# initialize the camera
cam = VideoCapture(0)   # 0 -> index of camera

templateStr = 'AVG - R: {:.2f}, G: {:.2f}, B:{:.2f}\nAVG - H: {:.2f}, S: {:.2f}, V: {:.2f}'

#create two subplots
ax2 = plt.subplot(2,2,1)
ax1 = plt.subplot(2,2,2)
ax3 = plt.subplot(2,2,3)
ax4 = plt.subplot(2,2,4)

#create image plot
quadRGB, means = grab_frame(cam)
im1 = ax1.imshow(quadRGB[0])
im2 = ax2.imshow(quadRGB[1])
im3 = ax3.imshow(quadRGB[2])
im4 = ax4.imshow(quadRGB[3])

im1str = ax1.text(0,0,'temp', c='red')
im2str = ax2.text(0,0,'temp', c='red')
im3str = ax3.text(0,0,'temp', c='red')
im4str = ax4.text(0,0,'temp', c='red')

ax1.axis('off')
ax2.axis('off')
ax3.axis('off')
ax4.axis('off')


plt.ion()

while True:
    quadRGB, means = grab_frame(cam)
    quad1str = templateStr.format(means[0][0], means[0][1], means[0][2], means[0][3], means[0][4], means[0][5])
    quad2str = templateStr.format(means[1][0], means[1][1], means[1][2], means[1][3], means[1][4], means[1][5])
    quad3str = templateStr.format(means[2][0], means[2][1], means[2][2], means[2][3], means[2][4], means[2][5])
    quad4str = templateStr.format(means[3][0], means[3][1], means[3][2], means[3][3], means[3][4], means[3][5])

    im1.set_data(quadRGB[0])
    im1str.set_text(quad1str)

    im2.set_data(quadRGB[1])
    im2str.set_text(quad2str)

    im3.set_data(quadRGB[2])
    im3str.set_text(quad3str)

    im4.set_data(quadRGB[3])
    im4str.set_text(quad4str)

    plt.pause(0.2)


plt.ioff() # due to infinite loop, this gets never called.
plt.show()

# initialize the camera
cam = VideoCapture(0)   # 0 -> index of camera
s, img = cam.read()
