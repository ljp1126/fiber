import { createTaskQueue } from "../Misc"

const taskQueue = createTaskQueue()

const subTask = null;

const getFirstTask = () => {}

const executeTask = fiber => {}

const workLoop = deadline => {
  /**
   * 如果子任务不存在 就去获取子任务
   */
  if (!subTask) {
    subTask = getFirstTask()
  }

  /**
   * 如果任务存在并且浏览器有空余时间就调用
   * executeTask 方法执行任务 接受任务 返回新的任务
   */

  while (subTask && deadline.timeRemaining() > 1) {
    executeTask(subTask)
  }
}

const performTask = deadline => {
  workLoop(deadline)
  /**
   * 判断任务是否存在
   * 判断任务队列中是否还有任务没用执行
   * 再一次告诉浏览器在空闲的时间执行任务
   */
  if (subTask || taskQueue.isEmpty()) {
    requestIdleCallBack(performTask)
  }
}

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

  /**
   * 在浏览器空闲时候执行
   */
  requestIdleCallBack(performTask)
}