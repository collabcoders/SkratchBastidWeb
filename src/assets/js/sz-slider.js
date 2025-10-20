/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.19
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
/*!
  * JavaScript For Advanced Bootstrap Carousel Plugin
  */

(function ($) {

  "use strict";

  function isNumeric(obj) {
    var realStringObj = obj && obj.toString();
    return !jQuery.isArray(obj) && (realStringObj - parseFloat(realStringObj) + 1) >= 0;
  }

  var heightHackOffset = 0;


  //Check carousel exist or not?
  if ($(".sz-slider").length) {

    //Cache the carousel into a variable
    var szSliders = $(".sz-slider");

    szSliders.each(function () {

      /**
      * -----------------------
      *  Declaring Variables
      * -----------------------
      */
      //Cache the Slider into a variable
      var thisSlider = $(this);
      //Cache the Carousel Indicators into a variable
      var indParent = thisSlider.find(".carousel-indicators");
      //Cache the Carousel Indicators Li into a variable
      var indLi = indParent.find("li");
      //Getting Indicators Direction Attribute Value "x" || "y"
      var indiDrct = thisSlider.data("ind-direction");
      //Cache the Carousel Inner into a variable
      var sliderInner = thisSlider.find(".carousel-inner");
      //Cache the Carousel Item According To Bootstrap Version into a variable
      var carouselItem;
      if (sliderInner.find(".carousel-item").length !== 0) { //Bootstrap 4
        carouselItem = ".carousel-item";
      } else { //Bootstrap 3
        carouselItem = ".item";
      }
      //Cache the Carousel Items into a variable
      var innerItems = sliderInner.find(carouselItem);
      //Cache the Carousel Items Length into a variable
      var itemsLength = innerItems.length;
      //Cache the Carousel First Item into a variable
      var sliderFirstItem = innerItems.first();
      //Cache the Carousel Left and Right Navigation Buttons According To Bootstrap Version into a variable
      var sliderNav;
      if (thisSlider.find(".carousel-control-btn").length !== 0) { //Bootstrap 4
        sliderNav = thisSlider.find(".carousel-control-btn");
      } else { //Bootstrap 3
        sliderNav = thisSlider.find(".carousel-control");
      }
      //Cache the Next Navigation Button According To Bootstrap Version into a variable
      var sliderNavNext;
      if (sliderNav.hasClass("carousel-control-next")) { //Bootstrap 4
        sliderNavNext = "carousel-control-next";
      } else { //Bootstrap 3
        sliderNavNext = "right";
      }
      //Cache the Prev Navigation Button According To Bootstrap Version into a variable
      var sliderNavPrev;
      if (sliderNav.hasClass("carousel-control-prev")) { //Bootstrap 4
        sliderNavPrev = "carousel-control-prev";
      } else { //Bootstrap 3
        sliderNavPrev = "left";
      }
      //Getting Slider Type Value
      var sliderTypeV = thisSlider.data("type");
      //Getting Slider Animation Value
      var sldrAnim = thisSlider.data("animation");
      //Getting data-sticky attribute Value
      var sldSticky = thisSlider.is("[data-sticky]");
      var sldStickyV = thisSlider.data("sticky");
      //Getting free-mode attribute value
      var sldFreeMode = thisSlider.is("[data-free-mode]");
      //Getting CoverFlow and CoverFlow + CoverFlow2X and CoverFlow2Y space value
      var sldSpce = thisSlider.data("space");
      if (isNumeric(sldSpce)) {
        sldSpce = sldSpce;
      } else {
        sldSpce = 1.35;
      }
      //Getting CoverFlow2X and CoverFlow2Y Minimum Value
      var sldCovr2dMin = thisSlider.data("cover-min");
      if (isNumeric(sldCovr2dMin)) {
        sldCovr2dMin = sldCovr2dMin;
      } else {
        sldCovr2dMin = 0.875;
      }
      //Getting CoverFlow2X and CoverFlow2Y Maximum Value
      var sldCovr2dMax = thisSlider.data("cover-max");
      if (isNumeric(sldCovr2dMax)) {
        sldCovr2dMax = sldCovr2dMax;
      } else {
        sldCovr2dMax = 1;
      }

      //Getting Perspective Value For Cover-Flow
      var sldCovrPrspctv = thisSlider.data("cover-perspective");
      if (isNumeric(sldCovrPrspctv)) {
        sldCovrPrspctv = sldCovrPrspctv;
      } else {
        sldCovrPrspctv = 0;
      }

      //Getting Progress Bar Value
      var progressBars = thisSlider.data("progress");
      if (thisSlider.data("intervals") === "yes") {
        if (progressBars === true) {
          innerItems.append('<div class="sz-slide-bar-wrap"><div class="sz-slide-bar animPly"></div></div>');
        }
        //Animated Indicators
        if (thisSlider.find(".carousel-indicators").hasClass("sz-ind-animated")) {
          thisSlider.find(".carousel-indicators > span").addClass("animPly");
        }
      }

      /**
      * ---------------------
      *  Pre-Loader Adding
      * ---------------------
      */

      //Convert Hex Color To RGBA
      //If you write your own code, remember hex color short-cuts (eg., #fff, #000)
      function szHexToRgbA(hex) {
        var clr;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
          clr = hex.substring(1).split("");
          if (clr.length === 3) {
            clr = [clr[0], clr[0], clr[1], clr[1], clr[2], clr[2]];
          }
          clr = "0x" + clr.join("");
          return "rgba(" + [(clr >> 16) & 255, (clr >> 8) & 255, clr & 255].join(",") + ",.1)";
        } else {
          return "rgba(255,255,255,.2)";
        }
      }

      //Pre-Loaders
      var preLoader = thisSlider.is("[data-preloader]");
      var preLoaderV = thisSlider.data("preloader");
      if (preLoader) {
        if (preLoaderV !== "" && preLoaderV.indexOf(":") !== -1 && preLoaderV.match(/:/g).length === 2) {
          var prLdrSplt = preLoaderV.split(":");
          //Getting Pre-Loader Type Value
          var prLdrTyp = prLdrSplt[0];
          if (prLdrTyp !== "") {
            prLdrTyp = prLdrTyp;
          } else {
            prLdrTyp = "circle";
          }
          //Getting Pre-Loader Color Value
          var prLdrClr = prLdrSplt[1];
          if (prLdrClr !== "") {
            prLdrClr = prLdrClr;
          } else {
            prLdrClr = "#9b9c9d";
          }
          //Getting Pre-Loader Background Color Value
          var prLdrBg = prLdrSplt[2];
          if (prLdrBg !== "") {
            prLdrBg = prLdrBg;
          } else {
            prLdrBg = "transparent";
          }
          //Pre-Loaders Types
          if (prLdrTyp === "circle") {
            preLoaderV = '<div class="szc-preloader circle" style="background:' + prLdrBg + ';"><span style="border-top-color:' + szHexToRgbA(prLdrClr) + ';border-right-color:' + prLdrClr + ';border-bottom-color:' + prLdrClr + ';border-left-color:' + prLdrClr + ';"></span></div>';
          } else if (prLdrTyp === "bars") {
            preLoaderV = '<div class="szc-preloader" style="background:' + prLdrBg + ';"><div class="sz-pre-loader-bars"><div class="bar1" style="background:' + prLdrClr + ';"></div><div class="bar2" style="background:' + prLdrClr + ';"></div><div class="bar3" style="background:' + prLdrClr + ';"></div><div class="bar4" style="background:' + prLdrClr + ';"></div><div class="bar5" style="background:' + prLdrClr + ';"></div></div></div>';
          } else if (prLdrTyp === "box") {
            preLoaderV = '<div class="szc-preloader" style="background:' + prLdrBg + ';"><div class="sz-pre-loader-box" style="background:' + prLdrClr + ';"></div></div>';
          } else if (prLdrTyp === "scale") {
            preLoaderV = '<div class="szc-preloader" style="background:' + prLdrBg + ';"><div class="sz-pre-loader-scale"><div style="background:' + prLdrClr + ';"></div><div style="background:' + prLdrClr + ';"></div><div style="background:' + prLdrClr + ';"></div></div></div>';
          } else if (prLdrTyp === "dots") {
            preLoaderV = '<div class="szc-preloader" style="background:' + prLdrBg + ';"><div class="sz-pre-loader-dots"><div class="bounce1" style="background:' + prLdrClr + ';"></div><div class="bounce2" style="background:' + prLdrClr + ';"></div><div class="bounce3" style="background:' + prLdrClr + ';"></div></div></div>';
          } else {
            preLoaderV = '<div class="szc-preloader circle" style="background:#060606;"><span style="border-top-color:#dddede;border-right-color:#9b9c9d;border-bottom-color:#9b9c9d;border-left-color:#9b9c9d;"></span></div>';
          }
        } else {
          preLoaderV = '<div class="szc-preloader circle" style="background:#060606;"><span style="border-top-color:#dddede;border-right-color:#9b9c9d;border-bottom-color:#9b9c9d;border-left-color:#9b9c9d;"></span></div>';
        }
      } else {
        preLoaderV = '<div class="szc-preloader circle" style="background:#060606;"><span style="border-top-color:#dddede;border-right-color:#9b9c9d;border-bottom-color:#9b9c9d;border-left-color:#9b9c9d;"></span></div>';
      }

      //Pre-Loaders Loading
      thisSlider.css("display", "block");
      thisSlider.prepend(preLoaderV);

      /**
      * ------------------------------------------------
      * Width And Height For Indicators || Thumbnails
      * ------------------------------------------------
      */
      var indWidth;
      var indHeight;
      function indiThumb(sldr) {
        var indPadLt = parseInt(sldr.find(".carousel-indicators").css("padding-left"));
        var indPadRt = parseInt(sldr.find(".carousel-indicators").css("padding-right"));
        var indBorderLt = parseInt(sldr.find(".carousel-indicators").css("border-left-width"));
        var indBorderRt = parseInt(sldr.find(".carousel-indicators").css("border-right-width"));
        var indPadTp = parseInt(sldr.find(".carousel-indicators").css("padding-top"));
        var indPadBt = parseInt(sldr.find(".carousel-indicators").css("padding-bottom"));
        var indBorderTp = parseInt(sldr.find(".carousel-indicators").css("border-top-width"));
        var indBorderBt = parseInt(sldr.find(".carousel-indicators").css("border-bottom-width"));
        var indiType = sldr.data("ind-type");
        var indiPstn = sldr.data("ind-position");
        //Position
        sldr.find(".carousel-indicators > li").each(function (i) {
          if (indiDrct === "y") {
            var thisHt = $(this).outerHeight(true);
            thisHt = thisHt * i;
            $(this).css("top", thisHt + "px");
          } else {
            var thisWd = $(this).outerWidth(true);
            thisWd = thisWd * i;
            $(this).css("left", thisWd + "px");
          }
        });
        //Vertical
        if (indiDrct === "y") {
          if (indiType === "relative") {
            if (indiPstn === "left") {
              indHeight = 0;
              indWidth = sldr.find(".carousel-indicators").width();
              indWidth = indWidth + indPadLt + indPadRt + indBorderLt + indBorderRt;
              sldr.find(".carousel-inner").css("left", indWidth + "px");
            } else {
              indHeight = 0;
              indWidth = sldr.find(".carousel-indicators").width();
              indWidth = indWidth + indPadLt + indPadRt + indBorderLt + indBorderRt;
            }
          } else {
            indWidth = 0;
            indHeight = 0;
          }
          //Horizontal
        } else {
          if (indiType === "relative") {
            if (indiPstn === "top") {
              indWidth = 0;
              indHeight = sldr.find(".carousel-indicators").height();
              indHeight = indHeight + indPadTp + indPadBt + indBorderTp + indBorderBt;
              sldr.find(".carousel-inner").css("top", indHeight + "px");
            } else {
              indWidth = 0;
              indHeight = sldr.find(".carousel-indicators").height();
              indHeight = indHeight + indPadTp + indPadBt + indBorderTp + indBorderBt;
            }
          } else {
            indWidth = 0;
            indHeight = 0;
          }
        }
      }

      /**
      * ---------------------------------
      * Width And Height For Carousels
      * ---------------------------------
      */
      var sliderWidthV = thisSlider.data("width"); //Getting Width Value
      var bannerWidth = $('.banner-pg').width();
      var sliderHeightV = Math.round(((bannerWidth / 16) * 9) - heightHackOffset); //thisSlider.data("height"); //Getting Height Value
      var itmIdx = 0; //Current Item Index
      var carWdtDX; //Carousel Width + Single Item Width
      var carHgtDY; //Carousel Height + Single Item Height
      var sliderIntervalV = thisSlider.data("intervals"); //Taking Interval Attribute Value
      var sliderKeyboardV = thisSlider.data("keyboards"); //Taking Keyboard Attribute Value
      var sldMouseWheel = thisSlider.data("mouse"); //Taking Mouse Wheel Attribute Value
      var sliderMoveV; //Carousel Moving Items
      var remanItmAftr; //Remaining Items After Minus the Showed items
      var lastItemsLeft; //Last item's left position
      var totlWdtRemanItms; //Remaining Items Width

      /**
      * ---------------------------------
      * Width And Height For Carousels
      * ---------------------------------
      */
      function carouselItemsSize(atr, dfalt) {
        //All Items Make Block Items
        innerItems.css("display", "block");
        //Getting columns attributes values
        var atrVal = thisSlider.data(atr);
        //If columns attributes exist and value given in number
        if (isNumeric(atrVal)) {
          if (atrVal > 0) { //If columns attributes value is greater than 0
            thisSlider.css("display", "block");
            atrVal = atrVal;
          } else { //If columns attributes value is equal to 0 then hide slider on that particular screen
            thisSlider.css("display", "none");
            atrVal = 0;
          }
        } else { //If columns attributes not exist and value is not given in number
          atrVal = dfalt;
        }
        //Getting Slider Move Value
        sliderMoveV = thisSlider.data("move");
        if (sliderMoveV === "all") {
          sliderMoveV = atrVal;
        } else {
          sliderMoveV = 1;
        }

        //Width
        var carouselWidthVal;
        if (sliderWidthV !== "") {
          carouselWidthVal = sliderWidthV;
        } else {
          carouselWidthVal = "100%";
        }
        //Height
        var bannerW = $('.banner-pg').width();
        var carouselHeightVal = Math.round(((bannerW / 16) * 9) - heightHackOffset);
        // if (sliderHeightV !== "") {
        //   if (sliderHeightV === "window") {
        //     carouselHeightVal = $(window).height();
        //   } else {
        //     carouselHeightVal = sliderHeightV;
        //   }
        // } else {
        //   carouselHeightVal = "inherit";
        // }

        //Setting Main Carousel Div Width
        thisSlider.width(carouselWidthVal);
        //Setting Main Carousel Div Height
        thisSlider.height(carouselHeightVal);

        if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
          //Calculating width
          var inHgtDY = (thisSlider.height() - indHeight) * itemsLength;
          carHgtDY = Math.round(inHgtDY / itemsLength);
          carHgtDY = Math.round(carHgtDY / atrVal);
          //Assigning Width & Height To Carousel Inner
          sliderInner.width(thisSlider.width() - indWidth);
          sliderInner.height(Math.round(inHgtDY / atrVal));
          //Assigning Width & Height To Carousel Items
          innerItems.width(thisSlider.width() - indWidth);
          innerItems.height(carHgtDY);
          //Remaining items after subtracting showed items
          remanItmAftr = itemsLength - atrVal;
          //Width of first set of items after subtracting 1 
          lastItemsLeft = (atrVal - 1) * carHgtDY;
          //Calculating total items width
          var totalItmWdthCY = itemsLength * carHgtDY;
          //Calculating showed items width
          var numColWidthCY = atrVal * carHgtDY;
          //Total Width of items till last set of items
          totlWdtRemanItms = totalItmWdthCY - numColWidthCY;
        } else {
          //Calculating width
          var inWdt = (thisSlider.width() - indWidth) * itemsLength;
          carWdtDX = Math.round(inWdt / itemsLength);
          carWdtDX = Math.round(carWdtDX / atrVal);
          //Assigning Width & Height To Carousel Inner
          sliderInner.width(Math.round((inWdt / atrVal)) + 100);
          sliderInner.height(thisSlider.height() - indHeight);
          //Assigning Width & Height To Carousel Items
          innerItems.width(carWdtDX);
          innerItems.height(thisSlider.height() - indHeight);
          //Remaining items after subtracting showed items
          remanItmAftr = itemsLength - atrVal;
          //Width of first set of items after subtracting 1 
          lastItemsLeft = (atrVal - 1) * carWdtDX;
          //Calculating total items width
          var totalItmWdthCX = itemsLength * carWdtDX;
          //Calculating showed items width
          var numColWidthCX = atrVal * carWdtDX;
          //Total Width of items till last set of items
          totlWdtRemanItms = totalItmWdthCX - numColWidthCX;
        }
      }

      /**
      * --------------------
      * Background Images
      * --------------------
      */
      function bgImgSetting(thisSlider, innerItems, bgVal, bgTyp) {

        //Getting Image Value
        var imgs = thisSlider.is("[data-image]");
        var imgsV = thisSlider.data("image");
        if (imgs) {
          if (imgsV !== "") {
            imgsV = imgsV;
          } else {
            imgsV = bgVal;
          }
        } else {
          imgsV = "100%";
        }

        //If Using Image Tag As Background
        if (bgTyp === "image") {
          innerItems.find(".sz-bg-img").each(function () {
            if (imgsV.indexOf(" ") === -1) {
              $(this).width(imgsV);
            } else {
              var spltImgV = imgsV.split(" ");
              $(this).width(spltImgV[0]);
              $(this).height(spltImgV[1]);
            }
          });
        } else { //If Using Image As Hero Image
          innerItems.find(".sz-bg-img").each(function () {
            $(this).closest(carouselItem).css({
              "background-image": "url(" + $(this).attr("src") + ")",
              "background-size": imgsV,
              "-webkit-background-size": imgsV
            });
            $(this).remove();
          });
        }
      }

      /**
      * -----------------------
      * Auto Height Function
      * -----------------------
      */
      function autoHeightSldr(sld, it, img) {
        // var imgEle = img[0];
        // var clntHght;
        // if (imgEle !== undefined) {
        //   clntHght = imgEle.clientHeight;
        // } else {
        //   clntHght = sld.height();
        // }
        // sld.height(clntHght + indHeight);
        // sld.find(".carousel-inner").height(clntHght);
        // it.height(clntHght);
      }

      /**
      * -------------------------------
      * Width And Height For Sliders
      * -------------------------------
      */
      function sliderWdthHght(sldr) {

        //Calling All Settings For Indicators And Thumbnails
        indiThumb(sldr);

        //For Carousel
        if (sliderTypeV === "carousel") {
          if (window.matchMedia("(min-width: 1201px)").matches) {
            //@media (min-width: 1201px)
            carouselItemsSize("items", 5);
          } else if (window.matchMedia("(min-width:993px) and (max-width:1200px)").matches) {
            //@media (min-width: 993px) and (max-width: 1200px)
            carouselItemsSize("xlscreen", 4);
          } else if (window.matchMedia("(min-width:769px) and (max-width:992px)").matches) {
            //@media (min-width:769px) and (max-width:992px)
            carouselItemsSize("lgscreen", 3);
          } else if (window.matchMedia("(min-width:576px) and (max-width:768px)").matches) {
            //@media (min-width:577px) and (max-width:768px)
            carouselItemsSize("mdscreen", 2);
          } else if (window.matchMedia("(max-width:575px)").matches) {
            //@media (max-width:576px)
            carouselItemsSize("smscreen", 1);
          }
          //For Slider
        } else {
          //Calling bgImgSetting();
          //Getting Background Type Value
          var bgTypeV = sldr.data("background");
          if (bgTypeV !== "") {
            if (bgTypeV === "image") {
              bgImgSetting(sldr, innerItems, "100%", "image");
            } else {
              if (sliderHeightV === "auto" && sldrAnim !== "swipeY" && sldrAnim !== "dragY" && sldrAnim !== "dragCoverY" && sldrAnim !== "swipeCoverY" && sldrAnim !== "dragCover2Y" && sldrAnim !== "swipeCover2Y" && sldrAnim !== "dragCover3Y" && sldrAnim !== "swipeCover3Y" && sldrAnim !== "dragCover4Y" && sldrAnim !== "swipeCover4Y") {
                bgImgSetting(sldr, innerItems, "100%", "image");
              } else {
                bgImgSetting(sldr, innerItems, "cover", "hero");
              }
            }
          } else {
            bgImgSetting(sldr, innerItems, "100%", "image");
          }

          //Width
          var sliderWidthVal;
          if (sliderWidthV !== "") {
            sliderWidthVal = sliderWidthV;
          } else {
            sliderWidthVal = "100%";
          }
          //Height
          var bannerWi = $('.banner-pg').width();
          var sliderHeightVal = Math.round(((bannerWi / 16) * 9) - heightHackOffset);
          // if (sliderHeightV !== "") {
          //   if (sliderHeightV === "window") {
          //     sliderHeightVal = $(window).height();
          //   } else {
          //     sliderHeightVal = sliderHeightV;
          //   }
          // } else {
          //   sliderHeightVal = "inherit";
          // }

          //Setting Main Carousel Div Width
          sldr.width(sliderWidthVal);
          //Setting Main Carousel Div Height
          sldr.height(sliderHeightVal);
          //Taking Width Values From Main Carousel Div
          var wdthVal = sldr.width() - indWidth;
          //Taking Height Values From Main Carousel Div
          var hghtVal = sldr.height() - indHeight;
          if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
            //All Items Make Block Items
            innerItems.css("display", "block");
            //Calculating height
            var slHgtDY = (hghtVal * itemsLength);
            carHgtDY = (slHgtDY / itemsLength);
            //Assigning Width & Height To Carousel Inner
            sliderInner.width(wdthVal);
            sliderInner.height(slHgtDY);
            //Assigning Width & Height To Carousel Items
            innerItems.width(wdthVal);
            innerItems.height(carHgtDY);
          } else if (sldrAnim === "dragCoverX" || sldrAnim === "swipeCoverX" || sldrAnim === "dragCover2X" || sldrAnim === "swipeCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X") {
            //All Items Make Block Items
            innerItems.css("display", "block");
            if (sliderHeightV === "auto") {
              //Calculating width
              var inWdtAu = (sldr.width() - indWidth) * itemsLength;
              carWdtDX = inWdtAu / itemsLength;
              carWdtDX = carWdtDX / sldSpce;
              //Assigning Width & Height To Carousel Inner
              sliderInner.width((inWdtAu / sldSpce) + 100);
              //Assigning Width & Height To Carousel Items
              innerItems.width(carWdtDX);
              autoHeightSldr(sldr, sldr.find(carouselItem + ".active"), sldr.find(carouselItem + ".active").find(".sz-bg-img"));
            } else {
              //Calculating width
              var inWdtZ = (sldr.width() - indWidth) * itemsLength;
              carWdtDX = inWdtZ / itemsLength;
              carWdtDX = carWdtDX / sldSpce;
              //Assigning Width & Height To Carousel Inner
              sliderInner.width((inWdtZ / sldSpce) + 100);
              sliderInner.height(sldr.height() - indHeight);
              //Assigning Width & Height To Carousel Items
              innerItems.width(carWdtDX);
              innerItems.height(sldr.height() - indHeight);
            }
          } else if (sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverY" || sldrAnim === "dragCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
            innerItems.css("display", "block");
            //Calculating width
            var inHgtZY = (sldr.height() - indHeight) * itemsLength;
            carHgtDY = inHgtZY / itemsLength;
            carHgtDY = carHgtDY / sldSpce;
            //Assigning Width & Height To Carousel Inner
            sliderInner.width(sldr.width() - indWidth);
            sliderInner.height(inHgtZY / sldSpce);
            //Assigning Width & Height To Carousel Items
            innerItems.width(sldr.width() - indWidth);
            innerItems.height(carHgtDY);
          } else if (sldrAnim === "fade") {
            if (sliderHeightV === "auto") {
              //Assigning Width & Height To Carousel Inner
              sliderInner.width(wdthVal);
              //Assigning Width & Height To Carousel Items
              innerItems.width(wdthVal);
              autoHeightSldr(sldr, sldr.find(carouselItem + ".active"), sldr.find(carouselItem + ".active").find(".sz-bg-img"));
            } else {
              //Assigning Width & Height To Carousel Inner
              sliderInner.width(wdthVal);
              sliderInner.height(hghtVal);
              //Assigning Width & Height To Carousel Items
              innerItems.width(wdthVal);
              innerItems.height(hghtVal);
            }
          } else if (sldrAnim === "class") {
            if (sliderHeightV === "auto") {
              //Assigning Width & Height To Carousel Inner
              sliderInner.width(wdthVal);
              //Assigning Width & Height To Carousel Items
              innerItems.width(wdthVal);
              autoHeightSldr(sldr, sldr.find(carouselItem + ".active"), sldr.find(carouselItem + ".active").find(".sz-bg-img"));
            } else {
              //Assigning Width & Height To Carousel Inner
              sliderInner.width(wdthVal);
              sliderInner.height(hghtVal);
              //Assigning Width & Height To Carousel Items
              innerItems.width(wdthVal);
              innerItems.height(hghtVal);
            }
          } else {
            //All Items Make Block Items
            innerItems.css("display", "block");
            if (sliderHeightV === "auto") {
              //Calculating width
              var slWdtSX = wdthVal * itemsLength;
              carWdtDX = slWdtSX / itemsLength;
              //Assigning Width & Height To Carousel Inner
              sliderInner.width(slWdtSX + 100);
              //Assigning Width & Height To Carousel Items
              innerItems.width(carWdtDX);
              autoHeightSldr(sldr, sldr.find(carouselItem + ".active"), sldr.find(carouselItem + ".active").find(".sz-bg-img"));
            } else {
              //Calculating width
              var inWdtSX = wdthVal * itemsLength;
              carWdtDX = inWdtSX / itemsLength;
              //Assigning Width & Height To Carousel Inner
              sliderInner.width(inWdtSX + 100);
              sliderInner.height(hghtVal);
              //Assigning Width & Height To Carousel Items
              innerItems.width(carWdtDX);
              innerItems.height(hghtVal);
            }
          }
        }
      }

      /**
      * Indicators || Thumbnails Movement Functions
      * start  : When click on indicator
      * move   : We drag the indicators
      * cancel : We animate back to where we were
      * end    : We animate to the next indicators
      */

      //1 - Duration
      var indDur = indParent.data("ind-duration");
      if (isNumeric(indDur)) {
        indDur = indDur;
      } else {
        indDur = 200;
      }

      //3 - Calculating Width & Height
      var indiWdt;
      var indiHgt;
      var remanInd;
      var remanIndY;
      var lstIndiLX;
      var lstIndiLY;
      var totlWdtIndX;
      var totlHgtInd;
      function indWdHt() {
        if (indiDrct === "y") {
          indiHgt = indLi.outerHeight(true);
          var indLengthY = indLi.length;
          var remanIndYAftr = indParent.height() / indiHgt;
          remanIndY = indLengthY - remanIndYAftr;
          lstIndiLY = (remanIndYAftr - 1) * indiHgt;
          var totlIndHg = indLengthY * indiHgt;
          var numColIndY = remanIndYAftr * indiHgt;
          totlHgtInd = totlIndHg - numColIndY;
        } else {
          indiWdt = indLi.outerWidth(true);
          var indLengthX = indLi.length;
          var remanIndAftr = indParent.width() / indiWdt;
          remanInd = indLengthX - remanIndAftr;
          lstIndiLX = (remanIndAftr - 1) * indiWdt;
          var totlIndWdX = indLengthX * indiWdt;
          var numColIndX = remanIndAftr * indiWdt;
          totlWdtIndX = totlIndWdX - numColIndX;
        }
      }

      //4 - Manually update
      function drgInd(idist, idur) {
        //Assigning distance after calculating
        var ival = (idist < 0 ? "" : "-") + Math.abs(idist).toString();
        if (indiDrct === "y") {
          ival = "translate3d(0," + ival + "px,0)";
        } else {
          ival = "translate3d(" + ival + "px,0,0)";
        }
        //Assigning transition duration of transform property
        indLi.css({
          "transition-duration": idur + "ms",
          "-webkit-transition-duration": idur + "ms",
          "transform": ival,
          "-webkit-transform": ival
        });
      }

      //5 - Drag Status
      var pstnVlInd;
      var thisIndi;
      var lstIndLX;
      var crntIndi = 0;
      function indStatusX(phase, direction, distance, thi, pos, indiWdHt, frstPos, nxtAlPos, dir1, dir2, dir3, dir4, rmnInd, lstIndL, totlWtHt, indPrntWH) {
        if (phase === "start") {
          pstnVlInd = pos;
          thisIndi = thi.index();
        } else if (phase === "move" && (direction === dir1 || direction === dir2)) {
          //Dragging left direction
          if (direction === dir1) {
            drgInd((indiWdHt * thisIndi) - pstnVlInd + distance, 0);
            //Dragging right direction
          } else if (direction === dir2) {
            drgInd((indiWdHt * thisIndi) - pstnVlInd - distance, 0);
          }
        } else if (phase === "cancel") {
          //Beginning set of items when we try to drag them right direction
          if (frstPos > 0) {
            drgInd((indiWdHt * indLi.first().index()), indDur);
            //Beginning or others sets of items when we try to drag them left direction
          } else {
            //When we drag an item that's index is less than (total numbers of items - showed items)
            if (thisIndi < rmnInd) {
              crntIndi = (-Math.round(frstPos / indiWdHt));
              drgInd((indiWdHt * crntIndi), indDur);
              //When we drag an item that's index is greater than (total numbers of items - showed items)
            } else if (thisIndi > rmnInd) {
              //Check next item from drag item exist?
              if (thi.nextAll().last().length) {
                lstIndLX = nxtAlPos;
              } else {
                lstIndLX = lstIndL;
              }
              //Check last item didn't reach on maximum dragged level
              if (lstIndLX > lstIndL) {
                crntIndi = (-Math.round(frstPos / indiWdHt));
                drgInd((indiWdHt * crntIndi), indDur);
                //Check last item reached on maximum dragged level
              } else {
                if ((indiWdHt * indLi.length) > indPrntWH) {
                  drgInd(totlWtHt, indDur);
                } else {
                  drgInd(0, indDur);
                }
              }
              //When we drag an item that's index is equal to (total numbers of items - showed items)
            } else if (thisIndi === rmnInd) {
              //When drag item with index (total numbers of items - showed items) is not active
              if ((pos) > 0) {
                crntIndi = (-Math.round(frstPos / indiWdHt));
                drgInd((indiWdHt * crntIndi), indDur);
                //When drag item with index (total numbers of items - showed items) is active
              } else {
                crntIndi = thisIndi;
                drgInd((indiWdHt * crntIndi), indDur);
              }
            }
          }
        } else if (phase === "end") {
          //Dragging left direction
          if (direction === dir1 || direction === dir3) {
            //When we drag an indicator that's index is less than (total numbers of indicators - showed indicators)
            if (thisIndi < rmnInd) {
              //Beginning set of indicators when we try to drag them right direction
              if (frstPos > 0) {
                drgInd((indiWdHt * indLi.first().index()), indDur);
                //Beginning or others sets of indicators when we try to drag them left direction
              } else {
                //Check next indicator from drag indicator exist?
                if (thi.nextAll().last().length) {
                  lstIndLX = nxtAlPos;
                } else {
                  lstIndLX = lstIndL;
                }
                //Check last indicator didn't reach on maximum dragged level
                if (lstIndLX > lstIndL) {
                  crntIndi = (-Math.round(frstPos / indiWdHt));
                  drgInd((indiWdHt * crntIndi), indDur);
                  //Check last indicator reached on maximum dragged level
                } else {
                  if ((indiWdHt * indLi.length) > indPrntWH) {
                    drgInd(totlWtHt, indDur);
                  } else {
                    drgInd(0, indDur);
                  }
                }
              }
              //When we drag an indicator that's index is greater than (total numbers of indicators - showed indicators)
            } else if (thisIndi > rmnInd) {
              //Check next indicator from drag indicator exist?
              if (thi.nextAll().last().length) {
                lstIndLX = nxtAlPos;
              } else {
                lstIndLX = lstIndL;
              }
              //Check last indicator didn't reach on maximum dragged level
              if (lstIndLX > lstIndL) {
                crntIndi = (-Math.round(frstPos / indiWdHt));
                drgInd((indiWdHt * crntIndi), indDur);
                //Check last indicator reached on maximum dragged level
              } else {
                if ((indiWdHt * indLi.length) > indPrntWH) {
                  drgInd(totlWtHt, indDur);
                } else {
                  drgInd(0, indDur);
                }
              }
              //When we drag an indicator that's index is equal to (total numbers of indicators - showed indicators)
            } else if (thisIndi === rmnInd) {
              //When drag indicator with index (total numbers of indicators - showed indicators) is not active
              if ((pos) > 0) {
                crntIndi = (-Math.round(frstPos / indiWdHt));
                drgInd((indiWdHt * crntIndi), indDur);
                //When drag indicator with index (total numbers of indicators - showed indicators) is active
              } else {
                crntIndi = thisIndi;
                drgInd((indiWdHt * crntIndi), indDur);
              }
            }
            //Dragging right direction
          } else if (direction === dir2 || direction === dir4) {
            //Beginning set of indicators when we try to drag them right direction
            if (frstPos > 0) {
              drgInd((indiWdHt * indLi.first().index()), indDur);
              //Beginning or others sets of indicators when we try to drag them left direction
            } else {
              //When we drag an indicator that's index is less than (total numbers of indicators - showed indicators)
              if (thisIndi < rmnInd) {
                //Beginning set of indicators when we try to drag them right direction
                if (frstPos > 0) {
                  drgInd((indiWdHt * indLi.first().index()), indDur);
                  //Beginning or others sets of indicators when we try to drag them left direction
                } else {
                  crntIndi = (-Math.round(frstPos / indiWdHt));
                  drgInd((indiWdHt * crntIndi), indDur);
                }
                //When we drag an indicator that's index is greater than (total numbers of indicators - showed indicators)
              } else if (thisIndi > rmnInd) {
                //Check next indicator from drag indicator exist?
                if (thi.nextAll().last().length) {
                  lstIndLX = nxtAlPos;
                } else {
                  lstIndLX = lstIndL;
                }
                //Check last indicator didn't reach on maximum dragged level
                if (lstIndLX > lstIndL) {
                  crntIndi = (-Math.round(frstPos / indiWdHt));
                  drgInd((indiWdHt * crntIndi), indDur);
                  //Check last indicator reached on maximum dragged level
                } else if (lstIndLX === lstIndL) {
                  crntIndi = thisIndi - 1;
                  if ((indiWdHt * indLi.length) > indPrntWH) {
                    drgInd(totlWtHt - crntIndi, indDur);
                  } else {
                    drgInd(0, indDur);
                  }
                } else {
                  if ((indiWdHt * indLi.length) > indPrntWH) {
                    drgInd(totlWtHt - indiWdHt, indDur);
                  } else {
                    drgInd(0, indDur);
                  }
                }
                //When we drag an indicator that's index is equal to (total numbers of indicators - showed indicators)
              } else if (thisIndi === rmnInd) {
                crntIndi = (-Math.round(frstPos / indiWdHt));
                drgInd((indiWdHt * crntIndi), indDur);
              }
            }
          }
        }
      }

      //6 - Drag Status Calling Function
      function indiSwipeFunc(event, phase, direction, distance) {
        if (indiDrct === "y") {
          var lastIndiY;
          if ($(this).nextAll().last().length) {
            lastIndiY = $(this).nextAll().last().position().top;
          } else {
            lastIndiY = "";
          }
          indStatusX(phase, direction, distance, $(this), $(this).position().top, indiHgt, indLi.first().position().top, lastIndiY, "up", "down", "left", "right", remanIndY, lstIndiLY, totlHgtInd, indParent.height());
        } else {
          var lastIndiX;
          if ($(this).nextAll().last().length) {
            lastIndiX = $(this).nextAll().last().position().left;
          } else {
            lastIndiX = "";
          }
          indStatusX(phase, direction, distance, $(this), $(this).position().left, indiWdt, indLi.first().position().left, lastIndiX, "left", "right", "up", "down", remanInd, lstIndiLX, totlWdtIndX, indParent.width());
        }
      }

      //7 - Declaring Next Indicator Function
      function indNext(crn) {
        if (indiDrct === "y") {
          if (crn < remanIndY) {
            if (indLi.first().position().top > 0) {
              drgInd((indiHgt * 0), indDur);
            } else {
              drgInd((indiHgt * crn), indDur);
            }
          } else if (crn > remanIndY) {
            if ((indiHgt * indLi.length) > indParent.height()) {
              drgInd(totlHgtInd, indDur);
            } else {
              drgInd(0, indDur);
            }
          } else if (crn === remanIndY) {
            drgInd((indiHgt * crn), indDur);
          }
        } else {
          if (crn < remanInd) {
            if (indLi.first().position().left > 0) {
              drgInd((indiWdt * 0), indDur);
            } else {
              drgInd((indiWdt * crn), indDur);
            }
          } else if (crn > remanInd) {
            if ((indiWdt * indLi.length) > indParent.width()) {
              drgInd(totlWdtIndX, indDur);
            } else {
              drgInd(0, indDur);
            }
          } else if (crn === remanInd) {
            drgInd((indiWdt * crn), indDur);
          }
        }
      }

      /**
      * Layers Animation Effects
      * Like fadeIn And fadeOut
      * &
      * easeIn And easeOut
      */

      //1 - Layers Animation Effects Function
      function animateLayers(elems) {
        //Cache the animation-end event in a variable
        var animEndEvent = "webkitAnimationEnd animationend";
        //Looping all animation layers or elements
        elems.each(function () {
          var thisElem = $(this);
          var animInType;
          var animInDur;
          var animInDly;
          var animInTime;
          //Check data-animation-in attribute exist or not?
          var animIn = thisElem.is("[data-animation-in]");
          if (animIn) {
            //Getting data-animation-in attribute value
            var animInVal = thisElem.data("animation-in");
            animInVal = animInVal.toString();
            if (animInVal !== "") {
              if (animInVal.indexOf(":") !== -1 && animInVal.match(/:/g).length === 3) {
                //Splitting values from ":"
                var animInSplit = animInVal.split(":");
                animInType = animInSplit[0];
                if (animInType !== "") {
                  animInType = animInType;
                }
                animInDur = animInSplit[1];
                if (animInDur !== "") {
                  animInDur = animInDur;
                }
                animInDly = animInSplit[2];
                if (animInDly !== "") {
                  animInDly = animInDly;
                }
                animInTime = animInSplit[3];
                if (animInTime !== "") {
                  animInTime = animInTime;
                }
              } else {
                alert('Wrong Value = ' + animInVal + ' \r\nPlease correct the pattern of data-animation-in attribute like: \r\ndata-animation-in="animationName:Duration:Delay:timingFunction" \r\nFor example: \r\ndata-animation-in="fadeInUp:2000:1000:animEase"');
              }
            }
          }

          var animOutType;
          var animOutDur;
          var animOutDly;
          var animOutTime;
          //Check data-animation-out attribute exist or not?
          var animOut = thisElem.is("[data-animation-out]");
          if (animOut) {
            //Getting data-animation-out attribute value
            var animOutVal = thisElem.data("animation-out");
            animOutVal = animOutVal.toString();
            if (animOutVal !== "") {
              if (animOutVal.indexOf(":") !== -1 && animOutVal.match(/:/g).length === 3) {
                //Splitting values from ":"
                var animOutSplit = animOutVal.split(":");
                animOutType = animOutSplit[0];
                if (animOutType !== "") {
                  animOutType = animOutType;
                }
                animOutDur = animOutSplit[1];
                if (animOutDur !== "") {
                  animOutDur = animOutDur;
                }
                animOutDly = animOutSplit[2];
                if (animOutDly !== "") {
                  animOutDly = animOutDly;
                }
                animOutTime = animOutSplit[3];
                if (animOutTime !== "") {
                  animOutTime = animOutTime;
                }
              } else {
                alert('Wrong Value = ' + animOutVal + ' \r\nPlease correct the pattern of data-animation-out attribute like: \r\ndata-animation-out="animationName:Duration:Delay:timingFunction" \r\nFor example: \r\ndata-animation-out="fadeInUp:2000:1000:animEase"');
              }
            }
          }
          //Assigning Transform Property To Transition Of Carousel Items
          thisElem.css({ "animation-duration": animInDur + "ms", "-webkit-animation-duration": animInDur + "ms", "animation-delay": animInDly + "ms", "-webkit-animation-delay": animInDly + "ms" });

          //Adding animation-in classes
          thisElem.removeClass(animOutType + " " + animOutTime).addClass(animInType + " " + animInTime);
          //After animation end
          thisElem.one(animEndEvent, function () {
            //Assigning Transform Property To Transition Of Carousel Items
            thisElem.css({ "animation-duration": animOutDur + "ms", "-webkit-animation-duration": animOutDur + "ms", "animation-delay": animOutDly + "ms", "-webkit-animation-delay": animOutDly + "ms" });
            //Removing animation-in classes
            thisElem.removeClass(animInType + " " + animInTime).addClass(animOutType + " " + animOutTime);
          });
        });
      }

      //2 - Remove Animation Classes From Layers
      function removeAnimClass(slides) {
        var allSlides = slides.not(".active");
        allSlides.each(function () {
          var animAttr = $(this).find(".sz-animated");
          animAttr.each(function () {
            var attrIn = $(this).is("[data-animation-in]");
            var attrInVal = $(this).data("animation-in");
            if (attrIn === true && attrInVal !== "") {
              //Splitting values from ":"
              var attrInValSplt = attrInVal.split(":");
              //Removing animation-out classes
              $(this).removeClass(attrInValSplt[0]);
              $(this).removeClass(attrInValSplt[3]);
            }
            var attrOut = $(this).is("[data-animation-out]");
            var attrOutVal = $(this).data("animation-out");
            if (attrOut === true && attrOutVal !== "") {
              //Splitting values from ":"
              var attrOutValSplt = attrOutVal.split(":");
              $(this).removeClass(attrOutValSplt[0]);
              $(this).removeClass(attrOutValSplt[3]);
            }
          });
        });
      }

      //Getting Slider Duration Value
      var sldDur = thisSlider.data("duration");
      if (isNumeric(sldDur)) {
        sldDur = sldDur;
      } else {
        sldDur = 600;
      }

      //Setting Transition Timing Function Value
      var sldTmFn = thisSlider.data("timing");
      if (sldTmFn !== "") {
        sldTmFn = sldTmFn;
      } else {
        sldTmFn = "ease";
      }
      innerItems.addClass(sldTmFn);

      //Default Bootstrap Carousel Functions
      function sldDfltFn(sld) {
        //Default Bootstrap Carousel Settings Are Going To Stop

        new bootstrap.Carousel(sld, {
          interval: false,
          keyboard: false,
          pause: false,
          touch: false
        });
      }

      /**
      * Slider || Carousel Movement Functions
      * start  : When click
      * move   : When drag
      * cancel : When animate back to where we were
      * end    : When animate to the next
      */

      //1 - Items Transition Duration And Translate
      function drgItmsTransi(dur, val) {
        //For Carousel
        if (sliderTypeV === "carousel") {
          if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
            val = "translate3d(0," + val + "px,0)";
          } else {
            val = "translate3d(" + val + "px,0,0)";
          }
          //For Slider
        } else {
          if (sldrAnim === "dragY" || sldrAnim === "swipeY" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverY") {
            val = "translate3d(0," + val + "px,0)";
          } else {
            val = "translate3d(" + val + "px,0,0)";
          }
        }

        //Assigning Transition Duration Of Transform Property To Carousel Items
        innerItems.css({
          "transition-duration": dur + "ms",
          "-webkit-transition-duration": dur + "ms",
          "transform": val,
          "-webkit-transform": val
        });
      }

      //2 - Manually Update The Position Of The Items On Drag
      function drgItm(distance, duration) {
        //Assigning distance after calculating
        var valu = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
        drgItmsTransi(duration, valu);
      }

      //3 - Links Clicked Images On Drag Or Swipe
      function clickLinks(ele) {
        var preventLinks;
        if (ele.find(".sz-links").length) {
          preventLinks = false;
          ele.find(".sz-links").on("click", function (e) {
            if (!preventLinks) {
              e.preventDefault();
              preventLinks = true;
            }
          });
        }
      }

      //3 - Multiple Item Carousel ( Drag )
      //3 - i - Global Variables
      var thisIndxCX;
      var positionValCX;
      var lastItemLeftCX;

      //3 - ii - Drag current item
      function dragCurntItem(crnt, wdht) {
        itmIdx = crnt.index();
        crnt.closest(thisSlider).carousel(itmIdx);
        drgItm((wdht * itmIdx), sldDur);
      }

      //3 - iii - Drag on first item
      function dragOnFirstItem(itm, wdht) {
        itmIdx = itm.index();
        itm.closest(thisSlider).carousel(itmIdx);
        drgItm((wdht * sliderFirstItem.index()), sldDur);
      }

      //3 - iv - Drag first set of items
      function dragFirstSet(itm, wdht, pos, freMde) {
        itmIdx = (-Math.round(pos / wdht));
        itm.closest(thisSlider).carousel(itmIdx);
        if (!freMde) {
          drgItm((wdht * itmIdx), sldDur);
        }
      }

      //3 - v - Drag remaining items
      function dragRemainWdth(itm, totlWdHt) {
        itmIdx = itm.index();
        itm.closest(thisSlider).carousel(itmIdx);
        drgItm(totlWdHt, sldDur);
      }

      //3 - vi - Drag Status For Multi Items
      function dragStatusItems(phase, direction, distance, thi, pos, carWdtHgt, frstPos, totlWdHgt, nxtPos, dir1, dir2, dir3, dir4, sticky, stickyV, freeMode) {
        if (phase === "start") {
          thisIndxCX = thi.index();
          positionValCX = pos;
          if (!freeMode) {
            if (sticky) {
              if (stickyV === "yes") {
                drgItm((carWdtHgt * thisIndxCX) - positionValCX, 0);
              }
            }
          }
        } else if (phase === "move" && (direction === dir1 || direction === dir2)) {
          //Dragging left direction
          if (direction === dir1) {
            drgItm((carWdtHgt * thisIndxCX) - positionValCX + distance, 0);
            //Dragging right direction
          } else if (direction === dir2) {
            drgItm((carWdtHgt * thisIndxCX) - positionValCX - distance, 0);
          }
        } else if (phase === "cancel") {
          if (!freeMode) {
            //Beginning set of items when we try to drag them right direction
            if (frstPos > 0) {
              dragOnFirstItem(thi, carWdtHgt);
              //Beginning or others sets of items when we try to drag them left direction
            } else {
              //When we drag an item that's index is less than (total numbers of items - showed items)
              if (thisIndxCX < remanItmAftr) {
                dragFirstSet(thi, carWdtHgt, frstPos, freeMode);
                //When we drag an item that's index is greater than (total numbers of items - showed items)
              } else if (thisIndxCX > remanItmAftr) {
                //Check next item from drag item exist?
                if (thi.nextAll().last().length) {
                  lastItemLeftCX = nxtPos;
                } else {
                  lastItemLeftCX = lastItemsLeft;
                }
                //Check last item didn't reach on maximum dragged level
                if (lastItemLeftCX > lastItemsLeft) {
                  dragFirstSet(thi, carWdtHgt, frstPos, freeMode);
                  //Check last item reached on maximum dragged level
                } else {
                  dragRemainWdth(thi, totlWdHgt);
                }
                //When we drag an item that's index is equal to (total numbers of items - showed items)
              } else if (thisIndxCX === remanItmAftr) {
                //When drag item with index (total numbers of items - showed items) is not active
                if ((pos) > 0) {
                  dragFirstSet(thi, carWdtHgt, frstPos, freeMode);
                  //When drag item with index (total numbers of items - showed items) is active
                } else {
                  dragCurntItem(thi, carWdtHgt);
                }
              }
            }
          }
        } else if (phase === "end") {
          //If item is exist inside a link then prevent click default function on swipe or drag
          clickLinks(thi);
          //Ending on left direction
          if (direction === dir1 || direction === dir3) {
            //When we drag an item that's index is less than (total numbers of items - showed items)
            if (thisIndxCX < remanItmAftr) {
              //Beginning set of items when we try to drag them right direction
              if (frstPos > 0) {
                dragOnFirstItem(thi, carWdtHgt);
                //Beginning or others sets of items when we try to drag them left direction
              } else {
                //Check next item from drag item exist?
                if (thi.nextAll().last().length) {
                  lastItemLeftCX = nxtPos;
                } else {
                  lastItemLeftCX = lastItemsLeft;
                }
                //Check last item didn't reach on maximum dragged level
                if (lastItemLeftCX > lastItemsLeft) {
                  dragFirstSet(thi, carWdtHgt, frstPos, freeMode);
                  //Check last item reached on maximum dragged level
                } else {
                  dragRemainWdth(thi, totlWdHgt);
                }
              }
              //When we drag an item that's index is greater than (total numbers of items - showed items)
            } else if (thisIndxCX > remanItmAftr) {
              //Check next item from drag item exist?
              if (thi.nextAll().last().length) {
                lastItemLeftCX = nxtPos;
              } else {
                lastItemLeftCX = lastItemsLeft;
              }
              //Check last item didn't reach on maximum dragged level
              if (lastItemLeftCX > lastItemsLeft) {
                dragFirstSet(thi, carWdtHgt, frstPos, freeMode);
                //Check last item reached on maximum dragged level
              } else {
                dragRemainWdth(thi, totlWdHgt);
              }
              //When we drag an item that's index is equal to (total numbers of items - showed items)
            } else if (thisIndxCX === remanItmAftr) {
              //When drag item with index (total numbers of items - showed items) is not active
              if ((pos) > 0) {
                dragFirstSet(thi, carWdtHgt, frstPos, freeMode);
                //When drag item with index (total numbers of items - showed items) is active
              } else {
                dragCurntItem(thi, carWdtHgt);
              }
            }
            //Ending on right direction
          } else if (direction === dir2 || direction === dir4) {
            //Beginning set of items when we try to drag them right direction
            if (frstPos > 0) {
              dragOnFirstItem(thi, carWdtHgt);
              //Beginning or others sets of items when we try to drag them left direction
            } else {
              //When we drag an item that's index is less than (total numbers of items - showed items)
              if (thisIndxCX < remanItmAftr) {
                //Beginning set of items when we try to drag them right direction
                if (frstPos > 0) {
                  dragOnFirstItem(thi, carWdtHgt);
                  //Beginning or others sets of items when we try to drag them left direction
                } else {
                  dragFirstSet(thi, carWdtHgt, frstPos, freeMode);
                }
                //When we drag an item that's index is greater than (total numbers of items - showed items)
              } else if (thisIndxCX > remanItmAftr) {
                //Check next item from drag item exist?
                if (thi.nextAll().last().length) {
                  lastItemLeftCX = nxtPos;
                } else {
                  lastItemLeftCX = lastItemsLeft;
                }
                //Check last item didn't reach on maximum dragged level
                if (lastItemLeftCX > lastItemsLeft) {
                  dragFirstSet(thi, carWdtHgt, frstPos, freeMode);
                  //Check last item reached on maximum dragged level
                } else if (lastItemLeftCX === lastItemsLeft) {
                  itmIdx = thisIndxCX - 1;
                  thi.closest(thisSlider).carousel(itmIdx);
                  if (!freeMode) {
                    drgItm(totlWdtRemanItms - carWdtHgt, sldDur);
                  }
                } else {
                  itmIdx = thisIndxCX;
                  thi.closest(thisSlider).carousel(itmIdx);
                  drgItm(totlWdtRemanItms - carWdtHgt, sldDur);
                }
                //When we drag an item that's index is equal to (total numbers of items - showed items)
              } else if (thisIndxCX === remanItmAftr) {
                dragFirstSet(thi, carWdtHgt, frstPos, freeMode);
              }
            }
          }
          //Indicators || Thumbnails Scroll
          indNext(itmIdx);
        }
      }

      //4 - Declaring Next Item Function For Drag Effect
      function nxtItm() {
        //Getting Current Item Index
        itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
        //For Carousel
        if (sliderTypeV === "carousel") {
          if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
            drgItm(carHgtDY * itmIdx, sldDur);
          } else {
            drgItm(carWdtDX * itmIdx, sldDur);
          }
          //For Slider
        } else {
          if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
            drgItm(carHgtDY * itmIdx, sldDur);
          } else {
            drgItm(carWdtDX * itmIdx, sldDur);
          }
        }
      }

      //5 - Declaring Previous Item Function For Drag Effect
      function prvItm() {
        //Getting Current Item Index
        itmIdx = Math.max(itmIdx - 1, 0);
        //For Carousel
        if (sliderTypeV === "carousel") {
          if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
            drgItm(carHgtDY * itmIdx, sldDur);
          } else {
            drgItm(carWdtDX * itmIdx, sldDur);
          }
          //For Slider
        } else {
          if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
            drgItm(carHgtDY * itmIdx, sldDur);
          } else {
            drgItm(carWdtDX * itmIdx, sldDur);
          }
        }
      }

      //6 - i - Declaring Next Item Function For ( Fade )
      function fdNxtItm(ele) {
        innerItems.css({ "opacity": "0", "z-index": "0" }).siblings().eq(ele).css({ "opacity": "1", "z-index": "1" });
        thisSlider.carousel(ele);
      }

      //6 - ii - Catching Each Phase Of The Swipe For ( Fade )
      var prvntFadeSts = true;
      function fadeStatus(phase, direction, dir1, dir2, thi) {
        if (phase === "end") {
          if (prvntFadeSts) {
            prvntFadeSts = false;
            //If item is exist inside a link then prevent click default function on swipe or drag
            clickLinks(thi);
            if (direction === dir1) {
              if (itmIdx !== (itemsLength - 1)) {
                itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                fdNxtItm(itmIdx);
              } else {
                itmIdx = 0;
                fdNxtItm(itmIdx);
              }
            } else if (direction === dir2) {
              if (itmIdx !== 0) {
                itmIdx = Math.max(itmIdx - 1, 0);
                fdNxtItm(itmIdx);
              } else {
                itmIdx = (itemsLength - 1);
                fdNxtItm(itmIdx);
              }
            }
            //Indicators || Thumbnails Scroll
            indNext(itmIdx);
            setTimeout(function () {
              prvntFadeSts = true;
            }, sldDur);
          }
        }
      }

      //7 - Multiple Item Carousel ( Swipe )
      var prvntswpeCar = true;
      function swipeCarousel(phase, direction, dir1, dir2, thi) {
        if (phase === "end") {
          if (prvntswpeCar) {
            prvntswpeCar = false;
            //If item is exist inside a link then prevent click default function on swipe or drag
            clickLinks(thi);
            if (direction === dir1) {
              if (itmIdx < remanItmAftr) {
                nxtItm();
                thi.carousel(itmIdx);
              }
            } else if (direction === dir2) {
              if (itmIdx <= remanItmAftr) {
                prvItm();
                thi.carousel(itmIdx);
              } else if (itmIdx > remanItmAftr) {
                itmIdx = remanItmAftr;
                prvItm();
                thi.carousel(itmIdx);
              }
            }
            //Indicators || Thumbnails Scroll
            indNext(itmIdx);
            setTimeout(function () {
              prvntswpeCar = true;
            }, sldDur);
          }
        }
      }

      //7 - Single Item Slider ( Drag )
      var drgSldrPos;
      var drgSldrIndx;
      function dragSlider(phase, direction, distance, pos, carWdtHg, dir1, dir2, thi, sticky, stickyV) {
        if (phase === "start") {
          drgSldrPos = pos;
          drgSldrIndx = thi.index();
          if (sticky) {
            if (stickyV === "yes") {
              drgItm((carWdtHg * drgSldrIndx) - drgSldrPos, 0);
            }
          }
        } else if (phase === "move" && (direction === dir1 || direction === dir2)) {
          if (direction === dir1) {
            drgItm((carWdtHg * drgSldrIndx) - drgSldrPos + distance, 0);
          } else if (direction === dir2) {
            drgItm((carWdtHg * drgSldrIndx) - drgSldrPos - distance, 0);
          }
        } else if (phase === "cancel") {
          drgItm(carWdtHg * itmIdx, sldDur);
        } else if (phase === "end") {
          //If item is exist inside a link then prevent click default function on swipe or drag
          clickLinks(thi);
          if (direction === dir1) {
            itmIdx = Math.min(drgSldrIndx + 1, itemsLength - 1);
            thi.closest(thisSlider).carousel(itmIdx);
            drgItm(carWdtHg * itmIdx, sldDur);
          } else if (direction === dir2) {
            itmIdx = Math.max(drgSldrIndx - 1, 0);
            thi.closest(thisSlider).carousel(itmIdx);
            drgItm(carWdtHg * itmIdx, sldDur);
          } else {
            drgItm(carWdtHg * itmIdx, sldDur);
          }
          //Indicators || Thumbnails Scroll
          indNext(itmIdx);
        }
      }

      //8 - Single Item Slider ( dragCoverX && dragCoverY )
      var posVlDZ;
      var indxVlDZ;
      function dragCoverFlow(phase, direction, distance, pos, carWdtHg, sldWH, indWH, dir1, dir2, thi, sticky, stickyV) {
        if (phase === "start") {
          posVlDZ = pos;
          indxVlDZ = thi.index();
          if (sticky) {
            if (stickyV === "yes") {
              drgItm((carWdtHg * indxVlDZ) - posVlDZ, 0);
            }
          }
        } else if (phase === "move" && (direction === dir1 || direction === dir2)) {
          if (direction === dir1) {
            drgItm((carWdtHg * indxVlDZ) - posVlDZ + distance, 0);
          } else if (direction === dir2) {
            drgItm((carWdtHg * indxVlDZ) - posVlDZ - distance, 0);
          }
        } else if (phase === "cancel") {
          drgItm((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
        } else if (phase === "end") {
          //If item is exist inside a link then prevent click default function on swipe or drag
          clickLinks(thi);
          if (direction === dir1) {
            itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
            thi.closest(thisSlider).carousel(itmIdx);
            drgItm((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
          } else if (direction === dir2) {
            itmIdx = Math.max(itmIdx - 1, 0);
            thi.closest(thisSlider).carousel(itmIdx);
            drgItm((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
          } else {
            drgItm((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
          }
          //Indicators || Thumbnails Scroll
          indNext(itmIdx);
        }
      }

      //9 - Single Item Slider ( swipeCoverX )
      var prvntswpeSldrZ = true;
      function swipeCoverFlow(phase, direction, carWdtHg, sldWH, indWH, dir1, dir2, thi) {
        if (phase === "end") {
          if (prvntswpeSldrZ) {
            prvntswpeSldrZ = false;
            //If item is exist inside a link then prevent click default function on swipe or drag
            clickLinks(thi);
            if (direction === dir1) {
              itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
              thi.carousel(itmIdx);
              drgItm((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
            } else if (direction === dir2) {
              itmIdx = Math.max(itmIdx - 1, 0);
              thi.carousel(itmIdx);
              drgItm((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
            }
            //Indicators || Thumbnails Scroll
            indNext(itmIdx);
            setTimeout(function () {
              prvntswpeSldrZ = true;
            }, sldDur);
          }
        }
      }

      //10 - Single Item Slider Next Item Function ( swipeCoverX & dragCoverX )
      function nxtItmDZ(itmIx) {
        var wdtHgtDZ;
        var sldWdHtDZ;
        var indWdHtDZ;
        if (sldrAnim === "dragCoverX" || sldrAnim === "swipeCoverX") {
          wdtHgtDZ = carWdtDX;
          sldWdHtDZ = thisSlider.width();
          indWdHtDZ = indWidth;
        } else if (sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverY") {
          wdtHgtDZ = carHgtDY;
          sldWdHtDZ = thisSlider.height();
          indWdHtDZ = indHeight;
        }
        drgItm((wdtHgtDZ * itmIx) + ((wdtHgtDZ - (sldWdHtDZ - indWdHtDZ)) / 2), sldDur);
      }

      //11 - Single Item Slider ( Swipe)
      var prvntswpeSldr = true;
      function swipeSlider(phase, direction, dir1, dir2, thi) {
        if (phase === "end") {
          if (prvntswpeSldr) {
            prvntswpeSldr = false;
            //If item is exist inside a link then prevent click default function on swipe or drag
            clickLinks(thi);
            if (direction === dir1) {
              nxtItm();
              thi.carousel(itmIdx);
            } else if (direction === dir2) {
              prvItm();
              thi.carousel(itmIdx);
            }
            //Indicators || Thumbnails Scroll
            indNext(itmIdx);
            setTimeout(function () {
              prvntswpeSldr = true;
            }, sldDur);
          }
        }
      }

      //12 - i - Transform Function For ( swipeCover2X, dragCover2X & swipeCover2Y, dragCover2Y )
      function cvrFlwtrnsfrm(el, dr, tp) {
        el.css({
          "transition-duration": dr + "ms",
          "-webkit-transition-duration": dr + "ms",
          "transform": tp,
          "-webkit-transform": tp
        });
      }

      //12 - ii - Dragging Parent
      function drgCvrFlwPrnt(dis, dur) {
        var vl = (dis < 0 ? "" : "-") + Math.abs(dis).toString();
        if (sldrAnim === "dragCover2X" || sldrAnim === "swipeCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X") {
          vl = "translate3d(" + vl + "px,0,0)";
        } else if (sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
          vl = "translate3d(0," + vl + "px,0)";
        }
        cvrFlwtrnsfrm(innerItems.parent(), dur, vl);
      }

      //12 - iii - Dragging Items || Slides
      function drgCvrFlwItms(dis, dur, min, max, dir, indx, dirctn, prspctv) {
        //Only For dragCover2X + dragCover2Y
        var frct = dis / 1000;
        var mins = (min + frct);
        var maxs = (max - frct);
        var minss;
        var maxss;
        if (mins < max) {
          minss = mins;
        } else {
          minss = max;
        }
        if (maxs > min) {
          maxss = maxs;
        } else {
          maxss = min;
        }

        //For All Others
        var frct1 = dis / 10;
        var mins1 = (min - frct1);
        var maxs1 = (max + frct1);
        var minss1;
        var maxss1;
        if (mins1 > max) {
          maxss1 = mins1;
        } else {
          maxss1 = max;
        }
        if (maxs1 < min) {
          minss1 = maxs1;
        } else {
          minss1 = min;
        }

        if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover2Y") {
          cvrFlwtrnsfrm(indx, dur, "scale3d(" + maxss + "," + maxss + "," + maxss + ")");
          cvrFlwtrnsfrm(dir, dur, "scale3d(" + minss + "," + minss + "," + minss + ")");
        } else {
          if (sldrAnim === "dragCover3X") {
            if (dirctn === "left") {
              cvrFlwtrnsfrm(indx, dur, "rotate3d(0,0,1,-" + minss1 + "deg)");
              cvrFlwtrnsfrm(dir, dur, "rotate3d(0,0,1," + maxss1 + "deg)");
            } else if (dirctn === "right") {
              cvrFlwtrnsfrm(indx, dur, "rotate3d(0,0,1," + minss1 + "deg)");
              cvrFlwtrnsfrm(dir, dur, "rotate3d(0,0,1,-" + maxss1 + "deg)");
            }
          } else if (sldrAnim === "dragCover3Y") {
            if (dirctn === "up") {
              cvrFlwtrnsfrm(indx, dur, "rotate3d(0,0,1,-" + minss1 + "deg)");
              cvrFlwtrnsfrm(dir, dur, "rotate3d(0,0,1," + maxss1 + "deg)");
            } else if (dirctn === "down") {
              cvrFlwtrnsfrm(indx, dur, "rotate3d(0,0,1," + minss1 + "deg)");
              cvrFlwtrnsfrm(dir, dur, "rotate3d(0,0,1,-" + maxss1 + "deg)");
            }
          } else if (sldrAnim === "dragCover4X") {
            if (dirctn === "left") {
              cvrFlwtrnsfrm(indx, dur, "perspective(" + prspctv + "px) rotate3d(0,1,0," + minss1 + "deg)");
              cvrFlwtrnsfrm(dir, dur, "perspective(" + prspctv + "px) rotate3d(0,1,0,-" + maxss1 + "deg)");
            } else if (dirctn === "right") {
              cvrFlwtrnsfrm(indx, dur, "perspective(" + prspctv + "px) rotate3d(0,1,0,-" + minss1 + "deg)");
              cvrFlwtrnsfrm(dir, dur, "perspective(" + prspctv + "px) rotate3d(0,1,0," + maxss1 + "deg)");
            }
          } else if (sldrAnim === "dragCover4Y") {
            if (dirctn === "up") {
              cvrFlwtrnsfrm(indx, dur, "perspective(" + prspctv + "px) rotate3d(1,0,0,-" + minss1 + "deg)");
              cvrFlwtrnsfrm(dir, dur, "perspective(" + prspctv + "px) rotate3d(1,0,0," + maxss1 + "deg)");
            } else if (dirctn === "down") {
              cvrFlwtrnsfrm(indx, dur, "perspective(" + prspctv + "px) rotate3d(1,0,0," + minss1 + "deg)");
              cvrFlwtrnsfrm(dir, dur, "perspective(" + prspctv + "px) rotate3d(1,0,0,-" + maxss1 + "deg)");
            }
          }
        }
      }

      //12 - iv - Dragging Items || Slides At The End Of Dragging
      function drgCvrFlwEnd(dur, min, max, indx, prspctv) {

        if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y") {
          cvrFlwtrnsfrm(innerItems, dur, "scale3d(" + min + "," + min + "," + min + ")");
          cvrFlwtrnsfrm(innerItems.eq(indx), dur, "scale3d(" + max + "," + max + "," + max + ")");
        } else {
          if (sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X") {
            cvrFlwtrnsfrm(innerItems.eq(indx).prevAll(), dur, "rotate3d(0,0,1,-" + min + "deg)");
            cvrFlwtrnsfrm(innerItems.eq(indx).nextAll(), dur, "rotate3d(0,0,1," + min + "deg)");
            cvrFlwtrnsfrm(innerItems.eq(indx), dur, "rotate3d(0,0,1," + max + "deg)");
          } else if (sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y") {
            cvrFlwtrnsfrm(innerItems.eq(indx).prevAll(), dur, "rotate3d(0,0,1,-" + min + "deg)");
            cvrFlwtrnsfrm(innerItems.eq(indx).nextAll(), dur, "rotate3d(0,0,1," + min + "deg)");
            cvrFlwtrnsfrm(innerItems.eq(indx), dur, "rotate3d(0,0,1," + max + "deg)");
          } else if (sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X") {
            cvrFlwtrnsfrm(innerItems.eq(indx).prevAll(), dur, "perspective(" + prspctv + "px) rotate3d(0,1,0," + min + "deg)");
            cvrFlwtrnsfrm(innerItems.eq(indx).nextAll(), dur, "perspective(" + prspctv + "px) rotate3d(0,1,0,-" + min + "deg)");
            cvrFlwtrnsfrm(innerItems.eq(indx), dur, "perspective(" + prspctv + "px) rotate3d(0,1,0," + max + "deg)");
          } else if (sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
            cvrFlwtrnsfrm(innerItems.eq(indx).prevAll(), dur, "perspective(" + prspctv + "px) rotate3d(1,0,0,-" + min + "deg)");
            cvrFlwtrnsfrm(innerItems.eq(indx).nextAll(), dur, "perspective(" + prspctv + "px) rotate3d(1,0,0," + min + "deg)");
            cvrFlwtrnsfrm(innerItems.eq(indx), dur, "perspective(" + prspctv + "px) rotate3d(1,0,0," + max + "deg)");
          }
        }
      }

      //12 - v - swipeCover2X, dragCover2X & swipeCover2Y, dragCover2Y ( Drag )
      function dragCoverFlow2d(phase, direction, distance, carWdtHg, sldWH, indWH, dir1, dir2, thi, min, max, prspctv) {
        if (phase === "move" && (direction === dir1 || direction === dir2)) {
          if (direction === dir1) {
            drgCvrFlwPrnt((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2) + distance, 0);
            drgCvrFlwItms(distance, 0, min, max, innerItems.eq(itmIdx).next(), innerItems.eq(itmIdx), direction, prspctv);
            innerItems.css("z-index", "0");
            innerItems.eq(itmIdx).css("z-index", "2");
            innerItems.eq(itmIdx).next().css("z-index", "1");
          } else if (direction === dir2) {
            drgCvrFlwPrnt((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2) - distance, 0);
            drgCvrFlwItms(distance, 0, min, max, innerItems.eq(itmIdx).prev(), innerItems.eq(itmIdx), direction, prspctv);
            innerItems.css("z-index", "0");
            innerItems.eq(itmIdx).css("z-index", "2");
            innerItems.eq(itmIdx).prev().css("z-index", "1");
          }
        } else if (phase === "cancel") {
          drgCvrFlwPrnt((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
          drgCvrFlwEnd(sldDur, min, max, itmIdx, prspctv);
        } else if (phase === "end") {
          clickLinks(thi);
          if (direction === dir1) {
            innerItems.eq(itmIdx).next().css("z-index", "3");
            itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
            thi.closest(thisSlider).carousel(itmIdx);
            drgCvrFlwPrnt((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
            drgCvrFlwEnd(sldDur, min, max, itmIdx, prspctv);
          } else if (direction === dir2) {
            innerItems.eq(itmIdx).prev().css("z-index", "3");
            itmIdx = Math.max(itmIdx - 1, 0);
            thi.closest(thisSlider).carousel(itmIdx);
            drgCvrFlwPrnt((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
            drgCvrFlwEnd(sldDur, min, max, itmIdx, prspctv);
          } else {
            drgCvrFlwPrnt((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
            drgCvrFlwEnd(sldDur, min, max, itmIdx, prspctv);
          }
          indNext(itmIdx);
        }
      }

      //12 - vi - swipeCover2X, dragCover2X & swipeCover2Y, dragCover2Y ( Swipe )
      var prvntswpeSldr2d = true;
      function swipeCoverFlow2d(phase, direction, carWdtHg, sldWH, indWH, dir1, dir2, thi, min, max, prspctv) {
        if (phase === "end") {
          if (prvntswpeSldr2d) {
            prvntswpeSldr2d = false;
            clickLinks(thi);
            if (direction === dir1) {
              itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
              thi.carousel(itmIdx);
              drgCvrFlwPrnt((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
              drgCvrFlwEnd(sldDur, min, max, itmIdx, prspctv);
              innerItems.css("z-index", "0");
              innerItems.eq(itmIdx).css("z-index", "2");
              innerItems.eq(itmIdx).next().css("z-index", "1");
            } else if (direction === dir2) {
              itmIdx = Math.max(itmIdx - 1, 0);
              thi.carousel(itmIdx);
              drgCvrFlwPrnt((carWdtHg * itmIdx) + ((carWdtHg - (sldWH - indWH)) / 2), sldDur);
              drgCvrFlwEnd(sldDur, min, max, itmIdx, prspctv);
              innerItems.css("z-index", "0");
              innerItems.eq(itmIdx).css("z-index", "2");
              innerItems.eq(itmIdx).prev().css("z-index", "1");
            }
            indNext(itmIdx);
            setTimeout(function () {
              prvntswpeSldr2d = true;
            }, sldDur);
          }
        }
      }

      //12 - vii - Next Item Function For ( swipeCover2X, dragCover2X & swipeCover2Y, dragCover2Y )
      function nxtItmCF2(itmIx) {
        var wdtHgtCF;
        var sldWdHtCF;
        var indWdHtCF;
        if (sldrAnim === "dragCover2X" || sldrAnim === "swipeCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X") {
          wdtHgtCF = carWdtDX;
          sldWdHtCF = thisSlider.width();
          indWdHtCF = indWidth;
        } else if (sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
          wdtHgtCF = carHgtDY;
          sldWdHtCF = thisSlider.height();
          indWdHtCF = indHeight;
        }
        drgCvrFlwPrnt((wdtHgtCF * itmIx) + ((wdtHgtCF - (sldWdHtCF - indWdHtCF)) / 2), sldDur);
        drgCvrFlwEnd(sldDur, sldCovr2dMin, sldCovr2dMax, itmIx, sldCovrPrspctv);
        innerItems.css("z-index", "0");
        innerItems.eq(itmIx).next().css("z-index", "1");
        innerItems.eq(itmIx).prev().css("z-index", "1");
        innerItems.eq(itmIx).css("z-index", "2");
      }

      //13 - i - Class Animations Value For ( class )
      function clsAnmVls(el, atrN, atrV) {
        //Defining array for animations
        var alAnmAr = [];
        //Check data attribute exist or not?
        var alAnmDt = el.is(atrN);
        if (alAnmDt) { //If exist
          //Getting data-slides-in attribute value
          var alAnmDtV = el.data(atrV);
          alAnmDtV = alAnmDtV.toString();
          if (alAnmDtV !== "") { //If value is not empty
            if (alAnmDtV.indexOf(":") !== -1 && alAnmDtV.match(/:/g).length === 2) { //Check ":" exist and length of them
              //Splitting values from ":"
              var alAnmDtSpt = alAnmDtV.split(":");
              //Getting Animation Class Name
              var alAnmNm = alAnmDtSpt[0];
              if (alAnmNm !== "") { //If value is not empty
                alAnmNm = alAnmNm;
              }
              //Getting Animation Duration
              var alAnmDr = alAnmDtSpt[1];
              if (alAnmDr !== "") { //If value is not empty
                alAnmDr = alAnmDr;
              }
              //Getting Animation Timing Function
              var alAnmTm = alAnmDtSpt[2];
              if (alAnmTm !== "") { //If value is not empty
                alAnmTm = alAnmTm;
              }
              //Adding Values Into Array
              alAnmAr.push(alAnmNm, alAnmDr, alAnmTm);
              return alAnmAr;
            } else {
              alert("You are entering wrong value. Please read documentation part - Slides Animation -> class");
            }
          }
        }
      }

      //13 - ii - Declaring Next Item Function For ( class )
      function clsNxtItm(lst, crnt) {
        var elmLast = innerItems.eq(lst);
        var elmCrnt = innerItems.eq(crnt);
        var lstInAnm = clsAnmVls(elmLast, "[data-slides-in]", "slides-in");
        var lstOutAnm = clsAnmVls(elmLast, "[data-slides-out]", "slides-out");
        var crntInAnm = clsAnmVls(elmCrnt, "[data-slides-in]", "slides-in");
        var crntOutAnm = clsAnmVls(elmCrnt, "[data-slides-out]", "slides-out");
        var lstInAnmN = "fdInLft";
        var lstInAnmT = "animEasein";
        var lstOutAnmN = "fdOutRgt";
        var lstOutAnmD = "500";
        var lstOutAnmT = "animEasein";
        var crntInAnmN = "fdInLft";
        var crntInAnmD = "500";
        var crntInAnmT = "animEasein";
        var crntOutAnmN = "fdOutRgt";
        var crntOutAnmT = "animEasein";
        //Caching last element animation in values
        if (lstInAnm !== undefined) {
          lstInAnmN = lstInAnm[0];
          lstInAnmT = lstInAnm[2];
        }
        //Caching last element animation out values
        if (lstOutAnm !== undefined) {
          lstOutAnmN = lstOutAnm[0];
          lstOutAnmD = lstOutAnm[1];
          lstOutAnmT = lstOutAnm[2];
        }
        //Caching current element animation in values
        if (crntInAnm !== undefined) {
          crntInAnmN = crntInAnm[0];
          crntInAnmD = crntInAnm[1];
          crntInAnmT = crntInAnm[2];
        }
        //Caching current element animation out values
        if (crntOutAnm !== undefined) {
          crntOutAnmN = crntOutAnm[0];
          crntOutAnmT = crntOutAnm[2];
        }
        //Adding last element animation values
        innerItems.eq(lst).removeClass(lstInAnmN + " " + lstInAnmT).addClass(lstOutAnmN + " " + lstOutAnmT);
        innerItems.eq(lst).css({ "animation-duration": lstOutAnmD + "ms", "-webkit-animation-duration": lstOutAnmD + "ms" });
        //Adding current element animation values
        innerItems.eq(crnt).removeClass(crntOutAnmN + " " + crntOutAnmT).addClass(crntInAnmN + " " + crntInAnmT);
        innerItems.eq(crnt).css({ "animation-duration": crntInAnmD + "ms", "-webkit-animation-duration": crntInAnmD + "ms" });
        innerItems.css({ "opacity": "0", "z-index": "0" }).siblings().eq(crnt).css({ "opacity": "1", "z-index": "1" });
        thisSlider.carousel(crnt);
      }

      //13 - iii - Catching Each Phase Of The Swipe For ( class )
      var prvntClsSts = true;
      function clsStatus(phase, direction, thi) {
        if (phase === "end") {
          if (prvntClsSts) {
            prvntClsSts = false;
            //If item is exist inside a link then prevent click default function on swipe or drag
            clickLinks(thi);
            if (direction === "left") {
              if (itmIdx !== (itemsLength - 1)) {
                clsNxtItm(itmIdx, (Math.min(itmIdx + 1, itemsLength - 1)));
                itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
              } else {
                clsNxtItm(itmIdx, 0);
                itmIdx = 0;
              }
            } else if (direction === "right") {
              if (itmIdx !== 0) {
                clsNxtItm(itmIdx, (Math.max(itmIdx - 1, 0)));
                itmIdx = Math.max(itmIdx - 1, 0);
              } else {
                clsNxtItm(0, (itemsLength - 1));
                itmIdx = (itemsLength - 1);
              }
            }
            //Indicators || Thumbnails Scroll
            indNext(itmIdx);
            setTimeout(function () {
              prvntClsSts = true;
            }, sldDur);
          }
        }
      }

      //14 - Touch Swipe All Functions Calling
      function touchSwipeFunc(event, phase, direction, distance) {
        if (sliderTypeV === "carousel") { //For Carousel
          if (sldrAnim === "swipeX") {
            swipeCarousel(phase, direction, "left", "right", $(this));
          } else if (sldrAnim === "swipeY") {
            swipeCarousel(phase, direction, "up", "down", $(this));
          } else if (sldrAnim === "dragX") {
            var nextAllPosX;
            //Check next item from drag item exist?
            if ($(this).nextAll().last().length) {
              nextAllPosX = $(this).nextAll().last().position().left;
            } else {
              nextAllPosX = "";
            }
            dragStatusItems(phase, direction, distance, $(this), $(this).position().left, carWdtDX, sliderFirstItem.position().left, totlWdtRemanItms, nextAllPosX, "left", "right", "up", "down", sldSticky, sldStickyV, sldFreeMode);
          } else if (sldrAnim === "dragY") {
            var nextAllPosY;
            //Check next item from drag item exist?
            if ($(this).nextAll().last().length) {
              nextAllPosY = $(this).nextAll().last().position().top;
            } else {
              nextAllPosY = "";
            }
            dragStatusItems(phase, direction, distance, $(this), $(this).position().top, carHgtDY, sliderFirstItem.position().top, totlWdtRemanItms, nextAllPosY, "up", "down", "left", "right", sldSticky, sldStickyV, sldFreeMode);
          }
        } else { //For Slider
          if (sldrAnim === "dragCoverX") {
            dragCoverFlow(phase, direction, distance, $(this).position().left, carWdtDX, thisSlider.width(), indWidth, "left", "right", $(this), sldSticky, sldStickyV);
          } else if (sldrAnim === "dragCoverY") {
            dragCoverFlow(phase, direction, distance, $(this).position().top, carHgtDY, thisSlider.height(), indHeight, "up", "down", $(this), sldSticky, sldStickyV);
          } else if (sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover3X" || sldrAnim === "swipeCover4X") {
            swipeCoverFlow2d(phase, direction, carWdtDX, thisSlider.width(), indWidth, "left", "right", $(this), sldCovr2dMin, sldCovr2dMax, sldCovrPrspctv);
          } else if (sldrAnim === "swipeCover2Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "swipeCover4Y") {
            swipeCoverFlow2d(phase, direction, carHgtDY, thisSlider.height(), indHeight, "up", "down", $(this), sldCovr2dMin, sldCovr2dMax, sldCovrPrspctv);
          } else if (sldrAnim === "swipeCoverX") {
            swipeCoverFlow(phase, direction, carWdtDX, thisSlider.width(), indWidth, "left", "right", $(this));
          } else if (sldrAnim === "swipeCoverY") {
            swipeCoverFlow(phase, direction, carHgtDY, thisSlider.height(), indHeight, "up", "down", $(this));
          } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "dragCover4X") {
            dragCoverFlow2d(phase, direction, distance, carWdtDX, thisSlider.width(), indWidth, "left", "right", $(this), sldCovr2dMin, sldCovr2dMax, sldCovrPrspctv);
          } else if (sldrAnim === "dragCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "dragCover4Y") {
            dragCoverFlow2d(phase, direction, distance, carHgtDY, thisSlider.height(), indHeight, "up", "down", $(this), sldCovr2dMin, sldCovr2dMax, sldCovrPrspctv);
          } else if (sldrAnim === "swipeX") {
            swipeSlider(phase, direction, "left", "right", $(this));
          } else if (sldrAnim === "swipeY") {
            swipeSlider(phase, direction, "up", "down", $(this));
          } else if (sldrAnim === "fade") {
            fadeStatus(phase, direction, "left", "right", $(this));
          } else if (sldrAnim === "class") {
            clsStatus(phase, direction, $(this));
          } else if (sldrAnim === "dragY") {
            dragSlider(phase, direction, distance, $(this).position().top, carHgtDY, "up", "down", $(this), sldSticky, sldStickyV);
          } else {
            dragSlider(phase, direction, distance, $(this).position().left, carWdtDX, "left", "right", $(this), sldSticky, sldStickyV);
          }
        }
      }

      /**
      * --- All Swipe Functions Ends Here ---
      */

      /**
      * -------------------------------
      * 1 - Interval For Drag Effect
      * -------------------------------
      */

      //Function To Get animating in & out - duration & delay values
      function animIntrvl(anmEl, atr, atrV) {
        var anmDrV;
        var anmDlV;
        var anmAtrV = anmEl.data(atrV);
        if (anmEl.is(atr)) { //Checking attribute exist or not
          if (anmAtrV !== "" && anmAtrV.indexOf(":") !== -1 && anmAtrV.match(/:/g).length === 3) { //Checking attribute values
            //Splitting values from ":"
            var animInSplitX = anmAtrV.split(":");
            //Getting Duration Value
            anmDrV = animInSplitX[1];
            if (anmDrV !== "") {
              anmDrV = anmDrV;
            } else {
              anmDrV = 1000;
            }
            //Getting Delay Value
            anmDlV = animInSplitX[2];
            if (anmDlV !== "") {
              anmDlV = anmDlV;
            } else {
              anmDlV = 1000;
            }
          }
        } else {
          anmDrV = 500;
          anmDlV = 500;
        }
        return (parseInt(anmDrV) + parseInt(anmDlV));
      }

      //Loading bar and animated indicators function
      function progrBars(ele, crntEle, dur) {
        //Set CSS to all inactive animated elements
        ele.css({
          "opacity": "0",
          "animation-duration": 0 + "ms",
          "-webkit-animation-duration": 0 + "ms",
        });
        //Remove play and pause classes first then add stop class to all inactive animated elements
        ele.removeClass("animPly animPuse");
        //Set CSS to active animated elements
        crntEle.css({
          "opacity": "1",
          "animation-duration": dur + "ms",
          "-webkit-animation-duration": dur + "ms",
        });
        //Remove stop and pause classes first then add play class to active animated elements
        crntEle.removeClass("animPuse").addClass("animPly");
      } //End Of Function progrBars(ele,crntEle,dur)

      //Common Values Of Interval Function
      function intrvlFnctn(slider, slide) {
        //Check last carousel item has arrived or not ?
        var lastSlideIndex = slider.find(carouselItem).last().index();
        var sliderCycleV = slider.data("cycle");
        var carWdtHgtInter;
        var carPosiInter;
        var sldWdHtTDZ;
        var indWdHtTDZ;
        //For Carousel
        if (sliderTypeV === "carousel") {
          if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
            carWdtHgtInter = carHgtDY;
            carPosiInter = sliderFirstItem.position().top;
          } else {
            carWdtHgtInter = carWdtDX;
            carPosiInter = sliderFirstItem.position().left;
          }
        } else {
          if (sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverY") {
            carWdtHgtInter = carHgtDY;
            sldWdHtTDZ = slider.height();
            indWdHtTDZ = indHeight;
          } else if (sldrAnim === "dragCoverX" || sldrAnim === "swipeCoverX") {
            carWdtHgtInter = carWdtDX;
            sldWdHtTDZ = slider.width();
            indWdHtTDZ = indWidth;
          }
        }
        //For Carousel
        if (sliderTypeV === "carousel") {
          if (sldrAnim === "swipeX" || sldrAnim === "swipeY") {
            if (itmIdx < remanItmAftr) {
              nxtItm();
              slider.carousel(itmIdx);
            } else {
              //Check cycle of slider continuously or stop at the end ?
              if (sliderCycleV !== "stop") {
                itmIdx = 0;
                drgItm((carWdtHgtInter * itmIdx), sldDur);
                slider.carousel(0);
              }
            }
          } else {
            if (itmIdx < remanItmAftr) {
              if (carPosiInter === 0) {
                if (slide.index() === 1) {
                  itmIdx = slide.index() + sliderMoveV;
                  drgItm((carWdtHgtInter * itmIdx), sldDur);
                  slider.carousel(itmIdx);
                } else {
                  itmIdx = sliderFirstItem.index() + sliderMoveV;
                  drgItm((carWdtHgtInter * itmIdx), sldDur);
                  slider.carousel(itmIdx);
                }
              } else {
                itmIdx = Math.min(itmIdx + sliderMoveV, itemsLength - sliderMoveV);
                drgItm((carWdtHgtInter * itmIdx), sldDur);
                slider.carousel(itmIdx);
              }
            } else {
              //Check cycle of slider continuously or stop at the end ?
              if (sliderCycleV === "stop") {
                itmIdx = itmIdx + sliderMoveV;
                slider.carousel(itmIdx);
              } else {
                itmIdx = 0;
                drgItm((carWdtHgtInter * itmIdx), sldDur);
                slider.carousel(0);
              }
            }
          }
          //For Slider
        } else {
          if (sldrAnim === "swipeX" || sldrAnim === "swipeY" || sldrAnim === "default") {
            //Check last carousel item has arrived or not ?
            if (lastSlideIndex === slide.index()) {
              //Check cycle of slider continuously or stop at the end ?
              if (sliderCycleV !== "stop") {
                //Assigning transition duration and translate property to carousel items
                drgItmsTransi(sldDur, 0);
                itmIdx = 0;
                slider.carousel(itmIdx);
              }
            } else {
              nxtItm();
              slider.carousel(itmIdx);
            }
          } else if (sldrAnim === "fade") {
            //Check last carousel item has arrived or not ?
            if (lastSlideIndex === slide.index()) {
              //Check cycle of slider continuously or stop at the end ?
              if (sliderCycleV !== "stop") {
                itmIdx = 0;
                fdNxtItm(itmIdx);
              }
            } else {
              itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
              fdNxtItm(itmIdx);
            }
          } else if (sldrAnim === "class") {
            //Check last carousel item has arrived or not ?
            if (lastSlideIndex === slide.index()) {
              //Check cycle of slider continuously or stop at the end ?
              if (sliderCycleV !== "stop") {
                clsNxtItm(itmIdx, 0);
                itmIdx = 0;
              }
            } else {
              clsNxtItm(itmIdx, (Math.min(itmIdx + 1, itemsLength - 1)));
              itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
            }
          } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
            //Check last carousel item has arrived or not ?
            if (lastSlideIndex === slide.index()) {
              //Check cycle of slider continuously or stop at the end ?
              if (sliderCycleV !== "stop") {
                drgItmsTransi(sldDur, -((carWdtHgtInter * 0) + ((carWdtHgtInter - (sldWdHtTDZ - indWdHtTDZ)) / 2)));
                itmIdx = 0;
                slider.carousel(itmIdx);
              }
            } else {
              itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
              nxtItmDZ(itmIdx);
              slider.carousel(itmIdx);
            }
          } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
            //Check last carousel item has arrived or not ?
            if (lastSlideIndex === slide.index()) {
              //Check cycle of slider continuously or stop at the end ?
              if (sliderCycleV !== "stop") {
                nxtItmCF2(0);
                itmIdx = 0;
                slider.carousel(itmIdx);
              }
            } else {
              itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
              nxtItmCF2(itmIdx);
              slider.carousel(itmIdx);
            }
          } else if (sldrAnim === "dragX" || sldrAnim === "dragY") {
            //Check last carousel item has arrived or not ?
            if (lastSlideIndex === slide.index()) {
              //Check cycle of slider continuously or stop at the end ?
              if (sliderCycleV !== "stop") {
                //Assigning transition duration and translate property to carousel items
                drgItmsTransi(sldDur, 0);
                itmIdx = 0;
                slider.carousel(itmIdx);
              }
            } else {
              nxtItm();
              slider.carousel(itmIdx);
            }
          }
        }
        //Indicators || Thumbnails Scroll
        indNext(itmIdx);
      } //End Of Function intrvlFnctn(slider,slide)

      //Automatic cycle interval function or slide change interval function
      var drgTmOtIdIntrvl; //Declaring Global Variable For setTimeout
      function dragInterval(slider, slide) {
        //Defining Array For Layers Animation Duration And Delay
        var anmArTm = [];
        //Looping All Animated Layers
        slide.find(".sz-animated").each(function () {
          var anmIntrvIn = animIntrvl($(this), "[data-animation-in]", "animation-in");
          var anmIntrvOut = animIntrvl($(this), "[data-animation-out]", "animation-out");
          anmArTm.push(anmIntrvIn + anmIntrvOut);
        });

        //Defining A Variable For Final Value
        var finalValue;
        //1st Step - Check Item's Interval Value. If Exist Then Take This Value As A Final Value
        var itemIntervalV = slide.data("item-interval");
        if (isNumeric(itemIntervalV)) {
          finalValue = itemIntervalV;
        } else {
          finalValue = ((Math.max.apply(Math, anmArTm)) + 300);
        }
        //If loading bar or animated indicators "Available" then run this part
        if (slider.find(".carousel-indicators").hasClass("sz-ind-animated") || (progressBars === true && slide.find(".sz-slide-bar-wrap").length && slide.find(".sz-slide-bar").length)) {
          //Animated Indicators
          if (slider.find(".carousel-indicators").hasClass("sz-ind-animated")) {
            if (slider.find(".carousel-indicators.sz-ind-animated > li > span").length) {
              //Calling progrBars() Function for animated indicators
              progrBars(slider.find(".carousel-indicators.sz-ind-animated > li > span"), slider.find(".carousel-indicators.sz-ind-animated > li").eq(slide.index()).children("span"), finalValue);
              //When animated indicators animation ends
              slider.find(".carousel-indicators.sz-ind-animated > li").eq(slide.index()).children("span").one("webkitAnimationEnd animationend", function () {
                itmIdx = slide.index();
                intrvlFnctn(slider, slide);
              });
            }
          }
          //Loading Bar
          if (slide.find(".sz-slide-bar-wrap").length) {
            if (slide.find(".sz-slide-bar").length) {
              //Calling progrBars() Function for loading bar
              progrBars(slider.find(".sz-slide-bar"), slide.find(".sz-slide-bar"), finalValue);
              //When loading bar animation ends
              slide.find(".sz-slide-bar").one("webkitAnimationEnd animationend", function () {
                itmIdx = slide.index();
                intrvlFnctn(slider, slide);
              });
            }
          }
        } else { //If loading bar or animated indicators "Not Added" then run this part
          //Set the "setTimeout()" Method. And assign it Final Value
          drgTmOtIdIntrvl = setTimeout(function () {
            intrvlFnctn(slider, slide);
          }, finalValue);
        }
      } //End Of Function dragInterval(slider,slide)

      /**
      * -------------------------
      * 2 - Mouse Wheel Option
      * -------------------------
      */
      function dragMouseWheel(sldr) {
        if (sldMouseWheel === "yes") {
          var prvntSpeedWheel = true;
          sldr.on("wheel", function (e) {
            //Prevent Scroll
            e.preventDefault();
            e.stopPropagation();
            if (prvntSpeedWheel) {
              prvntSpeedWheel = false;
              var carWdtHgtWheel;
              var carPosiWheel;

              //For Carousel
              if (sliderTypeV === "carousel") {
                if (sldrAnim === "dragY") {
                  carWdtHgtWheel = carHgtDY;
                  carPosiWheel = sliderFirstItem.position().top;
                } else {
                  carWdtHgtWheel = carWdtDX;
                  carPosiWheel = sliderFirstItem.position().left;
                }
              }

              //Mouse Wheel Event Start
              if (e.originalEvent.deltaY > 0) {
                //For Carousel
                if (sliderTypeV === "carousel") {
                  if (sldrAnim === "swipeX" || sldrAnim === "swipeY") {
                    if (itmIdx < remanItmAftr) {
                      nxtItm();
                      $(this).carousel(itmIdx);
                    }
                  } else {
                    if (itmIdx < remanItmAftr) {
                      if (carPosiWheel === 0) {
                        if (itmIdx === 1) {
                          itmIdx = Math.min(itmIdx + sliderMoveV, itemsLength - sliderMoveV);
                          drgItm((carWdtHgtWheel * itmIdx), sldDur);
                          $(this).carousel(itmIdx);
                        } else {
                          itmIdx = sliderFirstItem.index() + sliderMoveV;
                          drgItm((carWdtHgtWheel * itmIdx), sldDur);
                          $(this).carousel(itmIdx);
                        }
                      } else {
                        if (carPosiWheel > 0) {
                          itmIdx = sliderFirstItem.index() + sliderMoveV;
                          drgItm((carWdtHgtWheel * itmIdx), sldDur);
                          $(this).carousel(itmIdx);
                        } else {
                          itmIdx = Math.min(itmIdx + sliderMoveV, itemsLength - sliderMoveV);
                          drgItm((carWdtHgtWheel * itmIdx), sldDur);
                          $(this).carousel(itmIdx);
                        }
                      }
                    }
                  }
                  //For Slider
                } else {
                  if (sldrAnim === "fade") {
                    itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                    fdNxtItm(itmIdx);
                  } else if (sldrAnim === "class") {
                    clsNxtItm(itmIdx, (Math.min(itmIdx + 1, itemsLength - 1)));
                    itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                  } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
                    itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                    nxtItmDZ(itmIdx);
                    $(this).carousel(itmIdx);
                  } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
                    itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                    nxtItmCF2(itmIdx);
                    $(this).carousel(itmIdx);
                  } else {
                    nxtItm();
                    $(this).carousel(itmIdx);
                  }
                }
              } else {
                //For Carousel
                if (sliderTypeV === "carousel") {
                  if (sldrAnim === "swipeX" || sldrAnim === "swipeY") {
                    if (itmIdx <= remanItmAftr) {
                      prvItm();
                      $(this).carousel(itmIdx);
                    } else if (itmIdx > remanItmAftr) {
                      itmIdx = remanItmAftr;
                      prvItm();
                      $(this).carousel(itmIdx);
                    }
                  } else {
                    if (itmIdx <= remanItmAftr) {
                      if (carPosiWheel >= 0) {
                        itmIdx = sliderFirstItem.index();
                        drgItm((carWdtHgtWheel * itmIdx), sldDur);
                      } else {
                        itmIdx = Math.max(itmIdx - sliderMoveV, 0);
                        drgItm((carWdtHgtWheel * itmIdx), sldDur);
                        $(this).carousel(itmIdx);
                      }
                    } else {
                      itmIdx = remanItmAftr - sliderMoveV;
                      drgItm((carWdtHgtWheel * itmIdx), sldDur);
                      $(this).carousel(itmIdx);
                    }
                  }
                  //For Slider
                } else {
                  if (sldrAnim === "fade") {
                    itmIdx = Math.max(itmIdx - 1, 0);
                    fdNxtItm(itmIdx);
                  } else if (sldrAnim === "class") {
                    clsNxtItm(itmIdx, (Math.max(itmIdx - 1, 0)));
                    itmIdx = Math.max(itmIdx - 1, 0);
                  } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
                    itmIdx = Math.max(itmIdx - 1, 0);
                    nxtItmDZ(itmIdx);
                    $(this).carousel(itmIdx);
                  } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
                    itmIdx = Math.max(itmIdx - 1, 0);
                    nxtItmCF2(itmIdx);
                    $(this).carousel(itmIdx);
                  } else {
                    prvItm();
                    $(this).carousel(itmIdx);
                  }
                }
              }
              //Indicators || Thumbnails Scroll
              indNext(itmIdx);
              setTimeout(function () {
                prvntSpeedWheel = true;
              }, sldDur);
            }
          });
        } //End of mouse wheel event
      }

      /**
      * ----------------------
      * 3 - Keyboard Option
      * ----------------------
      */
      function dragKeyboard(sldr) {
        if (sliderKeyboardV === "yes") {
          var prvntSpeedKeydown = true;
          sldr.on("keydown", function (e) {
            //Prevent Scroll
            e.preventDefault();
            e.stopPropagation();
            if (prvntSpeedKeydown) {
              prvntSpeedKeydown = false;
              var carWdtHgtKey;
              var carPosiKey;

              //For Carousel
              if (sliderTypeV === "carousel") {
                if (sldrAnim === "dragY") {
                  carWdtHgtKey = carHgtDY;
                  carPosiKey = sliderFirstItem.position().top;
                } else {
                  carWdtHgtKey = carWdtDX;
                  carPosiKey = sliderFirstItem.position().left;
                }
              }

              //Declaring Keys
              var key1;
              var key2;
              if (sldrAnim === "dragY" || sldrAnim === "swipeY" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverY" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
                key1 = 38;
                key2 = 40;
              } else {
                key1 = 37;
                key2 = 39;
              }

              //Keyboard Event Start
              switch (e.which) {
                case key1:
                  //For Carousel
                  if (sliderTypeV === "carousel") {
                    if (sldrAnim === "swipeX" || sldrAnim === "swipeY") {
                      if (itmIdx <= remanItmAftr) {
                        prvItm();
                        $(this).carousel(itmIdx);
                      } else if (itmIdx > remanItmAftr) {
                        itmIdx = remanItmAftr;
                        prvItm();
                        $(this).carousel(itmIdx);
                      }
                    } else {
                      if (itmIdx <= remanItmAftr) {
                        if (carPosiKey >= 0) {
                          itmIdx = sliderFirstItem.index();
                          drgItm((carWdtHgtKey * itmIdx), sldDur);
                        } else {
                          itmIdx = Math.max(itmIdx - sliderMoveV, 0);
                          drgItm((carWdtHgtKey * itmIdx), sldDur);
                          $(this).carousel(itmIdx);
                        }
                      } else {
                        itmIdx = remanItmAftr - sliderMoveV;
                        drgItm((carWdtHgtKey * itmIdx), sldDur);
                        $(this).carousel(itmIdx);
                      }
                    }
                    //For Slider
                  } else {
                    if (sldrAnim === "fade") {
                      itmIdx = Math.max(itmIdx - 1, 0);
                      fdNxtItm(itmIdx);
                    } else if (sldrAnim === "class") {
                      clsNxtItm(itmIdx, (Math.max(itmIdx - 1, 0)));
                      itmIdx = Math.max(itmIdx - 1, 0);
                    } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
                      itmIdx = Math.max(itmIdx - 1, 0);
                      nxtItmDZ(itmIdx);
                      $(this).carousel(itmIdx);
                    } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
                      itmIdx = Math.max(itmIdx - 1, 0);
                      nxtItmCF2(itmIdx);
                      $(this).carousel(itmIdx);
                    } else {
                      prvItm();
                      $(this).carousel(itmIdx);
                    }
                  }
                  break;
                case key2:
                  //For Carousel
                  if (sliderTypeV === "carousel") {
                    if (sldrAnim === "swipeX" || sldrAnim === "swipeY") {
                      if (itmIdx < remanItmAftr) {
                        nxtItm();
                        $(this).carousel(itmIdx);
                      }
                    } else {
                      if (itmIdx < remanItmAftr) {
                        if (carPosiKey === 0) {
                          if (itmIdx === 1) {
                            itmIdx = Math.min(itmIdx + sliderMoveV, itemsLength - sliderMoveV);
                            drgItm((carWdtHgtKey * itmIdx), sldDur);
                            $(this).carousel(itmIdx);
                          } else {
                            itmIdx = sliderFirstItem.index() + sliderMoveV;
                            drgItm((carWdtHgtKey * itmIdx), sldDur);
                            $(this).carousel(itmIdx);
                          }
                        } else {
                          if (carPosiKey > 0) {
                            itmIdx = sliderFirstItem.index() + sliderMoveV;
                            drgItm((carWdtHgtKey * itmIdx), sldDur);
                            $(this).carousel(itmIdx);
                          } else {
                            itmIdx = Math.min(itmIdx + sliderMoveV, itemsLength - sliderMoveV);
                            drgItm((carWdtHgtKey * itmIdx), sldDur);
                            $(this).carousel(itmIdx);
                          }
                        }
                      }
                    }
                    //For Slider
                  } else {
                    if (sldrAnim === "fade") {
                      itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                      fdNxtItm(itmIdx);
                    } else if (sldrAnim === "class") {
                      clsNxtItm(itmIdx, (Math.min(itmIdx + 1, itemsLength - 1)));
                      itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                    } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
                      itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                      nxtItmDZ(itmIdx);
                      $(this).carousel(itmIdx);
                    } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
                      itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                      nxtItmCF2(itmIdx);
                      $(this).carousel(itmIdx);
                    } else {
                      nxtItm();
                      $(this).carousel(itmIdx);
                    }
                  }
                  break;
              }
              //Indicators || Thumbnails Scroll
              indNext(itmIdx);
              setTimeout(function () {
                prvntSpeedKeydown = true;
              }, sldDur);
            }
          });
        } //End of keyboard event
      }

      /**
      * ----------------------------------------------
      * 4 - Manually Moves Items Through Indicators
      * ----------------------------------------------
      */
      function dragIndicators(indi, sldr) {
        var preventDelayInd = true;
        indi.click(function () {
          var carWdtHgtInd;
          var sldWdHtIDZ;
          var indWdHtIDZ;
          //For Carousel
          if (sliderTypeV === "carousel") {
            if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
              carWdtHgtInd = carHgtDY;
            } else {
              carWdtHgtInd = carWdtDX;
            }
            //For Slider
          } else {
            if (sldrAnim === "dragY" || sldrAnim === "swipeY" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverY") {
              carWdtHgtInd = carHgtDY;
              sldWdHtIDZ = $(this).closest(sldr).height();
              indWdHtIDZ = indHeight;
            } else {
              carWdtHgtInd = carWdtDX;
              sldWdHtIDZ = $(this).closest(sldr).width();
              indWdHtIDZ = indWidth;
            }
          }

          if (preventDelayInd) {
            preventDelayInd = false;
            //Checking length of previous items
            var prevLengthInd = innerItems.eq($(this).index()).prev().length;
            if (prevLengthInd) {
              //For Carousel
              if (sliderTypeV === "carousel") {
                if (sldrAnim === "swipeX" || sldrAnim === "swipeY") {
                  if ($(this).index() <= remanItmAftr) {
                    drgItm((carWdtHgtInd * $(this).index()), sldDur);
                  } else {
                    drgItmsTransi(sldDur, -(remanItmAftr * carWdtHgtInd));
                  }
                } else {
                  if ($(this).index() <= remanItmAftr) {
                    drgItm((carWdtHgtInd * $(this).index()), sldDur);
                  } else {
                    drgItmsTransi(sldDur, -(remanItmAftr * carWdtHgtInd));
                  }
                }
                //For Slider
              } else {
                if (sldrAnim === "fade") {
                  itmIdx = $(this).index();
                  fdNxtItm(itmIdx);
                } else if (sldrAnim === "class") {
                  clsNxtItm(itmIdx, ($(this).index()));
                  itmIdx = $(this).index();
                } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
                  //Assigning transition duration and translate property to carousel items
                  drgItmsTransi(sldDur, -((carWdtHgtInd * $(this).index()) + ((carWdtHgtInd - (sldWdHtIDZ - indWdHtIDZ)) / 2)));
                } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
                  nxtItmCF2($(this).index());
                } else {
                  var prevAllLengthInd = innerItems.eq($(this).index()).prevAll().length;
                  var indLiTransInd = (carWdtHgtInd * prevAllLengthInd);
                  //Assigning transition duration and translate property to carousel items
                  drgItmsTransi(sldDur, -indLiTransInd);
                }
              }
            } else {
              if (sldrAnim === "fade") {
                itmIdx = $(this).index();
                fdNxtItm(itmIdx);
              } else if (sldrAnim === "class") {
                clsNxtItm(itmIdx, ($(this).index()));
                itmIdx = $(this).index();
              } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
                //Assigning transition duration and translate property to carousel items
                drgItmsTransi(sldDur, -((carWdtHgtInd * 0) + ((carWdtHgtInd - (sldWdHtIDZ - indWdHtIDZ)) / 2)));
              } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
                nxtItmCF2(0);
              } else {
                //Assigning transition duration and translate property to carousel items
                drgItmsTransi(sldDur, 0);
              }
            }
            //Again indexing current item
            if (sldrAnim !== "fade") {
              itmIdx = $(this).index();
              $(this).closest(sldr).carousel(itmIdx);
            }
            setTimeout(function () {
              preventDelayInd = true;
            }, sldDur);
          }
        }); //End of indicators event
      }

      /**
      * ---------------------------------------
      * 5 - Navigation Left And Right Button
      * ---------------------------------------
      */
      //5 - i -This function will block double click before sliding completed
      function isDblClkEle(clickedEle, sldDur) {
        //if already clicked return TRUE to indicate this click is not allowed
        if (clickedEle.data("isclicked")) {
          return true;
        }
        //mark as clicked for sldDur second
        clickedEle.data("isclicked", true);
        setTimeout(function () {
          clickedEle.removeData("isclicked");
        }, sldDur);
        //return FALSE to indicate this click was allowed
        return false;
      }

      //5 - ii - This function will show left and right navigation buttons images on window load
      function naviImgFxd(sldr, cruslItm) {
        if (sldr.data("background") === "image") { //If we are using data-background="image"
          var nxtFrstI = sldr.find(cruslItm).eq(1).find(".sz-bg-img").attr("src");
          var prvFrstI = sldr.find(cruslItm).last().find(".sz-bg-img").attr("src");
          sldr.append('<div class="carousel-control-next-image" style="background-image:url(' + nxtFrstI + ');"></div>');
          sldr.append('<div class="carousel-control-prev-image" style="background-image:url(' + prvFrstI + ');"></div>');
        } else { //if we are using data-background="hero"
          var nxtFrst = sldr.find(cruslItm).eq(1).css("background-image");
          var prvFrst = sldr.find(cruslItm).last().css("background-image");
          //For edge browser check url("") || url()
          if (nxtFrst.indexOf('url("') === -1 && prvFrst.indexOf('url("') === -1) {
            nxtFrst = nxtFrst.split('url(');
            nxtFrst = nxtFrst[1].split(')');
            prvFrst = prvFrst.split('url(');
            prvFrst = prvFrst[1].split(')');
          } else {
            nxtFrst = nxtFrst.split('url("');
            nxtFrst = nxtFrst[1].split('")');
            prvFrst = prvFrst.split('url("');
            prvFrst = prvFrst[1].split('")');
          }
          sldr.append('<div class="carousel-control-next-image" style="background-image:url(' + nxtFrst[0] + ');"></div>');
          sldr.append('<div class="carousel-control-prev-image" style="background-image:url(' + prvFrst[0] + ');"></div>');
        }
      }

      //5 - iii - This function will get and set the src attribute value of slides images
      function getSrc(sldr, nxt, prv) {
        var nt = nxt;
        var pv = prv;
        sldr.find(".carousel-control-next-image").css("background-image", "url(" + nt + ")");
        sldr.find(".carousel-control-prev-image").css("background-image", "url(" + pv + ")");
      }

      //5 - iv - This function will get and set the background-image url css property value of slides images
      function getUrl(sldr, nxt, prv) {
        var nt = nxt;
        var pv = prv;
        //For edge browser check url("") || url()
        if (nt.indexOf('url("') === -1 && pv.indexOf('url("') === -1) {
          nt = nt.split('url(');
          nt = nt[1].split(')');
          pv = pv.split('url(');
          pv = pv[1].split(')');
        } else {
          nt = nt.split('url("');
          nt = nt[1].split('")');
          pv = pv.split('url("');
          pv = pv[1].split('")');
        }
        sldr.find(".carousel-control-next-image").css("background-image", "url(" + nt[0] + ")");
        sldr.find(".carousel-control-prev-image").css("background-image", "url(" + pv[0] + ")");
      }

      //5 - v - This function will change images of left and right navigation buttons on slide change
      function naviImgIntrvl(sldr, cruslItm, indx) {
        var lstIndx = sldr.find(cruslItm).last().index();
        if (thisSlider.data("background") === "image") { //If we are using data-background="image"
          if (indx === 0) { //If current item index is equal to first item index
            getSrc(sldr, innerItems.eq(1).find(".sz-bg-img").attr("src"), innerItems.eq(lstIndx).find(".sz-bg-img").attr("src"));
          } else if (indx === lstIndx) { //If current item index is equal to last item index
            getSrc(sldr, innerItems.eq(0).find(".sz-bg-img").attr("src"), innerItems.eq(lstIndx - 1).find(".sz-bg-img").attr("src"));
          } else { //If current item index is not equal to first or last item index
            getSrc(sldr, innerItems.eq(indx).next().find(".sz-bg-img").attr("src"), innerItems.eq(indx).prev().find(".sz-bg-img").attr("src"));
          }
        } else { //If we are using data-background="hero"
          if (indx === 0) { //If current item index is equal to first item index
            getUrl(sldr, innerItems.eq(1).css("background-image"), innerItems.eq(lstIndx).css("background-image"));
          } else if (indx === lstIndx) { //If current item index is equal to last item index
            getUrl(sldr, innerItems.eq(0).css("background-image"), innerItems.eq(lstIndx - 1).css("background-image"));
          } else { //If current item index is not equal to first or last item index
            getUrl(sldr, innerItems.eq(indx).next().css("background-image"), innerItems.eq(indx).prev().css("background-image"));
          }
        }
      }

      //5 - vi - This function will get and set the src attribute value of slides images on hover
      function hoverSrc(ths, clss, sldr, nxt, prv) {
        if (ths.hasClass(clss)) {
          sldr.append('<div class="carousel-control-next-image" style="background-image:url(' + nxt + ');"></div>');
        } else {
          sldr.append('<div class="carousel-control-prev-image" style="background-image:url(' + prv + ');"></div>');
        }
      }

      //5 - vii - This function will get and set the background-image url css property value of slides images on hover
      function hoverUrl(ths, clss, sldr, nxt, prv) {
        if (ths.hasClass(clss)) {
          var nx = nxt;
          //For edge browser check url("") || url()
          if (nx.indexOf('url("') === -1) {
            nx = nx.split('url(');
            nx = nx[1].split(')');
          } else {
            nx = nx.split('url("');
            nx = nx[1].split('")');
          }
          sldr.append('<div class="carousel-control-next-image" style="background-image:url(' + nx[0] + ');"></div>');
        } else {
          var pv = prv;
          //For edge browser check url("") || url()
          if (pv.indexOf('url("') === -1) {
            pv = pv.split('url(');
            pv = pv[1].split(')');
          } else {
            pv = pv.split('url("');
            pv = pv[1].split('")');
          }
          sldr.append('<div class="carousel-control-prev-image" style="background-image:url(' + pv[0] + ');"></div>');
        }
      }

      //5 - viii - This function will change images of left and right navigation buttons on hover on buttons
      if (thisSlider.data("nav-image") === "hidden") { //Check if data-nav-image value is hidden
        sliderNav.hover(function () { //On mouse over
          if (thisSlider.data("background") === "image") { //If we are using data-background="image"
            if (itmIdx === 0) { //If current item index is equal to first item index
              hoverSrc($(this), sliderNavNext, thisSlider, innerItems.eq(1).find(".sz-bg-img").attr("src"), innerItems.eq(innerItems.last().index()).find(".sz-bg-img").attr("src"));
            } else if (itmIdx === innerItems.last().index()) { //If current item index is equal to last item index
              hoverSrc($(this), sliderNavNext, thisSlider, innerItems.eq(0).find(".sz-bg-img").attr("src"), innerItems.eq(innerItems.last().index() - 1).find(".sz-bg-img").attr("src"));
            } else { //If current item index is not equal to first or last item index
              hoverSrc($(this), sliderNavNext, thisSlider, innerItems.eq(itmIdx).next().find(".sz-bg-img").attr("src"), innerItems.eq(itmIdx).prev().find(".sz-bg-img").attr("src"));
            }
          } else { //If we are using data-background="hero"
            if (itmIdx === 0) { //If current item index is equal to first item index
              hoverUrl($(this), sliderNavNext, thisSlider, innerItems.eq(1).css("background-image"), innerItems.eq(innerItems.last().index()).css("background-image"));
            } else if (itmIdx === innerItems.last().index()) { //If current item index is equal to last item index
              hoverUrl($(this), sliderNavNext, thisSlider, innerItems.eq(0).css("background-image"), innerItems.eq(innerItems.last().index() - 1).css("background-image"));
            } else { //If current item index is not equal to first or last item index
              hoverUrl($(this), sliderNavNext, thisSlider, innerItems.eq(itmIdx).next().css("background-image"), innerItems.eq(itmIdx).prev().css("background-image"));
            }
          }
        }, function () { //On mouse leave
          thisSlider.find(".carousel-control-next-image").remove();
          thisSlider.find(".carousel-control-prev-image").remove();
        });
      }

      //5 - ix -Navigation Left And Right Button Function
      function dragNavigations(sldNv, sldr) {
        sldNv.on("click", function (e) {
          e.preventDefault();
          //If already clicked prevent click event temporarily
          if (isDblClkEle($(this), sldDur)) {
            return;
          }
          var carWdtHgtNav;
          var carPosiNav;
          var sldWdHtNDZ;
          var indWdHtNDZ;
          //For Carousel
          if (sliderTypeV === "carousel") {
            if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
              carWdtHgtNav = carHgtDY;
              carPosiNav = sliderFirstItem.position().top;
            } else {
              carWdtHgtNav = carWdtDX;
              carPosiNav = sliderFirstItem.position().left;
            }
            //For Slider
          } else {
            if (sldrAnim === "dragY" || sldrAnim === "swipeY" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverY" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
              carWdtHgtNav = carHgtDY;
              carPosiNav = sliderFirstItem.position().top;
              sldWdHtNDZ = $(this).closest(sldr).height();
              indWdHtNDZ = indHeight;
            } else {
              carWdtHgtNav = carWdtDX;
              carPosiNav = sliderFirstItem.position().left;
              sldWdHtNDZ = $(this).closest(sldr).width();
              indWdHtNDZ = indWidth;
            }
          }

          var lastItemIndex = innerItems.last().index();
          var firstItemIndex = innerItems.first().index();
          var currentItemIndex = innerItems.eq(itmIdx).index();
          var totalTranslate = carWdtHgtNav * lastItemIndex;
          if (lastItemIndex === currentItemIndex && $(this).hasClass(sliderNavNext)) {
            if (sldrAnim === "fade") {
              itmIdx = 0;
              fdNxtItm(itmIdx);
            } else if (sldrAnim === "class") {
              clsNxtItm(itmIdx, 0);
              itmIdx = 0;
            } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
              drgItmsTransi(sldDur, -((carWdtHgtNav * 0) + ((carWdtHgtNav - (sldWdHtNDZ - indWdHtNDZ)) / 2)));
              $(this).closest(sldr).carousel(0);
              itmIdx = 0;
            } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
              drgCvrFlwEnd(sldDur, sldCovr2dMin, sldCovr2dMax, 0, sldCovrPrspctv);
              drgCvrFlwPrnt((carWdtHgtNav * 0) + ((carWdtHgtNav - (sldWdHtNDZ - indWdHtNDZ)) / 2), sldDur);
              $(this).closest(sldr).carousel(0);
              innerItems.css("z-index", "1");
              innerItems.eq(0).css("z-index", "3");
              itmIdx = 0;
            } else {
              //Assigning transition duration and translate property to carousel items
              drgItmsTransi(sldDur, 0);
              $(this).closest(sldr).carousel(0);
              itmIdx = 0;
            }
          } else if (firstItemIndex === currentItemIndex && $(this).hasClass(sliderNavPrev)) {
            //For Carousel
            if (sliderTypeV === "carousel") {
              //Assigning transition duration and translate property to carousel items
              drgItmsTransi(sldDur, -(remanItmAftr * carWdtHgtNav));
              $(this).closest(sldr).carousel(remanItmAftr);
              itmIdx = remanItmAftr;
              //For Slider
            } else {
              if (sldrAnim === "fade") {
                itmIdx = lastItemIndex;
                fdNxtItm(itmIdx);
              } else if (sldrAnim === "class") {
                clsNxtItm(itmIdx, lastItemIndex);
                itmIdx = lastItemIndex;
              } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
                drgItmsTransi(sldDur, -((carWdtHgtNav * lastItemIndex) + ((carWdtHgtNav - (sldWdHtNDZ - indWdHtNDZ)) / 2)));
                $(this).closest(sldr).carousel(lastItemIndex);
                itmIdx = lastItemIndex;
              } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
                drgCvrFlwEnd(sldDur, sldCovr2dMin, sldCovr2dMax, lastItemIndex, sldCovrPrspctv);
                drgCvrFlwPrnt((carWdtHgtNav * lastItemIndex) + ((carWdtHgtNav - (sldWdHtNDZ - indWdHtNDZ)) / 2), sldDur);
                $(this).closest(sldr).carousel(lastItemIndex);
                innerItems.css("z-index", "1");
                innerItems.eq(lastItemIndex).css("z-index", "3");
                itmIdx = lastItemIndex;
              } else {
                //Assigning transition duration and translate property to carousel items
                drgItmsTransi(sldDur, -totalTranslate);
                $(this).closest(sldr).carousel(lastItemIndex);
                itmIdx = lastItemIndex;
              }
            }
          } else {
            if ($(this).hasClass(sliderNavNext)) {
              //For Carousel
              if (sliderTypeV === "carousel") {
                if (itmIdx < remanItmAftr) {
                  if (carPosiNav === 0) {
                    if (itmIdx === 1) {
                      itmIdx = Math.min(itmIdx + sliderMoveV, itemsLength - sliderMoveV);
                      drgItm((carWdtHgtNav * itmIdx), sldDur);
                      $(this).closest(sldr).carousel(itmIdx);
                    } else {
                      itmIdx = sliderFirstItem.index() + sliderMoveV;
                      drgItm((carWdtHgtNav * itmIdx), sldDur);
                      $(this).closest(sldr).carousel(itmIdx);
                    }
                  } else {
                    if (carPosiNav > 0) {
                      itmIdx = sliderFirstItem.index() + sliderMoveV;
                      drgItm((carWdtHgtNav * itmIdx), sldDur);
                      $(this).closest(sldr).carousel(itmIdx);
                    } else {
                      itmIdx = Math.min(itmIdx + sliderMoveV, itemsLength - sliderMoveV);
                      drgItm((carWdtHgtNav * itmIdx), sldDur);
                      $(this).closest(sldr).carousel(itmIdx);
                    }
                  }
                } else {
                  itmIdx = 0;
                  drgItm((carWdtHgtNav * itmIdx), sldDur);
                  $(this).closest(sldr).carousel(0);
                }

                //For Slider
              } else {
                if (sldrAnim === "fade") {
                  itmIdx = itmIdx + 1;
                  fdNxtItm(itmIdx);
                } else if (sldrAnim === "class") {
                  clsNxtItm(itmIdx, (itmIdx + 1));
                  itmIdx = itmIdx + 1;
                } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
                  itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                  nxtItmDZ(itmIdx);
                  $(this).closest(sldr).carousel(itmIdx);
                } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
                  itmIdx = Math.min(itmIdx + 1, itemsLength - 1);
                  $(this).closest(sldr).carousel(itmIdx);
                  nxtItmCF2(itmIdx);
                } else {
                  nxtItm();
                  $(this).closest(sldr).carousel(itmIdx);
                }
              }
            } else {
              //For Carousel
              if (sliderTypeV === "carousel") {
                if (itmIdx <= remanItmAftr) {
                  if (carPosiNav >= 0) {
                    //Assigning transition duration and translate property to carousel items
                    drgItmsTransi(sldDur, -(remanItmAftr * carWdtHgtNav));
                    $(this).closest(sldr).carousel(remanItmAftr);
                    itmIdx = remanItmAftr;
                  } else {
                    itmIdx = Math.max(itmIdx - sliderMoveV, 0);
                    drgItm((carWdtHgtNav * itmIdx), sldDur);
                    $(this).closest(sldr).carousel(itmIdx);
                  }
                } else {
                  itmIdx = remanItmAftr - sliderMoveV;
                  drgItm((carWdtHgtNav * itmIdx), sldDur);
                  $(this).closest(sldr).carousel(itmIdx);
                }
                //For Slider
              } else {
                if (sldrAnim === "fade") {
                  itmIdx = itmIdx - 1;
                  fdNxtItm(itmIdx);
                } else if (sldrAnim === "class") {
                  clsNxtItm(itmIdx, (itmIdx - 1));
                  itmIdx = itmIdx - 1;
                } else if (sldrAnim === "dragCoverX" || sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY") {
                  itmIdx = Math.max(itmIdx - 1, 0);
                  nxtItmDZ(itmIdx);
                  $(this).closest(sldr).carousel(itmIdx);
                } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
                  itmIdx = Math.max(itmIdx - 1, 0);
                  $(this).closest(sldr).carousel(itmIdx);
                  nxtItmCF2(itmIdx);
                } else {
                  prvItm();
                  $(this).closest(sldr).carousel(itmIdx);
                }
              }
            }
          }
          //Indicators || Thumbnails Scroll
          indNext(itmIdx);
        }); //End of left or right navigation button event
      }

      /**
      * ------------------------------
      * Touch Swipe Default Options
      * ------------------------------
      */
      //1 - Fingers
      var tchFngrV = thisSlider.data("fingers");
      if (isNumeric(tchFngrV)) {
        tchFngrV = tchFngrV;
      } else {
        tchFngrV = 1;
      }

      //2 - Threshold
      var tchHoldV = thisSlider.data("threshold");
      if (isNumeric(tchHoldV)) {
        tchHoldV = tchHoldV;
      } else {
        tchHoldV = 75;
      }

      //3 - Cancel Threshold
      var tchCnclHoldV = thisSlider.data("cancelthreshold");
      if (isNumeric(tchCnclHoldV)) {
        tchCnclHoldV = tchCnclHoldV;
      } else {
        tchCnclHoldV = null;
      }

      //4 - Pinch Threshold
      var tchPnchHoldV = thisSlider.data("pinchthreshold");
      if (isNumeric(tchPnchHoldV)) {
        tchPnchHoldV = tchPnchHoldV;
      } else {
        tchPnchHoldV = 20;
      }

      //5 - Maximum Time Threshold
      var tchMxTmHoldV = thisSlider.data("maxtimethreshold");
      if (isNumeric(tchMxTmHoldV)) {
        tchMxTmHoldV = tchMxTmHoldV;
      } else {
        tchMxTmHoldV = null;
      }

      //6 - Finger Release Threshold
      var tchFngrRlsHoldV = thisSlider.data("fingerreleasethreshold");
      if (isNumeric(tchFngrRlsHoldV)) {
        tchFngrRlsHoldV = tchFngrRlsHoldV;
      } else {
        tchFngrRlsHoldV = 250;
      }

      //7 - Long Tap Threshold
      var tchLngTpHoldV = thisSlider.data("longtapthreshold");
      if (isNumeric(tchLngTpHoldV)) {
        tchLngTpHoldV = tchLngTpHoldV;
      } else {
        tchLngTpHoldV = 500;
      }

      //8 - Double Tap Threshold
      var tchDblTpHoldV = thisSlider.data("doubletapthreshold");
      if (isNumeric(tchDblTpHoldV)) {
        tchDblTpHoldV = tchDblTpHoldV;
      } else {
        tchDblTpHoldV = 200;
      }

      //9 - Trigger On Touch End
      var tchTrgrOnEndV = thisSlider.data("triggerontouchend");
      if (typeof tchTrgrOnEndV === "boolean") {
        tchTrgrOnEndV = tchTrgrOnEndV;
      } else {
        tchTrgrOnEndV = true;
      }

      //10 - Trigger On Touch Leave
      var tchTrgrOnLveV = thisSlider.data("triggerontouchleave");
      if (typeof tchTrgrOnLveV === "boolean") {
        tchTrgrOnLveV = tchTrgrOnLveV;
      } else {
        tchTrgrOnLveV = true;
      }

      //11 - Allow Page Scroll
      var tchAlwPgScrlV = thisSlider.data("allowpagescroll");
      if (typeof tchAlwPgScrlV === "string" && tchAlwPgScrlV !== "") {
        tchAlwPgScrlV = tchAlwPgScrlV;
      } else {
        tchAlwPgScrlV = "vertical";
      }

      //12 - FallBack To Mouse Events
      var tchMusEvntV = thisSlider.data("fallbacktomouseevents");
      if (typeof tchMusEvntV === "boolean") {
        tchMusEvntV = tchMusEvntV;
      } else {
        tchMusEvntV = true;
      }

      //13 - Prevent Default Events
      var tchPrvntDefV = thisSlider.data("preventdefaultevents");
      if (typeof tchPrvntDefV === "boolean") {
        tchPrvntDefV = tchPrvntDefV;
      } else {
        tchPrvntDefV = true;
      }

      //14 - Excluded Elements
      var tchExElmsV = thisSlider.data("excludedelements");
      if (typeof tchExElmsV === "string" && tchExElmsV !== "") {
        tchExElmsV = tchExElmsV;
      } else {
        tchExElmsV = ".noSwipe";
      }

      /**
      * ---------------------------------------
      * On Window Load Trigger The Functions
      * ---------------------------------------
      */
      function dragWindowLoadSettings(sldr) {

        //Setting width and height
        sliderWdthHght(sldr);

        //Setting dragCoverX & dragCoverY Slides Position On Load
        if (sldrAnim === "dragCoverX" || sldrAnim === "swipeCoverX") {
          var distanceDZL = ((carWdtDX * itmIdx) + ((carWdtDX - (sldr.width() - indWidth)) / 2));
          var valuesDZL = (distanceDZL < 0 ? "" : "-") + Math.abs(distanceDZL).toString();
          drgItmsTransi(0, valuesDZL);
        } else if (sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverY") {
          var distanceDZYL = ((carHgtDY * itmIdx) + ((carHgtDY - (sldr.height() - indHeight)) / 2));
          var valuesDZYL = (distanceDZYL < 0 ? "" : "-") + Math.abs(distanceDZYL).toString();
          drgItmsTransi(0, valuesDZYL);
        } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "swipeCover2X" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X") {
          drgCvrFlwPrnt((carWdtDX * itmIdx) + ((carWdtDX - (sldr.width() - indWidth)) / 2), 0);
          drgCvrFlwEnd(0, sldCovr2dMin, sldCovr2dMax, itmIdx, sldCovrPrspctv);
          innerItems.eq(itmIdx).css("z-index", "1");
        } else if (sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
          drgCvrFlwPrnt((carHgtDY * itmIdx) + ((carHgtDY - (sldr.height() - indHeight)) / 2), 0);
          drgCvrFlwEnd(0, sldCovr2dMin, sldCovr2dMax, itmIdx, sldCovrPrspctv);
          innerItems.eq(itmIdx).css("z-index", "1");
        }

        //Check First TouchSwipe Function Exist Or Not
        if (typeof $.fn.swipe === "function") {

          //Triggering swipe status function for carousel items
          var stats;
          if (sldrAnim === "default") {
            stats = "";
          } else {
            stats = touchSwipeFunc;
          }

          //Declaring swipe options for carousel items
          var options = {
            swipeStatus: stats,
            fingers: tchFngrV,
            threshold: tchHoldV,
            cancelThreshold: tchCnclHoldV,
            pinchThreshold: tchPnchHoldV,
            maxTimeThreshold: tchMxTmHoldV,
            fingerReleaseThreshold: tchFngrRlsHoldV,
            longTapThreshold: tchLngTpHoldV,
            doubleTapThreshold: tchDblTpHoldV,
            triggerOnTouchEnd: tchTrgrOnEndV,
            triggerOnTouchLeave: tchTrgrOnLveV,
            allowPageScroll: tchAlwPgScrlV,
            fallbackToMouseEvents: tchMusEvntV,
            excludedElements: tchExElmsV,
            preventDefaultEvents: tchPrvntDefV
          };

          //Targeting element for swipe and calling swipe function from ( touchSwipe.js file ) for carousel items
          if (sliderTypeV === "carousel") { //For Carousel
            if (sldrAnim === "swipeX" || sldrAnim === "swipeY") {
              //Targeting main slider div
              sldr.swipe(options);
            } else {
              //Targeting carousel items
              innerItems.swipe(options);
            }
          } else { //For Slider
            if (sldrAnim === "swipeX" || sldrAnim === "swipeY" || sldrAnim === "swipeCoverX" || sldrAnim === "swipeCoverY" || sldrAnim === "swipeCover2X" || sldrAnim === "swipeCover2Y" || sldrAnim === "swipeCover3X" || sldrAnim === "swipeCover3Y" || sldrAnim === "swipeCover4X" || sldrAnim === "swipeCover4Y") {
              //Targeting main slider div
              sldr.swipe(options);
            } else {
              //Targeting carousel items
              innerItems.swipe(options);
            }
          }

          //Declaring swipe option ( allowPageScroll ) for indicators
          var alwPgScrl;
          if (indiDrct === "y") {
            alwPgScrl = "horizontal";
          } else {
            alwPgScrl = "vertical";
          }

          //Declaring swipe options for indicators
          var indOpt = {
            swipeStatus: indiSwipeFunc,
            threshold: 1,
            triggerOnTouchEnd: true,
            triggerOnTouchLeave: true,
            allowPageScroll: alwPgScrl,
            fallbackToMouseEvents: true,
            preventDefaultEvents: true
          };
          //Calling swipe function from ( touchSwipe.js file ) for indicators
          indLi.swipe(indOpt);
        }

        /**
        * Interval Slider Option
        */
        if (sliderIntervalV === "yes") {
          //1st Slide
          //Start Slider Cycle Automatically OR Not ?
          var sliderStartV = sldr.data("start");
          if (sliderStartV === "auto") {
            var slide1stItem = innerItems.first();
            //Calling dragInterval(slider,slide) function for 1st slide only
            dragInterval(sldr, slide1stItem);
          }

          /**
          * Pause sliding cycle on hover
          */
          //Check stop sliding cycle on hover OR Not ?
          var sliderPauseV = sldr.data("pauses");
          if (sliderPauseV === "yes") {
            sldr.hover(function () { //On MouseOver
              //If loading bar or animated indicators "Available" then run this part
              if ($(this).find(".carousel-indicators").hasClass("sz-ind-animated") || (progressBars === true && $(this).find(carouselItem).find(".sz-slide-bar-wrap").length && $(this).find(carouselItem).find(".sz-slide-bar").length)) {
                //Animated Indicators
                if ($(this).find(".carousel-indicators").hasClass("sz-ind-animated")) {
                  if ($(this).find(".carousel-indicators.sz-ind-animated > li > span").length) {
                    //Remove play class and add pause class on active element
                    $(this).find(".carousel-indicators.sz-ind-animated > li.active > span").removeClass("animPly").addClass("animPuse");
                  }
                }
                //Loading Bar
                if ($(this).find(carouselItem).find(".sz-slide-bar-wrap").length) {
                  if ($(this).find(carouselItem).find(".sz-slide-bar").length) {
                    //Remove play class and add pause class on active element
                    $(this).find(carouselItem + ".active").find(".sz-slide-bar").removeClass("animPly").addClass("animPuse");
                  }
                }
              } else { //If loading bar or animated indicators "Not Added" then run this part
                //Interval Time Out Id Clearing
                clearTimeout(drgTmOtIdIntrvl);
              }
            }, function () { //On MouseLeave
              //If loading bar or animated indicators "Available" then run this part
              if ($(this).find(".carousel-indicators").hasClass("sz-ind-animated") || (progressBars === true && $(this).find(carouselItem).find(".sz-slide-bar-wrap").length && $(this).find(carouselItem).find(".sz-slide-bar").length)) {
                //Animated Indicators
                if ($(this).find(".carousel-indicators").hasClass("sz-ind-animated")) {
                  if ($(this).find(".carousel-indicators.sz-ind-animated > li > span").length) {
                    //Remove pause class and add play class on active element
                    $(this).find(".carousel-indicators.sz-ind-animated > li.active > span").removeClass("animPuse").addClass("animPly");
                  }
                }
                //Loading Bar
                if ($(this).find(carouselItem).find(".sz-slide-bar-wrap").length) {
                  if ($(this).find(carouselItem).find(".sz-slide-bar").length) {
                    //Remove pause class and add play class on active element
                    $(this).find(carouselItem + ".active").find(".sz-slide-bar").removeClass("animPuse").addClass("animPly");
                  }
                }
              } else { //If loading bar or animated indicators "Not Added" then run this part
                //Interval Time Out Id Clearing
                clearTimeout(drgTmOtIdIntrvl);
                dragInterval($(this), $(this).find(carouselItem + ".active"));
              }
            });
          }
        } //End Of Interval
      }

      /**
      * -------------------------------------
      *  Carousel Items Numbers And Length
      * -------------------------------------
      */
      function itmsNumbers(sldr, inx, len) {
        //Check carousel exist or not?
        if (sldr.find(".carousel-item-number").length) {
          if (sldr.find(".carousel-item-single").length) {
            sldr.find(".carousel-item-single").html(inx + 1);
          }
          if (sldr.find(".carousel-item-length").length) {
            sldr.find(".carousel-item-length").html(len);
          }
        }
      }

      /**
      * ------------------------------------------------------
      *  Pause HTML5 Video By Click On Play Or Pause Button
      * ------------------------------------------------------
      */
      function html5VdPly(videoTg, ico) {
        if (videoTg.paused) { //if paused
          videoTg.play();
          //Remove play icon and add pause icon
          ico.removeClass("sz-play-btn").addClass("sz-pause-btn");
        } else { //if play
          try {
            videoTg.pause();
          } catch (err) { }
          //Remove pause icon and add play icon
          ico.removeClass("sz-pause-btn").addClass("sz-play-btn");
        }
      }

      //When click on play or pause icon button
      thisSlider.find(".sz-media-btn").on("click", function () {
        var vdeoTg = $(this).siblings(".sz-video").length;
        if (vdeoTg) {
          html5VdPly($(this).siblings(".sz-video")[0], $(this));
        }
      });

      /**
      * ----------------------------------------------------------
      *  Mute And Unmute HTML5 Video By Click On Speaker Button
      * ----------------------------------------------------------
      */
      function html5VdMute(vdoTg, ic) {
        if (vdoTg.prop("muted")) { //if muted
          vdoTg.prop("muted", false);
          //Remove mute icon and add unmute icon
          ic.removeClass("sz-mute-btn").addClass("sz-unmute-btn");
        } else { //if unmuted
          vdoTg.prop("muted", true);
          //Remove unmute icon and add mute icon
          ic.removeClass("sz-unmute-btn").addClass("sz-mute-btn");
        }
      }

      //When click on Speaker icon button
      thisSlider.find(".sz-speaker-btn").on("click", function () {
        var vdeosTg = $(this).siblings(".sz-video").length;
        if (vdeosTg) {
          html5VdMute($(this).siblings(".sz-video"), $(this));
        }
      });

      /**
      * -----------------------------------------------------------------------------
      *  Events fires when the carousel is about to slide from one item to another
      * -----------------------------------------------------------------------------
      */
      thisSlider[0].addEventListener("slide.bs.carousel", function (e) {

        //Auto Hight Function Triggering
        if (sliderTypeV !== "carousel") {
          if ($(this).data("height") === "auto" && sldrAnim !== "swipeY" && sldrAnim !== "dragY" && sldrAnim !== "dragCoverY" && sldrAnim !== "swipeCoverY" && sldrAnim !== "dragCover2Y" && sldrAnim !== "swipeCover2Y" && sldrAnim !== "dragCover3Y" && sldrAnim !== "swipeCover3Y" && sldrAnim !== "dragCover4Y" && sldrAnim !== "swipeCover4Y") {
            autoHeightSldr($(this), $(e.relatedTarget), $(e.relatedTarget).find(".sz-bg-img"));
          }
        }

        //Slide Cycle
        if (sliderIntervalV === "yes") {
          //If loading bar or animated indicators "Not Added" then run this part
          if (!($(this).find(".carousel-indicators").hasClass("sz-ind-animated")) && !(progressBars === true && $(this).find(carouselItem).find(".sz-slide-bar-wrap").length && $(this).find(carouselItem).find(".sz-slide-bar").length)) {
            //Interval Time Out Id Clearing
            clearTimeout(drgTmOtIdIntrvl);
          }
        }

        //Carousel Items Numbers
        itmsNumbers($(this), $(e.relatedTarget).index(), itemsLength);

        //Layers animation effects (Part-2)
        //Animating all active layers
        var animLayers = $(e.relatedTarget).find(".sz-animated");
        animateLayers(animLayers);

        //Find the YouTube or Vimeo iframes and cache in a variable
        var iframeFind = $(this).find("iframe.sz-iframe").length;
        if (iframeFind) {
          var findIframe = $(this).find("iframe.sz-iframe");
          findIframe.each(function () {
            $(this).attr("src", $(this).attr("src"));
          });
        }

        //If we are using navigation left or right buttons to show images on them
        if (thisSlider.data("nav-image") === "hidden" || thisSlider.data("nav-image") === "show") {
          naviImgIntrvl($(this), $(this).find(carouselItem), $(e.relatedTarget).index());
        }

      });

      /**
      * --------------------------------------------------------------------------------
      *  Events fires when the carousel has finished sliding from one item to another
      * --------------------------------------------------------------------------------
      */
      thisSlider[0].addEventListener("slid.bs.carousel", function (e) {

        //Removing Animation Classes From Layers
        removeAnimClass($(this).find(carouselItem));
        //Hide All Layers Those Contain "sz-animated" Class
        $(this).find(".sz-animated").css({ "opacity": "0", "visibility": "hidden" });
        //Show Only Active Layer
        $(e.relatedTarget).find(".sz-animated").css({ "opacity": "1", "visibility": "visible" });

        //Slide Cycle
        if (sliderIntervalV === "yes") {
          //If loading bar or animated indicators "Available" then run this part
          if ($(this).find(".carousel-indicators").hasClass("sz-ind-animated") || (progressBars === true && $(this).find(carouselItem).find(".sz-slide-bar-wrap").length && $(this).find(carouselItem).find(".sz-slide-bar").length)) {
            //Calling dragInterval(slider,slide) function for all slides
            dragInterval($(this), $(e.relatedTarget));
          } else { //If loading bar or animated indicators "Not Added" then run this part
            //Interval Time Out Id Clearing
            clearTimeout(drgTmOtIdIntrvl);
            //Calling dragInterval(slider,slide) function for all slides
            dragInterval($(this), $(e.relatedTarget));
          }
        }

        //Checking HTML5 video tag exist or not?
        var videoFind = $(this).find("video.sz-video").length;
        if (videoFind) {
          //Loop through HTML5 videos and reload them after slide ends
          var findVideo = $(this).find("video.sz-video");
          setTimeout(function () {
            findVideo.each(function () {
              $(this).not($(e.relatedTarget).find("video.sz-video")).trigger("load");
            });
          }, sldDur);

          //Checking Autoplay attributes exist or not?
          var vdAtoPlyAtrr = $(this).find("video.sz-video").attr("autoplay");
          if (typeof vdAtoPlyAtrr !== typeof undefined && vdAtoPlyAtrr !== false) {
            //Loop through elements those contains AutoPlay attributes
            var findVideos = $(this).find("video.sz-video[autoplay]");
            setTimeout(function () {
              findVideos.each(function () {
                if ($(e.relatedTarget).find("video.sz-video[autoplay]")[0] !== undefined) {
                  $(this).prop("muted", true);
                  try {
                    $(this)[0].pause();
                  } catch (err) { }
                  $(e.relatedTarget).find("video.sz-video[autoplay]")[0].play();
                }
              });
            }, sldDur + 110);
            //Change play or pause icon for all elements
            $(this).find(".sz-media-btn").removeClass("sz-pause-btn").addClass("sz-play-btn");
            //Change play or pause icon for active element
            $(e.relatedTarget).find(".sz-media-btn").removeClass("sz-play-btn").addClass("sz-pause-btn");
            //Change mute or unmute icon for all elements
            $(this).find(".sz-speaker-btn").removeClass("sz-mute-btn").addClass("sz-unmute-btn");
            //Change mute or unmute icon for active element
            $(e.relatedTarget).find(".sz-speaker-btn").removeClass("sz-unmute-btn").addClass("sz-mute-btn");
          } else {
            //Change play or pause icon for all elements
            $(this).find(".sz-media-btn").removeClass("sz-pause-btn").addClass("sz-play-btn");
            //Change mute or unmute icon for all elements
            $(this).find(".sz-speaker-btn").removeClass("sz-mute-btn").addClass("sz-unmute-btn");
            $(e.relatedTarget).find("video.sz-video").prop("muted", false);
          }
        }

      });

      /**
      * ---------------------------
      *  On Document Ready Event
      * ---------------------------
      */
      //Default Bootstrap Carousel Setting
      sldDfltFn(thisSlider);
      sliderWdthHght(thisSlider);
      dragMouseWheel(thisSlider);
      dragKeyboard(thisSlider);
      dragIndicators(indLi, thisSlider);
      dragNavigations(sliderNav, thisSlider);

      //Assigning Transition Duration Of Transform Property To Carousel Items Only For Fade Effect
      if (sldrAnim === "fade") {
        innerItems.css({ "transition-duration": sldDur + "ms", "-webkit-transition-duration": sldDur + "ms" });
      } else if (sldrAnim === "class") {
        innerItems.css({ "transition-duration": sldDur + "ms", "-webkit-transition-duration": sldDur + "ms" });
      }

      /**
      * ------------------------
      *  On Window Load Event
      * ------------------------
      */
      $(window).on("load", function () {

        //Removing Pre-Loader
        thisSlider.find(".szc-preloader").remove();
        //Carousel Items Numbers
        itmsNumbers(thisSlider, itmIdx, itemsLength);

        // 1st Slide - Layers animation effects (Part-2)
        //Animating 1st active slide layers on window load
        var frstSldAnimLyr = thisSlider.find(carouselItem + ":first").find(".sz-animated");
        animateLayers(frstSldAnimLyr);
        //All animated layers those have ".sz-animated" class
        //hiding on window load except of 1st slide layers
        thisSlider.find(carouselItem + ":not(:first)").find(".sz-animated").css({ "opacity": "0", "visibility": "hidden" });

        //Load All Settings
        dragWindowLoadSettings(thisSlider);

        //Indicators || Thumbnails
        indWdHt();
        indNext(itmIdx);

        //If we want to show navigation images on left and right arrows
        if (thisSlider.data("nav-image") === "show") {
          naviImgFxd(thisSlider, carouselItem);
        }

        //Background Parallax Effect
        if (thisSlider.hasClass("bg-parallax")) {
          var prvntPrlx = true;
          thisSlider.mousemove(function (e) {
            if (prvntPrlx) {
              prvntPrlx = false;
              $(this).css("background-position", -(e.pageX / 40) + "px " + -(e.pageY / 40) + "px");
              setTimeout(function () {
                prvntPrlx = true;
              }, 30);
            }
          });
        }

        //Carousel Scroll Down
        if (thisSlider.find(".carousel-scroll-down").length) {
          thisSlider.find(".carousel-scroll-down").on("click", function () {
            $('html, body').animate({ scrollTop: thisSlider.offset().top + thisSlider.height() }, 500);
          });
        }

        //Checking HTML5 video tag exist or not?
        if (thisSlider.find("video.sz-video").length) {
          //Find if Autoplay attribute exist and cache in a variable
          var vdAtoPlyAtr = thisSlider.find("video.sz-video").attr("autoplay");
          if (typeof vdAtoPlyAtr !== typeof undefined && vdAtoPlyAtr !== false) {
            //Pause all other videos on page load except first slide video
            try {
              thisSlider.find(carouselItem + ":not(:first)").find("video.sz-video[autoplay]")[0].pause();
            } catch (err) { }
          }
        }

      });

      /**
      * --------------------------
      *  On Window Resize Event
      * --------------------------
      */
      $(window).on('resize', function () {

        //Again Setting Width And Height
        sliderWdthHght(thisSlider);

        //Auto Hight Function Triggering
        if (sliderTypeV !== "carousel") {
          if (thisSlider.data("height") === "auto" && sldrAnim !== "swipeY" && sldrAnim !== "dragY" && sldrAnim !== "dragCoverY" && sldrAnim !== "swipeCoverY" && sldrAnim !== "dragCover2Y" && sldrAnim !== "swipeCover2Y" && sldrAnim !== "dragCover3Y" && sldrAnim !== "swipeCover3Y" && sldrAnim !== "dragCover4Y" && sldrAnim !== "swipeCover4Y") {
            autoHeightSldr(thisSlider, thisSlider.find(carouselItem).eq(itmIdx), thisSlider.find(carouselItem).eq(itmIdx).find(".sz-bg-img"));
          }
        }

        if (sliderTypeV === "carousel") { //For Carousel
          if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
            if (itmIdx <= remanItmAftr) {
              drgItm((carHgtDY * itmIdx), 0);
              thisSlider.carousel(itmIdx);
            } else {
              itmIdx = remanItmAftr;
              drgItm((carHgtDY * itmIdx), 0);
              thisSlider.carousel(itmIdx);
            }
          } else {
            if (itmIdx <= remanItmAftr) {
              drgItm((carWdtDX * itmIdx), 0);
              thisSlider.carousel(itmIdx);
            } else {
              itmIdx = remanItmAftr;
              drgItm((carWdtDX * itmIdx), 0);
              thisSlider.carousel(itmIdx);
            }
          }
        } else { //For Slider
          if (sldrAnim === "dragY" || sldrAnim === "swipeY") {
            var distanceDY = carHgtDY * itmIdx;
            var valuesDY = (distanceDY < 0 ? "" : "-") + Math.abs(distanceDY).toString();
            drgItmsTransi(0, valuesDY);
          } else if (sldrAnim === "fade") {
            fdNxtItm(itmIdx);
          } else if (sldrAnim === "class") {
            clsNxtItm(itmIdx, itmIdx);
          } else if (sldrAnim === "dragCoverX" || sldrAnim === "swipeCoverX") {
            var distanceDZ = ((carWdtDX * itmIdx) + ((carWdtDX - (thisSlider.width() - indWidth)) / 2));
            var valuesDZ = (distanceDZ < 0 ? "" : "-") + Math.abs(distanceDZ).toString();
            drgItmsTransi(0, valuesDZ);
          } else if (sldrAnim === "dragCover2X" || sldrAnim === "dragCover3X" || sldrAnim === "swipeCover3X" || sldrAnim === "swipeCover2X" || sldrAnim === "dragCover4X" || sldrAnim === "swipeCover4X") {
            drgCvrFlwPrnt((carWdtDX * itmIdx) + ((carWdtDX - (thisSlider.width() - indWidth)) / 2), 0);
            drgCvrFlwEnd(0, sldCovr2dMin, sldCovr2dMax, itmIdx, sldCovrPrspctv);
          } else if (sldrAnim === "dragCover2Y" || sldrAnim === "swipeCover2Y" || sldrAnim === "dragCover3Y" || sldrAnim === "swipeCover3Y" || sldrAnim === "dragCover4Y" || sldrAnim === "swipeCover4Y") {
            drgCvrFlwPrnt(((carHgtDY * itmIdx) + ((carHgtDY - (thisSlider.height() - indHeight)) / 2)), 0);
            drgCvrFlwEnd(0, sldCovr2dMin, sldCovr2dMax, itmIdx, sldCovrPrspctv);
          } else if (sldrAnim === "dragCoverY" || sldrAnim === "swipeCoverY") {
            var distanceDZY = ((carHgtDY * itmIdx) + ((carHgtDY - (thisSlider.height() - indHeight)) / 2));
            var valuesDZY = (distanceDZY < 0 ? "" : "-") + Math.abs(distanceDZY).toString();
            drgItmsTransi(0, valuesDZY);
          } else {
            var distanceDX = carWdtDX * itmIdx;
            var valuesDX = (distanceDX < 0 ? "" : "-") + Math.abs(distanceDX).toString();
            drgItmsTransi(0, valuesDX);
          }
        }
        //Indicators || Thumbnails
        indWdHt();
        indNext(itmIdx);
      });
    });
  }
})(jQuery);