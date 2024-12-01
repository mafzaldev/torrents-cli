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
3. Run the command `torrents-cli --input=<input-file> [--output=<output-file>]` in the terminal. See the options below.

### CLI Options

| Option     | Required | Description                                                                                    |
| ---------- | -------- | ---------------------------------------------------------------------------------------------- |
| `--input`  | Yes      | The path to the file containing the list of items to search for.                               |
| `--output` | No       | The name of the output file (with or without extension). Defaults to `scrapped-torrents.json`. |

#### Output Formats

- If no extension is provided, the default format is JSON.
- Supported output extensions: `.json` and `.txt`.

Examples:

- `--output=torrent-details.json` --> Saves detailed results in JSON format.
- `--output=magnet-links.txt` --> Saves magnet links in plain text format.

### Input file format

The input file should list the names of items (e.g., movies) to search for, one per line. For accurate results, include the year of release and, if possible, specify the desired video quality (e.g., 1080p, 720p). This helps narrow down the search to match your preferences.

```txt
Inception (2010) 1080p
The Dark Knight (2008) 720p
The Shawshank Redemption (1994) 1080p
```
