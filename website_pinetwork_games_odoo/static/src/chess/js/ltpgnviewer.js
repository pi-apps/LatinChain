// LT-PGN-VIEWER 3.498 (c) Lutz Tautenhahn (2001-2018)
var ScriptPath="http://www.lutanho.net/pgn/";
var i, j, s, StartMove, MoveCount, MoveType, CanPass, EnPass, MaxMove=600, isInit=false, isCalculating=false;
var CurVar=0, activeAnchor=-1, startAnchor=-1, activeAnchorBG="#CCCCCC", TargetDocument, isSetupBoard=false, BoardSetupMode='copy';
var dragX, dragY, dragObj, dragBorder, dragImgBorder, isDragDrop=false, isAnimating=false, isExecCommand=true, BoardPic, ParseType=1, AnnotationFile="";
var offsetAnchor=1, Indent=0;
OldCommands=new Array();
NewCommands=new Array();
dragImg=new Array(2);
dragPiece=new Array(8);
dragPiece[0]=-1;
dragPiece[4]=-1;

ShortPgnMoveText=new Array(3);
for (i=0; i<3; i++) ShortPgnMoveText[i] = new Array();
ShortPgnMoveText[0][CurVar]="";

PieceType = new Array(2); for (i=0; i<2; i++) PieceType[i] = new Array(16);
PiecePosX = new Array(2); for (i=0; i<2; i++) PiecePosX[i] = new Array(16);
PiecePosY = new Array(2); for (i=0; i<2; i++) PiecePosY[i] = new Array(16);
PieceMoves = new Array(2); for (i=0; i<2; i++) PieceMoves[i] = new Array(16);

var isRotated=false, isRecording=false, isNullMove=1, RecordCount=0, RecordedMoves="", SkipRefresh=0;
var AutoPlayInterval, isAutoPlay=false, Delay=1000, BoardClicked=-1, isCapturedPieces=false, LastStyle="", ThisStyle="", CandidateStyle="", AutoCapture=0, BCStyle="", BCCmds="", PieceFileExt=".gif", nAudio=0;
var PieceName = "KQRBNP", ShowPieceName = "KQRBNP";
PieceCode = new Array(6); for (i=0; i<6; i++) PieceCode[i]=PieceName.charCodeAt(i);
var StandardFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var FenString = StandardFen;
ColorName = new Array("w","b","t"); //white, black, transparent
Castling = new Array(2); for (i=0; i<2; i++) Castling[i] = new Array(2);
Board = new Array(8); for (i=0; i<8; i++) Board[i] = new Array(8);

HalfMove = new Array(MaxMove+1);
HistMove = new Array(MaxMove);
HistCommand = new Array(MaxMove+1);
HistPiece = new Array(2);
for (i=0; i<2; i++) HistPiece[i] = new Array(MaxMove);
HistType = new Array(2);
for (i=0; i<2; i++) HistType[i] = new Array(MaxMove);
HistPosX = new Array(2);
for (i=0; i<2; i++) HistPosX[i] = new Array(MaxMove);
HistPosY = new Array(2);
for (i=0; i<2; i++) HistPosY[i] = new Array(MaxMove);
MoveArray = new Array();

PiecePic = new Array(2);
for (i=0; i<2; i++) PiecePic[i] = new Array(6);
LabelPic = new Array(5);
Annotation = new Array();
DocImg=new Array();

var ImagePathOld="-", ImagePath="", ImageOffset=0, IsLabelVisible=true, Border=1, BorderColor="#404040", ScoreSheet=0, BGColor="", BGOpacity=1;

function SetImagePath(pp)
{ ImagePath=pp;
}

function SetBorder(nn)
{ Border=parseInt(nn);
}

function SetBorderColor(cc)
{ if (cc.length==6) BorderColor="#"+cc;
  else BorderColor=cc;
}

function SetScoreSheet(nn)
{ ScoreSheet=parseInt(nn);
}

function SetBGColor(cc)
{ if (cc.charAt(0)=="#") BGColor=cc;
  else BGColor="#"+cc;
}

function SetBGOpacity(vv)
{ BGOpacity=parseFloat(vv);
}

function HEX2RGBA(vv)
{ if ((vv.length<7)||(vv.length>9)) return(vv);
  var rr=0, gg=0, bb=0, oo=0, cc=vv.toLowerCase(), ss="0123456789abcdef";
  rr+=16*ss.indexOf(cc.charAt(1))+ss.indexOf(cc.charAt(2));
  gg+=16*ss.indexOf(cc.charAt(3))+ss.indexOf(cc.charAt(4));
  bb+=16*ss.indexOf(cc.charAt(5))+ss.indexOf(cc.charAt(6));
  oo+=16*ss.indexOf(cc.charAt(7))+ss.indexOf(cc.charAt(8));
  if (oo<=0) oo=BGOpacity;
  else oo/=255;
  ss="rgba("+rr+","+gg+","+bb+","+oo+")";
  if ((oo>0)&&(oo<1)) return(ss);
  return(vv.substr(0,7));
}

function SetImg(ii,oo)
{ if (DocImg[ii]==oo.src) return;
  DocImg[ii]=oo.src;
  //if (ii<64)
  if (isNaN(ii)) document.images[ii].src=oo.src;
  else document.images[ii+ImageOffset].src=oo.src;
  //else document.images[ii].src=oo.src;
}

function ShowLabels(bb)
{ IsLabelVisible=bb;
  RefreshBoard();
}

function SwitchLabels()
{ IsLabelVisible=!IsLabelVisible;
  RefreshBoard();
}

function GetValue(oo)
{ var vv="";
  eval("vv="+oo);
  return(vv);
}

function SetAutoCapture(vv)
{ AutoCapture=vv;
}

function SetIndent(vv)
{ Indent=vv;
}

function SetPieceFileExt(ss)
{ PieceFileExt=ss;
}

function SetAudio(nn)
{ nAudio=nn;
}

function PlayAudio(mm,dd)
{ var nn=1;
  if (mm.indexOf("x")>0) nn=2;
  if ((mm.indexOf("O-O")>=0)||(mm.indexOf("0-0")>=0)||(mm.indexOf("O–O")>=0)||(mm.indexOf("0–0")>=0)) nn=3;
  if (mm=="") nn=0;
  nn+=4*Math.floor(Math.random()*nAudio/4);
  if (document.getElementById("audio"+nn)) 
  { if((isDragDrop)&&(dd>0)) setTimeout('AudioPlay('+nn+')',dd);
    else AudioPlay(nn);
  }
}

function AudioPlay(nn)
{ document.getElementById("audio"+nn).play();
}

function InitImages()
{ if (ImagePathOld==ImagePath) return;
  var ii, jj;
  BoardPic = new Image(); 
  BoardPic.src = ImagePath+"t.gif";
  for (ii=0; ii<2; ii++)
  { PiecePic[ii][0] = new Image(); PiecePic[ii][0].src = ImagePath+ColorName[ii]+"k"+PieceFileExt;
    PiecePic[ii][1] = new Image(); PiecePic[ii][1].src = ImagePath+ColorName[ii]+"q"+PieceFileExt;
    PiecePic[ii][2] = new Image(); PiecePic[ii][2].src = ImagePath+ColorName[ii]+"r"+PieceFileExt;
    PiecePic[ii][3] = new Image(); PiecePic[ii][3].src = ImagePath+ColorName[ii]+"b"+PieceFileExt;
    PiecePic[ii][4] = new Image(); PiecePic[ii][4].src = ImagePath+ColorName[ii]+"n"+PieceFileExt;
    PiecePic[ii][5] = new Image(); PiecePic[ii][5].src = ImagePath+ColorName[ii]+"p"+PieceFileExt;
  }
  LabelPic[0] = new Image(); LabelPic[0].src = ImagePath+"8_1.gif";
  LabelPic[1] = new Image(); LabelPic[1].src = ImagePath+"a_h.gif";
  LabelPic[2] = new Image(); LabelPic[2].src = ImagePath+"1_8.gif";
  LabelPic[3] = new Image(); LabelPic[3].src = ImagePath+"h_a.gif";
  LabelPic[4] = new Image(); LabelPic[4].src = ImagePath+"1x1.gif";
  ImagePathOld=ImagePath;
//ImageOffset=0;
  for (ii=0; ii<document.images.length; ii++)
  { if (document.images[ii]==document.images["RightLabels"])
    { if (ii>64) ImageOffset=ii-64;
    }
  }
  DocImg.length=0;
}

function sign(nn)
{ if (nn>0) return(1);
  if (nn<0) return(-1);
  return(0);
}

function OpenUrl(ss)
{ if (ss!="")
    parent.frames[1].location.href = ss;
  else
  { if (document.BoardForm.Url.value!="")  
    { var nn=document.BoardForm.OpenParsePgn.selectedIndex;
      if (((nn)||(document.BoardForm.Url.value.indexOf(".htm")>0))&&(!document.layers)) 
      { parent.frames[1].location.href = document.BoardForm.Url.value;
        if (nn) setTimeout("ParsePgn("+nn+")",400);
      }
      else parent.frames[1].location.href = "pgnframe.html?"+document.BoardForm.Url.value;
    }
    else parent.frames[1].location.href = "pgnframe.html";
  }
}

function Init(rr)
{ var cc, ii, jj, kk, ll, nn, mm;
  isInit=true;
  if (isAutoPlay) SetAutoPlay(false);
  if (rr!='')
  { FenString=rr;
    while (FenString.indexOf("|")>0) FenString=FenString.replace("|","/");
  }
  if (FenString=='standard')
    FenString=StandardFen;
  if ((document.BoardForm)&&(document.BoardForm.FEN))
      document.BoardForm.FEN.value=FenString;
  if (FenString == StandardFen)
  { for (ii=0; ii<2; ii++)
    { PieceType[ii][0]=0;
      PiecePosX[ii][0]=4;
      PieceType[ii][1]=1;
      PiecePosX[ii][1]=3;
      PieceType[ii][2]=2;
      PiecePosX[ii][2]=0;
      PieceType[ii][3]=2;
      PiecePosX[ii][3]=7;
      PieceType[ii][4]=3;
      PiecePosX[ii][4]=2;
      PieceType[ii][5]=3;
      PiecePosX[ii][5]=5;
      PieceType[ii][6]=4;
      PiecePosX[ii][6]=1;
      PieceType[ii][7]=4;
      PiecePosX[ii][7]=6;
      for (jj=0; jj<8; jj++)
      { PieceType[ii][jj+8]=5;
        PiecePosX[ii][jj+8]=jj;
      }
      for (jj=0; jj<16; jj++)
      { PieceMoves[ii][jj]=0;
        PiecePosY[ii][jj]=(1-ii)*Math.floor(jj/8)+ii*(7-Math.floor(jj/8));
      }
    }
    for (ii=0; ii<8; ii++)
    { for (jj=0; jj<8; jj++) Board[ii][jj]=0;
    }
    for (ii=0; ii<2; ii++)
    { for (jj=0; jj<16; jj++)
        Board[PiecePosX[ii][jj]][PiecePosY[ii][jj]]=(PieceType[ii][jj]+1)*(1-2*ii);
    }
    for (ii=0; ii<2; ii++)
    { for (jj=0; jj<2; jj++)
        Castling[ii][jj]=1;
    }
    EnPass=-1;
    HalfMove[0]=0;
    if (document.BoardForm)
    { RefreshBoard();
      if (document.BoardForm.Position)
        document.BoardForm.Position.value="";
      if (nAudio) PlayAudio("",0);
      NewCommands.length=0;
      ExecCommands();
    }
    StartMove=0;
    MoveCount=StartMove;
    MoveType=StartMove%2;
    SetBoardClicked(-1);
    RecordCount=0;
    CurVar=0;
    MoveArray.length=0;
    BCCmds="";
    if (TargetDocument) HighlightMove("m"+MoveCount+"v"+CurVar);
    UpdateAnnotation(true);
  }
  else
  { for (ii=0; ii<2; ii++)
    { for (jj=0; jj<16; jj++)
      { PieceType[ii][jj]=-1;
        PiecePosX[ii][jj]=0;
        PiecePosY[ii][jj]=0;
        PieceMoves[ii][jj]=0;
      }
    }
    ii=0; jj=7; ll=0; nn=1; mm=1; cc=FenString.charAt(ll++);
    while (cc!=" ")
    { if (cc=="/")
      { if (ii!=8)
        { alert("Invalid FEN [1]: char "+ll+" in "+FenString);
          Init('standard');
          return;
        }
        ii=0;
        jj--;
      }
      if (ii==8) 
      { alert("Invalid FEN [2]: char "+ll+" in "+FenString);
        Init('standard');
        return;
      }
      if (! isNaN(cc))
      { ii+=parseInt(cc);
        if ((ii<0)||(ii>8))
        { alert("Invalid FEN [3]: char "+ll+" in "+FenString);
          Init('standard');
          return;
        }
      }
      if (cc.charCodeAt(0)==PieceName.toUpperCase().charCodeAt(0))
      { if (PieceType[0][0]!=-1)
        { alert("Invalid FEN [4]: char "+ll+" in "+FenString);
          Init('standard');
          return;
        }     
        PieceType[0][0]=0;
        PiecePosX[0][0]=ii;
        PiecePosY[0][0]=jj;
        ii++;
      }
      if (cc.charCodeAt(0)==PieceName.toLowerCase().charCodeAt(0))
      { if (PieceType[1][0]!=-1)
        { alert("Invalid FEN [5]: char "+ll+" in "+FenString);
          Init('standard');
          return;
        }  
        PieceType[1][0]=0;
        PiecePosX[1][0]=ii;
        PiecePosY[1][0]=jj;
        ii++;
      }
      for (kk=1; kk<6; kk++)
      { if (cc.charCodeAt(0)==PieceName.toUpperCase().charCodeAt(kk))
        { if (nn==16)
          { alert("Invalid FEN [6]: char "+ll+" in "+FenString);
            Init('standard');
            return;
          }          
          PieceType[0][nn]=kk;
          PiecePosX[0][nn]=ii;
          PiecePosY[0][nn]=jj;
          nn++;
          ii++;
        }
        if (cc.charCodeAt(0)==PieceName.toLowerCase().charCodeAt(kk))
        { if (mm==16)
          { alert("Invalid FEN [7]: char "+ll+" in "+FenString);
            Init('standard');
            return;
          }  
          PieceType[1][mm]=kk;
          PiecePosX[1][mm]=ii;
          PiecePosY[1][mm]=jj;
          mm++;
          ii++;
        }
      }
      if (ll<FenString.length)
        cc=FenString.charAt(ll++);
      else cc=" ";
    }
    if ((ii!=8)||(jj!=0))
    { alert("Invalid FEN [8]: char "+ll+" in "+FenString);
      Init('standard');
      return;
    }
    if ((PieceType[0][0]==-1)||(PieceType[1][0]==-1))
    { alert("Invalid FEN [9]: char "+ll+" missing king");
      Init('standard');
      return;
    }
    if (ll==FenString.length)
    { FenString+=" w ";
      FenString+=PieceName.toUpperCase().charAt(0);
      FenString+=PieceName.toUpperCase().charAt(1);
      FenString+=PieceName.toLowerCase().charAt(0);
      FenString+=PieceName.toLowerCase().charAt(1);      
      FenString+=" - 0 1";
      ll++;
    }
//    { alert("Invalid FEN [10]: char "+ll+" missing active color");
//      Init('standard');
//      return;
//    }
    cc=FenString.charAt(ll++);
    if ((cc=="w")||(cc=="b"))
    { if (cc=="w") StartMove=0;
      else StartMove=1;
    }
    else
    { alert("Invalid FEN [11]: char "+ll+" invalid active color");
      Init('standard');
      return;
    }
    ll++;
    if (ll>=FenString.length)
    { alert("Invalid FEN [12]: char "+ll+" missing castling availability");
      Init('standard');
      return;
    }
    Castling[0][0]=0; Castling[0][1]=0; Castling[1][0]=0; Castling[1][1]=0;
    cc=FenString.charAt(ll++);
    while (cc!=" ")
    { cc=cc.charCodeAt(0);
      if (cc==PieceName.toUpperCase().charCodeAt(0))
        Castling[0][0]=1; 
      if (cc==PieceName.toUpperCase().charCodeAt(1))
        Castling[0][1]=1; 
      if (cc==PieceName.toLowerCase().charCodeAt(0))
        Castling[1][0]=1; 
      if (cc==PieceName.toLowerCase().charCodeAt(1))
        Castling[1][1]=1;
      if ((cc>=65)&&(cc<=72)) //A...H  for Chess960
      { if (cc>PiecePosX[0][0]+65) Castling[0][0]=1;
        if (cc<PiecePosX[0][0]+65) Castling[0][1]=1;
      }
      if ((cc>=97)&&(cc<=104)) //a...h  for Chess960
      { if (cc>PiecePosX[1][0]+97) Castling[1][0]=1;
        if (cc<PiecePosX[1][0]+97) Castling[1][1]=1;
      }
      if (ll<FenString.length)
        cc=FenString.charAt(ll++);
      else cc=" ";
    }
    if (ll==FenString.length)
    { alert("Invalid FEN [13]: char "+ll+" missing en passant target square");
      Init('standard');
      return;
    }
    EnPass=-1;
    cc=FenString.charAt(ll++);
    while (cc!=" ")
    { if ((cc.charCodeAt(0)-97>=0)&&(cc.charCodeAt(0)-97<=7))
        EnPass=cc.charCodeAt(0)-97; 
      if (ll<FenString.length)
        cc=FenString.charAt(ll++);
      else cc=" ";
    }
    if (ll==FenString.length)
    { alert("Invalid FEN [14]: char "+ll+" missing halfmove clock");
      Init('standard');
      return;
    }
    HalfMove[0]=0;
    cc=FenString.charAt(ll++);
    while (cc!=" ")
    { if (isNaN(cc))
      { alert("Invalid FEN [15]: char "+ll+" invalid halfmove clock");
        Init('standard');
        return;
      }
      HalfMove[0]=HalfMove[0]*10+parseInt(cc);
      if (ll<FenString.length)
        cc=FenString.charAt(ll++);
      else cc=" ";
    }
    if (ll==FenString.length)
    { alert("Invalid FEN [16]: char "+ll+" missing fullmove number");
      Init('standard');
      return;
    }
    cc=FenString.substring(ll++);
    if (isNaN(cc))
    { alert("Invalid FEN [17]: char "+ll+" invalid fullmove number");
      Init('standard');
      return;
    }
    if (cc<=0)
    { alert("Invalid FEN [18]: char "+ll+" invalid fullmove number");
      Init('standard');
      return;
    }
    StartMove+=2*(parseInt(cc)-1);
    for (ii=0; ii<8; ii++)
    { for (jj=0; jj<8; jj++) Board[ii][jj]=0;
    }
    for (ii=0; ii<2; ii++)
    { for (jj=0; jj<16; jj++)
      { if (PieceType[ii][jj]!=-1) 
          Board[PiecePosX[ii][jj]][PiecePosY[ii][jj]]=(PieceType[ii][jj]+1)*(1-2*ii);
      }
    }
    if (document.BoardForm)
    { RefreshBoard();
      if (document.BoardForm.Position)
      { if (StartMove%2==0) document.BoardForm.Position.value="white to move";
        else document.BoardForm.Position.value="black to move";
      }
      if (nAudio) PlayAudio("",0);
      NewCommands.length=0;
      ExecCommands();
    }
    MoveCount=StartMove;
    MoveType=StartMove%2;
    SetBoardClicked(-1);
    RecordCount=0;
    CurVar=0;
    MoveArray.length=0;
    BCCmds="";
    if (TargetDocument) HighlightMove("m"+MoveCount+"v"+CurVar);
    UpdateAnnotation(true);
  }
}

function MoveBack(nn)
{ var ii, jj, cc;
  if (BoardClicked>=0) SetBoardClicked(-1);
  for (jj=0; (jj<nn)&&(MoveCount>StartMove); jj++)
  { if (RecordCount>0) RecordCount--;
    MoveCount--;
    MoveType=1-MoveType;
    cc=MoveCount-StartMove;
    ii=HistPiece[1][cc];
    if ((0<=ii)&&(ii<16)) //we must do this here because of Chess960 castling
    { Board[PiecePosX[MoveType][ii]][PiecePosY[MoveType][ii]]=0; 
      Board[HistPosX[1][cc]][HistPosY[1][cc]]=(HistType[1][cc]+1)*(1-2*MoveType);
    }
    ii=HistPiece[0][cc]; 
    Board[PiecePosX[MoveType][ii]][PiecePosY[MoveType][ii]]=0;
    Board[HistPosX[0][cc]][HistPosY[0][cc]]=(HistType[0][cc]+1)*(1-2*MoveType);
    PieceType[MoveType][ii]=HistType[0][cc];
    PiecePosX[MoveType][ii]=HistPosX[0][cc];
    PiecePosY[MoveType][ii]=HistPosY[0][cc];
    PieceMoves[MoveType][ii]--;
    ii=HistPiece[1][cc];
    if ((0<=ii)&&(ii<16))
    { PieceType[MoveType][ii]=HistType[1][cc];
      PiecePosX[MoveType][ii]=HistPosX[1][cc];
      PiecePosY[MoveType][ii]=HistPosY[1][cc];
      PieceMoves[MoveType][ii]--;
    }
    ii-=16;
    if (0<=ii)
    { Board[HistPosX[1][cc]][HistPosY[1][cc]]=(HistType[1][cc]+1)*(2*MoveType-1);
      PieceType[1-MoveType][ii]=HistType[1][cc];
      PiecePosX[1-MoveType][ii]=HistPosX[1][cc];
      PiecePosY[1-MoveType][ii]=HistPosY[1][cc];
      PieceMoves[1-MoveType][ii]--;
    }
    if (CurVar!=0)
    { if (MoveCount==ShortPgnMoveText[2][CurVar])
      { CurVar=ShortPgnMoveText[1][CurVar];
        if ((!isCalculating)&&(document.BoardForm)&&(document.BoardForm.PgnMoveText))
          document.BoardForm.PgnMoveText.value=ShortPgnMoveText[0][CurVar];
      }  
    }    
  }
  if (HistCommand[MoveCount-StartMove]) NewCommands=HistCommand[MoveCount-StartMove].split("|");
  if (isCalculating) return;
  if (LastStyle) NewCommands[NewCommands.length]=LastStyle.charAt(0)+"last"+LastStyle.substr(1);
  if (ThisStyle) NewCommands[NewCommands.length]=ThisStyle.charAt(0)+"this"+ThisStyle.substr(1);
  if ((OldCommands.length>0)||(NewCommands.length>0)) ExecCommands();
  if (document.BoardForm)
  { RefreshBoard();
    if (document.BoardForm.Position)
    { if (MoveCount>StartMove)
        document.BoardForm.Position.value=TransformSAN(HistMove[MoveCount-StartMove-1]);
      else
        document.BoardForm.Position.value="";
    }    
  }
  BCCmds="";
  if (TargetDocument) HighlightMove("m"+MoveCount+"v"+CurVar);
  UpdateAnnotation(false);
  if (AutoPlayInterval) clearTimeout(AutoPlayInterval);
  if (isAutoPlay) AutoPlayInterval=setTimeout("MoveBack("+nn+")", Delay);
}

