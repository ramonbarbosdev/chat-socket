import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {

  messages: Message[] = [];
  messageInput = '';
  userId: string = ""
  messageList: any[] = [];

  constructor(private chatService: ChatService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params["userId"]

    this.chatService.subscribeToRoom('abc'); 
    // this.chatService.getMessages().subscribe((msg: Message) => {
    //   this.messages.push(msg);
    // });
  }

  sendMessage() {

    const chatmessage: Message = {
      user: this.userId,
      timestamp: new Date(),
      message: this.messageInput.trim()
    };

    this.chatService.sendMessage("abc", chatmessage)
    this.messageInput = '';
  }
}
