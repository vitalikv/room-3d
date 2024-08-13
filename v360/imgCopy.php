<?

$imgs = $_POST['imgs'];
 
$id = $_POST['id'];
 
$str = '';
 
for ($i = 0; $i < count($imgs); $i++)
{
	copy($imgs[$i],"img/".$id."_".$i.".jpg");
	
	$str .= ' '.$i;
}


echo $str;
