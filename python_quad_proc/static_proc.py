from cv2 import *
import matplotlib.colors as mcolors
import numpy as np
import matplotlib.pyplot as plt


#https://stackoverflow.com/questions/35692507/plot-several-image-files-in-matplotlib-subplots/35692695

# initialize the camera
cam = VideoCapture(0)   # 0 -> index of camera
s, img = cam.read()
if s:    # frame captured without any errors

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


    templateStr = 'AVG - R: {:.2f}, G: {:.2f}, B:{:.2f}\nAVG - H: {:.2f}, S: {:.2f}, V: {:.2f}'
    quad1str = templateStr.format(np.mean(quad1R), np.mean(quad1G), np.mean(quad1B), np.mean(quad1H), np.mean(quad1S), np.mean(quad1V))
    quad2str = templateStr.format(np.mean(quad2R), np.mean(quad2G), np.mean(quad2B), np.mean(quad2H), np.mean(quad2S), np.mean(quad2V))
    quad3str = templateStr.format(np.mean(quad3R), np.mean(quad3G), np.mean(quad3B), np.mean(quad3H), np.mean(quad3S), np.mean(quad3V))
    quad4str = templateStr.format(np.mean(quad4R), np.mean(quad4G), np.mean(quad4B), np.mean(quad4H), np.mean(quad4S), np.mean(quad4V))

    # plot
    plt.subplot(2, 2, 1)
    plt.imshow(quad2RGB)
    plt.text(0, 0, quad2str, c='red')
    plt.axis('off')

    plt.subplot(2, 2, 2)
    plt.imshow(quad1RGB)
    plt.text(0, 0, quad1str, c='red')
    plt.axis('off')

    plt.subplot(2, 2, 3)
    plt.imshow(quad3RGB)
    plt.text(0, 0, quad3str, c='red')
    plt.axis('off')

    plt.subplot(2, 2, 4)
    plt.imshow(quad4RGB)
    plt.text(0, 0, quad4str, c='red')
    plt.axis('off')

    plt.show()
    #imwrite("filename.jpg",img) #save image
