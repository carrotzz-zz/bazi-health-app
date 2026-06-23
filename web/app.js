// ==================== baziCalc ====================
var GAN=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var ZHI=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var WUXING_GAN={甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
var WUXING_ZHI={子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
var YINYANG_GAN={甲:'阳',乙:'阴',丙:'阳',丁:'阴',戊:'阳',己:'阴',庚:'阳',辛:'阴',壬:'阳',癸:'阴'};
var ZANGGAN={子:['癸'],丑:['己','癸','辛'],寅:['甲','丙','戊'],卯:['乙'],辰:['戊','乙','癸'],巳:['丙','戊','庚'],午:['丁','己'],未:['己','丁','乙'],申:['庚','壬','戊'],酉:['辛'],戌:['戊','辛','丁'],亥:['壬','甲']};
var JIEQI={1990:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,8,11,8,12,7,1,6],1991:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,9,11,8,12,7,1,6],1992:[2,4,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,6],1993:[2,4,3,5,4,5,5,5,6,6,7,7,8,7,9,7,10,8,11,7,12,7,1,5],1994:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,8,11,7,12,7,1,6],1995:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,9,11,8,12,7,1,6],1996:[2,4,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],1997:[2,4,3,5,4,5,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],1998:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,8,11,7,12,7,1,6],1999:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,9,11,8,12,7,1,6],2000:[2,4,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,6],2001:[2,4,3,5,4,5,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],2002:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,8,11,7,12,7,1,6],2003:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,9,11,8,12,7,1,6],2004:[2,4,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,6],2005:[2,4,3,5,4,5,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],2006:[2,4,3,6,4,5,5,5,6,6,7,7,8,7,9,8,10,8,11,7,12,7,1,6],2007:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,9,11,8,12,7,1,6],2008:[2,4,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,6],2009:[2,4,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],2010:[2,4,3,5,4,5,5,5,6,6,7,7,8,7,9,8,10,8,11,7,12,7,1,6],2011:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,8,11,8,12,7,1,6],2012:[2,4,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],2013:[2,4,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],2014:[2,4,3,6,4,5,5,5,6,6,7,7,8,7,9,8,10,8,11,7,12,7,1,6],2015:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,8,11,8,12,7,1,6],2016:[2,4,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,6],2017:[2,3,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],2018:[2,4,3,5,4,5,5,5,6,6,7,7,8,7,9,8,10,8,11,7,12,7,1,5],2019:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,8,11,8,12,7,1,6],2020:[2,4,3,5,4,4,5,5,6,5,7,6,8,7,9,7,10,8,11,7,12,7,1,6],2021:[2,3,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],2022:[2,4,3,5,4,5,5,5,6,6,7,7,8,7,9,8,10,8,11,7,12,7,1,5],2023:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,8,11,8,12,7,1,6],2024:[2,4,3,5,4,4,5,5,6,5,7,6,8,7,9,7,10,8,11,7,12,6,1,6],2025:[2,3,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],2026:[2,4,3,5,4,5,5,5,6,6,7,7,8,7,9,7,10,8,11,7,12,7,1,5],2027:[2,4,3,6,4,5,5,6,6,6,7,7,8,8,9,8,10,8,11,8,12,7,1,6],2028:[2,4,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,6],2029:[2,3,3,5,4,4,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,5],2030:[2,4,3,5,4,5,5,5,6,5,7,7,8,7,9,7,10,8,11,7,12,7,1,6]};
var JIE_TO_YUE_ZHI=[2,3,4,5,6,7,8,9,10,11,0,1];

