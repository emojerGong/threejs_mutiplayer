// Colyseus + Express
const colyseus = require('colyseus');
const cors = require('cors');
const http = require('http');
const express = require('express');
require('dotenv').config();
const port = process.env.WB_SERVER_PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

class MyRoom extends colyseus.Room {
  players = [];
  onCreate(options) {
    console.log('Room created with options:', options);
    this.onMessage('new-player', (client, message) => {
      // 处理新进来的玩家
      if (this.players.some((player) => player.id === message.id)) {
        const index = this.players.findIndex(
          (player) => player.id === message.id
        );
        if (index >= 0) {
          this.players[index].x = message.x;
          this.players[index].z = message.z;
        }
      } else {
        this.players.push(message);
      }

      // 广播新进来的玩家信息给其他玩家
      this.broadcast('player-joined', {
        newPlayerId: client.sessionId,
        players: this.players,
      });
    });

    this.onMessage('player-move', (client, message) => {
      // 处理新进来的玩家
      if (this.players.some((player) => player.id === message.id)) {
        const index = this.players.findIndex(
          (player) => player.id === message.id
        );
        if (index >= 0) {
          this.players[index].x = message.x;
          this.players[index].z = message.z;
        }
      } else {
        this.players.push(message);
      }

      // 广播新进来的玩家信息给其他玩家
      this.broadcast('player-move', {
        id: message.id,
        x: message.x,
        z: message.z,
      });
    });
  }

  onJoin(client, options) {
    console.log('Player joined:', client.sessionId);

    // 发送欢迎消息给新进来的玩家
    this.send(client, 'welcome', 'Welcome to the room!');
  }

  onLeave(client, consented) {
    console.log('Player left:', client.sessionId);

    const index = this.players.findIndex(
      (player) => player.id === client.sessionId
    );
    if (index >= 0) {
      this.players.splice(index, 1);
    }

    this.broadcast('player-left', { id: client.sessionId });
  }
}

const gameServer = new colyseus.Server({
  server: http.createServer(app),
});

gameServer.define('my_room', MyRoom);
gameServer.listen(port);
