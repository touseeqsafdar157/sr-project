import xls from "xlsx";
import { saveAs } from "file-saver";
import * as _ from "lodash";
import { toast } from "react-toastify";
export function getvalidDateDMY(date) {
  if(date === '' || date === undefined){
    return '';
  }else{
  const resdate = new Date(date);
  const year = resdate.getFullYear();
  const month =
    (resdate.getMonth() + 1).toString().length === 1
      ? "0" + (resdate.getMonth() + 1)
      : (resdate.getMonth() + 1).toString();
  const day =
    resdate.getDate().toString().length === 1
      ? "0" + resdate.getDate()
      : resdate.getDate().toString();
  return day + "-" + month + "-" + year;
  }
}

export function getvalidDateDMonthY(date) {
  const resdate = new Date(date);
  const year = resdate.getFullYear();
  const months = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months.find((month, i) => i === resdate.getMonth());
  const day =
    resdate.getDate().toString().length === 1
      ? "0" + resdate.getDate()
      : resdate.getDate().toString();
  return day + " " + month + ", " + year;
}

export function generateExcel(
  file_name,
  title,
  subject,
  sheet_name,
  author,
  headings,
  columns,
  file_data,
  footers = [""]
) {

  const arr=[];
 if(file_data?.length){
  file_data.map(item=>{
    const obj={};
   const keys =  Object.keys(item)
   keys.map(key=>{
    if(item[key]?.toString()) obj[key]=item[key]
    else obj[key] = ' '

   })
   arr.push(obj);
  })
 }
  const work_book = xls.utils.book_new();
  work_book.Props = {
    Title: title,
    Subject: subject,
    Author: author,
    CreatedDate: new Date(),
  };
  work_book.SheetNames.push(sheet_name);
  const sheet_data = xls.utils.aoa_to_sheet([
    ...headings,
    columns,
    ...arr?.map((row) => _.values(row)),
    footers,
  ]);
  sheet_data["!cols"] = fitToColumn([columns]);
  work_book.Sheets[sheet_name] = sheet_data;
  const work_book_export = xls.write(work_book, {
    bookType: "xlsx",
    type: "binary",
    raw: false,
    defval: "",
  });
  saveAs(
    new Blob([s2ab(work_book_export)], { type: "application/octet-stream" }),
    `${file_name}.xlsx`
  );
}
// export function generateExcel(
//   file_name,
//   title,
//   subject,
//   sheet_name,
//   author,
//   headings,
//   columns,
//   file_data,
//   footers = [""]
// ) {
//   const work_book = xls.utils.book_new();
//   work_book.Props = {
//     Title: title,
//     Subject: subject,
//     Author: author,
//     CreatedDate: new Date(),
//   };
//   work_book.SheetNames.push(sheet_name);
//   const sheet_data = xls.utils.aoa_to_sheet([
//     ...headings,
//     columns,
//     ...file_data.map((row) => _.values(row)),
//     footers,
//   ]);
//   sheet_data["!cols"] = fitToColumn([columns]);
//   work_book.Sheets[sheet_name] = sheet_data;
//   const work_book_export = xls.write(work_book, {
//     bookType: "xlsx",
//     type: "binary",
//     raw: false,
//     defval: "",
//   });
//   saveAs(
//     new Blob([s2ab(work_book_export)], { type: "application/octet-stream" }),
//     `${file_name}.xlsx`
//   );
// }
export function getvalidDateDMMMY(date) {
  const resdate = new Date(date);
  const year = resdate.getFullYear();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months.find((month, i) => i === resdate.getMonth());
  const day =
    resdate.getDate().toString().length === 1
      ? "0" + resdate.getDate()
      : resdate.getDate().toString();
  return day + "-" + month + "-" + year;
}
export function getvalidDateYMD(date) {
  const resdate = new Date(date);
  const year = resdate.getFullYear();
  const month =
    (resdate.getMonth() + 1).toString().length === 1
      ? "0" + (resdate.getMonth() + 1)
      : (resdate.getMonth() + 1).toString();
  const day =
    resdate.getDate().toString().length === 1
      ? "0" + resdate.getDate()
      : resdate.getDate().toString();
  return year + "-" + month + "-" + day;
}

export function s2ab(s) {
  const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  const view = new Uint8Array(buf); //create uint8array as viewer
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
  return buf;
}

export function fitToColumn(arrayOfArray) {
  // get maximum character of each column
  return arrayOfArray[0].map((a, i) => ({
    wch: Math.max(
      ...arrayOfArray.map((a2) => (a2[i] ? a2[i].toString().length : 0))
    ),
  }));
}
export function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function isValidDate(d) {
  const da = new Date(d);
  return da instanceof Date && !isNaN(da);
}

export function generateRegex(input) {
  var string = "^",
    arr = input.trim().split(" ");
  arr.forEach(function (chars, i) {
    string += chars + "\\w*" + (arr.length - 1 > i ? "\\s+" : "");
  });

  return new RegExp(string, "i");
}

export function numberWithCommas(value) {
  if (value === 'NaN' || value === NaN || value === '' || value === undefined) {
    return ''
  } else {
    return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  }
}

export function thousandSeperator(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export function listCrud(features) {
  let crud;
  features.forEach((item) => {
    if (item.children.length > 0) {
      item.children.forEach((tem) => {
        const path = window.location.pathname;
        if (tem.route === path) {
          crud = tem.crud;
        }
      });
    }
  });
  return crud;
}
export function getFoundObject(array, itemToFind) {
  return array.find((id) => id.value === itemToFind) === undefined
    ? { label: "", value: "" }
    : array.find((id) => id.value === itemToFind);
}
export function getFilteredObjects(array, itemToFind) {
  return array.find((id) => id.value === itemToFind) === undefined
    ? null
    : array.find((id) => id.value === itemToFind);
}

export function findArrayObjcetBy(array, prop, value) {
  return array.find((item) => item[prop] === value);
}

export function filterArrayObjcetBy(array, prop, value) {
  return array.find((item) => item[prop] === value);
}
export function loopmessages(message) {
  message.forEach((item) => {
    toast.error(item);
  });
}

export function sortyByDate(array) {
  return array.sort((a, b) => {
    if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
      return -1;
    if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
      return 1;
    return 0;
  });
}

export function generateLetters(lot_size, shares, allotment_number) {
  const allotment_letters = [];
  let proportions = 0;
  let i = shares;
  while (i !== 0) {
    allotment_number++;
    if (i >= lot_size) {
      i = i - lot_size;
      allotment_letters.push({ shares_count: lot_size, allotment_number });
    } else if (i < lot_size && i > 0) {
      allotment_letters.push({ shares_count: i, allotment_number });
      i = 0;
    }
    proportions++;
  }
  return allotment_letters;
}

export function fileBase64(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
}
export function isNumber(value) {
  if (value == NaN || value == 'NaN' || value == undefined || value == 'undefined' || value == '' || value == null || value == 'null') {
    value = '0';
  }
  return value;
}
