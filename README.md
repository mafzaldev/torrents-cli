## Torrents CLI

A simple CLI to scrap torrent magnet links from the command line.

### Description

It uses the Puppeteer library to scrape the web(1337x) for torrent links. The output can be a text file with the links or a torrent client to download the files or a json file with details of the torrents and magnet links.

### Dependencies

- Node.js
- Puppeteer
- Chrome

### How to use

1. Install the package globally `npm install -g torrents-cli`
2. Create a file with any name let's say `movies.txt` with the names of the movies.
3. Run the command `torrents-cli --input=movies.txt -<output-format>` in the terminal. See the options below.

### CLI Options

- `--input=`: (Required) The file containing the names of the movies to search for.
- `--output=`: (Optional) The file name without any extension to save the output.
- `-json or -j`: (Default) The output is a json file with the details of the torrents and magnet links. (Better for detailed information)
- `-text or -t`: The output is a text file with the magnet links. (Better for copy pasting in qBittorrent)

### Movies file format

The `movies.txt` file should contain the names of the movies to search for. Each movie should be in a new line. Use the following format for better and accurate results:

```txt
Inception (2010)
The Dark Knight (2008)
The Shawshank Redemption (1994)
```
