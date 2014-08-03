<?php

class Utils {
	public static function replace_images($input) {
		$replacement = " [ReplacedImage] ";
		$pattern = "(<img.*>[A-Za-z0-9_.]+</img>|<img[^>]+\>)";
		// $pattern = "(<.*img.*>[a-zA-Z]</.*img.*>|<.*img.*/>)";
		$output = preg_replace($pattern, $replacement, $input);
		$output = trim($output);
		return $output;
	}
	public static function get_domain($url) {
		$parsed_url = parse_url($url);
		return $parsed_url['host'];
	}
}
