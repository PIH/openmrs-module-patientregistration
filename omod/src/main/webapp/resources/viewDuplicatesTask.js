$j(document).ready(function(){
		
	$j.each(pocDuplicates, function(j, pocDuplicate){
		console.log("patientId=" + pocDuplicate.id + "; " + pocDuplicate.firstName + " " + pocDuplicate.lastName);
		var duplicateRow = $j(document.createElement('tr')).addClass('duplicateRowList').mouseover(function(){
				$j(this).addClass('highlighted');
			}).mouseout(function(){
				$j(this).removeClass('highlighted');
			});
			
			if (j % 2 == 0) { 
				duplicateRow.addClass('alt0');
			} else {
				duplicateRow.addClass('alt1');
			}
			
			duplicateRow.mouseover(function(){
				$j('.duplicateTableList').find('tr').removeClass('highlighted');
				$j(this).removeClass('alt0');
				$j(this).removeClass('alt1');
				$j(this).addClass('highlighted');
			});
			duplicateRow.mouseout(function(){
				$j(this).removeClass('highlighted');
				if (j % 2 == 0) { 
					$j(this).addClass('alt0');
				} else {
					$j(this).addClass('alt1');
				}
			});
			
			var checkPatientColumn = $j(document.createElement('td')).addClass('encounter');
			var checkBoxElement = $j(document.createElement('input'))
			.attr({type: 'checkbox', id: 'patientId'+pocDuplicate.id, value:pocDuplicate.id});
			checkPatientColumn.append(checkBoxElement);
			duplicateRow.append(checkPatientColumn);
			
			var patientIdColumn = $j(document.createElement('td')).addClass('encounter').text(pocDuplicate.id);
			duplicateRow.append(patientIdColumn);
			var firstNameColumn = $j(document.createElement('td')).addClass('encounter').text(pocDuplicate.firstName);
			duplicateRow.append(firstNameColumn);
			var lastNameColumn = $j(document.createElement('td')).addClass('encounter').text(pocDuplicate.lastName);
			duplicateRow.append(lastNameColumn);	
			var genderColumn = $j(document.createElement('td')).addClass('encounter').text(pocDuplicate.gender);
			duplicateRow.append(genderColumn);	
			var birthdateColumn = $j(document.createElement('td')).addClass('encounter').text(pocDuplicate.birthdate);
			duplicateRow.append(birthdateColumn);	
			$j('.duplicateTableList').append(duplicateRow);
	});

	$j("#mergeBtn").click(function(event){
		console.log("mergeBtn clicked");
		var items = $j("input:checked");
		console.log("items.length=" + items.length);
		
		var n = items.length;
		
		console.log(n + " patients are checked!");
		if(n !==2){
			alert("Only 2 patients at a time could be merged");
		}else{
			var p1Id= $j(items[0]).attr('value');
			var p2Id =$j(items[1]).attr('value');
			if(p1Id.length>0 && p2Id.length>0){
				window.open(pageContextAddress + "/admin/patients/mergePatients.form?patientId=" + p1Id + "&patientId=" + p2Id);
			}
		}
	});
	
	$j('#mergeBtn').blur(function() {		
		$j('#mergeBtn').css('border', '0px');
	});
	
	$j('#mergeBtn').mouseover(function() {		
		$j('#mergeBtn').css('border', '5px solid #EFB420');
		$j('#mergeBtn').focus();
	});

});