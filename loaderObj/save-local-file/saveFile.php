<? 

$str = $_POST['str']; 


$str = explode('base64,', $str)[1];
$str = base64_decode($str);

// Открываем файл, флаг W означает - файл открыт на запись
$file = fopen('obj.dae', 'w');

// Записываем в файл $text
fwrite($file, $str);

// Закрывает открытый файл
fclose($file);

echo $str;
//echo json_encode( $str );