function getJieqi(y,ji){
  var ey=ji===11?y+1:y;
  if(JIEQI[y]){var m=JIEQI[y][ji*2],d=JIEQI[y][ji*2+1];return[ey,m,d];}
  var nearest=y;
  for(var j=y-1;j>=1900;j--){if(JIEQI[j]){nearest=j;break;}}
  if(!JIEQI[nearest]){for(var k=y+1;k<=2030;k++){if(JIEQI[k]){nearest=k;break;}}}
  if(JIEQI[nearest]){return[ey,JIEQI[nearest][ji*2],JIEQI[nearest][ji*2+1]];}
  var approx=[[2,4],[3,6],[4,5],[5,5],[6,6],[7,7],[8,7],[9,8],[10,8],[11,7],[12,7],[1,6]];
  return[ey,approx[ji][0],approx[ji][1]];
}
function gregorianToJDN(y,m,d){
  var a=Math.floor((14-m)/12),yr=y+4800-a,mo=m+12*a-3;
  return d+Math.floor((153*mo+2)/5)+365*yr+Math.floor(yr/4)-Math.floor(yr/100)+Math.floor(yr/400)-32045;
}
function getDayGan(jdn){return(jdn+9)%10;}
function getDayZhi(jdn){return(jdn+1)%12;}
function getYearPillar(y,m,d){
  var lc=getJieqi(y,0),bl=(m<lc[1])||(m===lc[1]&&d<lc[2]);
  var by=bl?y-1:y;return{gan:(by-4)%10,zhi:(by-4)%12,year:by};
}
function getMonthPillar(y,m,d,yg){
  var yzi=-1;
  for(var j=0;j<12;j++){var jq=getJieqi(y,j);if(new Date(y,m-1,d)>=new Date(jq[0],jq[1]-1,jq[2]))yzi=JIE_TO_YUE_ZHI[j];}
  if(yzi===-1){var xh=getJieqi(y-1,11);yzi=new Date(y,m-1,d)>=new Date(xh[0],xh[1]-1,xh[2])?1:0;}
  yg=((yg%10)+10)%10;var yy=((yg%5)*2+2)%10,offset=(yzi-2+12)%12;
  return{gan:(yy+offset)%10,zhi:yzi};
}
function getHourPillar(h,dg){
  var zidx=Math.floor(((h+1)%24)/2),zsg=((dg%5)*2)%10;
  return{gan:(zsg+zidx)%10,zhi:zidx};
}
function getTenGods(dg,og){
  var wxd=WUXING_GAN[GAN[dg]],wxo=WUXING_GAN[GAN[og]];
  var syy=(YINYANG_GAN[GAN[dg]]==='阳')===(YINYANG_GAN[GAN[og]]==='阳');
  var rm={'木木':'同','火火':'同','土土':'同','金金':'同','水水':'同','木火':'生','火土':'生','土金':'生','金水':'生','水木':'生','木土':'克','火金':'克','土水':'克','金木':'克','水火':'克'};
  var rel=rm[wxd+wxo];
  if(rel==='同')return syy?'比肩':'劫财';
  if(rel==='生')return syy?'食神':'伤官';
  var rev=rm[wxo+wxd];
  if(rev==='生')return syy?'偏印':'正印';
  if(rev==='克')return syy?'七杀':'正官';
  return syy?'偏财':'正财';
}
function baziCalc(evt){
  var y=evt.year,m=evt.month,d=evt.day,h=evt.hour,min=evt.minute||0,g=evt.gender;
  var jdn=gregorianToJDN(y,m,d),dg=getDayGan(jdn),dz=getDayZhi(jdn);
  var yp=getYearPillar(y,m,d),lc=getJieqi(y,0),bl=(m<lc[1])||(m===lc[1]&&d<lc[2]);
  var efg=bl?((y-5)%10+10)%10:yp.gan;
  var mpf=getMonthPillar(y,m,d,efg),hp=getHourPillar(h,dg);
  var pillars=[{name:'年',gan:yp.gan,zhi:yp.zhi},{name:'月',gan:mpf.gan,zhi:mpf.zhi},{name:'日',gan:dg,zhi:dz},{name:'时',gan:hp.gan,zhi:hp.zhi}];
  pillars.forEach(function(p){
    p.tenGod=getTenGods(dg,p.gan);
    var zgf=ZANGGAN[ZHI[p.zhi]]?ZANGGAN[ZHI[p.zhi]][0]:null;
    p.tenGodZhi=zgf?getTenGods(dg,GAN.indexOf(zgf)):'';
    p.wuxingGan=WUXING_GAN[GAN[p.gan]];p.wuxingZhi=WUXING_ZHI[ZHI[p.zhi]];
    p.zangGan=ZANGGAN[ZHI[p.zhi]];
  });
  var ygy=YINYANG_GAN[GAN[yp.gan]]==='阳',isM=g==='男';
  var fwd=(isM&&ygy)||(!isM&&!ygy),cji=(mpf.zhi-2+12)%12,daysToJie;
  if(fwd){var nji=(cji+1)%12,nj=getJieqi(y,nji);if(nji===0)nj=getJieqi(y+1,0);daysToJie=Math.round((new Date(nj[0],nj[1]-1,nj[2])-new Date(y,m-1,d))/86400000);}
  else{var pj=getJieqi(y,cji);daysToJie=Math.round((new Date(y,m-1,d)-new Date(pj[0],pj[1]-1,pj[2]))/86400000);}
  var sa=Math.round(daysToJie/3),dys=[],cg=mpf.gan,cz=mpf.zhi;
  for(var iw=0;iw<8;iw++){if(fwd){cg=(cg+1)%10;cz=(cz+1)%12;}else{cg=(cg-1+10)%10;cz=(cz-1+12)%12;}dys.push({gan:GAN[cg],zhi:ZHI[cz],startAge:sa+iw*10,startYear:y+sa+iw*10,endYear:y+sa+iw*10+9});}
  var dgzi=0;for(var ix=0;ix<60;ix++){if(ix%10===dg&&ix%12===dz){dgzi=ix;break;}}
  var kwm=[[10,11],[8,9],[6,7],[4,5],[2,3],[0,1]],kw=kwm[Math.floor(dgzi/10)%6];
  var dwx=WUXING_GAN[GAN[dg]],wc={木:0,火:0,土:0,金:0,水:0};
  pillars.forEach(function(p){wc[p.wuxingGan]=(wc[p.wuxingGan]||0)+1;wc[p.wuxingZhi]=(wc[p.wuxingZhi]||0)+1;});
  return{
    bazi:[{gan:GAN[yp.gan],zhi:ZHI[yp.zhi],tenGod:pillars[0].tenGod,wuxing:pillars[0].wuxingGan},{gan:GAN[mpf.gan],zhi:ZHI[mpf.zhi],tenGod:pillars[1].tenGod,wuxing:pillars[1].wuxingGan},{gan:GAN[dg],zhi:ZHI[dz],tenGod:'日主',wuxing:dwx},{gan:GAN[hp.gan],zhi:ZHI[hp.zhi],tenGod:pillars[3].tenGod,wuxing:pillars[3].wuxingGan}],
    dayMaster:{gan:GAN[dg],zhi:ZHI[dz],wuxing:dwx},daYun:dys,startAge:sa,kongWang:kw.map(function(i){return ZHI[i];}),wuxingRatio:wc,dayGanZhiIndex:dgzi,
    _raw:{pillars:pillars,dayGan:dg,dayZhi:dz,yearGan:yp.gan,yearZhi:yp.zhi,monthGan:mpf.gan,monthZhi:mpf.zhi,hourGan:hp.gan,hourZhi:hp.zhi,dayGanZhiIndex:dgzi,kongWangZhi:kw,daYunRaw:{startAge:sa,dayuns:dys,forward:fwd}}
  };
}

