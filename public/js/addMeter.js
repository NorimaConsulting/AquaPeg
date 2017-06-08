'use strict';



$(()=>{
  $('.saveNewMeter').click((e) => {

    $(e.target).addClass("disabled");

    console.log("Adding Meter To Server");
    var meterNumber = $("#meterNumberInput").val();
    meterNumber = meterNumber.trim();
    var _csrf = $("meta[name='csrf-token']").attr("content");
    $.post( "/meter-api/meter", { meterNumber, _csrf })
    .done(function( data ) {
      if(data.success){
        $(".add-meter-modal").modal('hide');
        location.reload();
      }else{
        $(".submitNewMeterError").removeClass("hidden");
      }
    }).fail(()=>{
      $(".submitNewMeterError").removeClass("hidden");
    });
  });


})
