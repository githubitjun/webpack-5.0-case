<template>
    <el-button
        v-if="isAllow"
        :icon="icon" :type="type"
        :disabled="disabled" size="small"
        @click="handleClick">
        <slot></slot>
    </el-button>
    <el-button
        v-else :icon="icon"
        :type="type" size="small"
        disabled>
        <slot></slot>
    </el-button>
</template>

<script>
import {
    mapGetters,
} from 'vuex';
export default {
    name: 'ComPermitButton',
    props: {
        label: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        permit: {
            required: true,
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        permitPath: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: '',
        },
    },
    data () {
        return {
            // isAllow: false,
        };
    },
    computed: {
        ...mapGetters(['permitResource']),
        isAllow () {
            // return true;
            if (process.env.NODE_ENV === 'development') { return true; }
            return this.permitResource[this.permitPath || this.$route.path.replace('/', '') || this.$parent.$option.name][this.permit];
        },
    },
    created () {
        // this.isAllow = this.permitResource[this.permitPath || this.$route.path.replace('/', '') || this.$parent.$option.name][this.permit];
        // this.isAllow = true;
    },
    methods: {
        handleClick (e) {
            this.$emit('click', e);
        },
    },
};

</script>

<style scoped>

</style>
