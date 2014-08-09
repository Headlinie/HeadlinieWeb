<?php

namespace WorldNews\Sources;

use WorldNews\BaseSource;

class Reddit extends BaseSource {
	public $name = "reddit";
	public $url = "http://www.reddit.com/";
	public $endpoint = "http://www.reddit.com/r/worldnews.json";
	public $category = "";
}
