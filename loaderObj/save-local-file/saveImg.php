<? 

$data = $_POST['data']; 
$name = $_POST['name']; 

$data = explode('base64,', $data)[1];
$data = base64_decode($data);

// Открываем файл, флаг W означает - файл открыт на запись
$file = fopen($name, 'w');

// Записываем в файл $text
fwrite($file, $data);

// Закрывает открытый файл
fclose($file);

echo true;
//echo json_encode( $str );

