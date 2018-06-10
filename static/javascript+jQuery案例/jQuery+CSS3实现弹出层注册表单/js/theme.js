function openPopup(popupId) {
        $("#pleaseWait").fadeIn(400);
        $(popupId).attr("status", "open");
        $(popupId).show().transition({ scale: .7 }, 10).transition({ scale: 1, opacity: 1 }, 400);

}
function closePopup(popupId) {
    $("#pleaseWait").fadeOut(400);
    $(popupId).attr("status", "closed");
    $(popupId).transition({ scale: .7, opacity: 0 }, 400);

    setTimeout(function () {
        $(popupId).hide();
    }, 400);
}
function showTooltip(tipId) {
    if ($(tipId).attr("show") != "true") {
        $(tipId).show().css("opacity", 0).attr("show", "true");
        $(tipId).css("margin-top", "10px");
        $(tipId).stop().animate({ "margin-top": 0, opacity: 1 });
    }
}
function hideTooltip(tipId) {
    $(tipId).attr("show", "false");
    $(tipId).stop().animate({ "margin-top": 10, opacity: 0 }, function () {
        $(this).hide();
    });
}
function toggleTooltip(tipId) {
    if ($(tipId).attr("show") == "true") {
        hideTooltip(tipId);
    } else {
        showTooltip(tipId);
    }
}

function checkIsValid(id) {
    if ($(id).attr("valid") == "true") {
        return true;
    } else {
        return false;
    }
}
function checkTrue(id) {
    $(id).attr("valid", "true");
    $(id).parent().find(".true").fadeIn(100);
    $(id).parent().find(".false").fadeOut(100);
}
function checkAlert(id) {
    var t = $(id).parent().find(".false");
    t.animate({ "margin-right": 5 }, 100).animate({ "margin-right": 0 }, 100);
}
function checkFalse(id) {
    $(id).attr("valid", "false");
    $(id).parent().find(".false").fadeIn(100);
    $(id).parent().find(".true").fadeOut(100);
}

function arrangeGrid(container) {
    $(container).each(function () {

        var widest = 34;
        var heighest = 14;
        var newWidest = 0;
        var newHeighest = 0;
        $(this).find(".iconContainer").each(function () {
            if ($(this).width() > widest) {
                widest = $(this).width();
            }
            if ($(this).height() > heighest) {
                heighest = $(this).height();
            }
        });
        $(this).find(" .iconContainer").css({ "width": widest + 3, "height": heighest + 15 });
        $(this).find(" .iconScrollBar").lionbars();
    })
}
$(function () {
    //Lionbars
    //Top Login op ned
    var toggleLogin = 1;

    $("#jsLoginContainer").hide();

    setTimeout(function () {
        $("#jsLoginContainer").show();
    }, 400);
    $(".toggleLogin").click(function () {
        if (toggleLogin == 1) {
            toggleLogin = 0;
            $("#login").animate({ top: 0 });
            $("#IconBenchUsername").focus();
        } else {
            toggleLogin = 1;
            $("#login").animate({ top: -43 });
        }
        $("#invisLoginArea").slideToggle();
    });

    //Checkboxes
    $(".checkbox").not("disabled").click(function () {
        if ($(this).hasClass("checked")) {
            $(this).removeClass("checked");
            $(this).next().val("0");
        } else {
            $(this).addClass("checked");
            $(this).next().val("1");
        }
    })

    $(function () {
        $(".popupClose").live("click", function () {
            closePopup("#" + $(this).closest(".popup").attr("id"));
        });
        $(".closePopup").live("click", function () {
            closePopup("#" + $(this).closest(".popup").attr("id"));
        });
    });

    $(".effectView").each(function () {
        $(this).find(".toggle").not(".toggle:first").hide();
        $(this).find("h3 span").html("+");
        $(this).find("h3 span:first").html("-");
        $(this).find("h3").click(function () {
            $(this).next().slideToggle();
            if ($(this).find("span").html() == "+") {
                $(this).find("span").html("-");
            } else {
                $(this).find("span").html("+");
            }
        })
    })


})