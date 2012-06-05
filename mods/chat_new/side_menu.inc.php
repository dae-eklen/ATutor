<?php 
/* start output buffering: */
ob_start(); ?>

hello world! hello new chat

<?php
$savant->assign('dropdown_contents', ob_get_contents());
ob_end_clean();

$savant->assign('title', _AT('chat_new')); // the box title
$savant->display('include/box.tmpl.php');
?>