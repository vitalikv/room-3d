<?
try
{
	$db = new PDO('mysql:host=localhost;dbname=editor_otop', 'root', '');
	$db->exec("set names utf8");
}
catch(PDOException $e)
{
    echo 'Ошибка 1';
}








