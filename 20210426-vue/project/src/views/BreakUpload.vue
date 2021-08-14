<!--
 * @Author: 九天
 * @Date: 2021-08-11 10:05:56
 * @LastEditors: 九天
 * @LastEditTime: 2021-08-11 16:23:55
 * @Description: 断点续传
 * @FilePath: \20210426-vue\project\src\views\BreakUpload.vue
-->
<template>
  <div>
    <el-upload
      class="upload-demo"
      action
      :on-change="handleChange"
      :multiple="false"
      :auto-upload="false"
      :show-file-list="false"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    hash 文件生成进度
    <el-progress :percentage="hashPercentage"></el-progress>
    总进度条
    <el-progress
      :text-inside="true"
      :stroke-width="26"
      :percentage="uploadPercentage"
      status="success"
    ></el-progress>
    <el-button size="small" type="primary" @click="breakAxios"
      >中断上传请求</el-button
    >
    <el-button size="small" type="primary" @click="againUploadHash"
      >继续上传</el-button
    >
    hash 块进度条
    <div v-for="(item, index) in fileData" :key="index">
      <el-progress :percentage="item.percentage">{{ item.hash }}</el-progress>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SparkMD5 from "spark-md5";
// const SIZE = 10 * 1024 * 1024; // 切片大小
const SIZE = 1 * 1024; // 切片大小
export default {
  data() {
    return {
      fileSize: 0, // 文件大小
      fileName: "", // 文件名称
      file: "", // 文件内容
      fileChunkList: [], // 切片文件数组
      container: {
        worker: "",
        hash: "", // 生成的文件hash值
      },
      fileData: [],
      hashPercentage: 0, // 计算hash 的进度条
      axioscCancel: [],
    };
  },
  methods: {
    // 中断上传请求
    breakAxios() {
      this.axioscCancel.forEach((fn) => {
        fn();
        // console.log(this.axioscCancel);
      });
      sessionStorage.setItem('hash',this.container.hash);
      sessionStorage.setItem('filename',this.fileName);
      this.axioscCancel = [];
    },
    // 续传
   async againUploadHash() {
        // 先获取已经上传的hash 文件
        let hash = sessionStorage.getItem('hash');
        let filename = sessionStorage.getItem('filename');
        let merge_reult = await axios.post(
        "http://192.168.31.189:3000/upload_break_merge",
        {
          filename: filename,
          fileHash: hash,
          count: this.fileData.length,
          size: SIZE,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      let { code,fileHashList } = merge_reult.data
      console.log(code,fileHashList);
       this.fileData = this.fileData.filter(item =>{
            return  !fileHashList.includes(item.hash)
        })
        console.log(this.fileData);
        this.uploadHash();
    },
    async handleChange(file) {
      this.fileSize = file.size;
      this.fileName = file.name;
      this.file = file.raw;
      this.fileChunkList = this.createFileChunk(this.file);
      this.container.hash = await this.calculateHash(this.fileChunkList);
      this.fileData = this.fileChunkList.map(({ file }, index) => ({
        chunk: file,
        fileHash: this.container.hash,
        hash: this.container.hash + "__" + index, // 文件hash名 + 数组下标
        percentage: 0,
      }));
      console.log(this.fileData);
      this.uploadHash();
    },
    // 上传请求
    async uploadHash() {
      this.requestList = this.fileData
        .map(({ chunk, hash, fileHash }) => {
          const formData = new FormData();
          formData.append("file", chunk);
          formData.append("hash", hash);
          formData.append("fileHash", fileHash);
          formData.append("filename", this.fileName);
          return { formData };
        })
        .map(async ({ formData }, index) => {
          const CancelToken = axios.CancelToken;
          const source = CancelToken.source();
          return await axios.post(
            "http://192.168.31.189:3000/upload_break_chunk",
            formData,
            {
              cancelToken: new CancelToken((c) => {
                // executor 函数接收一个 cancel 函数作为参数
                // cancel = c;
                this.axioscCancel.push(c);
              }),
              onUploadProgress: this.uploadProgress(this.fileData[index]),
            }
          );
        });
      let result_arr = await Promise.all(this.requestList);
      console.log(result_arr);
      let code2 = result_arr.some(({ data }) => data.code ==1 || data.code == 2);
      if (!code2) {
          return 
      }
      // 发送合并切边的情求
      let merge_reult = await axios.post(
        "http://192.168.31.189:3000/upload_break_merge",
        {
          filename: this.fileName,
          fileHash: this.container.hash,
          count: this.fileData.length,
          size: SIZE,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      console.log(merge_reult.data);
    },
    // 生成文件切片
    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return fileChunkList;
    },
    // 生成文件 hash（web-worker）
    calculateHash(fileChunkList) {
      return new Promise((resolve) => {
        // 添加 worker 属性
        console.log("111");

        this.container.worker = new Worker("/work.js");
        this.container.worker.postMessage({ fileChunkList });
        this.container.worker.onmessage = (e) => {
          const { percentage, hash } = e.data;
          this.hashPercentage = percentage;
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    // 监听文件上传进度
    uploadProgress(item) {
      return (e) => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100));
      };
    },
  },
  computed: {
    // 整体上传进度
    uploadPercentage() {
      if (!this.file || !this.fileData.length) return 0;
      const loaded = this.fileData
        .map((item) => SIZE * item.percentage)
        .reduce((acc, cur) => acc + cur);
      let percentNum = parseInt((loaded / this.fileSize).toFixed(2));
      if (percentNum >= 100) {
        percentNum = 100;
      }
      return percentNum;
    },
  },
};
</script>

<style></style>
