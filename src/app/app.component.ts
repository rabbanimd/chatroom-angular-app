import { Component } from '@angular/core';
declare var SockJS : any;
declare var Stomp : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-app';

  greetings : string [] = [];

  disabled = true;

  newmessage = '';

  private stompClient : any;
  
  constructor(){
  }

  ngOnInit()
  {
    this.connect();
  }

  setConnected(connected:boolean)
  {
    this.disabled = !connected;
    if(connected)
    {
      this.greetings = [];
    }
  }

  connect(){
    const socketUrl =  'http://localhost:8080/testchat';
    const socket = new SockJS(socketUrl);
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame: any){
      console.log("connected "+frame);
      _this.stompClient.subscribe('/start/initial', function (hello:any) {
        console.log(JSON.parse(hello.body));
        _this.showMessage(JSON.parse(hello.body));
      });
    });
  }


  sendMessage() {
    this.stompClient.send(
      '/current/resume',
      {},
      JSON.stringify(this.newmessage)
    );
    this.newmessage = ""; 
  }

  showMessage(message:any) {
    this.greetings.push(message);
  }
}
