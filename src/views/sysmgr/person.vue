<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.searchKey" placeholder="姓名，用户名，手机号..." style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <Treeselect v-model="listQuery.department" :options="department" placeholder="部门" style="width: 150px; color: #909399;" class="filter-item" />
      <el-select v-model="listQuery.role" placeholder="角色" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      height="400"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-image
            style="width: 100px; height: 100px; margin-left:50px;"
            :src="row.image_uri"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column type="index" align="center" width="40" fixed />
      <el-table-column label="姓名" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录名" prop="userName" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IC卡号码" prop="ICCardNo" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.ICCardNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" prop="mobilePhone" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.mobilePhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" prop="departmentName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="roleName" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastLoginTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="{row}">
          <el-tag :type="row.enable | statusFilter">{{ row.enable == '0' ? '停用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.enable=='0'" size="mini" type="success" @click="handleModifyStatus(row,1)">
            启用
          </el-button>
          <el-button v-else size="mini" type="danger" @click="handleModifyStatus(row,0)">
            停用
          </el-button>
          <el-button :disabled="row.enable=='1'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" style="margin-top:-20px;" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
        <el-col :span="8" :xs="24">
          <el-card style="text-align:center">
            <div slot="header" class="clearfix" style="text-align:left">
              <span>头像信息</span>
            </div>
            <pan-thumb :image="image" :height="'100px'" :width="'100px'" />
            <el-button type="primary" icon="el-icon-upload" size="mini" style="margin: 20px 0 80px 0;" @click="imagecropperShow=true">
              上传图片
            </el-button>
            <image-cropper
              v-show="imagecropperShow"
              :key="imagecropperKey"
              :width="300"
              :height="300"
              url="https://httpbin.org/post"
              lang-type="en"
              @close="close"
              @crop-upload-success="cropSuccess"
            />
          </el-card>
        </el-col>
        <el-col :span="16" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>详细资料</span>
            </div>
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 350px;">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="temp.name" />
              </el-form-item>
              <el-form-item v-if="dialogStatus==='create'" label="登录名" prop="userName">
                <el-input v-model="temp.userName" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="temp.password" type="password" />
              </el-form-item>
              <el-form-item v-if="dialogStatus==='create'" label="密码确认" prop="password_cfm">
                <el-input v-model="temp.password_cfm" type="password" />
              </el-form-item>
              <el-form-item label="手机号码" prop="mobilePhone">
                <el-input v-model="temp.mobilePhone" />
              </el-form-item>
              <el-form-item label="IC卡号" prop="mobilePhone">
                <el-input v-model="temp.ICCardNo" />
              </el-form-item>
              <el-form-item label="所属部门" prop="departmentId">
                <Treeselect v-model="temp.departmentId" :options="department" style="color: #909399;" />
              </el-form-item>
              <el-form-item label="角色">
                <el-select v-model="temp.role" placeholder="请选择" multiple>
                  <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="启用">
                <el-switch v-model="temp.enable" />
              </el-form-item>
              <el-form-item style="text-align: right;">
                <el-button @click="dialogFormVisible = false">
                  取消
                </el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                  确认
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createPerson, updatePerson } from '@/api/person'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const roleOptions = [
  { id: 1, name: '领导' },
  { id: 2, name: '普通员工' },
  { id: 3, name: '管理员' }
]

export default {
  components: { Pagination, Treeselect, ImageCropper, PanThumb },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        token: '',
        pageNo: 1,
        pageSize: 20,
        department: undefined,
        role: undefined,
        searchKey: undefined
      },

      roleOptions,
      department: [{
        id: 1,
        label: '浙江省',
        children: [{
          id: 11,
          label: '杭州市'
        }, {
          id: 12,
          label: '宁波市'
        }]
      }, {
        id: 2,
        label: '河南省'
      }, {
        id: 3,
        label: '河北省'
      }],
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        personID: undefined,
        name: '',
        username: '',
        mobilePhone: '',
        departmentId: undefined,
        password: '',
        password_cfm: '',
        roleName: '',
        enable: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        username: [{ required: true, message: '登录名不能为空', trigger: 'change' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        password_cfm: [{ required: true, message: '密码确认不能为空', trigger: 'blur' }]
      },
      downloadLoading: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.enable = status
    },
    resetTemp() {
      this.temp = {
        personID: undefined,
        name: '',
        username: '',
        mobilePhone: '',
        departmentId: undefined,
        password: '',
        password_cfm: '',
        roleName: '',
        enable: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.password !== this.temp.password_cfm) {
            this.$message('两次密码输入不相同')
          }
          this.temp.personID = parseInt(Math.random() * 100) + 1024 // mock a id
          createPerson(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '新建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.enable = this.temp.enable !== 0
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.updateTime = new Date()
          updatePerson(tempData).then(() => {
            const index = this.list.findIndex(v => v.personID === this.temp.personID)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
