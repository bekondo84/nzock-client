<template>
  <div id="notfound">
		<div class="notfound">
			<div class="notfound-bg">
				<div></div>
				<div></div>
				<div></div>
			</div>
			<h1>oops!</h1>
			<h2>{{ message }}</h2>
      <a href="#">go back</a>		
		</div>
	</div>
</template>
<script lang="ts">
import { i18n } from '@/services/i18nService';
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
      err: Object,
    }, data: function() {
      return {
         translate: [],
      }
    }, methods: {
      t(key: string) {
        if (this.translate != null) {
         return this.translate[key];
        }
        return "";
      }
    }, computed: {
        message() {
          if (this.err != null && this.err.response != null && this.err.response.data != null) {
            if (this.err.response.data.status==500) {
                return this.t('500.error.message');
            } else if (this.err.response.data.status==400){
              return this.t('400.error.message');
            }
            return this.t('404.error.message');
          } else {
            return this.t('unkown.error.message');
          }
        }
    }, async created() {
         this.translate = await i18n(['404.error.message', '500.error.message', '400.error.message', 'unkown.error.message']);
    }
})

export default class ErrorPage extends Vue {

}
</script>
<style scoped lang="scss">
* {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}

#notfound {
  position: relative;
  height: 100%;
  background-color: #fafbfd;
}

#notfound .notfound {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
}

.notfound {
  max-width: 520px;
  width: 100%;
  text-align: center;
}

.notfound .notfound-bg {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 50%;
  -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
          transform: translateY(-50%);
  z-index: -1;
}

.notfound .notfound-bg > div {
  width: 100%;
  background: #fff;
  border-radius: 90px;
  height: 125px;
}

.notfound .notfound-bg > div:nth-child(1) {
  -webkit-box-shadow: 5px 5px 0px 0px #f3f3f3;
          box-shadow: 5px 5px 0px 0px #f3f3f3;
}

.notfound .notfound-bg > div:nth-child(2) {
  -webkit-transform: scale(1.3);
      -ms-transform: scale(1.3);
          transform: scale(1.3);
  -webkit-box-shadow: 5px 5px 0px 0px #f3f3f3;
          box-shadow: 5px 5px 0px 0px #f3f3f3;
  position: relative;
  z-index: 10;
}

.notfound .notfound-bg > div:nth-child(3) {
  -webkit-box-shadow: 5px 5px 0px 0px #f3f3f3;
          box-shadow: 5px 5px 0px 0px #f3f3f3;
  position: relative;
  z-index: 90;
}

.notfound h1 {
  font-family: 'Quicksand', sans-serif;
  font-size: 86px;
  text-transform: uppercase;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 8px;
  color: #151515;
}

.notfound h2 {
  font-family: 'Quicksand', sans-serif;
  font-size: 26px;
  margin: 0;
  font-weight: 700;
  color: #151515;
}

.notfound a {
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  text-decoration: none;
  text-transform: uppercase;
  background: #18e06f;
  display: inline-block;
  padding: 15px 30px;
  border-radius: 5px;
  color: #fff;
  font-weight: 700;
  margin-top: 20px;
}

.notfound-social {
  margin-top: 20px;
}

.notfound-social>a {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  width: 40px;
  font-size: 14px;
  color: #fff;
  background-color: #dedede;
  margin: 3px;
  padding: 0px;
  -webkit-transition: 0.2s all;
  transition: 0.2s all;
}
.notfound-social>a:hover {
  background-color: #18e06f;
}

@media only screen and (max-width: 767px) {
    .notfound .notfound-bg {
      width: 287px;
      margin: auto;
    }

    .notfound .notfound-bg > div {
      height: 85px;
  }
}

@media only screen and (max-width: 480px) {
  .notfound h1 {
    font-size: 68px;
  }

  .notfound h2 {
    font-size: 18px;
  }
}
</style>