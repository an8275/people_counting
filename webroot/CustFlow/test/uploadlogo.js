function check(img){
		//判断文件类型		
		var ext = ['.gif', '.jpg', '.jpeg', '.png'];
		var name=img.value;	
		var s = name.toLowerCase();
		var r = false;
		for(var i = 0; i < ext.length; i++)
		{
			if (s.indexOf(ext[i]) > 0)
			{
				r = true;
				break;
			}
		}	
		if(!r)
		{
			if (img.outerHTML) {
				img.outerHTML = img.outerHTML;
			} else { // FF(包括3.5)
				img.value = "";
			}
			alert('不支持文件类型');
			return;
		}
		//判断图片大小，最大1M
		var fileSize = 0;
		var isIE = /msie/i.test(navigator.userAgent) && !window.opera;        
		if (isIE && !img.files) {          
			 var filePath = img.value;            
			 var fileSystem = new ActiveXObject("Scripting.FileSystemObject");   
			 var file = fileSystem.GetFile (filePath);               
			 fileSize = file.Size;         
		}else {  
			 fileSize = img.files[0].size;     
		}	
		fileSize=Math.round(fileSize/1024*100)/100; //单位为KB
		if(fileSize>=1024){
			if (img.outerHTML) {
				img.outerHTML = img.outerHTML;
			} else { // FF(包括3.5)
				img.value = "";
			}
			alert("照片最大尺寸为1M，请重新选择!");
			return;
		}   
	}
    function ajaxFileUpload() {	
		if($("#file").val()==''){
			alert('请选择图片文件!');
			return;
		}
        // 开始上传文件时显示一个图片
        $("#wait_loading").ajaxStart(function() {
            $(this).show();
        // 文件上传完成将图片隐藏起来
        }).ajaxComplete(function() {
            $(this).hide();
        });
        $.ajaxFileUpload({
            url: '/servlet/UploadlogoServlet?proguid=a', 
            type: 'post',
            secureuri: false, //一般设置为false
            fileElementId: 'file', // 上传文件的id、name属性名
            dataType: 'text', //返回值类型，一般设置为json、application/json
            success: function(data, status){  
                alert(data);
				$("#wait_loading").hide();
            },
            error: function(data, status, e){ 
                alert(data);
				$("#wait_loading").hide();
            }
        });
    }