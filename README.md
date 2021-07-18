# EGL Bot

## A discord bot made for the Edge Gamers Lounge competitive League of Legends server.

This bot was put together for the EGL League of Legends circuit to help keep track of the teams and their assigned players. Each player is assigned a point value based on their performance as well as their SoloQ ranks which can be altered by any trusted moderator on the Discord with permissions.

This bot also keeps track of free agents in the server as well, and these players are sorted by their point values on the leaderboard command as well.

This code was not designed for straight reusability by other servers, but it does serve as a good foundation for a lot of popular League of Legends amateur circuits, which is why I have made this repository public. I encourage other developers in other servers to make use of a bot to track their players as it can greatly increase their productivity, as well as some of the stats they can provide for spectators of the circuit.

This bot is made with JavaScript, and all player information is saved in a MongoDB Atlas Cloud Database. A sample config.json is placed in the root of the project that is used to store all API keys and OAuth tokens.

The file structure of this project is simple. Any new commands should be added to the commands folder, where they are exported to main.js on runtime. To alter or create new MongoDB schemas, they can be placed in the schema folder as well.

<strong>For any inquiries about the creation of a Discord Bot for your competitive circuit/server (can do a variety of games), please contact me at rajendranpradhapan@gmail.com for further information. Pricing is based on the estimated size of the project.

If there are any major bugs spotted in the bot, please feel free to email me at the same address and I will try to fix it as soon as possible!
</strong>


