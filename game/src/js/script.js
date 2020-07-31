// script.js

(function(window, document) {
	var load51 = new Load51(true,onDomReady,onLoaded);
	// 类似Jquery的$(function(){});
	function onDomReady() {
		console.log('DOM is ready');
	}
	// 当loading页面关闭时执行的函数
	function onLoaded() {
		removeTouchMove();
		console.log('Loaded');
		init();
	}
	
	function init(){
		// 音乐
		var audio = document.querySelector('#autoplay');
		$('.start-btn').click(function(){
			audio.play();
			$('#autoplay').on('ended', function() {
				this.load();
				this.play();
			})
			$('.mask,.start').fadeOut()
			pro()
			board(2)
			
			clickImg(1)
			
		});
		
		// 时间进度
		var pronum = 90
		var protop = 0
		var protime = null
		function pro(){
			clearInterval(protime);
			protime = setInterval(function(){
				pronum --
				protop += 0.0207
				$('.pronum').text(pronum)
				$('.l-probar img').css({"top":""+ protop +"rem"})
				if(pronum <= 0){
					// 第二阶段
					clearInterval(protime);
					$('.mask,.phase-end').fadeIn()
					$('.mask').fadeIn()
					$('.phase-end').fadeIn().delay(2000).fadeOut()
					$('.continue').delay(2500).fadeIn()
				
					pronum = 90
					protop = 0
				}
			},1000)
			
		}
		
		
		// 游戏随机棋盘
		function board(m){			
			// 图片数组函数
			function imgs(m){
				var imgsArr = [];
				for(var j = 0; j < 2;j++){
					for (var i = 1; i <= m; i++) {
						imgsArr.push(i)
					}
				}
				random(imgsArr)
				addImg(imgsArr)
			}
			//随机打乱数组
			function random(data){
				for (var i = 1; i < data.length - 1; i++) {
					var index = parseInt(Math.random() * (data.length - i));
					var temp = data[index];
					data[index] = data[data.length - i - 1];
					data[data.length - i - 1] = temp;
				}
			} 
			// 插入图片
			function addImg(imgUrl){
				var addimgHtml = ''
				for (var i = 0; i < imgUrl.length; i++) {
					addimgHtml += "<li value="+imgUrl[i]+" class='disabled'><img src='images/icon" + imgUrl[i] + ".png'><div class='icon-bg'><img src='images/icon-bg.png'></div></li>"
				}
				$(".txt-grid ul").html(addimgHtml)
			}
			imgs(m)
			
			// 4与6布局
			$('.txt-grid ul li').css({"width":"50%"})
			$('.txt-grid ul li img').css({"width":"50%"})
			// 8与10与12布局
			if(m == 4 || m == 5 || m == 6){
				$('.txt-grid ul li').css({"width":"25%"})
				$('.txt-grid ul li img').css({"width":"100%"})
			
			}
			
			setTimeout(function(){
				$('.icon-bg').show()
				if($('.icon-bg').css('display') == 'block'){
					$('.txt-grid ul li').removeClass('disabled')
				}
			},2000)
			
		}
		
		// boss血量
		var probosstop = 0
		function proboss(){
			probosstop += 0.146
			console.log(probosstop);
			$('.r-probar img').css({"top":""+ probosstop +"rem"})
			if(probosstop >= 2.19){
				clearInterval(protime2);
				$('.mask,.game-over').fadeIn()
			}
		}
		
		// 选择正确
		function correct(){
			var audio1 = document.getElementById("autoplay1")
			audio1.play();
			$('.shock').addClass('shock-ani')
			$('.right-figure').addClass('right-figure-boss')
			var audio4 = document.getElementById("autoplay4")
			audio4.play();
			var audio5 = document.getElementById("autoplay5")
			setTimeout(function(){
				audio5.play();
			},700);
			proboss()
			
			setTimeout(function(){
				$('.shock').removeClass('shock-ani')
				$('.right-figure').removeClass('right-figure-boss')
			},2000)
				
		}
		
		// 点击图片
		var k = 0
		function clickImg(n){
			
			var count = 0
			var before = null;
			var beforeIndex = null;
			$('.txt-grid').on('click','li',function(e){
				
				var index = $(this).index()
				var backIndex = $(this).attr("value");
				if(before === null && beforeIndex === null){
					before = backIndex;
					beforeIndex = index;
					$('li:eq('+ index +') .icon-bg').fadeOut()
					
				}else{
					$('li:eq('+ index +') .icon-bg').fadeOut()
					if(index == beforeIndex){
						return false;
						console.log(111111111);
					}
					if(before == backIndex){
						$('li:eq('+ beforeIndex +')').addClass('disabled')
						$('li:eq('+ index +')').addClass('disabled')
						$('li:eq('+ beforeIndex +') .icon-bg').fadeOut()
						setTimeout("$('li:eq("+ index +") .icon-bg').fadeOut()",1000)
						// 正确后
						var audio1 = document.getElementById("autoplay1")
						audio1.play();
						
						count++
						before = null;
						beforeIndex = null;
						
						// 4进6
						if(count == 1 && k == 0){
							$('.txt-grid ul li').addClass('disabled')
							k++
							setTimeout(function(){
								board(3)
							},1500)
							
							correct()	
						}
						// 6同6
						if(count == 3 && k == 1){
							$('.txt-grid ul li').addClass('disabled')
							k++
							setTimeout(function(){
								board(3)
								
							},1500)
							correct()
							
						}
						// 6进8
						if(count == 5 && k == 2){
							$('.txt-grid ul li').addClass('disabled')
							k++
							setTimeout(function(){
								board(4)
								
							},1500)
							correct()
						}
						// 8同8
						if(count == 8 && k == 3){
							$('.txt-grid ul li').addClass('disabled')
							k++
							setTimeout(function(){
								board(4)
								
							},1500)
							correct()
						}
						// 8进10
						if(count == 11 && k == 4){
							$('.txt-grid ul li').addClass('disabled')
							k++
							setTimeout(function(){
								board(5)
								
							},1500)
							correct()
						}
						// 10同10
						if(count == 15 && k == 5){
							$('.txt-grid ul li').addClass('disabled')
							k++
							setTimeout(function(){
								board(5)
									
							},1500)
							correct()
						}
						// 10进12
						if(count == 19 && k == 6){
							$('.txt-grid ul li').addClass('disabled')
							k++
							setTimeout(function(){
								board(6)
								
							},1500)
							correct()
						}
						// 12同12
						if(count == 24 && k == 7){
							$('.txt-grid ul li').addClass('disabled')
							setTimeout(function(){
								board(6)
								
							},1500)
							correct()
							k=0

							clearInterval(protime);
							$('.mask,.phase-end').fadeIn()
							$('.mask').fadeIn()
							$('.phase-end').fadeIn().delay(2000).fadeOut()
							$('.continue').delay(2500).fadeIn()
							
						}
						
					}else{
						$('li:eq('+ index+') .icon-bg').fadeOut();
						setTimeout('$("li:eq('+ beforeIndex +') .icon-bg").fadeIn(); $("li:eq('+ index+') .icon-bg").fadeIn()',500);
						 // 错误后
						var audio2 = document.getElementById("autoplay2")
						audio2.play();
						pronum -= 3
						protop += 0.0621
						
						before = null;
						beforeIndex = null;
					}
					 
				}	
				
				
			})
			
		}
		
		
		
		// 时间进度2
		var pronum2 = 90
		var protop2 = 0
		var protime2 = null
		function pro2(){
			clearInterval(protime2);
			protime2 = setInterval(function(){
				pronum2 --
				protop2 += 0.0207
				$('.pronum').text(pronum2)
				$('.l-probar img').css({"top":""+ protop2 +"rem"})
				if(pronum2 <= 0){
					// 第二阶段
					clearInterval(protime2);
					$('.mask,.game-over').fadeIn()
					pronum2 = 90
					protop2 = 0
				}
			},1000)
			
		}
		
		// 第二阶段
		$(document).on('click','.continue-btn',function(){
			$('.txt-grid').remove()
			$('.mask,.continue').fadeOut()
			pro2()
			board2(2)
			clickImg2(1)

			// 调换位置
			setTimeout(function(){
				$('.txt-grid2 ul li:eq(1)').animate({
					top:'50%',
					left:'-50%'
				},1000); 
				$('.txt-grid2 ul li:eq(2)').animate({
					top:'-50%',
					left:'50%'
				},1000,function(){
					$('.txt-grid2 ul li').removeClass('disabled')
				});
				
			},2500)
			
			
		});
		
		// 游戏随机棋盘
		function board2(m){			
			// 图片数组函数
			function imgs(m){
				var imgsArr = [];
				for(var j = 0; j < 2;j++){
					for (var i = 1; i <= m; i++) {
						imgsArr.push(i)
					}
				}
				random(imgsArr)
				addImg(imgsArr)
			}
			//随机打乱数组
			function random(data){
				for (var i = 1; i < data.length - 1; i++) {
					var index = parseInt(Math.random() * (data.length - i));
					var temp = data[index];
					data[index] = data[data.length - i - 1];
					data[data.length - i - 1] = temp;
				}
			} 
			// 插入图片
			function addImg(imgUrl){
				var addimgHtml = ''
				for (var i = 0; i < imgUrl.length; i++) {
					addimgHtml += "<li value="+imgUrl[i]+" class='disabled'><img src='images/icon" + imgUrl[i] + ".png'><div class='icon-bg2'><img src='images/icon-bg.png'></div></li>"
				}
				$(".txt-grid2 ul").html(addimgHtml)
			}
			imgs(m)
			
			// 4与6布局
			$('.txt-grid2 ul li').css({"width":"50%"})
			$('.txt-grid2 ul li img').css({"width":"50%"})
			// 8与10与12布局
			if(m == 4 || m == 5 || m == 6){
				$('.txt-grid2 ul li').css({"width":"25%"})
				$('.txt-grid2 ul li img').css({"width":"100%"})
				
			}
			
			setTimeout(function(){
				$('.icon-bg2').show()
			},2000)
			
		}
		
		
		// 点击图片
		var k2 = 0
		function clickImg2(v){
			var count2 = 0
			var before = null;
			var beforeIndex = null;
			$('.txt-grid2').on('click','li',function(){
				var index = $(this).index()
				var backIndex = $(this).attr("value");
				
				if(before === null && beforeIndex === null){
					before = backIndex;
					beforeIndex = index;
					$('li:eq('+ index +') .icon-bg2').fadeOut()
				}else{
					$('li:eq('+ index +') .icon-bg2').fadeOut()
					if(index == beforeIndex){
						return false;
					}
					if(before == backIndex){
						$('li:eq('+ beforeIndex +')').addClass('disabled')
						$('li:eq('+ index +')').addClass('disabled')
						$('li:eq('+ beforeIndex +') .icon-bg2').fadeOut()
						setTimeout("$('li:eq("+ index +") .icon-bg2').fadeOut()",1000)
						// 正确后
						var audio1 = document.getElementById("autoplay1")
						audio1.play();
						
						count2++
						before = null;
						beforeIndex = null;
						
						// 4进6
						if(count2 == 1 && k2 == 0){
							$('.txt-grid2 ul li').addClass('disabled')
							k2++
							setTimeout(function(){
								board2(3)
							},1500)
							correct()
							// 调换位置
							setTimeout(function(){
								$('.txt-grid2 ul li:eq(3)').animate({
									top:'33%',
								},1000); 
								$('.txt-grid2 ul li:eq(5)').animate({
									top:'-33%',
								},1000,function(){
									$('.txt-grid2 ul li').removeClass('disabled')
								});
								
							},3500)
						}
						// 6进8
						if(count2 == 3 && k2 == 1){
							$('.txt-grid2 ul li').addClass('disabled')
							k2++
							setTimeout(function(){
								board2(4)
							},1500)
							correct()
							// 调换位置
							setTimeout(function(){
								$('.txt-grid2 ul li:eq(1)').animate({
									top:'50%',
									right:'-50%'
								},1000); 
								$('.txt-grid2 ul li:eq(7)').animate({
									top:'-50%',
									right:'50%'
								},1000,function(){
									$('.txt-grid2 ul li').removeClass('disabled')
								});
								
							},3500)
						}

						// 8退4
						if(count2 == 6 && k2 == 2){
							$('.txt-grid2 ul li').addClass('disabled')
							k2++
							setTimeout(function(){
								board2(2)
							},1500)
							correct()
							// 旋转
							$('.txt-grid2 ul').css({
								'transform':'rotate(180deg)',
								'transition': 'all 1s ease 3.5s'
							})
							// 调换位置
							setTimeout(function(){
								$('.txt-grid2 ul li:eq(1)').animate({
									top:'50%',
									left:'-50%'
								},1000); 
								$('.txt-grid2 ul li:eq(2)').animate({
									top:'-50%',
									left:'50%'
								},1000,function(){
									$('.txt-grid2 ul li').removeClass('disabled')
								});
								
							},4500)
							
						}
						// 4进6
						if(count2 == 7 && k2 == 3){
							$('.txt-grid2 ul li').addClass('disabled')
							k2++
							setTimeout(function(){
								board2(3)
							},1500)
							correct()
							// 旋转
							$('.txt-grid2 ul').css({
								'transform':'rotate(-90deg)',
								'transition': 'all 1s ease 3.5s'
							})
							// 调换位置
							setTimeout(function(){
								$('.txt-grid2 ul li:eq(3)').animate({
									top:'33%',
								},1000); 
								$('.txt-grid2 ul li:eq(5)').animate({
									top:'-33%',
								},1000,function(){
									$('.txt-grid2 ul li').removeClass('disabled')
								});
								
							},4500)
							
						}
						// 6进8
						if(count2 == 9 && k2 == 4){
							$('.txt-grid2 ul li').addClass('disabled')
							k2=0
							setTimeout(function(){
								board2(4)
							},1500)
							correct()
							// 旋转
							$('.txt-grid2 ul').css({
								'transform':'rotate(360deg)',
								'transition': 'all 1s ease 3.5s'
							})
							// 调换位置
							setTimeout(function(){
								
								$('.txt-grid2 ul li:eq(1)').animate({
									top:'50%',
									right:'-50%'
								},1000); 
								$('.txt-grid2 ul li:eq(7)').animate({
									top:'-50%',
									right:'50%'
								},1000,function(){
									$('.txt-grid2 ul li').removeClass('disabled')
								});
								
							},4500)
						}
						if(count2 == 12 && k2 == 0){
							$('.txt-grid2 ul li').addClass('disabled')
							correct()
							$('.mask,.game-over').delay(2500).fadeIn()
							console.log('完成');
							
						}
						
						
					}else{
						$('li:eq('+ index+') .icon-bg2').fadeOut();
						setTimeout('$("li:eq('+ beforeIndex +') .icon-bg2").fadeIn(); $("li:eq('+ index+') .icon-bg2").fadeIn()',500);
						 // 错误后
						var audio2 = document.getElementById("autoplay2")
						audio2.play();						
						pronum2 -= 3
						protop2 += 0.0621
						console.log(pronum2);
						
						
						before = null;
						beforeIndex = null;
					}
					 
				}	
				
				
			})
			
		}
		
		
		// 游戏结束
		$('.over-back').click(function(){
			alert("返回")
		})
		$('.over-next').click(function(){
			alert("下一个")
		})
		
		
		
		
	}
	

	

	// 移除默认事件及阻止冒泡
	function removeDefaultEvt(e) {
		e.preventDefault();
	}
	// 移除默认document的touchmove，针对苹果手机
	function removeTouchMove() {
		document.body.addEventListener('touchmove',removeDefaultEvt,false);
	}
})(window, document);
