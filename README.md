# whdcmp
武汉地产移动验房   

===========================20180725晚修改============================   

基础fetch方法，在超时情况下弹出模态框提示网络错误   

验房管理员---checkengineer   
批次列表：check   1个请求  超时可下拉刷新   
楼层列表：bact-list  2个请求 getUnits => getFloors  Promise.then() 链式调用解决  超时可下拉刷新   
房间详细：housedetail 5个请求 getHouse  => getRoomPoint + getProblems  Promise.all() 解决   超时显示重新获取按钮   
                            getParts ===> getPartRes  回调解决   
			    getQRCode    
					
签名页面：sign 1个请求 uploadFile   
接收页面：accept 1个请求 add   
新增问题：addnew 7个请求 getRooms => getPart => getPartRes => getPartResTouble + getPartResContractor 超时显示重新获取按钮   
		        uploadFile  上传图片   
		        add           提交   
		
暂不接收：refuse 1个请求 add   
拒收记录：refuserecord 1个请求  getRecords  添加下拉刷新   
问题详细：orderdetail 2个请求  getContent 添加下拉刷新   
			      getPass   		
收房详情：acceptdetail 1个请求 getData  添加下拉刷新

===========================20180729晚修改============================   
holder  
批次列表：batchlist 1个请求  getList 超时下拉刷新   
问题列表：problemlist 7个请求 getList  下拉刷新   
                             getParts 获取部位   
                             getRefuse  提交拒绝流程的报错优化，完成后延迟一秒刷新列表   
                             getReasons 打开弹窗再请求   
                             getHandle 调整受理的流程 等受理成功后1秒再次请求刷新列表   
                             getFinish  等受理成功后1秒再次请求刷新列表   
                             getRest  等受理成功后1秒再次请求刷新列表  
问题详细：problemdetail 5个请求  getContents  超时下拉刷新   
                                getReasons 打开弹窗再请求   
                                getHandle 调整受理的流程 等受理成功后1秒再次请求刷新列表   
                                getRefuse 提交拒绝流程的报错优化，完成后延迟一秒刷新列表   
                                getFinish 等受理成功后1秒再次请求刷新列表   
                                getRest  等受理成功后1秒再次请求刷新列表   
Repairengineer   
批次列表：batchlist 1个请求  getList 超时下拉刷新   
问题列表：problemlist  7个请求  getParts  展开筛选时请求  
                              getList 获取列表超时 添加下拉刷新  
                              getRefuseReasons 弹窗弹出时请求，且只请求一次  
                              getCloseReasons 弹窗弹出时请求，且只请求一次  
                              getRefuse  提交拒绝流程的报错优化，完成后延迟一秒刷新列表  
                              getClose 关闭并转客服流程的报错优化，完成后延迟一秒刷新列表   
                              timeoutAlert 超时提醒优化请求流程
问题详细：problemdetail  getContent  超时下拉刷新   
                        getRefuseReasons 弹窗弹出时请求，且只请求一次   
                        getCloseReasons 弹窗弹出时请求，且只请求一次   
                        getRefuse  提交拒绝流程的报错优化，完成后延迟一秒刷新列表   
                        getClose 关闭并转客服流程的报错优化，完成后延迟一秒刷新列表   
                        timeoutAlert 超时提醒优化请求流程
分配问题：uptrouble   7个请求	   getTroubleInfo => getRooms => getPart => getPartRes => getPartResTouble + getPartResContractor 添加下拉刷新   
                                Add 完善处理流程   
leader   
批次列表：batchlist  1个请求 超时下拉刷新    
                    batchdetail   2个请求  getUnits => getFloors 回调一次执行   增加下拉刷新   
                    housedetail 2个请求  getHouse => getProblems  增加加载蒙层，并依次执行   增加下拉刷新   
                    orderdetail 1个请求 getContents 增加加载蒙层 添加下拉刷新   
                    acceptdetail 1个请求 getData 增加加载蒙层 添加下拉刷新   
                    refuserecord 1个请求 getData 增加加载蒙层 添加下拉刷新
   
   ================20180731的修改================   
   修改添加问题和重新分配的流程   
   ================20180731的修改================   
   修改已处理已确认的详单 确认验房 按钮的显示，逻辑    
   =============================20180802的修改==============================   
   修复leader角色下的批次详细中列表页面的筛选状态无效，以及流程后续页面的修改    
   =============================20180803的修改==============================    
   修复添加问题 选择部位 其他次级菜单index不归0的bug    
   =============================20180806的修改==============================    
   继续完善首页登录逻辑    
   =============================20180807的修改==============================    
   修改logo    
   修复重新分配不出问题选择的bug    
   =============================20180809的修改==============================    
   去掉已通过的状态    
   删选个人信息的电话    
   添加问题和重新分配 当部品等位置为其他时， 描述为必填    
   楼栋详情的单选下拉组件替换成标签组件（验房管理员和数据报表均替换）    
   首页背景图去掉    
   =============================20180814的修改==============================    
   重新分配页面不能继续向下拉取数据的bug修复    
   施工单位 已处理 是 必须添加原因    
   =============================20180815的修改==============================    
   要求恢复验房管理员 batch-list的已确认 housedetail的已通过 orderdetail的通过按钮   
   维修管理员 施工单位的问题卡片上添加 '查看详情'的文字（geinaocankande）   
   =============================20180824的修改==============================    
   再次提出维修工程师和施工单位增加楼栋筛选的问题列表功能（增加了分页，滚动到底部自动加载新的数据