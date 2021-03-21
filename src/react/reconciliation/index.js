import { createTaskQueue, arrified, createStateNode, getTag } from "../Misc"

const taskQueue = createTaskQueue()

let subTask = null;

const getFirstTask = () => {
  /**
   * 从任务队列中获取任务
   */
  const task = taskQueue.pop()
  // console.log(task)
  return {
    props: task.props,
    stateNode: task.dom,
    tag: "host_root",
    effects: [],
    child: null
  }
}

const reconcileChildren = (fiber, children) => {
  /**
   * children 可能是对象 也可能是数组
   * 将children 转换成数组
   */

  const arrifiedChildren = arrified(children)
  let index = 0
  let numberOfElements = arrifiedChildren.length
  let element = null
  let newFiber = null
  let prevFiber = null

  while (index < numberOfElements) {
    element = arrifiedChildren[index]
    newFiber = {
      type: element.type,
      props: element.props,
      tag: getTag(element), // "host_component"
      effects: [],
      effectTag: "placement",
      stateNode: null,
      parent: fiber
    }

    /**
     * 为fiber节点添加DOM对象或者组件实例对象
     */
    newFiber.stateNode = createStateNode(newFiber)

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevFiber.sibling = newFiber
    }

    prevFiber = newFiber

    index++
  }

}

const executeTask = fiber => {
  reconcileChildren(fiber, fiber.props.children)
  if (fiber.child) {
    return fiber.child
  }

  let currentExecutelyFiber = fiber

  while (currentExecutelyFiber.parent) {
    if (currentExecutelyFiber.sibling) {
      return fiber.sibling
    }
    currentExecutelyFiber = currentExecutelyFiber.parent
  }

  
  console.log(fiber)
}

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
    requestIdleCallback(performTask)
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
  requestIdleCallback(performTask)
}