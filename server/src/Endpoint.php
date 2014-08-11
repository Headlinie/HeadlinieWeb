<?php

namespace WorldNews;

class Endpoint {
	public static $instance;
	public $source;

	public static function getInstance()
	{
		if(!Endpoint::$instance) {
			Endpoint::$instance = new Endpoint();
		}
		return Endpoint::$instance;
	}

	public function readRequest($request)
	{
		if(isset($request['source']) && isset($request['article'])) {
			throw new \Exception("You can't request both a source and article at the same time");
		} else {
			if(!isset($request['source']) && !isset($request['article'])) {
				throw new \Exception("You need to provide a source or a article in the request");
			}
			if(isset($request['source'])) {
				$this->source = $request['source'];
			}
			if(isset($request['article'])) {
				$this->article = $request['article'];
			}
		}
	}

	public function getSource()
	{
		$source = BaseSource::loadSource($this->source);
		return $source;
	}
}
