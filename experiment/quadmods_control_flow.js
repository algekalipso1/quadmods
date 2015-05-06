
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

	// measuring time of training 
	training_time: "",


	// To keep the parameters in the csv file 
	all_answers_provided: all_answers_provided,
	questions_permuted: questions_permuted,
	skip_check: skip_check,
	training_regime: training_regime,
	examples_to_show: examples_to_show,
	shape_of_focus: shape_of_focus,

	// Bootstrap testing function
	pre_test_slide: function() {
		if (window.self == window.top | turk.workerId.length > 0) {
			var initial_questions = "Let's start with some questions. <br> Please answer yes or no on each of the questions: <br><br>";
			initial_questions += '<table align="center">';
			for (var i = 0; i < questions.length; i++) {
				initial_questions += "<tr><td>";
				var perm_index = permutations[i];
				initial_questions += questions[perm_index];
				initial_questions += " &nbsp &nbsp </td><td>";
				initial_questions += "<div class='btn-group' data-toggle='buttons-checkbox' id=" + pretest_bootstrap[i] + ">";
		        initial_questions += "<button type='button' class='btn btn-primary' data-value='0' onclick ='experiment.boostrap_pre_button_select(\"pretest_" + String(i) +"\", 0, " + String(i) +  ")'>Yes</button>";
		        initial_questions += "<button type='button' class='btn btn-danger' data-value='1' onclick ='experiment.boostrap_pre_button_select(\"pretest_" + String(i) +"\", 1,  " + String(i) +  ")'>No</button>";
		        initial_questions += "</div> <br>";
		        initial_questions += "</td></tr>";
			};
			initial_questions += "</table>";
			$("#pre_test_questions").html(initial_questions);
			showSlide("pre_test");	
		}
	},


	training_slide: function() {
		// record start time
		startTime = new Date();
		times.push(startTime);
		var training_html = "";

		if (training_regime < 2) {
			training_html += "<center><br> We're going to learn about all the shapes you just "; 
			training_html += "answered questions about. <br> Here are examples from each of the ";
			training_html += "categories. Take a close look. <br> After you're done, you will be tested again on your knowledge. </center><br><br>";
			training_html += '<table align="center">';
			for (i = 0; i < 4; i++) {
				training_html += '<tr><td>' + shapes[i] + '</td>';
				for (j = 0; j < 2; j++) {
					training_html += '<td><img width=100px height=100px src=shapes/' + example_list[i][j] + '></td>';
				}
				training_html += '</tr>';
			}
			training_html += '</table>'
		}

		if (training_regime == 2) {
			training_html += "<br> <center>A teacher is going to give you some facts: </center> <br><br>";
			training_html += '<table align="center" >';
			for (i = 0; i < teacher_facts.length; i++) {
				training_html += '<tr><td> Fact #  ' + String(i) + ' </td>';
				training_html += '<td> &nbsp &nbsp' + teacher_facts[i] + '</td>';
				training_html += '</tr>';
			}
			training_html += '</table>'
		}

		// This training regime uses the CSS functionality of highlighting specific images to point out
		// elements of a class of shapes.
		if (training_regime == 3) {
			training_html += "<br>We're going to learn about what a <b>" + singular_shapes[shape_of_focus] +  "</b> is. <br>Click on three of the shapes below to learn whether each one is a " + singular_shapes[shape_of_focus] +  " or not. <br>";
			training_html +=  "If it's a <b>" + singular_shapes[shape_of_focus] +  "</b>, it'll turn <font color='blue'>blue</font> when you click it. If it isn't, it'll turn <font color='red'>red</font>. <br>Choose carefully so that you can learn as much as you can about " + shapes[shape_of_focus] +  ". After you're done, you will be tested again on your knowledge. <br><br>";
			training_html += '<table align="center">';
			for (i = 0; i < 4; i++) {
				training_html += '<tr>';
				for (j = 0; j < 3; j++) {
					training_html += '<td><img width=100px height=100px class="unchosen objTable" id="tdchoice' + String(i) + '_' + String(j) + '"  onclick="experiment.guess_this_shape(' + String(i) + ',' + String(j) + ')" src=shapes/' + all_shapes[i][j] + '></td>';
				}
				training_html += '</tr>';
			}
			training_html += '</table>'
		}

		// Passive learning condition
		if (training_regime == 4) {
			training_html +=  "We're going to learn about what a <b>" + singular_shapes[shape_of_focus] +  "</b> is. <br>";
			training_html +=  "On the basis of your responses, a teacher has chosen three examples to show you what <b>" + shapes[shape_of_focus] +  "</b> are. <br>"; 
			training_html +=  " Click on the three shapes with the boxes around them to learn whether each one is a <b>"+ singular_shapes[shape_of_focus] + "</b> or not. <br>";
			training_html += "If it's a <b>"+ singular_shapes[shape_of_focus] + "</b>, it'll turn <font color='blue'>blue</font> when you click it. If it isn't, it'll turn <font color='red'>red</font>.";
			training_html +=  " After you're done, you will be tested again on your knowledge. <br>";
			training_html += '<table align="center">';
			for (i = 0; i < 4; i++) {
				training_html += '<tr>';
				for (j = 0; j < 3; j++) {
					training_html += '<td><img width=100px height=100px class="withoutHover objTable" id="tdchoice' + String(i) + '_' + String(j) + '"  onclick="experiment.select_highlighted_shape(' + String(i) + ',' + String(j) + ')" src=shapes/' + all_shapes[i][j] + '></td>';
				}
				training_html += '</tr>';
			}
			training_html += '</table>'
		}

		// Control layout: Same as in 3 & 4, but no participant action required.
		if (training_regime == 5) {
			training_html +=  "<center> Look at these examples of quadrilaterals. <br> Take your time. After you are done examining this set, <br> you will be tested again on your knowledge. </center><br>";
			training_html += '<table align="center">';
			for (i = 0; i < 4; i++) {
				training_html += '<tr>';
				for (j = 0; j < 3; j++) {
					training_html += '<td><img width=100px height=100px class="withoutHover objTable" id="tdchoice' + String(i) + '_' + String(j) + '" src=shapes/' + all_shapes[i][j] + '></td>';
				}
				training_html += '</tr>';
			}
			training_html += '</table>'
		}

		$("#training_examples").html(training_html);
		showSlide("training");	

		// After instantiation
		if (training_regime == 4) {
			experiment.highlight_boxes();
		}
	},




	post_test_slide: function() {


		endTime = new Date();
		times.push(endTime);
		var post_questions = "Please answer these yes or no questions: <br><br>";
		post_questions += '<table align="center">';
		for (var i = 0; i < questions.length; i++) {
			post_questions += "<tr><td>";
			var perm_index = permutations[i];
			post_questions += questions[perm_index];
			post_questions += " &nbsp &nbsp </td><td>";
			post_questions += "<div class='btn-group' data-toggle='buttons-checkbox' id=" + posttest_bootstrap[i] + ">";
	        post_questions += "<button type='button' class='btn btn-primary' data-value='0' onclick ='experiment.boostrap_post_button_select(\"posttest_" + String(i) +"\", 0, " + String(i) +  ")'>Yes</button>";
	        post_questions += "<button type='button' class='btn btn-danger' data-value='1' onclick ='experiment.boostrap_post_button_select(\"posttest_" + String(i) +"\", 1,  " + String(i) +  ")'>No</button>";
	        post_questions += "</div> <br>";
		    post_questions += "</td></tr>";
		};
		post_questions += "</table>";
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
		if (examples_clicked < examples_to_show) {
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
		if (examples_clicked == examples_to_show) {
			for (var ii = 0; ii < all_shapes.length; ii++) {
				for (jj = 0; jj < all_shapes[0].length; jj++) {
					$("#tdchoice" + String(ii) + '_' + String(jj)).removeClass('unchosen').addClass('withoutHover');
				};
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
		for (ii = 0; ii < highlighted_boxes.length; ii++) {
			if (highlighted_boxes[ii][0] == i && highlighted_boxes[ii][1] == j) {
				in_highlighted = 1;
			}
		}
		if (examples_clicked < 3 && in_highlighted == 1) {
			if ($("#tdchoice" + String(i) + '_' + String(j)).attr("class") == "withoutHover objTable highlighted") {
				if (isShape[shape_of_focus][i] == 0) {
					$("#tdchoice" + String(i) + '_' + String(j)).removeClass('highlighted').addClass('chosen');
					examples_clicked = examples_clicked + 1;
					guessed_shapes.push([i, j]);
				} else {
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
		if (((training_regime == 3 || training_regime == 4)  && examples_clicked < examples_to_show) && skip_check == 0) {
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
		    experiment.training_time = times[1] - times[0];
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