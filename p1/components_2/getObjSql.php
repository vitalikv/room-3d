<?php
require_once ("../include/bd_1.php");




if($_GET['id']) $id = trim($_GET['id']);
if($_POST['id']) 
{
	$id = trim($_POST['id']);
	
	if($_POST['select_list'])
	{
		$select_list = $_POST['select_list'];
	}
}

$id = addslashes($id);
if(!preg_match("/^[0-9]+$/i", $id)) { exit; }

if(!isset($select_list)) { $select_list = '*'; }

// находим e-mail, Имя, codepro
$sql = "SELECT {$select_list} FROM list_obj WHERE id = :id";
$r = $db->prepare($sql);
$r->bindValue(':id', $id, PDO::PARAM_STR);
$r->execute();
$res = $r->fetch(PDO::FETCH_ASSOC);


$count = $r->rowCount();

$data = [];
$data['error'] = true;

if($res) 
{
	$data = [];
	$data['id'] = json_decode($res['id']);
	
	if($res['name'])
	{
		$data['name'] = json_decode($res['name']);	
	}
	
	if($res['path'])
	{
		$data['model'] = json_decode(file_get_contents('../catalog/objs/'.json_decode($res['path']).'model.json'));		
	}
	
}


header('Content-Type: application/json; charset=utf-8');
echo json_encode( $data );




