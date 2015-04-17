
// ---------------- 3. CONTROL FLOW ------------------
// This .js file determines the flow of the variable elements in the experiment as dictated 
// by the various calls from pragmods html.

/*
Here the images used in the experiment are loaded in two arrays.
The first is base_image_pl, which stores the "underlying" or base images
which will then be modified with props stored in the props_image_pl Array.

NOTE: Unfortunately the number of variations for each type of object is hardoded.
To make the code more usable it will be necessary to 
*/







showSlide("instructions");

// The main experiment:
//		The variable/object 'experiment' has two distinct but interrelated components:
//		1) It collects the variables that will be delivered to Turk at the end of the experiment
//		2) It hall all the functions that change the visual aspect of the experiment such as showing images, etc.

var experiment = {
    // These variables are the ones that will be sent to Turk at the end.
    // The first batch, however, is set determined by the experiment conditions
    // and therefore should not be affected by the decisions made by the experimental subject.


    // Order of questions
    permutations_used: permutations,

    // Pre-test answers
    pretest_responses: pretest_answers,
    pretest_responses_by_presented_order: pretest_answers_by_order,

    // Post-test answers
    posttest_responses: posttest_answers,
    posttest_responses_by_presented_order: posttest_answers_by_order,


    // Participant demo info
    about: "",
   	comment: "",
	age: "",
	gender: "",


    // And here are the functions that dynamically create javascript content for the website 
	pre_test_slide: function() {
		if (window.self == window.top | turk.workerId.length > 0) {
			var initial_questions = "";
			for (var i = 0; i < questions.length; i++) {
				var perm_index = permutations[i];
				var html_of_this_q = questions[perm_index];
				html_of_this_q += "<input type='radio' id='q0_" + String(perm_index) + "_yes' name='q0_" + String(perm_index) +"' value='0'> yes";
				html_of_this_q += "<input type='radio' id='q0_" + String(perm_index) + "_no' name='q0_" + String(perm_index) +"' value='1'> no";
				html_of_this_q += "<br>";
				initial_questions += html_of_this_q;
			};
			$("#pre_test_questions").html(initial_questions);
			showSlide("pre_test");	
		}
	},




	training_slide: function() {
		var training_html = "";

		if (training_regime < 2) {
			training_html += "<br> Take a look at these examples: <br>" 
			training_html += '<table align="center">';
			for (i = 0; i < 4; i++) {
				training_html += '<tr><td>' + shapes[i] + '</td>';
				for (j = 0; j < 2; j++) {
					training_html += '<td><img width=64px height=64px src=shapes/' + example_list[i][j] + '></td>';
				}
				training_html += '</tr>';
			}
			training_html += '</table>'
		}

		if (training_regime == 2) {
			training_html += "<br> A teacher is going to give you some facts: <br><br>" 
			training_html += '<table align="center">';
			for (i = 0; i < teacher_facts.length; i++) {
				training_html += '<tr><td> Fact # ' + String(i) + '</td>';
				training_html += '<td>' + teacher_facts[i] + '</td>';
				training_html += '</tr>';
			}
			training_html += '</table>'
			
		}

		$("#training_examples").html(training_html);
		showSlide("training");	
	},




	post_test_slide: function() {
		var after_training_questions = "";
		for (var i = 0; i < questions.length; i++) {
			var perm_index = permutations[i];
			var html_of_this_q = questions[perm_index];
			html_of_this_q += "<input type='radio' id='q1_" + String(perm_index) + "_yes' name='q1_" + String(perm_index) +"' value='0'> yes";
			html_of_this_q += "<input type='radio' id='q1_" + String(perm_index) + "_no' name='q1_" + String(perm_index) +"' value='1'> no";
			html_of_this_q += "<br>";
			after_training_questions += html_of_this_q;
		};
		$("#post_test_questions").html(after_training_questions);
		showSlide("post_test");	
	},

	final_slide: function() {
		showSlide("final_questions");	
	},



	// Tests if the answers to the pretest were provided fully
	first_test_check: function() {
		one_missing = 0;
		for (var i = 0; i < questions.length; i++) {
			var listOfNameRadios = pretest_radials[i];
	    	var answer_to_i = getNameRadioValue(listOfNameRadios);
	    	if (answer_to_i == -1) {
	    		one_missing = 1;
	    	}
	    	this_index = permutations.indexOf(i);
	    	experiment.pretest_responses[i] = answer_to_i;
	    	experiment.pretest_responses_by_presented_order[this_index] = answer_to_i;
		};
    	if (one_missing == 1 && skip_check == 0) {
    		var answer_all_message = '<font color="red">Please answer all the questions.</font>';
    		$("#pre_test_check").html(answer_all_message);
    	} else {
    		experiment.training_slide();
    	};
	},

	// Tests if the answers to the posttest were provided fully
	second_test_check: function() {
		one_missing = 0;
		for (var i = 0; i < questions.length; i++) {
			var listOfNameRadios = posttest_radials[i];
	    	var answer_to_i = getNameRadioValue(listOfNameRadios);
	    	if (answer_to_i == -1) {
	    		one_missing = 1;
	    	}
	    	this_index = permutations.indexOf(i);
	    	experiment.posttest_responses[i] = answer_to_i;
	    	experiment.posttest_responses_by_presented_order[this_index] = answer_to_i;
		};
    	if (one_missing == 1 && skip_check == 0) {
    		var answer_all_message = '<font color="red">Please answer all the questions.</font>';
    		$("#post_test_check").html(answer_all_message);
    	} else {
    		experiment.final_slide();
    	};
	},


   // FINISHED BUTTON CHECKS EVERYTHING AND THEN ENDS
    check_finished: function() {
		if (document.getElementById('about').value.length < 1) {
		    $("#checkMessage").html('<font color="red">' + 
				       'Please make sure you have answered all the questions!' + 
				       '</font>');
		} else {
		    experiment.about = document.getElementById("about").value;
		    experiment.comment = document.getElementById("comments").value;
		    experiment.age = document.getElementById("age").value;
		    experiment.gender = document.getElementById("gender").value;

		    showSlide("finished");

		    // HERE you can performe the needed boolean logic to properly account for the target_filler_sequence possibilities.
		    // In other words, here you can check whether the choice is correct depending on the nature of the trial.


		    experiment.end();
		}
    },

    // END FUNCTION 
    end: function () {
    	showSlide("finished");
    	setTimeout(function () {
		turk.submit(experiment);
        }, 500); 
    }
}