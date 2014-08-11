<?php

namespace WorldNews\Sources;

use WorldNews\BaseSource;
use WorldNews\Article;
use GuzzleHttp\Client;

class Reddit extends BaseSource implements ISource {
	public $name = "reddit";
	public $url = "http://www.reddit.com";
	public $endpoint = "http://www.reddit.com/r/worldnews.json";
	public $category = "";

	private function convertToArticleObject($article)
	{
		$ret = new Article();
		$ret->title = $article->title;
		$ret->content = null;
		$ret->date_posted = $article->created;
		$ret->domain = $article->domain;
		$ret->comments = $this->url . $article->permalink;
		$ret->link = $article->url;
		$ret->category = $article->link_flair_text;
		return $ret;
	}

	public function getTopArticles() {
		$client = new Client();
		$res = $client->get($this->endpoint, []);
		$body = json_decode($res->getBody());
		$articles = $body->data->children;
		$ret = [];
		foreach($articles as $article) {
			$ret[] = $this->convertToArticleObject($article->data);
		}
		return $ret;
	}
}
