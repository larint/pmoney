function PrintElem(elem, title) {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    mywindow.document.write(`<html><head><title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
        <style>
            .table-success, .table-success>td, .table-success>th {
                background-color: #c3e6cb;
            }
            .table-bordered {
                border: 1px solid #dee2e6;
            }
            .table {
                width: 100%;
                margin-bottom: 1rem;
                color: #212529;
            }
            table {
                border-collapse: collapse;
            }
            .table-success thead th {
                border-color: #8fd19e;
            }
            .table-bordered thead td, .table-bordered thead th {
                border-bottom-width: 2px;
            }
            .table thead th {
                vertical-align: bottom;
                border-bottom: 2px solid #dee2e6;
            }
            .table-bordered td, .table-bordered th {
                border: 1px solid #dee2e6;
            }
            .table-sm td, .table-sm th {
                padding: 5px;
            }
            .table td, .table th {
                padding: 5px;
                vertical-align: top;
                border-top: 1px solid #dee2e6;
            }
        </style>
        </head><body>
        <h1>${title}</h1>
        ${document.getElementById(elem).innerHTML}
        </body></html>`
    );

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}

function delSheet(sheetId, location = '', callback = null) {
    $.ajax({
        type: 'POST',
        url: '/api/del-sheet',
        data: { sheetId: sheetId },
        beforeSend: function () {

        },
        success: function (res) {
            toastr.success('Đã xoá!');
            if (location) {
                window.location.href = location;
            }
            if (callback) {
                callback()
            }
        },
        error: function (res) {
            toastr.error(res.statusText);
        }
    })
}

function delSheetRow(sheetId, indexRow, callback) {
    $.ajax({
        type: 'POST',
        url: '/api/del-sheet-row',
        data: { sheetId: sheetId, indexRow: indexRow },
        beforeSend: function () {

        },
        success: function (res) {
            toastr.success('Đã xoá!');
            callback();
        },
        error: function (res) {
            toastr.error(res.statusText);
        }
    })
}

function newSheet(value, callback) {
    $.ajax({
        type: 'POST',
        url: '/api/newSheet',
        data: { name: value },
        beforeSend: function () {

        },
        success: function (res) {
            toastr.success('Đã tạo mới!');
            callback();
        },
        error: function (res) {
            toastr.error('Lỗi tạo bảng tính mới!');
        }
    })
}

function updateSheetRow(sheetname, indexRow, amount, callback) {
    $.ajax({
        type: 'POST',
        url: '/api/update-sheet-row',
        data: { sheetname: sheetname, indexRow: indexRow, amount: amount },
        beforeSend: function () {

        },
        success: function (res) {
            toastr.success('Đã cập nhật!');
            callback();
        },
        error: function (res) {
            toastr.error('Lỗi cập nhậ!');
        }
    })
}


function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
