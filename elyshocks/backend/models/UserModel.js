const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/* salt => bcrypt의 라운드 수 */
/* 보통 10~12 사이의 값을 많이 사용 */
/* 2의 10승 */
/* 
    10 => 10ms
    12 => 30ms
    14 => 160ms
*/
const SALT_WORK_FACTOR = 10;

const UserModel = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        birth: {
            type: String,
            require: true,
        },
        address: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        role: {
            type: String,
            lowercase: true,
            enum: ['admin', 'customer'],
        },
    },
    {
        timestamp: true,
    }
);

/* 비밀번호 해싱을 위한 pre-save 훅 */
/* adminModle이 save되기 전에 실행 */
UserModel.pre('save', async function (next) {
    /* 비밀번호가 수정되지 않았다면 다음 미들웨어로 진입 */
    if (!this.isModified('password')) return next();

    try {
        /* 솔트 생성 */
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        /* 비밀번호 해싱 */
        const hashedPassword = await bcrypt.hash(this.password, salt);
        /* 해싱된 비밀번호로 교체 */
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

/* 비밀번호 검증 메서드 */
UserModel.methods.comparePassword = async function (candidatePassword) {
    try {
        /* 비밀번호 비교 */
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};

module.exports = mongoose.model('User', UserModel);
