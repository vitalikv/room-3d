<? 

$arr = json_decode($_POST['arr']); 
$obj = json_decode($_POST['obj']); 
$geom = json_decode($_POST['geom'], true);  //Use json_decode($src, true) to get associative array.


$str = [];

$str['vertex'] = [];

for ($i = 0; $i < count($geom['attr']['v']); $i++) 
{
	$str['vertex'][$i] = new Vertex($geom['attr']['v'][$i], $i);
}


class Vertex 
{
	public $position;
	public $id = 0;
	
	public $faces = []; 					// faces vertex is connected
	public $neighbors = []; 				// neighbouring vertices aka "adjacentVertices"
	public $collapseCost = 0; 				// cost of collapsing this vertex, the less the better. aka objdist
	public $collapseNeighbor = null; 		// best candinate for collapsing			
	
	public function __construct($v, $id)
	{ 
		$this->position = new Vector3($v['x'], $v['y'], $v['z']);
		$this->id = $id;
	}	
}


class Vector3
{
	public $x = 0;
	public $y = 0;
	public $z = 0;
	
	public function __construct($x = 0, $y = 0, $z = 0)
	{ 
		$this->x = $x;
		$this->y = $y;
		$this->z = $z;
	}

	public function distanceTo( $v ) 
	{
		return sqrt( $this->distanceToSquared( $v ) );
	}

	private function distanceToSquared( $v ) 
	{
		$dx = $this->x - $v->x; 
		$dy = $this->y - $v->y; 
		$dz = $this->z - $v->z;

		return $dx * $dx + $dy * $dy + $dz * $dz;
	}	
}


foreach ($arr as $key=>$value) 
{
	if($arr[$key] === $obj) 
	{
		$str[$key] = $value;
		//unset($arr[$key]);
		array_splice($arr, $key, 1);
		break;
	}
}
//unset($arr[array_search($obj, $arr)]);


$str['dist'] = $str['vertex'][0]->position->distanceTo( $str['vertex'][2]->position );
$str['sqrt'] = sqrt(5);
$str['v'] = $arr;
$str['obj'] = $obj;
$str['geom'] = $geom;
$str['round1'] = round(5.331);
$str['search'] = array_search(5, [1, 5, 9]);

header('Content-Type: application/json; charset=utf-8');
echo json_encode( $str );

