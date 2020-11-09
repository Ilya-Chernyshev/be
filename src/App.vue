<template lang="pug">
  #app
    Loading
    Menu
    .cust-container
      .container-fluid
        transition(name="fade" mode="out-in")
          router-view
</template>

<script>
  import Auth from './components/auth/Auth.vue'
  import Main from './components/main/Main.vue'
  import Menu from './components/main/Menu.vue'
  import Loading from '@/components/main/Loading.vue'

  export default {
    name: 'App',
    components: {
      Auth,
      Main,
      Menu,
      Loading
      
    }
  }
</script>



<style src='../node_modules/bootstrap/dist/css/bootstrap.css' ></style>
<style src='../node_modules/bootstrap-vue/dist/bootstrap-vue.css' ></style>
<style src='@/sass/main/main.sass' lang="sass"></style>
<style src='@/sass/main/menu.sass' lang="sass"></style>
