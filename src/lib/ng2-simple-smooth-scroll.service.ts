import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ISimpleSmoothScrollOption {
  duration?: number;
  easing?: 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint';
  offset?: number;
}

export class SimpleSmoothScrollOption {
  public duration: number;
  public easing: any;
  public offset: any;

  constructor(option: ISimpleSmoothScrollOption) {
    this.duration = option.duration || 800;
    this.offset = option.offset || 0;
    this.easing = this.EasingFunctions[option.easing] || this.EasingFunctions['easeInOutQuad'];
  }

  /**
   * EasingFunctions - from https://gist.github.com/gre/1650294
   */
  private EasingFunctions = {
    // no easing, no acceleration
    linear: (t) => { return t },
    // accelerating from zero velocity
    easeInQuad: (t) => { return t * t },
    // decelerating to zero velocity
    easeOutQuad: (t) => { return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: (t) => { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity 
    easeInCubic: (t) => { return t * t * t },
    // decelerating to zero velocity 
    easeOutCubic: (t) => { return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: (t) => { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity 
    easeInQuart: (t) => { return t * t * t * t },
    // decelerating to zero velocity 
    easeOutQuart: (t) => { return 1 - (--t) * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: (t) => { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    // accelerating from zero velocity
    easeInQuint: (t) => { return t * t * t * t * t },
    // decelerating to zero velocity
    easeOutQuint: (t) => { return 1 + (--t) * t * t * t * t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: (t) => { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
  }
}

@Injectable({
  providedIn: 'root'
})
export class SimpleSmoothScrollService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  public smoothScroll(height: number, opt: ISimpleSmoothScrollOption) {
    if (isPlatformBrowser(this.platformId)) {
      const option = new SimpleSmoothScrollOption(opt);
      const duration = option.duration;
      const doc = document.documentElement;
      const begin = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
      const tick = 1 / (duration / t);
      height += option.offset;
      const distance = height - begin;
      if (distance == 0) return;
      let t0 = new Date().getTime();
      let frame= function () {
        let y = option.easing(new Date().getTime() - t0);
        let current = y * distance + begin;
        if (current >= height && distance > 0) {
          window.scrollTo(0, height);
        } else if (current < 0 && distance < 0) {
          window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, current);
          setTimeout(frame, 25);
      };
      setTimeout(frame, 25);
    }
  }

  public smoothScrollToTop(opt: ISimpleSmoothScrollOption = {}) {
    this.smoothScroll(0, opt);
  }

  public smoothScrollToAnchor(opt: ISimpleSmoothScrollOption = {}) {
    if (isPlatformBrowser(this.platformId)) {
      let eid = window.location.hash;
      if (eid)
        eid = eid.replace('#', '');
      let target = document.getElementById(eid);
      if (target)
        this.smoothScroll(target.offsetTop, opt);
    }
  }
}