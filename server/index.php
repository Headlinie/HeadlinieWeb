<?php

require_once "src/Utils.php";

error_reporting(E_ERROR | E_PARSE);

function dd($thingToDump) {
	echo "<pre>";
	var_dump($thingToDump);
	echo "</pre>";
	die();
}

/* gets the contents of a file if it exists, otherwise grabs and caches */
function get_content($file,$url,$hours = 24,$fn = '',$fn_args = '') {
	//vars
	$current_time = time(); $expire_time = $hours * 60 * 60; $file_time = filemtime($file);
	//decisions, decisions
	if(file_exists($file) && ($current_time - $expire_time < $file_time)) {
		//echo 'returning from cached file';
		return file_get_contents($file);
	}
	else {
		$content = get_url($url);
		// if($fn) { $content = $fn($content,$fn_args); }
		// $content.= '<!-- cached:  '.time().'-->';
		file_put_contents($file,$content);
		//echo 'retrieved fresh from '.$url.':: '.$content;
		return $content;
	}
}

/* gets content from a URL via curl */
function get_url($url) {
	$ch = curl_init();
	curl_setopt($ch,CURLOPT_URL,$url);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1); 
	curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,5);
	$content = curl_exec($ch);
	if(!$content) {
		throw new Exception(curl_error($ch));
	}
	curl_close($ch);
	return $content;
}

function remove_cache($file) {
	if(!unlink($file)) {
		// throw new Exception('Couldnt delete cached response!');
	}
}

header('Content-Type: application/json');

if(!isset($_GET['url'])) {
	throw new Exception("Your bad");
}
$folderName = Utils::get_domain($_GET['url']);
// dd($folderName);
if(!file_exists('cache/'.$folderName)) {
	mkdir('cache/'.$folderName);
}
$cacheName = 'cache/' . $folderName . '/' . md5($_GET['url']);

if(isset($_GET['force-reload'])) {
	$forceReload = $_GET['force-reload'];
	if($forceReload === "true") {
		remove_cache($cacheName);
	}
}

$url = "http://www.readability.com/api/content/v1/parser?url=";
$url = $url . $_GET['url'];
$url = $url . "&token=8680f644ff6278a311ff8c0a4713223b20a24f48";

try {
	$output = get_content($cacheName, $url, 24);
	// $output = Utils::replace_images($output);
	if(!$output) {
		$output = '{"messages": "Something went wrong... ID: '.$cacheName.'"}';
	}
} catch (Exception $e) {
	$output = '{"messages": "'.$e->getMessage().'"}';
}

echo $output;