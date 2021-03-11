#include "opencv2/opencv.hpp"
#include "opencv2/highgui/highgui_c.h"
#include "iostream"
#include <chrono>
#include <vector>

void expAvgFilt(cv::Mat& input, cv::Mat& output, cv::Mat& oldOutput)
{
  static const double alpha = 0.06087922992306122;
  output = oldOutput + alpha * (input - oldOutput);
  oldOutput = output;
}

bool checkThresh(const double x, const double thresh)
{
  bool res = false;
  if (x < thresh)
  {
    res = true;
  }

  return res;
}

void sumQuad(cv::Mat& input, double * meanH, double * meanS, double * meanV)
{
  std::vector<cv::Mat> planes;
  split(input, planes);

  *meanH = *(cv::mean(planes[0]).val);
  *meanS = *(cv::mean(planes[1]).val) / 255.0;
  *meanV = *(cv::mean(planes[2]).val) / 255.0;

}

int main(int, char**)
{

  unsigned int fps_counter = 0;

  // open the first webcam plugged in the computer
  cv::VideoCapture camera(0);
  if (!camera.isOpened())
  {
    std::cerr << "ERROR: Could not open camera" << std::endl;
    return 1;
  }

  // this will contain the image from the webcam
  cv::Mat frameSrc;


  camera >> frameSrc;
  const int ROWS = frameSrc.rows;
  const int COLS = frameSrc.cols;

  // create a window to display the images from the webcam
  cv::namedWindow("Webcam", CV_WINDOW_AUTOSIZE);

  cv::Mat frameFloat;

  cv::Mat y, yOld(ROWS, COLS, CV_32FC3, 0.0);

  cv::Mat frameHSV;

  //cv::Mat contours;


  std::chrono::steady_clock::time_point begin = std::chrono::steady_clock::now();

  // display the frame until you press a key
  while (1)
  {
    fps_counter++;

    camera >> frameSrc;

    //Mat fullImageHSV;
    //cvtColor(inputImage, fullImageHSV, CV_BGR2HSV);

    frameSrc.convertTo(frameFloat, CV_32F);

    //cv::Canny(frameSrc, contours, 35, 90);

    cvtColor(frameSrc, frameHSV, CV_BGR2HSV);
    //Note that using this form of slicing creates a new matrix header, but does not copy the data
    // Rect: x, y, width, height
    cv::Mat hsvTL(frameHSV, cv::Rect(0, 0, COLS / 2, ROWS / 2));
    cv::Mat hsvTR(frameHSV, cv::Rect(COLS / 2, 0, COLS / 2, ROWS / 2));
    cv::Mat hsvBL(frameHSV, cv::Rect(0, ROWS / 2, COLS / 2, ROWS / 2));
    cv::Mat hsvBR(frameHSV, cv::Rect(COLS / 2, ROWS / 2, COLS / 2, ROWS / 2));

    double h[5];
    double s[4];
    double v[4];
    sumQuad(hsvTL, &h[0], &s[0], &v[0]);
    sumQuad(hsvTR, &h[1], &s[1], &v[1]);
    sumQuad(hsvBL, &h[2], &s[2], &v[2]);
    sumQuad(hsvBR, &h[3], &s[3], &v[3]);

    const double vThresh = 0.06, sThresh = 0.06;


    if (checkThresh(v[0], vThresh))
      std::cout << "Black-out detected in Top Left corner" << std::endl;
    else if (checkThresh(s[0], sThresh))
      std::cout << "White-out detected in Top Left corner" << std::endl;

    if (checkThresh(v[1], vThresh))
      std::cout << "Black-out detected in Top Right corner" << std::endl;
    else if (checkThresh(s[1], sThresh))
      std::cout << "White-out detected in Top Right corner" << std::endl;

    if (checkThresh(v[2], vThresh))
      std::cout << "Black-out detected in Bot Left corner" << std::endl;
    else if (checkThresh(s[2], sThresh))
      std::cout << "White-out detected in Bot Left corner" << std::endl;

    if (checkThresh(v[3], vThresh))
      std::cout << "Black-out detected in Bot Right corner" << std::endl;
    else if (checkThresh(s[3], sThresh))
      std::cout << "White-out detected in Bot Right corner" << std::endl;



    //int type1 = frameHSV.type();
    //std::cout << "type1 is " << type1 << " and CV_32FC3 is " << CV_32FC3 << std::endl;

    //cvtColor(frame, frameHSV, CV_BGR2HSV);

    //int type2 = frameHSV.type();
    //std::cout << "type2 is " << type2 << " and CV_8UC3 is " << CV_8UC3 << std::endl;

    expAvgFilt(frameFloat, y, yOld);

    //cvtColor(frameHSV, frameF, CV_HSV2BGR);
    y.convertTo(frameSrc, CV_8U);


    // show the image on the window
    cv::imshow("Webcam", frameSrc);

    //cv::imshow("Canny", contours);

    // wait (10ms) for a key to be pressed
    if (cv::waitKey(200) >= 0) // 200 ms
      break;

    std::chrono::steady_clock::time_point end = std::chrono::steady_clock::now();

    std::chrono::duration<double> duration = std::chrono::steady_clock::now() - begin;

    if (duration.count() > 5)
    {
      std::cout << "FPS average: " << fps_counter / duration.count() << std::endl;
      fps_counter = 0;
      begin = std::chrono::steady_clock::now();

      std::cout << "h and s and v: " << h[0] << " " << s[0] << " " << v[0] << std::endl;
      std::cout << "h and s and v: " << h[1] << " " << s[1] << " " << v[1] << std::endl;
      std::cout << "h and s and v: " << h[2] << " " << s[2] << " " << v[2] << std::endl;
      std::cout << "h and s and v: " << h[3] << " " << s[3] << " " << v[3] << std::endl;
    }
  }
  return 0;
}
