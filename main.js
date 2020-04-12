// Const
const range = 550;
const numOfSection = 3;
const sleepTime = 10; // Doesnt go below 10.
let speedFactor = 10;

// Global variables.
let bubble = [];
let merge = [];
let quick = [];

let bubbleCounter = 0;
let mergeCounter = 0;
let quickCounter = 0;

function preload() {
  font = loadFont('assets/EuclidCircularA-Medium.ttf');
}

function setup() {
  createCanvas(windowHeight + 60, windowHeight);
  let shuffled = [];
  for(let i = 0; i < range; i++) {
    shuffled.push(Math.pow(i, 2));
  }
  shuffle(shuffled, true);
  shuffled.forEach((item, i) => {
    bubble.push(item);
    merge.push(item);
    quick.push(item);
  });

  bubbleSortNextStep(bubble);
  mergeSortNextStep(merge);
  quickSortNextStep(quick);
}

function draw() {
  background(20);

  drawSection(bubble, 0);

  drawSection(merge, 1);

  drawSection(quick, 2);

  drawCalculations();

  if (checkState(quick)) {
    speedFactor = 100;
  }
}

function windowResized() {
  resizeCanvas(windowHeight + 60, windowHeight);
}

function drawCalculations() {
  const brightness = 120;
  strokeWeight(0);
  textFont(font);
  textSize(30);
  textAlign(LEFT, TOP);
  fill(255, brightness, brightness); // R
  text('Bubble Sort', 15, 15);
  fill(brightness, 255, brightness); // G
  text('Merge Sort', 15, 15 + (height / numOfSection));
  fill(brightness, brightness, 255); // B
  text('Quick Sort', 15, 15 + (2 * height / numOfSection));

  fill(255);
  textSize(50);
  text(bubbleCounter, 15, 15 + 45);
  text(mergeCounter, 15, 15 + (height / numOfSection) + 45);
  text(quickCounter, 15, 15 + (2 * height / numOfSection) + 45);

  textSize(30);
  if (checkState(quick)) {
    if (!checkState(bubble)) {
      text('10x speed', 15, 15 + 110);
    }
    if (!checkState(merge)) {
        text('10x speed', 15, 15 + (height / numOfSection) + 110);
    }
  }
}

function drawSection(array, index) {
  stroke(200);
  strokeWeight(1);
  array.forEach((value, i) => {
    let x = map(i, 0, range - 1, 0, width);
    let y1 = (height / numOfSection) * (index + 1);
    let y2 = y1 - map(value, 1, Math.pow((range - 1), 2), 0, (height / numOfSection) - 1);
    line(x, y1, x, y2);
  });
}
//----
//Algorithm to check if given array is in order or not.
function checkState(array) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i + 1]) {
      return false;
    }
  }
  return true;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//--- BUBBLE SORT ---//
function bubbleSortNextStep(array) {
  if (checkState(array) == false) {
    bubbleSort(array);
  }
}
let b = 0;
async function bubbleSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - 1 - i; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
      bubbleCounter++;
      if (b == speedFactor) {
        b = 0;
        await sleep(sleepTime);
      }
      b++;
    }
  }
}

// --- MERGE SORT ---//

function mergeSortNextStep(array) {
  if (checkState(array) == false) {
    mergeSort(array, 0, array.length - 1);
  }
}

let m = 0;
async function mergeIt(array, start, mid, end) {
  let start2 = mid + 1;
  // If the direct merge is already sorted
  if (array[mid] <= array[start2]) {
    return;
  }
  // Two pointers to maintain start
  // of both arrays to merge
  while (start <= mid && start2 <= end) {
    // If element 1 is in right place
    if (array[start] <= array[start2]){
      start += 1;
    } else {
      let value = array[start2];
      let index = start2;

      // Shift all the elements between element 1
      // element 2, right by 1.
      while (index != start) {
        array[index] = array[index - 1];
        index--;
        mergeCounter++;
        if (m == speedFactor) {
          m = 0;
          await sleep(sleepTime);
        }
        m++;
      }

      array[start] = value;

      // Update all the pointers
      start++;
      mid++;
      start2++;
    }
  }
}

async function mergeSort(array, l, r){
  if (l < r) {
    let m = l + Math.floor((r - l) / 2);
    // Sort first and second halves
    await mergeSort(array, l, m);
    await mergeSort(array, m + 1, r);
    await mergeIt(array, l, m, r);
  }
}


//--- QUICK SORT ---//

function quickSortNextStep(array) {
  if (checkState(array) == false) {
    quickSort(array, 0, array.length - 1);
  }
}

let q = 0;
async function partition(array, low, high) {
  let i = low - 1;
  let pivot = array[high];

  for (let j = low; j < high; j++) {
    if (array[j] < pivot) {
      i += 1;
      [array[i], array[j]] = [array[j], array[i]];
    }
    quickCounter++;
    if (q == speedFactor) {
      q = 0;
      await sleep(sleepTime);
    }
    q++;
  }

  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  return (i + 1);
}

async function quickSort(array, low, high) {
  if (low < high) {
		let pi = await partition(array, low, high);
    await quickSort(array, low, pi - 1);
    await quickSort(array, pi + 1, high);
  }
}
