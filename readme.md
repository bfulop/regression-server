# Visual regression test server

Creates screenshots of pages and page elements at different sizes and send back the results of the image diffing.

### Under 1 second test feedback

- Keeps the target (headless) browsers open
- If you use it with Browsersync the CSS is injected, without having to reload the page
- Adding a SHA checking can add an another level of filtering for the screenshots comparison (not implemented yet)

### Targets definition

Takes a targets definition in the following format:

```javascript
const baseUrl = 'http://127.0.0.1:3014/[base path]/'

const testtargets = [
  {
    route: '[route/to/a/page]',
    targets: [
      {
        width: 1200,
        elements: ['[a valid puppeteer selector]']
      },
      {
        width: 768,
        elements: ['header.pageheader']
      }
    ]
  }
]
```

For now it exposes two routes: `/snapshot` and `/compare`.

`$ curl -s http://[your server's address]:3202/snapshot`

Will take the snapshot images.

`$ curl -s http://[your server's address]:3202/compare`

Will give you back a list of targets and number of pixels that are different compared to the snapshot.


### Regression watcher

The server is meant to be used with the _Regression watcher_ client (not yet published) that will notify the server to rerun the tests.

### Use it on a (cloud) server

Ideally you would use this on a server (Heroku, etc), but can of course be run locally as well. For Linux servers run `src/index` with the `nosandbox` option (`$ node src/index nosandbox`).  
I prefer to run in on my server which is much faster than my laptop.

### 🚧 Work in progress

It's just slightly more than a proof of concept. I put this together very quickly to help me with a frontend project, but I admit having little experience with Puppeteer and Pixelmatch.

## Credits

The "engine" (using Puppeteer and Pixelmatch) is based on an article by Monica Dinculescu: [Automatic visual diffing with Puppeteer](https://meowni.ca/posts/2017-puppeteer-tests/)

