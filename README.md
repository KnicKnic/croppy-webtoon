# croppy-webtoon
A bookmarklet and supporting files to update webtoon uploading to call croppy automatically.

# Installation
## Desktop
1. Ensure the bookmark toolbar is enabled in your browser
1. click the star or heart for this webpage
1. right click on the new link in your favorites and type edit url
1. enter the following as your location.
```
javascript:(function(){var jsCode = document.createElement('script');jsCode.setAttribute('type','module');jsCode.setAttribute('src', 'https://knicknic.github.io/croppy/add_webtoon_croppy.js');document.body.appendChild(jsCode);}());
```

## Mobile
Create a bookmark, and then update the location to 
```
javascript:(function(){var jsCode = document.createElement('script');jsCode.setAttribute('type','module');jsCode.setAttribute('src', 'https://knicknic.github.io/croppy/add_webtoon_croppy.js');document.body.appendChild(jsCode);}());
```
### iPhone / iPad specific instructions
It is the same as mobile instructions, but you can watch someone walk through the steps for their project in the following video.

[Example video](https://www.youtube.com/watch?v=XlhENZAoDzk) but use the location from the mobile section.

# Usage
1. Go to the webtoon episode upload page. 
1. Click the bookmark you saved (every time you load the page)
1. Dismiss popup or toast notification saying `Loaded croppy extension`.
1. Add larger files / longer files
    1. You may have to wait a few seconds (up to 60 seconds)
        1. Currently there is not any loading logo when croppy is working

