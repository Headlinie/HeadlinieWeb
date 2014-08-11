<?php

namespace WorldNews;

class Cache {

	public $cacheFolder;

	public function __construct($cacheFolder)
	{
		$this->cacheFolder = $cacheFolder;
	}

	public function save($name, $content) {
		if($this->containsFolderInName($name)) {
			$this->createFoldersFromName($name);
		}
		file_put_contents($this->cacheFolder . "/" . $name, $content);
	}

	public function retrieve($name)
	{
		$content = file_get_contents($this->cacheFolder . "/" . $name);
		return $content;
	}

	public function exists($name) {
		return file_exists($this->cacheFolder . "/" . $name);
	}

	private function containsFolderInName($name)
	{
		if(explode('/', $name)[0] !== $name) {
			return true;
		} else {
			return false;
		}
	}

	private function createFoldersFromName($name)
	{
		$folders = explode('/', $name);
		unset($folders[count($folders) - 1]);
		foreach($folders as $folder) {
			mkdir($this->cacheFolder . "/" . $folder);
		}
	}

	public static function get_content() {}

	public static function exists_in_cache() {}

	public static function get_from_cache() {}
	public static function get_from_url() {}
}