function Uncomment(ss)
{ if (! ss) return(ss);
  var ii, jj, llist=ss.split("{"), ll=llist.length, uu=llist[0], tt, kk;
  for (ii=1; ii<ll; ii++)
  { tt=llist[ii];
    jj=tt.indexOf("}")+1;
    if (jj>0) uu+=tt.substring(jj);
  }
  llist=uu.split("$");
  ll=llist.length;
  uu=llist[0];
  for (ii=1; ii<ll; ii++)
  { tt=llist[ii];
    kk=tt.length;
    for (jj=0; jj<kk; jj++)
    { if (isNaN(parseInt(tt.charAt(jj))))
      //if (tt.charAt(jj)==" ")
      { uu+=tt.substring(jj+1);
        jj=kk;
      }
    }    
  }
  return(uu);
}

function GetComment(ss)
{ if (! ss) return(ss);
  var ii, jj, llist=ss.split("}"), ll=llist.length, uu="", tt, kk;
  for (ii=0; ii<ll; ii++)
  { tt=llist[ii];
    jj=tt.indexOf("{")+1;
    if (jj>0) uu+=tt.substring(jj);
  }
  return(uu);
}

function MoveForward(nn, rr)
{ var ii,ffst=0,llst,ssearch,ssub,ffull,mmove0="",mmove1="";
  if (rr);
  else
  { if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
      ShortPgnMoveText[0][CurVar]=document.BoardForm.PgnMoveText.value;
    if (BoardClicked>=0) SetBoardClicked(-1);
  }
  ffull=Uncomment(ShortPgnMoveText[0][CurVar]);
  for (ii=0; (ii<nn)&&(ffst>=0)&&(MoveCount<MaxMove); ii++)
  { ssearch=Math.floor(MoveCount/2+2)+".";
    llst=ffull.indexOf(ssearch);
    ssearch=Math.floor(MoveCount/2+1)+".";
    ffst=ffull.indexOf(ssearch);
    if (ffst>=0)
    { ffst+=ssearch.length;
      if (llst<0)
        ssub=ffull.substring(ffst);
      else
        ssub=ffull.substring(ffst, llst);
      mmove0=GetMove(ssub,MoveType);
      if (mmove0!="")
      { if (ParseMove(mmove0, true)>0)
        { mmove1=mmove0;
          if (MoveType==0)
            HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+"."+mmove1;
          else
            HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mmove1;
          HistCommand[MoveCount-StartMove+1]=NewCommands.join("|");
          MoveCount++;
          MoveType=1-MoveType;
        }  
        else
        { if (MoveType==1)
          { ssub=Math.floor(MoveCount/2+1);
            ssearch=ssub+"....";
            ffst=ffull.indexOf(ssearch);
            if (ffst<0) { ssearch=ssub+". ..."; ffst=ffull.indexOf(ssearch); }
            if (ffst<0) { ssearch=ssub+". .."; ffst=ffull.indexOf(ssearch); }
            if (ffst<0) { ssearch=ssub+" ..."; ffst=ffull.indexOf(ssearch); }
            if (ffst<0) { ssearch=ssub+"..."; ffst=ffull.indexOf(ssearch); }            
            if (ffst<0) { ssearch=ssub+" .."; ffst=ffull.indexOf(ssearch); }
            if (ffst>=0) 
            { ffst+=ssearch.length;
              if (llst<0) ssub=ffull.substring(ffst);
              else ssub=ffull.substring(ffst, llst);
              mmove0=GetMove(ssub,0);
              if (mmove0!="")
              { if (ParseMove(mmove0, true)>0)
                { mmove1=mmove0;
                  HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mmove1;
                  HistCommand[MoveCount-StartMove+1]=NewCommands.join("|");
                  MoveCount++;
                  MoveType=1-MoveType;
                }  
                else
                { ffst=-1;
                  //alert(mmove0+" is not a valid move.");
                }
              }
            }
          }
          else
          { ffst=-1;
            //alert(mmove0+" is not a valid move.");
          }
        }
      }
      else ffst=-1;
    }
  }
  if (isCalculating) return;
  if (LastStyle) NewCommands[NewCommands.length]=LastStyle.charAt(0)+"last"+LastStyle.substr(1);
  if (ThisStyle) NewCommands[NewCommands.length]=ThisStyle.charAt(0)+"this"+ThisStyle.substr(1);
  if ((OldCommands.length>0)||(NewCommands.length>0)) 
  { if ((isDragDrop)&&(nn==1)) setTimeout("ExecCommands()",Delay/2);
    else ExecCommands();
  }
  if (document.BoardForm)
  { if ((document.BoardForm.Position)&&(mmove1!=""))
      document.BoardForm.Position.value=TransformSAN(HistMove[MoveCount-StartMove-1]);
    if ((nAudio)&&(mmove1!="")) PlayAudio(HistMove[MoveCount-StartMove-1],Delay/12+200);
    if ((mmove1!="")&&(isDragDrop)&&(nn==1)&&(!dragObj)&&(dragPiece[0]>=0)&&(!rr)&&(!isAnimating)) AnimateBoard(1);
    else RefreshBoard();
  }
  BCCmds="";
  if (TargetDocument) HighlightMove("m"+MoveCount+"v"+CurVar);
  UpdateAnnotation(false);
  if (AutoPlayInterval) clearTimeout(AutoPlayInterval);
  if (isAutoPlay) AutoPlayInterval=setTimeout("MoveForward("+nn+")", Delay);
}

function ParseMove(mm, sstore)
{ var ii, ffrom="", ccapt=0, ll, yy1i=-1;
  var ttype0=-1, xx0=-1, yy0=-1, ttype1=-1, xx1=-1, yy1=-1;
  if (MoveCount>StartMove)
  { CanPass=-1;
    ii=HistPiece[0][MoveCount-StartMove-1];
    if ((HistType[0][MoveCount-StartMove-1]==5)&&(Math.abs(HistPosY[0][MoveCount-StartMove-1]-PiecePosY[1-MoveType][ii])==2))
      CanPass=PiecePosX[1-MoveType][ii];
  }
  else
    CanPass=EnPass;
  ii=1;
  while (ii<mm.length)  
  { if (! isNaN(mm.charAt(ii)))
    { xx1=mm.charCodeAt(ii-1)-97;
      yy1=mm.charAt(ii)-1;
      yy1i=ii;
      ffrom=mm.substring(0, ii-1);
    }
    ii++;
  }
  if ((xx1<0)||(xx1>7)||(yy1<0)||(yy1>7))
  { if ((mm.indexOf("O")>=0)||(mm.indexOf("0")>=0))
    { if ((mm.indexOf("O-O-O")>=0)||(mm.indexOf("0-0-0")>=0)||(mm.indexOf("O–O–O")>=0)||(mm.indexOf("0–0–0")>=0)) 
      { if (EvalMove(ttype0, 6, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
          return(1);
        return(0);
      }
      if ((mm.indexOf("O-O")>=0)||(mm.indexOf("0-0")>=0)||(mm.indexOf("O–O")>=0)||(mm.indexOf("0–0")>=0))
      { if (EvalMove(ttype0, 7, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
          return(1);
        return(0);
      }
      return(0);
    }
    if ((mm.indexOf("---")>=0)||(mm.indexOf("–––")>=0))
    //if (mm.indexOf("...")>=0) //is buggy
    { if (EvalMove(ttype0, 8, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore))
        return(1);
      return(0);
    }
    return(0);
  }
  ll=ffrom.length;
  ttype0=5;
  if (ll>0)
  { for (ii=0; ii<5; ii++)
    { if (ffrom.charCodeAt(0)==PieceCode[ii]) 
        ttype0=ii;
    }
    if (ffrom.charAt(ll-1)=="x") ccapt=1;
    else
    { if ((ffrom.charAt(ll-1)=="-")||(ffrom.charAt(ll-1)=="–")) ll--; //Smith Notation
    }
    if (isNaN(mm.charAt(ll-1-ccapt)))
    { xx0=ffrom.charCodeAt(ll-1-ccapt)-97;
      if ((xx0<0)||(xx0>7)) xx0=-1;
    }
    else
    { yy0=ffrom.charAt(ll-1-ccapt)-1;
      if ((yy0<0)||(yy0>7)) yy0=-1;
    }
    if ((yy0>=0)&&(isNaN(mm.charAt(ll-2-ccapt)))) //Smith Notation
    { xx0=ffrom.charCodeAt(ll-2-ccapt)-97;
      if ((xx0<0)||(xx0>7)) xx0=-1;
      else
      { ttype0=Math.abs(Board[xx0][yy0])-1;
        if ((ttype0==0)&&(xx0-xx1>1)&&(yy0==yy1))
        { if (EvalMove(ttype0, 6, xx0, yy0, -1, -1, -1, 0, sstore))
            return(1);
          return(0);
        }  
        if ((ttype0==0)&&(xx1-xx0>1)&&(yy0==yy1))
        { if (EvalMove(ttype0, 7, xx0, yy0, -1, -1, -1, 0, sstore))
            return(1);
          return(0);
        }
      }
    }
  }
  if (Board[xx1][yy1]!=0) ccapt=1;
  else
  { if ((ttype0==5)&&(xx1==CanPass)&&(yy1==5-3*MoveType)) ccapt=1;
  }
  ttype1=ttype0;
  ii=mm.indexOf("=");
  if (ii<0) ii=yy1i;
  if ((ii>0)&&(ii<mm.length-1))
  { if (ttype0==5)
    { ii=mm.charCodeAt(ii+1);
      if (ii==PieceCode[1]) ttype1=1;
      if (ii==PieceCode[2]) ttype1=2;
      if (ii==PieceCode[3]) ttype1=3;
      if (ii==PieceCode[4]) ttype1=4;
    }  
  }
  if (sstore)
  { for (ii=0; ii<16; ii++)
    { if (PieceType[MoveType][ii]==ttype0)
      { if (EvalMove(ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, true))
          return(1);
      }
    }
  }
  else
  { ll=0;
    for (ii=0; ii<16; ii++)
    { if (PieceType[MoveType][ii]==ttype0)
      { if (EvalMove(ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, false))
          ll++;
      }
    }
    return(ll);
  }    
  return(0);
}

function CanCastleLong()
{ if (Castling[MoveType][1]==0) return(-1);
  if (PieceMoves[MoveType][0]>0) return(-1);
  var jj=0;
  while (jj<16)
  { if ((PiecePosX[MoveType][jj]<PiecePosX[MoveType][0])&&
        (PiecePosY[MoveType][jj]==MoveType*7)&&
        (PieceType[MoveType][jj]==2)&&
        (PieceMoves[MoveType][jj]==0))
      jj+=100;
    else jj++;
  }
  if (jj==16) return(-1);
  jj-=100;
  Board[PiecePosX[MoveType][0]][MoveType*7]=0;
  Board[PiecePosX[MoveType][jj]][MoveType*7]=0;
  var ff=PiecePosX[MoveType][jj];
  if (ff>2) ff=2;
  while ((ff<PiecePosX[MoveType][0])||(ff<=3))
  { if (Board[ff][MoveType*7]!=0)
    { Board[PiecePosX[MoveType][0]][MoveType*7]=1-2*MoveType;
      Board[PiecePosX[MoveType][jj]][MoveType*7]=(1-2*MoveType)*3;
      return(-1);
    }
    ff++;
  }
  Board[PiecePosX[MoveType][0]][MoveType*7]=1-2*MoveType;
  Board[PiecePosX[MoveType][jj]][MoveType*7]=(1-2*MoveType)*3;  
  return(jj);
}

function CanCastleShort()
{ if (Castling[MoveType][0]==0) return(-1);
  if (PieceMoves[MoveType][0]>0) return(-1);
  var jj=0;
  while (jj<16)
  { if ((PiecePosX[MoveType][jj]>PiecePosX[MoveType][0])&&
        (PiecePosY[MoveType][jj]==MoveType*7)&&
        (PieceType[MoveType][jj]==2)&&
        (PieceMoves[MoveType][jj]==0))
      jj+=100;
    else jj++;
  }
  if (jj==16) return(-1);
  jj-=100;
  Board[PiecePosX[MoveType][0]][MoveType*7]=0;
  Board[PiecePosX[MoveType][jj]][MoveType*7]=0;
  var ff=PiecePosX[MoveType][jj];
  if (ff<6) ff=6;
  while ((ff>PiecePosX[MoveType][0])||(ff>=5))
  { if (Board[ff][MoveType*7]!=0)
    { Board[PiecePosX[MoveType][0]][MoveType*7]=1-2*MoveType;
      Board[PiecePosX[MoveType][jj]][MoveType*7]=(1-2*MoveType)*3;
      return(-1);
    }
    ff--;
  }
  Board[PiecePosX[MoveType][0]][MoveType*7]=1-2*MoveType;
  Board[PiecePosX[MoveType][jj]][MoveType*7]=(1-2*MoveType)*3;
  return(jj);     
}
function EvalMove(ii, ttype0, xx0, yy0, ttype1, xx1, yy1, ccapt, sstore)
{ var ddx, ddy, xx, yy, jj=-1, ttype2=-1, xx2=xx1, yy2=xx1, ttype3=-1, xx3=-1, yy3=-1, ff;
  if (ttype0==6) //O-O-O with Chess960 rules
  { jj=CanCastleLong();
    if (jj<0) return(false);
    if (StoreMove(0, 0, 2, MoveType*7, jj, 2, 3, MoveType*7, sstore))
      return(true);
    else return(false);
  }
  if (ttype0==7) //O-O with Chess960 rules
  { jj=CanCastleShort();
    if (jj<0) return(false);
    if (StoreMove(0, 0, 6, MoveType*7, jj, 2, 5, MoveType*7, sstore))
      return(true);
    return(false);
  }
  if (ttype0==8) // --- NullMove
  { if (StoreMove(0, 0, PiecePosX[MoveType][0], PiecePosY[MoveType][0], -1, -1, -1, -1, sstore))
      return(true);
    return(false);
  }  
  if ((PiecePosX[MoveType][ii]==xx1)&&(PiecePosY[MoveType][ii]==yy1))
    return(false);
  if ((ccapt==0)&&(Board[xx1][yy1]!=0))
    return(false);
  if ((ccapt>0)&&(sign(Board[xx1][yy1])!=(2*MoveType-1)))
  { if ((ttype0!=5)||(CanPass!=xx1)||(yy1!=5-3*MoveType))
      return(false);
  }
  if ((xx0>=0)&&(xx0!=PiecePosX[MoveType][ii])) return(false);
  if ((yy0>=0)&&(yy0!=PiecePosY[MoveType][ii])) return(false);
  if (ttype0==0)
  { //if ((xx0>=0)||(yy0>=0)) return(false); //because of Smith Notation
    if (Math.abs(PiecePosX[MoveType][ii]-xx1)>1) return(false);
    if (Math.abs(PiecePosY[MoveType][ii]-yy1)>1) return(false);
  }
  if (ttype0==1)
  { if ((Math.abs(PiecePosX[MoveType][ii]-xx1)!=Math.abs(PiecePosY[MoveType][ii]-yy1))&&
        ((PiecePosX[MoveType][ii]-xx1)*(PiecePosY[MoveType][ii]-yy1)!=0))
      return(false);
  }
  if (ttype0==2)
  { if ((PiecePosX[MoveType][ii]-xx1)*(PiecePosY[MoveType][ii]-yy1)!=0)
      return(false);
  }
  if (ttype0==3)
  { if (Math.abs(PiecePosX[MoveType][ii]-xx1)!=Math.abs(PiecePosY[MoveType][ii]-yy1))
      return(false);
  }
  if (ttype0==4)
  { if (Math.abs(PiecePosX[MoveType][ii]-xx1)*Math.abs(PiecePosY[MoveType][ii]-yy1)!=2)
      return(false);
  }
  if ((ttype0==1)||(ttype0==2)||(ttype0==3))
  { ddx=sign(xx1-PiecePosX[MoveType][ii]);
    ddy=sign(yy1-PiecePosY[MoveType][ii]);
    xx=PiecePosX[MoveType][ii]+ddx;
    yy=PiecePosY[MoveType][ii]+ddy;
    while ((xx!=xx1)||(yy!=yy1))
    { if (Board[xx][yy]!=0) return(false);
      xx+=ddx;
      yy+=ddy;
    }
  }
  if (ttype0==5)
  { if (Math.abs(PiecePosX[MoveType][ii]-xx1)!=ccapt) return(false);
    if ((yy1==7*(1-MoveType))&&(ttype0==ttype1)) return(false);
    if (ccapt==0)
    { if (PiecePosY[MoveType][ii]-yy1==4*MoveType-2)
      { if (PiecePosY[MoveType][ii]!=1+5*MoveType) return(false);
        if (Board[xx1][yy1+2*MoveType-1]!=0) return(false);
      }
      else
      { if (PiecePosY[MoveType][ii]-yy1!=2*MoveType-1) return(false);
      }
    }
    else
    { if (PiecePosY[MoveType][ii]-yy1!=2*MoveType-1) return(false);
    }
  }
  if (ttype1!=ttype0)
  { if (ttype0!=5) return(false);
    if (ttype1>=5) return(false);
    if (yy1!=7-7*MoveType) return(false);
  }
  if ((ttype0<=5)&&(ccapt>0))
  { jj=15;
    while ((jj>=0)&&(ttype3<0))
    { if ((PieceType[1-MoveType][jj]>0)&&
          (PiecePosX[1-MoveType][jj]==xx1)&&
          (PiecePosY[1-MoveType][jj]==yy1))
        ttype3=PieceType[1-MoveType][jj];
      else
        jj--;
    }
    if ((ttype3==-1)&&(ttype0==5)&&(CanPass>=0))
    { jj=15;
      while ((jj>=0)&&(ttype3<0))
      { if ((PieceType[1-MoveType][jj]==5)&&
            (PiecePosX[1-MoveType][jj]==xx1)&&
            (PiecePosY[1-MoveType][jj]==yy1-1+2*MoveType))
          ttype3=PieceType[1-MoveType][jj];
        else
          jj--;
      }
    }
    ttype3=-1;
  }  
  if (StoreMove(ii, ttype1, xx1, yy1, jj, ttype3, xx3, yy3, sstore))
    return(true);
  return(false);
}

function StoreMove(ii, ttype1, xx1, yy1, jj, ttype3, xx3, yy3, sstore)
{ var iis_check=0, ll, cc=MoveCount-StartMove, ff=PiecePosX[MoveType][0], dd=0;
//  if ((ttype1==5)||((jj>=0)&&(ttype3<0)))
  if ((PieceType[MoveType][ii]==5)||((jj>=0)&&(ttype3<0)))
    HalfMove[cc+1]=0;
  else
    HalfMove[cc+1]=HalfMove[cc]+1;
  HistPiece[0][cc] = ii;
  HistType[0][cc] = PieceType[MoveType][ii];
  HistPosX[0][cc] = PiecePosX[MoveType][ii];
  HistPosY[0][cc] = PiecePosY[MoveType][ii];
  if (!isAnimating)
  { dragPiece[0]=PiecePosX[MoveType][ii];
    dragPiece[1]=PiecePosY[MoveType][ii];
    dragPiece[2]=xx1;
    dragPiece[3]=yy1;
    dragPiece[4]=-1;
  }
  if (jj<0) 
    HistPiece[1][cc] = -1;
  else
  { if (ttype3>=0)
    { HistPiece[1][cc] = jj;
      HistType[1][cc] = PieceType[MoveType][jj];
      HistPosX[1][cc] = PiecePosX[MoveType][jj];
      HistPosY[1][cc] = PiecePosY[MoveType][jj];
      if (!isAnimating)
      { dragPiece[4]=PiecePosX[MoveType][jj];
        dragPiece[5]=PiecePosY[MoveType][jj];
        dragPiece[6]=xx3;
        dragPiece[7]=yy3;
      }
    }
    else
    { HistPiece[1][cc] = 16+jj;
      HistType[1][cc] = PieceType[1-MoveType][jj];
      HistPosX[1][cc] = PiecePosX[1-MoveType][jj];
      HistPosY[1][cc] = PiecePosY[1-MoveType][jj];
    }
  }
  
  Board[PiecePosX[MoveType][ii]][PiecePosY[MoveType][ii]]=0;
  if (jj>=0)
  { if (ttype3<0)
      Board[PiecePosX[1-MoveType][jj]][PiecePosY[1-MoveType][jj]]=0;
    else
      Board[PiecePosX[MoveType][jj]][PiecePosY[MoveType][jj]]=0;
  }
  PieceType[MoveType][ii]=ttype1;
  if ((PiecePosX[MoveType][ii]!=xx1)||(PiecePosY[MoveType][ii]!=yy1)||(jj>=0))
  { PieceMoves[MoveType][ii]++; dd++; } //not a nullmove
  PiecePosX[MoveType][ii]=xx1;
  PiecePosY[MoveType][ii]=yy1;
  if (jj>=0)
  { if (ttype3<0)
    { PieceType[1-MoveType][jj]=ttype3;
      PieceMoves[1-MoveType][jj]++;
    }
    else
    { PiecePosX[MoveType][jj]=xx3;
      PiecePosY[MoveType][jj]=yy3;
      PieceMoves[MoveType][jj]++;
    }
  }
  if (jj>=0)
  { if (ttype3<0)
      Board[PiecePosX[1-MoveType][jj]][PiecePosY[1-MoveType][jj]]=0;    
    else
      Board[PiecePosX[MoveType][jj]][PiecePosY[MoveType][jj]]=(PieceType[MoveType][jj]+1)*(1-2*MoveType);
  }
  Board[PiecePosX[MoveType][ii]][PiecePosY[MoveType][ii]]=(PieceType[MoveType][ii]+1)*(1-2*MoveType);

  if ((ttype1==0)&&(ttype3==2)) //O-O-O, O-O
  { while (ff>xx1) 
    { iis_check+=IsCheck(ff, MoveType*7, MoveType);
      ff--;      
    }
    while (ff<xx1) 
    { iis_check+=IsCheck(ff, MoveType*7, MoveType);
      ff++;      
    } 
  }
  iis_check+=IsCheck(PiecePosX[MoveType][0], PiecePosY[MoveType][0], MoveType);

  if ((iis_check==0)&&(sstore))
  { MoveArray[cc]=String.fromCharCode(97+HistPosX[0][cc])+(HistPosY[0][cc]+1)+String.fromCharCode(97+PiecePosX[MoveType][ii])+(PiecePosY[MoveType][ii]+1);
    if (HistType[0][cc] != PieceType[MoveType][ii])
    { if (MoveType==0) MoveArray[cc]+=PieceName.charAt(PieceType[MoveType][ii]);
      else MoveArray[cc]+=PieceName.charAt(PieceType[MoveType][ii]).toLowerCase();
    }
    MoveArray.length=cc+1;
    return(true);
  }

  Board[PiecePosX[MoveType][ii]][PiecePosY[MoveType][ii]]=0;
  Board[HistPosX[0][cc]][HistPosY[0][cc]]=(HistType[0][cc]+1)*(1-2*MoveType);
  PieceType[MoveType][ii]=HistType[0][cc];
  PiecePosX[MoveType][ii]=HistPosX[0][cc];
  PiecePosY[MoveType][ii]=HistPosY[0][cc];
  PieceMoves[MoveType][ii]-=dd;
  if (jj>=0)   
  { if (ttype3>=0)
    { Board[PiecePosX[MoveType][jj]][PiecePosY[MoveType][jj]]=0;
      Board[HistPosX[0][cc]][HistPosY[0][cc]]=(HistType[0][cc]+1)*(1-2*MoveType);
      Board[HistPosX[1][cc]][HistPosY[1][cc]]=(HistType[1][cc]+1)*(1-2*MoveType);
      PieceType[MoveType][jj]=HistType[1][cc];
      PiecePosX[MoveType][jj]=HistPosX[1][cc];
      PiecePosY[MoveType][jj]=HistPosY[1][cc];
      PieceMoves[MoveType][jj]--;
    }
    else
    { Board[HistPosX[1][cc]][HistPosY[1][cc]]=(HistType[1][cc]+1)*(2*MoveType-1);
      PieceType[1-MoveType][jj]=HistType[1][cc];
      PiecePosX[1-MoveType][jj]=HistPosX[1][cc];
      PiecePosY[1-MoveType][jj]=HistPosY[1][cc];
      PieceMoves[1-MoveType][jj]--;
    }
  }
  if (iis_check==0) return(true);
  return(false);
}

function IsCheck(xx, yy, tt)
{ var ii0=xx, jj0=yy, ddi, ddj, bb;
  for (ddi=-2; ddi<=2; ddi+=4)
  { for (ddj=-1; ddj<=1; ddj+=2)
    { if (IsOnBoard(ii0+ddi, jj0+ddj))  
      { if (Board[ii0+ddi][jj0+ddj]==10*tt-5) return(1);
      }
    }
  }
  for (ddi=-1; ddi<=1; ddi+=2)
  { for (ddj=-2; ddj<=2; ddj+=4)
    { if (IsOnBoard(ii0+ddi, jj0+ddj)) 
      { if (Board[ii0+ddi][jj0+ddj]==10*tt-5) return(1);
      }
    }
  }
  for (ddi=-1; ddi<=1; ddi+=2)
  { ddj=1-2*tt;
    { if (IsOnBoard(ii0+ddi, jj0+ddj)) 
      { if (Board[ii0+ddi][jj0+ddj]==12*tt-6) return(1);
      }
    }
  }
  if ((Math.abs(PiecePosX[1-tt][0]-xx)<2)&&(Math.abs(PiecePosY[1-tt][0]-yy)<2)) 
    return(1);
  for (ddi=-1; ddi<=1; ddi+=1)
  { for (ddj=-1; ddj<=1; ddj+=1)
    { if ((ddi!=0)||(ddj!=0))
      { ii0=xx+ddi; 
        jj0=yy+ddj;
        bb=0;
        while ((IsOnBoard(ii0, jj0))&&(bb==0))
        { bb=Board[ii0][jj0];
          if (bb==0)
          { ii0+=ddi;
            jj0+=ddj;
          }
          else
          { if (bb==4*tt-2) return(1); 
            if ((bb==6*tt-3)&&((ddi==0)||(ddj==0))) return(1); 
            if ((bb==8*tt-4)&&(ddi!=0)&&(ddj!=0)) return(1); 
          }  
        }
      }
    }
  }
  return(0);
}

function IsOnBoard(ii, jj)
{ if (ii<0) return(false);
  if (ii>7) return(false);
  if (jj<0) return(false);
  if (jj>7) return(false);
  return(true);
}

function GetMove(tt,nn)
{ var ii=0, jj=0, mm="", ll=-1, cc, ss=tt;
  while (ss.indexOf("<br />")>0) ss=ss.replace("<br />","");
  var kk=ss.length;
  while (ii<kk)
  { cc=ss.charCodeAt(ii);
    if ((cc<=32))//||(cc==46)) //||(cc>=127))
    { if (ll+1!=ii) jj++;
      ll=ii;
    }
    else
    { if (jj==nn) 
      { if ((cc==46)&&(!isNaN(mm))) { mm=""; ll=ii; }
        else mm+=ss.charAt(ii);
      }
    }    
    ii++;
  }
  if ((nn==1)&&(mm=="")&&(ss.charAt(0)=="."))
  { ii=0;
    while (ii<kk)
    { cc=ss.charAt(ii);
      if ((cc!=".")&&(cc!=" ")) mm+=cc;
      ii++;
    }
  }
  if (mm!="")
  { ii=mm.indexOf("<");
    jj=mm.indexOf(">");
    ll=0; NewCommands.length=0;
    while ((ii>=0)&&(jj>=0)&&(ii<jj))
    { NewCommands[ll++]=mm.substr(ii+1,jj-ii-1);
      mm=mm.substr(0,ii)+mm.substr(jj+1);
      ii=mm.indexOf("<");
      jj=mm.indexOf(">");
    }
  }
  return(mm);
}

function ExecCommand(bb)
{ isExecCommand=bb;
}

function ExecCommands(nnc, hh)
{ var ii, jj, kk, nn, mm, cc, tt, bb0, bb1, xx0, yy0, xx1, yy1, aa="";
  if (!isExecCommand) return;
  if (document.layers) return;
  if (!document.getElementById("Board")) return;
  if (nnc)
  { NewCommands.length=0;
    if (nnc.indexOf(",")>0) NewCommands=nnc.replace(/ /g,'').split(",");
    else NewCommands[0]=nnc.replace(/ /g,'');
    if (hh);
    else HistCommand[MoveCount-StartMove]=NewCommands.join("|");
    setTimeout("ExecCommands()",100);
    return;
  }
  var dd=parseInt(document.getElementById("Board").offsetHeight);
  var dd32=Math.round(dd/32);
  for (ii=0; ii<OldCommands.length; ii++)
  { tt=OldCommands[ii].charAt(0);
    if ((tt=="B")||(tt=="C"))
    { nn=OldCommands[ii].charCodeAt(1)-97+(8-parseInt(OldCommands[ii].charAt(2)))*8;
      if (isRotated) nn=63-nn;
      if ((nn>=0)&&(nn<=63))
      { if (tt=="B") document.images[ImageOffset+nn].style.borderColor=BorderColor;
        else document.images[ImageOffset+nn].style.backgroundColor="transparent";
      }
    }
    if ((tt=="A")||(tt=="B")) document.getElementById("Canvas").innerHTML="<div style='position:absolute;top:0px;left:0px;width:0px;height:0px;'></div>";
  }
  if (NewCommands.length>2) SetAutoPlay(false);
  for (ii=0; ii<NewCommands.length; ii++)
  { tt=NewCommands[ii].substr(1,4);
    if ((tt=="this")||(tt=="last"))
    { if (tt=="this") { kk=MoveCount-StartMove-1; ll=0; }
      else  { kk=MoveCount-StartMove-2; ll=1; }
      if (kk>=0)
      { tt=NewCommands[ii].charAt(0);
        cc=NewCommands[ii].substr(5,8);
        nn=NewCommands.length;   
        if ((tt=="B")||(tt=="C"))
        { NewCommands[nn]=tt+String.fromCharCode(97+HistPosX[0][kk])+(1+HistPosY[0][kk])+cc;
          NewCommands[nn+1]=tt+String.fromCharCode(97+PiecePosX[(MoveType+ll+1)%2][HistPiece[0][kk]])+(1+PiecePosY[(MoveType+ll+1)%2][HistPiece[0][kk]])+cc;
        }
        if (tt=="A")
        { NewCommands[nn]=tt+String.fromCharCode(97+HistPosX[0][kk])+(1+HistPosY[0][kk]);
          NewCommands[nn]+=String.fromCharCode(97+PiecePosX[(MoveType+ll+1)%2][HistPiece[0][kk]])+(1+PiecePosY[(MoveType+ll+1)%2][HistPiece[0][kk]])+cc;
        }
        NewCommands[ii]="X";
      }
    }
    else
    { tt=NewCommands[ii].charAt(0);
      if ((tt=="B")||(tt=="C"))
      { nn=NewCommands[ii].charCodeAt(1)-97+(8-parseInt(NewCommands[ii].charAt(2)))*8;
        if ((nn>=0)&&(nn<=63))
        { if (isRotated) nn=63-nn;
          cc=NewCommands[ii].substr(3,8);
          if (cc=="R") cc="FF0000";
          if (cc=="G") cc="00FF00";
          if (cc=="B") cc="0000FF";
          if (cc.length<6) cc="#FFFFFF";
          else cc="#"+cc;
          if (tt=="B") document.images[ImageOffset+nn].style.borderColor=cc.substr(0,7);
          else document.images[ImageOffset+nn].style.backgroundColor=HEX2RGBA(cc);   
        }
      }
      if ((tt=="B")&&(dd>0))
      { kk=NewCommands[ii].charCodeAt(1)-97;
        jj=parseInt(NewCommands[ii].charAt(2));
        nn=kk+(8-jj)*8;      
        if ((nn>=0)&&(nn<=63)) bb0=Board[kk][jj-1];
        if ((nn>=0)&&(nn<=63))
        { if (isRotated) nn=63-nn;
          xx0=nn%8; yy0=(nn-xx0)/8;
          cc=NewCommands[ii].substr(3,8);
          if (cc=="R") cc="FF0000";
          if (cc=="G") cc="00FF00";
          if (cc=="B") cc="0000FF";
          if (cc.length<6) cc="#FFFFFF";
          else cc="#"+cc;
          aa+=GetBorder(xx0,yy0,HEX2RGBA(cc),dd);        
        }
      }
      if ((tt=="A")&&(dd>0))
      { kk=NewCommands[ii].charCodeAt(1)-97;
        jj=parseInt(NewCommands[ii].charAt(2));
        nn=kk+(8-jj)*8;
        if ((nn>=0)&&(nn<=63)) bb0=Board[kk][jj-1];
        kk=NewCommands[ii].charCodeAt(3)-97;
        jj=parseInt(NewCommands[ii].charAt(4));
        mm=kk+(8-jj)*8;
        if ((mm<0)||(mm>63)) 
        { mm=nn; 
          kk=NewCommands[ii].charCodeAt(1)-97;
          jj=parseInt(NewCommands[ii].charAt(2));
        }        
        if ((mm>=0)&&(mm<=63)) bb1=Board[kk][jj-1];
        if ((nn>=0)&&(nn<=63)&&(mm>=0)&&(mm<=63))
        { if (isRotated) { nn=63-nn; mm=63-mm; }
          xx0=nn%8; yy0=(nn-xx0)/8;
          xx1=mm%8; yy1=(mm-xx1)/8;
          nn=0; mm=0;        
          if (xx0<xx1) nn=1;
          if (xx0>xx1) nn=-1;
          if (yy0<yy1) mm=1;
          if (yy0>yy1) mm=-1;
          xx0=Math.round((2*xx0+1)*dd/16);
          yy0=Math.round((2*yy0+1)*dd/16);
          if (bb0!=0)
          { xx0+=nn*dd32;
            yy0+=mm*dd32;
          }
          xx1=Math.round((2*xx1+1)*dd/16);
          yy1=Math.round((2*yy1+1)*dd/16);
          if (bb1!=0)
          { xx1-=nn*dd32;
            yy1-=mm*dd32;
          }
          cc=NewCommands[ii].substr(5,8);
          if (cc=="R") cc="FF0000";
          if (cc=="G") cc="00FF00";
          if (cc=="B") cc="0000FF";
          if (cc.length<6) cc="#FFFFFF";
          else cc="#"+cc;
          if (NewCommands[ii].charAt(4)=="0") aa+=GetArrow(xx0,yy0,0,0,HEX2RGBA(cc),dd);
          else aa+=GetArrow(xx0,yy0,xx1,yy1,HEX2RGBA(cc),dd);
        }
      }
    }
  }
  if (aa!="") 
  { document.getElementById("Canvas").style.top=-dd+"px";
    for (ii=0; ii<8; ii++)
    { for (jj=0; jj<8; jj++)
        aa+="<div id='c"+eval(ii+jj*8)+"' onMouseDown='BoardClick("+eval(ii+jj*8)+")' style='position:absolute;left:"+Math.round(ii*dd/8)+"px;top:"+Math.round(jj*dd/8)+"px;width:"+Math.round(dd/8)+"px;height:"+Math.round(dd/8)+"px;z-index:101;'></div>";
    }
    document.getElementById("Canvas").innerHTML=aa;
  }
  OldCommands.length=0;
  for (ii=0; ii<NewCommands.length; ii++) OldCommands[ii]=NewCommands[ii];
  NewCommands.length=0;
}

function SkipRefreshBoard(nn)
{ SkipRefresh=nn;
}

function RefreshBoard(rr)
{ if (SkipRefresh>0) return;
  InitImages();
  if (rr) DocImg.length=0;
  var ii, jj, kk, kk0, ll, mm=1;
  if (document.images["RightLabels"])
  { if (IsLabelVisible)
    { if (isRotated) SetImg("RightLabels",LabelPic[2]);
      else SetImg("RightLabels",LabelPic[0]);
    }
    else SetImg("RightLabels",LabelPic[4]);
  }
  if (document.images["BottomLabels"])
  { if (IsLabelVisible)
    { if (isRotated) SetImg("BottomLabels",LabelPic[3]);
      else SetImg("BottomLabels",LabelPic[1]);
    }
    else SetImg("BottomLabels",LabelPic[4]); 
  }
  if (isSetupBoard)
  { if (isRotated)
    { for (ii=0; ii<8; ii++)
      { for (jj=0; jj<8; jj++)
        { if (Board[ii][jj]==0)
            SetImg(63-ii-(7-jj)*8,BoardPic);
          else
            SetImg(63-ii-(7-jj)*8,PiecePic[(1-sign(Board[ii][jj]))/2][Math.abs(Board[ii][jj])-1]);
        }
      }
    }
    else
    { for (ii=0; ii<8; ii++)
      { for (jj=0; jj<8; jj++)
        { if (Board[ii][jj]==0)
            SetImg(ii+(7-jj)*8,BoardPic);
          else
            SetImg(ii+(7-jj)*8,PiecePic[(1-sign(Board[ii][jj]))/2][Math.abs(Board[ii][jj])-1]);
        }
      }
    }
  }
  else
  { for (ii=0; ii<8; ii++)
    { for (jj=0; jj<8; jj++)
      { if (Board[ii][jj]==0)
        { if (isRotated)
            SetImg(63-ii-(7-jj)*8,BoardPic);
          else
            SetImg(ii+(7-jj)*8,BoardPic);
        }
      }
    }
    for (ii=0; ii<2; ii++)
    { for (jj=0; jj<16; jj++)
      { if (PieceType[ii][jj]>=0)
        { kk=PiecePosX[ii][jj]+8*(7-PiecePosY[ii][jj]);
          if (isRotated)
            SetImg(63-kk,PiecePic[ii][PieceType[ii][jj]]);  
          else
            SetImg(kk,PiecePic[ii][PieceType[ii][jj]]);
        }
      }
    }
    if (isCapturedPieces)
    { var pp0=new Array(0,1,1,2,2,2,8);
      kk0=0;
      if (document.images["RightLabels"]) kk0++;
      kk=0;
      ii=0;
      if (isRotated) ii=1;
      for (jj=0; jj<16; jj++) pp0[PieceType[ii][jj]+1]--;
      for (jj=1; jj<5; jj++)
      { for (ll=0; ll<pp0[jj+1]; ll++)
        { SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,PiecePic[ii][jj]);
          kk++;
          pp0[0]++;
        }
      }
      for (ll=0; ll>pp0[0]; ll--)
      { SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,PiecePic[ii][5]);
        kk++;
      }
      if (mm<kk) mm=kk;
      while (kk<4) { SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,BoardPic); kk++; }
      while (kk<16){ SetImg(64+kk0+(kk-kk%4)/4+(kk%4)*4,LabelPic[4]); kk++; }
      var pp1=new Array(0,1,1,2,2,2,8);
      kk=0;
      ii=1-ii;
      for (jj=0; jj<16; jj++) pp1[PieceType[ii][jj]+1]--;
      for (jj=1; jj<5; jj++)
      { for (ll=0; ll<pp1[jj+1]; ll++)
        { SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,PiecePic[ii][jj]);
          kk++;
          pp1[0]++;
        }
      }
      for (ll=0; ll>pp1[0]; ll--)
      { SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,PiecePic[ii][5]);
        kk++;
      }
      if (mm<kk) mm=kk;
      while (kk<4) { SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,BoardPic); kk++; }
      while (kk<16){ SetImg(92+kk0+(kk-kk%4)/4-(kk%4)*4,LabelPic[4]); kk++; }
      mm=Math.ceil(mm/4);
      if ((parent)&&(parent.ChangeColWidth)) parent.ChangeColWidth(mm);
    }
  }
}

