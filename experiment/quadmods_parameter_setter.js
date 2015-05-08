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
// 3 active learning: Participant can click on any of the 12 example. Turns blue if shape_of_focus, red otherwise
// 4 Passive learning condition: few boxes get highlighted and participant is required to click on the highlighted boxes, a teacher says "these are parallelograms", etc.
// 5 Baseline condition: You present the same layout as in 3 and 4. But no highlighting or anything. 
var training_regime = 4;
//var training_regime = random(3, 5);

// Number of examples to show. This is specifically for the case of training_regime == 3. If training_regime == 4
// then you control the number of examples by editing the highlighted_boxes, which determines the specific examples used.
var examples_to_show = 3;


// Shape of focus for teaching: 
//  0 -> squares
//  1 -> rectangles
//  2 -> rhombuses
//  3 -> parallelograms
var shape_of_focus = 2;






// For the specfic case of training_regime = 4, you have to specify which shapes actually get highlighted.
var highlighted_boxes = [];
if (shape_of_focus == 0) {
    highlighted_boxes = [[0, 1], [1, 0], [3, 2]];
}
if (shape_of_focus == 1) {
    highlighted_boxes = [[0, 0], [1, 2], [3, 1]];
}
if (shape_of_focus == 2) {
    highlighted_boxes = [[0, 1], [2, 0], [3, 2]];
}
if (shape_of_focus == 3) {
    highlighted_boxes = [[2, 1], [1, 0], [3, 1]];
}







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

// In case of training regime 3, keeps track of the number of examples clicked/revealed/tried
var examples_clicked = 0;


// This is to track the shapes that were guessed:
var guessed_shapes = [];

// Time variables
var times = [];



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Processing of variables to set experiment.



// All shapes involved
singular_shapes = ["square", "rectangle", "rhombus", "parallelogram"];
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

// Bootstrap button ids 
var pretest_bootstrap = [];
for (var i = 0; i < questions.length; i++) {
    pretest_bootstrap.push("pretest_" + String(i));
}

var posttest_bootstrap = [];
for (var i = 0; i < questions.length; i++) {
    posttest_bootstrap.push("posttest_" + String(i));
}



// Seting up the variables for the training slide.
// Uninformative training
// In the following order (two of each): ["squares", "rectangles", "rhombuses", "parallelograms"]
var uninformative_training = [["square_1.png", "square_2.png"], ["rectangle_1.png", "rectangle_2.png"],
["rhombus_1.png", "rhombus_2.png"], ["parallelogram_1.png", "parallelogram_2.png"]];

var informative_training = [["square_1.png", "square_2.png"], ["rectangle_1.png", "square_1.png"],
["square_2.png", "rhombus_2.png"], ["rhombus_1.png", "rectangle_2.png"]];


var all_shapes = [["square_1.png", "square_2.png", "square_3.png"], ["rectangle_1.png", "rectangle_2.png", "rectangle_3.png"],
["rhombus_1.png", "rhombus_2.png", "rhombus_3.png"], ["parallelogram_1.png", "parallelogram_2.png", "parallelogram_3.png"]];

var isSquare = [1, 0, 0, 0];
var isRectanlge = [1, 1, 0, 0];
var isRhombus = [1, 0, 1, 0];
var isParallelogram = [1, 1, 1, 1];

var isShape = [isSquare, isRectanlge, isRhombus, isParallelogram];


var example_list = uninformative_training;
if (training_regime == 1) {
    example_list = informative_training;
}




// Teacher says the following facts:
var teacher_facts = [" For a given angle in a rhombus, its opposite angle is the same", " All of the sides of a rhombus have the same length", 
" A square has four sides of equal length, and four 90 degree angles", " The angles of a rectangle are all 90 degree, and opposite sides have the same length",
" The opposite sides of a parallelogram are parallel", " A parallelogram can have 4 equal sides"];
















