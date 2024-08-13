<?php
require_once ("../include/bd_1.php");




if($_GET['id']) $id = trim($_GET['id']);
if($_POST['id']) 
{
	$id = trim($_POST['id']);
	
	if($_POST['select_list']){ $select_list = $_POST['select_list']; }
	if($_POST['table']) { $table = $_POST['table']; }
}

$id = addslashes($id);
if(!preg_match("/^[0-9]+$/i", $id)) { exit; }

if(!isset($select_list)) { $select_list = '*'; }
if(!isset($table)) { $table = 'list_obj'; }


// находим e-mail, Имя, codepro
$sql = "SELECT {$select_list} FROM {$table} WHERE id = :id";
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

	if($res['type'])
	{
		$data['type'] = json_decode($res['type']);	
	}
	
	if($res['size'])
	{
		$data['size'] = json_decode($res['size']);	
	}
	
	if($res['model'])
	{
		$data['model'] = json_decode($res['model']);	
	}

	if($res['properties'])
	{
		$data['properties'] = json_decode($res['properties']);	
	}

	if($res['preview'])
	{
		//$data['preview'] = $res['preview'];	
	}
	
	if($res['params'])
	{
		$data['params'] = json_decode($res['params']);	
	}	
}


header('Content-Type: application/json; charset=utf-8');
echo json_encode( $data );




