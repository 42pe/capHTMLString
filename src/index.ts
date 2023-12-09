type TProcessResponse = { content: string; length: number }

const processTextNode: (
  textNode: ChildNode,
  cap: number
) => TProcessResponse = (textNode, cap) => {
  // TODO: This should take into account the escaped characters such as "\n" or HTMLEntities such as "&nbsp;"
  if (textNode.textContent && textNode.textContent.length > cap) {
    textNode.textContent = textNode.textContent.substring(0, cap)
  }

  return {
    content: textNode.textContent ?? "",
    length: (textNode.textContent || "").length,
  }
}

const processHTML: (
  domElement: HTMLElement,
  cap: number
) => TProcessResponse = (domElement, cap) => {
  // if it is a text element, cap the textcontent as needed and return
  if (domElement.nodeType === 3) {
    return processTextNode(domElement, cap)
  }
  // not a text node...
  // if text doesn't exceed cap, then just return
  if (domElement.innerText.length <= cap) {
    return {
      content: domElement.outerHTML,
      length: domElement.innerText.length,
    }
  }
  // not a text node...
  // does exceed cap
  // then go through all nodes until character limit is reached
  let charsRemaining = cap
  const newInnerHTML = Object.values(domElement.childNodes).reduce(
    (acc, childElement) => {
      if (charsRemaining <= 0) {
        return acc
      }

      const { content: childContent, length: childLength } =
        childElement.nodeType === 3
          ? processTextNode(childElement, cap)
          : processHTML(childElement as HTMLElement, charsRemaining)
      charsRemaining -= childLength
      return acc + childContent
    },
    ""
  )

  const newElement = document.createElement(domElement.tagName)
  newElement.innerHTML = newInnerHTML

  return { content: newElement.outerHTML, length: domElement.innerText.length }
}

export const capHTMLString: (
  htmlString: string,
  cap: number,
  after?: string
) => string = (htmlString, cap, after = "...") => {
  if (htmlString.length === 0) {
    return htmlString
  }
  const divToProcess = document.createElement("div")
  divToProcess.innerHTML = htmlString

  const { content } = processHTML(divToProcess, cap)

  const div2 = document.createElement("div")
  div2.innerHTML = content

  return (
    div2.querySelector("div")?.innerHTML +
    (htmlString.length > cap ? after : "")
  )
}
