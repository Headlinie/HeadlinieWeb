<?php

namespace WorldNewsTest;

use WorldNews\Cache;

class CacheTest extends BaseTest {
	public static $cacheFolder = "tests/data/cacheFolder";

	public function setup()
	{
		shell_exec("rm -r " . self::$cacheFolder);
		mkdir(self::$cacheFolder);
	}

	private function createCacheInstance()
	{
		return new Cache(self::$cacheFolder);
	}

	public function testCacheCanCreateItems()
	{
		$cache = $this->createCacheInstance();

		$name = "CacheName";
		$content = "Im a string";

		$cache->save($name, $content);

		$cached_file = file_get_contents(self::$cacheFolder . "/" . $name);
		$this->assertEquals($content, $cached_file);
	}

	public function testCacheCanReadItems()
	{
		$cache = $this->createCacheInstance();
		$name = "cached_name";
		$content = "This is the contents";

		file_put_contents(self::$cacheFolder . "/" . $name, $content);

		$retrieved_content = $cache->retrieve($name);

		$this->assertEquals($content, $retrieved_content);
	}

	public function testCacheWillCreateCacheFolderIfNotExists()
	{
		$cache = $this->createCacheInstance();
		$cache->save("sitename/cachename", "somerandomcontent");
		$content = $cache->retrieve("sitename/cachename");
		$this->assertEquals("somerandomcontent", $content);

	}
}
