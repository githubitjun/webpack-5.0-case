<!--
 * @Author: 九天
 * @Date: 2021-08-10 10:16:20
 * @LastEditors: 九天
 * @LastEditTime: 2021-08-14 15:29:25
 * @Description: 文件切片上传
 * @FilePath: \20210426-vue\project\src\views\UploadFiles.vue
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
      <div slot="tip" class="el-upload__tip">不能上传重复文件,没有分切片上传</div>
    </el-upload>
    <br />
    <el-upload
      class="upload-demo"
      action
      :on-change="upload_chunk"
      :multiple="false"
      :auto-upload="false"
      :show-file-list="false"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">切片上传,外加进度条</div>
    </el-upload>
    总进度条
    <el-progress
      :text-inside="true"
      :stroke-width="26"
      :percentage="uploadPercentage"
      status="success"
    ></el-progress>
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
const baseUrl = "http://192.168.31.189:3000"; // 请求接口的根路径
export default {
  data() {
    return {
      fileList: [],
      fileName: "", // 文件名
      fileHash: null,
      fileData: [],
      requestList: [],
      percentNum: 0,
      fileSize: 0,
      file: null,
    };
  },
  methods: {
    // 不能上传重复文件
  async  handleChange(file, fileList) {
      var fileReader = new FileReader();
      var spark = new SparkMD5();
      let fileHash = await this.createFileHashChunk(file.raw);
      if (fileHash) {
        const fileNameSplitArr = file.name.split(".");
        const ext = fileNameSplitArr[fileNameSplitArr.length - 1];
        console.info(`${file.name} hash --->`, fileHash, ext);
        let formData = new window.FormData();
   

        formData.append("file", file.raw);
        formData.append("hash", fileHash);
        formData.append("ext", ext);
        axios
          .post(`${baseUrl}/upload_single_formdata_rename`, formData)
          .then((res) => {
            console.log(res.data);
            if (res.data.code) {
              this.$message.success(res.data.message);
            } else {
              this.$message.error(res.data.message);
            }
          });
        console.log("file", file);
      } else {
        console.log("生成文件hash 失败");
      }
    },
    // 切片上传文件
    async upload_chunk(file, fileList) {
      console.log(file);
      this.fileSize = file.size; // 文件大小
      this.fileName = file.name; // 文件名
      this.file = file.raw; // 文件流内容
      let fileChunkList = this.createFileChunk(file.raw);
      console.log(fileChunkList);
      this.fileData = fileChunkList.map(({ file }, index) => ({
        chunk: file,
        hash: this.fileName + "__" + index, // 文件名 + 数组下标
        percentage: 0,
      }));
      this.requestList = this.fileData
        .map(({ chunk, hash }) => {
          const formData = new FormData();
          formData.append("file", chunk);
          formData.append("hash", hash);
          formData.append("filename", this.fileName);
          return { formData };
        })
        .map(async ({ formData }, index) => {
          return await axios.post(
            "http://192.168.31.189:3000/upload_chunk",
            formData,
            {
              onUploadProgress: this.uploadProgress(this.fileData[index]),
            }
          );
        });
      let result_arr = await Promise.all(this.requestList);
      console.log(result_arr);

      let code2 = result_arr.some(({ data }) => data.code !== 2);
      console.log(code2);

      if (code2) {
        let merge_reult = await axios.post(
          "http://192.168.31.189:3000/upload_merge",
          {
            hash: this.fileName,
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
      }

      this.requestList = [];
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
    // 生成文件hash 值
    createFileHashChunk(file, size = SIZE) {
      return new Promise((resolve, reject) => {
        const fileChunkList = [];
        let cur = 0;
        while (cur < file.size) {
          fileChunkList.push({ file: file.slice(cur, cur + size) });
          cur += size;
        }
        let count = 0;
        var spark = new SparkMD5();
        let fileHash = null;
        let next = (index) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(fileChunkList[index].file);
          reader.onload = (e) => {
            count++;
            spark.append(e.target.result);
            if (count === fileChunkList.length) {
              fileHash = spark.end();
              this.fileHash = fileHash;
              console.log(fileHash);
              resolve(fileHash)
              return;
            } else {
              next(count);
            }
          };
        };
        next(count);
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

/* 
  大文件上传 
    前端上传大文件时先将文件进行切片,并发上传多个切片, 最后还要发送一个合并请求通知服务端切片上传完毕,服务端便合并切片
    服务端接受切片并存储, 收到合并请求后使用流将切片合并到最终文件
    使用axios onUploadProgress 来监听切片的上传进度
    使用 vue计算属性 根据每个切片的进度算出整个文件的上传进度

  断点续传
    使用 spark-md5 根据文件内容算出文件 hash 
    通过 hash 可以判断服务端是否已经上传该文件,从而直接提示用户上传成功(秒传)
    通过axios 的CancelToken 可以取消 axios 请求, 即中断了切片上传
    下次接着上传之前, 先请求服务端将已经上传的切片返回给前端, 前端然后跳过这些切片的上传
*/
</script>

<style></style>
