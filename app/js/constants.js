angular.module('app')

.constant('PEYOTE_VALUES', {
  braceletPixelWidth: 600,
  pixelsPerInch: 300,
  pixelsPerBead: 28,
  heightOptions: [
    {beads: 93.5, inches: 6.5, description: '6.5 in.'},
    {beads: 100.5, inches: 7, description: '7 in.'},
    {beads: 107.5, inches: 7.5, description: '7.5 in.'},
    {beads: 114.5, inches: 8, description: '8 in.'},
    {beads: 121.5, inches: 8.5, description: '8.5 in.'},
    {beads: 129.5, inches: 9, description: '9 in.'},
    {beads: 136.5, inches: 9.5, description: '9.5 in.'}
  ],
  widthOptions: [
    {beads: 24, inches: 1.2, description: 'Skinny (1.2 in.)'},
    {beads: 27, inches: 1.35, description: 'Normal (1.35 in.)'},
    {beads: 30, inches: 1.5, description: 'Wide (1.5 in.)'}
  ],
  beadHeight: 14,
  beadWidth: 10
})

.constant('STRIPE', {
  publishableKey: 'pk_test_8lpNNwFVokUif3qxk2N7fPd6'
})

.constant('PEYOTE_PRICES', {
  templatePrice: 20,
  pricePerSquareInch: 1.5,
  pricePerColor: 1,
  priceForClasps: 3,
  priceToShip: 5,
  salesTax: 0.06
})

.constant('MIME', {
  imageTypes: { 
    apng: 'image/apng',
    bmp: 'image/x-ms-bmp',
    cgm: 'image/cgm',
    g3: 'image/g3fax',
    gif: 'image/gif',
    ief: 'image/ief',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    jpe: 'image/jpeg',
    ktx: 'image/ktx',
    png: 'image/png',
    btif: 'image/prs.btif',
    sgi: 'image/sgi',
    svg: 'image/svg+xml',
    svgz: 'image/svg+xml',
    tiff: 'image/tiff',
    tif: 'image/tiff',
    psd: 'image/vnd.adobe.photoshop',
    uvi: 'image/vnd.dece.graphic',
    uvvi: 'image/vnd.dece.graphic',
    uvg: 'image/vnd.dece.graphic',
    uvvg: 'image/vnd.dece.graphic',
    djvu: 'image/vnd.djvu',
    djv: 'image/vnd.djvu',
    sub: 'text/vnd.dvb.subtitle',
    dwg: 'image/vnd.dwg',
    dxf: 'image/vnd.dxf',
    fbs: 'image/vnd.fastbidsheet',
    fpx: 'image/vnd.fpx',
    fst: 'image/vnd.fst',
    mmr: 'image/vnd.fujixerox.edmics-mmr',
    rlc: 'image/vnd.fujixerox.edmics-rlc',
    mdi: 'image/vnd.ms-modi',
    wdp: 'image/vnd.ms-photo',
    npx: 'image/vnd.net-fpx',
    wbmp: 'image/vnd.wap.wbmp',
    xif: 'image/vnd.xiff',
    webp: 'image/webp',
    '3ds': 'image/x-3ds',
    ras: 'image/x-cmu-raster',
    cmx: 'image/x-cmx',
    fh: 'image/x-freehand',
    fhc: 'image/x-freehand',
    fh4: 'image/x-freehand',
    fh5: 'image/x-freehand',
    fh7: 'image/x-freehand',
    ico: 'image/x-icon',
    jng: 'image/x-jng',
    sid: 'image/x-mrsid-image',
    pcx: 'image/x-pcx',
    pic: 'image/x-pict',
    pct: 'image/x-pict',
    pnm: 'image/x-portable-anymap',
    pbm: 'image/x-portable-bitmap',
    pgm: 'image/x-portable-graymap',
    ppm: 'image/x-portable-pixmap',
    rgb: 'image/x-rgb',
    tga: 'image/x-tga',
    xbm: 'image/x-xbitmap',
    xpm: 'image/x-xpixmap',
    xwd: 'image/x-xwindowdump'
  }
})

.constant('CARD_TYPES', {
  'Visa': {
    iconClass: 'pf-visa',
    possibleLengths: [16, 19],
    cvcLength: 3
  },
  'Maestro': {
    iconClass: 'pf-credit-card',
    possibleLengths: [16, 19],
    cvcLength: 3
  },
  'Forbrugsforeningen': {
    iconClass: 'pf-credit-card',
    possibleLengths: [16],
    cvcLength: 3
  },
  'Dankort': {
    iconClass: 'pf-credit-card',
    possibleLengths: [16],
    cvcLength: 3
  },
  'MasterCard': {
    iconClass: 'pf-mastercard',
    possibleLengths: [16],
    cvcLength: 3
  },
  'American Express': {
    iconClass: 'pf-american-express',
    possibleLengths: [15],
    cvcLength: 4
  },
  'Diners Club': {
    iconClass: 'pf-diners',
    possibleLengths: [14],
    cvcLength: 3
  },
  'Discover': {
    iconClass: 'pf-discover',
    possibleLengths: [16],
    cvcLength: 3
  },
  'JCB': {
    iconClass: 'pf-jcb',
    possibleLengths: [16],
    cvcLength: 3
  },
  'UnionPay': {
    iconClass: 'pf-credit-card',
    possibleLengths: [16, 19],
    cvcLength: 3
  }
});