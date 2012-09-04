<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<openmrs:htmlInclude file="/moduleResources/patientregistration/patientregistration.css" />
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<!-- JQUERY FOR THIS PAGE -->
<script type="text/javascript">

	$j(document).ready(function(){				

	//$j("#checkmark-yellow").hide();
	
	function getChildAddresses(addressField){
		var addressArray = new Array();
		console.log("search for children of: " + addressField);		
		$j.ajax({
			type: 'POST',
			url: '${pageContext.request.contextPath}/module/addresshierarchy/ajax/getChildAddressHierarchyEntries.form',
			dataType: 'json',
			async: false,
			data: { 'searchString': addressField },
			success: function(addresses) {									
				// now add a new row for each patient
				$j.each(addresses, function(i,address) {
					addressArray.push(address.name);	
					console.log(address.name);					
				});	
			}
		});	
		return addressArray;
	}
	
		// set focus to first input field
		$j('input:first').focus();
		
		var addressSearchTimer = null;
		// handle the real-time patient search
		$j('#searchString').keyup(function() {
			if(addressSearchTimer){
				clearTimeout(addressSearchTimer);
			}
			var string = $j('#searchString').val();
			
			addressSearchTimer = setTimeout(function(){ 
				$j.ajax({
				type: 'POST',
				url: '${pageContext.request.contextPath}/module/addresshierarchy/ajax/getPossibleFullAddresses.form',
				dataType: 'json',
				data: { 'searchString': string, 'separator' : ',' },
				success: function(addresses) {
					
					// remove the existing rows
					$j('.addressRow').remove();
	
					
					// now add a new row for each patient
					$j.each(addresses, function(i,address) {
		
						// create the row element itself
						var row = $j(document.createElement('tr')).addClass('addressRow');						
						
						if (i % 2 == 0) { 
							row.addClass('evenRow');
						} else {
							row.addClass('oddRow');
						}
						row.mouseover(function(){
							$j(this).addClass('highlighted');
						});

						row.mouseout(function(){
							$j(this).removeClass('highlighted');
						});

						row.click(function(){
							$j('[name=searchString]').val(address.address);
						});
						//var reverseAddress = reverseDelimiterList(address.address, ',');
						var reverseAddress = address.address;
						// now add all the cells to the row
						row.append($j(document.createElement('td')).text(reverseAddress));
	
						$j('#address').append(row);
					});	
				}
			});}, 1000);
		});
		
		var addressFieldTimer=null;
		$j('#addressField').keyup(function(event) {
			if(addressFieldTimer){
				clearTimeout(addressFieldTimer);
			}
			var addressFieldValue = $j('#addressField').val();
			addressFieldTimer = setTimeout(function() {
				console.log("addressFieldValue=" + addressFieldValue);
				$j.ajax({
					type: 'POST',
					url: '${pageContext.request.contextPath}/module/addresshierarchy/ajax/getPossibleAddressHierarchyEntries.form',
					dataType: 'json',
					data: { 'searchString': addressFieldValue,  
							'addressField': 'address1'},
					success: function(addresses) {
						
						// remove the existing rows
						$j('.addressFieldRow').remove();
		
						
						// now add a new row for each patient
						$j.each(addresses, function(i,address) {
			
							// create the row element itself
							var row = $j(document.createElement('tr')).addClass('addressFieldRow');						
							
							if (i % 2 == 0) { 
								row.addClass('evenRow');
							} else {
								row.addClass('oddRow');
							}
							row.mouseover(function(){
								$j(this).addClass('highlighted');
							});

							row.mouseout(function(){
								$j(this).removeClass('highlighted');
							});

							row.click(function(){
								$j('[name=addressField]').val(address.name);
							});
							
							// now add all the cells to the row
							row.append($j(document.createElement('td')).text(address.name));
		
							$j('#addressFieldTable').append(row);
						});	
					}
				});
				
			}, 1000);
		});
		
		var entryNameFieldTimer=null;
		$j('#entryNameField').keyup(function(event) {
			if(entryNameFieldTimer){
				clearTimeout(entryNameFieldTimer);
			}
			var entryNameFieldValue = $j('#entryNameField').val();
			entryNameFieldTimer = setTimeout(function() {
				console.log("entryNameFieldValue=" + entryNameFieldValue);
				$j.ajax({
					type: 'POST',
					url: '${pageContext.request.contextPath}/module/addresshierarchy/ajax/getPossibleFullAddressesForAddressHierarchyEntry.form',
					dataType: 'json',
					data: { 'entryName': entryNameFieldValue,  
							'addressField': 'address1'},
					success: function(addresses) {
						
						// remove the existing rows
						$j('.entryNameFieldRow').remove();								
						// now add a new row for each patient
						$j.each(addresses, function(i,address) {
			
							// create the row element itself
							var row = $j(document.createElement('tr')).addClass('entryNameFieldRow');						
							
							if (i % 2 == 0) { 
								row.addClass('evenRow');
							} else {
								row.addClass('oddRow');
							}
							row.mouseover(function(){
								$j(this).addClass('highlighted');
							});

							row.mouseout(function(){
								$j(this).removeClass('highlighted');
							});

							row.click(function(){
								$j('[name=entryNameField]').val(address.address);
							});
							
							// now add all the cells to the row
							row.append($j(document.createElement('td')).text(address.address));
		
							$j('#entryNameFieldTable').append(row);
						});	
					}
				});
				
			}, 1000);
		});

		
		// handle the real-time patient search
		$j('#levelString').keyup(function() {
			
			var string = $j('#levelString').val();
			
			$j.ajax({
				type: 'POST',
				url: '${pageContext.request.contextPath}/module/addresshierarchy/ajax/getChildAddressHierarchyEntries.form',
				dataType: 'json',
				data: { 'searchString': string },
				success: function(addresses) {
					
					// remove the existing rows
					$j('.addressRow').remove();
	
					
					// now add a new row for each patient
					$j.each(addresses, function(i,address) {
		
						// create the row element itself
						var row = $j(document.createElement('tr')).addClass('addressRow');						
						
						if (i % 2 == 0) { 
							row.addClass('evenRow');
						} else {
							row.addClass('oddRow');
						}
						row.mouseover(function(){
							$j(this).addClass('highlighted');
						});

						row.mouseout(function(){
							$j(this).removeClass('highlighted');
						});

						row.click(function(){
							$j('[name=searchString]').val(address.name);
						});
						
						// now add all the cells to the row
						row.append($j(document.createElement('td')).text(address.name));
	
						$j('#addressLevel').append(row);
					});	
				}
			});
		});
		
		$j('#addressSearchButton').click(function(event) {			
			var addressElements = new Array();
			addressElements = getChildAddresses($j('#addressInputName').val());
			var returnedElements='';
			for (var i=0; i<addressElements.length; i++){
				returnedElements = returnedElements + ', ' + addressElements[i];
			}
			$j('#returnAddress').val(returnedElements);			
		});
		
		//$j("input[name^='rdio']:nth-child(2)").attr("checked", "checked");
		$j('#rdio1').attr('checked', 'checked');
		
		$j("input[name^='rdio']").change(function(){
			if ($j("input[name^='rdio']:checked").val() == 'M'){
				console.log("M radio button has been checked");
			}else{
				console.log("F radio button has been checked");
			}
		});
		
		 //$j('#dialog').jqm();
		 //$j('#ex2').jqm({ajax: '2.html', trigger: 'a.ex2trigger'});
			
	});
	
