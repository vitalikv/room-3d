<?php
require_once ("../../include/bd_1.php");




if($_GET['select_list']) { $select_list = $_GET['select_list']; }
if($_POST['select_list']) { $select_list = $_POST['select_list']; }

if($_GET['table']) { $table = $_GET['table']; }
if($_POST['table']) { $table = $_POST['table']; }

if(!isset($select_list)) { $select_list = '*'; }

if($_POST['where']) { $where = $_POST['where']; }
else { $where = ''; }

if($_POST['order']) { $order = $_POST['order']; }
else { $order = 'ORDER BY id'; }

if(isset($_POST['limit'])) { $limit = $_POST['limit']; }
else { $limit = ''; }



$sql = "SELECT {$select_list} FROM {$table} {$where} {$order}";
$r2 = $db->prepare($sql);
$r2->execute();
$count = $r2->rowCount();


$sql = "SELECT {$select_list} FROM {$table} {$where} {$order} {$limit}";
$r = $db->prepare($sql);
$r->execute();
$data = $r->fetchAll(PDO::FETCH_ASSOC);





for ($i=0; $i<count($data); $i++)
{
	if($data[$i]['date_up'])
	{
		// сколько прошло дней (86400 - секунд в сутках). intval() - преобразует дробное число к целому
		$data[$i]['date_up'] = intval((time() - $data[$i]['date_up']) / 86400);
		//$data[$i]['date_up'] = date('d/m/Y H:i:s', $data[$i]['date_up']);		
	}	
}


$result = [];
$result['list'] = $data;
$result['total'] = $count;


if(!empty($limit))
{
	$limitItem = explode(",", $limit)[1]; 
	$limitItem = trim($limitItem);
	$result['pageCount'] = ceil($count / $limitItem);
}



header('Content-Type: application/json; charset=utf-8');
echo json_encode( $result );
