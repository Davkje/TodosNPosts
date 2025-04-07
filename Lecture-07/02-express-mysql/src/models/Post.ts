export class Post {
  id: number = 0;
  title: string = "";
  content: string = "";
  author: string = "";

  constructor (title: string, content: string, author: string) {
    this.id = Math.round(Math.random() * 1000);
    this.title = title;
    this.content = content;
    this.author = author;
  }
};