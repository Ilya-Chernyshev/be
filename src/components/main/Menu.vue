<template lang="pug">
.menu(:class="menuStatus")
  template(v-if="beforeMenuStatus")
    .menu-logo
      img.logo(src="@/assets/img/logo.svg", alt="")
    ul.menu-list
      template(v-for="item in menu")
        li.menu-list__item
          router-link.menu-list__link(:to="item.href") {{item.name}}

      li.menu-list__item
        .menu-list__link(@click="out") Выход
</template>

<script>

export default {
  name: 'Menu',
  data() {
    return {
      menu : this.$store.getters.getMenuList
    }
  },
  methods: {
    out() {
      this.showOutMsg('Вы действительно хотите выйти?')
      .then((status) => {
        if (status) {
          this.$store.dispatch('SHOW_LOADING');

          this.$store.dispatch('AUTH_LOGOUT')
          .then(() => {
            this.$router.push('/auth');
          })
          .catch((resp)=> {
            if (resp.response.status === 401) {
             this.$router.push('/auth');
           }
           this.$store.dispatch('HIDE_LOADING');
         })
        }
      })
    },
    showOutMsg(message) {
      return new Promise((resolve, reject) => {
        this.$bvModal.msgBoxConfirm(' ', {
          title: message,
          okTitle: 'Да',
          cancelTitle: 'Отмена',
          centered: true,
          footerClass: 'p-2 border-top-0'
        })
        .then(value => {
         resolve(value);
       })
        .catch((err) => {
          reject(err);
        })
      })
    }
  },
  computed : {
    menuStatus() {
      if (this.$store.state.menu.showMenu || this.$store.state.auth.status === 'success') {
        return "menu-show";
      }
      return "";
    },
    beforeMenuStatus() {
      if (this.$store.state.menu.beforeShowMenu) {
        return true;
      }
      return false;
    }
  },  
}
</script>

<style src='@/sass/main/menu.sass' lang="sass"></style>