<!--
 * @Author: 九天
 * @Date: 2021-06-03 16:55:00
 * @LastEditTime: 2021-06-04 10:17:00
 * @LastEditors: Please set LastEditors
 * @Description: 登录页
 * @FilePath: \dailishang\src\views\Login\index.vue
-->
<template>
    <div class="ui-login-box">
        <div class="ui-login">
            <div class="ui-login-logo">
                <img :src="login_img" alt="" />
            </div>
            <el-form
                v-show="login_show" ref="loginForm"
                :model="loginForm"
                class="ui-login-form"
                :rules="rules">
                <el-form-item prop="userPhone">
                    <el-input v-model="loginForm.userPhone" placeholder="请输入手机号">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        v-model="loginForm.password" type="password"
                        placeholder="请输入密码">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        <i slot="suffix" class="el-input__icon el-icon-date"></i>
                    </el-input>
                </el-form-item>
                <p class="ui-forget" @click="login_show = false">
                    忘记密码
                </p>
                <el-form-item>
                    <el-button
                        :loading="submitTagLogin" type="primary"
                        class="ui-login-btn" @click="handleSubmitLogin">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
            <!-- 找回密码 -->
            <el-form
                v-show="!login_show"
                ref="retrieveForm" :rules="retrieveRules"
                :model="retrieveForm"
                class="ui-retrieve-form">
                <el-form-item prop="userPhone">
                    <el-input v-model="retrieveForm.userPhone" placeholder="请输入注册手机号" />
                </el-form-item>
                <el-form-item class="ui-code-item" prop="imgCode">
                    <el-input v-model="retrieveForm.imgCode" placeholder="请输入右边验证码" />
                    <img :src="login_img" alt="" />
                </el-form-item>
                <el-form-item class="ui-code-btn-item" prop="phoneCode">
                    <el-input v-model="retrieveForm.phoneCode" placeholder="请输入手机验证码" />
                    <el-button plain>
                        获取验证码
                    </el-button>
                </el-form-item>
                <el-form-item
                    :rules="retrieveRules.newPassword" class="ui-password-item"
                    prop="newPasswordOne">
                    <el-input
                        v-model="retrieveForm.newPasswordOne" type="password"
                        placeholder="请输入新的登录密码">
                        <i slot="suffix" class="el-input__icon el-icon-date"></i>
                    </el-input>
                    <p class="ui-hint">
                        提示：密码8-16位，必须含有：英文、数字、区分大小写
                    </p>
                </el-form-item>
                <el-form-item
                    :rules="retrieveRules.newPassword" class="ui-password-item"
                    prop="newPasswordTwo">
                    <el-input
                        v-model="retrieveForm.newPasswordTwo" type="password"
                        placeholder="请再次输入新的登录密码">
                        <i slot="suffix" class="el-input__icon el-icon-date"></i>
                    </el-input>
                    <p class="ui-hint">
                        提示：密码8-16位，必须含有：英文、数字、区分大小写
                    </p>
                </el-form-item>
                <el-form-item>
                    <el-button
                        :loading="submitTagRetrieve" type="primary"
                        class="ui-retrieve-btn"
                        @click="handleSubmitRetrieve">
                        重置密码
                    </el-button>
                </el-form-item>
                <p class="ui-link" @click="login_show = true">
                    返回登录
                </p>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data () {
        return {
            login_show: true,
            submitTagLogin: false,
            submitTagRetrieve: false,
            login_img: require('../../assets/image/login-logo.png'),
            loginForm: {
                userPhone: '',
                password: '',
            },
            // 找回密码表单数据
            retrieveForm: {
                userPhone: '',
                imgCode: '',
                phoneCode: '',
                newPasswordOne: '',
                newPasswordTwo: '',
            },
            rules: {
                userPhone: [
                    {
                        required: true,
                        message: '请输入正确的手机号码',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/,
                        message: '手机号码格式不正确',
                        trigger: 'blur',
                    },
                ],
                password: [
                    {
                        required: true,
                        message: '请输入正确的密码',
                        trigger: 'blur',
                    },
                ],
            },
            retrieveRules: {
                userPhone: [
                    {
                        required: true,
                        message: '请输入正确的手机号码',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/,
                        message: '手机号码格式不正确',
                        trigger: 'blur',
                    },
                ],
                imgCode: [
                    {
                        required: true,
                        message: '请输入图片验证码',
                        trigger: 'blur',
                    },
                ],
                phoneCode: [
                    {
                        required: true,
                        message: '请输入手机验证码',
                        trigger: 'blur',
                    },
                ],
                newPassword: [
                    {
                        required: true,
                        message: '请输入正确的密码',
                        trigger: 'blur',
                    },
                    {
                        min: 8,
                        max: 16,
                        message: '长度在8-16位字符之间',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,15}$/,
                        message: '密码必须包含大写字母、小写字母和数字',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^[a-zA-Z0-9.+]+$/,
                        message: '密码不能包含特殊字符及空格',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    methods: {
        // 点击登录
        handleSubmitLogin () {
            this.$refs.loginForm.validate((res) => {
                if (res) {
                    console.log('提交');

                }
            });
        },
        // 点击重置密码
        handleSubmitRetrieve () {
            this.$refs.retrieveForm.validate((res) => {
                if (res) {
                    console.log('提交');

                }
            });
        },
    },
};
</script>

<style scoped lang="less">
.ui-login-box {
    height: 100%;
    background: #f7f7f7;
}
.ui-login {
    height: 100%;
    background: url('../../assets/image/login_bg.png');
    .ui-login-logo {
        padding-top: 88px;
        img {
            width: 204px;
        }
    }
    .ui-login-form {
        width: 384px;
        margin: 0 auto;
        margin-top: 50px;
        .ui-login-btn {
            width: 100%;
            margin-top: 26px;
        }
    }
}
.ui-forget {
    font-size: 14px;
    color: #1890ff;
    text-align: right;
    letter-spacing: -0.28px;
    cursor: pointer;
}
// 找回密码
.ui-retrieve-form {
    width: 384px;
    margin: 0 auto;
    margin-top: 50px;
    .ui-code-item {
        /deep/.el-form-item__content {
            text-align: left;
            .el-input {
                width: 277px;
            }
            img {
                float: right;
                width: 90px;
                height: 40px;
            }
        }
    }
    .ui-code-btn-item {
        /deep/.el-form-item__content {
            text-align: left;
            .el-input {
                width: 277px;
            }
            .el-button {
                float: right;
                width: 90px;
                height: 40px;
                padding: 0;
                font-size: 12px;
            }
        }
    }
    .ui-password-item {
        position: relative;
        .ui-hint {
            position: absolute;
            top: 0;
            right: -82%;
            font-size: 12px;
            color: #f33;
            letter-spacing: -0.24px;
        }
    }
    .ui-retrieve-btn {
        width: 100%;
    }
    .ui-link {
        font-size: 12px;
        color: #72afff;
        text-align: right;
        &:hover {
            color: #3c8cff;
        }
    }
}
</style>
