## Torrents CLI

A simple CLI tool to search and download torrents from the command line.

### Description

It uses the Puppeteer library to scrape the web(1337x) for torrent links. The output can be a text file with the links or a torrent client to download the files or a json file with details of the torrents and magnet links.

### Dependencies

- Node.js
- Puppeteer
- Chrome

### How to use

1. Clone the repository `git clone https://github.com/mafzaldev/torrents-cli`
2. Move to the directory using the terminal `cd torrents-cli`
3. Install the dependencies `pnpm install`
4. Create a `movies.txt` file with the names of the movies.
5. Run the command `node cli.js` and it will search for the torrents of the movies in the `movies.txt` file.

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
$ node cli.js --output=text
```
