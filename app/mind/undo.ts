import * as Diff from 'diff'

type MinimizeDiff = string | number
type Change = Diff.Change

class Undo {
  undos: MinimizeDiff[][]
  redos: MinimizeDiff[][]

  constructor() {
    this.undos = []
    this.redos = []
  }

  recordDiff(oldChars: string, newChars: string) {
    const diffInfo = Diff.diffChars(oldChars, newChars)

    const minidiff = this.minimizeDiffInfo(diffInfo)

    this.undos.push(minidiff)
    this.redos = []

    return diffInfo
  }

  /**
   * 将 diff info 转换成简洁模式
   *
   * @param   {Change[]}  diffInfo
   * @return  {string}
   */
  minimizeDiffInfo(diffInfo: Change[]): MinimizeDiff[] {
    const result = diffInfo.map((info: Change) => {
      if (info.added) {
        return '+' + info.value
      }
      if(info.removed){
          return '-' + info.value
      }
      return info.count || 0
    })
    return result
  }

  undo(chars: string) {
    const diff = this.undos.pop()

    if (diff) {
      this.redos.push(diff)
      return this.unmerge(chars, diff)
    }

    return chars
  }

  redo(chars: string) {
    const diff = this.redos.pop()

    if (diff) {
      this.undos.push(diff)
      return this.merge(chars, diff)
    }

    return chars
  }

  merge(oldChars: string, diffInfo: MinimizeDiff[]) {
    let newChars = ''
    let point = 0

    for (let i = 0; i < diffInfo.length; i++){
        const info = diffInfo[i]

        if (typeof info === 'number') {
          newChars += oldChars.slice(point, point + info)
          point += info
          continue
        }

        if (typeof info == 'string') {
          if (info[0] === '+') {
            newChars += info.slice(1, info.length)
          }

          if (info[0] === '-') {
            point += info.length - 1
          }
        }
    }
    return newChars
  }

  unmerge(oldChars: string, diffInfo: MinimizeDiff[]) {
    let newChars = ''
    let point = 0

    for (let i = 0; i < diffInfo.length; i++){
        const info = diffInfo[i]

        if (typeof info === 'number') {
          newChars += oldChars.slice(point, point + info)
          point += info
          continue
        }

        if (typeof info == 'string') {
          if (info[0] === '+') {
            point += info.length - 1
          }

          if (info[0] === '-') {
            newChars += info.slice(1, info.length)
          }
        }
    }
    return newChars
  }
}

export default new Undo()
