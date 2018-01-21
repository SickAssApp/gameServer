<?php

//include 'initHandler.php';
include 'common.php';
include 'question_handler.php';
if(isset($_GET["type"])){
    $type = $_GET["type"];
}

if(isset($_GET["studentID"])){
    $studentID = $_GET["studentID"];
}

if(isset($_GET["message"])){
    $message = $_GET["message"];
}

switch ($type){
    case 30: // Ask for question set
        getQuestionSet($message,$link);  // question_handler.php
        break;        
    
}


