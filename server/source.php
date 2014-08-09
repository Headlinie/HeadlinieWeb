<?php
require_once('vendor/autoload.php');

use WorldNews\Endpoint;

$endpoint = Endpoint::getInstance();

$endpoint->readRequest($_REQUEST);
$source = $endpoint->getSource();

header("Content-Type: application/json");
echo json_encode($source);
