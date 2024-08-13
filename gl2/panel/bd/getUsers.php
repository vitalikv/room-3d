<?php
require_once ("../../include/bd_1.php");


if($_GET['table']) { $table = $_GET['table']; }
if($_POST['table']) { $table = $_POST['table']; }


if($_POST['having']) { $having = $_POST['having']; }
else { $having = ''; }

if($_POST['order']) { $order = $_POST['order']; }
else { $order = 'ORDER BY id'; }

$where = '';
$limit = '';


if(isset($_POST['limit'])) { $limit = $_POST['limit']; }



$sql = "SELECT u.id AS id
FROM user u
LEFT JOIN project p ON u.id = p.user_id 
{$where}
GROUP BY u.id
{$having}
{$order}";
$r2 = $db->prepare($sql);
$r2->execute();
$count = $r2->rowCount();


$sql = "SELECT u.id AS id, u.mail AS mail, u.pass AS pass, u.date AS date, COUNT(p.user_id) AS count_project
FROM user u
LEFT JOIN project p ON u.id = p.user_id 
{$where}
GROUP BY u.id
{$having}
{$order}
{$limit}";
$r = $db->prepare($sql);
$r->execute();
$data = $r->fetchAll(PDO::FETCH_ASSOC);


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
