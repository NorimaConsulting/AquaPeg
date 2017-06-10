'use strict';



$(()=>{
  $('.saveNewMeter').click((e) => {


    if(!$(e.target).hasClass("disabled")){
      $(e.target).addClass("disabled");
      addAMeter(e)
    }
  })
});

function addAMeter(e){
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
      $(e.target).removeClass("disabled");
    }
  }).fail((transcation)=>{
    $(".submitNewMeterError").removeClass("hidden");
    $(e.target).removeClass("disabled");
    $(".submitNewMeterError span").html(transcation.responseJSON.message);
  });

}
