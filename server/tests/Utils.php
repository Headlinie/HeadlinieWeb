<?php
require_once('src/Utils.php');

class ReplaceImagesTest extends \PHPUnit_Framework_TestCase
{
    public function testRemoveImgTag()
    {
        $testCases = [
            "<img>Something</img>" => "[ReplacedImage]",
            "<img/>Something" => "[ReplacedImage] Something",
            "Something<img/>" => "Something [ReplacedImage]",
            "<img src='Blabla.jpg'/>Something" => "[ReplacedImage] Something",
            "<img src='hej.jpg'/>I love bread<img src='hej.jpg'/>" => "[ReplacedImage] I love bread [ReplacedImage]",
            // Waiting with this one
            // "<img src='image.jpg' alt='Hello World'/> And that is cool" => "[ReplacedImage \"Hello World\"] And that is cool"
        ];

        foreach ($testCases as $input => $expected_output) {
            $real_output = Utils::replace_images($input);
            $this->assertEquals($expected_output, $real_output);
        }
    }

    public function testGetsSubdomainWithoutWWW() {}

    public function testUsesCacheIfAlreadyGotArticle() {}

    public function testRemovesCacheIfExistsWithForceReload() {}

    public function testCanBuildReadabilityURL() {}
}
