<?php
//Please note that this test is probably slow and should be used with care
//
//	You need to have a working webserver for this tests to work
//	It makes actual requests against a real server, use with care
//
use GuzzleHttp\Client;

class APITest extends \PHPUnit_Framework_TestCase {
	public static $base_url = "http://victor.bjelkholm.dev/WorldNews/server/";

	private function getClient() {
		$client = new Client();
		return $client;
	}

	private function makeGET($url) {
		$client = $this->getClient();
		$res = $client->get($url, []);
		$this->assertEquals(200, $res->getStatusCode());
		return $res->getBody();
	}

	public function xtestCanGetSources() {
		$expected_output = '[{"name":"reddit","url":"http:\/\/www.reddit.com","endpoint":"http:\/\/www.reddit.com\/r\/worldnews.json","category":""}]';
		$output = $this->makeGET(self::$base_url . "sources");

		$this->assertEquals($expected_output, $output);
	}
	public function xtestCanGetIndividualSource() {
		$expected_output = '{"name":"reddit","url":"http:\/\/www.reddit.com","endpoint":"http:\/\/www.reddit.com\/r\/worldnews.json","category":""}';
		$output = $this->makeGET(self::$base_url . "sources/reddit");

		$this->assertEquals($expected_output, $output);

	}
	public function xtestCanGetListOfArticlesFromSource() {
		$output = $this->makeGET(self::$base_url . "sources/reddit/articles");

		$output_decoded = json_decode($output);

		$articles = $output_decoded->articles;
		$metadata = $output_decoded->metadata;

		$this->assertCount(25, $articles);
		$this->assertEquals("reddit", $metadata->source);
	}
	public function testCanGetArticleViaUrl() {}
}
