<template>
  <div>
    <el-button type="primary" icon="el-icon-ps" @click="showAdd">添加</el-button>
    <el-table  v-loading="loading" style="margin:20px 0;" :data="trademarks" border>
      <el-table-column label="序号" type="index" width="80" align="center" />

      <el-table-column prop="tmName" label="品牌名称" />

      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" style="width:100px; height:60px;" />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{row, $index}">
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="showUpdate(row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3,6,9]"
      :page-size="limit"
      :total="total"
      layout=" prev, pager, next, jumper, ->,sizes,total"
      @current-change="getTrademarks"
      @size-change="handleSizeChange"
    />

    <el-dialog :title = "form.id ? '修改品牌': '添加品牌'" :visible.sync="isShowDialog">
      <el-form :model="form" style="width:8o%">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <!-- /admin/product/fileUpload -->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",

  data() {
    return {
      trademarks: [], ///当前页面的品牌列表
      total: 0,
      page: 1,
      limit: 3, //每页数量

      //有错
      isShowDialog: false,
      form: {
        tmName: "",
        logoUrl: "",
      },
      loading: false,
    }
  },


  mounted() {
    this.getTrademarks();

  },
  

  methods: {
    remove(){
      //有错 
        this.$confirm('确定删除 ${trademark.tmName} 吗?', '提示', {
          type: 'warning'
        }).then(async() => {
          const result = await this.$API.trademark.remove(trademark.id)
          if (result.code === 200) {
           this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTrademarks(this.trademarks.length === 1&&this.page>1 ? this.page-1 : this.page)
          } else {
             this.$message({
            type: 'error',
            message: '删除失败'
          })         
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })         
        })

    },
    



    //有错

    //准备数据
     async addOrUpdate(){
      const trademark = this.form
      let result 
      //提交请求
    if (trademark.id) {
      result =  await this.$API.trademark.update(trademark)
    } else {
      result =  await this.$API.trademark.add(trademark)
    }
    //如果成功，提示成功，并获取列表显示
    if(result.code===200){
      this.$message.success(`${trademark.id ? '更新' : '添加'} 成功！ `)
      this.isShowDialog = false
      this.getTrademarks(trademark.id ? this.page : 1)
    }else{
      this.$message.success(`${trademark.id ? '更新' : '添加'} 失败！ `)
    }
  },



    handleAvatarSuccess(res, file) {
       this.form.logoUrl = res.data
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },




      showUpdate(trademark){
        this.form = {...trademark}//浅拷贝就不会同事改变了
        // this.form = trademark
        this.isShowDialog = true
      },



    showAdd() {
      this.form = {
        tmName:'',
        logoUrl:'',
      }
      this.isShowDialog = true;
    },




    handleSizeChange(pageSize) {
      this.limit = pageSize;
      this.getTrademarks(1);
    },

    async getTrademarks(page = 1) {
      this.page = page;
      this.loading = true
      const result = await this.$API.trademark.getList(page, this.limit);
      console.log(result);
      this.loading = false
      if (result.code === 200) {
        const { records, total } = result.data;
        this.trademarks = records;
        this.total = total;
      } else {
        this.$message.error("获取分页列表失败");
      }
    }
  }
};
</script>
<style >
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
