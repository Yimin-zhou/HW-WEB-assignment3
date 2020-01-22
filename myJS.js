function sortTable1(z) {
    var table, rows;
    var switching, shouldSwitch;

    table = document.getElementById("table1");
    switching = true;

    while (switching) {
        switching = false;
        rows = table.rows;
        for (var i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            var x = rows[i].getElementsByTagName("td")[z];
            var y = rows[i + 1].getElementsByTagName("td")[z];

            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {

            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;

        }
    }
}

function sortTable2(z) {
    var table, rows;
    var switching, shouldSwitch;

    table = document.getElementById("table2");
    switching = true;

    while (switching) {
        switching = false;
        rows = table.rows;
        for (var i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            var x = rows[i].getElementsByTagName("td")[z];
            var y = rows[i + 1].getElementsByTagName("td")[z];

            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {

            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;

        }
    }
}

function reset() {
    $('#reset').click(function() {
        $.ajax({
            url: 'https://wt.ops.labs.vu.nl/api20/a36aadb2/reset',
            type: "GET",
            dataType: "html",
            success: function(data) {
                alert(data);
            }
        });
    });
}

function loadTableData() {
    $.ajax({
        url: 'https://wt.ops.labs.vu.nl/api20/a36aadb2',
        type: "GET",
        dataType: "json",
        success: function(data) {
            var tableData = "";
            $.each(data, function(key, value) {
                tableData += "<tr>";
                tableData += "<td>" + value.brand + "</td>";
                tableData += "<td>" + value.model + "</td>";
                tableData += "<td>" + value.os + "</td>";
                tableData += "<td><figure><img src=\"" + value.image + "\">" + "</figure></td>";
                tableData += "<td>" + value.screensize + "</td>";
                tableData += "</tr>";
            });
            $('#table1').append(tableData);
        }
    });
}

function insertTableData() {
    $("#insert").click(function() {
        $.ajax({
            url: 'https://wt.ops.labs.vu.nl/api20/a36aadb2',
            type: "GET",
            dataType: "json",
            success: function(data) {
                var tableData = "";
                clearTable();
                $.each(data, function(key, value) {
                    tableData += "<tr>";
                    tableData += "<td>" + value.brand + "</td>";
                    tableData += "<td>" + value.model + "</td>";
                    tableData += "<td>" + value.os + "</td>";
                    tableData += "<td><figure><img src=\"" + value.image + "\">" + "</figure></td>";
                    tableData += "<td>" + value.screensize + "</td>";
                    tableData += "</tr>";
                });
                $('#table1').append(tableData);
            }
        });
    });
}

function clearTable() {
    var table = document.getElementById("table1");
    for (var i = table.rows.length - 1; i > 1; i--) {
        table.deleteRow(i);
    }
}

function submitFormData() {

    $("#submit").click(function(e) {
        var info = {
            brand: $("#brand").val(),
            model: $("#model").val(),
            os: $("#os").val(),
            image: $("#image").val(),
            screensize: $("#screensize").val(),
        };
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "https://wt.ops.labs.vu.nl/api20/a36aadb2",
            dataType: "json",
            data: info,
            success: function() {
                alert("submitted,use INSERT");
            }
        });
    });
}
$(document).ready(function() {
    submitFormData();
    insertTableData();
    loadTableData();
    reset();
})