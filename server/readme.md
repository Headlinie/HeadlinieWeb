# Server for Worldnews


This is the server serving content for the WorldNews frontend

# Architecture


* Source - A source like reddit.com or news.ycombinator.com.
* Article - A article containing URL, title, category and

## Endpoints

* article/{url}
* source/{name}

Returns a list of articles


## Flow

When application loads, it uses the last used source to load a list of articles.
These articles contain everything but the content. To get the content, a request to article/{url} must be made.


## Models

### Source


* Name:String
* Url:String (not used for now)
* Endpoint:String
* Category:String (not used for now)


### Article

* Title:String
* Content:Text
* DatePosted:DateTime (not used for now)
* Domain:String
* Comments:Url
* Link:Url
* Category:String
