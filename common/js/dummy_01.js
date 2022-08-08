function getBrowser(){
    var uaStr0 = navigator.userAgent;
    var devPlatform = "";
    var browserName = "";
   
    if(uaStr0.indexOf("Windows") != -1){
     if(uaStr0.indexOf("NT 10.0") != -1){devPlatform = "Windows 10";}
     else if(uaStr0.indexOf("NT 6.3") != -1){devPlatform = "Windows 8.1";}
     else if(uaStr0.indexOf("NT 6.2") != -1){devPlatform = "Windows 8";}
     else if(uaStr0.indexOf("NT 6.1") != -1){devPlatform = "Windows 7";}
     else if(uaStr0.indexOf("NT 6.0") != -1){devPlatform = "Windows Vista";}
     else{devPlatform = "구버전 Windows";}
    }else if(uaStr0.indexOf("Macintosh") != -1){devPlatform = "macOS";}
    else if(uaStr0.indexOf("Linux") != -1){
     if(uaStr0.indexOf("Android") != -1){devPlatform = "Android 계열";}
     else{devPlatform = "Linux 계열";}
    }else if(uaStr0.indexOf("iPhone") != -1){devPlatform = "iOS (iPhone)";}
    else if(uaStr0.indexOf("iPad") != -1){devPlatform = "iOS/iPad OS (iPad)";}
    else{devPlatform = "기타 기기";}
   
    var browserPattern = /(MSIE|Trident|(?!Gecko.+)Firefox|(?!AppleWebKit.+Chrome.+)Safari(?!.+Edge)|(?!AppleWebKit.+)Chrome(?!.+Edge)|(?!AppleWebKit.+Chrome.+Safari.+)Edge|AppleWebKit(?!.+Chrome|.+Safari)|Gecko(?!.+Firefox))(?: |\/)([\d\.apre]+)/;
    browserName = browserPattern.exec(uaStr0).slice(1,3).join(" ");
   
    console.log("OS 종류: "+devPlatform+", 브라우저: "+browserName);
   }

