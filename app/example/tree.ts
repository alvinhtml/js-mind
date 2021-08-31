import Mind from '../index';

const colors = ['#f2711c', '#2185d0', '#21ba45', '#b5cc18', '#00b5ad', '#fbbd08', '#6435c9', '#a333c8', '#e03997', '#a5673f']

const myTree = document.createElement('div');

myTree.id = 'my-vue-tree'
myTree.className = 'chart';

document.body.appendChild(myTree);

const tree = new Mind(myTree);

let nodes = [
  {
    "title": 'VUE',
    "type": 'circle',
    "color": '#21ba45',
    "children": {
      "left": [{
        "title": "简介",
        "type": 'rect',

        "children": [
          {
            "title": "Vue是一个MVVM框架"
          },
          {
            "title": "Vue是用于构建用户界面的渐进式框架"
          },
          {
            "title": "尤雨溪最开始想起名为 seed.js，但是npm已经被注册了，后来根据 ”view“起名为 vue"
          },
          {
            "title": "2014年由Laravel框架作者推荐后逐渐流行"
          }
        ]
      },
      {
        "title": "特点",
        "type": 'rect',

        "children": [
          {
            "title": "易用",
            "children": [
              {
                "title": "已经会了 HTML、CSS、JavaScript？即刻阅读指南开始构建应用！"
              }
            ]
          },
          {
            "title": "灵活",
            "children": [
              {
                "title": "不断繁荣的生态系统，可以在一个库和一套完整框架之间自如伸缩。"
              }
            ]
          },
          {
            "title": "高效",
            "children": [
              {
                "title": "20kB min+gzip 运行大小"
              },
              {
                "title": "超快虚拟 DOM"
              },
              {
                "title": "最省心的优化"
              }
            ]
          }
        ]
      },
      {
        "title": "Vue思想",
        "type": 'rect',

        "children": [
          {
            "title": "数据驱动"
          },
          {
            "title": "组件化"
          }
        ]
      },
      {
        "title": "Vuex",
        "type": 'rect',

      },
      {
        "title": "Vue-router",
        "type": 'rect',

      },
      {
        "title": "Vue-SSR",
        "type": 'rect',

      },
      {
        "title": "Vue-Loader",
        "type": 'rect',

      },
      {
        "title": "Vue-Cli",
        "type": 'rect',

        "children": [
          {
            "title": "通过 @vue/cli 实现的交互式的项目脚手架。"
          },
          {
            "title": "通过 @vue/cli + @vue/cli-service-global 实现的零配置原型开发。"
          },
          {
            "title": "一个运行时依赖 (@vue/cli-service)"
          },
          {
            "title": "Cli",
            "children": [
              {
                "title": "CLI (@vue/cli) 是一个全局安装的 npm 包，提供了终端里的 vue 命令。它可以通过 vue create 快速搭建一个新项目，或者直接通过 vue serve 构建新想法的原型。你也可以通过 vue ui 通过一套图形化界面管理你的所有项目"
              }
            ]
          },
          {
            "title": "Cli服务",
            "children": [
              {
                "title": "CLI 服务 (@vue/cli-service) 是一个开发环境依赖。它是一个 npm 包，局部安装在每个 @vue/cli 创建的项目中。"
              },
              {
                "title": "CLI 服务是构建于 webpack 和 webpack-dev-server 之上的"
              },
              {
                "title": "加载其它 CLI 插件的核心服务；"
              },
              {
                "title": "一个针对绝大部分应用优化过的内部的 webpack 配置；"
              },
              {
                "title": "项目内部的 vue-cli-service 命令，提供 serve、build 和 inspect 命令"
              }
            ]
          },
          {
            "title": "Cli插件",
            "children": [
              {
                "title": "CLI 插件是向你的 Vue 项目提供可选功能的 npm 包，例如 Babel/TypeScript 转译、ESLint 集成、单元测试和 end-to-end 测试等。Vue CLI 插件的名字以 @vue/cli-plugin- (内建插件) 或 vue-cli-plugin- (社区插件) 开头，非常容易使用。"
              },
              {
                "title": "当你在项目内部运行 vue-cli-service 命令时，它会自动解析并加载 package.json 中列出的所有 CLI 插件。"
              },
              {
                "title": "插件可以作为项目创建过程的一部分，或在后期加入到项目中。它们也可以被归成一组可复用的 preset"
              }
            ]
          }
        ]
      },
      {
        "title": "Vue-Devtools",
        "type": 'rect',

      },
      {
        "title": "class-component",
        "type": 'rect',

      }],
      "right": [

        {
          "title": "Vue API",
          "type": 'rect',

          "children": [
            {
              "title": "应用API",
              "children": [
                {
                  "title": "component",
                  "children": [
                    {
                      "title": "注册或检索全局组件。注册还会使用给定的 name 参数自动设置组件的 name。"
                    }
                  ]
                },
                {
                  "title": "config",
                  "children": [
                    {
                      "title": "包含应用配置的对象。"
                    }
                  ]
                },
                {
                  "title": "directive",
                  "children": [
                    {
                      "title": "注册或检索全局指令。"
                    }
                  ]
                },
                {
                  "title": "mixin",
                  "children": [
                    {
                      "title": "在整个应用范围内应用混入。一旦注册，它们就可以在当前的应用中任何组件模板内使用它。插件作者可以使用此方法将自定义行为注入组件。不建议在应用代码中使用。"
                    }
                  ]
                },
                {
                  "title": "mount",
                  "children": [
                    {
                      "title": "将应用实例的根组件挂载在提供的 DOM 元素上"
                    }
                  ]
                },
                {
                  "title": "provide",
                  "children": [
                    {
                      "title": "设置一个可以被注入到应用范围内所有组件中的值。组件应该使用 inject 来接收 provide 的值。"
                    },
                    {
                      "title": "从 provide/inject 的角度来看，可以将应用程序视为根级别的祖先，而根组件是其唯一的子级。"
                    },
                    {
                      "title": "该方法不应该与 provide 组件选项或组合式 API 中的 provide 方法混淆。虽然它们也是相同的 provide/inject 机制的一部分，但是是用来配置组件 provide 的值而不是应用 provide 的值。"
                    },
                    {
                      "title": "通过应用提供值在写插件时尤其有用，因为插件一般不能使用组件提供值。这是使用 globalProperties 的替代选择。"
                    }
                  ]
                },
                {
                  "title": "unmount",
                  "children": [
                    {
                      "title": "在提供的 DOM 元素上卸载应用实例的根组件。"
                    }
                  ]
                },
                {
                  "title": "use",
                  "children": [
                    {
                      "title": "安装 Vue.js 插件。如果插件是一个对象，它必须暴露一个 install 方法。如果它本身是一个函数，它将被视为安装方法。"
                    },
                    {
                      "title": "该安装方法将以应用实例作为第一个参数被调用。传给 use 的其他 options 参数将作为后续参数传入该安装方法。"
                    },
                    {
                      "title": "当在同一个插件上多次调用此方法时，该插件将仅安装一次"
                    }
                  ]
                }
              ]
            },
            {
              "title": "全局API",
              "children": [
                {
                  "title": "createApp",
                  "children": [
                    {
                      "title": "返回一个提供应用上下文的应用实例。应用实例挂载的整个组件树共享同一个上下文。"
                    }
                  ]
                },
                {
                  "title": "h",
                  "children": [
                    {
                      "title": "返回一个”虚拟节点“，通常缩写为 VNode：一个普通对象，其中包含向 Vue 描述它应在页面上渲染哪种节点的信息，包括所有子节点的描述。它的目的是用于手动编写的渲染函数"
                    }
                  ]
                },
                {
                  "title": "defineComponent",
                  "children": [
                    {
                      "title": "从实现上看，defineComponent 只返回传递给它的对象。但是，就类型而言，返回的值有一个合成类型的构造函数，用于手动渲染函数、TSX 和 IDE 工具支持。"
                    }
                  ]
                },
                {
                  "title": "defineAsyncComponent",
                  "children": [
                    {
                      "title": "创建一个只有在需要时才会加载的异步组件"
                    }
                  ]
                },
                {
                  "title": "resolveComponent",
                  "children": [
                    {
                      "title": "如果在当前应用实例中可用，则允许按名称解析 component。返回一个 Component。如果没有找到，则返回 undefined。"
                    }
                  ]
                },
                {
                  "title": "resolveDynamicComponent",
                  "children": [
                    {
                      "title": "允许使用与 <component :is=\"\"> 相同的机制来解析一个 component。返回已解析的 Component 或新创建的 VNode，其中组件名称作为节点标签。如果找不到 Component，将发出警告。"
                    }
                  ]
                },
                {
                  "title": "withDirectives",
                  "children": [
                    {
                      "title": "允许将指令应用于 VNode。返回一个包含应用指令的 VNode。"
                    }
                  ]
                },
                {
                  "title": "createRenderer",
                  "children": [
                    {
                      "title": "createRenderer 函数接受两个泛型参数： HostNode 和 HostElement，对应于宿主环境中的 Node 和 Element 类型。"
                    }
                  ]
                },
                {
                  "title": "nextTick",
                  "children": [
                    {
                      "title": "将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它"
                    }
                  ]
                }
              ]
            },
            {
              "title": "options",
              "children": [
                {
                  "title": "Data",
                  "children": [
                    {
                      "title": "data",
                      "children": [
                        {
                          "title": "返回组件实例的 data 对象的函数"
                        }
                      ]
                    },
                    {
                      "title": "props",
                      "children": [
                        {
                          "title": "props 可以是数组或对象，用于接收来自父组件的数据。props 可以是简单的数组，或者使用对象作为替代，对象允许配置高阶选项，如类型检测、自定义验证和设置默认值。"
                        }
                      ]
                    },
                    {
                      "title": "computed",
                      "children": [
                        {
                          "title": "计算属性将被混入到组件实例中。所有 getter 和 setter 的 this 上下文自动地绑定为组件实例。"
                        }
                      ]
                    },
                    {
                      "title": "methods",
                      "children": [
                        {
                          "title": "methods 将被混入到组件实例中。可以直接通过 VM 实例访问这些方法，或者在指令表达式中使用。方法中的 this 自动绑定为组件实例。"
                        }
                      ]
                    },
                    {
                      "title": "watch",
                      "children": [
                        {
                          "title": "一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象"
                        }
                      ]
                    },
                    {
                      "title": "emits",
                      "children": [
                        {
                          "title": "emits 可以是数组或对象，从组件触发自定义事件，emits 可以是简单的数组，或者对象作为替代，允许配置和事件验证"
                        }
                      ]
                    }
                  ]
                },
                {
                  "title": "DOM",
                  "children": [
                    {
                      "title": "template",
                      "children": [
                        {
                          "title": "一个字符串模板作为 component 实例的标识使用。模板将会替换挂载的元素。挂载元素的内容都将被忽略，除非模板的内容有分发插槽。"
                        }
                      ]
                    },
                    {
                      "title": "render",
                      "children": [
                        {
                          "title": "字符串模板的另一种选择，允许你充分利用 JavaScript 的编程功能。"
                        }
                      ]
                    }
                  ]
                },
                {
                  "title": "生命周期",
                  "children": [
                    {
                      "title": "beforeCreate->setup()",
                      "children": [
                        {
                          "title": "在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用"
                        }
                      ]
                    },
                    {
                      "title": "created->setup()",
                      "children": [
                        {
                          "title": "在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el property 目前尚不可用"
                        }
                      ]
                    },
                    {
                      "title": "beforeMount->onBeforeMount",
                      "children": [
                        {
                          "title": "在挂载开始之前被调用：相关的 render 函数首次被调用。"
                        },
                        {
                          "title": "该钩子在服务器端渲染期间不被调用。"
                        }
                      ]
                    },
                    {
                      "title": "mounted->onMounted",
                      "children": [
                        {
                          "title": "实例被挂载后调用，这时 Vue.createApp({}).mount() 被新创建的 vm.$el 替换了。如果根实例挂载到了一个文档内的元素上，当 mounted 被调用时 vm.$el 也在文档内。"
                        },
                        {
                          "title": "注意 mounted 不会保证所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以在 mounted 内部使用 vm.$nextTick"
                        },
                        {
                          "title": "该钩子在服务器端渲染期间不被调用"
                        }
                      ]
                    },
                    {
                      "title": "beforeUpdate->onBeforeUpdate",
                      "children": [
                        {
                          "title": "数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。"
                        },
                        {
                          "title": "该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行"
                        }
                      ]
                    },
                    {
                      "title": "updated->onUpdated",
                      "children": [
                        {
                          "title": "由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。"
                        },
                        {
                          "title": "当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或侦听器取而代之。"
                        },
                        {
                          "title": "注意，updated 不会保证所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以在 updated 里使用 vm.$nextTick"
                        },
                        {
                          "title": "该钩子在服务器端渲染期间不被调用"
                        }
                      ]
                    },
                    {
                      "title": "activated",
                      "children": [
                        {
                          "title": "被 keep-alive 缓存的组件激活时调用。"
                        },
                        {
                          "title": "该钩子在服务器端渲染期间不被调用。"
                        }
                      ]
                    },
                    {
                      "title": "deactivated",
                      "children": [
                        {
                          "title": "被 keep-alive 缓存的组件停用时调用。"
                        },
                        {
                          "title": "该钩子在服务器端渲染期间不被调用。"
                        }
                      ]
                    },
                    {
                      "title": "beforeUnmount(3.0)->onBeforeUnmount",
                      "children": [
                        {
                          "title": "在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。"
                        },
                        {
                          "title": "该钩子在服务器端渲染期间不被调用。"
                        }
                      ]
                    },
                    {
                      "title": "unmounted(3.0)->onUnmounted",
                      "children": [
                        {
                          "title": "卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。"
                        },
                        {
                          "title": "该钩子在服务器端渲染期间不被调用。"
                        }
                      ]
                    },
                    {
                      "title": "errorCaptured->onErrorCaptured",
                      "children": [
                        {
                          "title": "当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。"
                        }
                      ]
                    },
                    {
                      "title": "renderTracked(3.0)->onRenderTracked",
                      "children": [
                        {
                          "title": "跟踪虚拟 DOM 重新渲染时调用。钩子接收 debugger event 作为参数。此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。"
                        }
                      ]
                    },
                    {
                      "title": "renderTriggered(3.0)->onRenderTriggered",
                      "children": [
                        {
                          "title": "当虚拟 DOM 重新渲染为 triggered.Similarly 为renderTracked，接收 debugger event 作为参数。此事件告诉你是什么操作触发了重新渲染，以及该操作的目标对象和键。"
                        }
                      ]
                    }
                  ]
                },
                {
                  "title": "选项/资源",
                  "children": [
                    {
                      "title": "directives",
                      "children": [
                        {
                          "title": "包含组件实例可用指令的哈希表。"
                        }
                      ]
                    },
                    {
                      "title": "components",
                      "children": [
                        {
                          "title": "包含组件实例可用组件的哈希表。"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "title": "实例property",
              "children": [
                {
                  "title": "$data",
                  "children": [
                    {
                      "title": "组件实例观察的数据对象。组件实例代理了对其 data 对象 property 的访问。"
                    }
                  ]
                },
                {
                  "title": "$props",
                  "children": [
                    {
                      "title": "当前组件接收到的 props 对象。组件实例代理了对其 props 对象 property 的访问。"
                    }
                  ]
                },
                {
                  "title": "$el",
                  "children": [
                    {
                      "title": "组件实例使用的根 DOM 元素。"
                    }
                  ]
                },
                {
                  "title": "$options",
                  "children": [
                    {
                      "title": "用于当前组件实例的初始化选项"
                    }
                  ]
                },
                {
                  "title": "$parent",
                  "children": [
                    {
                      "title": "父实例，如果当前实例有的话。"
                    }
                  ]
                },
                {
                  "title": "$root",
                  "children": [
                    {
                      "title": "当前组件树的根组件实例。如果当前实例没有父实例，此实例将会是其自己。"
                    }
                  ]
                },
                {
                  "title": "$slots",
                  "children": [
                    {
                      "title": "用来访问被插槽分发的内容。"
                    }
                  ]
                },
                {
                  "title": "$refs",
                  "children": [
                    {
                      "title": "一个对象，持有注册过 ref attribute 的所有 DOM 元素和组件实例。"
                    }
                  ]
                },
                {
                  "title": "$attrs",
                  "children": [
                    {
                      "title": "包含了父作用域中不作为组件 props 或自定义事件。"
                    }
                  ]
                }
              ]
            },
            {
              "title": "实例方法",
              "children": [
                {
                  "title": "$watch",
                  "children": [
                    {
                      "title": "侦听组件实例上的响应式 property 或函数计算结果的变化。"
                    }
                  ]
                },
                {
                  "title": "$emit",
                  "children": [
                    {
                      "title": "触发当前实例上的事件。附加参数都会传给监听器回调。"
                    }
                  ]
                },
                {
                  "title": "$forceUpdate",
                  "children": [
                    {
                      "title": "迫使组件实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。"
                    }
                  ]
                },
                {
                  "title": "$nextTick",
                  "children": [
                    {
                      "title": "将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。"
                    }
                  ]
                }
              ]
            },
            {
              "title": "指令",
              "children": [
                {
                  "title": "v-text",
                  "children": [
                    {
                      "title": "更新元素的 textContent。如果要更新部分的 textContent，需要使用 Mustache 插值。"
                    }
                  ]
                },
                {
                  "title": "v-html",
                  "children": [
                    {
                      "title": "更新元素的 innerHTML。注意：内容按普通 HTML 插入 - 不会作为 Vue 模板进行编译。如果试图使用 v-html 组合模板，可以重新考虑是否通过使用组件来替代。"
                    }
                  ]
                },
                {
                  "title": "v-show",
                  "children": [
                    {
                      "title": "根据表达式的真假值，切换元素的 display CSS property。"
                    },
                    {
                      "title": "当条件变化时该指令触发过渡效果。"
                    }
                  ]
                },
                {
                  "title": "v-if",
                  "children": [
                    {
                      "title": "根据表达式的真假值来有条件地渲染元素。在切换时元素及它的数据绑定 / 组件被销毁并重建。如果元素是 <template>，将提取它的内容作为条件块。"
                    },
                    {
                      "title": "当条件变化时该指令触发过渡效果。"
                    },
                    {
                      "title": "当和 v-for 一起使用时，v-if 的优先级比 v-for 更高"
                    }
                  ]
                },
                {
                  "title": "v-else",
                  "children": [
                    {
                      "title": "为 v-if 或者 v-else-if 添加“else 块”。"
                    }
                  ]
                },
                {
                  "title": "v-else-if",
                  "children": [
                    {
                      "title": "表示 v-if 的“else if 块”。可以链式调用。"
                    }
                  ]
                },
                {
                  "title": "v-for",
                  "children": [
                    {
                      "title": "基于源数据多次渲染元素或模板块"
                    }
                  ]
                },
                {
                  "title": "v-on",
                  "children": [
                    {
                      "title": ".stop - 调用 event.stopPropagation()。"
                    },
                    {
                      "title": ".prevent - 调用 event.preventDefault()。"
                    },
                    {
                      "title": ".capture - 添加事件侦听器时使用 capture 模式。"
                    },
                    {
                      "title": ".self - 只当事件是从侦听器绑定的元素本身触发时才触发回调。"
                    },
                    {
                      "title": ".{keyAlias} - 仅当事件是从特定键触发时才触发回调。"
                    },
                    {
                      "title": ".once - 只触发一次回调。"
                    },
                    {
                      "title": ".left - 只当点击鼠标左键时触发。"
                    },
                    {
                      "title": ".right - 只当点击鼠标右键时触发。"
                    },
                    {
                      "title": ".middle - 只当点击鼠标中键时触发。"
                    },
                    {
                      "title": ".passive - { passive: true } 模式添加侦听器"
                    },
                    {
                      "title": "绑定事件监听器。事件类型由参数指定。"
                    }
                  ]
                },
                {
                  "title": "v-bind",
                  "children": [
                    {
                      "title": "动态地绑定一个或多个 attribute，或一个组件 prop 到表达式。"
                    }
                  ]
                },
                {
                  "title": "v-model",
                  "children": [
                    {
                      "title": ".lazy - 监听 change 而不是 input 事件"
                    },
                    {
                      "title": ".number - 输入字符串转为有效的数字"
                    },
                    {
                      "title": ".trim - 输入首尾空格过滤"
                    },
                    {
                      "title": "在表单控件或者组件上创建双向绑定。"
                    }
                  ]
                },
                {
                  "title": "v-slot",
                  "children": [
                    {
                      "title": "提供具名插槽或需要接收 prop 的插槽。"
                    }
                  ]
                },
                {
                  "title": "v-pre",
                  "children": [
                    {
                      "title": "跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。"
                    }
                  ]
                },
                {
                  "title": "v-cloak",
                  "children": [
                    {
                      "title": "这个指令保持在元素上直到关联组件实例结束编译。和 CSS 规则如 [v-cloak] { display: none } 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到组件实例准备完毕。"
                    }
                  ]
                },
                {
                  "title": "v-once",
                  "children": [
                    {
                      "title": "只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。"
                    }
                  ]
                },
                {
                  "title": "v-is",
                  "children": [
                    {
                      "title": "在 DOM 内模板使用时，模板受原生 HTML 解析规则的约束"
                    }
                  ]
                }
              ]
            },
            {
              "title": "特殊指令",
              "children": [
                {
                  "title": "key",
                  "children": [
                    {
                      "title": "key 的特殊 attribute 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除/销毁 key 不存在的元素。"
                    },
                    {
                      "title": "有相同父元素的子元素必须有独特的 key。重复的 key 会造成渲染错误。"
                    }
                  ]
                },
                {
                  "title": "ref",
                  "children": [
                    {
                      "title": "ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例"
                    }
                  ]
                },
                {
                  "title": "is",
                  "children": [
                    {
                      "title": "使用动态组件。"
                    }
                  ]
                }
              ]
            },
            {
              "title": "内置组件",
              "children": [
                {
                  "title": "component",
                  "children": [
                    {
                      "title": "渲染一个“元组件”为动态组件。依 is 的值，来决定哪个组件被渲染。is 的值是一个字符串，它既可以是 HTML 标签名称也可以是组件名称。"
                    }
                  ]
                },
                {
                  "title": "transition",
                  "children": [
                    {
                      "title": "<transition> 元素作为单个元素/组件的过渡效果。<transition> 只会把过渡效果应用到其包裹的内容上，而不会额外渲染 DOM 元素，也不会出现在可被检查的组件层级中。"
                    }
                  ]
                },
                {
                  "title": "transition-group",
                  "children": [
                    {
                      "title": "<transition-group>提供多个元素/组件的过渡效果。默认情况下，它不呈现包装DOM元素，但可以通过tag属性定义一个。"
                    },
                    {
                      "title": "注意，每个 <transition-group> 的子节点必须有独立的 key，动画才能正常工作"
                    }
                  ]
                },
                {
                  "title": "keep-alive",
                  "children": [
                    {
                      "title": "<keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 <transition> 相似，<keep-alive> 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。"
                    },
                    {
                      "title": "当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。"
                    },
                    {
                      "title": "主要用于保留组件状态或避免重新渲染。"
                    }
                  ]
                },
                {
                  "title": "slot",
                  "children": [
                    {
                      "title": "<slot> 元素作为组件模板之中的内容分发插槽。<slot> 元素自身将被替换。"
                    }
                  ]
                },
                {
                  "title": "teleport",
                  "children": [
                    {
                      "title": "允许我们控制在 DOM 中哪个父节点下渲染了 HTML，而不必求助于全局状态或将其拆分为两个组件。"
                    }
                  ]
                }
              ]
            },
            {
              "title": "响应式API",
              "children": [
                {
                  "title": "响应式基础API",
                  "children": [
                    {
                      "title": "reactive",
                      "children": [
                        {
                          "title": "返回对象的响应式副本"
                        },
                        {
                          "title": "响应式转换是“深层”的——它影响所有嵌套 property。在基于 ES2015 Proxy 的实现中，返回的 proxy 是不等于原始对象的。建议只使用响应式 proxy，避免依赖原始对象。"
                        }
                      ]
                    },
                    {
                      "title": "readonly",
                      "children": [
                        {
                          "title": "获取一个对象 (响应式或纯对象) 或 ref 并返回原始 proxy 的只读 proxy。只读 proxy 是深层的：访问的任何嵌套 property 也是只读的。"
                        }
                      ]
                    },
                    {
                      "title": "isProxy",
                      "children": [
                        {
                          "title": "检查对象是否是由 reactive 或 readonly 创建的 proxy。"
                        }
                      ]
                    },
                    {
                      "title": "isReactive",
                      "children": [
                        {
                          "title": "检查对象是否是 reactive创建的响应式 proxy。"
                        }
                      ]
                    },
                    {
                      "title": "isReadonly",
                      "children": [
                        {
                          "title": "检查对象是否是由readonly创建的只读 proxy。"
                        }
                      ]
                    },
                    {
                      "title": "toRaw",
                      "children": [
                        {
                          "title": "返回 reactive 或 readonly proxy 的原始对象。这是一个转义口，可用于临时读取而不会引起 proxy 访问/跟踪开销，也可用于写入而不会触发更改"
                        }
                      ]
                    },
                    {
                      "title": "markRaw",
                      "children": [
                        {
                          "title": "标记一个对象，使其永远不会转换为 proxy。返回对象本身。"
                        }
                      ]
                    },
                    {
                      "title": "shallowReactive",
                      "children": [
                        {
                          "title": "创建一个响应式 proxy，跟踪其自身 property 的响应性，但不执行嵌套对象的深度响应式转换 (暴露原始值)。"
                        }
                      ]
                    },
                    {
                      "title": "shallowReadonly",
                      "children": [
                        {
                          "title": "创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。"
                        }
                      ]
                    }
                  ]
                },
                {
                  "title": "Refs",
                  "children": [
                    {
                      "title": "ref",
                      "children": [
                        {
                          "title": "接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property .value。"
                        }
                      ]
                    },
                    {
                      "title": "unref",
                      "children": [
                        {
                          "title": "如果参数为 ref，则返回内部值，否则返回参数本身。这是 val = isRef(val) ? val.value : val。"
                        }
                      ]
                    },
                    {
                      "title": "toRef",
                      "children": [
                        {
                          "title": "可以用来为源响应式对象上的 property 新创建一个 ref。然后可以将 ref 传递出去，从而保持对其源 property 的响应式连接。"
                        }
                      ]
                    },
                    {
                      "title": "toRefs",
                      "children": [
                        {
                          "title": "将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的ref。"
                        }
                      ]
                    },
                    {
                      "title": "isRef",
                      "children": [
                        {
                          "title": "检查值是否是ref对象。"
                        }
                      ]
                    },
                    {
                      "title": "customRef",
                      "children": [
                        {
                          "title": "创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。它需要一个工厂函数，该函数接收 track 和 trigger 函数作为参数，并应返回一个带有 get 和 set 的对象。"
                        }
                      ]
                    },
                    {
                      "title": "shallowRef",
                      "children": [
                        {
                          "title": "创建一个 ref，它跟踪自己的 .value 更改，但不会使其值成为响应式的。"
                        }
                      ]
                    },
                    {
                      "title": "triggerRef",
                      "children": [
                        {
                          "title": "手动执行与 shallowRef 关联的任何副作用。"
                        }
                      ]
                    }
                  ]
                },
                {
                  "title": "Computed和watch",
                  "children": [
                    {
                      "title": "computed",
                      "children": [
                        {
                          "title": "使用 getter 函数，并为从 getter 返回的值返回一个不变的响应式 ref 对象。"
                        }
                      ]
                    },
                    {
                      "title": "watchEffect",
                      "children": [
                        {
                          "title": "在响应式地跟踪其依赖项时立即运行一个函数，并在更改依赖项时重新运行它。"
                        }
                      ]
                    },
                    {
                      "title": "watch",
                      "children": [
                        {
                          "title": "watch API 与选项式 API this.$watch (以及相应的 watch 选项) 完全等效。watch 需要侦听特定的数据源，并在单独的回调函数中执行副作用。默认情况下，它也是惰性的——即回调仅在侦听源发生更改时调用。"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "title": "组合式API",
              "children": [
                {
                  "title": "setup",
                  "children": [
                    {
                      "title": "一个组件选项，在创建组件之前执行，一旦 props 被解析，并作为组合式 API 的入口点"
                    },
                    {
                      "title": "props",
                      "children": [
                        {
                          "title": "setup 函数中的第一个参数是 props。正如在一个标准组件中所期望的那样，setup 函数中的 props 是响应式的，当传入新的 prop 时，它将被更新。"
                        }
                      ]
                    },
                    {
                      "title": "context",
                      "children": [
                        {
                          "title": "传递给 setup 函数的第二个参数是 context。context 是一个普通的 JavaScript 对象，它暴露三个组件的 property"
                        }
                      ]
                    }
                  ]
                },
                {
                  "title": "生命周期钩子"
                }
              ]
            }
          ]
        }
      ]
    }
  }
]

tree.init(nodes, {
  type: 'tree',
  orient: 'horizontal',
  spaceWidth: 208,
  spaceHeight: 60,
  lineSpace: 8,
  nodeWidth: 120,
  nodeHeight: 30
});

tree.addEventListener('click', (e: any) => {
  console.log('click e: ', e)
})
