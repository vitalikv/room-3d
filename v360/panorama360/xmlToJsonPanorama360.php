<?




$file = file_get_contents($_POST['file']);
//$file = preg_replace('/[\x00-\x1F\x7F-\xFF]/','',$file);

$xml = simplexml_load_string($file, "SimpleXMLElement", LIBXML_NOCDATA);


echo json_encode($xml);
