<? 

$percentage = $_POST['percentage'];
$v1 = json_decode($_POST['v'], true);
$f1 = json_decode($_POST['f'], true);
$uv1 = json_decode($_POST['uv'], true);
$radius = $_POST['radius'];
$actT = $_POST['actT'];


$data = [];
$vertices = [];
$faces = [];
$faceUVs = [];


for($i = 0; $i < count($v1); $i++) 
{
    $vertices[] = new Vertex($v1[$i], $i);
}


if(actT && count($uv1) > 0) 
{
	for($i = 0; $i < count($uv1); $i++)
	{
		//$faceUVs[$i] = [new Vector2($uv1[$i][0]['x'], $uv1[$i][0]['y']), new Vector2($uv1[$i][1]['x'], $uv1[$i][1]['y']), new Vector2($uv1[$i][2]['x'], $uv1[$i][2]['y'])];	
		
		$faceUVs[$i][0] = new Vector2($uv1[$i][0]['x'], $uv1[$i][0]['y']);
		$faceUVs[$i][1] = new Vector2($uv1[$i][1]['x'], $uv1[$i][1]['y']);
		$faceUVs[$i][2] = new Vector2($uv1[$i][2]['x'], $uv1[$i][2]['y']);		
	}
}


for($i = 0; $i < count($f1); $i++)
{
	$faces[$i] = new Triangle
	(
		$vertices[$f1[$i]['a']],
		$vertices[$f1[$i]['b']],
		$vertices[$f1[$i]['c']],
		$f1[$i]['a'],
		$f1[$i]['b'],
		$f1[$i]['c'],
		$faceUVs[$i],
		$f1[$i]['materialIndex']
	);
}
	

for($i = 0; $i < count($vertices); $i++) 
{
    //computeEdgeCostAtVertex($vertices[$i]);
}


$nextVertex;
$z = $percentage;	

