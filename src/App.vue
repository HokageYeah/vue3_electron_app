<template>
  <!-- <div class="container">
    <div class="container-left">
      <div class="sidebar-logo-container">
        <img src="/favicon.png" class="sidebar-logo" />
        <h1 class="sidebar-title">桌面程序</h1>
      </div>
      <div class="has-logo">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            text-color="#fff"
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><Notebook /></el-icon>
                <span>Host文件</span>
              </template>
              <el-menu-item index="1-1">Host链接</el-menu-item>
              <el-menu-item index="1-2">Host文件</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </div>
    </div>
    <div class="container-right">
      <RouterView />
    </div>
  </div> -->

  <!-- <el-row class="tac">
    <el-col :span="8">
      <div class="sidebar-logo-container">
        <img src="/favicon.png" class="sidebar-logo" />
        <h1 class="sidebar-title">桌面程序</h1>
      </div>
      <div class="has-logo">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            text-color="#fff"
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><Notebook /></el-icon>
                <span>Host文件</span>
              </template>
              <el-menu-item index="1-1">Host链接</el-menu-item>
              <el-menu-item index="1-2">Host文件</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :span="16">
      <RouterView />
    </el-col>
  </el-row> -->
  <header>
  <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Hom111e</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/change-host">changeHost</RouterLink>
        <RouterLink to="/down-load-host-list">downLoadHost</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { Document, Menu as IconMenu, Notebook, Setting } from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped lang="less">
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
.tac {
  & .has-logo {
    background-color: #304156;
    height: 1000px;
  }
  & .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #2b2f3a;
    text-align: center;
    overflow: hidden;
    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }
    & .sidebar-title {
      background: #2b2f3a;
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 18px;
      // font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
}
.container {
  display: flex;
  flex-direction: row;
  // width: 100%;
  min-width: 1024px;
  &-left {
    width: 30%;
    & .has-logo {
      background-color: #304156;
      height: 1000px;
    }
    & .sidebar-logo-container {
      position: relative;
      width: 100%;
      height: 50px;
      line-height: 50px;
      background: #2b2f3a;
      text-align: center;
      overflow: hidden;
      & .sidebar-logo {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin-right: 12px;
      }
      & .sidebar-title {
        background: #2b2f3a;
        display: inline-block;
        margin: 0;
        color: #fff;
        font-weight: 600;
        line-height: 50px;
        font-size: 18px;
        // font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
      }
    }
  }
  &-right {
    width: 70%;
  }
}
</style>