function SetLastStyle(ss)
{ LastStyle=ss;
}

function SetThisStyle(ss)
{ ThisStyle=ss;
}

function SetCandidateStyle(ss)
{ CandidateStyle=ss;
}

function SetBCStyle(ss)
{ BCStyle=ss;
  if(!ss) 
  { BCCmds=""; 
    if (LastStyle) 
      BCCmds+=LastStyle.charAt(0)+"last"+LastStyle.substr(1);
    if (ThisStyle) 
    { if (LastStyle) BCCmds+=",";
      BCCmds+=ThisStyle.charAt(0)+"this"+ThisStyle.substr(1);
    }
    ExecCommands(BCCmds,1); 
  }
}

function HighlightCandidates(nn, ccs)
{ if (nn<0) { ExecCommands('',1); return; }
  var ii0=nn%8;
  var jj0=7-(nn-ii0)/8;
  var pp=Board[ii0][jj0];
  var cc=sign(pp);
  var tt=(1-cc)/2;
  var dd, ddi, ddj, bb, jj, aa=new Array();
  var nna=0, ddA=0;
  if (ccs.charAt(0)=="A") ddA=1;

  if (Math.abs(pp)==6)
  { Board[ii0][jj0]=0;
    if (IsOnBoard(ii0, jj0+cc))
    { bb=Board[ii0][jj0+cc];
      if (bb==0)
      { Board[ii0][jj0+cc]=pp;
        if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
          aa[nna++]=String.fromCharCode(ii0+97)+(jj0+cc+1);
        Board[ii0][jj0+cc]=bb;
        if (2*jj0+5*cc==7)
        { bb=Board[ii0][jj0+2*cc];
          if (bb==0)
          { Board[ii0][jj0+2*cc]=pp;
            if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
            { nna-=ddA;
              aa[nna++]=String.fromCharCode(ii0+97)+(jj0+2*cc+1);
            }
            Board[ii0][jj0+2*cc]=bb;
          }	
        }
      }
    }
    for (ddi=-1; ddi<=1; ddi+=2)
    { if (IsOnBoard(ii0+ddi, jj0+cc))  
      { bb=Board[ii0+ddi][jj0+cc];
        if (bb*cc<0)
        { Board[ii0+ddi][jj0+cc]=pp;
          if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
            aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+cc+1);
          Board[ii0+ddi][jj0+cc]=bb;
        }
      }
      if (2*jj0-cc==7)
      { if (IsOnBoard(ii0+ddi, jj0))
        { if (Board[ii0+ddi][jj0]==-cc*6) 
      	  { bb=Board[ii0+ddi][jj0+cc];
            if (bb==0)
            { if (MoveCount>StartMove)
              { CanPass=-1;
                dd=HistPiece[0][MoveCount-StartMove-1];
                if ((HistType[0][MoveCount-StartMove-1]==5)&&(Math.abs(HistPosY[0][MoveCount-StartMove-1]-PiecePosY[1-MoveType][dd])==2))
                  CanPass=PiecePosX[1-MoveType][dd];
              }
              else 
                CanPass=EnPass;
              if (CanPass==ii0+ddi)
              { Board[ii0+ddi][jj0+cc]=pp;
                Board[ii0+ddi][jj0]=0; //bugfix 20130625
                if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
                  aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+cc+1);
                Board[ii0+ddi][jj0]=-pp; //bugfix 20130625
                Board[ii0+ddi][jj0+cc]=bb;
              }
            }
          }
        }
      }
    }
    Board[ii0][jj0]=pp;
  }
  
  if (Math.abs(pp)==5)
  { Board[ii0][jj0]=0;
    for (ddi=-2; ddi<=2; ddi+=4)
    { for (ddj=-1; ddj<=1; ddj+=2)
      { if (IsOnBoard(ii0+ddi, jj0+ddj))  
        { bb=Board[ii0+ddi][jj0+ddj];
          if (bb*cc<=0)
          { Board[ii0+ddi][jj0+ddj]=pp;
            if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
              aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+ddj+1);
            Board[ii0+ddi][jj0+ddj]=bb;
          }
        }
      }
    }
    for (ddi=-1; ddi<=1; ddi+=2)
    { for (ddj=-2; ddj<=2; ddj+=4)
      { if (IsOnBoard(ii0+ddi, jj0+ddj))  
        { bb=Board[ii0+ddi][jj0+ddj];
          if (bb*cc<=0)
          { Board[ii0+ddi][jj0+ddj]=pp;
            if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
              aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+ddj+1);
            Board[ii0+ddi][jj0+ddj]=bb;
          }
        }
      }
    }
    Board[ii0][jj0]=pp;
  }
  
  if ((Math.abs(pp)==2)||(Math.abs(pp)==4))
  { Board[ii0][jj0]=0;
    dd=1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0+dd))&&(bb==0))  
    { bb=Board[ii0+dd][jj0+dd];
      if (bb*cc<=0)
      { Board[ii0+dd][jj0+dd]=pp;
        if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+dd+1);
          nna-=ddA;
        }
        Board[ii0+dd][jj0+dd]=bb;
      }
      dd++;
    }
    if (dd>1) nna+=ddA;
    dd=-1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0+dd))&&(bb==0))  
    { bb=Board[ii0+dd][jj0+dd];
      if (bb*cc<=0)
      { Board[ii0+dd][jj0+dd]=pp;
        if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+dd+1);
          nna-=ddA;
        }
        Board[ii0+dd][jj0+dd]=bb;
      }
      dd--;
    }
    if (dd<-1) nna+=ddA;
    dd=1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0-dd))&&(bb==0))  
    { bb=Board[ii0+dd][jj0-dd];
      if (bb*cc<=0)
      { Board[ii0+dd][jj0-dd]=pp;
        if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0-dd+1);
          nna-=ddA;
        }
        Board[ii0+dd][jj0-dd]=bb;
      }
      dd++;
    }
    if (dd>1) nna+=ddA;
    dd=-1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0-dd))&&(bb==0))  
    { bb=Board[ii0+dd][jj0-dd];
      if (bb*cc<=0)
      { Board[ii0+dd][jj0-dd]=pp;
        if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0-dd+1);
          nna-=ddA;
        }
        Board[ii0+dd][jj0-dd]=bb;
      }
      dd--;
    }
    if (dd<-1) nna+=ddA;
    Board[ii0][jj0]=pp;
  }
  
    
  if ((Math.abs(pp)==2)||(Math.abs(pp)==3))
  { Board[ii0][jj0]=0;
    dd=1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0))&&(bb==0))  
    { bb=Board[ii0+dd][jj0];
      if (bb*cc<=0)
      { Board[ii0+dd][jj0]=pp;
        if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+1);
          nna-=ddA;
        }
        Board[ii0+dd][jj0]=bb;
      }
      dd++;
    }
    if (dd>1) nna+=ddA;
    dd=-1;
    bb=0;
    while ((IsOnBoard(ii0+dd,jj0))&&(bb==0))  
    { bb=Board[ii0+dd][jj0];
      if (bb*cc<=0)
      { Board[ii0+dd][jj0]=pp;
        if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
        { aa[nna++]=String.fromCharCode(ii0+dd+97)+(jj0+1);
          nna-=ddA;
        }
        Board[ii0+dd][jj0]=bb;
      }
      dd--;
    }
    if (dd<-1) nna+=ddA;
    dd=1;
    bb=0;
    while ((IsOnBoard(ii0,jj0+dd))&&(bb==0))  
    { bb=Board[ii0][jj0+dd];
      if (bb*cc<=0)
      { Board[ii0][jj0+dd]=pp;
        if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
        { aa[nna++]=String.fromCharCode(ii0+97)+(jj0+dd+1);
          nna-=ddA;
        }
        Board[ii0][jj0+dd]=bb;
      }
      dd++;
    }
    if (dd>1) nna+=ddA;
    dd=-1;
    bb=0;
    while ((IsOnBoard(ii0,jj0+dd))&&(bb==0))  
    { bb=Board[ii0][jj0+dd];
      if (bb*cc<=0)
      { Board[ii0][jj0+dd]=pp;
        if (!IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], tt))
        { aa[nna++]=String.fromCharCode(ii0+97)+(jj0+dd+1);
          nna-=ddA;
        }
        Board[ii0][jj0+dd]=bb;
      }
      dd--;
    }
    if (dd<-1) nna+=ddA;
    Board[ii0][jj0]=pp;
  }
  
  if (Math.abs(pp)==1)
  { Board[ii0][jj0]=0;
    for (ddi=-1; ddi<=1; ddi++)
    { for (ddj=-1; ddj<=1; ddj++)
      { if (((ddi!=0)||(ddj!=0))&&(IsOnBoard(ii0+ddi, jj0+ddj)))  
        { bb=Board[ii0+ddi][jj0+ddj];
          if (bb*cc<=0)
          { Board[ii0+ddi][jj0+ddj]=pp;
            if (!IsCheck(ii0+ddi, jj0+ddj, tt))
              aa[nna++]=String.fromCharCode(ii0+ddi+97)+(jj0+ddj+1);
            Board[ii0+ddi][jj0+ddj]=bb;
          }
        }
      }
    }
    Board[ii0][jj0]=pp;
    jj=CanCastleLong();//O-O-O with Chess960 rules
    if (jj>=0)
    { Board[ii0][jj0]=0;
      Board[PiecePosX[MoveType][jj]][PiecePosY[MoveType][jj]]=0;
      Board[2][tt*7]=1-2*tt;
      Board[3][tt*7]=3*(1-2*tt);
      ddi=ii0;
      bb=0;
      { while (ddi>2) 
        { bb+=IsCheck(ddi, tt*7, tt);
          ddi--;      
        }
        while (ddi<2) 
        { bb+=IsCheck(ddi, tt*7, tt);
          ddi++;
        }
        bb+=IsCheck(2, tt*7, tt);
      }
      bb+=IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], MoveType);
      if (bb==0) aa[nna++]=String.fromCharCode(2+97)+(tt*7+1);
      Board[2][tt*7]=0;
      Board[3][tt*7]=0;
      Board[ii0][jj0]=pp;
      Board[PiecePosX[tt][jj]][PiecePosY[tt][jj]]=cc*3;
    }
    jj=CanCastleShort();//O-O with Chess960 rules
    if (jj>=0)
    { Board[ii0][jj0]=0;
      Board[PiecePosX[MoveType][jj]][PiecePosY[MoveType][jj]]=0;
      Board[6][tt*7]=1-2*tt;
      Board[5][tt*7]=3*(1-2*tt);
      ddi=ii0;
      bb=0;
      { while (ddi>6) 
        { bb+=IsCheck(ddi, tt*7, tt);
          ddi--;      
        }
        while (ddi<6) 
        { bb+=IsCheck(ddi, tt*7, tt);
          ddi++;
        }
        bb+=IsCheck(6, tt*7, tt);
      }
      bb+=IsCheck(PiecePosX[tt][0], PiecePosY[tt][0], MoveType);
      if (bb==0) aa[nna++]=String.fromCharCode(6+97)+(tt*7+1);
      Board[6][tt*7]=0;
      Board[5][tt*7]=0;
      Board[ii0][jj0]=pp;
      Board[PiecePosX[tt][jj]][PiecePosY[tt][jj]]=cc*3;
    }
  }

  if ((nna>0)&&(ccs!=" "))
  { tt=ccs.charAt(0);
    cc=ccs.substr(1,6);
    if (tt=="A")
    { bb=tt+String.fromCharCode(ii0+97)+(jj0+1)+aa[0]+cc;
      for (jj=1; jj<nna; jj++) bb+=","+tt+String.fromCharCode(ii0+97)+(jj0+1)+aa[jj]+cc;
    }
    else
    { bb=tt+aa[0]+cc;
      for (jj=1; jj<nna; jj++) bb+=","+tt+aa[jj]+cc;
    }
    ExecCommands(bb,1);
  }  
  else return(aa);
}

