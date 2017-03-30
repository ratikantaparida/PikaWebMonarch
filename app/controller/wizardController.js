'use strict';
app.controller('wizardController', ['$scope', '$rootScope', '$filter', 'genericService', 'localStorageService', '$location','authService', function ($scope, $rootScope, $filter, genericService, localStorageService, $location, authService) {
    try {
        debugger;
        $scope.filterData = [];
       	$scope.tagList = [];
       	$scope.filterObj = {};
       	$scope.filterReq = {};
        $scope.myStep=1;
        $scope.sic = {};
        $scope.sic.campaignDistribution = {};
        $scope.flagSms = false;
        $scope.flagApp = false;
        
        $scope.businessId = { "businessAccountId": authService.authentication.businessAccountId };
        
        $scope.getCampaignGoal = function () {
            $scope.busymsg = "Getting Campaign Goals.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/campaign/campaignGoals", $scope.businessId, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.dd_campGoals = results.campaignGoals;
                $scope.saveBusy = false;
            });
        }
        
        $scope.getCampaignGoal();
        
        $scope.selectGoal = function (goal) {
        	var obj = _.find($scope.dd_campGoals,{goalName:goal});
        	$scope.sic.campaignGoalId = obj.goalId;
        }
        
        $scope.getFilter = function () {
            $scope.busymsg = "Getting filter.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("GET", "web/filter/getFilterMetadata", 0, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.map = results.metadataList;
                $scope.saveBusy = false;
            });
        }     
        $scope.getFilter();
        
        $scope.getOffers = function () {
            $scope.busymsg = "Getting offers.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/campaign/viewBusinessOffers", $scope.businessId, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.offerData = results.offersList;
                $scope.latestOffer = results.latestOffer;
	            $scope.sic.offerId = results.latestOffer.offerId;
	            $scope.couponcode = results.latestOffer.offerCode;
	            $scope.offSel = results.latestOffer.offerId;
	            $scope.offerReq = { "offerId": results.latestOffer.offerId };
                $scope.saveBusy = false;            
	            $scope.viewOfferDetails();
            });
        }
        $scope.getOffers();
        
        $scope.viewOfferDetails = function () {
            $scope.busymsg = "Getting offer details.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("POST", "web/campaign/viewOfferDetails", $scope.offerReq, 0);
                $scope.myPromise.then(function (results) {
                    debugger;
                    $scope.offerDet = results.offerDetails;
                    $scope.sic.offerId = results.offerId;
     	            $scope.couponcode = results.offerCode;
     	            $scope.bgDate=results.beginDate;
     	            $scope.beginDate = $filter('date')($scope.bgDate, "MM/dd/yyyy");
     	            $scope.edDate=results.endDate;
     	            $scope.endDate = $filter('date')($scope.edDate, "MM/dd/yyyy");
                    $scope.saveBusy = false;
                });
        }
        
        
        $scope.$watch('offSel', function() {
        	debugger;
        	$scope.offerReq = { "offerId": $scope.offSel };  	     	
        	$scope.busymsg = "Getting offers.. Please Wait.."
                $scope.saveBusy = true;
        		console.log($scope.offerReq);
                $scope.myPromise = genericService.genericFunction("POST", "web/campaign/viewOfferDetails", $scope.offerReq, 0);
                $scope.myPromise.then(function (results) {
                   debugger;
                   $scope.offerDet = results.offerDetails;
 		           $scope.sic.offerId = results.offerDetails.offerId;
 		           $scope.couponcode = results.offerDetails.offerCode;
 		           $scope.bgDate=results.offerDetails.beginDate;
 		           $scope.beginDate = $filter('date')($scope.bgDate, "MM/dd/yyyy");
 		           $scope.edDate=results.offerDetails.endDate;
 		           $scope.endDate = $filter('date')($scope.edDate, "MM/dd/yyyy");
 		           $scope.offerLevel = results.offerDetails.offerLevel;
 		           $scope.saveBusy = false;
                });
         });
        
        
     // filter- gets the criteria and sets the format of filter
        $scope.getCriteria = function(item) {	    	 
	    	 var lmn =_.find($scope.map,{buseinessTerm:item , contextId:"3"});
	    	 debugger;
	    	 $scope.filterObj={};
	    	 $scope.filterObj.businessTermId=lmn.buseinessTermId;
	    	 $scope.bId=lmn.buseinessTermId;
	    	 $scope.crit=lmn.criteriaSet;   	
	    	 $scope.retrivalFormat=lmn.retrivalFormat;
	    	 
	    	 if($scope.retrivalFormat=='SET'){
	    		 $scope.valueSet=lmn.valueSet; 
	    	 }
	    	 else if($scope.retrivalFormat=='API'){
	    		 $scope.valueApi=lmn.valueApi;
	    	 }
	     };
	     
	     // filter- gets the criteria selected and filters the id accordingly
	     $scope.getCriteriaId = function(item){
	    	 var xyz=_.find($scope.crit,{value:item});
	    	 $scope.filterObj.criterionId=xyz.key;
	    	 $scope.cId=xyz.key;
	     }
	     
	     // filter- gets the format and returns with the value set
	     $scope.getValueId = function(val){
	    	 
	    	 if($scope.retrivalFormat=='SET'){
	    		 var xyz=_.find($scope.valueSet,{value:val});
		    	 $scope.filterObj.value=xyz.key;
	    	 }
	    	 
	    	 else if($scope.retrivalFormat=='API'){
	    		 var xyz=_.find($scope.valueSet,{value:val});
		    	 $scope.filterObj.value=xyz.key;
	    	 }    	 
	     }
	     
	  // filter- if the retrieval format is API 
	     $scope.callApi = function(item){
	    	 if($scope.retrivalFormat=='API'){
	    		 
	    		// parse the valueApi to get upto the reqd position 
	    		var newStr=$scope.valueApi.split("/");
	    		var newStrLeng = newStr.length;
	    		if(newStrLeng==4){
	    			$scope.api=newStr[0]+'/'+newStr[1];
	    		}
	    		
	    		// gets filtered value and binds it to the view
	    		$scope.myValuePromise = getConsumerFilterValues.getFilterValue($scope.api,$scope.bId,item);
	    	       $scope.myValuePromise.then(function (results) {
	    	           $scope.valueSet = results.values;
	    	       });
	    	 }
	     }     	        
        
	    // filter queries are made into a tag 
        $scope.createTag = function(businessTerm,criteria,value) {
	    	 
	    	 if($scope.retrivalFormat=='PROVIDED'){
	    		 $scope.filterObj.value=value;
	    	 }
	    	 
	    	 $scope.queryTag=businessTerm+' '+criteria+' '+value;
	    	 $scope.tagList.push($scope.queryTag);
	    	
	    	 $scope.filterData.push($scope.filterObj);
	    	 $scope.filterReq={filterItems:$scope.filterData};
	    	 $scope.doFilter();
	    	 	    	  
	    	 // ng-model values cleared for next query
	    	 delete $scope.ipbterm;
	    	 delete $scope.ipcriteria;
	    	 delete $scope.ipvalue;
	    	 delete $scope.filterObj;
	    	 delete $scope.valueSet;
	    	 delete $scope.crit;
	    	 delete $scope.retrivalFormat;
	     };
	     
	     // removes tag and re-filters the list accordingly 
	     $scope.removeTag = function(tag) {
	            $scope.tagList.splice($scope.tagList.indexOf(tag), 1);
	            $scope.filterData.splice($scope.filterData.indexOf(tag),1);	            
	            $scope.filterReq={filterItems:$scope.filterData}
	            
	            $scope.doFilter();
	     };
	     
	     $scope.doFilter = function () {
	    	 $scope.busymsg = "Getting consumers.. Please Wait.."
	                $scope.saveBusy = true;
	                $scope.myPromise = genericService.genericFunction("POST", "web/report/getConsumerSegmentReport", $scope.filterReq, 0);
	                $scope.myPromise.then(function (results) {
	                    debugger;
	                    $scope.filterChart = results;
	                    console.log(results);
			            $scope.pieData = results.badgeBreakupList;
			            $scope.dataHor = results.storeBreakupList;
			            $scope.tableData = results.activityTagBreakupList;
	                    $scope.saveBusy = false;
	                });
	     }	     
	     $scope.doFilter();
	     
	     $scope.getSMSTemplates = function () {
	    	 $scope.busymsg = "Getting templates.. Please Wait.."
	                $scope.saveBusy = true;
	                $scope.myPromise = genericService.genericFunction("GET", "web/campaign/getSmsTemplates", 0, 0);
	                $scope.myPromise.then(function (results) {
	                    debugger;
	                    console.log(results);
	                    $scope.userdataGet = results;
	       		     	$scope.smsData =results.templates;
	                    $scope.saveBusy = false;
	                });
	     }
	     $scope.getSMSTemplates();
	     
	     $scope.setMsg=function(index){
		    	var pqr=_.find($scope.smsData,{templateName:index});
		    	$scope.bind=pqr;
		    	$scope.dis=pqr.id;
		    	$scope.sic.smsTemplateId=pqr.id;
			}
	     
	     
	     $scope.getAppTemplates = function () {
	    	 $scope.busymsg = "Getting templates.. Please Wait.."
	                $scope.saveBusy = true;
	                $scope.myPromise = genericService.genericFunction("GET", "web/campaign/getInAppTemplates", 0, 0);
	                $scope.myPromise.then(function (results) {
	                    debugger;
	                    $scope.appTemp = results.inAppTemplates;
	                    $scope.saveBusy = false;
	                });
	     }
	     $scope.getAppTemplates();
	     
	     $scope.setApp=function(index){
		    	var pqr=_.find($scope.appTemp,{templateName:index});
		    	$scope.appBind=pqr;
		    	$scope.appdis=pqr.id;
		    	$scope.sic.inappTemplateId=pqr.id;
		};
		
		$scope.getStores = function () {
	    	 $scope.busymsg = "Getting stores.. Please Wait.."
	                $scope.saveBusy = true;
	                $scope.myPromise = genericService.genericFunction("POST", "web/setup/getStoreNames", $scope.businessId, 0);
	                $scope.myPromise.then(function (results) {
	                    debugger;
	                    console.log(results);
	        	        $scope.dd_storeNames = results;
	        	        $scope.selectStore = results.storesList;
	                    $scope.saveBusy = false;
	                });
	     }		
		 $scope.getStores();
		
		 $scope.loadTags = function(query) {
	    	   var tags=$scope.selectStore;
	    	   return tags;
	   	  };
	     
	   	  
	   	  $scope.getSmsFlag = function () {
	   		  debugger;
	   		  var smn = $scope.flagSms;
	   	  }
	   	  $scope.getAppFlag = function () {
	   		  debugger;
	   		  var smn = $scope.flagApp;
	   		  console.log(smn);
	   	  }
	   	  
	   	$scope.publishCampaign = function (sic) {
	   		 $scope.sic.businessAccountId = authService.authentication.businessAccountId;
	    	 $scope.sic.campaignSchedule.dateFormat = "MM/DD/YYYY";
	    	 $scope.sic.campaignSchedule.campaignStartDate = $filter('date')(new Date($scope.campaignStartDate), 'MM/dd/yyyy');
	    	 $scope.sic.campaignSchedule.campaignEndDate = $filter('date')(new Date($scope.campaignEndDate), 'MM/dd/yyyy');
	    	 $scope.sic.campaignSchedule.notificationStartDate = $filter('date')(new Date($scope.notificationStartDate), 'MM/dd/yyyy');
	    	 if($scope.flagSms==true && $scope.flagApp==true)
		     { 
		    	 $scope.sic.listOfChannels=[1,2];			    	 
		     }
		     else if($scope.flagSms==true)
		     {
		    	 $scope.sic.listOfChannels=[1];
		     }
		     else if($scope.flagApp==true)
		     {
		    	 $scope.sic.listOfChannels=[2];
		     }
	    	 if($scope.flagSms==true && sic.smsTemplateId==1){
	    		 $scope.sic.smsMessage = $scope.bind.prefixText1 + $scope.smsMsgBody; 
	    	 }
	    	 else if($scope.flagSms==true && sic.smsTemplateId==2){
	    		 $scope.sic.smsMessage = $scope.bind.prefixText1 + $scope.smsMsgBody + "." +$scope.bind.postfixText1 + ":" + $scope.couponcode;
	    	 }
	    	 else if($scope.flagSms==true && sic.smsTemplateId==3){
	    		 $scope.sic.smsMessage = $scope.bind.prefixText1 + $scope.smsMsgBody + "." +$scope.bind.postfixText1 + ":" + $scope.couponcode + "," + $scope.bind.postfixText2 + ":" + $scope.sic.campaignSchedule.campaignEndDate ;
	    	 }
	    	 if(sic.campaignSchedule.isSingleBurst=="Y"){
	    		 $scope.sic.campaignSchedule.repeatIntervalInDays=0;
	    	 }
	    	 if($scope.flagApp==true){
	    		 $scope.sic.inappMessage = $scope.appBind.prefixText1 + $scope.appMsgBody + "." + $scope.appBind.postfixText1 + ":" + $scope.couponcode + "," + $scope.appBind.postfixText2 + ":" + $scope.sic.campaignSchedule.campaignEndDate;
	    	 }	 
	    	 $scope.sic.filter = $scope.filterReq;
	    	 $scope.sic.customerCount = $scope.filterChart.filteredCount;
	    	 
	    	 ////////////////////////////////////
	    	 $scope.sic.campaignDistribution["badgeDistribution"]= $scope.pieData;
	    	 $scope.sic.campaignDistribution["tagDistribution"]= $scope.tableData;
	    	 $scope.sic.campaignDistribution = JSON.stringify($scope.sic.campaignDistribution);
	    	 ////////////////////////////////////
	    	 $scope.sic.storeList=_.map($scope.tags,'storeId');
	    	 debugger;
	    	 if($scope.sic.granularity=='business')
	    	 {
	    		 delete $scope.sic.storeList;
	    	 }
	    	 if($scope.sic.granularity==undefined || $scope.sic.granularity==""){
	    		 $scope.sic.granularity="business";
	    	 }
	    	 ////////////////////////////////////
	    	 console.log(sic);
	    	 $scope.myPromise = genericService.genericFunction("POST", "web/campaign/publishCampaign", sic, 0);
	    	 	$scope.myPromise.then(function (results) {
		            $scope.pub = results;
		            console.log(results);
		            if(results.apiSuccessStatus==false)
		            {
		            	$scope.oops=true;
		            }
		            else if(results.apiSuccessStatus==true)
		            {
		            	$scope.voila=true;
		            }
		        });
	    	 debugger;
	     };
	     
	     $scope.alertPop = function () {
 	 		$location.path("/campaign");
 	 	 }
	    
    }
    catch (e) { }
}]);