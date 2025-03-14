# Bitrate Display

## Installation and Usage
1. Navigate to the project directory in the terminal.
2. Run `npm install` to install dependencies.
3. Start the server by running `npm start` or `node index.js`.
4. Open `http://localhost:3000` in your browser.
5. Alternatively, install dependencies with `bun install` and start the server using `bun run start` or `bun run index.js`.

## OBS Integration
1. Add a new "Browser Source" in OBS.
2. Set the source URL to `http://localhost:3000/index.html`.
3. Append the required query parameters to the URL:
   - `statsUrl`: The URL to get the bitrate info (e.g., `http://example.com/bitrate`)
   - `type`: Either `rtmp` or `srt` (e.g., `type=rtmp` or `type=srt`)
   - `streamId`: The stream identifier (e.g., `streamId=12345`)
   Example: `http://localhost:3000/index.html?statsUrl=http://example.com/bitrate&type=rtmp&streamId=12345`
4. Update the refresh rate of the "Browser Source" in OBS to track real-time bitrate values.

## Supported Protocols
- **RTMP**: Parses XML data to extract bitrate information.
- **SRT**: Parses JSON data to extract bitrate information.
