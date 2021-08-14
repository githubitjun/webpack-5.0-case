/**
 * Name: 编辑模块
 * User: YnmauSu
 * Date: 2020/4/10
 * Time: 11:39
 *
 */
import { comparisonArrayObject } from '@/services';
export default {
    methods: {
        // 关闭校验
        handleBeforeClose(done) {
            if (comparisonArrayObject(this.saveInitData, JSON.stringify(this.editData))) {
                done();
            } else {
                this.$confirm('单据未保存，是否要取消？', '提示', {
                    type: 'warning'
                }).then(() => {
                    done();
                })
            }
        },
    }
}