function AddBCCmd(nn,bb)
{ var aa, ii, jj, mm, ll, nnn=nn;
  if (isDragDrop&&(!bb)) return;
  if (!BCCmds)
  { BCCmds="";
    if (LastStyle) 
      BCCmds+=LastStyle.charAt(0)+"last"+LastStyle.substr(1);
    if (ThisStyle) 
    { if (LastStyle) BCCmds+=",";
      BCCmds+=ThisStyle.charAt(0)+"this"+ThisStyle.substr(1);
    }
  }  
  aa=BCCmds;
  if (isRotated) nnn=63-nn; 
  ii=nnn%8;
  jj=7-(nnn-ii)/8;
  mm=String.fromCharCode(ii+97)+eval(jj+1);
  if (BCStyle.charAt(0)=="A") 
  { ll=BCCmds.indexOf("i0");
    if (ll>=0) BCCmds=BCCmds.replace("i0",mm);
    else { if (BCCmds) BCCmds+=","; BCCmds+="A"+mm+"i0"+BCStyle.substr(1); }
  }    
  else 
  { if (BCCmds) BCCmds+=","
    BCCmds+=BCStyle.substr(0,1)+mm+BCStyle.substr(1);
  }
  if (aa) aa=BCCmds.split(",");
  ll=aa.length-1;
  for (ii=0;ii<ll; ii++) 
  { if (aa[ii]==aa[ll])
    { for (jj=ii+1; jj<ll; jj++) aa[jj-1]=aa[jj];
      ll-=2;
      ii=ll;
    }
  }
  if (ll<aa.length-1)
  { aa.length=ll+1;
    BCCmds=aa.join(",");
  }
  ExecCommands(BCCmds,1);
}
function UndoBCCmd()
{ if (!BCCmds) return;
  var aa=BCCmds.split(",");
  var ll=aa.length;
  if (ll==1) BCCmds="";
  else {aa.length=ll-1; BCCmds=aa.join(","); }
  ExecCommands(BCCmds,1);
}

function SetBoardClicked(nn)
{ if (! document.BoardForm) return;
  if (! document.images[ImageOffset].style) { BoardClicked=nn; return; }
  if (CandidateStyle!="") HighlightCandidates(nn,CandidateStyle);
  if (isDragDrop) { BoardClicked=nn; return; }
  if (BoardClicked>=0) 
  { if (BoardClicked<64)
    { if (isRotated)
        document.images[ImageOffset+63-BoardClicked].style.borderColor=BorderColor;
      else
        document.images[ImageOffset+BoardClicked].style.borderColor=BorderColor;
    }
    else document.images[ImageOffset+BoardClicked+3].style.borderColor=BorderColor;
  }  
  BoardClicked=nn;
  if (BoardClicked>=0) 
  { if (BoardClicked<64)
    { if (isRotated)
        document.images[ImageOffset+63-BoardClicked].style.borderColor="#FF0000";
      else
        document.images[ImageOffset+BoardClicked].style.borderColor="#FF0000";
    }
    else document.images[ImageOffset+BoardClicked+3].style.borderColor="#FF0000";
  }
}

function BoardClickMove(nn)
{ var ii0, jj0, ii1, jj1, iiv, jjv, nnn=nn, mm, mmx="", pp=0;
  if (BoardClicked>=0) return(false);
  if (isRotated) nnn=63-nn; 
  ii1=nnn%8;
  jj1=7-(nnn-ii1)/8;
  if (sign(Board[ii1][jj1])==((MoveCount+1)%2)*2-1) return(false);
  for (ii0=0; ii0<8; ii0++)
  { for (jj0=0; jj0<8; jj0++)
    { if (sign(Board[ii0][jj0])==((MoveCount+1)%2)*2-1) 
      { if (Math.abs(Board[ii0][jj0])==6)
        { mm=String.fromCharCode(ii0+97)+eval(jj0+1);
          if (ii0!=ii1) mm+="x";
        }
        else
        { mm=PieceName.charAt(Math.abs(Board[ii0][jj0])-1)+String.fromCharCode(ii0+97)+eval(jj0+1);
          if (Board[ii1][jj1]!=0) mm+="x";
        }
        mm+=String.fromCharCode(ii1+97)+eval(jj1+1);
        if ((jj1==(1-MoveType)*7)&&(Math.abs(Board[ii0][jj0])==6)&&(Math.abs(jj0-jj1)<=1)&&(Math.abs(ii0-ii1)<=1))
        { mm=mm+"="+PieceName.charAt(1);
        }
        if (ParseMove(mm, false))
        { pp++;
          iiv=ii0;
          jjv=jj0;
          mmx=mm;
        }
      }
    }
  }
  if ((pp==1)&&((AutoCapture)||(mmx.indexOf("x")<0)))
  { SetBoardClicked(iiv+8*(7-jjv));
    BoardClick(nn);
    return(true);
  }
  return(false);
}

function BoardClick(nn,bb)
{ var ii0, jj0, ii1, jj1, mm, nnn, vv, ffull, ssearch, llst, ffst, ttmp, mmove0;
  var pp, ffst=0, ssearch, ssub;
  if (isSetupBoard) { SetupBoardClick(nn); return; }
  if (! isRecording) return;
  if (BCStyle) { AddBCCmd(nn,bb); return; }
  if (isAutoPlay) SetAutoPlay(false);
  if (MoveCount==MaxMove) return;
  if (BoardClickMove(nn)) return;
  if (isDragDrop&&(!bb)) return;
  if (isRotated) nnn=63-nn;
  else nnn=nn;
  if (BoardClicked==nnn) { SetBoardClicked(-1); return; }
  if (BoardClicked<0) 
  { ii0=nnn%8;
    jj0=7-(nnn-ii0)/8;
    if (sign(Board[ii0][jj0])==0) return;
    if (sign(Board[ii0][jj0])!=((MoveCount+1)%2)*2-1) 
    { mm="---";
      if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
        ShortPgnMoveText[0][CurVar]=Uncomment(document.BoardForm.PgnMoveText.value);
      ssearch=Math.floor(MoveCount/2+1)+".";
      ffst=ShortPgnMoveText[0][CurVar].indexOf(ssearch);
      if (ffst>=0)
        ssub=ShortPgnMoveText[0][CurVar].substring(0, ffst);
      else
        ssub=ShortPgnMoveText[0][CurVar]; 
      if (ParseMove(mm, false)==0) { SetBoardClicked(-1); return; }
      if (!isNullMove) return;
      if (MoveCount%2==0) { if(isNullMove!=2) { if (!confirm("White nullmove?")) return; }}
      else { if(isNullMove!=2) {if (!confirm("Black nullmove?")) return; }}
      for (vv=CurVar; vv<ShortPgnMoveText[0].length; vv++)
      { if ((vv==CurVar)||((ShortPgnMoveText[1][vv]==CurVar)&&(ShortPgnMoveText[2][vv]==MoveCount)))
        { ffull=Uncomment(ShortPgnMoveText[0][vv]);
          ssearch=Math.floor(MoveCount/2+2)+".";
          llst=ffull.indexOf(ssearch);
          ssearch=Math.floor(MoveCount/2+1)+".";
          ffst=ffull.indexOf(ssearch);
          if (ffst>=0)
          { ffst+=ssearch.length;
            if (llst<0) ttmp=ffull.substring(ffst);
            else ttmp=ffull.substring(ffst, llst);
            mmove0=GetMove(ttmp,MoveType);
            if ((mmove0.indexOf(mm)<0)&&(MoveType==1))
            { ttmp=Math.floor(MoveCount/2+1);
              ssearch=ttmp+"....";
              ffst=ffull.indexOf(ssearch);
              if (ffst<0) { ssearch=ttmp+". ..."; ffst=ffull.indexOf(ssearch); }
              if (ffst<0) { ssearch=ttmp+". .."; ffst=ffull.indexOf(ssearch); }
              if (ffst<0) { ssearch=ttmp+" ..."; ffst=ffull.indexOf(ssearch); }
              if (ffst<0) { ssearch=ttmp+"..."; ffst=ffull.indexOf(ssearch); }            
              if (ffst<0) { ssearch=ttmp+" .."; ffst=ffull.indexOf(ssearch); }
              if (ffst>=0) 
              { ffst+=ssearch.length;
                if (llst<0) ttmp=ffull.substring(ffst);
                else ttmp=ffull.substring(ffst, llst);
                mmove0=GetMove(ttmp,0);
              }
            }
            if (mmove0.indexOf(mm)==0)
            { SetMove(MoveCount+1, vv);
              vv=ShortPgnMoveText[0].length+1;
              if (window.UserMove) setTimeout("UserMove(1,'"+mmove0+"')",Delay/2);
            }  
          }  
        }  
      }
      if (vv<ShortPgnMoveText[0].length+1)
      { if ((RecordCount==0)&&(!((document.BoardForm)&&(document.BoardForm.PgnMoveText))))
        { vv=ShortPgnMoveText[0].length;
          ShortPgnMoveText[0][vv]="";
          ShortPgnMoveText[1][vv]=CurVar;
          ShortPgnMoveText[2][vv]=MoveCount;
          CurVar=vv;
        }  
        ParseMove(mm,true);
        if (window.UserMove) setTimeout("UserMove(0,'"+mm+"')",Delay/2);
        if (MoveType==0)
        { HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+"."+mm;
          ssub+=Math.floor((MoveCount+2)/2)+".";
        }  
        else
        { HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mm;
          if (MoveCount==StartMove) ssub+=Math.floor((MoveCount+2)/2)+". ... ";
          else ssub+=HistMove[MoveCount-StartMove-1]+" ";
        }
        if (RecordCount==0) RecordedMoves=HistMove[MoveCount-StartMove];
        else
        { ttmp=RecordedMoves.split(" ");
          ttmp.length=RecordCount+((MoveCount-RecordCount)%2)*2;
          RecordedMoves=ttmp.join(" ");
          if (MoveType==0) RecordedMoves+=" "+HistMove[MoveCount-StartMove];
          else RecordedMoves+=" "+mm;
        }
        RecordCount++;
        MoveCount++;
        MoveType=1-MoveType;
        if (document.BoardForm)
        { if (document.BoardForm.PgnMoveText) document.BoardForm.PgnMoveText.value=ssub+mm+" ";
          if (document.BoardForm.Position)
            document.BoardForm.Position.value=TransformSAN(HistMove[MoveCount-StartMove-1]);
          if (nAudio) PlayAudio(HistMove[MoveCount-StartMove-1],0);
          NewCommands.length=0;
          if (LastStyle) NewCommands[NewCommands.length]=LastStyle.charAt(0)+"last"+LastStyle.substr(1);
          if (ThisStyle) NewCommands[NewCommands.length]=ThisStyle.charAt(0)+"this"+ThisStyle.substr(1);
          ExecCommands();
          RefreshBoard();
        }
      }
    }
    SetBoardClicked(nnn); 
    return; 
  } 
  ii0=BoardClicked%8;
  jj0=7-(BoardClicked-ii0)/8;
  ii1=nnn%8;
  jj1=7-(nnn-ii1)/8;
  if (Math.abs(Board[ii0][jj0])==6)
  { if (ii0!=ii1) mm=String.fromCharCode(ii0+97)+"x";
    else mm="";
  }
  else
  { mm=PieceName.charAt(Math.abs(Board[ii0][jj0])-1);
    if (Board[ii1][jj1]!=0) mm+="x";
  }
  SetBoardClicked(-1);
  mm+=String.fromCharCode(ii1+97)+eval(jj1+1);
  if (Math.abs(Board[ii0][jj0])==1)
  { if (PiecePosY[MoveType][0]==jj1)
    { if (PiecePosX[MoveType][0]+2==ii1) mm="O-O";
      if (PiecePosX[MoveType][0]-2==ii1) mm="O-O-O";
      if (Board[ii1][jj1]==(1-2*MoveType)*3) //for Chess960
      { if (ii1>ii0) mm="O-O";
        if (ii1<ii0) mm="O-O-O";
      }
    }  
  } 
  if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
    ShortPgnMoveText[0][CurVar]=Uncomment(document.BoardForm.PgnMoveText.value);
  ssearch=Math.floor(MoveCount/2+1)+".";
  ffst=ShortPgnMoveText[0][CurVar].indexOf(ssearch);
  if (ffst>=0)
    ssub=ShortPgnMoveText[0][CurVar].substring(0, ffst);
  else
    ssub=ShortPgnMoveText[0][CurVar]; 
  if ((jj1==(1-MoveType)*7)&&(Math.abs(Board[ii0][jj0])==6)&&(Math.abs(jj0-jj1)<=1)&&(Math.abs(ii0-ii1)<=1))
  { pp=0;
    while(pp==0)
    { if (pp==0) { if (confirm("Queen "+PieceName.charAt(1)+" ?")) pp=1; }
      if (pp==0) { if (confirm("Rook "+PieceName.charAt(2)+" ?")) pp=2; }
      if (pp==0) { if (confirm("Bishop "+PieceName.charAt(3)+" ?")) pp=3; }
      if (pp==0) { if (confirm("Knight "+PieceName.charAt(4)+" ?")) pp=4; }            
    }
    mm=mm+"="+PieceName.charAt(pp);
  }
  pp=ParseMove(mm, false);
  if (pp==0) return;
  if (Math.abs(Board[ii0][jj0])!=1)
  { var mmm;
    if (Math.abs(Board[ii0][jj0])==6)
    { if (mm.charAt(1)=="x") mmm=mm.substr(0,1)+eval(jj0+1)+mm.substr(1,11);
      else mmm=String.fromCharCode(ii0+97)+eval(jj0+1)+mm;
    }
    else mmm=mm.substr(0,1)+String.fromCharCode(ii0+97)+eval(jj0+1)+mm.substr(1,11);
    if (ParseMove(mmm, false)==0) return;
  }
  if (pp>1)
  { mm=mm.substr(0,1)+String.fromCharCode(ii0+97)+mm.substr(1,11);
    if (ParseMove(mm, false)!=1)
    { mm=mm.substr(0,1)+eval(jj0+1)+mm.substr(2,11);
      if (ParseMove(mm, false)!=1)
        mm=mm.substr(0,1)+String.fromCharCode(ii0+97)+eval(jj0+1)+mm.substr(2,11);
    }  
  }
  for (vv=CurVar; vv<ShortPgnMoveText[0].length; vv++)
  { if ((vv==CurVar)||((ShortPgnMoveText[1][vv]==CurVar)&&(ShortPgnMoveText[2][vv]==MoveCount)))
    { ffull=Uncomment(ShortPgnMoveText[0][vv]);
      ssearch=Math.floor(MoveCount/2+2)+".";
      llst=ffull.indexOf(ssearch);
      ssearch=Math.floor(MoveCount/2+1)+".";
      ffst=ffull.indexOf(ssearch);
      if (ffst>=0)
      { ffst+=ssearch.length;
        if (llst<0)
          ttmp=ffull.substring(ffst);
        else
          ttmp=ffull.substring(ffst, llst);  
        mmove0=GetMove(ttmp,MoveType);
        if ((mmove0.indexOf(mm)<0)&&(MoveType==1))
        { ttmp=Math.floor(MoveCount/2+1);
          ssearch=ttmp+"....";
          ffst=ffull.indexOf(ssearch);
          if (ffst<0) { ssearch=ttmp+". ..."; ffst=ffull.indexOf(ssearch); }
          if (ffst<0) { ssearch=ttmp+". .."; ffst=ffull.indexOf(ssearch); }
          if (ffst<0) { ssearch=ttmp+" ..."; ffst=ffull.indexOf(ssearch); }
          if (ffst<0) { ssearch=ttmp+"..."; ffst=ffull.indexOf(ssearch); }            
          if (ffst<0) { ssearch=ttmp+" .."; ffst=ffull.indexOf(ssearch); }
          if (ffst>=0) 
          { ffst+=ssearch.length;
            if (llst<0) ttmp=ffull.substring(ffst);
            else ttmp=ffull.substring(ffst, llst);
            mmove0=GetMove(ttmp,0);
          }
        }
        if ((mmove0.indexOf(mm)==0)&&(mmove0.indexOf(mm+mm.substr(1))!=0))
        { SetMove(MoveCount+1, vv);
          if (window.UserMove) setTimeout("UserMove(1,'"+mmove0+"')",Delay/2);
          return;
        }  
      }  
    }  
  }
  if ((RecordCount==0)&&(!((document.BoardForm)&&(document.BoardForm.PgnMoveText))))
  { vv=ShortPgnMoveText[0].length;
    ShortPgnMoveText[0][vv]="";
    ShortPgnMoveText[1][vv]=CurVar;
    ShortPgnMoveText[2][vv]=MoveCount;
    CurVar=vv;
  }   
  ParseMove(mm,true);
  if (IsCheck(PiecePosX[1-MoveType][0], PiecePosY[1-MoveType][0], 1-MoveType)) mm+="+";
  if (window.UserMove) setTimeout("UserMove(0,'"+mm+"')",Delay/2);
  if (MoveType==0)
  { HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+"."+mm;
    ssub+=Math.floor((MoveCount+2)/2)+".";
  }  
  else
  { HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mm;
    if (MoveCount==StartMove) ssub+=Math.floor((MoveCount+2)/2)+". ... ";
    else ssub+=HistMove[MoveCount-StartMove-1]+" ";
  }
  if (RecordCount==0) RecordedMoves=HistMove[MoveCount-StartMove];
  else
  { ttmp=RecordedMoves.split(" ");
    ttmp.length=RecordCount+((MoveCount-RecordCount)%2)*2;
    RecordedMoves=ttmp.join(" ");
    if (MoveType==0) RecordedMoves+=" "+HistMove[MoveCount-StartMove];
    else RecordedMoves+=" "+mm;
  }
  RecordCount++;
  MoveCount++;
  MoveType=1-MoveType;
  if (document.BoardForm)
  { if (document.BoardForm.PgnMoveText) document.BoardForm.PgnMoveText.value=ssub+mm+" ";
    if (document.BoardForm.Position)
      document.BoardForm.Position.value=TransformSAN(HistMove[MoveCount-StartMove-1]);
    if (nAudio) PlayAudio(HistMove[MoveCount-StartMove-1],0);
    NewCommands.length=0;
    if (LastStyle) NewCommands[NewCommands.length]=LastStyle.charAt(0)+"last"+LastStyle.substr(1);
    if (ThisStyle) NewCommands[NewCommands.length]=ThisStyle.charAt(0)+"this"+ThisStyle.substr(1);   
    ExecCommands();
    RefreshBoard();
  }
}

function SwitchAutoPlay()
{ if (isAutoPlay) SetAutoPlay(false);
  else SetAutoPlay(true);
}

function SetAutoPlay(bb)
{ isAutoPlay=bb;
  if (AutoPlayInterval) clearTimeout(AutoPlayInterval);
  if (isAutoPlay)
  { if ((document.BoardForm)&&(document.BoardForm.AutoPlay))
      document.BoardForm.AutoPlay.value="stop";
    MoveForward(1);
  }
  else
  { if ((document.BoardForm)&&(document.BoardForm.AutoPlay))
      document.BoardForm.AutoPlay.value="play";
  }
}

