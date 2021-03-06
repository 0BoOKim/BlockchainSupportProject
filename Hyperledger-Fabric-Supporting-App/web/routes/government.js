var express = require('express');
var router = express.Router();  
var session = require('express-session');
var channel3Query = require('../channel3.js');
var channel1Query = require('../channel1.js');
var channel4Query = require('../channel4.js');

router.get('/QueryVoucherUsageGov', async function(req, res){
    sess = req.session;
    if(sess.auth!=2){
        res.send('<script type="text/javascript">alert("권한이 없습니다.");location.href="/";</script>');
    }else{
        res.render('QueryVoucherUsageGov',{
            session: sess
        });
    }
})
router.post('/voucherUsage', async function(req, res){//바우처 내역 조회(블록)
    sess = req.session;
    if(sess.auth!=2){
        res.send('<script type="text/javascript">alert("권한이 없습니다.");location.href="/";</script>');
    }else{
        var params = [req.body.id1+req.body.id2]
        var voucherUsages = await channel1Query.query1('voucherUsage', params);
        var data = [];
        for(voucherUsage of voucherUsages){
            data.push(voucherUsage);
        }
        res.render('voucherUsage',{
            session: sess,
            data: data
        });
    }
});
// 피후원자 승인 & 피후원자 목록 공공기관에 넘겨주기
router.post('/approveAction', async function(req, res){//피후원자 승인
    sess = req.session;
    if(sess.auth!=2){
        res.send('<script type="text/javascript">alert("권한이 없습니다.");location.href="/";</script>');
    }else{
        var data = [];
        var jsn = JSON.parse(decodeURI(req.body.data));
        var params = [jsn.id, 'Y'];
        var newName = jsn.name[0]+'블록'
        var params2 = [newName, jsn.age, jsn.sex, jsn.id, jsn.address, jsn.job, jsn.story, 'Y']
        await channel4Query.query3('recipientNonIdent', params2);
        
        data = await channel3Query.approveRecipient('approveRecipient', params).then(async function(){
            var data=[];
            var recipients = await channel3Query.query1('queryAllRecipient');
                
            for(recipient of recipients){
                if (recipient.Record.status == 'N' || recipient.Record.status =='P')
                data.push(recipient);
            }
            res.render('approve',{
                check: 1,
                session: sess,
                data: data
            })
        })
    }
});
// 피후원자 보류
router.post('/pendingAction', async function(req, res){//피후원자 승인
    sess = req.session;
    if(sess.auth!=2){
        res.send('<script type="text/javascript">alert("권한이 없습니다.");location.href="/";</script>');
    }else{
        var data = [];
        
       var params = [req.body.recipientId, 'P', req.body.reason];
       data = await channel3Query.approveRecipient('pendingRecipient', params).then(async function(){
            var data=[];
            var recipients = await channel3Query.query1('queryAllRecipient');

            for(recipient of recipients){
                if (recipient.Record.status == 'N'|| recipient.Record.status == 'P')
                data.push(recipient);
            }
            res.render('approve',{
                check: 2,
                session: sess,
                data: data
            });
        });
       
    }
});
router.post('/CancelApprove', async function(req, res){//피후원자 승인
    sess = req.session;
    if(sess.auth!=2){
        res.send('<script type="text/javascript">alert("권한이 없습니다.");location.href="/";</script>');
    }else{
        var data = [];
        var params = [req.body.recipientId, 'N'];
        console.log(params);
        //var rid = req.body.recipientId;
	await channel4Query.query4('CancelApprove', params);
       data = await channel3Query.approveRecipient('CancelApprove', params).then(async function(){
            var data=[];
            var recipients = await channel3Query.query1('queryAllRecipient');

            for(recipient of recipients){
                if (recipient.Record.status == 'Y')
                data.push(recipient);
            }
            
            res.render('reci_query_result',{
                check: true,
                session: sess,
                data: data
            });
        });
    }
});
router.post('/showDetails', async function(req, res){//피후원자 승인
    sess = req.session;
    if(sess.auth!=2){
        res.send('<script type="text/javascript">alert("권한이 없습니다.");location.href="/";</script>');
    }else{
        var jsn = JSON.parse(decodeURI(req.body.data));
        jsn = jsn[0].Record;
        res.render('showDetails', {
            data: jsn,
            session: sess,
            check: 0
        })
    }
});
module.exports = router;
