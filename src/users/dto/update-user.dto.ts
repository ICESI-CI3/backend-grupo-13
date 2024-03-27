export class UpdateUserDto {
    username?: string;
    email?: string;
  }
  
  export class UpdateReaderDto extends UpdateUserDto {
    favoriteGenre?: string;
    bookList?: string;
  }
  
  export class UpdateAuthorDto extends UpdateUserDto {
    penName?: string;
    biography?: string;
    booksWritten?: string;
  }
  
  export class UpdateAdminDto extends UpdateUserDto {
    accessLevel?: number;
  }
  