// ==================== emotionEngine ====================
var MONTH_QI={甲:[2,2,1,0,0,-1,-2,-2,-1,1,1,0],乙:[2,2,1,0,0,-1,-2,-2,-1,1,1,0],丙:[1,1,0,2,2,1,-1,-1,-2,-2,-2,-1],丁:[1,1,0,2,2,1,-1,-1,-2,-2,-2,-1],戊:[-1,-1,2,1,1,2,0,0,2,-1,-1,2],己:[-1,-1,2,1,1,2,0,0,2,-1,-1,2],庚:[-2,-2,1,-1,-1,0,2,2,1,0,0,-1],辛:[-2,-2,1,-1,-1,0,2,2,1,0,0,-1],壬:[0,0,-1,-2,-2,-1,1,1,-1,2,2,1],癸:[0,0,-1,-2,-2,-1,1,1,-1,2,2,1]};
var CHONG={子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
var HE={'子丑':true,'丑子':true,'寅亥':true,'亥寅':true,'卯戌':true,'戌卯':true,'辰酉':true,'酉辰':true,'巳申':true,'申巳':true,'午未':true,'未午':true};
var XING={'子卯':true,'卯子':true,'寅巳':true,'巳申':true,'申寅':true,'丑戌':true,'戌未':true,'未丑':true};
var ZI_XING=['辰','午','酉','亥'];
var HAI={'子未':true,'未子':true,'丑午':true,'午丑':true,'寅巳':true,'巳寅':true,'卯辰':true,'辰卯':true,'申亥':true,'亥申':true,'酉戌':true,'戌酉':true};
var ZG={'子':'癸','丑':'己','寅':'甲','卯':'乙','辰':'戊','巳':'丙','午':'丁','未':'己','申':'庚','酉':'辛','戌':'戊','亥':'壬'};
var QUOTES={怒:[{classical:'知其不可奈何而安之若命',modern:'有些事改变不了，先和它待一会儿'},{classical:'水善利万物而不争',modern:'水的力量不是硬碰硬，是绕过去'},{classical:'安时而处顺，哀乐不能入也',modern:'顺着日子过，大的情绪波动就进不来'}],喜不足:[{classical:'天地有大美而不言',modern:'好东西安安静静在那里，你得自己去看'},{classical:'知足者富',modern:'觉得自己够了的人，才是真的富'}],思:[{classical:'少则得，多则惑',modern:'想得少反而抓住重点，想太多反而乱'},{classical:'知止不殆',modern:'知道什么时候该停，才不会把自己耗干'}],悲:[{classical:'物来则应，过去不留',modern:'东西来了接住，过去了就松手'},{classical:'飘风不终朝，骤雨不终日',modern:'再大的风也刮不了一整天'}],恐:[{classical:'不怕念起，只怕觉迟',modern:'冒出害怕是正常的，能察觉到就不算晚'},{classical:'上善若水',modern:'最好的状态像水，该流就流，该停就停'}],通用:[{classical:'大道至简',modern:'最根本的道理都不复杂'},{classical:'朴素而天下莫能与之争美',modern:'简简单单就很好，不用跟谁比'}]};

function _getTenGod(dg,og){
  var wxd=WUXING_GAN[GAN[dg]],wxo=WUXING_GAN[GAN[og]],syy=YINYANG_GAN[GAN[dg]]===YINYANG_GAN[GAN[og]];
  var rm={'木木':'同','火火':'同','土土':'同','金金':'同','水水':'同','木火':'生','火土':'生','土金':'生','金水':'生','水木':'生','木土':'克','火金':'克','土水':'克','金木':'克','水火':'克'};
  var rel=rm[wxd+wxo];
  if(rel==='同')return syy?'比肩':'劫财';
  if(rel==='生')return syy?'食神':'伤官';
  var rev=rm[wxo+wxd];
  if(rev==='生')return syy?'偏印':'正印';
  if(rev==='克')return syy?'七杀':'正官';
  return syy?'偏财':'正财';
}
function qiToWeight(q){if(q>=2)return 1.5;if(q===1)return 1.2;if(q===0)return 1;if(q===-1)return 0.7;return 0.5;}
function checkBI(lrz,bzs){
  for(var i=0;i<bzs.length;i++){if(CHONG[lrz]===bzs[i])return{type:'冲',weight:i===2?1.5:1.3,desc:i===2?'心里不太平，坐不住，有点烦躁':'隐隐不安，说不上来哪里不对'};}
  for(var i=0;i<bzs.length;i++){if(HE[lrz+bzs[i]])return{type:'合',weight:0.8,desc:'心里顺畅，有被接住的感觉'};}
  if(ZI_XING.indexOf(lrz)>=0){if(bzs.filter(function(z){return z===lrz;}).length>0)return{type:'刑',weight:1.4,desc:'自己跟自己较劲，对自己温柔点'};}
  for(var i=0;i<bzs.length;i++){if(XING[lrz+bzs[i]])return{type:'刑',weight:1.2,desc:'有点小摩擦，别往心里去'};}
  for(var i=0;i<bzs.length;i++){if(HAI[lrz+bzs[i]])return{type:'害',weight:1.1,desc:'说不清的别扭，不用细想'};}
  return{type:'none',weight:1,desc:''};
}
function emotionCalc(bd,y,m,d){
  var raw=bd._raw,dg=raw.dayGan;
  var jdn=gregorianToJDN(y,m,d),lrg=(jdn+9)%10,lrz=ZHI[(jdn+1)%12];
  var mtg=_getTenGod(dg,lrg),auxG=GAN.indexOf(ZG[lrz]),atg=auxG>=0?_getTenGod(dg,auxG):mtg;
  var qv=MONTH_QI[WUXING_GAN[GAN[lrg]]]?MONTH_QI[WUXING_GAN[GAN[lrg]]][m-1]:0;
  var bzs=[raw.yearZhi,raw.monthZhi,raw.dayZhi,raw.hourZhi].map(function(z){return ZHI[z];});
  var inter=checkBI(lrz,bzs),kw=bd.kongWang.indexOf(lrz)>=0;
  var moods={正印:'今天心里比较静，适合一个人待着，不急不赶。',偏印:'今天想一个人待着，别逼自己社交。',七杀:'今天容易有人跟你过不去，退一步不丢人。',正官:'今天责任感比较重，你已经够努力了，别太绷着。',食神:'今天轻松，适合吃好的。',伤官:'今天脑子灵光，想法多，写下来比说出来好。',正财:'今天是踏实做事的好日子。',偏财:'今天可能有新想法，先掂量再动手。',比肩:'今天是自己的主场，专注自己。',劫财:'今天社交可能会消耗精力，不想去的可以不去。'};
  var base=moods[mtg]||'今天按自己的节奏走。',ed;
  if(inter.type==='冲'&&inter.weight>=1.4)ed='今天心里不太平，坐不住。'+base.replace(/。/,'，')+'可能会有点烦躁，不是什么大事，过去了就好。';
  else if(inter.type==='冲')ed=base.replace(/。$/,'。')+'但可能会有点说不上来的不踏实，不是什么大事，别细想。';
  else if(inter.type==='合')ed=base.replace(/。$/,'。')+'心里顺畅，有被接住的感觉。';
  else if(inter.type==='刑')ed=base.replace(/。$/,'。')+'但容易跟自己较劲，对自己温柔点。';
  else if(kw)ed='今天做什么都觉得差口气，不是你的问题。'+base;
  else ed=base;
  var stMap={正印:'上午9点到11点精神最好，重要的事放这时。',偏印:'晚上7点到9点脑子最静，适合给自己一点独处时间。',比肩:'上午7点到9点精力最旺，趁早把想做的事干了。',劫财:'下午3点到5点效率最高，别在上午磨叽。',食神:'中午11点到1点心情最好，适合吃顿好的犒劳自己。',伤官:'上午9点到11点思路最清，有想法赶紧记下来。',正财:'上午9点到11点头脑清醒，适合处理钱和数字。',偏财:'下午1点到3点灵光乍现，适合琢磨新方向。',正官:'上午7点到9点状态最到位，先啃硬骨头。',七杀:'下午5点到7点体力回升，适合出去走走散散心。'};
  var st=stMap[mtg]||'按自己节奏来，身体知道什么时候该做什么。';
  var sm={正官:'思',七杀:'怒',正印:'思',偏印:'思',正财:'通用',偏财:'通用',食神:'喜不足',伤官:'怒',比肩:'通用',劫财:'思'};
  var pool=QUOTES[sm[mtg]]||QUOTES['通用'],qt=pool[Math.floor(Math.random()*pool.length)];
  var tm={合:'今天顺畅，享受就好。',冲:'今天这点动荡，过去了就好了。',刑:'今天这个坎是自己给自己设的，松开就好。',害:'这点不对劲不用细想，明天就好。'};
  return{dayPillar:GAN[lrg]+lrz,emotionDesc:ed,shichenTip:st,quote:{classical:qt.classical,modern:qt.modern,tieToToday:tm[inter.type]||'今天就是这样，来了就接着，过了就放下。'},mainTenGod:mtg,interaction:inter,qiWeight:qiToWeight(qv)};
}

// ==================== 天气 ====================
var WMAP={0:'晴',1:'晴',2:'多云',3:'阴',45:'雾',48:'雾',51:'小雨',53:'小雨',55:'中雨',61:'小雨',63:'中雨',65:'大雨',71:'小雪',73:'中雪',75:'大雪',80:'阵雨',81:'阵雨',82:'暴雨',95:'雷阵雨',96:'雷暴+冰雹',99:'强雷暴'};
var EMAP={晴:'☀️',多云:'⛅',阴:'☁️',雾:'🌫️',小雨:'🌧️',中雨:'🌧️',大雨:'🌧️',暴雨:'🌧️⛈️',小雪:'❄️',中雪:'❄️',大雪:'❄️',阵雨:'🌦️',雷阵雨:'🌩️','雷暴+冰雹':'🌩️',强雷暴:'🌩️'};
var TAG10={正印:'宜独处',偏印:'宜独处',七杀:'有压力',正官:'有责任感',食神:'轻松',伤官:'思绪多',正财:'宜务实',偏财:'有新机',比肩:'做自己',劫财:'社交消耗'};

function weatherClass(w){
  var map={晴:'sunny',多云:'cloudy',阴:'overcast',雾:'fog',小雨:'rain',中雨:'rain',大雨:'rain',暴雨:'storm',阵雨:'shower',雷阵雨:'thunder','雷暴+冰雹':'thunder',强雷暴:'thunder',小雪:'snow',中雪:'snow',大雪:'snow'};
  return map[w]||'cloudy';
}

function buildFallbackWeather(today){
  var month=today.getMonth()+1;
  var weatherPool;
  if(month>=5&&month<=8)weatherPool=['阵雨','多云','雷阵雨','晴','小雨','多云','晴'];
  else if(month>=3&&month<=4)weatherPool=['小雨','阴','多云','阵雨','多云','小雨','晴'];
  else if(month>=9&&month<=11)weatherPool=['晴','多云','晴','多云','阴','晴','多云'];
  else weatherPool=['多云','阴','小雨','多云','晴','多云','阴'];
  var baseTemp;
  if(month>=6&&month<=8)baseTemp=32;
  else if(month>=3&&month<=5)baseTemp=26;
  else if(month>=9&&month<=11)baseTemp=24;
  else baseTemp=15;
  var hourTemps=[22,22,22,22,22,23,25,27,29,30,31,32,33,33,32,31,30,29,28,27,26,25,24,23];
  var hourly=[];
  for(var i=0;i<24;i++){
    var w=i>=6&&i<=18?'晴':'多云';
    hourly.push({hour:i,temp:hourTemps[i],weather:w,emoji:EMAP[w]||'🌤️'});
  }
  var dailyList=[];
  for(var j=0;j<7;j++){
    var w=weatherPool[j];
    var variation=Math.round((Math.random()-0.5)*4);
    var maxT=baseTemp+j+variation;
    var minT=maxT-5-Math.floor(Math.random()*4);
    dailyList.push({weather:w,emoji:EMAP[w]||'🌤️',wxClass:weatherClass(w),maxTemp:maxT,minTemp:minT});
  }
  console.log('[weather] fallback: '+dailyList.map(function(d){return d.weather+d.maxTemp+'°';}).join(', '));
  return{hourly:hourly,dailyList:dailyList};
}

function fetchWeather(lat,lon){
  var u='https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FShanghai&forecast_days=7';
  return fetch(u).then(function(r){return r.json();}).then(function(res){
    if(!res||!res.daily||!res.daily.time){
      console.warn('[weather] unexpected format, fallback');
      return buildFallbackWeather(new Date());
    }
    var h=res.hourly,d=res.daily,hourly=[],dailyList=[];
    var hc=Math.min((h&&h.time?h.time.length:0),24);
    for(var i=0;i<hc;i++){var w=WMAP[h.weathercode[i]]||'多云';hourly.push({hour:i,temp:Math.round(h.temperature_2m[i]),weather:w,emoji:EMAP[w]||'🌤️'});}
    var apiDays=d.time.length;
    for(var j=0;j<Math.min(apiDays,7);j++){var dw=WMAP[d.weathercode[j]]||'多云';dailyList.push({weather:dw,emoji:EMAP[dw]||'🌤️',wxClass:weatherClass(dw),maxTemp:Math.round(d.temperature_2m_max[j]),minTemp:Math.round(d.temperature_2m_min[j])});}
    console.log('[weather] API OK, got '+apiDays+' days, parsed '+dailyList.length);
    return{hourly:hourly,dailyList:dailyList};
  }).catch(function(e){
    console.warn('[weather] fetch fail: '+e);
    return buildFallbackWeather(new Date());
  });
}

function getClothing(temp,weather){
  var base;
  if(temp>=30)base='轻薄透气';
  else if(temp>=22)base='薄衫出门';
  else if(temp>=14)base='薄外套刚好';
  else if(temp>=5)base='毛衣加外套';
  else base='穿暖和些';
  var twist='';
  if(weather==='小雨'||weather==='中雨'||weather==='大雨'||weather==='阵雨'||weather==='暴雨')twist='，带把伞，别淋着';
  else if(weather==='晴'&&temp>=28)twist='，太阳大，戴个帽子';
  else if(weather==='阴')twist='，天阴有风，脖子别受凉';
  else if(weather==='雾')twist='，雾天出门慢一点';
  else twist='，舒舒服服出门';
  return base+twist;
}

function getRecommendation(month,temp,weather,mainTenGod){
  var base;
  if(month>=5&&month<=7)base='暑天心火旺，午饭后歇一刻钟，比喝凉茶管用。';
  else if(month>=2&&month<=4)base='春天养肝，少生气多舒展，出门走走。';
  else if(month>=9&&month<=11)base='秋天容易感伤，多出门晒晒太阳。';
  else if(month===12||month===1)base='冬天养藏，别太消耗自己，早点睡。';
  else base='喝杯温水，缓一缓。';
  var twist='';
  if(weather==='小雨'||weather==='中雨'||weather==='大雨'||weather==='阵雨'||weather==='雷阵雨')twist='下雨天闷，';
  else if(weather==='晴')twist=temp>=32?'天热，':(temp>=26?'天气不错，':'天凉，');
  else if(weather==='阴')twist='阴天容易闷，';
  else if(weather==='多云')twist='云多不晒，';
  else twist='';
  var tg='';
  if(mainTenGod==='正印'||mainTenGod==='偏印')tg='适合放慢节奏。';
  else if(mainTenGod==='七杀'||mainTenGod==='正官')tg='别给自己加太多压力。';
  else if(mainTenGod==='食神'||mainTenGod==='伤官')tg='有灵感就记下来。';
  else if(mainTenGod==='比肩'||mainTenGod==='劫财')tg='按自己的节奏来。';
  else tg='不急不躁就好。';
  return twist+tg;
}

// ==================== 应用 ====================
var state={baziData:null,daysData:[],weekForecast:[],activeIndex:0,weatherData:null};
var locFetchPromise=null;

function $(id){return document.getElementById(id);}
function toast(msg){var t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show');},1500);}

function setGender(g){
  $('genderM').classList.toggle('active',g==='男');
  $('genderF').classList.toggle('active',g==='女');
}

function switchPage(name){
  var cp=$('cardPage'),sp=$('setupPage');
  if(name==='card'){
    cp.classList.remove('hide');cp.classList.add('in');
    sp.classList.add('hide');sp.classList.remove('in');
  }else{
    sp.classList.remove('hide');sp.classList.add('in');
    cp.classList.add('hide');cp.classList.remove('in');
  }
}
function showSetup(){
  switchPage('setup');
  var p=loadProfile();if(p){
    $('birthDate').value=p.year+'-'+String(p.month).padStart(2,'0')+'-'+String(p.day).padStart(2,'0');
    $('birthTime').value=String(p.hour).padStart(2,'0')+':'+String(p.minute||0).padStart(2,'0');
    setGender(p.gender);
  }
  var loc=getSavedLocation();
  if(loc){
    $('cityInput').value=loc.name||'';
    $('locationStatus').textContent='✓ 已保存: '+loc.name;
    $('locationStatus').className='location-status ok';
  }
}
function showCard(){switchPage('card');}

function loadProfile(){
  try{var d=localStorage.getItem('bazi_profile');return d?JSON.parse(d):null;}catch(e){return null;}
}

function saveProfile(){
  var d=$('birthDate').value,t=$('birthTime').value;
  if(!d){toast('请选择出生日期');return;}
  var parts=d.split('-'),y=parseInt(parts[0]),m=parseInt(parts[1]),dd=parseInt(parts[2]);
  var tp=t.split(':'),h=parseInt(tp[0]),min=parseInt(tp[1]||'0');
  var g=$('genderM').classList.contains('active')?'男':'女';
  var profile={year:y,month:m,day:dd,hour:h,minute:min,gender:g};
  localStorage.setItem('bazi_profile',JSON.stringify(profile));
  var scores=getQuizScores();localStorage.setItem('bazi_quiz',JSON.stringify(scores));
  state.baziData=baziCalc(profile);
  var done=function(){
    $('savedMsg').style.display='block';
    setTimeout(function(){$('savedMsg').style.display='none';},1200);
    showCard();loadCard();
  };
  if(locFetchPromise){
    locFetchPromise.then(done).catch(done);
  }else{
    done();
  }
}

function loadCard(){
  var profile=loadProfile();
  if(!profile){
    $('loadingView').style.display='flex';
    $('emptyState').style.display='none';
    $('cardView').style.display='none';
    return;
  }
  state.baziData=state.baziData||baziCalc(profile);
  $('loadingView').style.display='flex';
  $('emptyState').style.display='none';
  $('cardView').style.display='none';

  var now=new Date();
  getLocation().then(function(ll){
    return fetchWeather(ll.lat,ll.lon);
  }).then(function(wx){
    state.weatherData=wx;
    state.daysData=[];state.weekForecast=[];
    var wd=['日','一','二','三','四','五','六'],dn=['今天','明天','后天'];
    for(var i=0;i<7;i++){
      var dt=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);
      var em=emotionCalc(state.baziData,dt.getFullYear(),dt.getMonth()+1,dt.getDate());
      var wxd=wx.dailyList[i]||wx.dailyList[0];
      var mon=dt.getMonth()+1;
      state.daysData.push({
        dateStr:mon+'月'+dt.getDate()+'日 周'+wd[dt.getDay()],
        weather:wxd,dayPillar:em.dayPillar,emotionDesc:em.emotionDesc,
        shichenTip:em.shichenTip,
        clothing:getClothing(wxd.maxTemp,wxd.weather),
        recommendation:getRecommendation(mon,wxd.maxTemp,wxd.weather,em.mainTenGod),
        quote:em.quote
      });
      var label=dn[i]||'周'+wd[dt.getDay()];
      state.weekForecast.push({
        index:i,label:label,dateCompact:mon+'/'+dt.getDate(),
        dayPillar:em.dayPillar,emoji:wxd.emoji,
        temp:wxd.minTemp+'°~'+wxd.maxTemp+'°',
        moodTag:TAG10[em.mainTenGod]||'稳定'
      });
    }
    state.activeIndex=0;
    $('loadingView').style.display='none';
    $('cardView').style.display='block';
    renderCard(0);
  }).catch(function(e){
    console.error(e);
    $('loadingView').style.display='none';
    toast('请先在设置页选择城市位置');
    setTimeout(function(){showSetup();},1800);
  });
}

function getSavedLocation(){
  try{var d=localStorage.getItem('bazi_location');return d?JSON.parse(d):null;}catch(e){return null;}
}
function saveLocation(name,lat,lon){
  localStorage.setItem('bazi_location',JSON.stringify({name:name,lat:lat,lon:lon}));
  $('locationStatus').textContent='✓ 已保存: '+name;
  $('locationStatus').className='location-status ok';
}
function onCityChange(){
  var val=$('cityInput').value.trim();
  if(!val)return;
  $('locationStatus').textContent='查询坐标中...';
  $('locationStatus').className='location-status';
  locFetchPromise=fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(val)+'&count=1&language=zh')
  .then(function(r){return r.json();}).then(function(data){
    if(!data.results||!data.results.length){toast('未找到该城市，换个名字试试');$('locationStatus').textContent='';return;}
    var r=data.results[0];
    saveLocation(val,r.latitude,r.longitude);
  }).catch(function(e){toast('查询失败，请检查网络');$('locationStatus').textContent='';});
}
function getLocation(){
  return new Promise(function(resolve,reject){
    var saved=getSavedLocation();
    if(saved){console.log('[location] using saved: '+saved.name);resolve({lat:saved.lat,lon:saved.lon});return;}
    reject(new Error('未设置城市位置'));
  });
}

