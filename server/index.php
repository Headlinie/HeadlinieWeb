<?php
define('APP_PATH', '/worldnews/server');
//dispatch(substr($_SERVER['REQUEST_URI'], strlen(APP_PATH)));
//
//echo "<pre>";
//var_dump($_REQUEST);
//var_dump($_SERVER);
//echo "</pre>";
//die();

require_once __DIR__ . '/vendor/autoload.php';

$klein = new \Klein\Klein();

$request = \Klein\Request::createFromGlobals();

// Grab the server-passed "REQUEST_URI"
$uri = $request->server()->get('REQUEST_URI');

// Set the request URI to a modified one (without the "subdirectory") in it
$request->server()->set('REQUEST_URI', substr($uri, strlen(APP_PATH)));



//Approved classes, required for get_declared_classes() to work
new WorldNews\Sources\Reddit();

//End approved classes

$klein->respond('GET', '/sources', function() {
    $sources = \WorldNews\BaseSource::getAllSources();

    header("Content-Type: application/json");
    return $sources->toJson();
});

$klein->respond('GET', '/sources/[:source_name]', function ($req, $res) {
    $source = \WorldNews\BaseSource::loadSource($req->source_name);

    header("Content-Type: application/json");
    return json_encode($source);
});

$klein->respond('GET', '/sources/[:source_name]/articles', function ($req, $res) {
    $source = \WorldNews\BaseSource::loadSource($req->source_name);
    $articles = $source->getTopArticles();
    $response = [
	'articles' => $articles,
	'metadata' => [
	    'source' => $req->source_name
	]
    ];
    header("Content-Type: application/json");
    return json_encode($response);
});

$klein->respond('GET', '/sources/[:source_name]/articles/[:article_url]', function ($req, $res) {

    $article_url = urldecode($req->article_url);

    $domain = \WorldNews\Utils::get_domain($article_url);

    $cache_name = $domain . '/' . md5($article_url);

    $cache = new \WorldNews\Cache("cache");

    $response = null;

    if($cache->exists($cache_name)) {
	$response = $cache->retrieve($cache_name);
    } else {
	$url = "http://www.readability.com/api/content/v1/parser?url=";
	$url = $url . $article_url;
	$url = $url . "&token=8680f644ff6278a311ff8c0a4713223b20a24f48";

	$response = \WorldNews\Requestor::GET($url);
	$cache->save($cache_name, $response);
    }

    $decoded = json_decode($response);
    $decoded->content = \WorldNews\Utils::replace_images($decoded->content);
    $decoded->content = \WorldNews\Utils::make_links_external($decoded->content);
    $encoded = json_encode($decoded);


    header("Content-Type: application/json");
    return $encoded;
});


// Pass our request to our dispatch method
$klein->dispatch($request);





die('Dying!');
require_once "src/Utils.php";

error_reporting(E_ERROR | E_PARSE);

/* gets the contents of a file if it exists, otherwise grabs and caches */
function get_content($file,$url,$hours = 24) {
	$current_time = time(); $expire_time = $hours * 60 * 60; $file_time = filemtime($file);
	if(file_exists($file) && ($current_time - $expire_time < $file_time)) {
		return file_get_contents($file);
	}
	else {
		$content = get_url($url);
		file_put_contents($file,$content);
		return $content;
	}
}

/* gets content from a URL via curl */
function get_url($url) {
	$curl_connection = curl_init();
	curl_setopt($curl_connection,CURLOPT_URL,$url);
	curl_setopt($curl_connection,CURLOPT_RETURNTRANSFER,1); 
	curl_setopt($curl_connection,CURLOPT_CONNECTTIMEOUT,5);
	$content = curl_exec($curl_connection);
	if(!$content) {
		throw new Exception(curl_error($curl_connection));
	}
	curl_close($curl_connection);
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
	$output = Utils::replace_images($output);
	if(!$output) {
		$output = '{"messages": "Something went wrong... ID: '.$cacheName.'"}';
	}
} catch (Exception $e) {
	$output = '{"messages": "'.$e->getMessage().'"}';
}

echo $output;
