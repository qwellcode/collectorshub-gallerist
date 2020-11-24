import Vue from 'vue';
import {PhotoSwipe, PhotoSwipeGallery} from 'v-photoswipe';
import {LightGallery} from 'vue-light-gallery';
import SlidingPagination from 'vue-sliding-pagination';

Vue.component('v-photoswipe', PhotoSwipe );
Vue.component('v-photoswipe-gallery', PhotoSwipeGallery );
Vue.component('sliding-pagination', SlidingPagination );
Vue.use(LightGallery );
