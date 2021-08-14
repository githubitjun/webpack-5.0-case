import Mock from 'mockjs';

let Random = Mock.Random;

Random.datetime('yyyy-MM-dd HH:mm:ss');
Random.image('100x100');

const mockListData = Mock.mock({
    data_list: {
        key: {
            order: '订单号',
            image: '产品图片',
            type: '类型',
            user: '用户',
            sumMoney: '金额',
            sumTotal: '数量',
            time: '时间'
        },
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'value|1-20': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1,
            'order': `SQ000000` + '@id',
            'time': '@datetime',
            'type|1': ['海外', 'FBA'],
            'image': '@image(100x100)',
            'bigImage': '@image()',
            'user|1': ['哆啦A梦', '蜡笔小新', '光头一休'],
            'sumMoney': Random.float(1, 10000000, 1, 2),
            'sumTotal': Random.integer(1, 10000000)
        }]
    },
    page_data: {
        limit: 20,
        offset: 1,
        'total|1-20': 1
    },
    status: 1
});

Mock.mock(/\/api\/module\/list/, function (option) {
    return {
        ...mockListData
    }
});