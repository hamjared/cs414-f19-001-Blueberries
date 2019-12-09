package com.cs414.blueberries;
import java.awt.*;
import java.lang.reflect.Type;
import java.util.HashSet;
import java.util.ArrayList;

public class King extends Piece {


    public King(PieceColor pieceColor, Point location, Board board){
        super(pieceColor, location, PieceType.KING, board);
    }

    public King(PieceColor pieceColor, Point location){
        super(pieceColor, location, PieceType.KING);
    }

    @Override
    public void updateMoves() {
        this.possibleMoves.clear();
        moveSet(this.getLocation());
    }

    public boolean isCheck(Board board){
        if(this.getPieceColor().equals(PieceColor.BLACK)){
            if(board.getAllMovesOfColor(PieceColor.WHITE).contains(this.getLocation())){
                return true;
            }
            return false;
        }
        else {
            if(board.getAllMovesOfColor(PieceColor.BLACK).contains(this.getLocation())){
                return true;
            }
            return false;
        }

    }

    public void moveSet(Point point) {
        //up
        move(point, 0, -1);
        System.out.println("enemy moves: " + board.getAllMovesOfColor(PieceColor.BLACK));

        //down
        move(point, 0, 1);

        //left
        move(point, -1, 0);

        //right
        move(point, 1, 0);

        //upLeft
        move(point, -1, -1);

        //upRight
        move(point, 1, -1);

        //downLeft
        move(point, -1, 1);

        //downRight
        move(point, 1, 1);

    }

    public void move(Point start, int x, int y) {
        Point newLocation = new Point(start.x, start.y);

        newLocation.move(newLocation.x + x, newLocation.y + y);

        Piece piece = this.board.getPieceAtPoint(newLocation);
//        piece.updateMoves();
        //check if location is out of bounds or not
        if(this.isValidLocation(newLocation) == true) {
            //if there is no piece or piece of same color at the new location, process
            if(piece == null || piece.getPieceColor() != this.getPieceColor()) {
                //Check if move will place king into check, if not add move
                if(this.getPieceColor() == PieceColor.BLACK) {
                    if (this.board.getAllMovesOfColor(PieceColor.WHITE).contains(newLocation) == false) {
                        this.possibleMoves.add(new Point(newLocation.x, newLocation.y));
                    }
                }
                if(this.getPieceColor() == PieceColor.WHITE) {
                    if (this.board.getAllMovesOfColor(PieceColor.BLACK).contains(newLocation) == false) {
                        this.possibleMoves.add(new Point(newLocation.x, newLocation.y));
                    }
                }
            }
        }
    }


    public boolean isCheckmate() {
        //check if the moves that a king can make is zero, and the king is in a check
        if(this.possibleMoves.isEmpty() == true && isCheck(this.board) == true) {
            return true;
        }

        HashSet<Point> enemyMoves = new HashSet<Point>();
        ArrayList<Piece> enemyPieces = new ArrayList<Piece>();
        ArrayList<Piece> checkPieces = new ArrayList<Piece>();
        ArrayList<Piece> ourPieces = new ArrayList<Piece>();

        if(this.getPieceColor() == PieceColor.BLACK) {
            enemyMoves = this.board.getAllMovesOfColor(PieceColor.WHITE);
            enemyPieces = this.board.getPieces(PieceColor.WHITE);
            ourPieces = this.board.getPieces(PieceColor.BLACK);
        }
        if(this.getPieceColor() == PieceColor.WHITE) {
            enemyMoves = this.board.getAllMovesOfColor(PieceColor.BLACK);
            enemyPieces = this.board.getPieces(PieceColor.BLACK);
            ourPieces = this.board.getPieces(PieceColor.WHITE);
        }
        for(int i = 0; i < enemyPieces.size(); i++) {
            if(enemyPieces.get(i).getPossibleMoves().contains(this.getLocation()) == true) {
                checkPieces.add(enemyPieces.get(i));
            }
        }
        for(int i = 0; i < ourPieces.size(); i++) {
            //capture
            Point old = ourPieces.get(i).getLocation();
            for (int j = 0; j < enemyPieces.size(); j++) {
                if (ourPieces.get(i).getPossibleMoves().contains(enemyPieces.get(j).getLocation()) == true) {
                    Board newBoard = this.board;
                    newBoard.movePiece(ourPieces.get(i), enemyPieces.get(j).getLocation(), -1);
                    if (isCheck(newBoard) == false) {
                        newBoard.movePiece(ourPieces.get(i), old, -1);
                        return false;
                    }
                }
            }
            //block
            for (Point m : enemyMoves) {
                System.out.println("m: " + m);

//                System.out.println("enemyMoveALL: " + enemyMoves);
//                for(Point f : ourPieces.get(i).getPossibleMoves()) {
//                    System.out.println("friendly point: " + f.x + ", " + f.y);
//
//                }
                if (ourPieces.get(i).getPossibleMoves().contains(m) == true && ourPieces.get(i).getType() != PieceType.KING) {
                    System.out.println("true : " + ourPieces.get(i).getType() + "  enemyMove: " + m);
                    Board newBoard = this.board;
                    newBoard.movePiece(ourPieces.get(i), m, -1);
                    newBoard.updateMoves();
                    System.out.println("new position : " + newBoard.getPieceAtPoint(m));
                    System.out.println("new moves : " + newBoard.getAllMovesOfColor(PieceColor.BLACK));

                    if (isCheck(newBoard) == false) {
                        newBoard.movePiece(ourPieces.get(i), old, -1);
                        System.out.println("is false");
                        return false;
                    }
                }
            }
        }

        return true;
    }

    public boolean checkMoveWin() {
        Point location = this.getLocation();
        PieceColor color = this.getPieceColor();
        //check if the white king is at the black king start position
        if(color.equals(PieceColor.WHITE)) {
            if(location.x == 3 && location.y == 1) {
                return true;
            }
        }
        //check if the black king is at the white king start position
        if(color.equals(PieceColor.BLACK)) {
            if(location.x == 3 && location.y == 5) {
                return true;
            }
        }
        return false;
    }

}
