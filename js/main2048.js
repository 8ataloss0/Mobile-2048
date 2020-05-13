var board=new Array();// 格子
var score=0;// 分数
var hasComflicted=new Array();

var startx=0;
var starty=0;
var endx=0;
var endy=0;

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){
	if( documentWidth > 500 ){
	        gridContainerWidth = 500;
	        cellSpace = 20;
	        cellSideLength = 100;
	    }
	
	$("#grid-container").css("width",gridContainerWidth-2*cellSpace);
	$("#grid-container").css("height",gridContainerWidth-2*cellSpace);
	$("#grid-container").css("padding",cellSpace);
	$("#grid-container").css("border-radius",0.02*gridContainerWidth);
	
	$(".grid-cell").css("width",cellSideLength);
	$(".grid-cell").css("height",cellSideLength);
	$(".grid-cell").css("border-radius",0.02*cellSideLength);
}

function newgame(){
	// 初始化棋盘格
	init();
	// 在随机俩个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){// 16个小格子位置赋值
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){// 双重循环
			var gridCell=$('#grid-cell-'+i+"-"+j);// 坐标值所对应的小格子的元素用相应的id取得对象,用i+j拼出来ID
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
		
	for(var i=0;i<4;i++){//遍历操作
		board[i]=new Array();//二维数组
		hasComflicted[i]=new Array();
		for(var j=0;j<4;j++)//初始化每一个board的值
			board[i][j]=0;//刚开始为0
			hasComflicted[i][j]=false;
		
		
	}
	
	updateBoardView();
	
	score=0;
	

}

function updateBoardView(){//根据board变量的值对前端的numbersell进行操作
	$(".number-cell").remove();//全部删除numbercell
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell=$('#number-cell-'+i+'-'+j);
			
			if(board[i][j]==0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
				
			}	
			
			
				hasComflicted[i][j]=false;
			
		}
		$('.number-cell').css('line-height',cellSideLength+'px');
		$('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber(){
	if(nospace(board))
		return false;
		
	//随机一个位置
	var randx=parseInt(Math.floor(Math.random() *4));
	var randy=parseInt(Math.floor(Math.random() *4));
	
	var times=0;
	while(times<50){
		if(board[randx][randy]==0)
			break;
			
		randx=parseInt(Math.floor(Math.random() *4));
		randy=parseInt(Math.floor(Math.random() *4));
		
		times ++;
	}
	if(times==50){
		for(var i=0;i<4;i++)
			for(var j=0;j<4;j++){
				if(board[i][j]==0){
					randx=i;
					randy=j;
				}
			}
	}
	
	//随机一个数字
	var randNumber=Math.random()<0.5?2:4;
	
	//在随机位置显示随机数字
	board[randx][randy]=randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	
	
	return true;
}


$(document).keydown(function(event){
	
	switch(event.keyCode){
		case 37://left
		event.preventDefault();
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			
			break;		
		case 38://top
		event.preventDefault();
			if(moveTop()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39://right
		event.preventDefault();
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40://down
		event.preventDefault();
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		default://default
			break;
	}
});


document.addEventListener("touchstart",function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
	
})


document.addEventListener("touchmove",function(event){
	event.preventDefault();
},false)


document.addEventListener("touchend",function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;
	
	var deltax=endx-startx;
	var deltay=endy-starty;
	
	if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth)
		return;
	
	
	if(Math.abs(deltax)>=Math.abs(deltay)){
		if(deltax>0){//x
			//move right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}else{
			//move left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}else{//y
		if(deltay>0){
			//move down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}else{
			//move top
			if(moveTop()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}
})


function isgameover(){
	if(nospace(board)&&nomove(board)){
		gameover();
	}
}

function gameover(){
	var r=confirm("gameover!")
	if (r==true)
	  {
		alert("继续游戏");
		window.location = "index.html"
	  }
	else if(r==false)
	  {
		alert("关闭页面");
		window.close();
	  }
}

//对每一个数字的位置进行判断,看是否可能为落脚点 1落脚位置是否为空 2落脚位置数字是否和自己相等 移动路径是否有障碍物
function moveLeft(){
	if(!canMoveLeft(board))
		return false;
	//moveLeft
	for(var i=0;i<4;i++)
		for(var j=1;j<4;j++)
			if(board[i][j]!=0){
				for(var k=0;k<j;k++){
					if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board)&&!hasComflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k]+=board[i][j];
						board[i][j]=0;
						
						//add score
						score += board[i][k];
						updateScore(score);
						
						hasComflicted[i][k]=true;
						continue;
					}
					
				}
			}
		
		setTimeout("updateBoardView()",200);		
		return true;
}


function moveRight(){
    if( !canMoveRight( board ) )
        return false;

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) ){
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board )&&!hasComflicted[i][k] ){
                        showMoveAnimation( i , j , i , k);
                        board[i][k] +=board[i][j];
                        board[i][j] = 0;

						//add score
						score += board[i][k];
						updateScore(score);
						
						hasComflicted[i][k]
						continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveTop(){

    if( !canMoveTop( board ) )
        return false;

    //moveTop
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board )&&!hasComflicted[k][j]){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] +=board[i][j];
                        board[i][j] = 0;
						
						//add score
						score += board[k][j];
						updateScore(score);

                        hasComflicted[i][k]
						continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if( !canMoveDown( board ) )
        return false;

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board )&&!hasComflicted[k][j] ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] +=board[i][j];
                        board[i][j] = 0;
						
						//add score
						score += board[k][j];
						updateScore(score);

                        hasComflicted[i][k]
						continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}