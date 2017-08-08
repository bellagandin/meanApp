import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class Server {
  private url = 'http://localhost:3001';
  private socket;

  sendMessage(key){
    console.log("help!!!",key,this.socket);
    this.socket.emit(key);
  }

  getMessages(key) {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on(key, (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }


}