function SetDelay(vv)
{ Delay=vv;
}

function RotateBoard(bb)
{ SetBoardClicked(-1);
  var ii, cc=new Array();
  for (ii=0; ii<OldCommands.length; ii++) cc[ii]=OldCommands[ii];
  NewCommands.length=0;
  ExecCommands();
  isRotated=bb;
  if ((document.BoardForm)&&(document.BoardForm.Rotated))
    document.BoardForm.Rotated.checked=bb;
  RefreshBoard();
  for (ii=0; ii<cc.length; ii++) NewCommands[ii]=cc[ii];
  if (LastStyle) NewCommands[NewCommands.length]=LastStyle.charAt(0)+"last"+LastStyle.substr(1);
  if (ThisStyle) NewCommands[NewCommands.length]=ThisStyle.charAt(0)+"this"+ThisStyle.substr(1);
  ExecCommands();
}

function AllowRecording(bb)
{ if ((document.BoardForm)&&(document.BoardForm.Recording))
    document.BoardForm.Recording.checked=bb;
  isRecording=bb;
  SetBoardClicked(-1);
}

function AllowNullMove(bb)
{ isNullMove=bb;
}

function ShowCapturedPieces(bb)
{ isCapturedPieces=bb;
  if (isCapturedPieces) RefreshBoard();
  else
  { var kk, kk0=0;
    if (document.images["RightLabels"]) kk0++;
    for (kk=0; kk<32; kk++) SetImg(64+kk0+kk,LabelPic[4]);
    if ((parent)&&(parent.ChangeColWidth)) parent.ChangeColWidth(0);
  }
}

function Is3FoldRepetition()
{ if (MoveCount<8) return(false);
  var ss=GetFENList();
  ss=ss.split("\n");
  var ii, jj, kk=0, ll=ss.length-1;
  var tt=new Array(ll+1);
  for (ii=0; ii<=ll; ii++) tt[ii]=ss[ii].split(" ");    
  for (ii=ll-2; ii>=0; ii-=2)
  { if ((tt[ii][0]==tt[ll][0])&&(tt[ii][2]==tt[ll][2])) 
    { kk++;
      jj=ii;
    }
  }
  if (kk<2) return(false);
  if (kk>3) return(true);
  ii=tt[jj][3];
  if (ii=="-") return(true);
  ss=tt[jj][0].split("/");
  if (ii.indexOf("3")>0)
  { jj=ii.charCodeAt(0)-97;
    kk=0;
    for (ii=0; ii<ss[4].length; ii++)
    { if (ss[4].charAt(ii)=="p")
      { if (Math.abs(kk-jj)==1) return(false);
        kk++;
      }
      else
      { if (isNaN(ss[4].charAt(ii))) kk++;
        else kk+=parseInt(ss[4].charAt(ii));
      }
    }
  }
  if (ii.indexOf("6")>0)
  { jj=ii.charCodeAt(0)-97;
    kk=0;
    for (ii=0; ii<ss[3].length; ii++)
    { if (ss[3].charAt(ii)=="P")
      { if (Math.abs(kk-jj)==1) return(false);
        kk++;
      }
      else
      { if (isNaN(ss[3].charAt(ii))) kk++;
        else kk+=parseInt(ss[3].charAt(ii));
      }
    }
  }  
  return(true);
}

function IsInsufficientMaterial()
{ var ss=GetFEN(true);
  if (ss.indexOf("Q")>=0) return(false);
  if (ss.indexOf("q")>=0) return(false);
  if (ss.indexOf("R")>=0) return(false);
  if (ss.indexOf("r")>=0) return(false);
  if (ss.indexOf("P")>=0) return(false);
  if (ss.indexOf("p")>=0) return(false);  
  var ii_B=false, ii_b=false, ii_N=false, ii_n=false;
  if (ss.indexOf("B")>=0) ii_B=true;
  if (ss.indexOf("b")>=0) ii_b=true;
  if (ss.indexOf("N")>=0) ii_N=true;
  if (ss.indexOf("n")>=0) ii_n=true;
  if ((!ii_B)&&(!ii_b)&&(!ii_N)&&(!ii_n)) return(true);
  if ((ii_N)&&(ii_B)&&(!ii_n)&&(!ii_b)) return(false); 
  if ((ii_n)&&(ii_b)&&(!ii_N)&&(!ii_B)) return(false);   
  if (ii_N)
  { if ((ii_n)||(ii_b)) return(false);
    else return(true);
  }
  if (ii_n)
  { if ((ii_N)||(ii_B)) return(false);
    else return(true);
  }  
  var ii, jj, ww=0, bb=0;
  for (ii=0; ii<8; ii++)
  { for (jj=0; jj<8; jj++)
    { if (Math.abs(Board[ii][jj])==4)
      { if ((ii+jj)%2==0) ww++;
        else bb++;
      }
    }
  }
  if ((ww>0)&&(bb>0)) return(false);
  return(true);
}

function IsMate()
{ var aa, ii0, jj0, nn=0, ii=IsCheck(PiecePosX[MoveType][0], PiecePosY[MoveType][0], MoveType);
  for (ii0=0; (nn==0)&&(ii0<8); ii0++)
  { for (jj0=0; (nn==0)&&(jj0<8); jj0++)
    { if (sign(Board[ii0][jj0])==((MoveCount+1)%2)*2-1)
      { nn=(7-jj0)*8+ii0;
      	aa=HighlightCandidates(nn," ");
      	if (aa.length>0) nn=aa[0];
      	else nn=0;
      }
    }
  }
  if (nn==0)
  { if(ii) return("Checkmate.");
    else return("Stalemate.");
  }
  return(false);
}

function IsDraw()
{ ff=GetFEN().split(" ");
  if (parseInt(ff[4])>=100) return("Draw by 50 move rule.");
  if (Is3FoldRepetition()) return("Draw by 3-fold repetition.");
  if (IsInsufficientMaterial()) return("Draw by insufficient material.");
  return(false);
}

function SetPgnMoveText(ss, vvariant, rroot, sstart)
{ if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
    document.BoardForm.PgnMoveText.value=ss;
  if (vvariant)
  { ShortPgnMoveText[0][vvariant]=ss;
    ShortPgnMoveText[1][vvariant]=rroot;
    ShortPgnMoveText[2][vvariant]=sstart;
  }
  else ShortPgnMoveText[0][0]=ss;
}

function ApplySAN(ss)
{ if (ss.length<6)
  { PieceName = "KQRBNP";
    if ((document.BoardForm)&&(document.BoardForm.SAN))
      document.BoardForm.SAN.value=PieceName;
  }
  else
  { PieceName = ss;
    if ((document.BoardForm)&&(document.BoardForm.SAN))
      document.BoardForm.SAN.value=ss;
  }
  for (var ii=0; ii<6; ii++) PieceCode[ii]=PieceName.charCodeAt(ii);
}

function ShowSAN(ss)
{ ShowPieceName=ss;
  if (ss.length!=6) ShowPieceName="";
  if ((ShowPieceName=="")||(ShowPieceName==PieceName)||(ShowPieceName=="Figure")) return;
  if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
  { var tt=document.BoardForm.PgnMoveText.value;
    if (tt=="") return;
    var ww=window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes"); 
    ww.document.open();
    ww.document.writeln("<HTML><HEAD></HEAD><BODY>"+TransformSAN(tt)+"</BODY></HTML>");
    ww.document.close();
  }
}

function TransformSAN(ss)
{ if (ss=="") return("");
  if ((ShowPieceName=="")||(ShowPieceName==PieceName)||(ShowPieceName=="Figure")) return(ss);
  var jj, rr, tt="";
  for (jj=0; jj<ss.length; jj++)
  { rr=PieceName.indexOf(ss.charAt(jj));
    if (rr>=0) tt+=ShowPieceName.charAt(rr);
    else tt+=ss.charAt(jj);
  }
  return(tt);
}

function TransformFigureSAN(ss)
{ if (ss=="") return("");
  var jj, rr, tt="";
  for (jj=0; jj<ss.length; jj++)
  { rr=PieceName.indexOf(ss.charAt(jj));
    if (rr>=0) 
      tt+="<big>&#"+(9812+rr)+";</big>";
    else tt+=ss.charAt(jj);
  }
  return(tt);
}

function ApplyFEN(ss)
{ if (ss.length==0)
  { FenString = StandardFen;
    if ((document.BoardForm)&&(document.BoardForm.FEN))
      document.BoardForm.FEN.value=FenString;
  }
  else
  { FenString = ss;
    if ((document.BoardForm)&&(document.BoardForm.FEN))
      document.BoardForm.FEN.value=ss;
  }
}

function GetFEN(sshort)
{ var ii, jj, ee, ss="";
  for (jj=7; jj>=0; jj--)
  { ee=0;
    for (ii=0; ii<8; ii++)
    { if (Board[ii][jj]==0) ee++;
      else
      { if (ee>0)
        { ss=ss+""+ee;
          ee=0;
        }
        if (Board[ii][jj]>0) 
          ss=ss+PieceName.toUpperCase().charAt(Board[ii][jj]-1);
        else
          ss=ss+PieceName.toLowerCase().charAt(-Board[ii][jj]-1);
      }
    }
    if (ee>0) ss=ss+""+ee;
    if (jj>0) ss=ss+"/";
  }
  if (sshort) return(ss);
  if (MoveType==0) ss=ss+" w";
  else ss=ss+" b";
  ee="";
  if ((Castling[0][0]>0)&&(PieceMoves[0][0]==0))
  { for (ii=0; ii<16; ii++)
    { if ((PieceType[0][ii]==2)&&(PiecePosX[0][ii]==7)&&(PiecePosY[0][ii]==0)&&(PieceMoves[0][ii]==0))
      ee=ee+PieceName.toUpperCase().charAt(0);
    }
  }
  if ((Castling[0][1]>0)&&(PieceMoves[0][0]==0))
  { for (ii=0; ii<16; ii++)
    { if ((PieceType[0][ii]==2)&&(PiecePosX[0][ii]==0)&&(PiecePosY[0][ii]==0)&&(PieceMoves[0][ii]==0))
      ee=ee+PieceName.toUpperCase().charAt(1);
    }
  }
  if ((Castling[1][0]>0)&&(PieceMoves[1][0]==0))
  { for (ii=0; ii<16; ii++)
    { if ((PieceType[1][ii]==2)&&(PiecePosX[1][ii]==7)&&(PiecePosY[1][ii]==7)&&(PieceMoves[1][ii]==0))
      ee=ee+PieceName.toLowerCase().charAt(0);
    }
  }
  if ((Castling[1][1]>0)&&(PieceMoves[1][0]==0))
  { for (ii=0; ii<16; ii++)
    { if ((PieceType[1][ii]==2)&&(PiecePosX[1][ii]==0)&&(PiecePosY[1][ii]==7)&&(PieceMoves[1][ii]==0))
      ee=ee+PieceName.toLowerCase().charAt(1);
    }
  }
  if (ee=="") ss=ss+" -";
  else ss=ss+" "+ee;
  if (MoveCount>StartMove)
  { CanPass=-1;
    ii=HistPiece[0][MoveCount-StartMove-1];
    if ((HistType[0][MoveCount-StartMove-1]==5)&&(Math.abs(HistPosY[0][MoveCount-StartMove-1]-PiecePosY[1-MoveType][ii])==2))
      CanPass=PiecePosX[1-MoveType][ii];
  }
  else
    CanPass=EnPass;
  if (CanPass>=0)
  { ss=ss+" "+String.fromCharCode(97+CanPass);
    if (MoveType==0) ss=ss+"6";
    else ss=ss+"3";
  }
  else ss=ss+" -";
  ss=ss+" "+HalfMove[MoveCount-StartMove];
  ss=ss+" "+Math.floor((MoveCount+2)/2);
  if ((document.BoardForm)&&(document.BoardForm.FEN))
    document.BoardForm.FEN.value=ss;
  return(ss);
}

function GetFENList(sshort)
{ var mmove=MoveCount, vvariant=CurVar, nn=0;
  var ff, ff_new, ff_old;
  isCalculating=true;
  ff=GetFEN(sshort);
  ff_new=ff;
  do
  { ff_old=ff_new;
    MoveBack(1);
    ff_new=GetFEN(sshort);
    if (ff_old!=ff_new) { ff=ff_new+"\n"+ff; nn++ }
  }
  while (ff_old!=ff_new);
  isCalculating=false;
  if (vvariant==0)
  { if (nn>0) MoveForward(nn); }
  else SetMove(mmove, vvariant);
  return(ff);
}

function ShowFENList()
{ var ww=window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes"); 
  ww.document.open();
  ww.document.writeln("<HTML><HEAD></HEAD><BODY><PRE>"+GetFENList()+"</PRE></BODY></HTML>");
  ww.document.close();
}

function MakePuzzle()
{ var ii, nn=0, ff, ff_old="", mm="", tt="", pp="", oo, aa="";
  if (!document.BoardForm) return;
  isCalculating=true;
  if (document.BoardForm.FEN) ff_old=document.BoardForm.FEN.value;
  ff=GetFEN();
  if (document.BoardForm.PgnMoveText) mm=document.BoardForm.PgnMoveText.value;
  if (document.BoardForm.HeaderText) tt=document.BoardForm.HeaderText.value;
  if (document.BoardForm.EmailBlog) { if (document.BoardForm.EmailBlog.checked) pp=ScriptPath; }
  ii=Math.floor(MoveCount/2+1)+".";
  nn=mm.indexOf(ii);
  if (nn>=0)
  { mm=mm.substr(nn);
    if (MoveCount%2!=0) 
    { mm=mm.substr(ii.length);
      while ((mm!="")&&(mm.charAt(0)==" ")) mm=mm.substr(1);
      nn=mm.indexOf(" ");
      if (nn>0) mm=ii+" ..."+mm.substr(nn);
    }
  }
  if (document.BoardForm.FEN) document.BoardForm.FEN.value=ff_old;  
  isCalculating=false;
  var ww=window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes"); 
  ww.document.open();
  ww.document.writeln('<HTML><HEAD></HEAD><BODY>');
  ww.document.writeln(tt+"<BR><BR>");
  ww.document.writeln('[FEN "'+ff+'"]<BR><BR>'+mm+'<BR><BR>');
  ff_old=ff.split(" ");
  while (ff.indexOf("/")>0) ff=ff.replace("/","|");
  while (tt.indexOf("/")>0) tt=tt.replace("/","|");
  while (mm.indexOf("#")>0) mm=mm.replace("#","++");
  nn=pp+'problemboard.html?Init='+ff+'&ApplyPgnMoveText='+mm;
  oo=document.BoardForm.ImagePath;
  if (oo)
  { aa=oo.options[oo.options.selectedIndex].value;
    if (aa) aa="&SetImagePath="+aa;
    else aa="";
  }
  oo=document.BoardForm.BGColor;
  if (oo)
  { for (ii=0; ii<oo.length; ii++)
    { if (oo[ii].checked) aa="&SetBGColor="+oo[ii].value+aa;
    }
  }
  oo=document.BoardForm.Border;
  if (oo)
  { if (oo.options.selectedIndex>0) aa=aa+"&SetBorder=1";
  }  
  if (isDragDrop) aa+='&SetDragDrop=1';
  if (isRotated) aa+='&RotateBoard=1';
  if ((ShowPieceName!="")&&(ShowPieceName!=PieceName)) aa+='&ShowSAN='+ShowPieceName;
  if (tt!="") tt='&AddText='+tt;
  ww.document.writeln('<a href="'+nn+aa+tt+'"');
  while (tt.indexOf("<")>0) tt=tt.replace("<","&lt;");
  while (tt.indexOf(">")>0) tt=tt.replace(">","&gt;");
  ww.document.writeln('>'+nn+aa+tt+'</a>');
  if (MoveCount>2)
  { ff=ff_old[0]+" "+ff_old[1]+" "+ff_old[2]+" "+ff_old[3]+" 0 1";
    ii=Math.floor(MoveCount/2+1);
    nn=ii+1;
    while (mm.indexOf(nn+".")>=0) nn++;
    while (nn>ii)
    { nn--;
      while (mm.indexOf(nn+".")>=0) mm=mm.replace(nn+".",(nn-ii+1)+".");
    }
    ww.document.writeln('<BR><BR><HR><BR>');
    ww.document.writeln('[FEN "'+ff+'"]<BR><BR>'+mm+'<BR><BR>');
    while (ff.indexOf("/")>0) ff=ff.replace("/","|");
    nn=pp+'problemboard.html?Init='+ff+'&ApplyPgnMoveText='+mm;
    if (tt!="") tt='&AddText='+tt;
    ww.document.writeln('<a href="'+nn+aa+tt+'"');
    while (tt.indexOf("<")>0) tt=tt.replace("<","&lt;");
    while (tt.indexOf(">")>0) tt=tt.replace(">","&gt;");
    ww.document.writeln('>'+nn+aa+tt+'</a>');
  }
  ww.document.writeln('</BODY></HTML>');
  ww.document.close();
}

function MakeGamelink()
{ var nn=0, ff, mm="", tt="", pp="", oo, aa="";
  if (!document.BoardForm) return;
  if (document.BoardForm.FEN) ff=document.BoardForm.FEN.value;
  if (ff==StandardFen) ff="";
  if (document.BoardForm.PgnMoveText) mm=document.BoardForm.PgnMoveText.value;
  if (document.BoardForm.HeaderText) tt=document.BoardForm.HeaderText.value;
  if (document.BoardForm.EmailBlog) { if (document.BoardForm.EmailBlog.checked) pp=ScriptPath; }
  var ww=window.open("", "", "width=600, height=400, menubar=no, locationbar=no, resizable=yes, status=no, scrollbars=yes"); 
  ww.document.open();
  ww.document.writeln('<HTML><HEAD></HEAD><BODY>');
  ww.document.writeln(tt);
  ww.document.writeln(mm);
  ww.document.writeln('<BR><BR>');
  while (ff.indexOf("/")>0) ff=ff.replace("/","|");
  while (tt.indexOf("/")>0) tt=tt.replace("/","|");
  while (mm.indexOf("#")>0) mm=mm.replace("#","++");
  nn=pp+"ltpgnboard.html?Init="+ff+"&ApplyPgnMoveText="+mm;
  oo=document.BoardForm.ImagePath;
  if (oo)
  { aa=oo.options[oo.options.selectedIndex].value;
    if (aa) aa="&SetImagePath="+aa;
    else aa="";
  }
  if (ThisStyle) aa+='&SetThisStyle='+ThisStyle;
  oo=document.BoardForm.BGColor;
  if (oo)
  { for (ii=0; ii<oo.length; ii++)
    { if (oo[ii].checked) aa="&SetBGColor="+oo[ii].value+aa;
    }
  }
  oo=document.BoardForm.Border;
  if (oo)
  { if (oo.options.selectedIndex>0) aa=aa+"&SetBorder=1";
  }  
  if (isDragDrop) aa+='&SetDragDrop=1';
  if (isRotated) aa+='&RotateBoard=1';
  if ((ShowPieceName!="")&&(ShowPieceName!=PieceName)) aa+='&ShowSAN='+ShowPieceName;
  mm="&eval=AddText(unescape(%22"+escape("<|td><td>"+tt)+"%22)+GetHTMLMoveText(0,0,1))";
  ww.document.writeln('<a href="'+nn+aa+mm+'"');
  mm="&eval=AddText(%22<|td><td>"+tt+"%22+GetHTMLMoveText(0,0,1))";
  while (mm.indexOf("<")>0) mm=mm.replace("<","&lt;");
  while (mm.indexOf(">")>0) mm=mm.replace(">","&gt;");
  ww.document.writeln('>'+nn+aa+mm+'</a>');
  ww.document.writeln('</BODY></HTML>');
  ww.document.close();
}

function SetTitle(tt)
{ top.document.title=tt;
}

function AddText(tt)
{ document.writeln(tt);
}

function EvalUrlString(ss)
{ var ii, jj, aa, uurl = window.location.search;
  if (uurl != "")
  { uurl = uurl.substring(1, uurl.length);
    while (uurl.indexOf("|")>0) uurl=uurl.replace("|","/");
    while (uurl.indexOf("%7C")>0) uurl=uurl.replace("%7C","/");
    var llist = uurl.split("&");
    for (ii=0; ii<llist.length; ii++)
    { tt = llist[ii].split("=");
      aa=tt[1];
      for (jj=2; jj<tt.length; jj++) aa+="="+tt[jj];
      if (ss)
      { if (ss==tt[0]) eval(tt[0]+"('"+unescape(aa)+"')");
      }
      else 
      { if(eval("window."+tt[0])) eval(tt[0]+"('"+unescape(aa)+"')");
      }
    }
  }
}

function OpenGame(nn)
{ if (parent.frames[1])
  { if ((parent.frames[1].OpenGame)&&
        (parent.frames[1].document.forms[0])&&
        (parent.frames[1].document.forms[0].GameList))
    { parent.frames[1].OpenGame(nn);
      return;
    }
  }
  setTimeout('OpenGame('+nn+')',400);    
}

function SetMove(mmove, vvariant)
{ if (isNaN(mmove)) return;
  var ii=isCalculating;
  isCalculating=true;
  if (RecordCount>0) MoveBack(MaxMove);
  if (vvariant)
  { if (vvariant>=ShortPgnMoveText[0].length) { isCalculating=ii; return; }
    if (CurVar!=vvariant) 
    { SetMove(ShortPgnMoveText[2][vvariant], ShortPgnMoveText[1][vvariant]);
      CurVar=vvariant;
    }  
  }
  else
  { while (CurVar!=0)
    { if (MoveCount==ShortPgnMoveText[2][CurVar])
      { CurVar=ShortPgnMoveText[1][CurVar];
        if ((!isCalculating)&&(document.BoardForm)&&(document.BoardForm.PgnMoveText))
          document.BoardForm.PgnMoveText.value=ShortPgnMoveText[0][CurVar];
      }  
      else MoveBack(1);
    }
  }  
  isCalculating=ii;
  var dd=mmove-MoveCount;
  if (dd<=0) MoveBack(-dd);
  else MoveForward(dd, 1);
  if (isCalculating) return;
  if ((document.BoardForm)&&(document.BoardForm.PgnMoveText))
    document.BoardForm.PgnMoveText.value=ShortPgnMoveText[0][CurVar];
  if (AutoPlayInterval) clearTimeout(AutoPlayInterval);
  if (isAutoPlay) AutoPlayInterval=setTimeout("MoveForward(1)", Delay);
}

