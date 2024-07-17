import { Component, Input } from '@angular/core';
import { UserService } from '../service/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  // TODO: Admin features, Functional show hide, block-user, profanity filter (to r, but no slurs), map all the user request and change the db

  public onlineUsers: any;
  public messages: any;
  public userSevice: UserService;
  public typedMessage: any;
  @Input() userInfo: any;

  constructor(userService: UserService) {
    this.userSevice = userService;
  }


  public getMessagesAndUsers() {
    this.messages = this.userSevice.getMessages().subscribe();
    this.onlineUsers = this.userSevice.getUsers().subscribe();
  }

  
  public saveMessage(event: any){
    this.typedMessage = event.target.value;
  }


  public reportUser(user: any){
    this.userSevice.setMessages(this.typedMessage);
  }
  public addFriend(user: any){
    this.userSevice.setMessages(this.typedMessage);
  }
  public removeFriend(user: any){
    this.userSevice.setMessages(this.typedMessage);
  }
  public setMessage(){
    this.userSevice.setMessages(this.typedMessage);
  }

  public deleteUser(user: any){
    this.userSevice.setMessages(this.typedMessage);
  }
  public deleteMessage(user: any){
    this.userSevice.setMessages(this.typedMessage);
  }

}
