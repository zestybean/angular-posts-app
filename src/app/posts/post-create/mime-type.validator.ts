import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File; // get the file from the control
  const fileReader = new FileReader(); // create a file reader
  const frObs = new Observable((observer) => {
    // create a new observable
    fileReader.addEventListener('loadend', () => {
      // add an event listener to the fileReader
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
        0,
        4
      ); // create a new Uint8Array from the fileReader result
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        // loop through the array
        header += arr[i].toString(16); // append the array element to the header
      }
      switch (header) {
        // check the header
        case '89504e47':
          // if the header is 89504e47
          isValid = true; // set isValid to true
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          // if the header is any of these
          isValid = true; // set isValid to true
          break;
        default:
          // if the header is anything else
          isValid = false; // set isValid to false
          break;
      }
      if (isValid) {
        // if isValid is true
        observer.next(null); // emit null
      } else {
        // if isValid is false
        observer.next({ invalidMimeType: true }); // emit invalidMimeType
      }
      observer.complete(); // complete the observable
    });
    fileReader.readAsArrayBuffer(file); // read the file
  });

  return frObs; // return the observable
};
