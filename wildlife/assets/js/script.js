function menu(selectorMenu, selectorToggle, selectorList) {
  let menu = document.querySelector(selectorMenu);
  let toggle = menu.querySelector(selectorToggle);
  let list = menu.querySelector(selectorList);
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("close");
    list.classList.toggle("open");
    if(list.classList.contains("open")){
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });
}

class Carousel {
  constructor(selectorCarousel, selectorWrapper, selectorCarouselItem, params = {
    loop: true,
    autoload: true,
    transitionDuration: 400,
    intervalDuration: 2000,
    selectorArrayPrev: ".carousel__arrow-prev",
    selectorArrayNext: ".carousel__arrow-next",
  }) {
    this.carousels = document.querySelectorAll(selectorCarousel);
    this.selectorWrapper = selectorWrapper;
    this.selectorCarouselItem = selectorCarouselItem;
    this.params = params;
    this.carousels.forEach(carousel => {
      this.render(carousel);
    })
  }
  resizeItems(carousel, selectorItem, widthItem) {
    let items = carousel.querySelectorAll(selectorItem);
    items.forEach(item => {
      item.style.width = `${widthItem}px`;
      item.style.height = `${widthItem}px`;
    });
  }

  getTranslateX(element) {
    const styleElement = window.getComputedStyle(element)
    const matrix = new DOMMatrixReadOnly(styleElement.transform)
    return matrix.m41;
  }

  loopCarousel(innerWrapper, countItemsInWrapper, widthItem, translateX) {
    let endTranslate = (innerWrapper.offsetWidth - countItemsInWrapper * widthItem) * -1;
    let startTranslate = 1 * widthItem * -1;
    if(translateX > startTranslate) {
      setTimeout(() => {
        let endTranslate = (innerWrapper.offsetWidth - countItemsInWrapper * widthItem) * -1;
        this.changeTransitionDuration(innerWrapper, 0);
        translateX = endTranslate - (countItemsInWrapper * widthItem * -1);
        this.setTranslate(innerWrapper, translateX);
      }, this.params.transitionDuration)
    }
    if(translateX < endTranslate + (1 * widthItem)) {
      setTimeout(() => {
        this.changeTransitionDuration(innerWrapper, 0);
        translateX = -countItemsInWrapper * widthItem;
        this.setTranslate(innerWrapper, translateX);
      }, this.params.transitionDuration)
    }
    return translateX;
  }

  setTranslate(innerWrapper, translateX) {
    innerWrapper.style.transform = `translateX(${translateX}px)`;
  }

  changeTranslate(innerWrapper, translateX, countItemsInWrapper, widthItem) {
    if(innerWrapper.style.transform) {
      let currentTranslateX = this.getTranslateX(innerWrapper);
      translateX = currentTranslateX + translateX;
      if(this.params.loop){
        translateX = this.loopCarousel(innerWrapper, countItemsInWrapper, widthItem, translateX);
      }else {
        if(translateX * -1 < 0) {
          translateX = 0;
        }
        let endTranslate = (innerWrapper.offsetWidth - (countItemsInWrapper * widthItem)) * -1;
        if(translateX < endTranslate) {
          translateX = endTranslate;
        }
      }
    }
    this.setTranslate(innerWrapper, translateX);
  }

  changeTransitionDuration(innerWrapper, transitionDuration) {
    innerWrapper.style.transitionDuration = `${transitionDuration}ms`;
  }

  createClone(innerWrapper, items, countItemsInWrapper) {
    let firstItems = [...items].slice(0, countItemsInWrapper);
    let lastItems = [...items].slice(-countItemsInWrapper);
    innerWrapper.insertAdjacentHTML('afterbegin', lastItems.map(item => item.outerHTML).join(''));
    innerWrapper.insertAdjacentHTML('beforeend', firstItems.map(item => item.outerHTML).join(''));
    this.changeTransitionDuration(innerWrapper, 0);
  }

  createInterval(msInterval, innerWrapper, translateX, countItemsInWrapper, widthItem) {
    let interval = setInterval(() => {
      this.changeTransitionDuration(innerWrapper, this.params.transitionDuration);
      this.changeTranslate(innerWrapper, translateX, countItemsInWrapper, widthItem);
    }, msInterval);
    return interval;
  }

  eventArrow(num, widthItem, innerWrapper, countItemsInWrapper) {
    let translateX = num * widthItem; 
    this.changeTranslate(innerWrapper, translateX, countItemsInWrapper, widthItem);
    this.changeTransitionDuration(innerWrapper, this.params.transitionDuration);
  }

  render(carousel) {
    const wrapper = carousel.querySelector(this.selectorWrapper);
    const innerWrapper = wrapper.firstElementChild;
    const carouselItems = carousel.querySelectorAll(this.selectorCarouselItem);
    const arrowPrev = carousel.querySelector(this.params.selectorArrayPrev);
    const arrowNext = carousel.querySelector(this.params.selectorArrayNext);
    const countItemsInWrapper = Math.floor(wrapper.offsetWidth / ( carouselItems[0] ? carouselItems[0].offsetWidth : 360));
    const widthItem = wrapper.offsetWidth / countItemsInWrapper;

    if(this.params.loop) {
      this.createClone(innerWrapper, carouselItems, countItemsInWrapper);
    }

    this.resizeItems(carousel, this.selectorCarouselItem, widthItem);

    let currentTranslate = this.params.loop ? -countItemsInWrapper * widthItem : 0;
    this.changeTranslate(innerWrapper, currentTranslate, countItemsInWrapper, widthItem);

    this.changeTransitionDuration(innerWrapper, this.params.transitionDuration);

    let disable = false;

    function disabledEvent(callback) {
      if(disable) { return }
      disable = true;
      callback();
      setTimeout(() => {
        disable = false;
      }, parseInt(innerWrapper.style.transitionDuration));
    };

    let interval = false;

    if(this.params.autoload) {
      interval = this.createInterval(this.params.intervalDuration, innerWrapper, -widthItem, countItemsInWrapper, widthItem);
    }

    if(wrapper.offsetWidth != innerWrapper.offsetWidth) {
      arrowPrev.addEventListener('click', () => {
        if(interval) {
          clearInterval(interval);
          interval = false;
        }
        disabledEvent(() => this.eventArrow(1, widthItem, innerWrapper, countItemsInWrapper));
        if(!interval && this.params.autoload) {
          interval = this.createInterval(this.params.intervalDuration, innerWrapper, -widthItem, countItemsInWrapper, widthItem);
        }
      })
      arrowNext.addEventListener('click', () => {
        if(interval) {
          clearInterval(interval);
          interval = false;
        }
        disabledEvent(() => this.eventArrow(-1, widthItem, innerWrapper, countItemsInWrapper));
        if(!interval && this.params.autoload) {
          interval = this.createInterval(this.params.intervalDuration, innerWrapper, -widthItem, countItemsInWrapper, widthItem);
        }
      })
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  menu(".menu", ".toggle", "ul");
  let carousel = new Carousel('.carousel', '.carousel__wrapper', '.carousel__item');
});
