
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

    // Information to reconstruct
    order_of_shapes: shape_abreviations,
    order_as_presented: permuted_abreviations,


    // Shapes guessed
    guesses: [],

    // Participant demo info
    about: "",
   	comment: "",
	age: "",
	gender: "",


	// Bootstrap testing function
	pre_test_slide: function() {
		if (window.self == window.top | turk.workerId.length > 0) {
			var initial_questions = "Please answer these yes or no questions: <br><br>";
			for (var i = 0; i < questions.length; i++) {
				var perm_index = permutations[i];
				var html_of_this_q = questions[perm_index];
				html_of_this_q += "<div class='btn-group' data-toggle='buttons-checkbox' id=" + pretest_bootstrap[i] + ">";
		        html_of_this_q += "<button type='button' class='btn' data-value='0' onclick ='experiment.boostrap_pre_button_select(\"pretest_" + String(i) +"\", 0, " + String(i) +  ")'>Yes</button>";
		        html_of_this_q += "<button type='button' class='btn' data-value='1' onclick ='experiment.boostrap_pre_button_select(\"pretest_" + String(i) +"\", 1,  " + String(i) +  ")'>No</button>";
		        html_of_this_q += "</div> <br>";
				initial_questions += html_of_this_q;
			};
			$("#pre_test_questions").html(initial_questions);
			showSlide("pre_test");	
		}
	},


	training_slide: function() {
		var training_html = "";

		if (training_regime < 2) {
			training_html += "<br> We're going to learn about all the shapes you just "; 
			training_html += "answered questions about. <br> Here are examples from each of the ";
			training_html += "categories. Take a close look. <br> After you're done, you will be tested again on your knowledge. <br><br>";
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
			training_html += "<br> A teacher is going to give you some facts: <br><br>";
			training_html += '<table align="center">';
			for (i = 0; i < teacher_facts.length; i++) {
				training_html += '<tr><td> Fact #  ' + String(i) + ' </td>';
				training_html += '<td> ' + teacher_facts[i] + '</td>';
				training_html += '</tr>';
			}
			training_html += '</table>'
		}

		// This training regime uses the CSS functionality of highlighting specific images to point out
		// elements of a class of shapes.
		if (training_regime == 3) {
			training_html += "<br>We're going to learn about what a " + singular_shapes[shape_of_focus] +  " is. Click on three of the shapes below to learn whether each one is a " + singular_shapes[shape_of_focus] +  " or not. ";
			training_html +=  "If it's a " + singular_shapes[shape_of_focus] +  ", it'll turn green when you click it. If it isn't, it'll turn red. Choose carefully so that you can learn as much as you can about " + shapes[shape_of_focus] +  ". After you're done, you will be tested again on your knowledge. <br><br>";
			training_html += '<table align="center">';
			for (i = 0; i < 4; i++) {
				training_html += '<tr>';
				for (j = 0; j < 3; j++) {
					training_html += '<td><img width=64px height=64px class="unchosen objTable" id="tdchoice' + String(i) + '_' + String(j) + '"  onclick="experiment.guess_this_shape(' + String(i) + ',' + String(j) + ')" src=shapes/' + all_shapes[i][j] + '></td>';
				}
				training_html += '</tr>';
			}
			training_html += '</table>'
		}


		if (training_regime == 4) {
			experiment.highlight_boxes();
			training_html +=  "We're going to learn about what a " + singular_shapes[shape_of_focus] +  " is. <br>";
			training_html +=  "On the basis of your responses, a teacher has chosen three examples to show you what " + shapes[shape_of_focus] +  " are."; 
			training_html +=  " Click on the three shapes with the boxes around them to learn whether each one is a "+ singular_shapes[shape_of_focus] + " or not. ";
			training_html += "If it's a "+ singular_shapes[shape_of_focus] + ", it'll turn green when you click it. <br>";
			training_html +=  " After you're done, you will be tested again on your knowledge.";
			training_html += '<table align="center">';
			for (i = 0; i < 4; i++) {
				training_html += '<tr>';
				for (j = 0; j < 3; j++) {
					training_html += '<td><img width=64px height=64px class="unchosen objTable" id="tdchoice' + String(i) + '_' + String(j) + '"  onclick="experiment.select_highlighted_shape(' + String(i) + ',' + String(j) + ')" src=shapes/' + all_shapes[i][j] + '></td>';
				}
				training_html += '</tr>';
			}
			training_html += '</table>'
		}


		$("#training_examples").html(training_html);
		showSlide("training");	
	},




	post_test_slide: function() {
		var post_questions = "Please answer these yes or no questions: <br><br>";
		for (var i = 0; i < questions.length; i++) {
			var perm_index = permutations[i];
			var html_of_this_q = questions[perm_index];
			html_of_this_q += "<div class='btn-group' data-toggle='buttons-checkbox' id=" + posttest_bootstrap[i] + ">";
	        html_of_this_q += "<button type='button' class='btn' data-value='0' onclick ='experiment.boostrap_post_button_select(\"posttest_" + String(i) +"\", 0, " + String(i) +  ")'>Yes</button>";
	        html_of_this_q += "<button type='button' class='btn' data-value='1' onclick ='experiment.boostrap_post_button_select(\"posttest_" + String(i) +"\", 1,  " + String(i) +  ")'>No</button>";
	        html_of_this_q += "</div> <br>";
			post_questions += html_of_this_q;
		};
		$("#post_test_questions").html(post_questions);
		showSlide("post_test");	
	},


	final_slide: function() {
		showSlide("final_questions");	
	},


	// Managing the bootstrap buttons
	boostrap_pre_button_select: function(group_id, button_val, i) {
		// De-activating all of the buttons but the selected one
		var referent = "#" + group_id + " button";
		$(referent).removeClass("active");
    	var this_index = permutations.indexOf(i);
    	experiment.pretest_responses_by_presented_order[i] = button_val;
    	experiment.pretest_responses[this_index] = button_val;
	},



	// Managing the bootstrap buttons
	boostrap_post_button_select: function(group_id, button_val, i) {
		// De-activating all of the buttons but the selected one
		var referent = "#" + group_id + " button";
		$(referent).removeClass("active");
    	var this_index = permutations.indexOf(i);
    	experiment.posttest_responses_by_presented_order[i] = button_val;
    	experiment.posttest_responses[this_index] = button_val;
	},


	// Functions for dynamic interaction with the participant:
	//$("#tdchoice" + String(c)).removeClass('unchosen').addClass('chosen')
	select_shape: function(i, j) {
		for (var ii=0; ii<all_shapes.length; ii++) {
			for (var jj = 0; jj<all_shapes[0].length; jj++) {
				$("#tdchoice" + String(ii) + '_' + String(jj)).removeClass('chosen').addClass('unchosen');
			}
		}
		$("#tdchoice" + String(i) + '_' + String(j)).removeClass('unchosen').addClass('chosen');
	},

	// For the case of active and passive teaching
	guess_this_shape: function(i, j) {
		if (examples_clicked < 3) {
			if ($("#tdchoice" + String(i) + '_' + String(j)).attr("class") == "unchosen objTable") {
				if (isShape[shape_of_focus][i] == 0) {
					$("#tdchoice" + String(i) + '_' + String(j)).removeClass('unchosen').addClass('chosen');
				} else {
					$("#tdchoice" + String(i) + '_' + String(j)).removeClass('unchosen').addClass('chosenCorrect');
				}
				examples_clicked = examples_clicked + 1;
				guessed_shapes.push([i, j]);
			};
		};
	},


	highlight_boxes: function() {
		var in_highlighted = 0;
		for (i = 0; i < all_shapes.length; i++) {
			for (j = 0; j < all_shapes[0].length; j++) {
				for (ii = 0; ii <highlighted_boxes.length; ii++) {
					if (highlighted_boxes[ii][0] == i && highlighted_boxes[ii][1] == j) {
						$("#tdchoice" + String(i) + '_' + String(j)).addClass('highlighted');
					}
				}
			}
		}

		
	},

	select_highlighted_shape: function(i, j) {
		var in_highlighted = 0;
		for (ii = 0; ii <highlighted_boxes.length; ii++) {
			if (highlighted_boxes[ii][0] == i && highlighted_boxes[ii][1] == j) {
				in_highlighted = 1;
			}
		}
		if (examples_clicked < 3 && in_highlighted == 1) {
			if ($("#tdchoice" + String(i) + '_' + String(j)).attr("class") == "unchosen objTable highlighted") {
				if (isShape[shape_of_focus][i] == 0) {
					$("#tdchoice" + String(i) + '_' + String(j)).removeClass('highlighted').addClass('chosenCorrect');
					examples_clicked = examples_clicked + 1;
					guessed_shapes.push([i, j]);
				};
			};
		};
	},


	// Tests if the answers to the pretest were provided fully
	first_test_check: function() {
		var one_missing = 0;
		for (var i = 0; i < questions.length; i++) {
			answer_to_i = experiment.pretest_responses[i];
	    	if (answer_to_i == -1) {
	    		one_missing = 1;
	    	}
		};
    	if (one_missing == 1 && skip_check == 0) {
    		var answer_all_message = '<font color="red">Please answer all the questions.</font>';
    		$("#pre_test_check").html(answer_all_message);
    	} else {
    		experiment.training_slide();
    	};
	},


	training_test_check: function() {
		if ((training_regime == 3 || training_regime == 4)  && examples_clicked < 3) {
			var click_on_three = '<font color="red">Please click on three shapes.</font>';
			$("#training_check").html(click_on_three)
		} else {
			experiment.post_test_slide();
		};	
	},

	// Tests if the answers to the posttest were provided fully
	second_test_check: function() {
		var one_missing = 0;
		for (var i = 0; i < questions.length; i++) {
			answer_to_i = experiment.posttest_responses[i];
	    	if (answer_to_i == -1) {
	    		one_missing = 1;
	    	}
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

		    experiment.guesses = guessed_shapes;

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