<template lang="pug">
  .loading
    .bg-loading(:class="showLoading")
    b-spinner.big-spinner-grow.spinner-grow-main(variant="primary" :class="showLoading")
</template>

<script>
export default {
  name: 'Loading',
  computed : {
    spinerStatus() {
      if (this.$store.state.auth.status === 'loading') {
        return "";
      }
      return "spiner-hide";
    },
    showLoading() {
      if (this.$store.state.loading.showLoading) {
        return "";
      }
      return "spiner-hide";
    }
  }
}
</script>

