<?php

namespace WorldNews;

class SourceCollection implements \ArrayAccess, \Iterator
{
  public $sources;
  private $position;

  public function __construct() {
    $this->position = 0;
  }

  public function rewind()
  {
    $this->position = 0;
  }

  public function current()
  {
    return $this->sources[$this->position];
  }

  public function key()
  {
    return $this->position;
  }

  public function next()
  {
    $this->position = $this->position + 1;
  }

  public function valid()
  {
    return isset($this->sources[$this->position]);
  }

  public function offsetExists($offset)
  {
    if(isset($this->sources[$offset])) {
      return true;
    }
    return false;
  }

  public function offsetGet($offset)
  {
    return $this->sources[$offset];
  }

  public function offsetSet($offset, $value)
  {
    if(isset($this->sources[$offset])) {
      $this->sources[$offset] = $value;
    } else {
      $this->sources[] = $value;
    }
  }

  public function offsetUnset($offset)
  {
    unset($this->sources[$offset]);
  }

  public function toJson()
  {
    $ret = "[";
    foreach($this->sources as $source) {
      $ret = $ret . $source->toJson() . ",";
    }
    $ret = substr($ret, 0, -1);
    $ret = $ret . "]";
    return $ret;
  }
}

class BaseSource {

  public $name;
  public $url;
  public $endpoint;
  public $category;

  public function toJson()
  {
    $attributes = (array) $this;
    $json = json_encode($attributes);
    return $json;
  }

  public static function loadSource($source_shortname)
  {
    $source_name = self::getSourceClass($source_shortname);
    $source_exists = self::sourceExists($source_name);

    if($source_exists) {
      throw new \Exception("Source \"$source_name\" doesnt exists!");
    } else {
      $source = new $source_name;
      return $source;
    }
  }

  private static function getSourceClass($source_shortname)
  {
    $source_name = self::getSourceName($source_shortname);
    return $source_name;
  }

  private static function sourceExists($source_name)
  {
    $source_exists = !class_exists($source_name);
    return $source_exists;
  }

  private static function getSourceName($source_shortname)
  {
    $source_name = "WorldNews\Sources\\" . ucfirst($source_shortname);
    return $source_name;
  }

  public static function getAllSources()
  {
    $ret = new SourceCollection();
    $all_classes = get_declared_classes();
    foreach($all_classes as $class) {
      if(strpos($class, "WorldNews\Sources") !== false) {
        $ret[] = new $class;
      }
    }
    return $ret;
  }
}
