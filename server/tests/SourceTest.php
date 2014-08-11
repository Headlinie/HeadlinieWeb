<?php

namespace WorldNewsTest;

use WorldNews\BaseSource;

class SourceTest extends BaseTest
{
	public function testBaseSourceCanGetAllSource()
	{
		$sources = BaseSource::getAllSources();

		$this->assertCount(1, $sources);
		$this->assertEquals('reddit', $sources[0]->name);
	}

	public function testBaseSourceGetsCorrectlySerializedToJson()
	{
		$sources = BaseSource::getAllSources();
		$output = $sources->toJson();

		$expected_output = '[{"name":"reddit","url":"http:\/\/www.reddit.com","endpoint":"http:\/\/www.reddit.com\/r\/worldnews.json","category":""}]';

		$this->assertEquals($expected_output, $output);

	}
}
