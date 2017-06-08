'use strict';


$(()=>{
  $('.saveReading').click((e) => {

    if($(e.target).hasClass("disabled")){

      $(e.target).addClass("disabled")

      var meterID = $("#meterIDInput").val();
      meterID = meterID.trim();

      var meterReading = $("#meterReadingInput").val();
      meterReading = meterReading.trim();

      var reminderToken = null;

      if($("#reminderTokenInput").length){
        reminderToken = $("#reminderTokenInput").val();
        reminderToken = reminderToken.trim();
      }


      var _csrf = $("meta[name='csrf-token']").attr("content");

      var url = "/meter-api/meter/"+meterID+"/Reading/"; //This URL is for if they are logged in
      var dataToSend = {
                          readingString:meterReading,
                          _csrf
                       };

      if(reminderToken){
        dataToSend.reminderToken = reminderToken
        url = "/meter-api/meter/reminder/" + reminderToken + "/Reading/"; //This URL is for if they are not logged in and using a token
      }

      $.post( url , dataToSend )
      .done(function( data ) {
        if(data.success){
          var newUrl = "/Meter/" + meterID;
          window.location.replace(newUrl);

        }else{
          $(".submitNewMeterError").removeClass("hidden");
        }
      }).fail(()=>{
        $(".submitNewMeterError").removeClass("hidden");
        $(e.target).removeClass("disabled")
      });
    });

  }
})
