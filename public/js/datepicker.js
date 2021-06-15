$(function () {

    var start = moment();
    var end = moment();

    function cb(start, end) {

        var today = [moment().format('DD/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY')];
        var yesterday = [moment().subtract(1, 'days').format('DD/MM/YYYY') + ' - ' + moment().subtract(1,
            'days').format('DD/MM/YYYY')];
        var last7days = [moment().subtract(6, 'days').format('DD/MM/YYYY') + ' - ' + moment().format(
            'DD/MM/YYYY')];
        var last30days = [moment().subtract(29, 'days').format('DD/MM/YYYY') + ' - ' + moment().format(
            'DD/MM/YYYY')];
        var thisMonth = [moment().startOf('month').format('DD/MM/YYYY') + ' - ' + moment().endOf('month')
            .format('DD/MM/YYYY')
        ]
        var lastMonth = [moment().subtract(1, 'month').startOf('month').format('DD/MM/YYYY') + ' - ' +
            moment().subtract(1, 'month').endOf('month').format('DD/MM/YYYY')
        ];

        $('#btnDate').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));

           if ($('#btnDate').html() == today) {
               $('#dropMain').html('Hoje');

           } else if ($('#btnDate').html() == yesterday) {
               $('#dropMain').html('Ontem');

           } else if ($('#btnDate').html() == last7days) {
               $('#dropMain').html('Ultimos 7 Dias');

           } else if ($('#btnDate').html() == last30days) {
               $('#dropMain').html('Ultimos 30 Dias');

           } else if ($('#btnDate').html() == thisMonth) {
               $('#dropMain').html('Este Mes');

           } else if ($('#btnDate').html() == lastMonth) {
               $('#dropMain').html('Mes Passado');

           } else {
               $('#dropMain').html('Data Personalizada');
           }


    }

    $('#a1').on('click', function () {
        $('#btnDate').data('daterangepicker').setStartDate(moment().format('DD/MM/YYYY'));
        $('#btnDate').data('daterangepicker').setEndDate(moment().format('DD/MM/YYYY'));
        cb(moment(), moment())
    });

    $('#a2').on('click', function () {
        $('#btnDate').data('daterangepicker').setStartDate(moment().subtract(1, 'days').format('DD/MM/YYYY'));
        $('#btnDate').data('daterangepicker').setEndDate(moment().subtract(1, 'days').format('DD/MM/YYYY'));
        cb(moment().subtract(1, 'days'), moment().subtract(1, 'days'))
    });

    $('#a3').on('click', function () {
        $('#btnDate').data('daterangepicker').setStartDate(moment().subtract(6, 'days').format('DD/MM/YYYY'));
        $('#btnDate').data('daterangepicker').setEndDate(moment().format(
            'DD/MM/YYYY'));
        cb(moment().subtract(6, 'days'), moment());
    });

    $('#a4').on('click', function () {
        $('#btnDate').data('daterangepicker').setStartDate(moment().subtract(29, 'days').format('DD/MM/YYYY'));
        $('#btnDate').data('daterangepicker').setEndDate(moment().format(
            'DD/MM/YYYY'));
        cb(moment().subtract(29, 'days'), moment());
    });

    $('#a5').on('click', function () {
        $('#btnDate').data('daterangepicker').setStartDate(moment().startOf('month').format('DD/MM/YYYY'));
        $('#btnDate').data('daterangepicker').setEndDate(moment().endOf('month')
        .format('DD/MM/YYYY'));
        cb(moment().startOf('month'), moment().endOf('month'));
    });

    $('#a6').on('click', function () {
        $('#btnDate').data('daterangepicker').setStartDate(moment().subtract(1, 'month').startOf('month').format('DD/MM/YYYY'));
        $('#btnDate').data('daterangepicker').setEndDate(moment().subtract(1, 'month').endOf('month').format('DD/MM/YYYY'));
        cb(moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month'));
    });

    $('#btnDate').daterangepicker({
        "locale": {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "daysOfWeek": [
                "Dom",
                "Seg",
                "Ter",
                "Qua",
                "Qui",
                "Sex",
                "Sab"
            ],
            "monthNames": [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro"
            ],
            "firstDay": 1
        },
    }, cb);



    $('#btnLastDate').on('click', function (e) {
        var day = $('#btnDate').data('daterangepicker').endDate.date();
        var month = $('#btnDate').data('daterangepicker').endDate.month() + 1;
        var year = $('#btnDate').data('daterangepicker').endDate.year();

        var date = $('#btnDate').data('daterangepicker').endDate.format('DD/MM/YYYY');
        var startOfMonth = moment($('#btnDate').data('daterangepicker').endDate).startOf('month').format('DD/MM/YYYY');
        var split = startOfMonth.split('/');
        var splitDate;

        if (split[1].slice(0, 1) == 0) {
            splitDate = split[0] + '/' + 0 + parseInt(split[1] - 1) + '/' + split[2];
        } else {
            splitDate = split[0] + '/' + parseInt(split[1] - 1) + '/' + split[2];
        }
        var splitDateLastYear = split[0] + '/' + 12 + '/' + parseInt(split[2] - 1)

        var newSplitDate = new moment(splitDate).format('DD/MM/YYYY');
        var newSplitDateLastYear = new moment(splitDateLastYear).format('DD/MM/YYYY');

        var endOfMonth = moment(newSplitDate).endOf('month').format('DD/MM/YYYY');
        var lastYear = moment(newSplitDateLastYear).endOf('month').format('DD/MM/YYYY');
        var newDay = endOfMonth.slice(0, 2);
        var newDayLastYear = lastYear.slice(0, 2);

        if (date != startOfMonth) {
            $('#btnDate').data('daterangepicker').setStartDate(day - 1 + '/' + month + '/' + year);
            $('#btnDate').data('daterangepicker').setEndDate(day - 1 + '/' + month + '/' + year);
            cb($('#btnDate').data('daterangepicker').endDate, $('#btnDate').data(
                'daterangepicker').endDate)

        } else if (date == startOfMonth && month != 01) {

            $('#btnDate').data('daterangepicker').setStartDate(newDay + '/' + parseInt(month - 1) + '/' + year);
            $('#btnDate').data('daterangepicker').setEndDate(newDay + '/' + parseInt(month - 1) + '/' + year);
            cb($('#btnDate').data('daterangepicker').endDate, $('#btnDate').data(
                'daterangepicker').endDate)

        } else {
            $('#btnDate').data('daterangepicker').setStartDate(newDayLastYear + '/' + 12 + '/' + parseInt(year - 1));
            $('#btnDate').data('daterangepicker').setEndDate(newDayLastYear + '/' + 12 + '/' + parseInt(year - 1));
            cb($('#btnDate').data('daterangepicker').endDate, $('#btnDate').data(
                'daterangepicker').endDate)
        }
    })


    $('#btnNextDate').on('click', function (e) {
        var day = $('#btnDate').data('daterangepicker').endDate.date();
        var month = $('#btnDate').data('daterangepicker').endDate.month() + 1;
        var year = $('#btnDate').data('daterangepicker').endDate.year();

        var date = $('#btnDate').data('daterangepicker').endDate.format('DD/MM/YYYY');

        var endOfMonth = moment($('#btnDate').data('daterangepicker').endDate).endOf('month').format('DD/MM/YYYY');

        if (date != endOfMonth) {
            $('#btnDate').data('daterangepicker').setStartDate(day + 1 + '/' + month + '/' + year);
            $('#btnDate').data('daterangepicker').setEndDate(day + 1 + '/' + month + '/' + year);
            cb($('#btnDate').data('daterangepicker').endDate, $('#btnDate').data(
                'daterangepicker').endDate)

        } else if (date == endOfMonth && month != 12) {
            $('#btnDate').data('daterangepicker').setStartDate(1 + '/' + parseInt(month + 1) + '/' + year);
            $('#btnDate').data('daterangepicker').setEndDate(1 + '/' + parseInt(month + 1) + '/' + year);
            cb($('#btnDate').data('daterangepicker').endDate, $('#btnDate').data(
                'daterangepicker').endDate)

        } else {
            $('#btnDate').data('daterangepicker').setStartDate(1 + '/' + 1 + '/' + parseInt(year + 1));
            $('#btnDate').data('daterangepicker').setEndDate(1 + '/' + 1 + '/' + parseInt(year + 1));
            cb($('#btnDate').data('daterangepicker').endDate, $('#btnDate').data(
                'daterangepicker').endDate)
        }
    })

    cb(start, end);
});