function ApplyPgnMoveText(ss, rroot, ddocument, ggame)
{ var vv=0;
  if (! isNaN(rroot)) 
  { vv=ShortPgnMoveText[0].length; 
    ShortPgnMoveText[0][vv]=""; 
  }
  else 
  { ShortPgnMoveText[0].length=1;
    if (ddocument) TargetDocument=ddocument;
    else TargetDocument=window.document;
    if (rroot) activeAnchorBG=rroot;
    if (ggame) startAnchor=ggame;
    else startAnchor=-1;
  }  
  var ii, uu="", uuu="", cc, bb=0, bbb=0, ll=ss.length;
  for (ii=0; ii<ll; ii++)  
  { cc=ss.substr(ii,1);
    if (cc=="{") bbb++;
    if (cc=="}") bbb--; 
    if (((cc==")")||(cc=="]"))&&(bbb==0)) 
    { bb--;
      if (bb==0)
      { if (bbb==0) uu+=ApplyPgnMoveText(uuu, vv);
        else uu+=uuu;
        uuu="";
      }  
    }  
    if (bb==0) uu+=cc;
    else uuu+=cc;
    if (((cc=="(")||(cc=="["))&&(bbb==0)) bb++; 
  }
  if (! isNaN(rroot))
  { ii=0, jj=0, bb=0;
    var uuc=Uncomment(uu);
    while ((ii<uuc.length-1)&&(((ii>0)&&(uuc.charAt(ii-1)!=" "))||(isNaN(parseInt(uuc.charAt(ii)))))) ii++;
    while ((ii<uuc.length-1)&&(! isNaN(parseInt(uuc.charAt(ii))))) { bb=10*bb+parseInt(uuc.charAt(ii)); ii++; }
    if (ii<uuc.length-1)
    { uuu=uuc.substr(ii, 3);
      switch (uuu)
      { case "...": jj=1; break;
        case " ..": jj=1; break;
      }
      if (jj==0)  
      { uuu=uuc.substr(ii, 4);
        switch (uuu)
        { case "....": jj=1; break;
          case ". ..": jj=1; break;
          case " ...": jj=1; break;
        }
      }
      if (jj==0)  
      { uuu=uuc.substr(ii, 5);
        if (uuu==". ...") jj=1;
      }
    }  
    bb=2*(bb-1)+jj;
    //if (bb<0) bb=MoveCount;
    SetPgnMoveText(uu, vv, rroot, bb);
  }
  else SetPgnMoveText(uu);
  return(vv);
}

function GetHTMLMoveText(vvariant, nnoscript, ccommenttype, sscoresheet)
{ var vv=0, tt, ii, uu="", uuu="", cc, bb=0, bbb=0;
  var ss="", sstart=0, nn=MaxMove, ffst=0,llst,ssearch,ssub,ffull,mmove0="",mmove1="", gg="";
  if (sscoresheet) Annotation.length=0;
  if (startAnchor!=-1) gg=",'"+startAnchor+"'";
  isCalculating=true;
  if (vvariant) 
  { vv=vvariant;
    if (! isNaN(ShortPgnMoveText[0][vv]))
    { SetMove(ShortPgnMoveText[0][vv], ShortPgnMoveText[1][vv]);
      if (MoveCount!=ShortPgnMoveText[0][vv]) return("("+ShortPgnMoveText[0][vv]+")");
      //CurVar=ShortPgnMoveText[1][vv];
      if (ShortPgnMoveText[0][vv].indexOf(".0")>0) return(GetDiagram(1));
      return(GetDiagram());
    }  
    if (ShortPgnMoveText[2][vv]<0) return(ShortPgnMoveText[0][vv]);
    SetMove(ShortPgnMoveText[2][vv], ShortPgnMoveText[1][vv]);
    if (MoveCount!=ShortPgnMoveText[2][vv]) return(ShortPgnMoveText[0][vv]);
    CurVar=vvariant;
  }  
  else MoveBack(MaxMove);
  tt=ShortPgnMoveText[0][vv];
  
  ffull=Uncomment(ShortPgnMoveText[0][CurVar]);
  for (ii=0; (ii<nn)&&(ffst>=0)&&(MoveCount<MaxMove); ii++)
  { ssearch=Math.floor(MoveCount/2+2)+".";
    llst=ffull.indexOf(ssearch);
    ssearch=Math.floor(MoveCount/2+1)+".";
    ffst=ffull.indexOf(ssearch);
    mmove1=""
    if (ffst>=0)
    { ffst+=ssearch.length;
      if (llst<0)
        ssub=ffull.substring(ffst);
      else
        ssub=ffull.substring(ffst, llst);
      mmove0=GetMove(ssub,MoveType);
      if (mmove0!="")
      { if (ParseMove(mmove0, true)>0)
        { mmove1=mmove0;
          if (MoveType==0)
            HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+"."+mmove1;
          else
            HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mmove1;
          HistCommand[MoveCount-StartMove+1]=NewCommands.join("|");
          MoveCount++;
          MoveType=1-MoveType;
        }  
        else
        { if (MoveType==1)
          { ssub=Math.floor(MoveCount/2+1);
            ssearch=ssub+"....";
            ffst=ffull.indexOf(ssearch);
            if (ffst<0) { ssearch=ssub+". ..."; ffst=ffull.indexOf(ssearch); }
            if (ffst<0) { ssearch=ssub+". .."; ffst=ffull.indexOf(ssearch); }
            if (ffst<0) { ssearch=ssub+" ..."; ffst=ffull.indexOf(ssearch); }
            if (ffst<0) { ssearch=ssub+"..."; ffst=ffull.indexOf(ssearch); }
            if (ffst<0)
            { ssearch=ssub+" ..";
              ffst=ffull.indexOf(ssearch);
            }
            if (ffst>=0) 
            { ffst+=ssearch.length;
              if (llst<0) ssub=ffull.substring(ffst);
              else ssub=ffull.substring(ffst, llst);
              mmove0=GetMove(ssub,0);
              if (mmove0!="")
              { if (ParseMove(mmove0, true)>0)
                { mmove1=mmove0;
                  HistMove[MoveCount-StartMove]=Math.floor((MoveCount+2)/2)+". ... "+mmove1;
                  HistCommand[MoveCount-StartMove+1]=NewCommands.join("|");
                  MoveCount++;
                  MoveType=1-MoveType;
                }  
                else
                { ffst=-1;
                  //alert(mmove0+" is not a valid move.");
                }
              }
            }
          }
          else
          { ffst=-1;
            //alert(mmove0+" is not a valid move.");
          }
        }
      }
      else ffst=-1;
    }
    if (mmove1!="")
    { sstart=-1;
      do sstart=tt.indexOf(mmove1, sstart+1);
      while ((sstart>0)&&(IsInComment(tt, sstart)));
      if (sstart>=0)
      { if (sscoresheet)
        { Annotation[MoveCount-1]=GetComment(tt.substr(0,sstart));
          if (ss=="")
          { if (sscoresheet==2) ss+="<table width='100%' cellpadding=0 cellspacing=0><tr><td width='50%'>";
            if (MoveCount%2==1) ss+="<table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup><tr><th>"+eval((MoveCount+1)/2)+".</th>";
            else ss+="<table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup><tr><th>"+eval(MoveCount/2)+".</th><th>&nbsp;</th>";
          }
          else
          { if (MoveCount%2==1) ss+="<tr><th>"+eval((MoveCount+1)/2)+".</th>";
          }
          ss+="<th>";
        }
        else ss+=tt.substr(0,sstart);
        if (! nnoscript) ss+="<a href=\"javascript:SetMove{{"+MoveCount+","+vv+gg+"}}\" name=\"m"+MoveCount+"v"+vv+"\">";
        if (vv==0) ss+="<b>";
        if (ShowPieceName=="Figure") ss+=TransformFigureSAN(mmove1);
        else ss+=TransformSAN(mmove1);
        if (vv==0) ss+="</b>";
        if (! nnoscript) ss+="</a>";
        tt=tt.substr(sstart+mmove1.length);
        if (sscoresheet)
        { ss+="</th>";
          if (MoveCount%2==0) ss+="</tr>";
          if (sscoresheet==2)
          { if (MoveCount%80==0) ss+="</table></td></tr></table><table width='100%' cellpadding=0 cellspacing=0><tr><td width='50%'><table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup>";
            else
            { if (MoveCount%40==0) ss+="</table></td><td width='50%'><table width='100%' cellpadding=0 cellspacing=0><colgroup><col width='20%'><col width='40%'><col width='40%'></colgroup>";
            }
          }
        }
      }
      else ffst=-1;
    }
  }
  if (sscoresheet)
  { Annotation[MoveCount]=GetComment(tt);
    if (MoveCount%2==1) ss+="<th>&nbsp;</th>";
    ss+="</tr></table>";
    if (sscoresheet==2)
    { if (MoveCount%80<40) ss+="</td><td width='50%'>&nbsp;";
      ss+="</td></tr></table>";
    }
  }  
  else ss+=tt;

  var ll=ss.length;
  for (ii=0; ii<ll; ii++)  
  { cc=ss.substr(ii,1);
    if (cc=="{") bbb++;
    if (cc=="}") bbb--; 
    if (((cc==")")||(cc=="]"))&&(bbb==0)) 
    { bb--;
      if (bb==0)
      { if (bbb==0)
        { if (! isNaN(ShortPgnMoveText[0][uuu]))
          { cc=uu.length-1;
            uu=uu.substr(0,cc);
            cc="";
          }
          if (sscoresheet) uu+=GetHTMLMoveText(uuu, true);
          else uu+=GetHTMLMoveText(uuu, nnoscript);
          isCalculating=true;
        }
        else uu+=uuu;
        uuu="";
      }  
    }  
    if (bb==0)
    { if ((bbb==0)&&(Indent))
      { if (cc=="(") uu+="<div style='margin-left:"+Indent+"'>"+cc;
        else 
        { if (cc==")") uu+=cc+"</div>";
          else uu+=cc;
        }
      }
      else uu+=cc;
    }
    else uuu+=cc;
    if (((cc=="(")||(cc=="["))&&(bbb==0)) bb++; 
  }  
   
  if (! vvariant) 
  { SetMove(0,0);
    tt=uu.split("{{");
    ll=tt.length;
    uu=tt[0];
    for (ii=1; ii<ll; ii++) uu+="("+tt[ii];
    tt=uu.split("}}");
    ll=tt.length;
    uu=tt[0];
    for (ii=1; ii<ll; ii++) uu+=")"+tt[ii];
    if ((ccommenttype==1)||(ccommenttype==true))
    { tt=uu.split("{");
      ll=tt.length;
      uu=tt[0];
      for (ii=1; ii<ll; ii++) uu+="<i>"+tt[ii];
      tt=uu.split("}");
      ll=tt.length;
      uu=tt[0];
      for (ii=1; ii<ll; ii++) uu+="</i>"+tt[ii];
    }
    if (ccommenttype>=1)
    { tt=uu.split("{");
      ll=tt.length;
      uu=tt[0];
      for (ii=1; ii<ll; ii++) uu+="<a href=\"javascript:SetMove()\"><span title=\""+tt[ii];
      tt=uu.split("}");
      ll=tt.length;
      uu=tt[0];
      for (ii=1; ii<ll; ii++) uu+="\" onMouseDown=\"if (this.innerHTML==\'{\'+this.title+\'}\') this.innerHTML=\'<I>{...}</I>\'; else this.innerHTML=\'{\'+this.title+\'}\';\"><I>{...}</I></span></a>"+tt[ii];
    }
  }
  isCalculating=false;
  return(uu);
}

function IsInComment(ss, nn)
{ var ii=-1, bb=0;
  do { ii=ss.indexOf("{",ii+1); bb++; }  
  while ((ii>=0)&&(ii<nn));
  ii=-1;
  do { ii=ss.indexOf("}",ii+1); bb--; }  
  while ((ii>=0)&&(ii<nn));  
  return(bb);
}

function HighlightMove(nn)
{ var ii, cc, bb, jj=0, ll=TargetDocument.anchors.length;
  if (ll==0) return;
  if (! TargetDocument.anchors[0].style) return;
  if ((activeAnchor>=0)&&(ll>activeAnchor))
  { TargetDocument.anchors[activeAnchor].style.backgroundColor="";
    activeAnchor=-1;
  }
  if (isNaN(startAnchor))
  { while ((jj<ll)&&(TargetDocument.anchors[jj].name!=startAnchor)) jj++;
  }
  for (ii=jj; ((ii<ll)&&(activeAnchor<0)); ii++)
  { if (TargetDocument.anchors[ii].name==nn)
    { activeAnchor=ii;
      TargetDocument.anchors[activeAnchor].style.backgroundColor=activeAnchorBG;
      if ((document!=TargetDocument)&&(parent.document!=TargetDocument)&&(TargetDocument.anchors[offsetAnchor+activeAnchor].scrollIntoView)) 
      { if (parent.document==parent.parent.document)
          TargetDocument.anchors[offsetAnchor+activeAnchor].scrollIntoView(false);
      }
      return;
    }
  }
}

function SetAnnotation(ff)
{ AnnotationFile=ff;
}

function UpdateAnnotation(bb)
{ if (Annotation.length==0) return;
  if (! parent.frames["annotation"]) return;
  if(bb)
  { with (parent.frames["annotation"].document)
    { open();
      writeln("<html><head></head><body><form>"); 
      writeln("<input type='hidden' name='MoveCount' value='"+MoveCount+"'>");
      write("<textarea rows=8 style='width:100%' name='Annotation'>");
      if (Annotation[MoveCount]) write(Annotation[MoveCount]);
      writeln("</textarea>");
      if (AnnotationFile) writeln("<input type='button' value='Save Annotation' onclick='parent.frames[\"board\"].SaveAnnotation(this.form)'>");
      writeln("</form></body></html>");
      close();
    }  
  }
  else
  { parent.frames["annotation"].document.forms[0].MoveCount.value=MoveCount;
    if (Annotation[MoveCount])
      parent.frames["annotation"].document.forms[0].Annotation.value=Annotation[MoveCount];
    else
      parent.frames["annotation"].document.forms[0].Annotation.value="";
  }  
}

function SaveAnnotation(ff)
{ var mm=parseInt(ff.MoveCount.value);
  Annotation[mm]=ff.Annotation.value;
  if ((AnnotationFile)&&(parent.frames['annotation']))
    parent.frames['annotation'].location.replace(AnnotationFile+"?MoveCount="+mm+"&Annotation="+escape(Annotation[mm]));
}

function GetDiagram(pp, ssp)
{ var ii, jj, cc, tt, nn, mm, ss=String.fromCharCode(13)+"<P align=center>", oo, aa=new Array(64);
  var bb=Border;
  var iip=ImagePath;
  if (document.BoardForm)
  { if (oo=document.BoardForm.ImagePath)
    { iip=oo.options[oo.options.selectedIndex].value;
      if (iip!="") { iip=iip.replace("|","/"); bb=0; }
    }
    if (oo=document.BoardForm.Border) bb=oo.options.selectedIndex;
  }
  for (ii=0; ii<64; ii++) aa[ii]="";
  if (isCalculating) oo=NewCommands;
  else oo=OldCommands;
  if (oo.length>0)
  { for (ii=0; ii<oo.length; ii++)
    { tt=oo[ii].charAt(0);
      if ((tt=="B")||(tt=="C"))
      { nn=oo[ii].charCodeAt(1)-97+(8-parseInt(oo[ii].charAt(2)))*8;
        if ((nn>=0)&&(nn<=63))
        { if (isRotated) nn=63-nn;
          cc=oo[ii].substr(3,6);
          if (cc=="R") cc="FF0000"; 
          if (cc=="G") cc="00FF00";
          if (cc=="B") cc="0000FF";
          if (tt=="B") aa[nn]+="border-color:"+cc+";";
          else aa[nn]+="background-color:"+HEX2RGBA(cc)+";";   
        }
      }
    }
  } 
  ss+="<table border=0 cellpadding=1 cellspacing=0>";
  if (ssp) ss+="<tr><th>"+ssp+"</th></tr>";
  ss+="<tr><th bgcolor=#808080 style='vertical-align:top'>";
  ss+="<TABLE border="+(bb+2)+" cellpadding=0 cellspacing=0><TR><TD>";
  ss+="<div><TABLE border=0 cellpadding=0 cellspacing=0>";
  var tt=new Array("k","q","r","b","n","p");
  if (isRotated)
  { for (jj=0; jj<8; jj++)
    { ss+="<TR>";
      for (ii=7; ii>=0; ii--)
      { if ((Board[ii][jj]==0)||((pp)&&((Board[ii][jj]+6)%6!=0)))
          ss+="<TD background='"+iip+ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+"t.gif'";
        else
          ss+="<TD background='"+iip+ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+ColorName[(1-sign(Board[ii][jj]))/2]+tt[Math.abs(Board[ii][jj])-1]+PieceFileExt+"'";
        if (document.layers) ss+=" border="+bb+"></TD>";
        else ss+=" style='border-width:"+bb+"px; border-style:solid; border-color:"+BorderColor+";"+aa[jj*8+(7-ii)]+"'></TD>";
      }
      ss+="</TR>";
    }
  }
  else
  { for (jj=7; jj>=0; jj--)
    { ss+="<TR>";
      for (ii=0; ii<8; ii++)
      { if ((Board[ii][jj]==0)||((pp)&&((Board[ii][jj]+6)%6!=0)))
          ss+="<TD background='"+iip+ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+"t.gif'";
        else
          ss+="<TD background='"+iip+ColorName[(ii+jj+1)%2]+".gif'><IMG SRC='"+iip+ColorName[(1-sign(Board[ii][jj]))/2]+tt[Math.abs(Board[ii][jj])-1]+PieceFileExt+"'";
        if (document.layers) ss+=" border="+bb+"></TD>";
        else ss+=" style='border-width:"+bb+"px; border-style:solid; border-color:"+BorderColor+";"+aa[(7-jj)*8+ii]+"'></TD>";
      }
      ss+="</TR>";
    }
  }
  ss+="</TABLE></div>";
  if (!document.layers) 
  { var xx0, xx1, bb0, bb1, kk, dd=parseInt(document.getElementById("Board").offsetHeight);
    if (iip!=0)
    { dd=0;
      for (ii=0; ii<iip.length; ii++)
      { if (!isNaN(iip.charAt(ii))) { dd*=10; dd+=parseInt(iip.charAt(ii)); }
      }
      if (dd>0) dd+=2*bb;
      dd*=8;
    }
    var dd32=Math.round(dd/32);
    if (oo.length>0)
    { ss+="<div style='position:relative;top:-"+dd+"px'>";  
      for (ii=0; ii<oo.length; ii++)
      { tt=oo[ii].charAt(0);
        if ((tt=="B")&&(dd>0))
        { kk=oo[ii].charCodeAt(1)-97;
          jj=parseInt(oo[ii].charAt(2));
          nn=kk+(8-jj)*8;
          if ((nn>=0)&&(nn<=63)) bb0=Board[kk][jj-1];
          if ((nn>=0)&&(nn<=63))
          { if (isRotated) nn=63-nn;         
            xx0=nn%8; yy0=(nn-xx0)/8;
            cc=oo[ii].substr(3,6);
            if (cc=="R") cc="FF0000";
            if (cc=="G") cc="00FF00";
            if (cc=="B") cc="0000FF";
            if (cc.length<6) cc="#FFFFFF";
            else cc="#"+cc;
            ss+=GetBorder(xx0,yy0,HEX2RGBA(cc),dd);
          }
        }        
        if ((tt=="A")&&(dd>0))
        { kk=oo[ii].charCodeAt(1)-97;
          jj=parseInt(oo[ii].charAt(2));
          nn=kk+(8-jj)*8;
          if ((nn>=0)&&(nn<=63)) bb0=Board[kk][jj-1];
          kk=oo[ii].charCodeAt(3)-97;
          jj=parseInt(oo[ii].charAt(4));
          mm=kk+(8-jj)*8;
          if ((mm>=0)&&(mm<=63)) bb1=Board[kk][jj-1];
          if ((nn>=0)&&(nn<=63)&&(mm>=0)&&(mm<=63)&&(nn!=mm))
          { if (isRotated) { nn=63-nn; mm=63-mm; }
            xx0=nn%8; yy0=(nn-xx0)/8;
            xx1=mm%8; yy1=(mm-xx1)/8;
            nn=0; mm=0;        
            if (xx0<xx1) nn=1;
            if (xx0>xx1) nn=-1;
            if (yy0<yy1) mm=1;
            if (yy0>yy1) mm=-1;
            xx0=Math.round((2*xx0+1)*dd/16);
            yy0=Math.round((2*yy0+1)*dd/16);
            if (bb0!=0)
            { xx0+=nn*dd32;
              yy0+=mm*dd32;
            }
            xx1=Math.round((2*xx1+1)*dd/16);
            yy1=Math.round((2*yy1+1)*dd/16);
            if (bb1!=0)
            { xx1-=nn*dd32;
              yy1-=mm*dd32;
            }
            cc=oo[ii].substr(5,6);
            if (cc=="R") cc="FF0000";
            if (cc=="G") cc="00FF00";
            if (cc=="B") cc="0000FF";
            if (cc.length<6) cc="#FFFFFF";
            else cc="#"+cc;
            ss+=GetArrow(xx0,yy0,xx1,yy1,HEX2RGBA(cc),dd);
          }
        }
      }
      ss+="</div>";  
    }
  }
  ss+="</TD></TR></TABLE>";
  if (IsLabelVisible)
  { if (isRotated)
    { ss+="</th><th><img src='"+iip+"1_8.gif'></th>";
      if (isCapturedPieces) ss+="<th>"+GetCapturedPieces(iip,bb)+"</th>";
      ss+="</tr><tr><th><img src='"+iip+"h_a.gif'></th><th><img src='"+iip+"1x1.gif'>";
      if (isCapturedPieces) ss+="</th><th>";
    }
    else
    { ss+="</th><th><img src='"+iip+"8_1.gif'></th>";
      if (isCapturedPieces) ss+="<th>"+GetCapturedPieces(iip,bb)+"</th>";
      ss+="</tr><tr><th><img src='"+iip+"a_h.gif'></th><th><img src='"+iip+"1x1.gif'>";
      if (isCapturedPieces) ss+="</th><th>";
    }  
  }
  else
  { if (isCapturedPieces) ss+="</th><th>"+GetCapturedPieces(iip,bb);
  }
  ss+="</th></tr></table></P>"+String.fromCharCode(13);
  return (ss);
}

function GetCapturedPieces(iip,bb)
{ var ii, jj, kk, ll, ss, rr=new Array(8);
  for (ii=0; ii<8; ii++) rr[ii]="";
  var tt=new Array("k","q","r","b","n","p");
  var pp0=new Array(0,1,1,2,2,2,8);
  kk=0;
  ii=0;
  if (isRotated) ii=1;
  for (jj=0; jj<16; jj++) pp0[PieceType[ii][jj]+1]--;
  for (jj=1; jj<5; jj++)
  { for (ll=0; ll<pp0[jj+1]; ll++)
    { rr[kk%4]+="<td><IMG SRC='"+iip+ColorName[ii]+tt[jj]+PieceFileExt+"'></td>";
      kk++;
      pp0[0]++;
    }
  }
  for (ll=0; ll>pp0[0]; ll--)
  { rr[kk%4]+="<td><IMG SRC='"+iip+ColorName[ii]+tt[5]+PieceFileExt+"'></td>";
    kk++;
  }
  while (kk<4) { rr[kk%4]+="<td><IMG SRC='"+iip+"t.gif'></td>"; kk++; }
  while (kk<16){ rr[kk%4]+="<td><IMG SRC='"+iip+"1x1.gif'></td>"; kk++; }
  var pp1=new Array(0,1,1,2,2,2,8);
  kk=0;
  ii=1-ii;
  for (jj=0; jj<16; jj++) pp1[PieceType[ii][jj]+1]--;
  for (jj=1; jj<5; jj++)
  { for (ll=0; ll<pp1[jj+1]; ll++)
    { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+ColorName[ii]+tt[jj]+PieceFileExt+"'></td>";
      kk++;
      pp1[0]++;
    }
  }
  for (ll=0; ll>pp1[0]; ll--)
  { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+ColorName[ii]+tt[5]+PieceFileExt+"'></td>";
    kk++;
  }
  while (kk<4) { rr[7-(kk%4)]+="<td><IMG SRC='"+iip+"t.gif'></td>"; kk++; }
  while (kk<16){ rr[7-(kk%4)]+="<td><IMG SRC='"+iip+"1x1.gif'></td>"; kk++; } 
  ss="<table border=0 cellpadding="+bb+" cellspacing=0>";
  for (ii=0; ii<8; ii++) ss+="<tr>"+rr[ii]+"</tr>";
  ss+="</table>";
  return(ss);
}

