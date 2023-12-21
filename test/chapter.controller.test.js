// File: api.test.js

const express = require('express');
const app = express(); // Thay đổi đường dẫn tới file chứa ứng dụng của bạn
const { addChapter } = require('../controller/chapter.controller');  // Thay đổi đường dẫn tới file chứa controller của bạn
const Book = require('../model/book.model');  // Thay đổi đường dẫn tới model Book của bạn
const Chapter = require('../model/chapter.model');  // Thay đổi đường dẫn tới model Chapter của bạn










describe('getChapterById API', () => {
    it('should get a specific chapter by ID', async () => {
      // Tạo một chapter để test
      const newChapter = new Chapter({
        name: 'Chapter 1',
        audio: 'audio-link.mp3',
      });
      const savedChapter = await newChapter.save();
  
      // Gửi request để lấy chapter theo ID
      const response = await request(app)
        .get(`/api/chapters/${savedChapter._id}`)
        .expect(200);
  
      // Kiểm tra xem response có chứa dữ liệu chapter không
      expect(response.body).toHaveProperty('name', 'Chapter 1');
      expect(response.body).toHaveProperty('audio', 'audio-link.mp3');
    });
  
    it('should return 404 if the chapter is not found', async () => {
      // Dữ liệu không tồn tại
      const nonExistentChapterId = 'non-existent-id';
  
      // Gửi request để lấy chapter không tồn tại
      const response = await request(app)
        .get(`/api/chapters/${nonExistentChapterId}`)
        .expect(404);
  
      // Kiểm tra xem response có chứa thông báo lỗi không
      expect(response.body).toHaveProperty('error', 'Chapter not found');
    });
  
    // Thêm các test case khác tùy thuộc vào logic của bạn
  });



// describe('addChapter API', () => {
//   it('should add a new chapter to an existing book and return the chapter', async () => {
//     // Mocking data
//     const mockReq = {
//       body: {
//         book_id: 'mockBookId',
//         name: 'Chapter 1',
//         audio: 'audio-link.mp3',
//       },
//     };

//     const mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     const mockExistingBook = {
//       _id: 'mockBookId',
//       chapters: [],
//     };

//     // Mocking Book.findById
//     Book.findById = jest.fn().mockResolvedValueOnce(mockExistingBook);

//     // Mocking Chapter.save
//     Chapter.prototype.save = jest.fn().mockResolvedValueOnce({
//       _id: 'mockChapterId',
//       book_id: 'mockBookId',
//       name: 'Chapter 1',
//       audio: 'audio-link.mp3',
//     });

//     // Mocking Book.save
//     Book.prototype.save = jest.fn();

//     // Call the addChapter function
//     await addChapter(mockReq, mockRes);

//     // Assertions
//     expect(Book.findById).toHaveBeenCalledWith('mockBookId');
//     expect(mockRes.status).toHaveBeenCalledWith(201);
//     expect(mockRes.json).toHaveBeenCalledWith({
//       _id: 'mockChapterId',
//       book_id: 'mockBookId',
//       name: 'Chapter 1',
//       audio: 'audio-link.mp3',
//     });
//     expect(Book.prototype.save).toHaveBeenCalled();
//   });

//   it('should return 404 if the book_id is not found', async () => {
//     // Mocking data
//     const mockReq = {
//       body: {
//         book_id: 'nonExistentBookId',
//         name: 'Chapter 1',
//         audio: 'audio-link.mp3',
//       },
//     };

//     const mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Mocking Book.findById to return null (book not found)
//     Book.findById = jest.fn().mockResolvedValueOnce(null);

//     // Call the addChapter function
//     await addChapter(mockReq, mockRes);

//     // Assertions
//     expect(Book.findById).toHaveBeenCalledWith('nonExistentBookId');
//     expect(mockRes.status).toHaveBeenCalledWith(404);
//     expect(mockRes.json).toHaveBeenCalledWith({ message: 'Book not found' });
//   });

//   // Add more test cases as needed
// });


// describe('updateChapter API', () => {
//     it('should update an existing chapter and return the updated chapter', async () => {
//       // Tạo một chapter để test
//       const newChapter = new Chapter({
//         name: 'Chapter 1',
//         audio: 'audio-link.mp3',
//       });
//       const savedChapter = await newChapter.save();
  
//       // Dữ liệu cập nhật
//       const updatedData = {
//         name: 'Updated Chapter',
//         audio: 'updated-audio-link.mp3',
//       };
  
//       // Gửi request để cập nhật chapter
//       const response = await request(app)
//         .patch(`/api/chapters/${savedChapter._id}`)
//         .send(updatedData)
//         .expect(200);
  
//       // Kiểm tra xem response có chứa dữ liệu đã được cập nhật không
//       expect(response.body).toHaveProperty('name', 'Updated Chapter');
//       expect(response.body).toHaveProperty('audio', 'updated-audio-link.mp3');
//     });
  
//     it('should return 404 if the chapter is not found', async () => {
//       // Dữ liệu không tồn tại
//       const nonExistentChapterId = 'non-existent-id';
  
//       // Gửi request để cập nhật chapter không tồn tại
//       const response = await request(app)
//         .patch(`/api/chapters/${nonExistentChapterId}`)
//         .send({ name: 'Updated Chapter' })
//         .expect(404);
  
//       // Kiểm tra xem response có chứa thông báo lỗi không
//       expect(response.body).toHaveProperty('error', 'Chapter not found');
//     });
  
//     // Thêm các test case khác tùy thuộc vào logic của bạn
//   });