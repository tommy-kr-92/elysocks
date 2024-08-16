const express = require('express');
const UserModel = require('../models/UserModel');
const router = express.Router();

/* 관리자 생성 */
router.post('/create', async (req, res) => {
    try {
        /* adminModel 생성 */
        const user = new UserModel(req.body.data);

        /* 저장 */
        await user.save();

        /* 응답 */
        res.status(200).json({ message: '관리자 추가 완료' });
    } catch (error) {
        console.error('Error in create route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/* 아이디 중복 확인 */
router.post('/checkusername', async (req, res) => {
    try {
        const username = req.body.data;
        if (!username) {
            return res.status(400).json({ message: 'ID를 입력 후 눌러주세요' });
        }

        const existUsername = await UserModel.findOne(username);

        if (existUsername) {
            return res.status(200).json({ exists: true, message: '아이디가 존재합니다' });
        } else {
            return res.status(200).json({ exist: false, message: '사용 가능한 아이디입니다.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

/* 모든 회원 가져오기 */
router.post('/users', async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: '존재하는 회원이 없습니다' });
    }
});

/* 한 회원만 가져오기 */
router.post('/user', async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.data.userId);
        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: '회원이 존재하지 않습니다' });
    }
});

module.exports = router;
