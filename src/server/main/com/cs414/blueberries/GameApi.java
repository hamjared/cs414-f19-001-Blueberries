package com.cs414.blueberries;

import com.google.gson.Gson;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.awt.*;
import java.util.ArrayList;
import java.util.HashMap;

import static spark.Spark.*;

public class GameApi {
    public static void main(String[] args) {

        GlobalData.readPlayers(GlobalData.PLAYERS_FILENAME);
        GlobalData.readGames(GlobalData.GAMES_FILENAME);

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Request-Method", "*");
            response.header("Access-Control-Allow-Headers", "*");

        });
//        after((Filter) (request, response) -> {
//            response.header("Access-Control-Allow-Origin", "*");
//            response.header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
//            response.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
//        });

        get("/hello", (req, res) -> "Hello World");

        // Register new player
        post("/register", (req, res) -> {
            Gson gson = new Gson();
            //System.out.println(req.body());
            Player player = gson.fromJson(req.body(), Player.class);
            System.out.println("Registering new player: " + player.toString());
            return player.register();
        });

        //unregister player
        post("/unregister", (req, res) -> {
            Gson gson = new Gson();
            System.out.println(req.body());
            Player player = gson.fromJson(req.body(), Player.class);
            System.out.println("Unregistering player: " + player.toString());
            return player.Unregister();
        });

        // Log in player
        post("/login", (req, res) -> {
            //System.out.println(req.body());
            JSONObject body = (JSONObject) new JSONParser().parse(req.body());
            Player player = GlobalData.players.get(body.get("email"));
            if (player != null) {
                return player.buildLoginResponse((String) body.get("password"), body);
            }
            return "fail";
        });

        // Send an updated board
        post("/game", (req, res) -> {
            //System.out.println(req.body());
            Gson gson = new Gson();
            Game game = gson.fromJson(req.body(), Game.class);
            if (game != null) {
                GlobalData.games.put(game.getId(), game);
                return "Board updated";
            }
            return "Board not found";
        });

        // Get all games that a player is a part of
        post("/getGame", (req, res) -> {
            Gson gson = new Gson();
            //System.out.println(req.body());
            JSONObject body = (JSONObject) new JSONParser().parse(req.body());

            HashMap<String, ArrayList<Game>> gamesMap = new HashMap<>();

            gamesMap.put("sent", new ArrayList<>());
            gamesMap.put("pending", new ArrayList<>());
            gamesMap.put("active", new ArrayList<>());
            gamesMap.put("finished", new ArrayList<>());

            GlobalData.games.forEach((id, game) -> {
                game.getBoard().updateMoves();
                if (!game.ready) {
                    if (game.getP1().equals(body.get("email"))) gamesMap.get("sent").add(game);
                    if (game.getP2().equals(body.get("email"))) gamesMap.get("pending").add(game);
                }
                else if (game.ready && !game.finished){
                    if(game.getP1().equals(body.get("email"))) gamesMap.get("active").add(game);
                    if(game.getP2().equals(body.get("email"))) gamesMap.get("active").add(game);

                }
                else{
                    if(game.getP1().equals(body.get("email"))) gamesMap.get("finished").add(game);
                    if(game.getP2().equals(body.get("email"))) gamesMap.get("finished").add(game);
                }
            });
            //System.out.println("Sending games for "+body.get("email"));
            return gson.toJson(gamesMap);
        });

        post("/sendForfeit", (req, res) -> {
            System.out.println("got request for sendForfeit");
            JSONObject body = (JSONObject) new JSONParser().parse(req.body());
            Game game = GlobalData.games.get(Integer.parseInt((String) body.get("id")));
            System.out.println("game set");
            game.finished = true;
            System.out.println("game finished");
            game.setEndTimeToNow();
            System.out.println("game end time set");
            game.setWinner("winner");
            System.out.println("set data done for sendForfeit");
            GlobalData.writeGames(GlobalData.GAMES_FILENAME);
            return "forfeit game";
        });

        post("/acceptInvite", (req, res) -> {
            JSONObject body = (JSONObject) new JSONParser().parse(req.body());
            Game game = GlobalData.games.get(Integer.parseInt((String) body.get("id")));
            game.ready = true;
            game.setStartTimeToNow();
            GlobalData.writeGames(GlobalData.GAMES_FILENAME);
            return "Invite accepted";
        });


        post("/rejectInvite", (req, res) -> {
            JSONObject body = (JSONObject) new JSONParser().parse(req.body());
            Game game = GlobalData.games.remove(Integer.parseInt((String) body.get("id")));
            GlobalData.writeGames(GlobalData.GAMES_FILENAME);
            return "Invite rejected";
        });

        post("/sendInvite", (req, res) -> {
            //System.out.println(req.body());
            JSONObject body = (JSONObject) new JSONParser().parse(req.body());
            String p1 = (String) body.get("p1");
            String p2 = null;
            String p2Name = (String) body.get("p2Name");
            String p1Name = GlobalData.players.get(p1).getUserId();
            for(String email : GlobalData.players.keySet()){
                if(GlobalData.players.get(email).getUserId().equals(p2Name))
                    p2 = email;
            }
            Game game = new Game(p1, p2, p1Name, p2Name);
            GlobalData.games.put(game.getId(), game);
            GlobalData.writeGames(GlobalData.GAMES_FILENAME);
            return "Game created: " + game.toString();
        });

        post("/move", (req, res) -> {
            Gson gson = new Gson();
            //System.out.println(req.body());
            MoveApiDeserializer moveData = gson.fromJson(req.body(), MoveApiDeserializer.class);
            if(moveData != null){
                Game serverInstanceOfGameObject = GlobalData.games.get(moveData.getId());
                if(!serverInstanceOfGameObject.isTurnOfPlayer(moveData.getPlayer())){
                    return "Move Not Made, Not That Player's Turn";
                }
                // Gets the piece by parsing the req parameters. Assumes Integer
                Point oldPosition = new Point(moveData.getOldX(), moveData.getOldY());
                Point newPosition = new Point(moveData.getNewX(), moveData.getNewY());
                Piece piece = serverInstanceOfGameObject.getBoard().getPieceAtPoint(oldPosition);
                if(piece.equals(null)){
                    return "No peice at position " + moveData.getOldX() + ", " + moveData.getOldY();
                }
                piece.updateMoves();
                boolean response = serverInstanceOfGameObject.getBoard().movePiece(piece, newPosition, serverInstanceOfGameObject.getTurn());
                if(!response){
                    return gson.toJson("Piece Not Moved");
                }
                serverInstanceOfGameObject.incrementTurn();
                piece.updateMoves();
            }
            // System.out.println(GlobalData.games.get(game.getId()));
            return gson.toJson("Piece Moved");
        });
    }

}