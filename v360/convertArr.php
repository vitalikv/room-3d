<?



$file = file_get_contents($_POST['file']);
$file = preg_replace('/[\x00-\x1F\x7F-\xFF]/','',$file);


$xml = simplexml_load_string($file, "SimpleXMLElement", LIBXML_NOCDATA);
$xml = json_decode( json_encode($xml) , true);


$arrC = array();
if($xml["cams"]["PCamera"])
{
	$cams = $xml["cams"]["PCamera"];

	if(!isset($cams[0]["id"])) 
	{ 
		$w = $cams;
		$cams = array();
		$cams[0] = $w;		
	}


	for ($i = 0; $i < count($cams); $i++)
	{
		$arrC["cams"][$i]["id"] = (int)$cams[$i]["id"]; 
		$arrC["cams"][$i]["position"]["x"] = (isset($cams[$i]["position"]["x"])) ? intToFloat($cams[$i]["position"]["x"]) : 0; 
		$arrC["cams"][$i]["position"]["y"] = (isset($cams[$i]["position"]["y"])) ? intToFloat($cams[$i]["position"]["y"]) : 0;
		$arrC["cams"][$i]["position"]["z"] = (isset($cams[$i]["position"]["z"])) ? intToFloat($cams[$i]["position"]["z"]) : 0;	
		
		$arrC["cams"][$i]["target_position"]["x"] = (isset($cams[$i]["target_position"]["x"])) ? intToFloat($cams[$i]["target_position"]["x"]) : 0; 
		$arrC["cams"][$i]["target_position"]["y"] = (isset($cams[$i]["target_position"]["y"])) ? intToFloat($cams[$i]["target_position"]["y"]) : 0;
		$arrC["cams"][$i]["target_position"]["z"] = (isset($cams[$i]["target_position"]["z"])) ? intToFloat($cams[$i]["target_position"]["z"]) : 0;	
	}	
}




$floors = array();

if(count($arrC) > 0) { $floors["cams"] = $arrC["cams"]; }





echo json_encode( $floors );








// converter ---------------------



function intToFloat($int)
{		
	// binary from integer
	$int = trim($int);
	$bin1 = decbin( $int ); $bin1 = trim($bin1);
	if($int < 0) { $bin1 = substr($bin1,32 - strlen($bin1),strlen($bin1)); } 	// �����, ����� �������� � ������� �������� ����� �����������
	$bin1 = substr("00000000000000000000000000000000",0,32 - strlen($bin1)).$bin1;  

	// float from binary
	$floatFromBin = binToFloat($bin1); 

	
	
	return $floatFromBin;	
}




// float to binary
function floatToBinStr($value) {
   $bin = '';
    $packed = pack('f', $value); // use 'f' for 32 bit
    foreach(str_split(strrev($packed)) as $char) {
        $bin .= str_pad(decbin(ord($char)), 8, 0, STR_PAD_LEFT);
    }
    return $bin;
}




// binary to float
function binToFloat($bin) {
	if(strlen($bin) > 32) {
		return false;
	} else if(strlen($bin) < 32) {
		$bin = str_repeat('0', (32 - strlen($bin))) . $bin;
	}

	$sign = 1;
	if(intval($bin[0]) == 1) {
		$sign = -1;
	}

	$binExponent = substr($bin, 1, 8);
	$exponent = -127;
	for($i = 0; $i < 8; $i++) {
		$exponent += (intval($binExponent[7 - $i]) * pow(2, $i));
	}

	$binBase = substr($bin, 9);           
	$base = 1.0;
	for($x = 0; $x < 23; $x++) {
		$base += (intval($binBase[$x]) * pow(0.5, ($x + 1)));
	}

	$float = (float) $sign * pow(2, $exponent) * $base;

	return $float;
} 



