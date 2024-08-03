## Torrents CLI

A simple CLI tool to search and download torrents from the command line. It uses the Puppeteer library to scrape the web for torrent links. The output can be a text file with the links or a torrent client to download the files or a json file with details of the torrents and magnet links.

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

### Output formats

- `--output=text`: The output is a text file with the magnet links.
- `--output=json`: The output is a json file with the details of the torrents and magnet links.

### Example

```bash
$ node cli.js --output=text
```