showRemainingTime = {
 showRemainingTDKorean : function(){
  var r = requestPage.makeRequest();

  r.onreadystatechange = function(){
   if(r.readyState == 4){
    if(r.status == 200){
     var s = JSON.parse(r.responseText);
     if(s.length == 0){
      document.getElementById("countdown_time_k").innerHTML = "개최 중인 이벤트가 없습니다.";
      document.getElementById("theater_event_name_k").innerHTML = "(개최 중인 이벤트가 없습니다)";
      document.getElementById("theater_ename_orig_k").style.display = "none";
      document.getElementById("boost_time_k").innerHTML = "";
      document.getElementById("boost_countdown_k").style.display = "none";
      document.getElementById("nearend_event_k").style.display = "none";
      console.log("["+(new Date()).toLocaleString()+"] [한국어판] 현재 개최 중인 이벤트가 없습니다.");
      return;
     }
     var eid = new Number(s[0].id);
     document.getElementById("theater_eid_k").value = eid;

     if($("#theater_elist_k td[data-event-id='"+eid+"'][data-event-id!='-1']").length != 0){var $eTitle = document.createTextNode($("#theater_elist_k td[data-event-id][data-event-id!='-1']").filter("[data-event-id='"+eid+"']").html().replace("<br>","\n").replace("&amp;","&"));}
     else{var $eTitle = document.createTextNode("개최 중인 이벤트가 없습니다.");}


     var eInfoLink = document.createElement("a");
     if(s[0].type == 3 || s[0].type == 4 || s[0].type == 5){eInfoLink.href = `https://unionlive.kr/events/${eid}/chart`;}
     else{eInfoLink.href = "https://unionlive.kr/events";}
     eInfoLink.target = "_blank";

     eInfoLink.appendChild($eTitle);
     document.getElementById("theater_event_name_k").innerHTML = "";
     document.getElementById("theater_event_name_k").appendChild(eInfoLink);
     if(typeof s[0].name != "undefined"){document.getElementById("theater_ename_orig_k").innerHTML = "("+s[0].name+")";}
     else{document.getElementById("theater_ename_orig_k").innerHTML = "(???)";}
     document.getElementById("theater_ename_orig_k").style.display = "inline-block";
     
     console.log("["+(new Date()).toLocaleString()+"] [한국어판] 현재 개최 중인 이벤트 종류 : "+theaterEventType[s[0].type]);

     var eDateTime0 = new Number(new Date(s[0].schedule.endDate));
     var eDateTime = new Date(eDateTime0+1000);
     var eYear = eDateTime.getFullYear();
     var eMonth = eDateTime.getMonth()+1;
     var eDay = eDateTime.getDate();
     var eHours = eDateTime.getHours();
     var eMins = eDateTime.getMinutes();
     var eSecs = eDateTime.getSeconds();

     setInterval(function(){tickEvent.remain(eYear,eMonth,eDay,eHours,eMins,eSecs,"countdown_time_k");},50);

     var dateTimeNow = new Number(new Date());
     var nearEndThreshold = 0;
     var underdayRemain = 86400;

     var sDateTime0 = new Number(new Date(s[0].schedule.beginDate));
     var sDateTime = new Date(sDateTime0+1000);

     if(s[0].type == 3 || s[0].type == 4){nearEndThreshold = 43200;} // PST 이벤트 (3 = 시어터, 4 = 투어)
     else if(s[0].type == 2 || s[0].type == 9){nearEndThreshold = 21600;} // 밀리코레
     else if(s[0].type == 5){nearEndThreshold = 43200;} // n주년 이벤트
     else if(s[0].type == 6){nearEndThreshold = 10800;} // 워킹
     else if(s[0].type == 7){nearEndThreshold = 3600;} // 만우절 특별 이벤트
     else{nearEndThreshold = 21600;} // 그 외

     if((eDateTime - dateTimeNow) <= (underdayRemain * 1000) && (eDateTime - dateTimeNow) > (nearEndThreshold * 1000)){document.getElementById("underday_event_k").style.display = "block";}
     else if((eDateTime - dateTimeNow) <= (nearEndThreshold * 1000)){document.getElementById("underday_event_k").style.display = "none";}

     if((eDateTime - dateTimeNow) <= (nearEndThreshold * 1000)){document.getElementById("nearend_event_k").style.display = "block";}
     else if((eDateTime - dateTimeNow) <= 0){document.getElementById("nearend_event_k").style.display = "none";}

     if((eDateTime - dateTimeNow) <= 0){document.getElementById("theater_ename_orig_k").style.display = "none";}

     setInterval(function(){tickEvent.percentage(sDateTime,eDateTime,"event_progress_k");},50);
     
     if("boostBeginDate" in s[0].schedule){ // 후반전이 존재할 경우
      var bDateTime = new Date(s[0].schedule.boostBeginDate);
      var bYear = bDateTime.getFullYear();
      var bMonth = bDateTime.getMonth()+1;
      var bDay = bDateTime.getDate();
      var bHours = bDateTime.getHours();
      var bMins = bDateTime.getMinutes();
      var bSecs = bDateTime.getSeconds();
 
      setInterval(function(){tickEvent.boost(bYear,bMonth,bDay,bHours,bMins,bSecs,"boost_time_k");},50);
     }else{
      document.getElementById("boost_time_k").innerHTML = "후반전 없음";
      console.log("["+(new Date()).toLocaleString()+"] [한국어판] 현재 개최 중인 이벤트는 후반전이 없는 이벤트 형식입니다.");
     }

     if(s[0].type == 3){ // 시어터 이벤트인 경우에만 어필치 보너스 적용
      var aTypeText = "";
      if("appealType" in s[0]){
       if(s[0].appealType == 1){aTypeText = "보컬(Vo)";}
       else if(s[0].appealType == 2){aTypeText = "댄스(Da)";}
       else if(s[0].appealType == 3){aTypeText = "비쥬얼(Vi)";}
       else{aTypeText = "보너스 없음";}
      }else{aTypeText = "보너스 없음";}
      console.log("["+(new Date()).toLocaleString()+"] [한국어판] 이벤트 보너스 적용 어필치 : "+aTypeText);
     }
    }else{
     alert("오류가 발생했습니다. ["+r.status+"]");
     document.getElementById("countdown_time_k").innerHTML = "서버가 점검 중이거나 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
     return false;
    }
   }
  };

  var nowDate = new Date();
  var tzAdjust = ((540 - ((-1) * nowDate.getTimezoneOffset())) * 60000); // 한일 시간대(UTC+9) 에 맞춰서 조정
  var adjustedDate = new Date(new Number(nowDate)+(((-1) * nowDate.getTimezoneOffset() * 60000)+tzAdjust));
  var dt = adjustedDate.toISOString().replace("Z","");

  r.open("GET","https://api.matsurihi.me/mltd/v1/ko/events?at="+dt);
  r.send();
 }
};