# Social share counter

A lightweight (~1k minified and gzipped) JavaScript utility that enhances a list of social share links by counting social shares in two ways:

1. Calculates the number of shares for each network and displays it beside its respective share link.
2. Calculates the total number of shares for all networks and displays it in a specified element.

It also provides a further enhancement by opening popups when the social share links are pressed.

Supported networks are:

- Facebook
- Twitter
- Google+
- LinkedIn
- Buffer

## Usage

### To display the number of shares per network beside each share link

Create an empty element for each share link, typically beside each share link. Each empty element must contain an HTML class name with the name of the network and share a common prefix. The default prefix is `socialCount-`.

HTML:

```
<span class="socialCount-twitter"></span>
<span class="socialCount-facebook"></span>
<span class="socialCount-gplus"></span>
<span class="socialCount-linkedin"></span>
<span class="socialCount-buffer"></span>
```

Call SocialCounts on each element some way, loops are good.

JS:

```
var spans = document.querySelectorAll('[class^=socialCount]');

for(var i = 0, ii = spans.length; i < ii; i++) {
  SocialCounts(spans[i]);
}
```

An optional config object can be passed as a second argument. See [options](#options) below.

### To display the total of all social shares

Same as above but the config object must contain a `total` property set to `true`.

`new SocialCounts(document.getElementById('total'), {total: true});`

## Options

| Option | Description |
|---|---|
| `url` | The URL of the page that the share counts are for. Default is the current page using `window.location.href` |
| `prefix` | The common prefix for the empty elements used when displaying individual shares. Default is `socialCount-` |
| `total` | Must be set to a truthy value for the total number of shares to be displayed in the specified element.

For example to change the prefix to `js-` and the URL to the Google home page while displaying the total number of shares, use:

`new SocialCounts(referenceToYourElement, {prefix: 'js-', url: 'https://www.google.com/', total: true});`

## Demo

http://InnovationEnterprise.github.io/social-share-count/example.html

## Code of Conduct

In order to have an inclusive and welcoming community around the open source code we produce we have decided to adhere to this [code of conduct](CONDUCT.md).

Please adhere to this code of conduct in any interactions you have in this community. It is strictly enforced on all official Innovation Enterprise repositories, websites, and resources. If you encounter someone violating these terms, please let a maintainer ([@derekjohnson](https://github.com/derekjohnson)) know and we will address it as soon as possible.

## Follow Us

If you like what we have done here or have any questions be sure to reach out to us on [Twitter](https://twitter.com/IE_DevTeam)
