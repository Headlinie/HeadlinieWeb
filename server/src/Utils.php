<?php

namespace WorldNews;

class Utils {
	public static function replace_images($input) {
		// $replacement = " [ReplacedImage] ";
		$replacement = ' <span class=\"btn-lg glyphicon glyphicon-picture\"></span> ';
		$pattern = "(<img.*>[A-Za-z0-9_.]+</img>|<img[^>]+\>)";
		// $pattern = "(<.*img.*>[a-zA-Z]</.*img.*>|<.*img.*/>)";
		$output = preg_replace($pattern, $replacement, $input);
		$output = trim($output);
		return $output;
	}
	public static function get_domain($url) {
		$parsed_url = parse_url($url);
		$domain = $parsed_url['host'];
		if(substr($domain, 0, 4) === "www.") {
			$domain = substr($domain, 4, strlen($domain) - 4);
		}
		return $domain;
	}
	public static function remove_html_tags($html) {
		$html_fragment = preg_replace(
			'/^<!DOCTYPE.+?>/',
			'',
			str_replace(
				array('<html>', '</html>', '<body>', '</body>'),
				array('', '', '', ''),
				$html
		));
		return $html_fragment;
	}
	public static function make_links_external($input) {
		//return $input;
		$dom = new \DOMDocument();
		libxml_use_internal_errors(true);
		$dom->loadHtml('<meta http-equiv="content-type" content="text/html; charset=utf-8">' . $input);

		$xpath = new \DOMXpath($dom);
		foreach ($xpath->query('//a[not(contains(@href, "protected"))]') as $node) {
				$node->setAttribute('target', '_blank');
		}
		$output = self::remove_html_tags($dom->saveHtml());
		return trim($output);
	}
}
