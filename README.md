## Torrents CLI

A simple CLI to scrap torrent magnet links from the command line.

### Description

It uses the Puppeteer library to scrape the web(1337x) for torrent links. The output can be a text file with the links or a torrent client to download the files or a json file with details of the torrents and magnet links.

### Dependencies

- Node.js
- Puppeteer
- Chrome

### How to use

3. Install the package `npm i torrents-cli`
4. Create a `movies.txt` file with the names of the movies.
5. Run the command `torrents-cli --<options>` in the terminal. See the options below.

### Movies file format

The `movies.txt` file should contain the names of the movies to search for. Each movie should be in a new line. Use the following format for better and accurate results:

```txt
Inception (2010)
The Dark Knight (2008)
The Shawshank Redemption (1994)
```

### Output formats

- `--output=json`: The output is a json file with the details of the torrents and magnet links. (Default)(Better for detailed information)
- `--output=text`: The output is a text file with the magnet links. (Better for copy pasting in qBittorrent)

### Example

```bash
$ torrents-cli --output=text
```
