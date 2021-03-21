import { createTaskQueue } from "../Misc"

const taskQueue = createTaskQueue()

export const render = (element, dom) => {
  // console.log(element)
  // console.log(dom)
  /**
   * 1.向任务队列中添加角色
   * 2.指定在浏览器空闲时执行任务
   */

  /**
   * 任务就是通过 vdom 对象 构建 fiber 对象
   */

  taskQueue.push({
    dom,
    props: { children: element}
  })

  console.log(taskQueue.pop())
}