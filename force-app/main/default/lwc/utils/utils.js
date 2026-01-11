export function csvGenerator(totaldata, headers, filename) {
    if (!totaldata || !totaldata.length) {
        console.error('No data provided for CSV generation.');
        return;
    }
    const jsonObject = JSON.stringify(totaldata);
    const result=converttoCSV(jsonObject, headers);
    if (!result) {
        console.error('CSV conversion failed.');
        return;
    }
    const blob = new Blob([result]);
    const expoertedFilename = filename ? filename+'.csv' : 'export.csv';
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, expoertedFilename);
    } else if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){
        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURI(result);
        link.target = '_blank';
        link.download = expoertedFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    else {
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', expoertedFilename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
function converttoCSV(objArray, headers) {
    const columnDelimiter = ',';
    const lineDelimiter = '\r\n';
    const keys = Object.keys(headers);
    const values=Object.values(headers);
    let result = '';
    result += values.join(columnDelimiter);
    result += lineDelimiter;
    const data= typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    data.forEach(item => {
        let ctr = '';
        keys.forEach(key => {
            if (ctr !== '') ctr += columnDelimiter;
           let strctr = item[key]+'';
              ctr += strctr ? strctr.replace(/,/g, ''):strctr;
        });
        result += ctr+lineDelimiter;
    });
    return result;
}