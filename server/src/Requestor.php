<?php
namespace WorldNews;

use GuzzleHttp\Client;

class Requestor {
	public static function GET($url)
	{
		$client = new Client();
		$res = $client->get($url, []);
		return $res->getBody();
	}
}
