import copperBackground from './assets/images/cta_copper_background_1791490441957.jpg';
import faucetDetail from './assets/images/faucet_detail_photo_1791489929167.jpg';
import plumbingWork from './assets/images/plumbing_work_detail_1791490451857.jpg';
import pipeBand from './assets/images/photo_band_pipes_1791490431284.jpg';

export interface ImageConfig {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  focalPoint: string;
}

export const IMAGES: Record<string, ImageConfig> = {
  hero_panel: {
    id: 'hero_panel',
    src: faucetDetail,
    alt: 'Clean modern chrome faucet and basin installation',
    width: 800,
    height: 600,
    focalPoint: 'center',
  },
  photo_band: {
    id: 'photo_band',
    src: pipeBand,
    alt: 'Clean architectural copper plumbing pipe installation',
    width: 2100,
    height: 900,
    focalPoint: 'center',
  },
  how_it_works_bg: {
    id: 'how_it_works_bg',
    src: pipeBand,
    alt: '',
    width: 1920,
    height: 1080,
    focalPoint: 'center',
  },
  cta_background: {
    id: 'cta_background',
    src: copperBackground,
    alt: 'Clean polished copper pipes and shutoff valves',
    width: 1920,
    height: 1080,
    focalPoint: 'center',
  },

  // 6 Services thumbnails (280x200 desktop, 72x72 mobile)
  service_emergency: {
    id: 'service_emergency',
    src: copperBackground,
    alt: 'Emergency pipe shutoff valve and pressure regulator',
    width: 280,
    height: 200,
    focalPoint: 'center',
  },
  service_leak: {
    id: 'service_leak',
    src: faucetDetail,
    alt: 'Acoustic and thermal concealed pipe leak detection',
    width: 280,
    height: 200,
    focalPoint: 'center',
  },
  service_drain: {
    id: 'service_drain',
    src: plumbingWork,
    alt: 'Clean bathroom drain and plumbing assembly',
    width: 280,
    height: 200,
    focalPoint: 'center',
  },
  service_water_heater: {
    id: 'service_water_heater',
    src: pipeBand,
    alt: 'Water heater supply lines and copper manifolds',
    width: 280,
    height: 200,
    focalPoint: 'center',
  },
  service_toilets: {
    id: 'service_toilets',
    src: plumbingWork,
    alt: 'Modern residential bathroom fixtures and clean valve lines',
    width: 280,
    height: 200,
    focalPoint: 'center',
  },
  service_repiping: {
    id: 'service_repiping',
    src: copperBackground,
    alt: 'Precision soldered copper repiping and wall mounts',
    width: 280,
    height: 200,
    focalPoint: 'center',
  },

  // 3 How It Works step images (4:3 aspect ratio)
  step_01: {
    id: 'step_01',
    src: faucetDetail,
    alt: 'Initial plumbing inspection and customer dispatch',
    width: 600,
    height: 450,
    focalPoint: 'center',
  },
  step_02: {
    id: 'step_02',
    src: copperBackground,
    alt: 'On-site plumbing diagnostic and upfront price estimate',
    width: 600,
    height: 450,
    focalPoint: 'center',
  },
  step_03: {
    id: 'step_03',
    src: plumbingWork,
    alt: 'Completed clean tested residential plumbing repair',
    width: 600,
    height: 450,
    focalPoint: 'center',
  },

  // 5 Recent Work images (1 large, 4 smaller, mixed aspect ratios)
  recent_01: {
    id: 'recent_01',
    src: plumbingWork,
    alt: 'Completed master bathroom renovation and fixture installation',
    width: 1200,
    height: 800,
    focalPoint: 'center',
  },
  recent_02: {
    id: 'recent_02',
    src: pipeBand,
    alt: 'Copper water supply line manifold installation',
    width: 600,
    height: 450,
    focalPoint: 'center',
  },
  recent_03: {
    id: 'recent_03',
    src: copperBackground,
    alt: 'Brass shutoff valve and precision copper pipe soldering',
    width: 600,
    height: 750,
    focalPoint: 'center',
  },
  recent_04: {
    id: 'recent_04',
    src: faucetDetail,
    alt: 'Chrome sink faucet and basin trap replacement',
    width: 600,
    height: 600,
    focalPoint: 'center',
  },
  recent_05: {
    id: 'recent_05',
    src: pipeBand,
    alt: 'Whole-house repiping and pressure valve calibration',
    width: 600,
    height: 450,
    focalPoint: 'center',
  },
};