function GetBorder(theX0, theY0, theColor, theBoardSize)
{ //var bborder=2;
  var ssize=Math.floor(theBoardSize/8), bborder=1+Math.floor(theBoardSize/128);
  dd="<div style='visibility:hidden;position:absolute;left:"+eval(theX0*ssize)+"px;top:"+eval(theY0*ssize)+"px;width:"+ssize+"px;height:"+ssize+"px;z-index:99'>"
  dd+="<div style='visibility:visible;position:absolute;left:0px;top:0px;width:"+eval(ssize-bborder)+"px;height:"+bborder+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
  dd+="<div style='visibility:visible;position:absolute;left:"+bborder+"px;top:"+eval(ssize-bborder)+"px;width:"+eval(ssize-bborder)+"px;height:"+bborder+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
  dd+="<div style='visibility:visible;position:absolute;left:0px;top:"+bborder+"px;width:"+bborder+"px;height:"+eval(ssize-bborder)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
  dd+="<div style='visibility:visible;position:absolute;left:"+eval(ssize-bborder)+"px;top:0px;width:"+bborder+"px;height:"+eval(ssize-bborder)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
  dd+="</div>";
  return(dd);
}

var isOldIE=(navigator.userAgent.toLowerCase().indexOf('msie') != -1) ? (parseInt(navigator.userAgent.toLowerCase().split('msie')[1])<10) : false;

function GetArrow(theX0, theY0, theX1, theY1, theColor, theBoardSize)
{ var ssize=1+Math.floor(theBoardSize/80), ssize2=Math.floor(ssize/2);
  //var ccL=9*ssize2, ccB=3*ssize2;
  var ccL=Math.floor(theBoardSize/17), ccB=Math.floor(theBoardSize/51);   
  var xx0=theX0, yy0=theY0, xx1=theX1, yy1=theY1;
  if ((xx0==xx1)&&(yy0==yy1)) yy0+=ccL;
  if ((theX1==0)&&(theY1==0)) { xx1=xx0; yy0+=ccB; yy1=yy0-ccL; }
  if (isOldIE) return(GetOldArrow(xx0, yy0, xx1, yy1, theColor, theBoardSize));
  if ((xx0==xx1)&&(yy0-ccL==yy1)) { ccL=2*ccB; yy1=yy0-ccL; }
  ccB=Math.round(ssize*5/3);
  var ddx=xx1-xx0, ddy=yy1-yy0;
  var nn=ddx*ddx+ddy*ddy;
  if (nn==0) return(0);
  nn=Math.sqrt(nn);
  var aa=Math.acos(-ddy/nn)*180/Math.PI;
  if (ddx<0) aa=360-aa;
  var ss="<div style='visibility:hidden;position:absolute;left:"+Math.round((xx0+xx1-nn)/2)+"px; top:"+Math.round((yy0+yy1-nn)/2)+"px; width:"+Math.round(nn)+"px; height:"+Math.round(nn)+"px; -ms-transform: rotate("+aa+"deg); -webkit-transform: rotate("+aa+"deg); -moz-transform: rotate("+aa+"deg); transform: rotate("+aa+"deg); transform-origin: 50% 50%; z-index:100'>";
  ss+="<div style='visibility:visible;position:absolute;left:"+Math.floor(nn/2-ccB)+"px;top:0px,width:0px;height:0px;border-style: solid; border-width: 0px "+ccB+"px "+ccL+"px "+ccB+"px;border-color: transparent transparent "+theColor+" transparent;'></div>";
  ss+="<div style='visibility:visible;position:absolute;left:"+Math.floor(nn/2-ssize2)+"px;top:"+(ccL)+"px;width:0px;height:0px;border-style: solid; border-width: "+Math.ceil(nn-ccL)+"px 0px 0px "+ssize+"px;border-color: "+theColor+" transparent transparent "+theColor+";'></div>";
  ss+="</div>";
  return(ss);
}

function GetOldArrow(theX0, theY0, theX1, theY1, theColor, theBoardSize)
{ var ll, rr, tt, bb, ww, hh, ccl, ccr, cct, ccb, dd, tmpX0, tmpY0;
  //var ssize=2;
  var ssize=1+Math.floor(theBoardSize/128), ssize2=Math.floor(ssize/2), bborder=8*ssize;
  var ddir=(((theY1>theY0)&&(theX1>theX0))||((theY1<theY0)&&(theX1<theX0))) ? true : false;
  if (theX0<=theX1) { ll=theX0; rr=theX1; }
  else { ll=theX1; rr=theX0; }
  if (theY0<=theY1) { tt=theY0; bb=theY1; }
  else { tt=theY1; bb=theY0; }
  ww=rr-ll; hh=bb-tt;
  dd="<div style='visibility:hidden;position:absolute;left:"+eval(ll-ssize2-bborder)+"px;top:"+eval(tt-ssize2-bborder)+"px;width:"+eval(ww+ssize+2*bborder)+"px;height:"+eval(hh+ssize+2*bborder)+"px;z-index:100'>"
  if ((ww==0)||(hh==0)) dd+="<div style='visibility:visible;position:absolute;left:"+bborder+"px;top:"+bborder+"px;width:"+eval(ww+ssize)+"px;height:"+eval(hh+ssize)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
  else
  { if (ww>hh)
    { ccr=0; cct=0;
      while (ccr<ww)
      { ccl=ccr;
        while ((2*ccr*hh<=(2*cct+1)*ww)&&(ccr<=ww)) ccr++;
        if (ddir) dd+="<div style='visibility:visible;position:absolute;left:"+eval(ccl+bborder)+"px;top:"+eval(cct+bborder)+"px;width:"+eval(ccr-ccl+ssize)+"px;height:"+ssize+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        else dd+="<div style='visibility:visible;position:absolute;left:"+eval(ww-ccr+bborder)+"px;top:"+eval(cct+bborder)+"px;width:"+eval(ccr-ccl+ssize)+"px;height:"+ssize+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        cct++;
      }
    }
    else
    { ccb=0; ccl=0;
      while (ccb<hh)
      { cct=ccb;
        while ((2*ccb*ww<=(2*ccl+1)*hh)&&(ccb<hh)) ccb++;
        if (ddir) dd+="<div style='visibility:visible;position:absolute;left:"+eval(ccl+bborder)+"px;top:"+eval(cct+bborder)+"px;width:"+ssize+"px;height:"+eval(ccb-cct+ssize)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        else dd+="<div style='visibility:visible;position:absolute;left:"+eval(ww-ccl+bborder)+"px;top:"+eval(cct+bborder)+"px;width:"+ssize+"px;height:"+eval(ccb-cct+ssize)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        ccl++;
      }
    }
  }
  var LL=1, ll0=ll, tt0=tt;
  //var ccL=12, ccB=4;
  //var ccL=Math.round(theBoardSize/24), ccB=Math.round(theBoardSize/72);
  var ccL=Math.round(theBoardSize/28), ccB=Math.round(theBoardSize/67);  
  var DDX=theX1-theX0, DDY=theY1-theY0;
  if ((DDX!=0)||(DDY!=0)) LL=Math.sqrt(0+(DDX*DDX)+(DDY*DDY));
  tmpX0=theX1-Math.round(1/LL*(ccL*DDX-ccB*DDY));
  tmpY0=theY1-Math.round(1/LL*(ccL*DDY+ccB*DDX));
  ddir=(((theY1>tmpY0)&&(theX1>tmpX0))||((theY1<tmpY0)&&(theX1<tmpX0))) ? true : false;
  if (tmpX0<=theX1) { ll=tmpX0; rr=theX1; }
  else { ll=theX1; rr=tmpX0; }
  if (tmpY0<=theY1) { tt=tmpY0; bb=theY1; }
  else { tt=theY1; bb=tmpY0; }
  ww=rr-ll; hh=bb-tt;
  if ((ww==0)||(hh==0)) dd+="<div style='visibility:visible;position:absolute;left:"+eval(bborder+ll-ll0)+"px;top:"+eval(bborder+tt-tt0)+"px;width:"+eval(ww+ssize)+"px;height:"+eval(hh+ssize)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
  else
  { if (ww>hh)
    { ccr=0; cct=0;
      while (ccr<ww)
      { ccl=ccr;
        while ((2*ccr*hh<=(2*cct+1)*ww)&&(ccr<=ww)) ccr++;
        if (ddir) dd+="<div style='visibility:visible;position:absolute;left:"+eval(ccl+bborder+ll-ll0)+"px;top:"+eval(cct+bborder+tt-tt0)+"px;width:"+eval(ccr-ccl+ssize)+"px;height:"+ssize+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        else dd+="<div style='visibility:visible;position:absolute;left:"+eval(ww-ccr+bborder+ll-ll0)+"px;top:"+eval(cct+bborder+tt-tt0)+"px;width:"+eval(ccr-ccl+ssize)+"px;height:"+ssize+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        cct++;
      }
    }
    else
    { ccb=0; ccl=0;
      while (ccb<hh)
      { cct=ccb;
        while ((2*ccb*ww<=(2*ccl+1)*hh)&&(ccb<hh)) ccb++;
        if (ddir) dd+="<div style='visibility:visible;position:absolute;left:"+eval(ccl+bborder+ll-ll0)+"px;top:"+eval(cct+bborder+tt-tt0)+"px;width:"+ssize+"px;height:"+eval(ccb-cct+ssize)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        else dd+="<div style='visibility:visible;position:absolute;left:"+eval(ww-ccl+bborder+ll-ll0)+"px;top:"+eval(cct+bborder+tt-tt0)+"px;width:"+ssize+"px;height:"+eval(ccb-cct+ssize)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        ccl++;
      }
    }
  }
  tmpX0=theX1-Math.round(1/LL*(ccL*DDX+ccB*DDY));
  tmpY0=theY1-Math.round(1/LL*(ccL*DDY-ccB*DDX));
  ddir=(((theY1>tmpY0)&&(theX1>tmpX0))||((theY1<tmpY0)&&(theX1<tmpX0))) ? true : false;
  if (tmpX0<=theX1) { ll=tmpX0; rr=theX1; }
  else { ll=theX1; rr=tmpX0; }
  if (tmpY0<=theY1) { tt=tmpY0; bb=theY1; }
  else { tt=theY1; bb=tmpY0; }
  ww=rr-ll; hh=bb-tt;
  if ((ww==0)||(hh==0)) dd+="<div style='visibility:visible;position:absolute;left:"+eval(bborder+ll-ll0)+"px;top:"+eval(bborder+tt-tt0)+"px;width:"+eval(ww+ssize)+"px;height:"+eval(hh+ssize)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
  else
  { if (ww>hh)
    { ccr=0; cct=0;
      while (ccr<ww)
      { ccl=ccr;
        while ((2*ccr*hh<=(2*cct+1)*ww)&&(ccr<=ww)) ccr++;
        if (ddir) dd+="<div style='visibility:visible;position:absolute;left:"+eval(ccl+bborder+ll-ll0)+"px;top:"+eval(cct+bborder+tt-tt0)+"px;width:"+eval(ccr-ccl+ssize)+"px;height:"+ssize+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        else dd+="<div style='visibility:visible;position:absolute;left:"+eval(ww-ccr+bborder+ll-ll0)+"px;top:"+eval(cct+bborder+tt-tt0)+"px;width:"+eval(ccr-ccl+ssize)+"px;height:"+ssize+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        cct++;
      }
    }
    else
    { ccb=0; ccl=0;
      while (ccb<hh)
      { cct=ccb;
        while ((2*ccb*ww<=(2*ccl+1)*hh)&&(ccb<hh)) ccb++;
        if (ddir) dd+="<div style='visibility:visible;position:absolute;left:"+eval(ccl+bborder+ll-ll0)+"px;top:"+eval(cct+bborder+tt-tt0)+"px;width:"+ssize+"px;height:"+eval(ccb-cct+ssize)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        else dd+="<div style='visibility:visible;position:absolute;left:"+eval(ww-ccl+bborder+ll-ll0)+"px;top:"+eval(cct+bborder+tt-tt0)+"px;width:"+ssize+"px;height:"+eval(ccb-cct+ssize)+"px;background-color:"+theColor+";font-size:1pt;line-height:1pt;'></div>";
        ccl++;
      }
    }
  }
  dd+="</div>";
  return(dd);
}

function SwitchSetupBoard()
{ SetBoardClicked(-1);
  if (!isSetupBoard)
  { Init('standard');
    isSetupBoard=true;
    if ((document.BoardForm)&&(document.BoardForm.SetupBoard))
      document.BoardForm.SetupBoard.value=" Ready ";
    return;
  }
  isSetupBoard=false;
  if ((document.BoardForm)&&(document.BoardForm.SetupBoard))
    document.BoardForm.SetupBoard.value="Setup Board";
  var ii, jj, ee, ss="", cc;
  for (jj=7; jj>=0; jj--)
  { ee=0;
    for (ii=0; ii<8; ii++)
    { if (Board[ii][jj]==0) ee++;
      else
      { if (ee>0)
        { ss=ss+""+ee;
          ee=0;
        }
        if (Board[ii][jj]>0) 
          ss=ss+PieceName.toUpperCase().charAt(Board[ii][jj]-1);
        else
          ss=ss+PieceName.toLowerCase().charAt(-Board[ii][jj]-1);
      }
    }
    if (ee>0) ss=ss+""+ee;
    if (jj>0) ss=ss+"/";
  }
  MoveType=-1;
  while (MoveType<0)
  { if (MoveType<0)
    { if (confirm("White to move?")) MoveType=0;
    }
    if (MoveType<0)
    { if (confirm("Black to move?")) MoveType=1;
    }
  }
  if (MoveType==0) ss=ss+" w ";
  else ss=ss+" b ";
  cc=0;
  if ((Board[4][0]==1)&&(Board[7][0]==3)) { ss+="K"; cc++; }
  if ((Board[4][0]==1)&&(Board[0][0]==3)) { ss+="Q"; cc++; }
  if ((Board[4][7]==-1)&&(Board[7][7]==-3)) { ss+="k"; cc++; }
  if ((Board[4][7]==-1)&&(Board[0][7]==-3)) { ss+="q"; cc++; }  
  if (cc==0) ss=ss+"-";
  ss=ss+" -";
  ss=ss+" "+HalfMove[MoveCount-StartMove];
  ss=ss+" "+Math.floor((MoveCount+2)/2);
  if ((document.BoardForm)&&(document.BoardForm.FEN))
    document.BoardForm.FEN.value=ss;    
  Init(ss);
}

function SetBoardSetupMode(mm)
{ BoardSetupMode=mm;
  SetBoardClicked(-1);
}

function SetupBoardClick(nn)
{ var ii, jj, ii0, jj0, ii1, jj1, mm, nnn;
  if (isRotated) nnn=63-nn;
  else nnn=nn;
  if ((BoardClicked<0)&&(BoardSetupMode!='delete'))
  { if (nn>=64) { SetBoardClicked(nn); return; }
    ii0=nnn%8;
    jj0=7-(nnn-ii0)/8;
    if (Board[ii0][jj0]!=0) SetBoardClicked(nnn); 
    return; 
  }
  if (BoardClicked>=0)
  { ii0=BoardClicked%8;
    jj0=7-(BoardClicked-ii0)/8;
  }
  ii1=nnn%8;
  jj1=7-(nnn-ii1)/8;
  if (((Board[ii1][jj1]!=0))&&(BoardSetupMode!='delete')) 
  { SetBoardClicked(nnn); 
    return;
  }
  if (BoardSetupMode=='copy')
  { Board[ii1][jj1]=Board[ii0][jj0];
    SetBoardClicked(nnn);
  }
  if (BoardSetupMode=='move')
  { if (BoardClicked>=64)
    { ii0=BoardClicked%2;
      jj0=(BoardClicked-64-ii0)/2;
      if (ii0==0) Board[ii1][jj1]=jj0+1;
      else Board[ii1][jj1]=-jj0-1;
    }
    else
    { Board[ii1][jj1]=Board[ii0][jj0];
      Board[ii0][jj0]=0;
      SetBoardClicked(nnn);
    }  
  }
  if (BoardSetupMode=='delete')
  { Board[ii1][jj1]=0;
    SetBoardClicked(-1);
  }
  if (isRotated)
  { for (ii=0; ii<8; ii++)
    { for (jj=0; jj<8; jj++)
      { if (Board[ii][jj]==0)
          SetImg(63-ii-(7-jj)*8,BoardPic);
        else
          SetImg(63-ii-(7-jj)*8,PiecePic[(1-sign(Board[ii][jj]))/2][Math.abs(Board[ii][jj])-1]);
      }
    }
  }
  else
  { for (ii=0; ii<8; ii++)
    { for (jj=0; jj<8; jj++)
      { if (Board[ii][jj]==0)
          SetImg(ii+(7-jj)*8,BoardPic);
        else
          SetImg(ii+(7-jj)*8,PiecePic[(1-sign(Board[ii][jj]))/2][Math.abs(Board[ii][jj])-1]);
      }
    }
  }
}

function SetupPieceClick(ii,bb)
{ if (isDragDrop&&(!bb)) return;
  var nn=BoardClicked;
  if (ii>11)
  { if (nn>=0)
    { SetBoardSetupMode('delete');
      if (isRotated) BoardClick(63-nn,true);
      else BoardClick(nn,true);
      SetBoardSetupMode('move');
    }
    return;
  }
  SetBoardClicked(-1);
  BoardClick(ii+64,true);
}

