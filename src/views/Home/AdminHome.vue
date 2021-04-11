<template>
  <div id="admin-home">
    <div class="header"></div>
    <div class="content">
      <el-tabs v-model="tabActive">
        <el-tab-pane label="账号管理" name="first">
          <div class="item-reg">
            <el-table :data="userList" style="width: 100%">
              <el-table-column prop="createdOn" label="日期" width="180"></el-table-column>
              <el-table-column prop="name" label="姓名" width="180"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="userStatus" label="账号状态"></el-table-column>
              <el-table-column label="账号操作">
                <template slot-scope="scope">
                  <el-button type="primary" @click="banUser(scope.row.id)"
                             @click.native.prevent="deleteRow(scope.$index, userList)">封禁
                  </el-button>
                  <el-button type="danger" @click="unbanUser(scope.row.id)"
                             @click.native.prevent="deleteRow(scope.$index, userList)">解封
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品审核" name="second">
          <div class="item-audit">
            <el-table :data="auditCommos" style="width: 100%">
              <el-table-column label="图片" width="180">
                <template slot-scope="scope">
                  <el-image :src="scope.row.photoUrl" width="150" fit="contain"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="commName" label="名称" width="180"></el-table-column>
              <el-table-column prop="auditMsg" label="简述"></el-table-column>
              <el-table-column prop="createUser" label="创建者" width="180"></el-table-column>
              <el-table-column prop="auditStatus" label="审核状态"></el-table-column>
              <el-table-column label="是否允许" width="180">
                <template slot-scope="scope">
                  <el-button type="primary" @click="allowCommo(scope.row.id)"
                             @click.native.prevent="deleteRow(scope.$index, auditCommos)" size="small">允许
                  </el-button>
                  <el-button type="danger" @click="refuseCommo(scope.row.id)"
                             @click.native.prevent="deleteRow(scope.$index, auditCommos)" size="small">拒绝
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品管理" name="third">
          <div class="item-audit">
            <el-table :data="commList" style="width: 100%">
              <el-table-column label="图片" width="180">
                <template slot-scope="scope">
                  <el-image :src="scope.row.photoUrl" width="150" fit="contain"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="commName" label="名称" width="180"></el-table-column>
              <el-table-column prop="auditMsg" label="简述"></el-table-column>
              <el-table-column prop="createUser" label="创建者" width="180"></el-table-column>
              <el-table-column prop="auditStatus" label="审核状态"></el-table-column>
              <el-table-column label="商品操作" width="250">
                <template slot-scope="scope">
                  <el-button type="primary" @click="allowCommo(scope.row.commNo)"
                             @click.native.prevent="deleteRow(scope.$index, auditCommos)" size="small">允许
                  </el-button>
                  <el-button type="danger" @click="refuseCommo(scope.row.commNo)"
                             @click.native.prevent="deleteRow(scope.$index, auditCommos)" size="small">拒绝
                  </el-button>
                  <el-button type="danger" @click="deleteCommo(scope.row.commNo)"
                             @click.native.prevent="deleteRow(scope.$index, auditCommos)" size="small">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabActive: 'first',
      allUsers: [{id: 0, name: '', createOn: '', email: ''}],
      auditCommos: [],
      userList: [],
      commList: [{
        commName: '',
        auditMsg: '',
        createUser: '',
        auditStatus: ''
      }]
    }
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    //审核通过
    allowCommo(commNo) {
      this.$axios.post('/apis/admin/auditComm', this.$qs.stringify({
            auditStatus: 1,
            auditor: this.$store.state.user.userName,
            commNo: commNo
          }), {
            headers: {
              Authorization: this.$store.state.token,
            }
          }
      ).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          this.$notify({
            title: '成功',
            message: '处理完成',
            type: 'success'
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    //拒绝发布
    refuseCommo(commNo) {
      this.$axios.post('/apis/admin/auditComm', this.$qs.stringify({
        auditMsg: '',
        auditStatus: 2,
        auditor: this.$store.state.userBean.userName,
        commNo: commNo
      }), {
        headers: {
          Authorization: this.$store.state.token,
        }
      }).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          this.$notify({
            title: '成功',
            message: '处理完成',
            type: 'success'
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 删除商品
    deleteCommo(commNo) {
      this.$axios.post('/apis/admin/auditComm', this.$qs.stringify({
        commNo: commNo
      }), {
        headers: {
          Authorization: this.$store.state.token,
        }
      }).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          this.$notify({
            title: '成功',
            message: '处理完成',
            type: 'success'
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    banUser() {

    }
  },
  mounted() {
    //所有用户列表
    this.$axios.post('/apis/admin/userList', {
      headers: {
        Authorization: this.$store.state.token
      }
    }).then(resp => {
      console.log(resp)
      var data = resp.data
      if (data.code === 1) {
        this.userList = data.obj
      }
    })
    //所有商品列表
    this.$axios.get('/apis/admin/commList', {
      headers: {
        Authorization: this.$store.state.token
      }
    }).then(resp => {
      console.log(resp)
      var data = resp.data
      if (data.code === 1) {
        this.commList = data.obj
      }
    })
    //待审核商品列表
    this.auditCommos = this.commList
    for (let i = 0; i < this.auditCommos.length; i++) {
      if (this.auditCommos[i].auditStatus === 0) {
        this.auditCommos[i] = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#admin-home {
  .header {
    height: 60px;
    background: rgb(70, 70, 70);
  }

  .content {
    width: 90%;
    margin: 30px auto;
  }
}
</style>
