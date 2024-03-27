export class CreateUserDto {
    username: string;
    password: string;
    email: string;
  }
  
  export class CreateReaderDto extends CreateUserDto {
    favoriteGenre: string;
    bookList: string;
  }
  
  export class CreateAuthorDto extends CreateUserDto {
    penName: string;
    biography: string;
    booksWritten: string;
  }
  
  export class CreateAdminDto extends CreateUserDto {
    accessLevel: number;
  }
  