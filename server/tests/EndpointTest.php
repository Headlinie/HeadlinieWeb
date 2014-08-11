<?php

namespace WorldNewsTest;

use WorldNews\Endpoint;

class EndpointTest extends BaseTest {
	public function testSingleton()
	{
		$instance1 = $this->getInstance();
		$instance2 = $this->getInstance();
		$this->assertSame($instance1, $instance2);
	}

	private function getInstance()
	{
		return Endpoint::getInstance();
	}

	public function testEndpointThrowsExceptionIfBothArticleAndSourceIsProvided()
	{
		$fakeRequest = [
			'source' => 'fakeSource',
			'article' => 'fakeArticle'
		];
		$instance = $this->getInstance();
		try {
			$instance->readRequest($fakeRequest);
			$this->fail();
		} catch (\Exception $e) {
			$message = $e->getMessage();
			$this->assertEquals("You can't request both a source and article at the same time", $message);
		}
	}

	public function testEndpointThrowsExceptionIfSourceNotProvided()
	{
		$fakeRequest = [];
		$instance = $this->getInstance();
		try {
			$instance->readRequest($fakeRequest);
			$this->fail();
		} catch (\Exception $e) {
			$message = $e->getMessage();
			$this->assertEquals("You need to provide a source or a article in the request", $message);
		}
	}

	public function testEndpointCanReadSourceFromRequest()
	{
		$fakeRequest = [
			"source" => "hn"
		];

		$instance = $this->getInstance();
		$instance->readRequest($fakeRequest);

		$this->assertEquals("hn", $instance->source);
	}

	public function testEndpointCanReadArticleFromRequest()
	{
		$fakeRequest = [
			"article" => "fakeArticle"
		];

		$instance = $this->getInstance();
		$instance->readRequest($fakeRequest);

		$this->assertEquals("fakeArticle", $instance->article);
	}

	public function testEndpointCanGetSourceFromRequest()
	{
		$fakeRequest = [
			"source" => "reddit"
		];

		$instance = $this->getInstance();
		$instance->readRequest($fakeRequest);
		$source = $instance->getSource();

		$this->assertEquals("reddit", $source->name);
	}

	public function testEndpointThrowsExceptionIfSourceNotFound()
	{
		$fakeRequest = [
			"source" => "nonexisting"
		];

		$instance = $this->getInstance();
		$instance->readRequest($fakeRequest);
		try {
			$instance->getSource();
			$this->fail();
		} catch (\Exception $e) {
			$message = $e->getMessage();
			$this->assertEquals("Source \"WorldNews\Sources\Nonexisting\" doesnt exists!", $message);
		}
	}
}
