<template>
    <div class='animated bounceInDown menu-img-bg menu-nav-bar'>
        <ul>
            <li v-for="menu in menus" :key="menu.pk" :class="{ 'sub-menu': isMenu(menu) }"><a @click="actionMenu(menu)">
                    <div>
                        <div :class="menu.icon"></div><span>{{ menu.label }}</span>
                    </div>
                    <div v-if="isMenu(menu)" class="fa fa-caret-down right"></div>
                </a>
                <ul v-if="isMenu(menu) && isExtended(menu)">
                    <li v-for="menu01 in menu.navigations" :key="menu01.pk" :class="{ 'sub-menu': isMenu(menu01) }"><a
                            @click="actionMenu(menu01, menu)">
                            <div>
                                <div :class="menu01.icon"></div><span>{{ menu01.label }}</span>
                            </div>
                            <div v-if="isMenu(menu01)" class="fa fa-caret-down right"></div>
                        </a>
                        <ul v-if="isMenu(menu01) && isExtended(menu01)">
                            <li v-for="menu02 in menu01.navigations" :key="menu02.pk"
                                :class="{ 'sub-menu': isMenu(menu02) }">
                                <a @click="actionMenu(menu02, menu01)">
                                    <div>
                                        <div :class="menu02.icon"></div><span>{{ menu02.label }}</span>
                                    </div>
                                    <div v-if="isMenu(menu02)" class="fa fa-caret-down right"></div>
                                </a>
                                <ul v-if="isMenu(menu02) && isExtended(menu02)">
                                    <li v-for="menu03 in menu02.navigations" :key="menu03.pk"
                                        :class="{ 'sub-menu': isMenu(menu03) }"><a @click="actionMenu(menu03, menu02)">
                                            <div>
                                                <div :class="menu02.icon"></div><span>{{ menu03.label }}</span>
                                            </div>
                                            <div v-if="isMenu(menu03)" class="fa fa-caret-down right"></div>
                                        </a>
                                        <ul v-if="isMenu(menu03) && isExtended(menu03)">
                                            <li v-for="menu04 in menu03.navigations" :key="menu04.pk"><a
                                                    @click="actionMenu(menu04, menu03)">
                                                    <div :class="menu04.icon"></div><span>{{ menu04.label }}</span>
                                                </a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        plugin: Object
    }, data: function () {
        return {
            menus: [],
            menu: null,
        }
    }, methods: {
        isMenu(node: any) {
            return node != null && node.navigations != null && node.navigations.length > 0;
        }, isExtended(menu: any) {
            return menu.selected;
        }, actionMenu(menu: any, parent: any) {
            if (menu == null) {
                return;
            }
            this.menu = menu;
            menu.selected = !menu.selected;
            if (parent == null) {
                for (let index = 0; index < this.menus.length; index++) {
                    if (this.menus[index].code != menu.code) {
                        this.menus[index].selected = false;
                    }
                }
            } else {
                for (let index = 0; index < parent.navigations.length; index++) {
                    if (parent.navigations[index].code != menu.code) {
                        parent.navigations[index].selected = false;
                    }
                }
            }
            if (!this.isMenu(menu)) {
                this.emitter.emit('menu-selected-event', menu);
            }
        }, isendNode(menu: any) {
            return menu == null || menu.navigations == null || menu.navigations == undefined;
        }, getMenus() {
            if (this.plugin != null) {
                this.menus.splice(0, this.menus.length);
                this.menus.push(...this.plugin.navigations);
            }
            this.setFirstMenuItem();

        }, setFirstMenuItem() {
            if (this.menus != null && this.menus.length > 0) {
                let menu = this.menus[0];
                if (this.isendNode(menu)) {
                    this.actionMenu(menu);
                } else {
                    let menu01 = menu.navigations[0];

                    if (this.isendNode(menu01)) {
                        this.actionMenu(menu01, menu);
                    } else {
                        let menu02 = menu01.navigations[0];
                        if (this.isendNode(menu02)) {
                            this.actionMenu(menu02, menu01);
                        } else {
                            let menu03 = menu02.navigations[0];
                            this.actionMenu(menu03, menu02);
                        }
                    }
                }
            }
        }, hasIcon(menu: any) {
            return menu != null && menu.icon != null && menu.icon.trim().length > 0;
        }
    }, watch: {
        plugin(newPlu) {
            this.getMenus();
        }
    }, mounted() {
        this.getMenus();
    }
})

export default class VMenusBar extends Vue {

}
</script>
<style scoped lang="scss">  .menu-img-bg {
      background: #07569B;
      height: 100%;
      padding: 3px;
  }

  .menu-nav-bar {
      // position: relative;
      //margin: 50px;
      width: 100%;
  }

  .menu-nav-bar ul {
      list-style: none;
      margin: 0;
      padding: 0;
  }

  .menu-nav-bar ul li {
      /* Sub Menu */
      margin: 0px 5px 0px 4px;
  }

  .menu-nav-bar ul li a {
      cursor: pointer;
      display: flex;
      flex-flow: row nowrap;
   justify-content: space-between;
      color: #fff;
      font-size: 15px;
      text-align: start;
      text-decoration: none;
      font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      -webkit-transition: 0.2s linear;
      -moz-transition: 0.2s linear;
      -ms-transition: 0.2s linear;
      -o-transition: 0.2s linear;
      transition: 0.2s linear;
      padding: 10px 15px;

      span {
          margin-left: 10px;
      }
  }

  .menu-nav-bar ul li a:hover {
      color: #07569B;
      background: #fff;
      border-radius: 5px;
  }

  .menu-nav-bar ul li a .fa {
      width: 16px;
      text-align: center;
      float: right;
  }

  .menu-nav-bar ul ul {
      background: rgba(0, 0, 0, 0.2);
  }

  .menu-nav-bar ul li ul li a {
      cursor: pointer;
      padding: 10px;
      font-size: 15px;
  }

  .menu-nav-bar ul li ul li a:hover {
      cursor: pointer;
      border-radius: 5px;
      padding: 10px;
  }
</style>