function ParsePgn(nn,gg,ffile)
{ if ((nn>0)&&(nn<5)) ParseType=parseInt(nn);
  var ii, jj, ll=0, ss, tt, uu=""; 
  if (ffile) ss=" "+ffile;
  else
  { if (! parent.frames[1].document.documentElement) 
    { if (nn>-50) setTimeout("ParsePgn("+eval(nn-5)+",'"+gg+"')",400); 
      return; 
    }
    ss=parent.frames[1].document.documentElement.innerHTML;
    if (ss!="") ll=ss.length;
    if (ll!=nn)
    { setTimeout("ParsePgn("+ll+",'"+gg+"')",400);
      return;
    }
    if (ll==0) return;
    ss=ss.replace(/\<html\>/i,'');  
    ss=ss.replace(/\<\/html\>/i,'');
    ss=ss.replace(/\<head\>/i,'');  
    ss=ss.replace(/\<\/head\>/i,'');  
    ss=ss.replace(/\<body\>/i,'');  
    ss=ss.replace(/\<\/body\>/i,'');
    ss=ss.replace(/\<pre\>/i,'');  
    ss=ss.replace(/\<\/pre\>/i,'');  
    ss=ss.replace(/\<xmp\>/i,'');  
    ss=ss.replace(/\<\/xmp\>/i,'');    
    ss=ss.replace(/&quot;/g,'"');
//  while (ss.indexOf('&quot;')>0) ss=ss.replace('&quot;','"');
    ss=ss.replace(/&lt;/g,'<');
    ss=ss.replace(/&gt;/g,'>');
    ss=" "+ss;
  }
  ss = ss.split("[");
  if (ss.length<2) return;
  tt=new Array(ss.length-1);
  for (ii=1; ii<ss.length; ii++)
    tt[ii-1]=ss[ii].split("]");
  var bblack=new Array();
  var wwhite=new Array();
  var rresult=new Array();
  var ppgnText=new Array();
  var ggameText=new Array();
  var ffenText=new Array();
  var ssanText=new Array();
  var kk, ff, sstype=new Array();
  jj=0;
  ffenText[jj]="";
  ssanText[jj]="";
  ggameText[jj]="";
  for (ii=0; ii<tt.length; ii++)
  { kk=tt[ii][0].split(" ")[0];
    sstype[kk]=kk;
    if (tt[ii][0].substr(0,6)=="Black ")
      bblack[jj]=tt[ii][0].substr(6,tt[ii][0].length);      
    if (tt[ii][0].substr(0,6)=="White ")
      wwhite[jj]=tt[ii][0].substr(6,tt[ii][0].length);
    if (tt[ii][0].substr(0,7)=="Result ")
      rresult[jj]=tt[ii][0].substr(7,tt[ii][0].length);
    if (tt[ii][0].substr(0,4)=="FEN ")
      ffenText[jj]=tt[ii][0].substr(4,tt[ii][0].length);
    if (tt[ii][0].substr(0,4)=="SAN ")
      ssanText[jj]=tt[ii][0].substr(4,tt[ii][0].length);      
    ggameText[jj]+="["+tt[ii][0]+"]<br />";
    kk=0;    
    while ((kk<tt[ii][1].length)&&(tt[ii][1].charCodeAt(kk)<49)) kk++; 
    if (kk<tt[ii][1].length)
    { ppgnText[jj]=tt[ii][1].substr(kk,tt[ii][1].length);
      kk=0; ff=String.fromCharCode(13);
      while ((kk=ppgnText[jj].indexOf(ff, kk))>0) ppgnText[jj]=ppgnText[jj].substr(0,kk)+""+ppgnText[jj].substr(kk+1);
      kk=0; ff=String.fromCharCode(10)+String.fromCharCode(10);
      while ((kk=ppgnText[jj].indexOf(ff, kk))>0) ppgnText[jj]=ppgnText[jj].substr(0,kk)+" <br /><br /> "+ppgnText[jj].substr(kk+2);    
      kk=0; ff=String.fromCharCode(10);
      while ((kk=ppgnText[jj].indexOf(ff, kk))>0) ppgnText[jj]=ppgnText[jj].substr(0,kk)+" "+ppgnText[jj].substr(kk+1);    
      while (ffenText[jj].indexOf('"')>=0) ffenText[jj]=ffenText[jj].replace('"','');
      while (ssanText[jj].indexOf('"')>=0) ssanText[jj]=ssanText[jj].replace('"','');
      if (ParseType%2==1)
      { ppgnText[jj]=escape(ppgnText[jj]);
        ffenText[jj]=escape(ffenText[jj]);
        ssanText[jj]=escape(ssanText[jj]);        
        ggameText[jj]=escape(ggameText[jj]);
      }
      else
      { ppgnText[jj]=ppgnText[jj].replace(/\'/g,"\\'");
        ggameText[jj]=ggameText[jj].replace(/\'/g,"\\'");
      }  
      jj++;
      ffenText[jj]="";
      ssanText[jj]="";
      ggameText[jj]="";
    }
  }
  if (ParseType%2==1) uu="unescape";
  var ssh=ScoreSheet;
  if ((document.BoardForm)&&(document.BoardForm.ScoreSheet))
    ssh=parseInt(document.BoardForm.ScoreSheet.options[document.BoardForm.ScoreSheet.options.selectedIndex].value);
  if ((parent.frames["annotation"])&&(ssh==0)) ssh=1;
  var bb=BGColor;
  if (bb=="") bb="#E0C8A0";
  var dd=parent.frames[1].document;
  dd.open();
  dd.writeln("<html><head>");
  dd.writeln("<style type='text/css'>");
  dd.writeln("body { background-color:"+bb+";color:#000000;font-size:10pt;line-height:12pt;font-family:Verdana; }");
  if ((ssh)||(ParseType>2))
  { dd.writeln("table { border-left:1px solid #808080; border-top:1px solid #808080; }");
    dd.writeln("td, th { border-right:1px solid #808080; border-bottom:1px solid #808080; font-size:10pt;line-height:12pt;font-family:Verdana; vertical-align:top}");
  }
  dd.writeln("a {color:#000000; text-decoration: none}");
  dd.writeln("a:hover {color:#FFFFFF; background-color:#808080}");
  dd.writeln("</style>");
  dd.writeln("<"+"script language='JavaScript'>");
  ii=ImagePath.replace("/","|");
  if ((document.BoardForm)&&(document.BoardForm.ImagePath))
    ii=document.BoardForm.ImagePath.options[document.BoardForm.ImagePath.options.selectedIndex].value;
  if (ii!="") ii="&SetImagePath="+ii;
  if (BGColor!="") ii=ii+"&SetBGColor="+BGColor.substr(1,6);
  if ((document.BoardForm)&&(document.BoardForm.Border)&&(document.BoardForm.Border.options.selectedIndex>0))
    ii=ii+"&SetBorder=1";
  if (parent.frames["annotation"])
    dd.writeln("if (! parent.frames[0]) location.href='pgnannotator.html?'+location.href+'&SetAnnotation="+AnnotationFile+ii+"';");
  else
    dd.writeln("if (! parent.frames[0]) location.href='ltpgnviewer.html?'+location.href+'"+ii+"';");
  dd.writeln("var PgnMoveText=new Array();");
  dd.writeln("var GameText=new Array();");    
  dd.writeln("var FenText=new Array();");
  dd.writeln("var SanText=new Array();");  
  for (ii=0; ii<jj; ii++)
  { dd.writeln("PgnMoveText["+ii+"]='"+ppgnText[ii]+"';");
    dd.writeln("GameText["+ii+"]='"+ggameText[ii]+"';");
    if (ffenText[ii]!="") dd.writeln("FenText["+ii+"]='"+ffenText[ii]+"';");
    if (ssanText[ii]!="") dd.writeln("SanText["+ii+"]='"+ssanText[ii]+"';");
  }
  dd.writeln("function OpenGame(nn)");
  dd.writeln("{ if (parent.frames[0].IsComplete)");
  dd.writeln("  { if (parent.frames[0].IsComplete())");
  dd.writeln("    { if (nn>=0)");
  dd.writeln("      { if (FenText[nn]) parent.frames[0].Init("+uu+"(FenText[nn]));");
  dd.writeln("        else parent.frames[0].Init('standard');");
  dd.writeln("        if (SanText[nn]) parent.frames[0].ApplySAN("+uu+"(SanText[nn]));");  
  dd.writeln("        //parent.frames[0].SetPgnMoveText("+uu+"(PgnMoveText[nn])); //variants not possible");
  dd.writeln("        parent.frames[0].ApplyPgnMoveText("+uu+"(PgnMoveText[nn]),'#CCCCCC',window.document); //variants possible");
  dd.writeln("        //document.getElementById('GameText').innerHTML="+uu+"(GameText[nn])+'<br />'+PgnMoveText[nn]; //pgn without html links");
  if (ssh)
  { dd.writeln("        if (document.getElementById) document.getElementById('GameText').innerHTML=parent.frames[0].ScoreSheetHeader("+uu+"(GameText[nn]))+parent.frames[0].GetHTMLMoveText(0,false,true,"+ssh+")+parent.frames[0].ScoreSheetFooter(); //pgn with html links");
    dd.writeln("        else if (document.GameTextLayer) { with(document.GameTextLayer) { document.open(); document.write(parent.frames[0].ScoreSheetHeader("+uu+"(GameText[nn]))+parent.frames[0].GetHTMLMoveText(0,false,true,"+ssh+")+parent.frames[0].ScoreSheetFooter()); document.close(); }}//pgn with html links");
    if (parent.frames["annotation"])
      dd.writeln("        parent.frames[0].UpdateAnnotation(true);");  
  }
  else
  { dd.writeln("        if (document.getElementById) document.getElementById('GameText').innerHTML="+uu+"(GameText[nn])+'<br />'+parent.frames[0].GetHTMLMoveText(0,false,true); //pgn with html links");  
    dd.writeln("        else if (document.GameTextLayer) { with(document.GameTextLayer) { document.open(); document.write("+uu+"(GameText[nn])+'<br />'+parent.frames[0].GetHTMLMoveText(0,false,true)); document.close(); }}//pgn with html links");  
    dd.writeln("        if ((document.forms[0])&&(document.forms[0].GameList)) document.forms[0].GameList.options.selectedIndex=parseInt(nn)+1;");
  }
  dd.writeln("      }");
  if (isDragDrop) dd.writeln("      if (parent.frames[0].SetDragDrop) parent.frames[0].SetDragDrop(1);");    
  dd.writeln("      return;");
  dd.writeln("    }");
  dd.writeln("  }");
  dd.writeln("  setTimeout('OpenGame('+nn+')',400);");    
  dd.writeln("}");
  dd.writeln("function SetMove(mm,vv){ if (parent.frames[0].SetMove) parent.frames[0].SetMove(mm,vv); }");   
  if (jj>1)
  { dd.writeln("function SearchGame()");
    dd.writeln("{ var tt=document.forms[0].SearchText.value;");
    dd.writeln("  var oo=document.forms[0].SearchType;");
    dd.writeln("  oo=oo.options[oo.options.selectedIndex].text;");
    dd.writeln("  if (tt=='') return(false);");
    dd.writeln("  var ll=document.forms[0].GameList;");
    dd.writeln("  var ii, jj=ll.selectedIndex-1, kk=ll.options.length-1;");
    dd.writeln("  if (oo=='Moves')");
    dd.writeln("  { for (ii=1; ii<kk; ii++)");
    dd.writeln("    { if (PgnMoveText[(ii+jj)%kk].indexOf(tt)>=0)");
    dd.writeln("      { ll.selectedIndex=(ii+jj)%kk+1;");
    dd.writeln("        OpenGame(ll.options[(ii+jj)%kk+1].value);");
    dd.writeln("        return(false);");
    dd.writeln("      }");
    dd.writeln("    }");
    dd.writeln("    return(false);");
    dd.writeln("  }");
    dd.writeln("  tt=tt.toLowerCase();");
    dd.writeln("  if (oo=='Player')");
    dd.writeln("  { for (ii=1; ii<kk; ii++)");
    dd.writeln("    { if (ll.options[(ii+jj)%kk+1].text.toLowerCase().indexOf(tt)>=0)");
    dd.writeln("      { ll.selectedIndex=(ii+jj)%kk+1;");
    dd.writeln("        OpenGame(ll.options[(ii+jj)%kk+1].value);");
    dd.writeln("        return(false);");
    dd.writeln("      }");
    dd.writeln("    }");
    dd.writeln("    return(false);");
    dd.writeln("  }");
    dd.writeln("  for (ii=1; ii<kk; ii++)");
    dd.writeln("  { var nn, mm=oo.length+3, ss=GameText[(ii+jj)%kk].split('<br />');");
    dd.writeln("    for (nn=0; nn<ss.length; nn++)");
    dd.writeln("    { if ((ss[nn].indexOf(oo)>0)&&(ss[nn].toLowerCase().indexOf(tt)>=mm))");
    dd.writeln("      { ll.selectedIndex=(ii+jj)%kk+1;");
    dd.writeln("        OpenGame(ll.options[(ii+jj)%kk+1].value);");
    dd.writeln("        return(false);");
    dd.writeln("      }");
    dd.writeln("    }");
    dd.writeln("  }");
    dd.writeln("  return(false);");
    dd.writeln("}");
    dd.writeln("if (window.event) document.captureEvents(Event.KEYDOWN);");
    dd.writeln("document.onkeydown = KeyDown;");
    dd.writeln("function KeyDown(e)");
    dd.writeln("{ var kk=0;");
    dd.writeln("  if (e) kk=e.which;");
    dd.writeln("  else if (window.event) kk=event.keyCode;");
    dd.writeln("  if ((kk==37)||(kk==52)||(kk==65460)) { if (parent.frames[0].MoveBack) parent.frames[0].MoveBack(1); }");
    dd.writeln("  if ((kk==39)||(kk==54)||(kk==65462)) { if (parent.frames[0].MoveForward) parent.frames[0].MoveForward(1); }");
    dd.writeln("}");
  }
  dd.writeln("</"+"script>");
  if (jj==1) dd.writeln("</head><body onLoad=\"setTimeout('OpenGame(0)',400)\">");
  else 
  { if (ParseType<3)
    { if (parseInt(gg)<jj) dd.writeln("</head><body onLoad=\"setTimeout('OpenGame("+gg+")',400)\">");
      else dd.writeln("</head><body>");
      dd.writeln("<FORM onSubmit='return SearchGame()'><NOBR><SELECT name='GameList' onChange='OpenGame(this.options[selectedIndex].value)' SIZE=1>");
      dd.writeln("<OPTION VALUE=-1>Select a game !");
      for (ii=0; ii<jj; ii++)
      { if (ii==gg) dd.writeln("<OPTION VALUE="+ii+" selected>"+wwhite[ii].replace(/"/g,'')+" - "+bblack[ii].replace(/"/g,'')+" "+rresult[ii].replace(/"/g,''));
        else dd.writeln("<OPTION VALUE="+ii+">"+wwhite[ii].replace(/"/g,'')+" - "+bblack[ii].replace(/"/g,'')+" "+rresult[ii].replace(/"/g,''));
      }
      dd.writeln("</SELECT>");
      if (jj<24) dd.writeln("<!--");
      dd.writeln("<INPUT name='SearchText' size=12><select name='SearchType'><option>Player</option>");
      for (kk in sstype) dd.writeln("<option>"+kk+"</option>");
      dd.writeln("<option>Moves</option></select><INPUT type='submit' value='search'>");
      if (jj<24) dd.writeln("//-->");  
      dd.writeln("</NOBR></FORM>");
    }
    else
    { dd.writeln("</head><body>");
      for (ii=0; ii<jj; ii++)
      { wwhite[ii]=wwhite[ii].replace(/"/g,'').replace('.','').replace(',',' ').replace(/  /g,' ');
        bblack[ii]=bblack[ii].replace(/"/g,'').replace('.','').replace(',',' ').replace(/  /g,' ');
      }
      var ccT, ccL=1, ccN=new Array(), ccI=new Array(), ccC=new Array(), ccS=new Array(), ccO=new Array();
      ccI[wwhite[0]]=0;
      ccN[0]=wwhite[0];
      for (ii=1; ii<jj; ii++)
      { for (kk=0; kk<ccL; kk++)
        { if (wwhite[ii]==ccN[kk]) kk=ccL+1;
        }
        if (kk==ccL)
        { ccI[wwhite[ii]]=ccL;
          ccN[ccL++]=wwhite[ii];
        }
      }
      for (ii=0; ii<jj; ii++)
      { for (kk=0; kk<ccL; kk++)
        { if (bblack[ii]==ccN[kk]) kk=ccL+1;
        }
        if (kk==ccL)
        { ccI[bblack[ii]]=ccL;
          ccN[ccL++]=bblack[ii];
        }
      }
      var ccCT=new Array(ccL); 
      for (kk=0; kk<ccL; kk++) 
      { ccC[kk]=0; ccS[kk]=0; ccO[kk]=kk;
        ccCT[kk]=new Array(ccL);
        for (ii=0; ii<ccL; ii++) ccCT[kk][ii]="&nbsp;";
        ccCT[kk][kk]="&nbsp;*";
      }
      for (ii=0; ii<jj; ii++)
      { ccT=rresult[ii].replace(/"/g,'');
        if ((ccT.length==3)&&(ccT.indexOf("-")==1))
        { ccS[ccI[wwhite[ii]]]+=1.00001*parseInt(ccT.substr(0,1));
          ccS[ccI[bblack[ii]]]+=1.00001*parseInt(ccT.substr(2,1));
          ccCT[ccI[wwhite[ii]]][ccI[bblack[ii]]]+="&nbsp;<a href='javascript:OpenGame("+ii+")'>"+ccT.substr(0,1)+"</a>&nbsp;";
          ccCT[ccI[bblack[ii]]][ccI[wwhite[ii]]]+="&nbsp;<a href='javascript:OpenGame("+ii+")'>"+ccT.substr(2,1)+"</a>&nbsp;";
        }
        else
        { ccS[ccI[wwhite[ii]]]+=0.5;
          ccS[ccI[bblack[ii]]]+=0.5;
          ccCT[ccI[wwhite[ii]]][ccI[bblack[ii]]]+="<a href='javascript:OpenGame("+ii+")'>&#189;</a>";
          ccCT[ccI[bblack[ii]]][ccI[wwhite[ii]]]+="<a href='javascript:OpenGame("+ii+")'>&#189;</a>";
        }
        ccC[ccI[wwhite[ii]]]+=1;
        ccC[ccI[bblack[ii]]]+=1;
      }
      for (ii=0; ii<ccL-1; ii++)
      { for (kk=ii; kk<ccL; kk++)
        { if (ccS[ccO[ii]]<ccS[ccO[kk]])
          { ccT=ccO[ii];
            ccO[ii]=ccO[kk];
            ccO[kk]=ccT;
          }
        }
      }
      dd.writeln("<table border=1 celpadding=0 cellspacing=0 width='100%'><tr><th>Rank</th><th>Name</th>");
      for (kk=0; kk<ccL; kk++) dd.writeln("<th>"+(kk+1)+"</th>");
      dd.writeln("<th>Score</th></tr>");
      for (kk=0; kk<ccL; kk++)
      { dd.writeln("<tr><th nowrap>"+(kk+1)+"</th><th nowrap>"+ccN[ccO[kk]]+"</th>");
        for (ii=0; ii<ccL; ii++) dd.writeln("<th nowrap>"+ccCT[ccO[kk]][ccO[ii]]+"&nbsp;</th>"); 
        dd.writeln("<th nowrap>"+Math.round(10*ccS[ccO[kk]])/10+"/"+ccC[ccO[kk]]+"</th></tr>");
      }
      dd.writeln("</table><br>");  
    }
  }
  dd.writeln("<div id='GameText'> </div>");
  dd.writeln("<layer id='GameTextLayer'> </layer>");  
  dd.writeln("<!--generated with LT-PGN-VIEWER 3.4--></body></html>");
  dd.close();
}

function ScoreSheetHeader(tt)
{ var pp=new Array("Event","Site","Date","Round", "Result","White","Black","ECO","WhiteElo","BlackElo","FEN");
  var vv=new Array("?","?","?","?","?","?","?","?","?","?","");
  var ii, jj, ss, ee;
  for (ii=0; ii<pp.length; ii++)
  { jj=tt.indexOf("["+pp[ii]);
    if (jj>=0)
    { ss=tt.indexOf('"', jj+1);
      if (ss>=0)
      { ee=tt.indexOf('"', ss+1);
        if (ee>ss+1)
        { vv[ii]=tt.substring(ss+1,ee);
        }
      }
    }
  }
  ss="<div align='center'><table width=50% cellpadding=0 cellspacing=0><tr><td><table width=100% cellpadding=2 cellspacing=0>";
  ss+="<tr><td colspan=9><small>event</small><br /><nobr>"+vv[0]+"</nobr></td><td colspan=5><small>date</small><br /><nobr>"+vv[2]+"</nobr></td></tr>";
  ss+="<tr><td colspan=9><small>site</small><br /><nobr>"+vv[1]+"</nobr></td><td width='8%'><small>rnd</small><br /><nobr>"+vv[3]+"</nobr></td><td width='16%' colspan=2><small>score</small><br /><nobr>"+vv[4]+"</nobr></td><td width='16%' colspan=2><small>eco</small><br /><nobr>"+vv[7]+"</nobr></td></tr>";
  ss+="<tr><td colspan=11><small>white</small><br /><nobr>"+vv[5]+"</nobr></td><td colspan=3><small>rating</small><br /><nobr>"+vv[8]+"</nobr></td></tr>";
  ss+="<tr><td colspan=11><small>black</small><br /><nobr>"+vv[6]+"</nobr></td><td colspan=3><small>rating</small><br /><nobr>"+vv[9]+"</nobr></td></tr>";
  if (vv[10])  ss+="<tr><td colspan=14><small>fen</small><br /><nobr>"+vv[10]+"</nobr></td></tr>";
  ss+="</table>";
  return(ss);
}

function ScoreSheetFooter()
{ offsetAnchor=0;
  return("</td></tr></table></div>");
}

function PrintPosition()
{ var pp="", tt="", ww;
  if (document.BoardForm)
  { if (document.BoardForm.Pawns) pp=document.BoardForm.Pawns.checked;
    if (pp) tt="Pawn structure after ";
    else tt="Position after ";  
    if (parseInt(document.BoardForm.Position.value)>0) tt+=document.BoardForm.Position.value;
    else tt=document.BoardForm.Position.value;   
  }
  ww=window.open("");
  with(ww.document)
  { open();
    writeln("<html><head><title>"+tt+"</title></head><body><div align='center'>");
    writeln(GetDiagram(pp,tt));
    if(Annotation[MoveCount]) writeln(Annotation[MoveCount]);
    writeln("</div></body></html>");    
    close();
  }
  ww.print();
}

function SetDragDrop(bb) 
{ if ((document.BoardForm)&&(document.BoardForm.DragDrop))
    document.BoardForm.DragDrop.checked=bb;
  if (document.layers) return;
  SetBoardClicked(-1);
  isDragDrop=bb; 
  if (bb)
  { document.onmousedown=MouseDown;
    document.onmousemove=MouseMove;
    document.onmouseup=MouseUp;
  }
  else
  { document.onmousedown=null;
    document.onmousemove=null;
    document.onmouseup=null;
  }
}
function MouseDown(e)
{ var ii="";
  if (dragObj) MouseUp(e);
  if (e)
  { dragObj=e.target;
    ii=dragObj.id;
    dragX=e.clientX;
    dragY=e.clientY;
  }
  else if (window.event)
  { dragObj=event.srcElement;
    ii=dragObj.id;
    dragX=event.clientX;
    dragY=event.clientY;
  }
  else return;
  if (isNaN(parseInt(ii))) 
  { if (isNaN(parseInt(ii.substr(1)))) { dragObj=null; return; } 
    ii=parseInt(ii.substr(1));
    dragObj=document.images[ii+ImageOffset];
  }
  if (ii<64) BoardClick(ii,true);
  else SetupPieceClick(ii-64,true);
  if (!isDragDrop) return;
  if ((BoardClicked<0)||(isAutoPlay)) dragObj=null;
  else 
  { dragObj.style.zIndex=200;
    dragBorder=dragObj.style.borderWidth;
    if (dragBorder) dragObj.style.borderWidth="0px";
  }
  return false;
}
function MouseMove(e)
{ if (!isDragDrop) return;
  if (BoardClicked<0) return;
  if (dragObj)
  { if (e)
    { dragObj.style.left=(e.clientX-dragX)+"px";
      dragObj.style.top=(e.clientY-dragY)+"px";
    }
    else if (window.event)
    { dragObj.style.left=(event.clientX-dragX)+"px";
      dragObj.style.top=(event.clientY-dragY)+"px";
    }
  }
  return false;
}
function MouseUp(e)
{ var ii, jj, ddx=0, ddy=0, ww=32;
  if (!isDragDrop) return;
  if (BoardClicked<0) return;
  if (dragObj)
  { ww=dragObj.width;
    if (dragBorder) ww+=2*parseInt(dragBorder);
  }
  if ((isNaN(ww))||(ww==0)) ww=32;
  if (e)
  { ddx=e.clientX-dragX;
    ddy=e.clientY-dragY;
  }
  else if (window.event)
  { ddx=event.clientX-dragX;
    ddy=event.clientY-dragY;
  }  
  else return;
  if (BoardClicked<64)
  { if (isRotated)
    { ii=(63-BoardClicked)%8;
      jj=7-(63-BoardClicked-ii)/8;
    }
    else
    { ii=BoardClicked%8;
      jj=7-(BoardClicked-ii)/8;
    }
  }
  else 
  { ii=9+BoardClicked%2;
    jj=7-Math.floor((BoardClicked-64)/2);
  }
  ii+=Math.round(ddx/ww);
  jj-=Math.round(ddy/ww);
  if ((ii>=0)&&(ii<8)&&(jj>=0)&&(jj<8)) BoardClick(8*(7-jj)+ii,true);
  else if ((isSetupBoard)&&(ii==9)&&(jj==0)) SetupPieceClick(12,true);
  else BoardClick(BoardClicked,true);
  if (dragObj)
  { dragObj.style.left = "0px";
    dragObj.style.top  = "0px";
    dragObj.style.zIndex=1;
    if (dragBorder) dragObj.style.borderWidth=dragBorder;
    dragObj=null;
  } 
}
function AnimateBoard(nn)
{ var pp=0, mm=parseInt(Delay)/100;
  isAnimating=true;
  if (dragPiece[4]>=0) mm*=0.75;
  mm=Math.floor(mm);
  if (mm>10) mm=10;
  if (nn>mm) pp=4;
  if (nn%mm==1)
  { if (isRotated) dragImg[pp%3]=document.images[63-dragPiece[pp+2]-(7-dragPiece[pp+3])*8+ImageOffset];
    else dragImg[pp%3]=document.images[dragPiece[pp+2]+(7-dragPiece[pp+3])*8+ImageOffset];
    dragPiece[pp+2]=dragImg[pp%3].offsetLeft;
    dragPiece[pp+3]=dragImg[pp%3].offsetTop;
    if (isRotated) dragImg[pp%3]=document.images[63-dragPiece[pp+0]-(7-dragPiece[pp+1])*8+ImageOffset];
    else dragImg[pp%3]=document.images[dragPiece[pp+0]+(7-dragPiece[pp+1])*8+ImageOffset];
    dragPiece[pp+0]=dragImg[pp%3].offsetLeft;
    dragPiece[pp+1]=dragImg[pp%3].offsetTop;
  }
  if (nn%mm!=0)
  { if (nn%mm==1)
    { dragImg[pp%3].style.zIndex=200+pp;
      dragImgBorder=parseInt(dragImg[pp%3].style.borderWidth);
      if (dragImgBorder) dragImg[pp%3].style.borderWidth="0px";
      else dragImgBorder=0;
    }
    dragImg[pp%3].style.left=(Math.round((nn%mm)*(dragPiece[pp+2]-dragPiece[pp+0])/(mm-1))+dragImgBorder)+"px";
    dragImg[pp%3].style.top=(Math.round((nn%mm)*(dragPiece[pp+3]-dragPiece[pp+1])/(mm-1))+dragImgBorder)+"px";
    if ((dragPiece[4]>=0)&&(mm-1==nn)) setTimeout("AnimateBoard("+(mm+1)+")",50);
    else setTimeout("AnimateBoard("+(nn+1)+")",50);
    return;
  }
  RefreshBoard();
  for (mm=0; mm<=pp; mm+=4)
  { dragImg[mm%3].style.left = 0;
    dragImg[mm%3].style.top  = 0;
    dragImg[mm%3].style.zIndex=1;
    if (dragImgBorder) dragImg[mm%3].style.borderWidth=dragImgBorder+"px";
    dragImg[mm%3]=null;
    dragPiece[mm+0]=-1;
  }
  isAnimating=false;
}

function IsComplete()
{ return(isInit);
}