</script>
	
<!-- SPECIALIZED STYLES FOR THIS PAGE -->
<style type="text/css">
	#addPatient {display:none;}
	
	
}
</style>
	
<div id="content"">
<table>	
	<tr>
		<td>
			<form id="patientSearch" method="post">	
				<table>	
					<tr>
						<td>							
							Full Address Search:
							<br/><br/>	
						</td>	
					</tr>
					<tr>
						<td>							
							<input id="searchString" name="searchString" size="45">
							<br/><br/>	
						</td>	
					</tr>	
					<tr>
						<td>
							<table id="address">			
							</table>	
						</td>
					</tr>	
				</table>	
			</form>			
		</td>
		<td>
			<form id="levelSearch" method="post">	
				<table>	
					<tr>
						<td>							
							Get child addresses
							<br/><br/>	
						</td>	
					</tr>	
					<tr>
						<td>							
							<input id="levelString" name="searchString" size="45">
							<br/><br/>	
						</td>	
					</tr>	
					<tr>
						<td>
							<table id="addressLevel">			
							</table>	
						</td>
					</tr>	
				</table>	
			</form>			
		</td>
		<td>
			<input id="addressInputName" name="addressInputName" style="width:200px; height:30px"/>
			<button type="button" id="addressSearchButton" name="addressSearchButton">Search</button><br><br>
			<input id="returnAddress" name="returnAddress" style="width:400px; height:30px"/>
		</td>
	</tr>	
	<tr>
		<td>
			Gason: <input type="radio" name="rdio" id="rdio1" value="M" /><br>
			    Fi:<input type="radio" name="rdio" id="rdio2" value="F" /><br>
		</td>
	</tr>
	
	<tr>
		<hr/><br/>
		<td>
			<table>	
				<tr>
					<td>
						<hr/><br/>
					</td>
				</tr>
				<tr>
					<td>							
						getPossibleAddressHierarchyEntries:
						<br/><br/>	
					</td>	
				</tr>	
				<tr>
					<td>							
						<input id="addressField" name="addressField" size="45">
						<br/><br/>	
					</td>	
				</tr>	
				<tr>
					<td>
						<table id="addressFieldTable">			
						</table>	
					</td>
				</tr>	
			</table>	
		</td>
		<td>
			<table>	
				<tr>
					<td>
						<hr/><br/>
					</td>
				</tr>
				<tr>
					<td>							
						getPossibleFullAddressesForAddressHierarchyEntry:
						<br/><br/>	
					</td>	
				</tr>	
				<tr>
					<td>							
						<input id="entryNameField" name="entryNameField" size="45">
						<br/><br/>	
					</td>	
				</tr>	
				<tr>
					<td>
						<table id="entryNameFieldTable">			
						</table>	
					</td>
				</tr>	
			</table>	
		</td>
	</tr>
	<tr>
		
		<td>
			<button id="checkmark-yellow" name="checkmark-yellow" class="checkmark-yellow" style="display:none; background : url('${pageContext.request.contextPath}/moduleResources/patientregistration/images/checkmark-yellow.png');"></button>		
		</td>
	</tr>
</table>	
	<br/><br/>
	
</div>


<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>