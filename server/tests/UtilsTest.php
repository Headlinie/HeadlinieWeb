<?php

namespace WorldNewsTest;

use WorldNews\Utils;

class ReplaceImagesTest extends \PHPUnit_Framework_TestCase
{
    public static $replaced_image = '<span class=\"btn-lg glyphicon glyphicon-picture\"></span>';

    public function testRemoveImgTag()
    {
        $testCases = [
            "<img>Something</img>" => "[ReplacedImage]",
            "<img/>Something" => "[ReplacedImage] Something",
            "Something<img/>" => "Something [ReplacedImage]",
            "<img src='Blabla.jpg'/>Something" => "[ReplacedImage] Something",
            "<img src='hej.jpg'/>I love bread<img src='hej.jpg'/>" => "[ReplacedImage] I love bread [ReplacedImage]",
        ];

        foreach ($testCases as $input => $expected_output) {
            $expected_output = str_replace("[ReplacedImage]", ReplaceImagesTest::$replaced_image, $expected_output);
            $real_output = Utils::replace_images($input);
            $this->assertEquals($expected_output, $real_output);
        }
    }

    public function testGetsSubdomainWithoutWWW() {
        $testCases = [
            "http://www.google.com" => "google.com",
            "http://www.google.com/nasdf" => "google.com",
            "https://google.com/nasdf" => "google.com",
            "http://google.com/nasdf" => "google.com",
            "https://sites.google.com/nasdf" => "sites.google.com",
        ];
        foreach ($testCases as $input => $expected_output) {
            $real_output = Utils::get_domain($input);
            $this->assertEquals($expected_output, $real_output);
        }
    }

    public function testMakeAllLinkTargetsBlank()
    {
        $testCases = [
            '<a href="#">Something</a>' => '<a href="#" target="_blank">Something</a>',
            '<a href="#" target>Link</a> Something' => '<a href="#" target="_blank">Link</a> Something',
            '<a href="#" target="something">Link</a> Something' => '<a href="#" target="_blank">Link</a> Something',
            'Something <a href="#" target="something">Link</a> Something' => 'Something <a href="#" target="_blank">Link</a> Something'
        ];

        foreach ($testCases as $input => $expected_output) {
            $real_output = Utils::make_links_external($input);
            $this->assertEquals($expected_output, $real_output);
        }
    }

    public function testUsesCacheIfAlreadyGotArticle() {}

    public function testRemovesCacheIfExistsWithForceReload() {}

    public function testCanBuildReadabilityURL() {}
}
