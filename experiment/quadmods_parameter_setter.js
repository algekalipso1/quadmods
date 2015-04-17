// ---------------- 2. STIMULUS SETUP ------------------
// Parameters and Stimulus Setup 

// Defining the parameters for the study:
// when all the required answers are given this is 1, and the experiment can advance or be submited
var all_answers_provided = 0;

// Permuted questions: Are the questions randomly shuffled, or are they asked in a default order?
// 0 means no permutation, 1 is shuffled.
var questions_permuted = 1;

// Skip the checks/tests for particpants' answers (for debugging mostly)
// 0 means no skip, 1 means it skips
var skip_check = 1;

// Training regime
// 0 delivers an uninformative table of examples.
// 1 delivers an informative table of examples.
// 2 provides descriptions of the qualities of each of the quadrilaterals.
// 3 Highlighting examples. This shows a table with all of the pictures, and then a selection of them
//      is highlighted at the same time a teacher says "these are parallelograms", etc.
var training_regime = 3;









// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization of the variables that track the responses of users:  Global tracking variables (just a couple).
// In these cases, 0 means yes, 1 means no, and -1 means "answer not provided"
// Unless skip_check is 1, the values cannot be -1 when they are submitted to Turk.
var pretest_answers = [];
for (var i = 0; i < 12; i++) {
    pretest_answers.push(-1);
}
var pretest_answers_by_order = [];
for (var i = 0; i < 12; i++) {
    pretest_answers_by_order.push(-1);
}


var posttest_answers = [];
for (var i = 0; i < 12; i++) {
    posttest_answers.push(-1);
}
var posttest_answers_by_order = [];
for (var i = 0; i < 12; i++) {
    posttest_answers_by_order.push(-1);
}



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Processing of variables to set experiment.

// Add array

// All shapes involved
shapes = ["squares", "rectangles", "rhombuses", "parallelograms"];
var questions = [];
var shape_abreviations = [];
for (var i = 0; i < shapes.length; i++) {
    for (var j = 0; j < shapes.length; j++) {
        if (i != j) {
            var this_question = "Are all " + shapes[i] + " also " + shapes[j] +"?";
            questions.push(this_question);
            var this_abreviation = shapes[i][0] + shapes[i][1] + "," + shapes[j][0] + shapes[j][1];
            shape_abreviations.push(this_abreviation);
        }
    }
}

// Permuted arrangement 
var permutations = [];
for (var i = 0; i < questions.length; i++) {
    permutations.push(i);
}
if (questions_permuted == 1) {
    permutations = shuffle(permutations);
}

var permuted_abreviations = [];
for (var i = 0; i < questions.length; i ++) {
    permuted_abreviations.push(shape_abreviations[permutations[i]])
}


// All of the radial buttons
var pretest_radials = [["q0_0_yes", "q0_0_no"], ["q0_1_yes", "q0_1_no"], ["q0_2_yes", "q0_2_no"], ["q0_3_yes", "q0_3_no"],
["q0_4_yes", "q0_4_no"], ["q0_5_yes", "q0_5_no"], ["q0_6_yes", "q0_6_no"], ["q0_7_yes", "q0_7_no"], ["q0_8_yes", "q0_8_no"],
["q0_9_yes", "q0_9_no"], ["q0_10_yes", "q0_10_no"], ["q0_11_yes", "q0_11_no"]];

var posttest_radials = [["q1_0_yes", "q1_0_no"], ["q1_1_yes", "q1_1_no"], ["q1_2_yes", "q1_2_no"], ["q1_3_yes", "q1_3_no"],
["q1_4_yes", "q1_4_no"], ["q1_5_yes", "q1_5_no"], ["q1_6_yes", "q1_6_no"], ["q1_7_yes", "q1_7_no"], ["q1_8_yes", "q1_8_no"],
["q1_9_yes", "q1_9_no"], ["q1_10_yes", "q1_10_no"], ["q1_11_yes", "q1_11_no"]];



// Seting up the variables for the training slide.
// Uninformative training
// In the following order (two of each): ["squares", "rectangles", "rhombuses", "parallelograms"]
var uninformative_training = [["square_1.png", "square_2.png"], ["rectangle_1.png", "rectangle_2.png"],
["rhombus_1.png", "rhombus_2.png"], ["parallelogram_1.png", "parallelogram_2.png"]];

var informative_training = [["square_1.png", "square_2.png"], ["rectangle_1.png", "square_1.png"],
["square_2.png", "rhombus_2.png"], ["rhombus_1.png", "rectangle_2.png"]];


var all_shapes = [["square_1.png", "square_2.png"], ["rectangle_1.png", "rectangle_2.png"],
["rhombus_1.png", "rhombus_2.png"], ["parallelogram_1.png", "parallelogram_2.png"]];

var example_list = uninformative_training;
if (training_regime == 1) {
    example_list = informative_training;
}




// Teacher says the following facts:
var teacher_facts = ["For a given angle in a rhombus, its opposite angle is the same", "All of the sides of a rhombus have the same length", 
"A square has four sides of equal length, and four 90 degree angles", "The angles of a rectangle are all 90 degree, and opposite sides have the same length",
"The opposite sides of a parallelogram are parallel", "A parallelogram can have 4 equal sides"];
