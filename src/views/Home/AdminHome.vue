<template>
  <div id="admin-home">
    <div class="header"></div>
    <div class="content">
      <el-tabs v-model="tabActive">
        <el-tab-pane label="账号管理" name="first">
          <div class="item-reg">
            <el-table :data="regUsers" style="width: 100%">
              <el-table-column prop="createdOn" label="日期" width="180"></el-table-column>
              <el-table-column prop="name" label="姓名" width="180"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="userStatus" label="账号状态"></el-table-column>
              <el-table-column label="账号操作">
                <template slot-scope="scope">
                  <el-button type="primary" @click="banUser(scope.row.id)"
                             @click.native.prevent="deleteRow(scope.$index, regUsers)">封禁
                  </el-button>
                  <el-button type="danger" @click="unbanUser(scope.row.id)"
                             @click.native.prevent="deleteRow(scope.$index, regUsers)">解封
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
              <el-table-column prop="name" label="名称" width="180"></el-table-column>
              <el-table-column prop="description" label="简述" width="180"></el-table-column>
              <el-table-column prop="price" label="价格"></el-table-column>
              <el-table-column prop="quantity" label="数量"></el-table-column>
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
            <el-table :data="auditCommos" style="width: 100%">
              <el-table-column label="图片" width="180">
                <template slot-scope="scope">
                  <el-image :src="scope.row.photoUrl" width="150" fit="contain"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="名称" width="180"></el-table-column>
              <el-table-column prop="description" label="简述" width="180"></el-table-column>
              <el-table-column prop="price" label="价格"></el-table-column>
              <el-table-column prop="quantity" label="数量"></el-table-column>
              <el-table-column label="是否允许" width="180">
                <template slot-scope="scope">
                  <el-button type="primary" @click="allowCommo(scope.row.id)"
                             @click.native.prevent="deleteRow(scope.$index, auditCommos)" size="small">允许
                  </el-button>
                  <el-button type="danger" @click="refuseCommo(scope.row.id)"
                             @click.native.prevent="deleteRow(scope.$index, auditCommos)" size="small">拒绝
                  </el-button>
                  <el-button type="danger" @click="deleteCommo(scope.row.id)"
                             @click.native.prevent="deleteRow(scope.$index, auditCommos)" size="small">拒绝
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
      commList: []
    }
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    //审核通过
    allowCommo() {
      this.$axios.post('/apis/admin/auditComm', this.$qs.stringify({
            auditComm: 1,
            auditor: this.$store.state.user.userName,
            commNo: ""
          }), {
            headers: {
              token: this.$store.state.token,
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
    //拒绝
    refuseCommo() {
      this.$axios.post('/apis/admin/auditComm', this.$qs.stringify({
        auditMsg: '',
        auditComm: 2,
        auditor: '',
        commNo: '',
      }), {
        headers: {
          token: this.$store.state.token,
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
    deleteCommo() {
      this.$axios.post('/apis/admin/auditComm', this.$qs.stringify({
        commNo: '',
      }), {
        headers: {
          token: this.$store.state.token,
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
    }
  },
  mounted() {
    this.$axios.get('/apis/admin/commList').then(resp => {
      var data = resp.data
      if (data.code === 200) {
        this.commList = data.data
      }
    })
    //待审核商品列表
    this.$axios.get('/apis/commodities/audit').then(resp => {
      var data = resp.data
      if (data.code === 200) {
        this.auditCommos = data.data
      }
    })
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
