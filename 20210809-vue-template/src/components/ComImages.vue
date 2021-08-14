<template>
    <div class="ui-images" :class="`ui-images__${type}`" :style="{width: type === 'row' ? '' : width, height}" ref="images">
        <span class="ui-flag"
              :class="[{'ui-true--flag': offset > 0}, `${type === 'row' ? 'el-icon-arrow-left' : 'el-icon-arrow-up'}`]"
              @click="handleOffsetImage('left')"></span>
        <ul :class="isAmple ? 'ui-ample--flag' : 'ui-com--flag'" :style="{height: height}">
            <li v-for="(item, index) in showImages" :key="index">
                <el-image
                        :z-index="index + offset"
                        :preview-src-list="images"
                        :style="{width: imgw, height: imgw}"
                        :src="item"
                        fit="cover"></el-image>
            </li>
        </ul>
        <span class="ui-flag" :class="[{'ui-true--flag': images.length > showLength + offset}, `${type === 'row' ? 'el-icon-arrow-right' : 'el-icon-arrow-down'}`]" @click="handleOffsetImage('right')"></span>
    </div>
</template>

<script>
    export default {
        name: "ComImages",
        props: {
            width: {
                type: String,
                default: '100px'
            },
            images: {
                type: Array,
                default() {
                    return []
                }
            },
            imgw: {
                type: String,
                default: '100px'
            },
            height: {
                type: String,
                default: '100px'
            },

            /**
             * @row 横向显示
             * @column 纵向显示
             * */
            type: {
                type: String,
                default: 'row'
            }
        },
        data() {
            return {
                areaWidth: '',
                offset: 0
            }
        },
        computed: {
            showLength() {
                return Math.floor(this.areaWidth / (parseInt(this.imgw) + 10));
            },
            showImages() {
                return this.images.slice(this.offset, this.offset + this.showLength)
            },
            isAmple() {
                return this.images.length >= this.showLength;
            }
        },
        mounted() {
            this.$nextTick().then(() => {
                this.areaWidth = this.type === 'row' ? this.$refs.images.offsetWidth : parseInt(this.height);
            })
        },
        methods: {
            handleOffsetImage(type) {
                if (type === 'left' && this.offset > 0) {
                    this.offset--;
                } else if (type === 'right' && this.images.length > this.showLength + this.offset) {
                    this.offset++;
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .ui-images {
        position: relative;
        ul {
            display: flex;
        }

        .ui-flag {
            position: absolute;
            width: 20px;
            height: 20px;
            border: 1px solid @base-bdr-color;
            border-radius: 50%;
            top: 50%;
            line-height: 20px;
            text-align: center;
            margin-top: -10px;
            cursor: pointer;

            &.ui-true--flag {
                color: #70b6fa;
                border-color: #70b6fa;
            }
        }
    }

    .ui-images__row {
        padding: 0 30px;
        ul {
            &.ui-ample--flag {
                justify-content: space-between;
            }

            &.ui-com--flag {
                li {
                    margin-right: 10px;
                }
            }
        }

        .ui-flag {
            &.el-icon-arrow-left {
                left: 0;
            }

            &.el-icon-arrow-right {
                right: 0;
            }
        }
    }

    .ui-images__column {
        padding: 30px 0;
        ul {
            flex-direction: column;
            &.ui-ample--flag {
                justify-content: space-between;
            }

            &.ui-com--flag {
                li {
                    margin-bottom: 10px;
                }
            }
        }

        .ui-flag {
            left: 50%;
            margin-left: -10px;
            &.el-icon-arrow-up {
                top: 0;
                margin-top: 0;
            }

            &.el-icon-arrow-down {
                top: unset;
                bottom: 0;
                margin-top: 0;
            }
        }
    }
</style>