function renderCard(idx){
  var cd=state.daysData[idx];
  if(!cd)return;
  $('dateStr').textContent=cd.dateStr;
  $('weatherBlock').className='weather-block wx-'+cd.weather.wxClass;
  $('weatherIcon').textContent=cd.weather.emoji;
  $('weatherTemp').textContent=cd.weather.minTemp+'° ~ '+cd.weather.maxTemp+'°';
  $('weatherDesc').textContent=cd.weather.weather;
  $('emotionDesc').textContent=cd.emotionDesc;
  $('shichenTip').textContent=cd.shichenTip;
  $('clothing').textContent=cd.clothing;
  $('recommendation').textContent=cd.recommendation;
  $('quoteClassical').textContent=cd.quote.classical;
  $('quoteModern').textContent=cd.quote.modern;
  $('quoteTie').textContent='今天也是，'+cd.quote.tieToToday;

  var wx=state.weatherData,hh='';
  if(wx&&wx.hourly){
    for(var i=0;i<24;i++){var h=wx.hourly[i];hh+='<div class="hourly-item"><text class="hour-label">'+h.hour+':00</text><text class="hour-emoji">'+h.emoji+'</text><text class="hour-temp">'+h.temp+'°</text></div>';}
  }
  $('hourlyList').innerHTML=hh;

  var wh='';
  for(var j=0;j<state.weekForecast.length;j++){
    var wf=state.weekForecast[j],act=j===idx?' week-today':'',at=j===idx?' tag-active':'';
    wh+='<div class="week-item'+act+'" onclick="onDayTap('+j+')"><text class="week-label">'+wf.label+'</text><text class="week-date">'+wf.dateCompact+'</text><text class="week-emoji">'+wf.emoji+'</text><text class="week-temp">'+wf.temp+'</text><text class="week-pillar">'+wf.dayPillar+'</text><text class="week-tag'+at+'">'+wf.moodTag+'</text></div>';
  }
  $('weekList').innerHTML=wh;
}

