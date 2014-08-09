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
}
