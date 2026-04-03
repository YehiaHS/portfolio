#!/bin/bash
DIR="youtube_audio_files"
mkdir -p "$DIR"
cd "$DIR"

echo "Downloading audio..."
yt-dlp -x --audio-format mp3 -o "%(playlist_index)03d.%(ext)s" "https://youtube.com/playlist?list=PLUVctTo70ulBTeOl4yPcz-oY0tAGouhAn"

echo "Creating list of files..."
rm -f mylist.txt
for f in *.mp3; do
  echo "file '$PWD/$f'" >> mylist.txt
done

echo "Combining and processing silence..."
ffmpeg -y -f concat -safe 0 -i mylist.txt \
  -af "silenceremove=stop_periods=-1:stop_duration=1.5:stop_threshold=-40dB" \
  -c:a libmp3lame \
  "../combined_playlist_audio.mp3"

echo "Done! The combined file is combined_playlist_audio.mp3"
