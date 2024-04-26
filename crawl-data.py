# from pytube import Playlist
# import os

# def download_playlist(playlist_url, output_path):
#     playlist = Playlist(playlist_url)

#     playlist_title = playlist.title
#     playlist_folder_path = os.path.join(output_path, playlist_title)

#     for video in playlist.videos:
#         try:
#             audio_stream = video.streams.filter(only_audio=True).first()
#             print(f"Downloading: {video.title}")

#             if not os.path.exists(playlist_folder_path):
#                 os.makedirs(playlist_folder_path)

#             audio_stream.download(playlist_folder_path)
#             print(f"Downloaded: {video.title}")
#         except Exception as e:
#             print(f"Error downloading {video.title}: {str(e)}")

# if __name__ == "__main__":
#     playlist_url = "https://www.youtube.com/playlist?list=PLX_Y9QOrbzKECA4glzYhs0RbtxNsi6N6i" #thay url playlist
#     output_path = "C:/Users/bichl/Downloads"

#     download_playlist(playlist_url, output_path)


import os

def adjust_file_names(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            old_file_path = os.path.join(root, file)
            new_file_name = file.replace(" -", "-") # Loại bỏ phần "Quy luật 1 [Làm cho nó rõ ràng]"
            new_file_path = os.path.join(root, new_file_name)
            if old_file_path != new_file_path:
                os.rename(old_file_path, new_file_path)
                print(f"Renamed {old_file_path} to {new_file_path}")

# Thay thế 'root_dir' bằng đường dẫn của thư mục chứa các tệp âm thanh của bạn
root_dir = 'data/bookaudio/Đừng lựa chọn an nhàn khi còn trẻ/Chương 8'
adjust_file_names(root_dir)