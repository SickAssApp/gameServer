<?php
//include 'common.php';
//getQuestionSet(4, $link);
function getQuestionSet($message,$link){
    $limitCheck = 0;
    
    // Get Max ID of the questions from table and generate random id
    $result = mysqli_query($link, "SELECT MAX(id) FROM voc_word");
    $maxid = mysqli_fetch_array($result);
    mysqli_free_result($result);

    for($i=0;$i<$message;$i++){
        $randid[$i]=rand(1, $maxid[0]);
    }
    $combineID = implode(",", $randid);
    
    // Get the questions by ID that was generated from code above
    $result = mysqli_query($link, "SELECT id, word, content
                                                      FROM voc_word
                                                      where id in (".$combineID.") order by rand();");   

    while($row = mysqli_fetch_array($result)){
        $json_array[] = array(
            'id'        => $row['id'],
            'word' => $row['word'],
            'content'      => $row['content']            
        );
    }
    
    mysqli_free_result($result); // Release result    
    echo json_encode($json_array);
}