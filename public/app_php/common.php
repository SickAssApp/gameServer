<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    // Init Database
    $link = mysqli_connect('localhost', 'ssatAdmin', 'root');
    mysqli_set_charset($link,'utf8');
    if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    mysqli_select_db($link, 'test');