function onDayTap(idx){
  if(idx===state.activeIndex)return;
  state.activeIndex=idx;
  renderCard(idx);
}

// ==================== 体质问卷 ====================
var CONST_GROUPS=[
  {key:'平和质',label:'😊 平和相关',questions:[{key:'ph1',text:'您精力充沛，很少感到疲劳吗？'},{key:'ph2',text:'您面色红润、气色好吗？'},{key:'ph3',text:'您睡眠质量好吗？很少失眠？'},{key:'ph4',text:'您适应能力（换季、出差等）强吗？'}]},
  {key:'气虚质',label:'😮‍💨 气虚相关',questions:[{key:'qx1',text:'您容易疲乏、总想休息吗？'},{key:'qx2',text:'您说话声音低弱无力吗？'},{key:'qx3',text:'您稍微活动就容易出汗吗？'}]},
  {key:'阳虚质',label:'🥶 阳虚相关',questions:[{key:'yx1',text:'您比别人怕冷、手脚发凉吗？'},{key:'yx2',text:'您吃凉的或生冷食物肠胃会不舒服吗？'},{key:'yx3',text:'您冬天比别人穿得多还是觉得冷吗？'}]},
  {key:'阴虚质',label:'🔥 阴虚相关',questions:[{key:'yinx1',text:'您手心脚心发热、下午容易潮热吗？'},{key:'yinx2',text:'您口干舌燥、总想喝水吗？'},{key:'yinx3',text:'您大便干结、容易便秘吗？'}]},
  {key:'痰湿质',label:'💨 痰湿相关',questions:[{key:'ts1',text:'您感觉身体沉重、像裹了湿布一样不爽快吗？'},{key:'ts2',text:'您腹部松软、比同龄人容易发胖吗？'},{key:'ts3',text:'您嗓子总觉得有痰或黏腻感吗？'}]},
  {key:'湿热质',label:'🌡 湿热相关',questions:[{key:'sr1',text:'您面部或头发容易出油吗？'},{key:'sr2',text:'您口苦、口臭或口腔有异味吗？'},{key:'sr3',text:'您大便粘滞、冲不干净马桶吗？'}]},
  {key:'血瘀质',label:'🩸 血瘀相关',questions:[{key:'xyu1',text:'您身上容易出现瘀斑（青一块紫一块）吗？'},{key:'xyu2',text:'您面色或口唇偏暗、没有光泽吗？'},{key:'xyu3',text:'您身体某处有固定的刺痛感吗？'}]},
  {key:'气郁质',label:'😔 气郁相关',questions:[{key:'qy1',text:'您经常觉得闷闷不乐、情绪低落吗？'},{key:'qy2',text:'您容易紧张、焦虑不安吗？'},{key:'qy3',text:'您两胁胀痛或乳房胀痛吗（与情绪相关）？'}]},
  {key:'特禀质',label:'🤧 特禀相关',questions:[{key:'tb1',text:'您容易过敏（药物、食物、花粉等）吗？'},{key:'tb2',text:'您有过敏性鼻炎、哮喘或皮肤荨麻疹吗？'},{key:'tb3',text:'您换季或换环境时容易打喷嚏、流鼻涕吗？'}]},
];

