import os
import subprocess

def convert_to_m3u8(input_file, output_folder, bitrate=128, hls_time=10):
    try:
        # Tạo thư mục đầu ra nếu chưa tồn tại
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        # Tạo tên file đầu ra với định dạng m3u8
        output_m3u8_name = os.path.splitext(os.path.basename(input_file))[0] + '.m3u8'
        output_m3u8_path = os.path.join(output_folder, output_m3u8_name)

        # Gọi lệnh ffmpeg để chuyển đổi file thành định dạng M3U8
        subprocess.run([
            'ffmpeg',
            '-i', input_file,
            '-c:a', 'aac',
            '-b:a', f'{bitrate}k',
            '-hls_time', str(hls_time),
            '-hls_list_size', '0',
            output_m3u8_path
        ], check=True)
        print(f"Chuyển đổi thành công: {input_file}")
    except subprocess.CalledProcessError as e:
        print(f"Lỗi khi chuyển đổi {input_file}: {e}")

def convert_folder_to_m3u8(folder_path, output_folder, bitrate=128, hls_time=10):
    # Lặp qua tất cả các file trong thư mục đầu vào
    for file_name in os.listdir(folder_path):
        input_file_path = os.path.join(folder_path, file_name)

        # Chỉ xử lý các file có định dạng mp3 hoặc mp4
        if file_name.lower().endswith(('.mp3', '.mp4')):
            # Tạo thư mục đầu ra với tên là tên file gốc
            output_subfolder = os.path.join(output_folder, os.path.splitext(file_name)[0])

            # Thực hiện chuyển đổi và lưu vào thư mục mới
            convert_to_m3u8(input_file_path, output_subfolder, bitrate, hls_time)

# Đường dẫn thư mục chứa file MP3/MP4
input_folder = r'C:\Users\bichl\Downloads\DATA\Chủ nghĩa khắc kỷ'

# Đường dẫn thư mục đầu ra cho các file M3U8
output_folder = r'C:\Users\bichl\Downloads\DATA\Chủ nghĩa khắc kỷ - convert'

# Thực hiện chuyển đổi
convert_folder_to_m3u8(input_folder, output_folder)