while($z--) 
{
	//$nextVertex = minimumCostEdge($vertices);
	
	//if (!$nextVertex) break;

	//collapse($vertices, $faces, $nextVertex, $nextVertex->collapseNeighbor, $actT);
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
	
	public function addUniqueNeighbor($vertex)
	{		
		if(!in_array($vertex, $this->neighbors)) $this->neighbors[] = $vertex;
	}

	public function removeIfNonNeighbor($n)
	{
		$id = array_search($n, $this->neighbors);
		if($id === false) return;
		
		for($i = 0; $i < count($this->faces); $i++) 
		{
			if($this->faces[$i]->hasVertex($n)) return;
		}

		array_splice($this->neighbors, $id, 1);
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

	public function subVectors( $a, $b ) 
	{
		$this->x = $a->x - $b->x;
		$this->y = $a->y - $b->y;
		$this->z = $a->z - $b->z;

		return $this;
	}

	public function cross( $v ) 
	{
		return $this->crossVectors( $this, $v );
	}
	
	private function crossVectors( $a, $b ) 
	{
		$ax = $a->x;
		$ay = $a->y;
		$az = $a->z;
		
		$bx = $b->x;
		$by = $b->y;
		$bz = $b->z;

		$this->x = $ay * $bz - $az * $by;
		$this->y = $az * $bx - $ax * $bz;
		$this->z = $ax * $by - $ay * $bx;

		return $this;
	}


	public function normalize() 
	{
		$length = $this->length();
		if($length === 0) $length = 1;
		
		return $this->divideScalar( $length );
	}

	public function length() 
	{
		return sqrt( $this->x * $this->x + $this->y * $this->y + $this->z * $this->z );
	}

	public function divideScalar( $scalar ) 
	{
		return $this->multiplyScalar( 1 / $scalar );
	}

	public function multiplyScalar( $scalar ) 
	{
		$this->x *= $scalar;
		$this->y *= $scalar;
		$this->z *= $scalar;

		return $this;
	}

	public function dot( $v ) 
	{
		return $this->x * $v->x + $this->y * $v->y + $this->z * $v->z;
	}	
}



class Vector2
{
	public $x = 0;
	public $y = 0;
	
	public function __construct($x = 0, $y = 0)
	{ 
		$this->x = $x;
		$this->y = $y;
	}	
}



class Triangle 
{
	public $a;
	public $b;
	public $c;
	
	public $v1;
	public $v2;
	public $v3;
	
	public $normal;
	public $faceVertexUvs;
	public $materialIndex;
	
	public function __construct($v1, $v2, $v3, $a, $b, $c, $fvuv, $materialIndex)
	{ 
		$this->a = $a;
		$this->b = $b;
		$this->c = $c;

		$this->v1 = $v1;
		$this->v2 = $v2;
		$this->v3 = $v3;

		$this->normal = new Vector3();
		$this->faceVertexUvs = $fvuv;
		$this->materialIndex = $materialIndex;

		$this->computeNormal();
		
		$v1->faces[] = $this;
		$v1->addUniqueNeighbor($v2);
		$v1->addUniqueNeighbor($v3);

		$v2->faces[] = $this;
		$v2->addUniqueNeighbor($v1);
		$v2->addUniqueNeighbor($v3);

		$v3->faces[] = $this;
		$v3->addUniqueNeighbor($v1);
		$v3->addUniqueNeighbor($v2);		
	}

	private function init() 
	{
		
	}
	
	public function computeNormal()
	{
		$vA = $this->v1->position;
		$vB = $this->v2->position;
		$vC = $this->v3->position;

		$cb = new Vector3();
		$cb->subVectors($vC, $vB);
		$ab = new Vector3();
		$ab->subVectors($vA, $vB);
		
		$cb->cross($ab);
		$cb->normalize();

		$this->normal = new Vector3($cb->x, $cb->y, $cb->z);		
	}

	public function hasVertex($v)
	{
		return $v === $this->v1 || $v === $this->v2 || $v === $this->v3;
	}

	public function replaceVertex($oldv, $newv)
	{
		if ($oldv === $this->v1) $this->v1 = $newv;
		else if ($oldv === $this->v2) $this->v2 = $newv;
		else if ($oldv === $this->v3) $this->v3 = $newv;

		removeFromArray($oldv->faces, $this);
		$newv->faces[] = $this;

		$oldv->removeIfNonNeighbor($this->v1);
		$this->v1->removeIfNonNeighbor($oldv);

		$oldv->removeIfNonNeighbor($this->v2);
		$this->v2->removeIfNonNeighbor($oldv);

		$oldv->removeIfNonNeighbor($this->v3);
		$this->v3->removeIfNonNeighbor($oldv);

		$this->v1->addUniqueNeighbor($this->v2);
		$this->v1->addUniqueNeighbor($this->v3);

		$this->v2->addUniqueNeighbor($this->v1);
		$this->v2->addUniqueNeighbor($this->v3);

		$this->v3->addUniqueNeighbor($this->v1);
		$this->v3->addUniqueNeighbor($this->v2);

		$this->computeNormal();		
	}	
}





function computeEdgeCostAtVertex($v) 
{
	if (count($v->neighbors) === 0) 
	{
		$v->collapseNeighbor = null;
		$v->collapseCost = -0.01;
		return;
	}

	$v->collapseCost = 100000;
	$v->collapseNeighbor = null;

	
	for ($i = 0; $i < count($v->neighbors); $i++) 
	{
		$collapseCost = computeEdgeCollapseCost($v, $v->neighbors[$i]);

		if ($v->collapseNeighbor !== null) 
		{
			$v->collapseNeighbor = $v->neighbors[$i];
			$v->collapseCost = $collapseCost;
			$v->minCost = $collapseCost;
			$v->totalCost = 0;
			$v->costCount = 0;
		}

		$v->costCount++;
		$v->totalCost += $collapseCost;

		if ($collapseCost < $v->minCost) 
		{
			$v->collapseNeighbor = $v->neighbors[$i];
			$v->minCost = $collapseCost;
		}
	}

	$v->collapseCost = $v->totalCost / $v->costCount;
	//$v->collapseCost = $v->minCost;
}


function computeEdgeCollapseCost($u, $v)
{
	$edgelength = $v->position->distanceTo($u->position);
	$curvature = 0;

	$sideFaces = [];


	for($i = 0; $i < count($u->faces); $i++) 
	{
		if ($u->faces[$i]->hasVertex($v)) $sideFaces[] = $u->faces[$i];
	}


	for($i = 0; $i < count($u->faces); $i++) 
	{
		$minCurvature = 1;
		$face = $u->faces[$i];

		for($j = 0; $j < count($sideFaces); $j++) 
		{
			$dotProd = $face->normal->dot($sideFaces[$j]->normal);
			$minCurvature = min($minCurvature, (1.001 - $dotProd) / 2);
		}

		$curvature = max($curvature, $minCurvature);
	}


	$borders = 0;
	if(count($sideFaces) < 2) $curvature = 1;

	return $edgelength * $curvature + $borders;	
}


function minimumCostEdge($vertices) 
{
	$least = $vertices[0];

	for($i = 0; $i < count(vertices); $i++) 
	{
		if ($vertices[$i]->collapseCost < $least->collapseCost) 
		{
			$least = $vertices[$i];
		}
	}

	return $least;
}


$maxN = 100;
function collapse($vertices, $faces, $u, $v, $preserveTexture) 
{
	if(!$v) 
	{
		removeVertex($u, $vertices);
		return;
	}

	$tmpVertices = [];

	for($i = 0; $i < count($u->neighbors); $i++) 
	{
		$tmpVertices[] = $u->neighbors[$i];
	}

	$moveToThisUvsValues = [];


	for($i = count($u->faces) - 1; $i >= 0; $i--) 
	{
		if ($u->faces[$i]->hasVertex($v)) 
		{
			if($preserveTexture) $moveToThisUvsValues = getUVsOnVertex($u->faces[$i], $v);
			removeFace($u->faces[$i], $faces);
		}
	}

	if($preserveTexture) 
	{
		for($i = count($u->faces) - 1; $i >= 0; $i--) 
		{
			$face = $u->faces[$i];
			
			if($maxN > 0) 
			{
				$dist1 = $face->v1->position->distanceTo($face->v2->position);
				$dist2 = $face->v2->position->distanceTo($face->v3->position);
				$dist3 = sqrt($dist1 * $dist1 + $dist2 * $dist2);
				$angles = getTriangleAnglesFromDistances($dist1, $dist2, $dist3);
				$anglesUV = getAnglesFromPoints($face->faceVertexUvs);
				//console.log(angles, anglesUV);
				$maxN--;
			}
			
			$faceVerticeUVs = getUVsOnVertex($u->faces[$i], $u);

			$verticeDistance = $u->position->distanceTo($v->position);
			$size = $radius * 2;
			$percentageChangeVertexShift = 100 / $size * $verticeDistance;

			$deltaX = abs(100 * ($moveToThisUvsValues->x - $faceVerticeUVs->x));
			$deltaY = abs(100 * ($moveToThisUvsValues->y - $faceVerticeUVs->y));
			$percentageChangeTextureCorrds = max($deltaX, $deltaY);


			if(abs($percentageChangeTextureCorrds - $percentageChangeVertexShift) > 5) continue;

			$faceVerticeUVs->x = $moveToThisUvsValues->x;
			$faceVerticeUVs->y = $moveToThisUvsValues->y;
		}
	}

	
	for($i = count($u->faces) - 1; $i >= 0; $i--) 
	{
		$u->faces[$i]->replaceVertex($u, $v);
	}
	

	removeVertex($u, $vertices);


	for($i = 0; $i < count(tmpVertices); $i++) 
	{
		computeEdgeCostAtVertex($tmpVertices[$i]);
	}
}


function removeVertex($v, $vertices) 
{
	while(count($v->neighbors)) 
	{
		$n = $v->neighbors[count($v->neighbors) - 1];
		removeFromArray($v->neighbors, $n);
		removeFromArray($n->neighbors, $v);
	}

	removeFromArray($vertices, $v);
}



function removeFromArray($array, $object) 
{	
	$id = array_search($object, $array);
	array_splice($array, $id, 1);
	//unset($array[array_search($object, $array)]);
}


function getUVsOnVertex($face, $vertex) 
{
	$id = array_search($vertex, [$face->v1, $face->v2, $face->v3]);
	
	return $face->faceVertexUvs[$id];
}


function removeFace($f, $faces) 
{
	removeFromArray($faces, $f);

	if($f->v1) removeFromArray($f->v1->faces, $f);
	if($f->v2) removeFromArray($f->v2->faces, $f);
	if($f->v3) removeFromArray($f->v3->faces, $f);

	// TODO optimize this!
	$vs = [$f->v1, $f->v2, $f->v3];
	$v1;
	$v2;

	for($i = 0; $i < 3; $i++) 
	{
		$v1 = $vs[$i];
		$v2 = $vs[($i + 1) % 3];

		if(!$v1 || !$v2) continue;
		$v1->removeIfNonNeighbor($v2);
		$v2->removeIfNonNeighbor($v1);
	}
}



function getTriangleAnglesFromDistances($a, $b, $c) 
{
	$s = ($a + $b + $c) / 2;

	$area = sqrt($s * ($s - $a) * ($s - $b) * ($s - $c));

	$R = $a * $b * $c / (4 * $area);

	$A = 180 / PI * asin($a / (2 * $R));
	$B = 180 / PI * asin($b / (2 * $R));
	$C = 180 / PI * asin($c / (2 * $R));

	return [$A, $B, $C];
}



function getAnglesFromPoints($uvs) 
{
	$pointA = $uvs[0];
	$pointB = $uvs[1];
	$pointC = $uvs[2];

	$dist1 = sqrt( pow($pointA->x - $pointB->x, 2) + pow($pointA->y - $pointB->y, 2) );
	$dist2 = sqrt( pow($pointB->x - $pointC->x, 2) + pow($pointB->y - $pointC->y, 2) );
	$dist3 = sqrt($dist1 * $dist1 + $dist2 * $dist2);
	
	return getTriangleAnglesFromDistances($dist1, $dist2, $dist3);
}


// сборка
$v2 = [];
$f2 = [];

for($i = 0; $i < count($vertices); $i++) 
{
	$v2[$i] = $vertices[$i]->position;
}


for($i = 0; $i < count($faces); $i++) 
{
	$f2[$i]['a'] = array_search($faces[$i]->v1, $vertices);
	$f2[$i]['b'] = array_search($faces[$i]->v2, $vertices);
	$f2[$i]['c'] = array_search($faces[$i]->v3, $vertices);
	$f2[$i]['materialIndex'] = $faces[$i]->materialIndex;
	$f2[$i]['faceVertexUvs'] = $faces[$i]->faceVertexUvs;
}



//print_r($vertices[$i]);
$data['v2'] = $v2;
$data['f2'] = $f2;
//$data['f1'] = $f1;
//$data['f2'] = $faces;
//$data['uv1'] = $uv1;
//$data['uv2'] = $faceUVs;
$data['actT'] = $actT;



header('Content-Type: application/json; charset=utf-8');
echo json_encode( $data );

