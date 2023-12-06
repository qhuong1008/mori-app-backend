from pytube import Playlist
import os

def download_playlist(playlist_url, output_path):
    playlist = Playlist(playlist_url)

    playlist_title = playlist.title
    playlist_folder_path = os.path.join(output_path, playlist_title)

    for video in playlist.videos:
        try:
            audio_stream = video.streams.filter(only_audio=True).first()
            print(f"Downloading: {video.title}")

            if not os.path.exists(playlist_folder_path):
                os.makedirs(playlist_folder_path)

            audio_stream.download(playlist_folder_path)
            print(f"Downloaded: {video.title}")
        except Exception as e:
            print(f"Error downloading {video.title}: {str(e)}")

if __name__ == "__main__":
    playlist_url = "" #thay url playlist
    output_path = "C:/Users/bichl/Downloads"

    download_playlist(playlist_url, output_path)
