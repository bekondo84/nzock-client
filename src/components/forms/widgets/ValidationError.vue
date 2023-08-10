<template>
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
        <div id="validationError" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="60000">
            <div class="toast-header">
               <strong class="me-auto title-font">{{ t('error.toast.title') }}</strong>
               <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                 <ul>
                    <li v-for="err in errors" :key="err.name"><div class="error-line">{{ err.label }}</div></li>
                 </ul>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { emitter } from '@/services/emitter';
import { Options, Vue } from 'vue-class-component';
import { Toast } from 'bootstrap';
import { ErrorMsge } from '@/services/validator';
import { i18n } from '@/services/i18nService';

  @Options({
     props: {
       errors: [],
     }, data: function() {
        return {
            translate: null,
        }
     } , methods: {
        openToast() {
            let toastElt = document.getElementById('validationError');
            let toast = new Toast(toastElt);
            toast.show();
        }, t(key: string) {
          if (this.translate != null) {
            return this.translate[key];
          }
          return key;
      }
     },async created() {
        this.emitter.on("show-error-toast", this.openToast);
        this.emitter.on("hide-error-toast", this.closeToast);
        this.translate =  await i18n(['error.toast.title', 'error.mandatory.name', 'error.unique.name', 'error.max.name', 'error.min.name', 'error.email.name', 'error.pattern.name']);
     }

  })

  export default class ValidationError extends Vue {

  }
</script>
<style scoped lang="scss">
  .title-font {
     color: red;
  }
.error-line {
     display: flex;
     width: 100%;
   }
</style>