function renderQuiz(){
  var html='';
  CONST_GROUPS.forEach(function(g){
    html+='<div class="group-head"><text>'+g.label+'</text></div>';
    g.questions.forEach(function(q){
      html+='<div class="question"><text class="q-text">'+q.text+'</text><div class="q-slider-row"><text>1</text><input type="range" min="1" max="5" value="1" id="s_'+q.key+'" oninput="updateSlider(this)"><text class="q-slider-val" id="v_'+q.key+'">1</text></div></div>';
    });
  });
  $('quizContent').innerHTML=html;
}

function updateSlider(s){var vid=$('v_'+s.id.replace('s_',''));if(vid)vid.textContent=s.value;}
function toggleQuiz(){var sec=$('quizSection'),arr=$('quizArrow');sec.classList.toggle('open');arr.textContent=sec.classList.contains('open')?'▾':'▸';}
function getQuizScores(){
  var scores={};
  CONST_GROUPS.forEach(function(g){g.questions.forEach(function(q){var el=$('s_'+q.key);scores[q.key]=el?parseInt(el.value):1;});});
  return scores;
}
function restoreQuiz(scores){
  if(!scores)return;
  CONST_GROUPS.forEach(function(g){g.questions.forEach(function(q){var s=$('s_'+q.key),v=$('v_'+q.key);if(s&&scores[q.key]){s.value=scores[q.key];if(v)v.textContent=scores[q.key];}});});
}

// ==================== 启动 ====================
(function init(){
  renderQuiz();
  var p=loadProfile();
  if(p){setGender(p.gender);showCard();loadCard();}
  else{showSetup();setGender('男');}
  try{var s=JSON.parse(localStorage.getItem('bazi_quiz')||'{}');restoreQuiz(s);}catch(e){}
})();
