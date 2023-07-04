$(document).ready(function () {
    // alert("check");
    console.log("jquery works");
});

function handleAutoComplete() {
    // alert("slam");
    var fieldName;
    var currentELe;
    currentELe = $(this);
    fieldName = currentELe.data("field-name");
    if (typeof fieldName === "undefined") {
        return false;
    }
    currentELe.autocomplete({
        source: function (data, cb) {
            $.ajax({
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                type: "post",
                url: "/get-cities",
                data: {
                    name: data.term,
                    fieldName: fieldName,
                },
                success: function (res) {
                    var result;
                    result = [
                        {
                            label:
                                "There is no matching record found for" +
                                data.term,
                            value: "",
                        },
                    ];
                    if (res.length) {
                        result = $.map(res, function (obj) {
                            return {
                                label: obj[fieldName],
                                value: obj[fieldName],
                                data: obj,
                            };
                        });
                    }
                },
                error: function () {
                    alert("Error");
                },
            });
            // $.ajax({
            //     headers: {
            //         "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
            //             "content"
            //         ),
            //     },
            //     url: "/get-cities",
            //     method: "POST",
            //     dataType: "json",
            //     data: {
            //         name: data.term,
            //         fieldName: fieldName,
            //     },
            //     success: function (res) {
            //         var result;
            //         result = [
            //             {
            //                 label:
            //                     "There is no matching record found for" +
            //                     data.term,
            //                 value: "",
            //             },
            //         ];
            //         if (res.length) {
            //             result = $.map(res, function (obj) {
            //                 return {
            //                     label: obj[fieldName],
            //                     value: obj[fieldName],
            //                     data: obj,
            //                 };
            //             });
            //         }
            //     },
            // });
        },
        autoFocus: true,
        minLength: 2,
        select: function (event, selectedData) {
            if (selectedData && selectedData.item && selectedData.item.data) {
                console.log(selectedData);
            }
        },
    });
}

$(document).on("focus", ".autocomplete_txt", handleAutoComplete);
